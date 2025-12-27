"use client";

import { useState } from "react";
import WelcomeFlow from "@/components/WelcomeFlow";
import ProfileHeader from "@/components/ProfileHeader";
import CommunityPage from "@/components/CommunityPage";
import SummaryView from "@/components/SummaryView";
import InteractionDock from "@/components/InteractionDock";
import PublicProfileView from "@/components/PublicProfileView";
import { PublicProfile } from "@/lib/types";

type HubMode = "welcome" | "main" | "profileDetail";

export default function Home() {
  const [mode, setMode] = useState<HubMode>("welcome");
  const [activeTab, setActiveTab] = useState<"home" | "community">("home");
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [detailProfile, setDetailProfile] = useState<PublicProfile | null>(
    null,
  );
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const handleWelcomeComplete = (nextProfile: PublicProfile) => {
    setProfile(nextProfile);
    setDetailProfile(nextProfile);
    setMode("main");
  };

  const handleCallEnded = () => {
    setIsSummaryOpen(true);
  };

  const handleOpenSummary = () => {
    if (!profile) return;
    setIsSummaryOpen(true);
  };

  const handleViewProfile = () => {
    if (!profile) return;
    setDetailProfile(profile);
    setMode("profileDetail");
  };

  const handleSummaryViewProfile = (authorId: string) => {
    // 目前我们暂时只有当前用户的 Profile，后续可以根据 authorId 拉取更多数据
    void authorId;
    if (!profile) return;
    setDetailProfile(profile);
    setIsSummaryOpen(false);
    setMode("profileDetail");
  };

  const summaryLayer = isSummaryOpen ? (
    <SummaryView
      onClose={() => setIsSummaryOpen(false)}
      onViewProfile={handleSummaryViewProfile}
    />
  ) : null;

  if (mode === "welcome") {
    return <WelcomeFlow onComplete={handleWelcomeComplete} />;
  }

  if (mode === "profileDetail" && detailProfile) {
    return (
      <>
        <PublicProfileView profile={detailProfile} onBack={() => setMode("main")} />
        <InteractionDock onCallEnded={handleCallEnded} activeTab="home" />
        {summaryLayer}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-40">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
              On Her Way
            </p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              拼图式生活引擎
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: "home", label: "个人主页" },
              { id: "community", label: "社区探索" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-500 hover:text-slate-800 bg-white border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={handleOpenSummary}
              disabled={!profile}
              className="px-5 py-2.5 rounded-full text-sm font-bold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-900"
            >
              查看总结
            </button>
          </div>
        </div>
      </header>

      <main className="py-12">
        {activeTab === "community" ? (
          <CommunityPage />
        ) : profile ? (
          <>
            <ProfileHeader profile={profile} />
            <section className="w-full max-w-6xl mx-auto px-6 -mt-4">
              <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_40px_120px_rgba(15,23,42,0.08)] space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">
                    Reflection Hub
                  </p>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    AI 复盘你的对话，生成可行动的拼图
                  </h2>
                  <p className="text-slate-500 leading-relaxed mt-3">
                    每次语音伴谈结束后，我们会自动生成 SummaryView。你可以复盘洞察、编辑想法并一键发布到社区。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    onClick={() => setIsSummaryOpen(true)}
                    className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black tracking-[0.2em] uppercase hover:bg-black transition-colors"
                  >
                    打开今日总结
                  </button>
                  <button
                    onClick={handleViewProfile}
                    className="w-full rounded-2xl border-2 border-slate-200 py-4 font-black text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    查看拼图主页
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="w-full max-w-4xl mx-auto px-6 text-center text-slate-500 py-24">
            请先完成欢迎流程，系统会根据你的自述生成专属档案。
          </div>
        )}
      </main>

      <InteractionDock onCallEnded={handleCallEnded} activeTab={activeTab} />
      {summaryLayer}
    </div>
  );

}
