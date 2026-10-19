// src/components/CharacterProfileCard.tsx
import React, { useState } from 'react';
import { CharacterProfile, Job, ResultThemeKey } from '../types/career';
import { HexagonRadarChart } from './HexagonRadarChart';
import { Heart, Zap, Share2, Palette, Compass, Sparkles } from 'lucide-react';

interface CharacterProfileCardProps {
  profile: CharacterProfile;
  pickedJobs: Job[];
  onOpenShareModal: () => void;
  onSelectJob: (job: Job) => void;
  selectedTheme?: ResultThemeKey;
  onThemeChange?: (theme: ResultThemeKey) => void;
}

// 5대 추천 컬러 테마 정의
const THEME_CONFIGS: Record<ResultThemeKey, {
  name: string;
  badge: string;
  bgClass: string;
  cardBorder: string;
  textTitle: string;
  textDesc: string;
  statBoxBg: string;
  statBoxBorder: string;
  tagBg: string;
  tagText: string;
  isLight: boolean;
}> = {
  white: {
    name: '모던 클린 화이트 (기본)',
    badge: '📄 클린 화이트',
    bgClass: 'bg-white text-slate-800 shadow-xl border-2',
    cardBorder: 'border-indigo-300',
    textTitle: 'text-slate-900',
    textDesc: 'text-slate-600',
    statBoxBg: 'bg-slate-50',
    statBoxBorder: 'border-slate-200',
    tagBg: 'bg-indigo-50',
    tagText: 'text-indigo-700',
    isLight: true
  },
  indigo: {
    name: '딥 스페이스 인디고',
    badge: '🌌 우주 네이비',
    bgClass: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white',
    cardBorder: 'border-indigo-500/40',
    textTitle: 'text-white',
    textDesc: 'text-indigo-200',
    statBoxBg: 'bg-indigo-950/70',
    statBoxBorder: 'border-indigo-800/60',
    tagBg: 'bg-indigo-900/80',
    tagText: 'text-amber-300',
    isLight: false
  },
  emerald: {
    name: '에메랄드 포레스트',
    badge: '🌲 힐링 에메랄드',
    bgClass: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white',
    cardBorder: 'border-emerald-500/40',
    textTitle: 'text-white',
    textDesc: 'text-emerald-200',
    statBoxBg: 'bg-emerald-950/70',
    statBoxBorder: 'border-emerald-800/60',
    tagBg: 'bg-emerald-900/80',
    tagText: 'text-emerald-300',
    isLight: false
  },
  sunset: {
    name: '선셋 웜 코랄',
    badge: '🌅 웜 코랄',
    bgClass: 'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 text-white',
    cardBorder: 'border-rose-500/40',
    textTitle: 'text-white',
    textDesc: 'text-rose-200',
    statBoxBg: 'bg-rose-950/70',
    statBoxBorder: 'border-rose-800/60',
    tagBg: 'bg-rose-900/80',
    tagText: 'text-amber-300',
    isLight: false
  },
  violet: {
    name: '로열 네온 바이올렛',
    badge: '🔮 로열 바이올렛',
    bgClass: 'bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white',
    cardBorder: 'border-purple-500/40',
    textTitle: 'text-white',
    textDesc: 'text-purple-200',
    statBoxBg: 'bg-purple-950/70',
    statBoxBorder: 'border-purple-800/60',
    tagBg: 'bg-purple-900/80',
    tagText: 'text-purple-300',
    isLight: false
  }
};

