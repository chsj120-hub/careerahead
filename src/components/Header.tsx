// src/components/Header.tsx
import React from 'react';
import { Compass, Sparkles, Search, RefreshCw, Home, FileText, Download } from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'explore' | 'result';
  onSelectTab: (tab: 'home' | 'explore' | 'result') => void;
  onResetToHome: () => void;
  hasProfile: boolean;
  onRestartSurvey: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onResetToHome,
  hasProfile,
  onRestartSurvey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 h-15 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand Logo - 클릭 시 초기화되어 처음 홈으로 복귀 */}
        <button 
          type="button"
          onClick={onResetToHome}
          className="flex items-center gap-1.5 sm:gap-2.5 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xl p-1 cursor-pointer transition-transform active:scale-95 shrink-0"
          title="내일찾기 처음 화면으로 돌아가기 (초기화)"
          aria-label="내일찾기 처음 화면으로 이동"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-4.5 h-4.5 sm:w-6 sm:h-6 animate-spin-slow text-amber-300" aria-hidden="true" />
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap select-none">
                내일찾기
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0 whitespace-nowrap">
                V5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block whitespace-nowrap">
              초·중학생 맞춤형 데이터 기반 진로 탐색
            </p>
          </div>
        </button>

        {/* Navigation Tabs: 간결하고 통일된 작동 버튼 */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0" aria-label="메인 내비게이션">
          {/* 처음으로 (홈) 버튼 */}
          <button
            type="button"
            onClick={onResetToHome}
            aria-current={currentTab === 'home' ? 'page' : undefined}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer ${
              currentTab === 'home'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-950'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="처음 시작 화면으로 이동"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">처음으로</span>
          </button>

          {/* 직업 도감 버튼 */}
          <button
            type="button"
            onClick={() => onSelectTab('explore')}
            aria-current={currentTab === 'explore' ? 'page' : undefined}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer ${
              currentTab === 'explore'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
            title="100개 직업 전체 도감 탐색"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">직업 도감</span>
          </button>

          {/* 검사 완료 후: 내 결과 보기 탭 */}
          {hasProfile && (
            <button
              type="button"
              onClick={() => onSelectTab('result')}
              aria-current={currentTab === 'result' ? 'page' : undefined}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer ${
                currentTab === 'result'
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-1 ring-amber-500'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
              title="내가 검사한 진로 캐릭터 결과 보기"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-700 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">내 결과 보기</span>
            </button>
          )}

          {/* 검사 완료 후: 테스트 다시하기 아이콘 버튼 */}
          {hasProfile && (
            <button
              type="button"
              onClick={onRestartSurvey}
              title="테스트 처음부터 다시하기"
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
              aria-label="성향 테스트 다시하기"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </button>
          )}
          {/* 공식 가이드 안내서 다운로드 버튼 (헤더 우측 작게 배치) */}
          <a
            href="/USER_GUIDE.md"
            download="내일찾기_공식_사용안내서.md"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200/90 transition-all shrink-0 whitespace-nowrap focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 group"
            title="초·중학교 교사용 및 학생용 공식 사용 안내서(USER_GUIDE.md) 다운로드"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">가이드 안내서</span>
            <span className="sm:hidden">가이드</span>
            <Download className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
};

