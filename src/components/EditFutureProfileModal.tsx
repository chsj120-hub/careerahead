// src/components/EditFutureProfileModal.tsx
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CharacterProfile, Job } from '../types/career';
import { ChibiCharacter } from './ChibiCharacter';
import { X, Sparkles, Heart, Check, Edit3, MessageSquare, Lightbulb } from 'lucide-react';

interface EditFutureProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CharacterProfile;
  pickedJobs: Job[];
  onSave: (updatedProfile: CharacterProfile) => void;
}

// 추천 아바타 아이콘 프리셋
const AVATAR_PRESETS = [
  '🧑‍💻', '🎨', '🔬', '🚀', '👑', '💼', '🍳', '🌟', 
  '🌿', '⚓', '🩺', '⚖️', '💡', '🎧', '✈️', '🧭'
];

// 추천 칭호 프리셋
const TITLE_PRESETS = [
  '미래를 개척하는 첨단 테크 혁신가',
  '수많은 팬을 사로잡는 마스터 크리에이터',
  '100억 신화를 쓰는 젊은 백만장자',
  '타의 추종을 불허하는 절대 권위자',
  '대양과 국가 경제를 지탱하는 거인',
  '사람들에게 쉼을 선물하는 힐링 마스터',
  '다채로운 가능성의 진로 탐험가'
];

export const EditFutureProfileModal: React.FC<EditFutureProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  pickedJobs,
  onSave
}) => {
  const [title, setTitle] = useState<string>(profile.title.replace(/\[?Lv\.\s*\d+\]?\s*/gi, '').trim());
  const [avatar, setAvatar] = useState<string>(profile.avatar || '🌟');
  const [futureResolution, setFutureResolution] = useState<string>(profile.futureResolution || '');
  const [jobNotes, setJobNotes] = useState<Record<string, string>>(profile.jobNotes || {});

  if (!isOpen) return null;

  const handleNoteChange = (jobId: string, text: string) => {
    setJobNotes(prev => ({
      ...prev,
      [jobId]: text
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim() || '미래를 여는 멋진 주인공';
    
    const updated: CharacterProfile = {
      ...profile,
      title: cleanTitle,
      avatar: avatar.trim() || '🌟',
      futureResolution: futureResolution.trim(),
      jobNotes: jobNotes
    };

    onSave(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // silent
    }

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-indigo-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shadow-md shrink-0 font-bold">
              ✏️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  나만의 미래 캐릭터 & 칭호 꾸미기
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  수업 연계 활동
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                추천된 결과가 마음에 들지 않아도 괜찮아요! 내 손으로 직접 수정하고 10년 뒤 나의 모습을 적어보세요.
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Section 1: 캐릭터 미리보기 & 호칭(칭호) 수정 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>1. 나만의 대표 칭호(호칭)와 아바타 설정</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">프로필 카드에 즉시 반영</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* 2D Chibi 캐릭터 미리보기 */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-indigo-50 to-slate-100 border-2 border-amber-400 flex items-center justify-center shadow-sm relative overflow-hidden">
                  <ChibiCharacter
                    title={title}
                    code={profile.code}
                    size={72}
                  />
                  <span className="absolute bottom-1 right-1 text-base">{avatar}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">2D 아바타</span>
              </div>

              {/* 칭호 입력창 */}
              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  내가 불리고 싶은 멋진 칭호:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 미래를 바꿀 AI 수의사, 감성 공간 디자이너"
                    maxLength={35}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 focus:outline-hidden text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70"
                  />
                  <Edit3 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* 칭호 프리셋 칩 */}
                <div className="pt-1">
                  <span className="text-[10.5px] text-slate-500 font-semibold block mb-1">추천 칭호 골라보기:</span>
                  <div className="flex flex-wrap gap-1">
                    {TITLE_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTitle(p)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                          title === p 
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 아바타 이모지 팔레트 */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>대표 아이콘(이모지) 선택:</span>
                <span className="text-[11px] font-normal text-slate-400">직접 입력 가능</span>
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {AVATAR_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-95 ${
                      avatar === emoji 
                        ? 'bg-amber-400 ring-2 ring-amber-500 scale-110 shadow-sm' 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  maxLength={4}
                  className="w-10 h-8 px-1 text-center rounded-xl border border-slate-300 text-sm font-bold bg-white"
                  title="직접 이모지나 글자 입력"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 10년 뒤 나의 미래 모습 & 한 줄 다짐 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>2. 10년 뒤 나의 미래 모습 & 한 줄 다짐</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                수업 워크시트 연계
              </span>
            </div>

            <p className="text-xs text-slate-500">
              어른이 된 10년 뒤의 나는 어떤 일터에서 어떤 보람을 느끼며 살아가고 있을까요? 나만의 미래 다짐을 적어보세요!
            </p>

            <textarea
              rows={3}
              value={futureResolution}
              onChange={(e) => setFutureResolution(e.target.value)}
              placeholder="예: 10년 뒤 나는 사람들의 지친 마음을 위로해주는 따뜻한 공간을 만들고, 내가 좋아하는 일을 하면서 매일 웃으며 출근하는 당당한 어른이 될 거예요!"
              className="w-full p-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-600 focus:outline-hidden text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/70"
            />
          </div>

          {/* Section 3: 내가 찜한 직업(들) 간략한 활동 리포트 메모 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>3. 내가 찜한 직업 심화 탐색 메모 ({pickedJobs.length}개)</span>
              </span>
              <span className="text-[11px] text-slate-400">선택한 이유 적기</span>
            </div>

            {pickedJobs.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  내가 찜한 직업들을 왜 마음에 담아두었는지 간단히 메모해 두면 다음 진로 수업 시간에 발표하거나 탐색하기 좋아요!
                </p>
                {pickedJobs.map((job) => (
                  <div key={job.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{job.icon}</span>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900">{job.title}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-semibold">
                          {job.categoryName}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-600 font-mono">
                        초봉 연 {job.moneyTruth.entrySalary.toLocaleString()}만 원
                      </span>
                    </div>

                    <input
                      type="text"
                      value={jobNotes[job.id] || ''}
                      onChange={(e) => handleNoteChange(job.id, e.target.value)}
                      placeholder={`내가 ${job.title}을(를) 찜한 이유나 해보고 싶은 일 적기`}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-600 bg-white"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-center space-y-1">
                <p className="text-xs font-bold text-amber-950 flex items-center justify-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> 아직 찜한 직업이 없습니다!
                </p>
                <p className="text-[11px] text-amber-800">
                  결과 화면 아래의 추천 직업이나 직업 도감에서 하트(❤️) 버튼을 눌러 관심 있는 직업을 담아보세요.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>내 미래 프로필에 저장하기 ✨</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
