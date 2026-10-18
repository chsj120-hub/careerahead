import React, { useState, useEffect } from 'react';
import { Job } from '../types/career';
import { getJobWorkforceStat } from '../data/workforceStats';
import { getTop10SalaryInfo } from '../data/top10SalaryCalculator';
import { 
  X, 
  DollarSign, 
  Clock, 
  MapPin, 
  Backpack, 
  AlertTriangle, 
  Heart, 
  TrendingUp, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen,
  Building,
  Users,
  Trophy,
  Award
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  isPicked: boolean;
  onTogglePick: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  isPicked,
  onTogglePick
}) => {
  const [showTierTooltip, setShowTierTooltip] = useState<boolean>(false);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  // 2026년 대한민국 평균 연봉 기준 (만원)
  const AVG_ENTRY_SALARY_2026 = 3500;
  const AVG_TEN_YEAR_SALARY_2026 = 5800;

  const entryDiff = job.moneyTruth.entrySalary - AVG_ENTRY_SALARY_2026;
  const entryRatio = (job.moneyTruth.entrySalary / AVG_ENTRY_SALARY_2026).toFixed(1);

  const tenYearDiff = job.moneyTruth.tenYearSalary - AVG_TEN_YEAR_SALARY_2026;
  const tenYearRatio = (job.moneyTruth.tenYearSalary / AVG_TEN_YEAR_SALARY_2026).toFixed(1);

  // 상위 10% 소득 통계 및 직업적 고점 데이터
  const top10Info = getTop10SalaryInfo(job);

  // 현재 한국 등록 직업인 수 (추정치) & 취업자 대비 비율 및 진입 난이도
  const workforce = getJobWorkforceStat(job.id, job.title, job.category);

  // 3대 메가트렌드 각각의 신호등 판정 로직
  // 1. 저출산/고령화 신호등
  let demoStatus: 'green' | 'yellow' | 'red' = 'yellow';
  let demoStatusText = '🟡 보통 (인구 구조 변화 적응)';
  let demoReason = '생산가능인구 감소에 따라 1인당 생산성과 숙련도가 더욱 귀해지는 흐름입니다.';

  if (job.category === 'high_prestige' && job.title.includes('교사')) {
    demoStatus = 'red';
    demoStatusText = '🔴 주의 (학령인구 감소 직격탄)';
    demoReason = '출생아 수 감소로 초중고 학급 수 및 신규 임용 TO가 축소되므로 성인 평생교육으로 외연 확장이 필요합니다.';
  } else if (job.tags.includes('medicine') || job.tags.includes('welfare') || job.tags.includes('animal') || job.id.includes('estate') || job.id.includes('pension')) {
    demoStatus = 'green';
    demoStatusText = '🟢 초유망 (초고령사회 진입 초대형 수혜)';
    demoReason = '65세 이상 실버 인구 급증으로 시니어 의료, 반려동물 케어, 자산 관리 수요가 장기적으로 폭발합니다.';
  }

  // 2. AI/자동화 신호등
  let aiStatus: 'green' | 'yellow' | 'red' = 'yellow';
  let aiStatusText = '🟡 협동 (AI 비서 도구 활용)';
  let aiReason = '단순 반복 업무는 AI가 돕고, 인간은 최종 판단과 깊은 정서적 소통에 집중합니다.';

  if (job.aiTrafficLight.status === 'partner') {
    aiStatus = 'green';
    aiStatusText = '🟢 초유망 (AI와 짝꿍·생산성 3배 폭발)';
    aiReason = job.aiTrafficLight.reason;
  } else if (job.aiTrafficLight.status === 'caution') {
    aiStatus = 'red';
    aiStatusText = '🔴 주의 (자동화 키오스크 대체 위험)';
    aiReason = job.aiTrafficLight.reason;
  }

  // 3. 기후변화/에너지 전환 신호등
  let climateStatus: 'green' | 'yellow' | 'red' = 'yellow';
  let climateStatusText = '🟡 보통 (ESG 친환경 기준 준수)';
  let climateReason = 'ESG 경영과 친환경 소비 트렌드를 반영하는 비즈니스 안목이 기본 역량으로 자리 잡습니다.';

  if (job.tags.includes('energy') || job.tags.includes('green') || job.id.includes('climate') || job.id.includes('plant') || job.id.includes('battery')) {
    climateStatus = 'green';
    climateStatusText = '🟢 초유망 (탄소중립·녹색성장 핵심 수혜)';
    climateReason = 'RE100, 탄소국경세, 전기차 배터리 대전환으로 글로벌 투자와 일자리가 전폭적으로 늘어납니다.';
  } else if (job.tags.includes('local_industry') && (job.id.includes('petro') || job.id.includes('steel'))) {
    climateStatus = 'yellow';
    climateStatusText = '🟡 전환기 (저탄소 수소 공정 탈바꿈 필요)';
    climateReason = '기존 고탄소 화석연료 공정을 친환경 수소 환원 제철 및 바이오 나프타로 혁신하는 핵심 인재 수요가 유지됩니다.';
  }

  // 외부 연동 링크
  const careerNetSearchUrl = `https://www.career.go.kr/cnet/front/web/search/searchList.do?searchWord=${encodeURIComponent(job.title)}`;
  const worknetSearchUrl = `https://www.work.go.kr/consltJobCarpa/srch/jobInfoSrch/srchJobInfo.do?keyword=${encodeURIComponent(job.title)}`;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(job.title + ' 직업 진로 연봉 자격증')}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header (RPG Item Header) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 relative border-b-2 border-indigo-500/30">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pr-8 sm:pr-10">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-400 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                  {job.icon}
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                    {job.categoryName}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {job.badge}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {job.title}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200 mt-0.5 line-clamp-1">
                  {job.summary}
                </p>
              </div>
            </div>

            {/* Pick Button */}
            <button
              onClick={() => onTogglePick(job)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all shrink-0 w-full sm:w-auto min-h-[44px] ${
                isPicked 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-900/40 ring-2 ring-rose-300' 
                  : 'bg-white text-slate-900 hover:bg-slate-100 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isPicked ? 'fill-white' : ''}`} />
              <span>{isPicked ? '내 꿈으로 찜 완료! ⭐' : '내 꿈으로 찜하기'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: 5대 Q&A 템플릿 */}
        <div className="p-4 sm:p-7 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-slate-50/50">
          
          {/* ① 💰 어른들이 말하는 돈의 진실 (2026 대한민국 평균 연봉 실시간 비교 인포그래픽) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
                <DollarSign className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900">
                  1. 어른들이 말하는 돈의 진실 (소득 스펙트럼)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  2026년 대한민국 직장인 평균치와 나란히 비교해 감을 잡아보세요!
                </p>
              </div>
            </div>

            {/* Salary Comparison 3-Column Cards (초봉, 10년차, 상위 10% 고점) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
              
              {/* ① 초봉 카드 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-white border-2 border-indigo-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-indigo-900 font-bold mb-1">
                    <span>사회초년생 시작 초봉</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      신입 기준
                    </span>
                  </div>
                  
                  {/* Big Number */}
                  <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">
                    연 {job.moneyTruth.entrySalary.toLocaleString()}만 원
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    (월 실수령액 약 {Math.round(job.moneyTruth.entrySalary / 12 * 0.88).toLocaleString()}만 원)
                  </span>
                </div>

                {/* 2026 한국 대졸 신입 평균(3,500만) 비교 배지 */}
                <div className="mt-3 pt-3 border-t border-indigo-100">
                  <div className="text-[10px] text-slate-500 flex items-center justify-between mb-1">
                    <span>2026 신입 평균(3,500만)</span>
                  </div>
                  <div className={`p-1.5 px-2 rounded-lg text-[11px] font-black flex items-center justify-between ${
                    entryDiff >= 0 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    <span>평균 대비:</span>
                    <span>
                      {entryDiff >= 0 ? `+${entryDiff.toLocaleString()}만 (${entryRatio}배 🚀)` : `${entryDiff.toLocaleString()}만 (수련 🌱)`}
                    </span>
                  </div>
                </div>
              </div>

              {/* ② 10년차 소득 카드 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-white border-2 border-emerald-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
                    <span>10년 차 숙련 소득</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      베테랑 기준
                    </span>
                  </div>

                  {/* Big Number */}
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                    연 {job.moneyTruth.tenYearSalary.toLocaleString()}만 원
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    (월 실수령액 약 {Math.round(job.moneyTruth.tenYearSalary / 12 * 0.82).toLocaleString()}만 원)
                  </span>
                </div>

                {/* 2026 한국 10년차 평균(5,800만) 비교 배지 */}
                <div className="mt-3 pt-3 border-t border-emerald-100">
                  <div className="text-[10px] text-slate-500 flex items-center justify-between mb-1">
                    <span>2026 10년차 평균(5,800만)</span>
                  </div>
                  <div className={`p-1.5 px-2 rounded-lg text-[11px] font-black flex items-center justify-between ${
                    tenYearDiff >= 0 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    <span>평균 대비:</span>
                    <span>
                      {tenYearDiff >= 0 ? `+${tenYearDiff.toLocaleString()}만 (${tenYearRatio}배 🌟)` : `${tenYearDiff.toLocaleString()}만`}
                    </span>
                  </div>
                </div>
              </div>

              {/* ③ 👑 직업별 상위 10%의 고점 (편견 깨기 하이라이트) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-purple-50/80 via-white to-amber-50/40 border-2 border-purple-300 shadow-md flex flex-col justify-between relative overflow-hidden ring-1 ring-purple-200">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-300/30 to-purple-400/20 rounded-bl-full pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between text-xs text-purple-950 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>상위 10%의 고점</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-black">
                      TOP 10%
                    </span>
                  </div>

                  {/* Big Number */}
                  <div className="text-xl sm:text-2xl font-black text-purple-800 mt-1 flex items-baseline gap-1">
                    <span>연 {top10Info.salary.toLocaleString()}만 원</span>
                    <span className="text-xs text-purple-600 font-extrabold">이상</span>
                  </div>
                  <span className="text-[11px] text-purple-700 font-bold block mt-0.5">
                    (초봉의 {top10Info.ratioVsEntry}배 · 10년차의 {top10Info.ratioVsTenYear}배 도약 🚀)
                  </span>
                </div>

                {/* 상위 10% 등급 배지 & 전국 10% 기준선 비교 */}
                <div className="mt-3 pt-3 border-t border-purple-100">
                  <div className="text-[10px] text-purple-900 flex items-center justify-between mb-1 font-semibold">
                    <span>{top10Info.levelBadge}</span>
                  </div>
                  <div className="p-1.5 px-2 rounded-lg text-[11px] font-black bg-gradient-to-r from-purple-100 to-amber-100 text-purple-950 border border-purple-200 flex items-center justify-between">
                    <span>전국 상위 10%(1.1억) 대비:</span>
                    <span>
                      {top10Info.diffVsNationalAvg >= 0 
                        ? `+${top10Info.diffVsNationalAvg.toLocaleString()}만 👑` 
                        : `${top10Info.diffVsNationalAvg.toLocaleString()}만`}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 🌟 직업에 대한 편견을 깨는 상위 10% 멘토링 가이드 카드 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/70 to-pink-50/60 border-2 border-purple-200 shadow-sm mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-purple-950 text-sm">
                      💡 직업의 고점 탐색: &quot;어떤 직업이든 상위 10%의 고수가 되면 세상이 달라집니다!&quot;
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-200 text-purple-800 font-bold">
                      직업 편견 타파
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-indigo-900 font-bold">🎯 상위 10% 도약의 비결: </strong>
                    {top10Info.howToReach}
                  </p>
                  <p className="text-purple-900 font-medium bg-white/70 p-2.5 rounded-xl border border-purple-100 leading-relaxed">
                    🌈 <strong>선생님의 응원 한마디:</strong> {top10Info.encouragement}
                  </p>
                </div>
              </div>
            </div>

            {/* 성과급 & 리스크 */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
                <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 text-sm">성과급 & 보너스 변동폭: </span>
                  <span className="text-amber-900 leading-relaxed">{job.moneyTruth.peakBonus}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-950 text-sm">냉정한 현실 & 위험: </span>
                  <span className="text-rose-900 leading-relaxed">{job.moneyTruth.risk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ② ⏱️ 준비 기간 및 시작 가능 나이 + 👥 우리나라에서 이 직업을 가진 사람은 몇 명이나 될까? */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-800 font-bold">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
              <div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900">
                  2. 준비 기간, 시작 가능 나이 & 전국 종사자 수
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  얼마나 오래 걸리고, 우리나라에서 과연 몇 명이나 이 일을 하고 있을까요?
                </p>
              </div>
            </div>

            {/* 준비 단계 & 최소 시작 나이 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-indigo-900">필요 준비 단계 (걸음):</span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-sm">
                  {job.prepPeriod.stepBadge}
                </span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-sky-900">최소 시작 가능 연령:</span>
                <span className="px-3 py-1.5 rounded-full bg-sky-600 text-white font-extrabold text-xs sm:text-sm shadow-sm">
                  만 {job.prepPeriod.minAge}세부터
                </span>
              </div>
            </div>

            {/* 필수 학위 및 자격증 */}
            <div className="text-xs sm:text-sm text-slate-700 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900">🎓 필수 학위 및 자격증: </span>
              <span className="font-medium text-slate-800">{job.prepPeriod.licenseOrDegree}</span>
            </div>

            {/* 🔥 [인포그래픽] 우리나라에서 이 직업을 가진 사람은 몇 명이나 될까? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white shadow-md border border-indigo-700/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/30 text-indigo-300">
                    <Users className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
                      우리나라에서 이 직업을 가진 사람은 몇 명이나 될까?
                    </h4>
                    <p className="text-[11px] sm:text-xs text-indigo-200/80">
                      2026년 대한민국 총 취업자 2,850만 명 중 등록·종사자 수 및 희소성 지표
                    </p>
                  </div>
                </div>
                {/* 상위 희소성 뱃지 & 호버/클릭 등급 비교 툴팁 */}
                <div className="relative group/tier">
                  <button
                    type="button"
                    onClick={() => setShowTierTooltip(!showTierTooltip)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border-2 ${
                      workforce.tierColor === 'purple' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-300' :
                      workforce.tierColor === 'indigo' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-300' :
                      workforce.tierColor === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-300' :
                      workforce.tierColor === 'amber' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300' :
                      'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-blue-300'
                    }`}
                  >
                    <span className="text-sm">✨</span>
                    <span>{workforce.tierBadge}</span>
                    <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded-full font-bold ml-0.5">등급 비교 ℹ️</span>
                  </button>

                  {/* 전체 5단계 직업 희소성 비교 팝오버 툴팁 */}
                  <div className={`absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-2xl bg-slate-950/95 text-white shadow-2xl border-2 border-indigo-500/60 z-50 transition-all duration-200 backdrop-blur-md ${
                    showTierTooltip 
                      ? 'opacity-100 visible pointer-events-auto' 
                      : 'opacity-0 invisible group-hover/tier:opacity-100 group-hover/tier:visible pointer-events-none group-hover/tier:pointer-events-auto'
                  }`}>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                      <span className="font-black text-xs text-amber-300 flex items-center gap-1">
                        🏆 전체 5단계 직업 희소성 비교표
                      </span>
                      <span className="text-[10px] text-slate-400">총 2,850만 명 기준</span>
                    </div>

                    <div className="space-y-1.5 mt-2.5 text-[11px]">
                      {/* 1. 💎 */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between ${
                        workforce.tierBadge.includes('💎')
                          ? 'bg-purple-900/80 border-purple-400 text-purple-100 font-black ring-1 ring-purple-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}>
                        <span>💎 극희소 (상위 0.01% 이하)</span>
                        <span className="text-[10px] text-purple-300">도선사·판사</span>
                      </div>

                      {/* 2. 🏆 */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between ${
                        workforce.tierBadge.includes('🏆')
                          ? 'bg-indigo-900/80 border-indigo-400 text-indigo-100 font-black ring-1 ring-indigo-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}>
                        <span>🏆 최고 전문직 (0.01%~0.1%)</span>
                        <span className="text-[10px] text-indigo-300">변리사·파일럿</span>
                      </div>

                      {/* 3. 🥇 */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between ${
                        workforce.tierBadge.includes('🥇')
                          ? 'bg-blue-900/80 border-blue-400 text-blue-100 font-black ring-1 ring-blue-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}>
                        <span>🥇 전문 면허·기술 (0.1%~1.0%)</span>
                        <span className="text-[10px] text-blue-300">의사·엔지니어</span>
                      </div>

                      {/* 4. 🥈 */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between ${
                        workforce.tierBadge.includes('🥈')
                          ? 'bg-teal-900/80 border-teal-400 text-teal-100 font-black ring-1 ring-teal-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}>
                        <span>🥈 산업 주력군 (1.0%~3.0%)</span>
                        <span className="text-[10px] text-teal-300">교사·SW개발자</span>
                      </div>

                      {/* 5. 🥉 */}
                      <div className={`p-2 rounded-xl border flex items-center justify-between ${
                        workforce.tierBadge.includes('🥉')
                          ? 'bg-amber-900/80 border-amber-400 text-amber-100 font-black ring-1 ring-amber-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}>
                        <span>🥉 대중적 진입 & 청년 크루</span>
                        <span className="text-[10px] text-amber-300">바리스타·크루</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/80 text-[10px] text-slate-300">
                      💡 <strong className="text-white">[{job.title}]</strong> 직업은 5단계 중 <span className="text-amber-300 font-bold">{workforce.tierBadge}</span> 위치입니다.
                    </div>
                  </div>
                </div>
              </div>

              {/* 종사자 수 & 일하는 사람 중 비율 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. 전국 등록·활동 인원 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                  <span className="text-xs text-slate-300 font-semibold mb-1">
                    현재 한국 등록·활동 직업인 수 (추정치)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 my-1">
                    {workforce.countText}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    전국 활동 인원 약 {workforce.count.toLocaleString()}명
                  </span>
                </div>

                {/* 2. 일하는 사람 중 비율 */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                  <span className="text-xs text-slate-300 font-semibold mb-1">
                    대한민국 일하는 사람 중 비율 (%)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300 my-1">
                    {workforce.ratioText}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    🎯 {workforce.oneInText}
                  </span>
                </div>
              </div>

              {/* 학생 눈높이 설명 (게이지 제거 후 깔끔한 카드) */}
              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-base shrink-0">💬</span>
                  <div>
                    <span className="font-bold text-amber-300">"{workforce.kidComment}"</span>
                    <p className="text-[11px] text-indigo-300 mt-1 font-mono">
                      ※ {workforce.difficultySummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ③ 📍 지역 현실성 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  3. 지역 현실성 (어디서 일할 수 있을까?)
                </h3>
                <p className="text-xs text-slate-500">
                  수도권 집중 vs 전국 고른 분포 vs 지방 특화
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>수도권(서울/경기) 일자리 비율</span>
                <span className="text-indigo-600">{job.locationReality.capitalRatio}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
                <div 
                  className="bg-indigo-600 h-full rounded-l-full" 
                  style={{ width: `${job.locationReality.capitalRatio}%` }}
                />
                <div 
                  className="bg-emerald-500 h-full rounded-r-full" 
                  style={{ width: `${100 - job.locationReality.capitalRatio}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>수도권 ({job.locationReality.capitalRatio}%)</span>
                <span>지방 및 전국 ({100 - job.locationReality.capitalRatio}%)</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-3 bg-white p-3 rounded-lg border border-slate-200/80">
                📍 {job.locationReality.desc}
              </p>
            </div>
          </div>

          {/* ④ 🌐 미래 유망 3대 수치 각각 신호등 제공 (글자 크기 확대 & 또렷한 인포그래픽) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-800 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900">
                  4. 미래 유망 3대 수치 개별 신호등 & 직업 안전도
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  저출산·고령화, AI 자동화, 기후위기 3대 미래 변화에 대한 개별 신호등입니다.
                </p>
              </div>
            </div>

            {/* 3대 메가트렌드 각각의 신호등 카드 (글씨 큼직하게) */}
            <div className="space-y-3.5">
              
              {/* 1. 저출산 & 고령화 신호등 */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👶</span>
                    <span className="font-black text-sm sm:text-base text-rose-950">
                      [지표 1] 저출산 & 초고령화 영향
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                    demoStatus === 'green' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    demoStatus === 'yellow' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {demoStatusText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium mt-1">
                  {demoReason}
                </p>
              </div>

              {/* 2. AI & 디지털 자동화 신호등 */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤖</span>
                    <span className="font-black text-sm sm:text-base text-blue-950">
                      [지표 2] AI & 로봇 자동화 영향
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                    aiStatus === 'green' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    aiStatus === 'yellow' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {aiStatusText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium mt-1">
                  {aiReason}
                </p>
              </div>

              {/* 3. 기후변화 & 친환경 신호등 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌍</span>
                    <span className="font-black text-sm sm:text-base text-emerald-950">
                      [지표 3] 기후위기 & 탄소중립 전환 영향
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                    climateStatus === 'green' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                    climateStatus === 'yellow' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {climateStatusText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium mt-1">
                  {climateReason}
                </p>
              </div>

            </div>
          </div>

          {/* ⑤ 🎒 지금 초·중학생 때의 액션 플랜 */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-5 border-2 border-indigo-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <span className="p-2 rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
                <Backpack className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-indigo-950">
                  5. 지금 초·중학생 때의 액션 플랜 ⭐
                </h3>
                <p className="text-xs text-indigo-600 font-medium">
                  지금 내 방에서 바로 시작해볼 수 있는 3단계 실천 가이드
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm flex items-start gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">추천 교과 공부</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{job.actionPlanForYouth.studyTip}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm flex items-start gap-3">
                <span className="text-xl">🎪</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">추천 동아리 및 활동</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{job.actionPlanForYouth.clubActivity}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm flex items-start gap-3">
                <span className="text-xl">💻</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-indigo-700 flex items-center gap-1.5">
                    오늘 바로 해보는 무료 툴 & 체험
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{job.actionPlanForYouth.freeTool}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 🔗 [신규] 더 깊이 알아보기 공식 연계 링크 존 */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> 더 알아보고 싶은 친구들을 위한 공식 직업 정보망 링크:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">새 탭에서 열림</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* 커리어넷 링크 */}
              <a
                href={careerNetSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-bold text-indigo-200 transition-colors group"
              >
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" /> 커리어넷 직업백과
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              {/* 워크넷 링크 */}
              <a
                href={worknetSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-300 transition-colors group"
              >
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> 워크넷 직업정보
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              {/* 구글 검색 링크 */}
              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-sky-300 transition-colors group"
              >
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" /> 구글 최신 진로 검색
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            공식 분류 코드: {job.careerNetCode || 'CN-GEN-00'} · 한국고용정보원 연계
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs sm:text-sm hover:bg-slate-700 transition-colors ml-auto"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
