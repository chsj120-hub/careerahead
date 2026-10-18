import React from 'react';
import { Job } from '../types/career';
import { Footprints, DollarSign, Heart, ChevronRight, ShieldCheck, Trophy } from 'lucide-react';
import { getTop10SalaryInfo } from '../data/top10SalaryCalculator';

interface JobCardProps {
  job: Job;
  isPicked: boolean;
  onTogglePick: (job: Job, e: React.MouseEvent) => void;
  onSelect: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isPicked,
  onTogglePick,
  onSelect
}) => {
  // 미래 안전도 뱃지 스타일 매핑
  const getSafetyBadgeColor = (status: Job['aiTrafficLight']['status']) => {
    switch (status) {
      case 'partner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'cooperation':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'caution':
        return 'bg-rose-50 text-rose-900 border-rose-300';
    }
  };

  return (
    <article 
      onClick={() => onSelect(job)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(job);
        }
      }}
      aria-label={`${job.title} 직업 상세 정보 보기`}
      className="group relative bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-indigo-500 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden transform hover:-translate-y-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
    >
      {/* Top Tag & Pick Button */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {job.categoryName}
        </span>

        <button
          type="button"
          onClick={(e) => onTogglePick(job, e)}
          title={isPicked ? '찜 취소' : '내 꿈으로 찜하기'}
          aria-label={isPicked ? `${job.title} 찜 취소` : `${job.title} 찜하기`}
          className={`p-2.5 rounded-xl transition-all min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-400 ${
            isPicked
              ? 'bg-rose-500 text-white shadow-sm scale-105'
              : 'bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isPicked ? 'fill-white' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {/* Main Info (Icon & Title) */}
      <div>
        <div className="flex items-center gap-3.5 mb-2.5">
          <div className="w-13 h-13 text-3xl p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            {job.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5 truncate">
              {job.badge}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.summary}
        </p>
      </div>

      {/* Badges Matrix */}
      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
        {/* Income Spectrum with Top 10% High Ceiling */}
        <div className="flex items-center justify-between text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> 소득 스펙트럼
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">
              {job.moneyTruth.entrySalary}만 ~ {job.moneyTruth.tenYearSalary}만
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-black flex items-center gap-0.5" title="상위 10%의 고점">
              <Trophy className="w-2.5 h-2.5 text-amber-500" />
              <span>{getTop10SalaryInfo(job).salary.toLocaleString()}만+</span>
            </span>
          </div>
        </div>

        {/* Future Safety / Outlook Indicator */}
        <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border font-bold text-[11px] ${getSafetyBadgeColor(job.aiTrafficLight.status)}`}>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 미래 유망·안전도
          </span>
          <span>{job.aiTrafficLight.statusText}</span>
        </div>

        {/* Preparation Step Badge */}
        <div className="flex items-center justify-between text-slate-600 px-3 py-1 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Footprints className="w-3.5 h-3.5 text-indigo-500" /> 준비 걸음
          </span>
          <span className="font-semibold text-slate-700 truncate max-w-[150px]">
            {job.prepPeriod.stepBadge.split('(')[0]}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
        <span>미래 전망 & 5대 현실 Q&A 보기</span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </article>
  );
};
