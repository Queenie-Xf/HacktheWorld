'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, MapPin, Briefcase, Zap, Target, Activity } from 'lucide-react';
import { PublicProfile, ExperienceType, ReflectionPiece } from '../lib/types';
import PuzzlePiece from './PuzzlePiece';

interface PublicProfileViewProps {
  profile: PublicProfile;
  onBack: () => void;
}

const PublicProfileView: React.FC<PublicProfileViewProps> = ({ profile, onBack }) => {
  // Logic to arrange pieces in a connected path vertically for the static view
  const interlockedPieces: ReflectionPiece[] = (profile.reflections || []).map((p, i) => {
    // vertical stacking with connections
    const verticalSpacing = 110; 
    const isEven = i % 2 === 0;
    return {
      ...p,
      x: isEven ? 300 : 340, // zig-zag
      y: 50 + (i * verticalSpacing),
      rotation: isEven ? 0 : 5
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-500 overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="sticky top-0 z-[160] w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img src={profile.avatar} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
            <h1 className="font-bold text-slate-900">{profile.name} 的主页</h1>
          </div>
        </div>
      </header>

      {/* Profile Card Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-16 items-start relative">
          
          {/* Left: Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[240px]">
            <div className="w-48 h-48 rounded-full border-[6px] border-slate-50 overflow-hidden mb-8 shadow-2xl bg-slate-100">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{profile.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100">
                Thinker
              </span>
            </div>
          </div>

          {/* Right: Detailed Tags */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {/* Tag: role_detail */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm transition-transform group-hover:scale-110">
                <Briefcase className="w-7 h-7 text-blue-500" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest">身份背景 / Identity</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{profile.tags.role_detail}</p>
              </div>
            </div>

            {/* Tag: location */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                <MapPin className="w-7 h-7 text-slate-400" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">所在地 / Location</p>
                <p className="text-sm font-bold text-slate-700">{profile.tags.location}</p>
              </div>
            </div>

            {/* Tag: experience */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-3xl bg-green-50 flex items-center justify-center shrink-0 border border-green-100 shadow-sm transition-transform group-hover:scale-110">
                <Activity className="w-7 h-7 text-green-500" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-green-500 uppercase tracking-widest">核心体验 / Experience</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{profile.tags.experience}</p>
              </div>
            </div>

            {/* Tag: hassle */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-3xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 shadow-sm transition-transform group-hover:scale-110">
                <Zap className="w-7 h-7 text-orange-400" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest">生活困扰 / Hassle</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{profile.tags.hassle}</p>
              </div>
            </div>

            {/* Tag: goal */}
            <div className="flex items-start gap-5 group sm:col-span-2 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
              <div className="w-14 h-14 rounded-3xl bg-blue-600 flex items-center justify-center shrink-0 border border-blue-500 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">成长目标 / Goal</p>
                <p className="text-base font-black text-slate-800 leading-relaxed">{profile.tags.goal}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Life Experience Journey (Timeline) */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-24 overflow-visible">
        <div className="flex items-center gap-6 mb-12 ml-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">人生阶段 / Life Journey</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        
        <div className="relative">
          {/* Connecting Path SVG */}
          <div className="absolute top-6 left-0 w-full h-1.5 bg-slate-100 rounded-full" />
          
          <div className="flex gap-16 overflow-x-auto pb-10 px-8 scrollbar-hide no-scrollbar">
            {(profile.lifeTimeline || []).map((exp) => (
              <div key={exp.id} className="flex flex-col items-center min-w-[220px] relative z-10 group">
                <div className="w-12 h-12 rounded-full bg-white border-[6px] border-slate-50 shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40 text-center w-full group-hover:-translate-y-2 transition-transform">
                  <span className="text-xs font-black text-blue-500 mb-2 block">{exp.year}</span>
                  <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{exp.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed px-2 font-medium">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interlocked Static Puzzle Map */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-12 ml-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">反思拼图 / Reflection Map</h2>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        
        <main className="relative min-h-[900px] w-full bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-16 overflow-visible flex justify-center">
          <div className="relative w-full max-w-2xl h-full min-h-[700px]">
            {/* Background dashed path */}
            {interlockedPieces.length > 0 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                 <path
                  d={`M ${interlockedPieces[0].x + 60} ${interlockedPieces[0].y + 60} ${interlockedPieces.slice(1).map(p => `L ${p.x + 60} ${p.y + 60}`).join(' ')}`}
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                  strokeDasharray="12 8"
                />
              </svg>
            )}
            
            {/* Static connected pieces */}
            {interlockedPieces.map((piece) => (
              <PuzzlePiece 
                key={piece.id} 
                data={piece} 
                static
              />
            ))}

            {interlockedPieces.length === 0 && (
              <div className="flex items-center justify-center h-full text-slate-300 font-bold italic">
                还没有反思拼图...
              </div>
            )}

            {/* Decorative Icon */}
            <div className="absolute top-0 right-0 pointer-events-none opacity-[0.02] rotate-12 -translate-y-12">
              <User className="w-80 h-80 text-slate-900" />
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-12 right-12 flex flex-col items-end gap-3 text-right">
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">问题 (PROBLEM)</span>
               <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">困难 (DIFFICULTY)</span>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">经验 (EXPERIENCE)</span>
               <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
             </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default PublicProfileView;
