import React, { useState, useEffect } from 'react';
import { JOBS_DATABASE } from './data/jobsData';
import { generateCharacterProfile8 } from './data/surveyData';
import { Job, CharacterProfile, SurveyState8 } from './types/career';

// Components
import { Header } from './components/Header';
import { SurveyStepModal } from './components/SurveyStepModal';
import { CharacterProfileCard } from './components/CharacterProfileCard';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { LivingCostSlider } from './components/LivingCostSlider';
import { ShareableResultCard } from './components/ShareableResultCard';
import { ExploreJobsView } from './components/ExploreJobsView';
import { UnregisteredJobModal } from './components/UnregisteredJobModal';
import { QRCodeModal } from './components/QRCodeModal';

import { Sparkles, Compass, ArrowRight, QrCode, Database, Search, User } from 'lucide-react';

export function App() {
  // URL 딥링크 공유 파라미터 파싱
  const getSharedProfileFromUrl = (): CharacterProfile | null => {
    if (typeof window === 'undefined') return null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('share') === '1') {
        const code = urlParams.get('code') || '[T-L-O]';
        const title = urlParams.get('title') || '미래를 여는 탐험가';
        const avatar = urlParams.get('avatar') || '🌟';
        const c = Number(urlParams.get('c')) || 85;
        const l = Number(urlParams.get('l')) || 88;
        const e = Number(urlParams.get('e')) || 82;
        const g = Number(urlParams.get('g')) || 90;
        const t = Number(urlParams.get('t')) || 86;
        const lead = Number(urlParams.get('lead')) || 84;

        return {
          code,
          title,
          avatar,
          description: '친구로부터 공유받은 진로 성향 리포트 카드입니다.',
          highlightStats: '육각형 성향 능력치',
          stats: {
            creativity: c,
            logic: l,
            communication: e,
            grit: g,
            tech: t,
            leadership: lead
          },
          recommendedJobs: JOBS_DATABASE.slice(0, 6)
        };
      }
    } catch {
      // silent
    }
    return null;
  };

  // App Navigation & Modals: 기본 첫 접속 화면은 'home'
  const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'result'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('share') === '1') return 'result';
    }
    return 'home';
  });

  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('share') === '1') return true;
    }
    return false;
  });
  const [isUnregisteredOpen, setIsUnregisteredOpen] = useState<boolean>(false);
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [unregisteredKeyword, setUnregisteredKeyword] = useState<string>('');
  
  // Selected Job for Detail Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // User State
  const [profile, setProfile] = useState<CharacterProfile | null>(() => {
    const shared = getSharedProfileFromUrl();
    if (shared) return shared;
    try {
      const saved = localStorage.getItem('career_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pickedJobIds, setPickedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_picked_job_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Picked Jobs Objects
  const pickedJobs = JOBS_DATABASE.filter(j => pickedJobIds.includes(j.id));

  // Sync to LocalStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('career_user_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('career_picked_job_ids', JSON.stringify(pickedJobIds));
  }, [pickedJobIds]);

  // Handle Survey Completion
  const handleCompleteSurvey = (survey: SurveyState8) => {
    const newProfile = generateCharacterProfile8(survey);
    setProfile(newProfile);
    setIsSurveyOpen(false);
    setCurrentTab('result');
  };

  // Toggle Pick
  const handleTogglePick = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (pickedJobIds.includes(job.id)) {
      setPickedJobIds(pickedJobIds.filter(id => id !== job.id));
    } else {
      setPickedJobIds([...pickedJobIds, job.id]);
    }
  };

  // Open Unregistered Request
  const handleRequestMissingJob = (keyword: string) => {
    setUnregisteredKeyword(keyword);
    setIsUnregisteredOpen(true);
  };

  // Reset to Home
  const handleResetToHome = () => {
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header (제목 클릭 시 홈으로 초기화, 버튼 일원화) */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onResetToHome={handleResetToHome}
        hasProfile={!!profile}
        onRestartSurvey={() => setIsSurveyOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        
        {/* VIEW 1: HOME START SCREEN (정보량 과잉 방지 & 큼직한 3대 진입 버튼) */}
        {currentTab === 'home' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            
            {/* 검은 테두리의 내일찾기 시작 설명 배너 (새로고침/결과 후에도 항상 유지!) */}
            <section 
              aria-labelledby="hero-heading"
              className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl overflow-hidden border-2 border-slate-700/80"
            >
              {/* Ambient Lighting */}
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" aria-hidden="true" />
              <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

              <div className="max-w-3xl relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md">
                  <Sparkles className="w-4 h-4 text-slate-950" aria-hidden="true" />
                  <span>3분 만에 찾는 내 미래 진로 캐릭터</span>
                </div>

                <h1 id="hero-heading" className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                  재미있는 퀘스트로 찾는<br />
                  <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy">데이터 기반 현실 진로</span>: 내일찾기
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                  딱딱한 사전식 정보 대신, 최고 연봉 전문직부터 지방 거점 고연봉, 과학·수학 미래 테크, 
                  골목 자영업과 재택 프리랜서까지 <strong>100개 직업의 진짜 현실</strong>을 투명하게 알려드립니다.
                </p>

                {/* 이전에 완료한 검사 결과가 있는 경우 안내 카드 */}
                {profile && (
                  <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-1 bg-slate-800 rounded-xl border border-indigo-500/30">{profile.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">저장된 내 캐릭터</span>
                          <span className="text-xs text-indigo-200 font-mono">{profile.code}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white mt-0.5">{profile.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setCurrentTab('result')}
                        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        내 결과 바로 확인하기 ✨
                      </button>
                    </div>
                  </div>
                )}

                {/* 3대 핵심 진입 CTA 버튼 (크고 시원하게 배치) */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                  {/* 버튼 1: 8단계 테스트 시작 (메인 추천 버튼, 7열) */}
                  <button
                    type="button"
                    onClick={() => setIsSurveyOpen(true)}
                    className="sm:col-span-7 flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black transition-all shadow-xl shadow-amber-400/25 active:scale-95 cursor-pointer border-2 border-amber-300 group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center text-xl shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        🚀
                      </div>
                      <div>
                        <div className="text-base sm:text-lg font-black leading-tight text-slate-950">
                          {profile ? '진로 성향 테스트 다시하기' : '나의 성향 캐릭터 테스트 시작'}
                        </div>
                        <div className="text-xs text-slate-800 font-bold mt-0.5">
                          8단계 퀘스트로 내 육각형 능력치 찾기 (약 3분 소요)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-slate-950 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>

                  {/* 버튼 2: 100개 직업 도감 둘러보기 (5열) */}
                  <button
                    type="button"
                    onClick={() => setCurrentTab('explore')}
                    className="sm:col-span-5 flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition-all shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer border border-indigo-400/40 group text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                      📖
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-black leading-tight">
                        100개 직업 도감 둘러보기
                      </div>
                      <div className="text-xs text-indigo-200 font-medium mt-0.5">
                        연봉·전망·준비기간 자유 검색
                      </div>
                    </div>
                  </button>
                </div>

                {/* 하단 보조: 교사용 QR 모달 열기 버튼 */}
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsQROpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" aria-hidden="true" />
                    <span>선생님 전용: 학생 단체 접속용 큰 QR 화면 띄우기 📱</span>
                  </button>
                </div>

              </div>
            </section>

            {/* 홈 화면 안내 카드 3종 (시작부터 직업 리스트가 쏟아지지 않아 정보 과잉 해소) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-black">
                  🎯
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">8단계 맞춤형 퀘스트</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  단순 성적순이 아닌, 나의 흥미와 강점, 워라밸과 가치관을 8개 선택형 질문으로 분석합니다.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl font-black">
                  📊
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">육각형 6대 능력치 차트</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  창의력, 논리력, 소통력, 끈기, 디지털, 리더십 등 내 숨은 역량 밸런스를 한눈에 시각화합니다.
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-black">
                  💰
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">2026 현실 데이터 연계</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  한국고용정보원 커리어넷·워크넷 공식 데이터를 바탕으로 초임·10년차·상위10% 연봉을 투명하게 안내합니다.
                </p>
              </div>
            </div>

            {/* 전체 도감 바로가기 배너 */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">어떤 직업들이 있는지 바로 둘러보고 싶으신가요?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">키워드 검색과 카테고리 필터로 100개 직업을 자유롭게 탐색할 수 있습니다.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('explore')}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 font-extrabold text-xs sm:text-sm border border-slate-300 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                100개 직업 도감 열기 →
              </button>
            </div>

          </div>
        )}

        {/* VIEW 2: RESULT & CHARACTER STAT VIEW (검사 완료 후 결과 화면) */}
        {currentTab === 'result' && profile && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* 1. RPG Status Window Profile Card */}
            <CharacterProfileCard
              profile={profile}
              pickedJobs={pickedJobs}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onSelectJob={(job) => setSelectedJob(job)}
            />

            {/* 2. Tailored Recommendations for Character */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{profile.title}님을 위한 맞춤 추천 직업</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Top 8 Matching
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    선택하신 흥미와 강점, 가치관 데이터가 최적으로 매칭된 직업 리스트입니다. 카드를 눌러 상세 정보를 확인해보세요!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.recommendedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isPicked={pickedJobIds.includes(job.id)}
                    onTogglePick={handleTogglePick}
                    onSelect={(j) => setSelectedJob(j)}
                  />
                ))}
              </div>
            </div>

            {/* 3. 친절 안내 배너: 마음에 드는 직업이 없을 때 도감 둘러보기 & 다시하기 */}
            <section 
              aria-labelledby="explore-more-heading"
              className="rounded-3xl bg-gradient-to-br from-indigo-50 via-amber-50/50 to-indigo-50 p-6 sm:p-8 border-2 border-indigo-200/80 shadow-sm text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md">
                🔍
              </div>
              <div className="max-w-xl mx-auto space-y-1.5">
                <h3 id="explore-more-heading" className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  추천된 8개 직업 중에 마음에 쏙 드는 직업이 없으신가요?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  괜찮아요! 세상에는 8개 추천 직업 외에도 흥미진진한 일들이 무궁무진합니다.<br className="hidden sm:inline" />
                  <strong>100개 직업 전체 도감</strong>에서 키워드 검색, 연봉, 워라밸, 미래 유망도를 자유롭게 둘러보며 나만의 꿈을 찾아 찜해보세요!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Search className="w-5 h-5 text-amber-300" />
                  <span>100개 직업 전체 도감 둘러보기 & 검색</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSurveyOpen(true)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>🔄 설문 다시 진행하기</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToHome}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>🏠 처음 화면으로</span>
                </button>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 3: EXPLORE ALL 100 JOBS VIEW (도감 탐색 화면) */}
        {currentTab === 'explore' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <ExploreJobsView
              jobs={JOBS_DATABASE}
              pickedJobIds={pickedJobIds}
              onTogglePick={handleTogglePick}
              onSelectJob={(j) => setSelectedJob(j)}
              onRequestMissingJob={handleRequestMissingJob}
            />

            {/* Living Cost Slider for curious browsers */}
            <LivingCostSlider />

          </div>
        )}

      </main>


      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>내일찾기 (CareerPath Finder)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>한국고용정보원 커리어넷·워크넷 공공 진로 데이터 연계</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-400 leading-relaxed">
            <div>
              <p className="font-semibold text-slate-300 mb-1">
                공공 데이터 연계 및 분기별 자동화 안내:
              </p>
              <p>
                본 플랫폼은 매 분기(3개월 단위) 새롭게 발표되는 고용 동향, AI 기술 대체율 및 신규 직업 트렌드를 
                로컬 고효율 데이터베이스에 자동 반영하여 정보의 최신성을 유지합니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-300 mb-1">
                오픈소스 교육 라이선스:
              </p>
              <p>
                전국 초·중학교 진로 진학 상담실 및 청소년 수련 시설에서 교육 목적으로 누구나 무료로 활용할 수 있는 
                오픈소스 진로 탐색 시스템입니다.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center text-slate-400 text-[10px]">
            © 2026 내일찾기 (CareerPath Finder) V5. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SurveyStepModal
        isOpen={isSurveyOpen}
        onClose={() => setIsSurveyOpen(false)}
        onComplete={handleCompleteSurvey}
      />

      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        isPicked={selectedJob ? pickedJobIds.includes(selectedJob.id) : false}
        onTogglePick={(j) => handleTogglePick(j)}
      />

      {profile && (
        <ShareableResultCard
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          profile={profile}
          pickedJobs={pickedJobs}
        />
      )}

      <UnregisteredJobModal
        isOpen={isUnregisteredOpen}
        onClose={() => setIsUnregisteredOpen(false)}
        initialKeyword={unregisteredKeyword}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

      {/* 📱 Mobile Fixed Bottom Navigation Bar (한 손 엄지손가락 내비게이션 지원) */}
      <nav 
        aria-label="모바일 하단 내비게이션"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg"
      >
        {/* 1. 홈 처음으로 */}
        <button
          type="button"
          onClick={handleResetToHome}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'home'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Compass className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px]">처음으로</span>
        </button>

        {/* 2. 8단계 테스트 플로팅 버튼 */}
        <button
          type="button"
          onClick={() => setIsSurveyOpen(true)}
          className="flex flex-col items-center gap-1 -mt-5 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black p-2.5 rounded-full shadow-lg shadow-amber-400/30 border-4 border-white active:scale-95 transition-transform cursor-pointer"
          aria-label="8단계 진로 퀘스트 테스트 시작"
        >
          <Sparkles className="w-5 h-5 text-slate-950" aria-hidden="true" />
          <span className="text-[10px] font-black px-1">테스트</span>
        </button>

        {/* 3. 직업 도감 */}
        <button
          type="button"
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'explore'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px]">직업 도감</span>
        </button>

        {/* 4. 내 결과 */}
        {profile && (
          <button
            type="button"
            onClick={() => setCurrentTab('result')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              currentTab === 'result'
                ? 'text-amber-600 font-extrabold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span className="text-[11px]">내 결과</span>
          </button>
        )}
      </nav>

    </div>
  );
}
export default App;
