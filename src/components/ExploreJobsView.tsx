// src/components/ExploreJobsView.tsx
import React, { useState, useMemo } from 'react';
import { Job } from '../types/career';
import { CATEGORIES_INFO } from '../data/jobsData';
import { JobCard } from './JobCard';
import { Search, SlidersHorizontal, PlusCircle, AlertCircle } from 'lucide-react';

import { getTop10SalaryInfo } from '../data/top10SalaryCalculator';

interface ExploreJobsViewProps {
  jobs: Job[];
  pickedJobIds: string[];
  onTogglePick: (job: Job, e: React.MouseEvent) => void;
  onSelectJob: (job: Job) => void;
  onRequestMissingJob: (keyword: string) => void;
}

// 학생들이 접하기 쉬운 순서대로 카테고리 우선순위 정렬
const CATEGORY_PRIORITY: Record<string, number> = {
  part_time: 1,       // 1. 아르바이트
  local_biz: 2,       // 2. 자영업
  office: 3,          // 3. 회사원
  popular: 4,         // 4. 인기 희망직
  freelancer: 5,      // 5. 프리랜서
  high_prestige: 6,   // 6. 전문직
  local_industry: 7,  // 7. 지방 거점 고연봉 특화
  science_math: 8,    // 8. 과학 수학
  future: 9,          // 9. 미래 융합
};

export const ExploreJobsView: React.FC<ExploreJobsViewProps> = ({
  jobs,
  pickedJobIds,
  onTogglePick,
  onSelectJob,
  onRequestMissingJob
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'top10Salary' | 'tenYearSalary' | 'entrySalary' | 'prepTime'>('default');

  // 필터링 및 정렬
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      // 카테고리 필터
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }
      // 검색어 필터 (직업명, 뱃지, 요약, 태그)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = job.title.toLowerCase().includes(query);
        const summaryMatch = job.summary.toLowerCase().includes(query);
        const badgeMatch = job.badge.toLowerCase().includes(query);
        const reasonMatch = job.aiTrafficLight.reason.toLowerCase().includes(query);
        return titleMatch || summaryMatch || badgeMatch || reasonMatch;
      }
      return true;
    });

    // 정렬: 기본 추천순은 접하기 쉬운 직업(알바->자영업->회사원->인기직->프리랜서->전문직->지방고연봉->과학수학->미래융합)
    if (sortBy === 'default') {
      result.sort((a, b) => {
        const priorityA = CATEGORY_PRIORITY[a.category] ?? 99;
        const priorityB = CATEGORY_PRIORITY[b.category] ?? 99;
        return priorityA - priorityB;
      });
    } else if (sortBy === 'top10Salary') {
      result.sort((a, b) => getTop10SalaryInfo(b).salary - getTop10SalaryInfo(a).salary);
    } else if (sortBy === 'tenYearSalary') {
      result.sort((a, b) => b.moneyTruth.tenYearSalary - a.moneyTruth.tenYearSalary);
    } else if (sortBy === 'entrySalary') {
      result.sort((a, b) => b.moneyTruth.entrySalary - a.moneyTruth.entrySalary);
    } else if (sortBy === 'prepTime') {
      result.sort((a, b) => a.prepPeriod.yearsRequired - b.prepPeriod.yearsRequired);
    }

    return result;
  }, [jobs, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>100개 직업 대도감 & 자유 탐색</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                100 Jobs Database
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              관심 있는 직업을 검색하거나 카테고리별로 자유롭게 둘러보며 나만의 꿈을 찜해보세요!
            </p>
          </div>

          <button
            onClick={() => onRequestMissingJob(searchQuery)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>원하는 직업이 없나요? (조사 요청)</span>
          </button>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <label htmlFor="job-search-input" className="sr-only">직업명 또는 키워드 검색</label>
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              id="job-search-input"
              type="text"
              placeholder="직업명, 키워드 검색 (예: 개발자, 카페, 반도체, AI 등)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-14 py-3 rounded-2xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 text-sm font-medium outline-hidden transition-all text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 p-1"
                aria-label="검색어 지우기"
              >
                지우기
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            <label htmlFor="job-sort-select" className="sr-only">직업 정렬 기준</label>
            <select
              id="job-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
            >
              <option value="default">기본 추천순 (친근한 순)</option>
              <option value="top10Salary">👑 상위 10% 고점 높은순</option>
              <option value="tenYearSalary">10년차 소득 높은순</option>
              <option value="entrySalary">초임 높은순</option>
              <option value="prepTime">준비기간 짧은순</option>
            </select>
          </div>
        </div>

        {/* Category Pills Slider (Touch Friendly on Mobile with semantic tablist) */}
        <div 
          role="tablist" 
          aria-label="직업 카테고리 필터"
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none touch-pan-x -mx-1 px-1"
        >
          {CATEGORIES_INFO.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 min-h-[40px] ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-950'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-slate-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Filter Info */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <div>
          총 <span className="font-extrabold text-indigo-600">{filteredJobs.length}</span>개의 직업이 탐색되었습니다.
        </div>
        {searchQuery && (
          <span className="text-slate-400 text-xs">
            "{searchQuery}" 검색 결과
          </span>
        )}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isPicked={pickedJobIds.includes(job.id)}
              onTogglePick={onTogglePick}
              onSelect={onSelectJob}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-300 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">
            "{searchQuery}" 직업을 찾지 못했어요!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            아직 우리 데이터베이스에 등록되지 않은 직업일 수 있습니다.
            조사 요청 버튼을 누르면 다음 분기 정기 업데이트 시 우선적으로 데이터를 조사해 등록해 드려요!
          </p>
          <button
            onClick={() => onRequestMissingJob(searchQuery)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            이 직업 조사 요청하기 (피드백)
          </button>
        </div>
      )}

    </div>
  );
};
