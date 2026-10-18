// src/components/CharacterProfileCard.tsx
import React from 'react';
import { CharacterProfile, Job } from '../types/career';
import { Heart, Zap, Award, Share2 } from 'lucide-react';

interface CharacterProfileCardProps {
  profile: CharacterProfile;
  pickedJobs: Job[];
  onOpenShareModal: () => void;
  onSelectJob: (job: Job) => void;
}

export const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({
  profile,
  pickedJobs,
  onOpenShareModal,
  onSelectJob
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-indigo-400/30 relative overflow-hidden">
      {/* Background Decorative RPG Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      {/* Top Banner: Level & Code */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-indigo-800/60 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-black text-xs tracking-wider shadow-sm flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Lv.{profile.level} ADVENTURER
          </span>
          <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-700/50">
            {profile.code}
          </span>
        </div>

        <button
          onClick={onOpenShareModal}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:from-amber-300 hover:to-amber-400 transition-transform active:scale-95 w-full sm:w-auto shrink-0 min-h-[44px]"
        >
          <Share2 className="w-4 h-4" />
          <span>모바일 결과 카드 (1장 공유)</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
        {/* Avatar Box with Pixel style frame */}
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-indigo-600 to-slate-800 border-4 border-amber-400/80 flex items-center justify-center text-5xl sm:text-6xl shadow-xl shadow-indigo-950">
            <span className="animate-float">{profile.avatar}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-indigo-300 shadow">
            EXP MAX
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {profile.title}
            </h1>
          </div>

          <p className="text-indigo-200 text-xs sm:text-sm mt-2 leading-relaxed">
            {profile.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-800/60 border border-indigo-600/40 text-amber-300 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              핵심 특기: {profile.highlightStats}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-medium flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              찜한 직업: {pickedJobs.length}개
            </span>
          </div>
        </div>
      </div>

      {/* RPG Stats Showcase Bar */}
      <div className="mt-6 pt-5 border-t border-indigo-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-700/40">
          <div className="flex justify-between items-center text-[11px] text-indigo-300 mb-1">
            <span>✨ 창의력 (C)</span>
            <span className="font-bold text-amber-300">95</span>
          </div>
          <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '95%' }}></div>
          </div>
        </div>

        <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-700/40">
          <div className="flex justify-between items-center text-[11px] text-indigo-300 mb-1">
            <span>🔍 논리력 (L)</span>
            <span className="font-bold text-sky-300">92</span>
          </div>
          <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>

        <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-700/40">
          <div className="flex justify-between items-center text-[11px] text-indigo-300 mb-1">
            <span>💖 소통력 (E)</span>
            <span className="font-bold text-pink-300">88</span>
          </div>
          <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden">
            <div className="bg-pink-400 h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-700/40">
          <div className="flex justify-between items-center text-[11px] text-indigo-300 mb-1">
            <span>🏃 끈기 실행 (X)</span>
            <span className="font-bold text-emerald-300">90</span>
          </div>
          <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>

      {/* Picked Dream Jobs Quick Bar */}
      {pickedJobs.length > 0 && (
        <div className="mt-5 p-4 rounded-2xl bg-indigo-950/80 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-amber-200">
              내가 찜한 꿈의 직업 ({pickedJobs.length}개):
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pickedJobs.map(job => (
              <button
                key={job.id}
                type="button"
                onClick={() => onSelectJob(job)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-transform active:scale-95 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <span aria-hidden="true">{job.icon}</span>
                <span>{job.title}</span>
                <Heart className="w-3 h-3 fill-rose-600 text-rose-600" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
