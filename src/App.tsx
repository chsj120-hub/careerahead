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

import { Sparkles, Compass, ArrowRight, QrCode, Database } from 'lucide-react';

export function App() {
  // App Navigation & Modals
  const [currentTab, setCurrentTab] = useState<'survey' | 'explore' | 'result'>('explore');
  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isUnregisteredOpen, setIsUnregisteredOpen] = useState<boolean>(false);
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [unregisteredKeyword, setUnregisteredKeyword] = useState<string>('');
  
  // Selected Job for Detail Modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // User State
  const [profile, setProfile] = useState<CharacterProfile | null>(() => {
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
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-900 text-white p-5 sm:p-10 shadow-xl overflow-hidden border-4 border-indigo-300/40">
            <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs">
                <Sparkles className="w-3.5 h-3.5" /> 3분 만에 찾는 내 미래 진로 캐릭터
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                재미있는 게임처럼 찾는<br />
                <span className="text-amber-300">데이터 기반 현실 진로</span>: 내일찾기
              </h1>

              <p className="text-xs sm:text-base text-indigo-100 leading-relaxed">
                딱딱한 사전식 정보는 이제 그만! 최고 연봉 전문직부터 지방 거점 고연봉, 과학·수학 미래 테크, 
                골목 자영업과 재택 프리랜서까지 100개 직업의 진짜 현실을 투명하게 알려드립니다.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => setIsSurveyOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm sm:text-base hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 active:scale-95 w-full sm:w-auto"
                >
                  <span>나의 성향 캐릭터 8단계 테스트 시작</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsQROpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-bold text-xs sm:text-sm border border-amber-300/40 transition-colors shrink-0"
                >
                  <QrCode className="w-4 h-4 text-amber-300" />
                  <span>교사용 학생 접속 QR 📱</span>
                </button>

                <button
                  onClick={() => setCurrentTab('explore')}
                  className="px-4 py-3 rounded-2xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm border border-indigo-400/30 transition-colors shrink-0"
                >
                  100개 직업 대도감 둘러보기
                </button>
              </div>
            </div>
          </div>
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

        {/* TAB 2: EXPLORE ALL 50 JOBS VIEW */}
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

    </div>
  );
}
export default App;
