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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button 
          type="button"
          onClick={() => onSelectTab('explore')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xl p-1"
          aria-label="내일찾기 홈으로 이동 (직업 도감)"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                내일찾기
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                V5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              초·중학생 맞춤형 데이터 기반 진로 탐색
            </p>
          </div>
        </button>

        {/* Data Sync Badge (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600" aria-label="연계 데이터 출처">
          <Database className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
          <span className="font-medium">커리어넷·워크넷 2026 공공 데이터 연계</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
        </div>

        {/* Navigation Tabs & Actions */}
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="메인 내비게이션">
          
          {/* 교사용 QR 코드 띄우기 버튼 */}
          <button
            type="button"
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-xs active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
            title="학생 접속용 QR 코드 띄우기 (교사용 화면)"
            aria-label="학생 접속용 QR 코드 띄우기"
          >
            <QrCode className="w-4 h-4 text-amber-700" aria-hidden="true" />
            <span className="hidden sm:inline">QR 접속 (교사용)</span>
            <span className="sm:hidden font-bold">QR</span>
          </button>

          {/* 직업 둘러보기 탭 */}
          <button
            type="button"
            onClick={() => onSelectTab('explore')}
            aria-current={currentTab === 'explore' ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 ${
              currentTab === 'explore'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>직업 도감</span>
          </button>

          {/* 성향 테스트 / 내 결과 탭 */}
          {hasProfile ? (
            <button
              type="button"
              onClick={() => onSelectTab('result')}
              aria-current={currentTab === 'result' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 ${
                currentTab === 'result'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>내 결과</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectTab('survey')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-all shrink-0 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span className="hidden xs:inline">성향 테스트 시작</span>
              <span className="xs:hidden">테스트</span>
            </button>
          )}

          {hasProfile && (
            <button
              type="button"
              onClick={onRestartSurvey}
              title="테스트 다시하기"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
              aria-label="성향 테스트 다시하기"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
