// src/components/Header.tsx
import React from 'react';
import { Compass, Sparkles, Database, Search, RefreshCw, QrCode } from 'lucide-react';

interface HeaderProps {
  currentTab: 'survey' | 'explore' | 'result';
  onSelectTab: (tab: 'survey' | 'explore' | 'result') => void;
  hasProfile: boolean;
  onRestartSurvey: () => void;
  onOpenQR: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  hasProfile,
  onRestartSurvey,
  onOpenQR
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('explore')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent">
                내일찾기
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                V5
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block">
              CareerPath Finder · 초·중학생 맞춤 진로 데이터
            </p>
          </div>
        </div>

        {/* Data Sync & Quarter Badge (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium">커리어넷·워크넷 2026 Q4 공공 데이터 연계</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* 교사용 QR 코드 띄우기 버튼 */}
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs transition-colors shrink-0 shadow-sm active:scale-95"
            title="학생 접속용 QR 코드 띄우기 (교사용)"
          >
            <QrCode className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">QR 접속 (교사용)</span>
            <span className="sm:hidden font-bold">QR</span>
          </button>

          {/* 직업 둘러보기 탭 */}
          <button
            onClick={() => onSelectTab('explore')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              currentTab === 'explore'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">직업 도감</span>
            <span className="xs:hidden">도감</span>
          </button>

          {/* 성향 테스트 / 내 결과 탭 */}
          {hasProfile ? (
            <button
              onClick={() => onSelectTab('result')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                currentTab === 'result'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>내 결과</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('survey')}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all shrink-0 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden xs:inline">성향 테스트</span>
              <span className="xs:hidden">테스트</span>
            </button>
          )}

          {hasProfile && (
            <button
              onClick={onRestartSurvey}
              title="테스트 다시하기"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="테스트 다시하기"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
