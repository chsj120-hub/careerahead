// src/components/SurveyStepModal.tsx
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SurveyState8 } from '../types/career';
import { SURVEY_STEPS } from '../data/surveyData';
import { Check, ArrowRight, ArrowLeft, Sparkles, Trophy, HelpCircle, Edit3 } from 'lucide-react';

interface SurveyStepModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (survey: SurveyState8) => void;
}

const STORAGE_KEY_SURVEY_DRAFT = 'careerahead_survey_draft';

export const SurveyStepModal: React.FC<SurveyStepModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // 8개 질문 상태
  const [q1, setQ1] = useState<string[]>([]);
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string[]>([]);
  const [q4, setQ4] = useState<string>('');
  const [q5, setQ5] = useState<string>('');
  const [q6, setQ6] = useState<string>('');
  const [q7, setQ7] = useState<string>('');
  const [q8, setQ8] = useState<string>('title_future_tech');
  const [customTitleInput, setCustomTitleInput] = useState<string>('');

  // 중간 그만두기 확인 팝업 상태 및 이전 작성 이어하기 여부
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [hasSavedDraft, setHasSavedDraft] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SURVEY_DRAFT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed && typeof parsed.currentStepIndex === 'number' && parsed.currentStepIndex > 0);
      }
    } catch {
      // silent
    }
    return false;
  });

  // 임시 저장된 상태 불러오기
  const handleResumeDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SURVEY_DRAFT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.q1) setQ1(parsed.q1);
        if (parsed.q2) setQ2(parsed.q2);
        if (parsed.q3) setQ3(parsed.q3);
        if (parsed.q4) setQ4(parsed.q4);
        if (parsed.q5) setQ5(parsed.q5);
        if (parsed.q6) setQ6(parsed.q6);
        if (parsed.q7) setQ7(parsed.q7);
        if (parsed.q8) setQ8(parsed.q8);
        if (parsed.customTitleInput) setCustomTitleInput(parsed.customTitleInput);
        if (typeof parsed.currentStepIndex === 'number') setCurrentStepIndex(parsed.currentStepIndex);
      }
    } catch {
      // silent
    }
    setHasSavedDraft(false);
  };

  // 새로 시작하기 (임시저장 비우기)
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_SURVEY_DRAFT);
    } catch {
      // silent
    }
    setHasSavedDraft(false);
  };

  // 단계 변경 또는 상태 업데이트 시 자동 저장
  React.useEffect(() => {
    if (!isOpen) return;
    try {
      const draftData = {
        currentStepIndex,
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7,
        q8,
        customTitleInput
      };
      localStorage.setItem(STORAGE_KEY_SURVEY_DRAFT, JSON.stringify(draftData));
    } catch {
      // silent
    }
  }, [isOpen, currentStepIndex, q1, q2, q3, q4, q5, q6, q7, q8, customTitleInput]);

  // ESC 키로 닫기
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else if (currentStepIndex > 0 || q1.length > 0) {
          setShowExitConfirm(true);
        } else if (onClose) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showExitConfirm, currentStepIndex, q1.length, onClose]);

  if (!isOpen) return null;

  const currentConfig = SURVEY_STEPS[currentStepIndex];

  // 닫기 요청 시: 작성 중인 내용이 있으면 임시저장 확인 팝업, 없으면 바로 닫기
  const handleRequestClose = () => {
    if (currentStepIndex > 0 || q1.length > 0) {
      setShowExitConfirm(true);
    } else if (onClose) {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    if (onClose) onClose();
  };

  // 선택 토글 핸들러
  const handleSelectOption = (optId: string) => {
    switch (currentStepIndex) {
      case 0: // Q1 다중 (최대 2개)
        if (q1.includes(optId)) {
          setQ1(q1.filter(id => id !== optId));
        } else if (q1.length < 2) {
          setQ1([...q1, optId]);
        }
        break;
      case 1: // Q2 단일
        setQ2(optId);
        break;
      case 2: // Q3 다중 (최대 2개)
        if (q3.includes(optId)) {
          setQ3(q3.filter(id => id !== optId));
        } else if (q3.length < 2) {
          setQ3([...q3, optId]);
        }
        break;
      case 3: // Q4 단일
        setQ4(optId);
        break;
      case 4: // Q5 단일
        setQ5(optId);
        break;
      case 5: // Q6 단일
        setQ6(optId);
        break;
      case 6: // Q7 단일
        setQ7(optId);
        break;
      case 7: // Q8 단일 프리셋 선택 (직접입력창은 비움)
        setQ8(optId);
        setCustomTitleInput('');
        break;
    }
  };

  // Q8 직접 입력 핸들러
  const handleCustomTitleChange = (val: string) => {
    setCustomTitleInput(val);
    setQ8(val); // 직접 입력값을 q8 값으로 우선 적용
  };

  // 현재 선택된 상태 확인
  const isSelected = (optId: string) => {
    switch (currentStepIndex) {
      case 0: return q1.includes(optId);
      case 1: return q2 === optId;
      case 2: return q3.includes(optId);
      case 3: return q4 === optId;
      case 4: return q5 === optId;
      case 5: return q6 === optId;
      case 6: return q7 === optId;
      case 7: return !customTitleInput && q8 === optId;
      default: return false;
    }
  };

  // 다음 버튼 활성화 여부
  const canProceed = () => {
    switch (currentStepIndex) {
      case 0: return q1.length >= 1;
      case 1: return q2 !== '';
      case 2: return q3.length >= 1;
      case 3: return q4 !== '';
      case 4: return q5 !== '';
      case 5: return q6 !== '';
      case 6: return q7 !== '';
      case 7: return q8.trim() !== '' || customTitleInput.trim() !== '';
      default: return false;
    }
  };

  // 다음 단계 진행
  const handleNext = () => {
    if (currentStepIndex < SURVEY_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // 8단계 최종 완료 - 임시 저장 삭제
      try {
        localStorage.removeItem(STORAGE_KEY_SURVEY_DRAFT);
      } catch {
        // silent
      }
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // silent
      }

      const finalTitle = customTitleInput.trim() ? customTitleInput.trim() : q8;

      onComplete({
        q1_interests: q1,
        q2_aptitude: q2,
        q3_strengths: q3,
        q4_workEnv: q4,
        q5_lifestyle: q5,
        q6_techAttitude: q6,
        q7_riskTolerance: q7,
        q8_dreamTitle: finalTitle
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleRequestClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-in zoom-in-95 duration-200 relative">
        
        {/* Top RPG Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-900 p-3.5 sm:p-5 text-white relative">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg font-black text-xs flex items-center gap-1.5 shadow-sm">
                <Trophy className="w-3.5 h-3.5" /> 퀘스트 {currentStepIndex + 1} / 8
              </span>
              <span className="text-xs px-2 sm:px-2.5 py-1 rounded-md bg-indigo-950/60 text-amber-300 font-bold border border-indigo-600/40">
                {currentConfig.category}
              </span>
            </div>
            {onClose && (
              <button 
                onClick={handleRequestClose}
                className="text-indigo-200 hover:text-white text-xs underline p-1 font-semibold"
              >
                중간에 그만두기
              </button>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-indigo-950/50 rounded-full h-3 p-0.5 border border-indigo-400/40">
            <div 
              className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1"
              style={{ width: `${((currentStepIndex + 1) / SURVEY_STEPS.length) * 100}%` }}
            >
              <Sparkles className="w-2.5 h-2.5 text-slate-900 animate-spin-slow" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-indigo-200 mt-1.5 font-medium px-1">
            <span>흥미/적성</span>
            <span>능력/공간</span>
            <span>가치/도구</span>
            <span>칭호 각성</span>
          </div>
        </div>

        {/* 이전 답변 이어하기 알림 배너 */}
        {hasSavedDraft && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span className="font-bold flex items-center gap-1.5">
              <span>💾</span> 이전에 작성 중이던 답변이 저장되어 있습니다!
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResumeDraft}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition-colors"
              >
                이어서 하기
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-2 py-1 text-slate-500 hover:text-slate-800 font-bold transition-colors"
              >
                새로 시작
              </button>
            </div>
          </div>
        )}

        {/* 중간에 그만두기 확인 다이얼로그 오버레이 */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-slate-200 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                ⚠️
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1">
                진로 탐색을 잠시 멈추시겠습니까?
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                현재까지 선택하신 <strong>퀘스트 {currentStepIndex + 1}단계</strong>까지의 답변은 
                <span className="text-indigo-600 font-bold"> 자동 임시 저장</span>되므로, 다음에 언제든 다시 이어서 하실 수 있습니다.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-sm"
                >
                  계속 탐색하기
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  저장하고 나가기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Survey Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                {currentConfig.isMultiSelect ? `복수 선택 (최대 ${currentConfig.maxSelect}개)` : '단일 선택 (1개)'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 tracking-tight">
              {currentConfig.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Q8 직접 입력 영역 (Custom Title Input) */}
          {currentConfig.isCustomInputAllowed && (
            <div className="mb-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm">
              <label className="block text-xs font-black text-amber-950 mb-1 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>나만의 칭호 직접 만들기 (자유 입력):</span>
              </label>
              <input
                type="text"
                placeholder={currentConfig.customPlaceholder || '내가 원하는 나만의 칭호를 직접 적어보세요!'}
                value={customTitleInput}
                onChange={(e) => handleCustomTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-xs sm:text-sm font-bold text-slate-900"
              />
              <p className="text-[11px] text-amber-800 mt-1 font-medium">
                💡 직접 입력하시면 아래 예시 대신 이 칭호가 내 RPG 결과 카드에 멋지게 각인됩니다!
              </p>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentConfig.options.map(opt => {
              const selected = isSelected(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-start gap-3 relative group ${
                    selected 
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-200' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/90'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl p-2 rounded-xl bg-white shadow-sm border border-slate-100 shrink-0">
                    {opt.icon}
                  </span>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{opt.title}</span>
                    </div>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold mt-1">
                      {opt.tag}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {opt.subtitle}
                    </p>

                    {/* Tooltip Helper Text */}
                    {opt.tooltip && (
                      <div className="mt-2 text-[10.5px] text-indigo-700 bg-indigo-50 p-2 rounded-lg border border-indigo-100/80 flex items-start gap-1">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{opt.tooltip}</span>
                      </div>
                    )}
                  </div>

                  {/* Check Indicator */}
                  <div className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    selected ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 이전 질문
              </button>
            ) : <div />}
          </div>

          <button
            type="button"
            disabled={!canProceed()}
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>
              {currentStepIndex === SURVEY_STEPS.length - 1 
                ? '최종 칭호 및 맞춤 추천 6선 확인! 🌟' 
                : '다음 질문으로'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
