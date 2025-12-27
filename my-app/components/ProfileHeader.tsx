'use client';

import React from 'react';
import { Briefcase, MapPin, Activity, Zap, Target } from 'lucide-react';
import { PublicProfile } from '../lib/types';

interface ProfileHeaderProps {
  profile?: PublicProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-12 pb-24">
      <div className="bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col lg:flex-row gap-24 items-start relative overflow-hidden">
        {/* Identity Card Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left min-w-[340px] z-10">
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform opacity-60" />
            <div className="w-52 h-52 rounded-full border-[10px] border-slate-50 overflow-hidden shadow-2xl relative bg-slate-100">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">{profile.name}</h1>
          
          <div className="space-y-8 w-full">
            {[
              { icon: <Briefcase className="w-6 h-6" />, label: "身份背景", val: profile.tags.role_detail, color: "blue" },
              { icon: <MapPin className="w-6 h-6" />, label: "所在地", val: profile.tags.location, color: "slate" },
              { icon: <Activity className="w-6 h-6" />, label: "核心体验", val: profile.tags.experience, color: "green" },
              { icon: <Zap className="w-6 h-6" />, label: "生活困扰", val: profile.tags.hassle, color: "orange" },
              { icon: <Target className="w-6 h-6" />, label: "成长目标", val: profile.tags.goal, color: "blue" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className={`p-3.5 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                  <span className={`text-${item.color}-500`}>{item.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                  <p className="text-base font-bold text-slate-700 leading-snug">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Timeline Section */}
        <div className="flex-1 w-full z-10">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">人生经历 / Journey Map</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          
          <div className="relative pl-14 border-l-2 border-dashed border-slate-200 space-y-24">
            {profile.lifeTimeline.map((item) => (
              <div key={item.id} className="relative group">
                <div className="absolute -left-[69px] top-2 w-8 h-8 rounded-full bg-white border-[6px] border-blue-500 shadow-xl group-hover:scale-125 transition-transform duration-300" />
                <span className="text-sm font-black text-blue-500 mb-3 block tracking-widest">{item.year}</span>
                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-8 bg-blue-50/50 rounded-[2.5rem] border border-dashed border-blue-100">
            <p className="text-sm text-blue-600/80 font-bold italic text-center">
              “每一个节点都是拼图的一角，串联起属于你的独特叙事。”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
