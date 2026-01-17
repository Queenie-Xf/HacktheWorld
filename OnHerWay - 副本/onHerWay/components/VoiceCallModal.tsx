
import React, { useEffect, useRef, useState } from 'react';
import { sendMessageToMentor } from '../services/geminiService';

interface VoiceCallModalProps {
  onClose: (result: {
    transcriptionHistory: string[];
    reason: 'declined' | 'ended' | 'error';
  }) => void;
}

// Type definition for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'processing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [currentMentorText, setCurrentMentorText] = useState<string | null>(null); // Keep for full text reference if needed
  const [mentorSentences, setMentorSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [currentUserText, setCurrentUserText] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const transcriptionRef = useRef<string[]>([]);
  const conversationHistoryRef = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountedRef = useRef(true);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after each sentence to process
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          setTextInput(interimTranscript);
        }

        if (finalTranscript) {
          setTextInput(finalTranscript);
          handleUserMessage(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          setIsVoiceMode(false);
        }
      };

      recognition.onend = () => {
        // If we are still in listening mode and voice mode is active, restart
        if (mountedRef.current && status === 'listening' && isVoiceMode) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or error
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Web Speech API not supported");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synthesisRef.current.cancel();
    };
  }, [status, isVoiceMode]);

  // Handle status changes for voice
  useEffect(() => {
    if (!recognitionRef.current || !isVoiceMode) return;

    if (status === 'listening') {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Ignore error if already started
      }
    } else {
      recognitionRef.current.stop();
    }
  }, [status, isVoiceMode]);

  const splitIntoSentences = (text: string): string[] => {
    const MAX_CHARS = 35;

    // First split by punctuation
    const rawSentences = text.split(/([。！？；.?!;，,、：:])/)
      .reduce((acc: string[], part, i) => {
        if (i % 2 === 1) {
          if (acc.length > 0) acc[acc.length - 1] += part;
        } else if (part.trim()) {
          acc.push(part);
        }
        return acc;
      }, []);

    // Then merge short sentences and split long ones at punctuation
    const result: string[] = [];
    let buffer = '';

    for (const sentence of rawSentences) {
      const combined = buffer + sentence;

      if (combined.length <= MAX_CHARS) {
        // Can fit, add to buffer
        buffer = combined;
      } else if (buffer.length > 0) {
        // Push buffer first, then handle current sentence
        result.push(buffer);
        buffer = '';

        if (sentence.length <= MAX_CHARS) {
          buffer = sentence;
        } else {
          // Sentence itself is too long, split at last punctuation within limit
          let remaining = sentence;
          while (remaining.length > MAX_CHARS) {
            // Find last punctuation within MAX_CHARS
            const chunk = remaining.slice(0, MAX_CHARS);
            const lastPuncIdx = Math.max(
              chunk.lastIndexOf('，'),
              chunk.lastIndexOf(','),
              chunk.lastIndexOf('、'),
              chunk.lastIndexOf('；'),
              chunk.lastIndexOf('：'),
              chunk.lastIndexOf(':')
            );

            if (lastPuncIdx > 0) {
              result.push(remaining.slice(0, lastPuncIdx + 1));
              remaining = remaining.slice(lastPuncIdx + 1);
            } else {
              // No punctuation found, hard cut at MAX_CHARS
              result.push(remaining.slice(0, MAX_CHARS));
              remaining = remaining.slice(MAX_CHARS);
            }
          }
          if (remaining.trim()) {
            buffer = remaining;
          }
        }
      } else {
        // Buffer is empty, sentence is too long
        let remaining = sentence;
        while (remaining.length > MAX_CHARS) {
          const chunk = remaining.slice(0, MAX_CHARS);
          const lastPuncIdx = Math.max(
            chunk.lastIndexOf('，'),
            chunk.lastIndexOf(','),
            chunk.lastIndexOf('、'),
            chunk.lastIndexOf('；'),
            chunk.lastIndexOf('：'),
            chunk.lastIndexOf(':')
          );

          if (lastPuncIdx > 0) {
            result.push(remaining.slice(0, lastPuncIdx + 1));
            remaining = remaining.slice(lastPuncIdx + 1);
          } else {
            result.push(remaining.slice(0, MAX_CHARS));
            remaining = remaining.slice(MAX_CHARS);
          }
        }
        if (remaining.trim()) {
          buffer = remaining;
        }
      }
    }

    // Push any remaining buffer
    if (buffer.trim()) {
      result.push(buffer);
    }

    return result;
  };

  const playResponse = (text: string) => {
    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) sentences.push(text); // Fallback

    setMentorSentences(sentences);
    setCurrentSentenceIndex(0);
    setIsAutoPlaying(true);

    if (isVoiceMode) {
      // Stop recognition while speaking
      if (recognitionRef.current) recognitionRef.current.stop();
      synthesisRef.current.cancel();

      let idx = 0;
      const speakNext = () => {
        if (idx >= sentences.length) {
          if (mountedRef.current) {
            setIsAutoPlaying(false);
            setStatus('listening');
          }
          return;
        }

        // Only create utterance when needed to avoid OS limits
        const utterance = new SpeechSynthesisUtterance(sentences[idx]);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;

        utterance.onstart = () => {
          if (mountedRef.current) setCurrentSentenceIndex(idx);
        };

        utterance.onend = () => {
          idx++;
          speakNext();
        };

        utterance.onerror = (e) => {
          console.error("TTS Error", e);
          idx++; // Skip error sentence
          speakNext();
        };

        synthesisRef.current.speak(utterance);
      };

      speakNext();
    } else {
      // Text mode: use simple interval-based approach
      // Clear any existing timer
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }

      const scheduleNext = (nextIdx: number) => {
        autoPlayTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;

          // Check if we should continue auto-playing
          setIsAutoPlaying(stillPlaying => {
            if (!stillPlaying) return false;

            if (nextIdx < sentences.length) {
              setCurrentSentenceIndex(nextIdx);
              scheduleNext(nextIdx + 1);
            } else {
              // Finished all sentences
              setTimeout(() => {
                if (mountedRef.current) {
                  setStatus('listening');
                }
              }, 1000);
              return false;
            }
            return true;
          });
        }, 2000);
      };

      // Schedule the second sentence (first is already shown)
      scheduleNext(1);
    }
  };

  const handleClose = () => {
    synthesisRef.current.cancel();
    const reason = status === 'error' ? 'error' : status === 'idle' ? 'declined' : 'ended';
    onClose({ transcriptionHistory: transcriptionRef.current, reason });
  };

  const startSession = async (useVoice: boolean) => {
    setIsVoiceMode(useVoice);
    setStatus('connecting');
    setErrorMessage(null);

    try {
      if (useVoice) {
        // Check mic permission
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPermission('granted');
        } catch (e) {
          console.error("Mic access denied");
          setMicPermission('denied');
          setIsVoiceMode(false); // Fallback to text
        }
      }

      setStatus('listening');
      const intro = "你好！我可以帮你什么？";
      setCurrentMentorText(intro);
      transcriptionRef.current.push(`Mentor: ${intro}`);
      conversationHistoryRef.current.push(`Mentor: ${intro}`);

      if (useVoice) {
        setStatus('speaking'); // Temporarily speaking to play intro
        playResponse(intro);
      } else {
        // In text mode, also play response (it simulates reading)
        playResponse(intro);
      }

    } catch (e: any) {
      console.error(e);
      setStatus('error');
      setErrorMessage("启动失败，请重试");
    }
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;

    // Stop auto-playing and TTS when user sends a message (interrupt)
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    synthesisRef.current.cancel();

    // Add user message
    transcriptionRef.current.push(`User: ${message}`);
    conversationHistoryRef.current.push(`User: ${message}`);
    setCurrentUserText(message);
    setTextInput('');
    setStatus('processing');

    try {
      // Call AI
      const response = await sendMessageToMentor(message, conversationHistoryRef.current, false);

      if (!mountedRef.current) return;

      const mentorText = response.empatheticResponse;
      transcriptionRef.current.push(`Mentor: ${mentorText}`);
      conversationHistoryRef.current.push(`Mentor: ${mentorText}`);
      setCurrentMentorText(mentorText);

      setStatus('speaking');
      playResponse(mentorText);
    } catch (e) {
      console.error(e);
      setStatus('listening');
    }
  };

  const sendTextMessage = () => {
    handleUserMessage(textInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    // User interaction pauses auto-play
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null || mentorSentences.length === 0) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && currentSentenceIndex < mentorSentences.length - 1) {
        // Swipe up - next sentence
        setCurrentSentenceIndex(prev => prev + 1);
      } else if (deltaY < 0 && currentSentenceIndex > 0) {
        // Swipe down - previous sentence
        setCurrentSentenceIndex(prev => prev - 1);
      }
    }
    setTouchStartY(null);
  };

  // Wheel handler for desktop scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (mentorSentences.length === 0) return;

    // Pause auto-play on user interaction
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (e.deltaY > 30 && currentSentenceIndex < mentorSentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else if (e.deltaY < -30 && currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  // Particle Animation (Keep existing visual logic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      size: number; color: string;
    }[] = [];

    const colors = ['#FDD140', '#9FD2E3', '#F36223'];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(15, 14, 23, 0.3)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      if (status === 'listening' || status === 'speaking' || status === 'processing') {
         const spawnCount = status === 'speaking' ? 4 : 2;
         for (let i = 0; i < spawnCount; i++) {
           const angle = Math.random() * Math.PI * 2;
           const speed = Math.random() * 2 + 0.5;
           particles.push({
             x: cx,
             y: cy,
             vx: Math.cos(angle) * speed,
             vy: Math.sin(angle) * speed,
             life: 1.0,
             maxLife: 1.0,
             size: Math.random() * 6 + 2,
             color: colors[Math.floor(Math.random() * colors.length)]
           });
         }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;
        p.size *= 0.96;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      animationId = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [status]);

  return (
    <div className="fixed inset-0 z-50 bg-space-950/95 backdrop-blur-xl flex flex-col items-center justify-between py-12 px-6 animate-fade-in text-white overflow-hidden">

      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-yellow/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-blue/5 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>

      {/* Top Section */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8">
         {(status === 'idle' || status === 'error') && (
            <div className="flex items-center gap-2 text-white/50 text-xs font-bold tracking-[0.2em] uppercase mb-8">
               <span className="w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_10px_#FDD140]"></span>
               来电中...
            </div>
         )}

         {/* Avatar */}
         <div className="relative mb-6">
            <div className={`w-40 h-40 rounded-full border border-white/10 shadow-[0_0_40px_rgba(253,209,64,0.1)] relative z-10 bg-space-900 overflow-hidden group flex items-center justify-center transition-all duration-500 ${status === 'speaking' ? 'scale-110 shadow-[0_0_60px_rgba(253,209,64,0.3)]' : ''}`}>
               <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
               <div className="relative z-20 pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] opacity-90">
                     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                   </svg>
               </div>
            </div>
         </div>

         {/* Info & Subtitles */}
         <div className="text-center max-w-sm mx-auto w-full">
            {status === 'idle' || status === 'error' ? (
              <>
                <h2 className="text-3xl font-sans font-bold text-white mb-4 tracking-tight drop-shadow-md">
                   hii 想和你认识一下！
                </h2>
                <p className="text-brand-blue/70 text-sm leading-relaxed font-light">
                   选择语音通话或文字聊天<br/>
                   来和你的 AI 导师聊聊吧
                </p>
                {status === 'error' && (
                  <div className="mt-4 text-red-300 text-xs bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                    {errorMessage}
                  </div>
                )}
              </>
            ) : (
              <>
                 <h2 className="text-2xl font-sans font-bold text-white mb-2 tracking-wide">
                   On Her Way AI 导师
                 </h2>
                 <p className="text-brand-blue text-xs tracking-[0.2em] uppercase animate-pulse mb-4">
                   {status === 'listening' ? (isVoiceMode ? "听你说..." : "等待输入...") :
                    status === 'processing' ? "思考中..." : "讲话中..."}
                 </p>

                 {/* Subtitles Area - with swipe support */}
                 <div
                   className="h-48 flex flex-col justify-center items-center w-full px-4 transition-all relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
                   onTouchStart={handleTouchStart}
                   onTouchEnd={handleTouchEnd}
                   onWheel={handleWheel}
                 >

                    {/* Mentor Text (Dynamic Sentences) - Scale animation only */}
                    <div className="text-center w-full max-w-sm h-32 flex items-center justify-center relative overflow-hidden">
                      {mentorSentences.length > 0 ? (
                        mentorSentences.map((sentence, idx) => {
                          const isCurrent = idx === currentSentenceIndex;
                          // Only render current sentence for clean scale animation
                          if (!isCurrent) return null;

                          return (
                            <p
                              key={idx}
                              className="text-[#F36223] text-xl md:text-2xl font-bold text-center px-2 leading-relaxed transition-all duration-500 ease-out animate-scale-in overflow-hidden"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                wordBreak: 'break-word',
                              }}
                            >
                              {sentence}
                            </p>
                          );
                        })
                      ) : (
                        <p className="text-white/20 text-sm font-light italic">
                           ... 准备就绪 ...
                        </p>
                      )}
                    </div>

                    {/* Scroll indicator */}
                    {mentorSentences.length > 1 && (
                      <div className="flex flex-col items-center gap-1 opacity-40 mt-4">
                        <div className="flex gap-1">
                          {mentorSentences.map((_, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentSentenceIndex
                                  ? 'bg-brand-orange scale-125'
                                  : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-white/30 mt-1">上下滑动查看</span>
                      </div>
                    )}

                    {/* User Text (Below Mentor, Gray) */}
                    {currentUserText && (
                      <div className="w-full max-w-md border-t border-white/10 pt-4 animate-fade-in mt-4">
                        <p className="text-gray-400 text-base font-light text-center italic">
                          "{currentUserText}"
                        </p>
                      </div>
                    )}
                 </div>
              </>
            )}
         </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full max-w-md px-4 mb-8">
         {status === 'idle' || status === 'error' ? (
            <div className="flex justify-center items-center gap-6 w-full">

               {/* Decline */}
               <div className="flex flex-col items-center gap-2">
                 <button onClick={handleClose} className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center transition-all hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
                 <span className="text-white/40 text-[10px] uppercase tracking-widest">拒绝</span>
               </div>

               {/* Voice Answer */}
               <div className="flex flex-col items-center gap-2">
                 <button
                   onClick={() => startSession(true)}
                   className="w-16 h-16 rounded-full bg-brand-yellow hover:bg-brand-yellow/80 shadow-[0_0_30px_rgba(253,209,64,0.4)] flex items-center justify-center transition-all hover:scale-110"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-space-950"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                 </button>
                 <span className="text-brand-yellow font-bold text-xs uppercase tracking-widest">语音接听</span>
               </div>

               {/* Text Answer */}
               <div className="flex flex-col items-center gap-2">
                 <button
                   onClick={() => startSession(false)}
                   className="w-14 h-14 rounded-full bg-brand-blue hover:bg-brand-blue/80 shadow-[0_0_20px_rgba(159,210,227,0.4)] flex items-center justify-center transition-all hover:scale-110"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-space-950"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                 </button>
                 <span className="text-brand-blue font-bold text-xs uppercase tracking-widest">文字接听</span>
               </div>

            </div>
         ) : (
            <div className="flex flex-col items-center gap-4 w-full">

               {/* Mic Status Indicator (Only if voice mode) */}
               {isVoiceMode && (
                 <div className={`text-xs tracking-widest uppercase ${status === 'listening' ? 'text-red-400 animate-pulse' : 'text-white/30'}`}>
                    {status === 'listening' ? "🎤 麦克风开启" : "🔇 麦克风关闭"}
                 </div>
               )}

               {/* Text Input Area */}
               <div className="w-full max-w-sm flex items-center gap-2">
                 <input
                   type="text"
                   value={textInput}
                   onChange={(e) => setTextInput(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder={status === 'speaking' ? "输入以打断..." : (isVoiceMode ? "语音输入中... (也可打字)" : "输入消息...")}
                   disabled={status === 'processing'}
                   className="flex-1 bg-white/5 border border-white/20 rounded-full px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-brand-yellow/50 focus:bg-white/10 transition-all disabled:opacity-50"
                 />
                 <button
                   onClick={sendTextMessage}
                   disabled={!textInput.trim() || status === 'processing'}
                   className="w-12 h-12 rounded-full bg-brand-yellow hover:bg-brand-yellow/80 disabled:bg-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_20px_rgba(253,209,64,0.3)]"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-space-950">
                     <line x1="22" y1="2" x2="11" y2="13"></line>
                     <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                   </svg>
                 </button>
               </div>

               {/* Hang Up Button */}
               <div className="flex flex-col items-center gap-2">
                 <button
                   onClick={handleClose}
                   className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center transition-all hover:scale-105"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                 </button>
                 <span className="text-white/40 text-[10px] uppercase tracking-widest">挂断</span>
               </div>
            </div>
         )}
      </div>

    </div>
  );
};