export const CharacterProfileCard: React.FC<CharacterProfileCardProps> = ({
  profile,
  pickedJobs,
  onOpenShareModal,
  onSelectJob,
  selectedTheme,
  onThemeChange
}) => {
  // 테마 상태 관리 (로컬스토리지 저장 - 기본값: 모던 클린 화이트)
  const [theme, setTheme] = useState<ResultThemeKey>(() => {
    if (selectedTheme) return selectedTheme;
    try {
      const saved = localStorage.getItem('careerahead_result_theme');
      if (saved && saved in THEME_CONFIGS) return saved as ResultThemeKey;
    } catch {
      // silent
    }
    return 'white';
  });

  const handleSelectTheme = (newTheme: ResultThemeKey) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('careerahead_result_theme', newTheme);
    } catch {
      // silent
    }
    if (onThemeChange) onThemeChange(newTheme);
  };

  const themeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.white;

  // 6대 육각형 스탯
  const hexagonStats = profile.stats || {
    creativity: 85,
    logic: 88,
    communication: 82,
    grit: 90,
    tech: 86,
    leadership: 84
  };

  // 칭호에서 Lv.1, Lv.99 등 레벨 표기 제거
  const cleanTitle = profile.title.replace(/\[?Lv\.\s*\d+\]?\s*/gi, '').trim();

  return (
    <div className={`rounded-3xl p-5 sm:p-7 shadow-2xl border-4 ${themeConfig.bgClass} ${themeConfig.cardBorder} relative overflow-hidden transition-colors duration-300`}>
      
      {/* Background Decorative Accent Lighting (어두운 테마 전용) */}
      {!themeConfig.isLight && (
        <>
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
        </>
      )}

      {/* Top Bar: 진로 탐색 리포트 뱃지 & 배경 테마 변경기 & 모바일 카드 공유 */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${themeConfig.statBoxBorder} relative z-10`}>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs tracking-wider shadow-sm flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-slate-950" />
            <span>나의 진로 성향 리포트</span>
          </span>
          <span className={`font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
            themeConfig.isLight 
              ? 'bg-slate-100 text-indigo-700 border-slate-300' 
              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
          }`}>
            {profile.code}
          </span>
        </div>

        {/* 오른쪽 액션: 배경색 테마 선택기 & 1장 공유 버튼 */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* 테마 변경 팝오버 / 버튼 그룹 */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            themeConfig.isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/80 border-slate-700'
          }`}>
            <Palette className="w-3.5 h-3.5 ml-1.5 text-slate-400" aria-hidden="true" />
            {(Object.keys(THEME_CONFIGS) as ResultThemeKey[]).map(tKey => {
              const cfg = THEME_CONFIGS[tKey];
              const isCurrent = theme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => handleSelectTheme(tKey)}
                  title={`${cfg.name} (클릭하여 배경색 변경)`}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : themeConfig.isLight ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cfg.badge.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenShareModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:from-amber-300 hover:to-amber-400 transition-transform active:scale-95 shrink-0 min-h-[40px]"
          >
            <Share2 className="w-4 h-4" />
            <span>모바일 1장 카드 공유</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 왼쪽(캐릭터 프로필 정보) + 오른쪽(육각형 능력치 차트) */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* 왼쪽: 아바타 + 칭호 + 성향 설명 + 핵심 강점 (7열) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          {/* Avatar Box */}
          <div className="relative group shrink-0">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-amber-400/80 flex items-center justify-center text-5xl sm:text-6xl shadow-xl ${
              themeConfig.isLight 
                ? 'bg-gradient-to-b from-indigo-50 to-slate-100 shadow-slate-300' 
                : 'bg-gradient-to-b from-indigo-600 to-slate-800 shadow-indigo-950'
            }`}>
              <span className="animate-float">{profile.avatar}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300 shadow flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>성향 분석</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${themeConfig.textTitle}`}>
                {cleanTitle}
              </h1>
            </div>

            <p className={`text-xs sm:text-sm mt-2 leading-relaxed font-normal ${themeConfig.textDesc}`}>
              {profile.description}
            </p>

            {/* 특기 & 찜 뱃지 */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 ${
                themeConfig.isLight
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  : 'bg-indigo-900/60 border-indigo-700/50 text-amber-300'
              }`}>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>핵심 매칭: {profile.highlightStats}</span>
              </span>

              <span className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 ${
                themeConfig.isLight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
              }`}>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>찜한 직업: {pickedJobs.length}개</span>
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 육각형 성향 능력치 차트 (5열) */}
        <div className={`lg:col-span-5 p-4 rounded-3xl border flex flex-col items-center justify-center ${
          themeConfig.isLight 
            ? 'bg-slate-50/90 border-slate-200' 
            : 'bg-slate-900/60 border-indigo-800/40 backdrop-blur-xs'
        }`}>
          <div className="flex items-center gap-1.5 mb-1 text-xs font-black">
            <span className="p-1 rounded bg-amber-400 text-slate-950">📊</span>
            <span className={themeConfig.isLight ? 'text-slate-900' : 'text-slate-200'}>
              설문 기반 육각형 6대 능력치
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2 text-center">
            나의 8단계 퀘스트 선택 데이터로 정밀 산출된 역량 밸런스
          </p>

          {/* SVG 육각형 레이더 차트 */}
          <HexagonRadarChart
            stats={hexagonStats}
            theme={theme}
            size={270}
          />
        </div>

      </div>

      {/* Picked Dream Jobs Quick Bar (찜한 직업이 있을 때) */}
      {pickedJobs.length > 0 && (
        <div className={`mt-5 p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 relative z-10 ${
          themeConfig.isLight 
            ? 'bg-indigo-50/80 border-indigo-200' 
            : 'bg-indigo-950/80 border-amber-400/40'
        }`}>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span className={`text-xs sm:text-sm font-bold ${themeConfig.isLight ? 'text-indigo-950' : 'text-amber-200'}`}>
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
