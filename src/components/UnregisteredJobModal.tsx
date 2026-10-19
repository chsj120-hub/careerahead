import React, { useState, useEffect } from 'react';
import { X, Send, Database, CheckCircle2, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { 
  sendJobRequestFeedback, 
  exportJobRequestsToCSV, 
  getStoredJobRequestsCount 
} from '../utils/feedbackSender';

interface UnregisteredJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeyword?: string;
}

export const UnregisteredJobModal: React.FC<UnregisteredJobModalProps> = ({
  isOpen,
  onClose,
  initialKeyword = ''
}) => {
  const [jobName, setJobName] = useState(initialKeyword);
  const [prevKeyword, setPrevKeyword] = useState(initialKeyword);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // props 변경 시 상태 동기화 (React 공식 권장 패턴)
  if (initialKeyword !== prevKeyword) {
    setPrevKeyword(initialKeyword);
    setJobName(initialKeyword);
  }

  const storedCount = isOpen ? getStoredJobRequestsCount() : 0;

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. 관리자 메일 자동 전송 & 로컬스토리지 영구 누적
      await sendJobRequestFeedback(jobName, reason, email);

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setJobName('');
        setReason('');
        setEmail('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Submission failed', err);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-sm font-black">
              <Database className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                직업 조사 요청 피드백 루프
              </h3>
              <p className="text-[11px] text-indigo-200">
                한국고용정보원 연계 분기별 데이터 갱신 연구소
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">
                직업 조사 요청이 접수되었습니다!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                요청하신 직업 정보가 연구소 관리자 채널로 즉시 전달되었으며, 
                다음 분기 정기 업데이트 시 <strong>5대 현실 Q&A 팩트시트</strong>로 우선 분석·추가됩니다.
              </p>
              <div className="pt-2 text-[11px] text-indigo-600 font-bold">
                소중한 의견 감사합니다. 창을 자동으로 닫습니다...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-slate-600 leading-relaxed">
                💡 찾으시는 직업이 없으신가요? 직업명을 알려주시면 연구소에서 현실 연봉, 준비 단계, AI 신호등을 정밀 분석하여 데이터베이스에 반영해 드립니다!
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  궁금한 직업 이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 조향사, 동물 행동교정사, 3D 프린팅 전문가, 드론 레이서 등"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  이 직업에 대해 특히 알고 싶은 현실적인 점 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 초봉 수준이나 초등학생 때 준비할 수 있는 자격증이 있는지 알고 싶어요!"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs outline-none font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  답변받을 학생/학부모 이메일 주소 (선택)
                </label>
                <input
                  type="email"
                  placeholder="student@example.com (업데이트 반영 시 알림)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs outline-none font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * 이메일은 직업 업데이트 알림 용도로만 사용되며 안전하게 보호됩니다.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !jobName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[46px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>연구소로 안전하게 전송 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>연구소에 직업 조사 요청하기</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 관리자 분기 업데이트 참고용 CSV 다운로드 바 */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>누적 요청: <strong className="text-indigo-700 font-bold">{storedCount}건</strong></span>
            </span>

            {storedCount > 0 && (
              <button
                type="button"
                onClick={exportJobRequestsToCSV}
                title="지금까지 학생들이 요청한 모든 직업 목록을 엑셀 CSV 파일로 다운로드합니다."
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors text-[10px]"
              >
                <Download className="w-3 h-3 text-slate-600" />
                <span>엑셀(CSV) 다운로드</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
