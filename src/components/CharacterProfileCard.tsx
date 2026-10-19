import React, { useState } from 'react';
import { CharacterProfile, Job, ResultThemeKey } from '../types/career';
import { HexagonRadarChart } from './HexagonRadarChart';
import { ChibiCharacter } from './ChibiCharacter';
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
    <div className={`rounded-3xl p-4 sm:p-5 shadow-xl border-3 ${themeConfig.bgClass} ${themeConfig.cardBorder} relative overflow-hidden transition-colors duration-300`}>
      
      {/* Background Decorative Accent Lighting (어두운 테마 전용) */}
      {!themeConfig.isLight && (
        <>
          <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        </>
      )}

      {/* Top Bar: 컴팩트한 상단 헤더 바 */}
      <div className={`flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b ${themeConfig.statBoxBorder} relative z-10`}>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs tracking-wider shadow-xs flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-slate-950" />
            <span>나의 진로 성향 리포트</span>
          </span>
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
            themeConfig.isLight 
              ? 'bg-slate-100 text-indigo-700 border-slate-300' 
              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
          }`}>
            {profile.code}
          </span>
        </div>

        {/* 오른쪽 액션: 배경색 테마 선택기 & 1장 공유 버튼 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 테마 변경 버튼 그룹 */}
          <div className={`flex items-center gap-0.5 p-0.5 rounded-lg border ${
            themeConfig.isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/80 border-slate-700'
          }`}>
            <Palette className="w-3 h-3 ml-1 text-slate-400" aria-hidden="true" />
            {(Object.keys(THEME_CONFIGS) as ResultThemeKey[]).map(tKey => {
              const cfg = THEME_CONFIGS[tKey];
              const isCurrent = theme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => handleSelectTheme(tKey)}
                  title={`${cfg.name} (클릭하여 배경색 변경)`}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
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
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-sm hover:from-amber-300 hover:to-amber-400 transition-transform active:scale-95 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>모바일 1장 카드 공유</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 왼쪽(2D 2등신 캐릭터 + 칭호) + 오른쪽(콤팩트 육각형 능력치 차트) - 세로 높이 대폭 축소 */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center relative z-10">
        
        {/* 왼쪽: 2D 2등신 캐릭터 + 칭호 + 성향 설명 + 핵심 강점 (7열) */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
          
          {/* 2D 2등신 사람 캐릭터 일러스트 박스 */}
          <div className="relative group shrink-0">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-amber-400/80 flex items-center justify-center shadow-md overflow-hidden ${
              themeConfig.isLight 
                ? 'bg-gradient-to-b from-indigo-50/80 to-slate-100 shadow-slate-200' 
                : 'bg-gradient-to-b from-indigo-900 to-slate-800 shadow-indigo-950'
            }`}>
              <ChibiCharacter
                title={cleanTitle}
                code={profile.code}
                size={84}
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md border border-amber-300 shadow flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>2D 캐릭터</span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-1 min-w-0">
            <h1 className={`text-lg sm:text-xl font-black tracking-tight leading-snug ${themeConfig.textTitle}`}>
              {cleanTitle}
            </h1>

            <p className={`text-xs mt-1 leading-relaxed font-normal ${themeConfig.textDesc}`}>
              {profile.description}
            </p>

            {/* 특기 & 찜 뱃지 */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 ${
                themeConfig.isLight
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  : 'bg-indigo-900/60 border-indigo-700/50 text-amber-300'
              }`}>
                <Zap className="w-3 h-3 text-amber-500" />
                <span>핵심: {profile.highlightStats}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 ${
                themeConfig.isLight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
              }`}>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>찜: {pickedJobs.length}개</span>
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 육각형 성향 능력치 차트 (5열 - 크기 165px로 콤팩트화하여 세로 절반 축소) */}
        <div className={`md:col-span-5 p-2.5 rounded-2xl border flex flex-col items-center justify-center ${
          themeConfig.isLight 
            ? 'bg-slate-50/90 border-slate-200' 
            : 'bg-slate-900/60 border-indigo-800/40 backdrop-blur-xs'
        }`}>
          <div className="flex items-center gap-1 text-[11px] font-black mb-0.5">
            <span className="text-amber-500">📊</span>
            <span className={themeConfig.isLight ? 'text-slate-800' : 'text-slate-200'}>
              육각형 6대 능력치
            </span>
          </div>

          {/* 콤팩트 육각형 레이더 차트 (기존 270px -> 165px) */}
          <HexagonRadarChart
            stats={hexagonStats}
            theme={theme}
            size={165}
          />
        </div>

      </div>

      {/* Picked Dream Jobs Quick Bar (찜한 직업이 있을 때) */}
      {pickedJobs.length > 0 && (
        <div className={`mt-3 p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 relative z-10 ${
          themeConfig.isLight 
            ? 'bg-indigo-50/80 border-indigo-200' 
            : 'bg-indigo-950/80 border-amber-400/40'
        }`}>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span className={`text-xs font-bold ${themeConfig.isLight ? 'text-indigo-950' : 'text-amber-200'}`}>
              내가 찜한 꿈의 직업 ({pickedJobs.length}개):
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pickedJobs.map(job => (
              <button
                key={job.id}
                type="button"
                onClick={() => onSelectJob(job)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-transform active:scale-95 shadow-xs"
              >
                <span>{job.icon}</span>
                <span>{job.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📢 사용자 요청 안내 문구: 아래 추천 직업을 살펴보고 찜하기 안내 바 */}
      <div className={`mt-3 p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between gap-2.5 relative z-10 ${
        themeConfig.isLight 
          ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-2xs' 
          : 'bg-amber-950/40 border-amber-400/40 text-amber-200'
      }`}>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold">
          <span className="text-base animate-bounce">👇</span>
          <span>아래 추천 직업을 살펴보고 마음에 드는 직업을 찜(❤️)해주세요!</span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
          직업 카드를 누르면 상세 현실 정보가 열립니다
        </span>
      </div>

    </div>
  );
};

