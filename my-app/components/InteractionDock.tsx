'use client';

import React, { useState, useRef } from 'react';
import { Send, Phone, PhoneOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// --- Audio Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface InteractionDockProps {
  onCallEnded: () => void;
  activeTab: 'home' | 'community';
}

const InteractionDock: React.FC<InteractionDockProps> = ({ onCallEnded, activeTab }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [userTranscription, setUserTranscription] = useState('');
  const [callInputText, setCallInputText] = useState('');
  
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const stopCall = (showSummary = false) => {
    setIsCalling(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextsRef.current) {
      if (audioContextsRef.current.input) {
        audioContextsRef.current.input.close().catch(() => {});
      }
      if (audioContextsRef.current.output) {
        audioContextsRef.current.output.close().catch(() => {});
      }
      audioContextsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUserTranscription('');
    setCallInputText('');
    
    if (showSummary) {
      onCallEnded();
    }
  };

  const handleCallTextSend = () => {
    if (!callInputText.trim() || !sessionRef.current) return;
    sessionRef.current.sendRealtimeInput({ text: callInputText });
    setUserTranscription(prev => prev + (prev ? " " : "") + callInputText);
    setCallInputText('');
  };

  const startCall = async () => {
    try {
      setIsCalling(true);
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
        stopCall();
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextsRef.current = { input: inputCtx, output: outputCtx };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then((session) => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setUserTranscription(prev => prev + text);
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioContextsRef.current?.output;
              if (outCtx) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                source.addEventListener('ended', () => sourcesRef.current.delete(source));
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopCall();
          },
          onclose: () => stopCall(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: '你是一个贴心的心理咨询师和反思伴侣。用自然、温和的语气与用户交流。引导他们说出今天的反思。如果用户打字，也要像语音通话一样给予回应。',
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start call:', err);
      stopCall();
    }
  };

  const handlePost = () => {
    if (!postText.trim()) return;
    setPostText('');
    setIsPosting(false);
  };

  return (
    <>
      {isCalling && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-between py-12 px-8 text-slate-900 transition-all duration-500">
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              今天有什么想聊的吗？
            </h2>
            <div className="min-h-[80px] w-full mb-8">
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed italic transition-all duration-300">
                {userTranscription || "正在倾听..."}
              </p>
            </div>
            <div className="mb-12 flex items-center justify-center gap-1 h-10">
               {[...Array(5)].map((_, i) => (
                 <div 
                   key={i}
                   className="w-1.5 bg-blue-500 rounded-full animate-pulse"
                   style={{ height: `${15 + Math.random() * 25}px`, animationDelay: `${i * 0.1}s` }}
                 />
               ))}
            </div>
            <div className="w-full max-w-md bg-slate-100 rounded-2xl p-2 flex items-center shadow-inner border border-slate-200">
              <input
                type="text"
                placeholder="在此输入想法..."
                value={callInputText}
                onChange={(e) => setCallInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCallTextSend()}
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-slate-700 text-sm font-medium placeholder:text-slate-400"
              />
              <button
                onClick={handleCallTextSend}
                disabled={!callInputText.trim()}
                className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-8">
            <button 
              onClick={() => stopCall(true)}
              className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-xl shadow-red-500/30"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Interaction Bar (Home only) */}
      {activeTab === 'home' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-2.5 flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="记录今日反思..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onFocus={() => setIsPosting(true)}
                className="w-full bg-slate-100/60 border-none focus:ring-0 rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all"
              />
              {isPosting && (
                <button 
                  onClick={handlePost}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-px h-8 bg-slate-200 mx-1" />
            <button 
              onClick={startCall}
              className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-500/30 group"
            >
              <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractionDock;
