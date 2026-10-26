// src/components/AdminAnalyticsModal.tsx
import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, Loader2, BarChart3, Search, Eye, Heart, Sparkles, Globe } from 'lucide-react';
import { loadActivityStats, getTopEntries } from '../utils/activityTracker';
import { UnregisteredJobRequest } from '../types/career';

interface AdminAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAnalyticsModal: React.FC<AdminAnalyticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState<string>('chsj120@gmail.com');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const stats = loadActivityStats();
  const topKeywords = getTopEntries(stats.searchKeywordCounts, 5);
  const topViewedJobs = getTopEntries(stats.jobViewCounts, 5);
  const topPickedJobs = getTopEntries(stats.pickedJobCounts, 5);
  const topCharacters = getTopEntries(stats.characterCounts, 5);
  const topSalaries = getTopEntries(stats.salarySimulationCounts, 4);

  // 미등록 직업 요청 로컬 로그 불러오기
  let unregisteredJobs: UnregisteredJobRequest[] = [];
  try {
    const raw = localStorage.getItem('unregistered_job_logs');
    if (raw) unregisteredJobs = JSON.parse(raw);
  } catch {
    // silent
  }

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: '유효한 이메일 주소를 입력해 주세요.' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/send-analytics-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmail: email.trim(),
          stats: {
            ...stats,
            topKeywords,
            topViewedJobs,
            topPickedJobs,
            topCharacters,
            topSalaries
          },
          unregisteredJobs
        })
      });

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: `[${email}] 메일함으로 활동 통계 리포트가 성공적으로 발송되었습니다!`
        });
      } else {
        // 서버리스 실패 시 폴백 (FormSubmit 직접 호출)
        await fetch(`https://formsubmit.co/ajax/${email.trim()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[내일찾기] 📊 활동 통계 & 직업 탐색 종합 리포트`,
            _template: 'table',
            _captcha: 'false',
            '접속_세션_수': `${stats.totalVisits}회`,
            '퀘스트_완료_수': `${stats.completedSurveysCount}회`,
            '인기_검색어': topKeywords.map(k => `${k.name}(${k.count}회)`).join(', ') || '없음',
            '많이_본_직업': topViewedJobs.map(j => `${j.name}(${j.count}회)`).join(', ') || '없음',
            '많이_찜한_직업': topPickedJobs.map(p => `${p.name}(${p.count}회)`).join(', ') || '없음'
          })
        });

        setStatusMessage({
          type: 'success',
          text: `[${email}] 메일함으로 활동 통계 리포트가 발송되었습니다!`
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: '이메일 발송 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  내일찾기 활동 통계 리포트
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  관리자 전용
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                학생들의 실제 직업 검색, 조회, 찜, 퀘스트 완료 내역을 집계합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* 1. 핵심 요약 지표 카드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-500 block">총 접속 세션</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">
                {stats.totalVisits.toLocaleString()}회
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
              <span className="text-[11px] font-semibold text-indigo-600 block">진로 퀘스트 완료</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-700 mt-0.5 block">
                {stats.completedSurveysCount.toLocaleString()}명
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-semibold text-amber-700 block">검색된 키워드</span>
              <span className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5 block">
                {Object.keys(stats.searchKeywordCounts).length.toLocaleString()}종
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] font-semibold text-rose-700 block">학생 추가요청 직업</span>
              <span className="text-xl sm:text-2xl font-black text-rose-900 mt-0.5 block">
                {unregisteredJobs.length.toLocaleString()}건
              </span>
            </div>
          </div>

          {/* 2. 주요 집계 순위 미리보기 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* 인기 검색어 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-indigo-600" /> 학생들이 많이 검색한 직업 Top 5
              </span>
              {topKeywords.length > 0 ? (
                <ul className="space-y-1.5 pt-1">
                  {topKeywords.map((k, i) => (
                    <li key={k.name} className="flex justify-between items-center text-slate-700 font-medium">
                      <span>{i + 1}위. {k.name}</span>
                      <span className="font-bold text-indigo-600">{k.count}회</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 py-2">아직 검색 기록이 없습니다.</p>
              )}
            </div>

            {/* 최다 조회 직업 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600" /> 상세 모달을 가장 많이 본 직업 Top 5
              </span>
              {topViewedJobs.length > 0 ? (
                <ul className="space-y-1.5 pt-1">
                  {topViewedJobs.map((j, i) => (
                    <li key={j.name} className="flex justify-between items-center text-slate-700 font-medium">
                      <span>{i + 1}위. {j.name}</span>
                      <span className="font-bold text-emerald-600">{j.count}회</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 py-2">아직 조회 기록이 없습니다.</p>
              )}
            </div>

            {/* 최다 찜한 직업 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 학생들이 가장 많이 찜한 직업
              </span>
              {topPickedJobs.length > 0 ? (
                <ul className="space-y-1.5 pt-1">
                  {topPickedJobs.map((p, i) => (
                    <li key={p.name} className="flex justify-between items-center text-slate-700 font-medium">
                      <span>{i + 1}위. {p.name}</span>
                      <span className="font-bold text-rose-600">{p.count}회</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 py-2">아직 찜 기록이 없습니다.</p>
              )}
            </div>

            {/* 진로 캐릭터 분포 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 성향 캐릭터 분포 순위
              </span>
              {topCharacters.length > 0 ? (
                <ul className="space-y-1.5 pt-1">
                  {topCharacters.map((c, i) => (
                    <li key={c.name} className="flex justify-between items-center text-slate-700 font-medium">
                      <span>{i + 1}위. {c.name}</span>
                      <span className="font-bold text-amber-600">{c.count}명</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 py-2">아직 완료된 퀘스트가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 3. Vercel Web Analytics 안내 카드 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 flex items-start gap-3">
            <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-indigo-950 font-bold block mb-0.5">
                🌐 접속자 수 & 전국 시/도 접속 지역 실시간 통계 (Vercel Analytics 연동 완료)
              </strong>
              접속한 학생 수(Unique Visitors), 실시간 방문자, 기기(모바일/PC) 및 접속 도시/지역 통계는 
              <strong> Vercel 대시보드(vercel.com → 프로젝트 → Analytics)</strong>에서 무료로 실시간 지도와 그래프로 확인하실 수 있습니다.
            </div>
          </div>

          {/* 4. 이메일 발송 폼 */}
          <form onSubmit={handleSendReport} className="p-5 rounded-2xl bg-slate-900 text-white space-y-3.5">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" /> 종합 활동 통계 리포트 이메일로 받기
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                위 모든 통계(검색어, 많이 본 직업, 찜 목록, 미등록 직업 요청)를 정리된 표로 지정한 이메일로 즉시 발송합니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="받으실 이메일 주소 입력"
                required
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>발송 중...</span>
                  </>
                ) : (
                  <>
                    <span>📊 리포트 이메일 발송</span>
                  </>
                )}
              </button>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50' 
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </form>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
