import React, { useState, useEffect } from 'react';
import { X, Send, Database, CheckCircle2 } from 'lucide-react';
import { UnregisteredJobRequest } from '../types/career';

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
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim()) return;

    const newRequest: UnregisteredJobRequest = {
      id: Date.now().toString(),
      jobName: jobName.trim(),
      reason: reason.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString()
    };

    // 로컬 스토리지 unregistered_job_logs에 누적 저장
    try {
      const existingLogs = JSON.parse(localStorage.getItem('unregistered_job_logs') || '[]');
      existingLogs.push(newRequest);
      localStorage.setItem('unregistered_job_logs', JSON.stringify(existingLogs));
    } catch (e) {
      console.error('Failed to save log', e);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setJobName('');
      setReason('');
      setEmail('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-indigo-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-700">
              <Database className="w-4 h-4 text-amber-300" />
            </span>
            <h3 className="font-extrabold text-base">직업 조사 요청 피드백 루프</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-indigo-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h4 className="text-lg font-extrabold text-slate-900">
                조사 요청이 접수되었습니다!
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                <code className="text-indigo-600 font-bold">unregistered_job_logs</code>에 안전하게 누적되었습니다.
                다음 분기 정기 업데이트(한국고용정보원 연계) 시 우선 반영됩니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  찾으시는 직업이 없으신가요? 직업명을 알려주시면 다음 분기 정기 데이터베이스 갱신 시 현실 Q&A 데이터를 분석하여 추가해 드립니다!
                </p>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  궁금한 직업 이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 조향사, 동물 행동교정사, 3D 프린팅 전문가 등"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  이 직업에 대해 특히 알고 싶은 현실적인 점 (선택)
                </label>
                <textarea
                  rows={3}
                  placeholder="예: 초봉 수준이나 초등학생 때 준비할 수 있는 자격증이 있는지 알고 싶어요!"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  답변받을 이메일 주소 (선택)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com (분기 반영 시 알림)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>연구소에 직업 조사 요청하기</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
