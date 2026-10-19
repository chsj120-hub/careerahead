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

  // App Navigation & Modals
  const [currentTab, setCurrentTab] = useState<'survey' | 'explore' | 'result'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('share') === '1') return 'result';
    }
    return 'explore';
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'survey') {
            setIsSurveyOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        hasProfile={!!profile}
        onRestartSurvey={() => setIsSurveyOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        
        {/* Hero Banner (Shown if no profile or in explore mode) */}
        {!profile && (
          <section 
            aria-labelledby="hero-heading"
            className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800"
          >
            {/* Ambient Lighting */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" aria-hidden="true" />
            <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-slate-950" aria-hidden="true" />
                <span>3분 만에 찾는 내 미래 진로 캐릭터</span>
              </div>

              <h1 id="hero-heading" className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                재미있는 퀘스트로 찾는<br />
                <span className="text-amber-300">데이터 기반 현실 진로</span>: 내일찾기
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
                딱딱한 사전식 정보 대신, 최고 연봉 전문직부터 지방 거점 고연봉, 과학·수학 미래 테크, 
                골목 자영업과 재택 프리랜서까지 <strong>100개 직업의 진짜 현실</strong>을 투명하게 알려드립니다.
              </p>

              {/* Primary & Secondary CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSurveyOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base transition-all shadow-md shadow-amber-400/25 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-300 w-full sm:w-auto"
                >
                  <span>나의 성향 캐릭터 8단계 테스트 시작</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsQROpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <QrCode className="w-4 h-4 text-amber-300" aria-hidden="true" />
                  <span>교사용 학생 접속 QR 📱</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('explore')}
                  className="px-4 py-3.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 font-bold text-xs sm:text-sm border border-indigo-400/30 transition-colors shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  100개 직업 도감 둘러보기
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 1: RESULT & CHARACTER STAT VIEW */}
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
                    선택하신 흥미와 강점, 가치관 데이터가 최적으로 매칭된 직업 리스트입니다.
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

          </div>
        )}

        {/* TAB 2: EXPLORE ALL 110 JOBS VIEW */}
        {(currentTab === 'explore' || (!profile && currentTab === 'result')) && (
          <div className="space-y-8">
            
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
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg"
      >
        {/* 1. 직업 도감 */}
        <button
          type="button"
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            currentTab === 'explore'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px]">직업 도감</span>
        </button>

        {/* 2. 성향 테스트 CTA 플로팅 버튼 */}
        <button
          type="button"
          onClick={() => setIsSurveyOpen(true)}
          className="flex flex-col items-center gap-1 -mt-5 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black p-2.5 rounded-full shadow-lg shadow-amber-400/30 border-4 border-white active:scale-95 transition-transform"
          aria-label="8단계 진로 퀘스트 테스트 시작"
        >
          <Sparkles className="w-5 h-5 text-slate-950" aria-hidden="true" />
          <span className="text-[10px] font-black px-1">퀘스트</span>
        </button>

        {/* 3. 내 캐릭터/결과 */}
        <button
          type="button"
          onClick={() => {
            if (profile) setCurrentTab('result');
            else setIsSurveyOpen(true);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
            currentTab === 'result'
              ? 'text-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <User className="w-5 h-5" aria-hidden="true" />
          <span className="text-[11px]">{profile ? '내 캐릭터' : '결과 보기'}</span>
        </button>
      </nav>

    </div>
  );
}
export default App;
