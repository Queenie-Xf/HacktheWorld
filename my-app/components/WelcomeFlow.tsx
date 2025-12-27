"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  ArrowRight,
  MapPin,
  Briefcase,
  Zap,
  Target,
  Activity,
} from "lucide-react";
import { callGLM } from "@/lib/aiService";
import { AppStage, PublicProfile } from "@/lib/types";

interface WelcomeFlowProps {
  onComplete: (profile: PublicProfile) => void;
}

const SYSTEM_PROMPT =
  "你叫 On Her Way 的向导，需要用温柔、鼓励的语气和新用户开场，邀请他们聊聊想在这个 App 中探索什么。语言保持中文。";
const STARTER_PROMPT =
  "我刚下载了 On Her Way，今天想找你聊聊：我想重新找回生活节奏，你想先问我什么？";

const mockProfile: PublicProfile = {
  id: "user_1",
  name: "探索者",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=onherway",
  tags: {
    role_detail: "上班族，从事运营工作",
    location: "上海",
    experience: "独居，经常点外卖",
    hassle: "觉得生活没规律，想自己做饭但坚持不下来",
    goal: "通过小改变找回生活掌控感",
  },
  lifeTimeline: [
    {
      id: "t1",
      year: "2020",
      title: "初次探索",
      description: "开始尝试记录自己的生活点滴",
    },
    {
      id: "t2",
      year: "2022",
      title: "职业转型",
      description: "从传统行业跨入互联网运营",
    },
    {
      id: "t3",
      year: "2024",
      title: "觉醒时刻",
      description: "意识到反思对于个人成长的重要性",
    },
  ],
  reflections: [],
};

const WelcomeFlow: React.FC<WelcomeFlowProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<AppStage>("welcome");
  const [userTranscription, setUserTranscription] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const startCall = async () => {
    setStage("calling");
    setIsConnecting(true);
    setUserTranscription("GLM-4.7 正在连接，请稍等…");

    try {
      const response = await callGLM(
        [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: STARTER_PROMPT },
        ],
        { model: "glm-4.7" },
      );
      setUserTranscription(response);
    } catch (error) {
      console.error("Failed to start GLM conversation", error);
      setUserTranscription("暂时无法连接 GLM-4.7，请稍后再试。");
      setStage("profile_card");
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    setStage("profile_card");
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-50 flex items-center justify-center overflow-hidden font-['Plus_Jakarta_Sans']">
      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center"
          >
            <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter">
              On Her Way
            </h1>
            <p className="text-slate-400 mb-14 text-xl font-medium tracking-tight opacity-80">
              重构你的生活拼图
            </p>
            <button
              onClick={() => setStage("incoming_call")}
              className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-black transition-all hover:scale-105 active:scale-95"
            >
              开始探索
            </button>
          </motion.div>
        )}

        {stage === "incoming_call" && (
          <motion.div
            key="incoming"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-[0_30px_80px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center gap-10"
          >
            <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/20">
              <Phone className="w-12 h-12 text-white fill-current" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                hi！欢迎来到 on her way!
              </h2>
              <p className="text-slate-500 font-bold text-lg leading-relaxed opacity-70 px-4">
                我们先随便聊几句，互相认识一下彼此？
              </p>
            </div>
            <button
              onClick={startCall}
              className="w-full py-6 bg-green-500 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              <Phone className="w-6 h-6 fill-current" /> 接通
            </button>
          </motion.div>
        )}

        {stage === "calling" && (
          <motion.div
            key="calling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white flex flex-col items-center justify-between py-24 px-8"
          >
            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full text-center gap-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter"
              >
                想在这个 App 里
                <br />
                玩点什么？
              </motion.h2>

              <div className="min-h-[80px] max-w-2xl px-8">
                <p className="text-2xl text-slate-400 font-bold italic leading-relaxed opacity-60 whitespace-pre-line">
                  {userTranscription ||
                    (isConnecting
                      ? "正在连接 GLM-4.7..."
                      : "正在倾听你的声音...")}
                </p>
              </div>

              <div className="flex items-center gap-2 h-16">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [24, 64, 24] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                    className="w-3 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={endCall}
              className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30 hover:bg-red-600 transition-all active:scale-90 hover:rotate-12"
            >
              <PhoneOff className="w-10 h-10" />
            </button>
          </motion.div>
        )}

        {stage === "profile_card" && (
          <motion.div
            key="card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-6xl px-6 py-12"
          >
            <div className="bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row gap-24 items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

              <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[320px] z-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-90 group-hover:scale-105 transition-transform" />
                  <div className="w-56 h-56 rounded-full border-[10px] border-slate-50 overflow-hidden mb-10 shadow-2xl relative">
                    <img
                      src={mockProfile.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-5xl font-black text-slate-900 mb-10 tracking-tight">
                  {mockProfile.name}
                </h3>
                <div className="space-y-8 w-full">
                  {[
                    {
                      icon: <Briefcase className="w-6 h-6" />,
                      label: "身份背景",
                      val: mockProfile.tags.role_detail,
                      color: "blue",
                    },
                    {
                      icon: <MapPin className="w-6 h-6" />,
                      label: "所在地",
                      val: mockProfile.tags.location,
                      color: "slate",
                    },
                    {
                      icon: <Activity className="w-6 h-6" />,
                      label: "核心体验",
                      val: mockProfile.tags.experience,
                      color: "green",
                    },
                    {
                      icon: <Zap className="w-6 h-6" />,
                      label: "生活困扰",
                      val: mockProfile.tags.hassle,
                      color: "orange",
                    },
                    {
                      icon: <Target className="w-6 h-6" />,
                      label: "成长目标",
                      val: mockProfile.tags.goal,
                      color: "blue",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 group">
                      <div
                        className={`p-3.5 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 shrink-0 shadow-sm transition-transform group-hover:scale-110`}
                      >
                        <span className={`text-${item.color}-500`}>
                          {item.icon}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {item.label}
                        </p>
                        <p className="text-base font-bold text-slate-700 leading-snug">
                          {item.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full z-10 pt-4">
                <div className="flex items-center gap-4 mb-14">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                    你的个人经历 / Journey
                  </h4>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="relative pl-14 border-l-2 border-dashed border-slate-200 space-y-20">
                  {mockProfile.lifeTimeline.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="absolute -left-[69px] top-1.5 w-8 h-8 rounded-full bg-white border-[6px] border-blue-500 shadow-xl group-hover:scale-125 transition-transform" />
                      <span className="text-sm font-black text-blue-500 mb-3 block tracking-wider">
                        {item.year}
                      </span>
                      <h5 className="text-2xl font-black text-slate-900 mb-3">
                        {item.title}
                      </h5>
                      <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-28 flex justify-end">
                  <button
                    onClick={() => onComplete(mockProfile)}
                    className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-xl flex items-center gap-4 shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95 group"
                  >
                    开启拼图世界
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeFlow;
