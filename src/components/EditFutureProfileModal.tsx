// src/components/EditFutureProfileModal.tsx
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CharacterProfile, Job, CustomAvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types/career';
import { ChibiCharacter } from './ChibiCharacter';
import { getCharacterArchetype, getDefaultConfigFromArchetype } from '../utils/avatarUtils';
import { X, Sparkles, Heart, Check, Edit3, MessageSquare, Lightbulb, Palette, Smile, Shirt, Briefcase } from 'lucide-react';

interface EditFutureProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CharacterProfile;
  pickedJobs: Job[];
  onSave: (updatedProfile: CharacterProfile) => void;
}

// 탭 카테고리
type CustomTab = 'gender_face' | 'hair' | 'outfit' | 'item_acc';

// 1. 성별 옵션
const GENDER_OPTIONS: Array<{ id: 'boy' | 'girl'; label: string; icon: string }> = [
  { id: 'boy', label: '남학생', icon: '👦' },
  { id: 'girl', label: '여학생', icon: '👧' }
];

// 2. 얼굴 표정 옵션
const FACE_OPTIONS: Array<{ id: CustomAvatarConfig['face']; label: string; icon: string; desc: string }> = [
  { id: 'sparkle', label: '초롱초롱', icon: '✨', desc: '반짝이는 큰 눈망울' },
  { id: 'smile', label: '방긋 미소', icon: '😊', desc: '사랑스러운 눈웃음' },
  { id: 'wink', label: '깜찍 윙크', icon: '😉', desc: '장난기 가득 윙크' },
  { id: 'confident', label: '당당·열정', icon: '😎', desc: '야무진 눈빛과 자신감' }
];

// 3. 헤어스타일 옵션
const HAIR_OPTIONS: Array<{ id: CustomAvatarConfig['hair']; label: string; icon: string }> = [
  { id: 'short_dandy', label: '단정 숏컷', icon: '✂️' },
  { id: 'comma', label: '쉼표머리', icon: '💫' },
  { id: 'bob', label: '귀염 단발', icon: '💇‍♀️' },
  { id: 'ponytail', label: '포니테일', icon: '🎀' },
  { id: 'long_wave', label: '롱 웨이브', icon: '🌊' },
  { id: 'two_block', label: '투블럭 컷', icon: '⚡' }
];

// 4. 머리 색상 팔레트
const HAIR_COLOR_OPTIONS = [
  { color: '#1E293B', label: '내추럴 블랙' },
  { color: '#78350F', label: '다크 브라운' },
  { color: '#B45309', label: '밀크 브라운' },
  { color: '#F59E0B', label: '골드 블론드' },
  { color: '#E11D48', label: '로즈 와인' },
  { color: '#6366F1', label: '미드나잇 블루' }
];

// 5. 직업 의상 옵션
const OUTFIT_OPTIONS: Array<{ id: CustomAvatarConfig['outfit']; label: string; icon: string; badge: string }> = [
  { id: 'school', label: '단정 교복', icon: '🎒', badge: '학생' },
  { id: 'hoodie', label: '캐주얼 후드', icon: '🧥', badge: '자유' },
  { id: 'developer', label: 'IT 개발자', icon: '💻', badge: '테크' },
  { id: 'doctor', label: '의사/연구원', icon: '🩺', badge: '전문' },
  { id: 'chef', label: '셰프 조리복', icon: '🍳', badge: '요리' },
  { id: 'police', label: '경찰/소방 제복', icon: '👮', badge: '공공' },
  { id: 'creator', label: '아티스트 멜빵', icon: '🎨', badge: '창작' },
  { id: 'suit', label: '비즈니스 수트', icon: '💼', badge: '경영' }
];

// 6. 손 소품 옵션
const ITEM_OPTIONS: Array<{ id: CustomAvatarConfig['item']; label: string; icon: string }> = [
  { id: 'none', label: '소품 없음', icon: '❌' },
  { id: 'laptop', label: '미니 노트북', icon: '💻' },
  { id: 'stethoscope', label: '청진기', icon: '🩺' },
  { id: 'tablet', label: '드로잉 태블릿', icon: '🎨' },
  { id: 'book', label: '두툼한 전공책', icon: '📚' },
  { id: 'mic', label: '보컬 마이크', icon: '🎤' },
  { id: 'pan', label: '셰프 프라이팬', icon: '🍳' },
  { id: 'beaker', label: '실험 플라스크', icon: '🧪' }
];

// 7. 안경 옵션
const ACCESSORY_OPTIONS: Array<{ id: CustomAvatarConfig['accessory']; label: string; icon: string }> = [
  { id: 'none', label: '안경 없음', icon: '❌' },
  { id: 'round', label: '골드 동글이', icon: '👓' },
  { id: 'square', label: '블랙 뿔테', icon: '🤓' },
  { id: 'sunglasses', label: '틴트 선글라스', icon: '🕶️' }
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
  const [activeTab, setActiveTab] = useState<CustomTab>('outfit');

  // 아바타 커스텀 상태 초기화 (기존 프로필에 없으면 archetype에서 유추)
  const [avatarConfig, setAvatarConfig] = useState<CustomAvatarConfig>(() => {
    if (profile.avatarConfig) return profile.avatarConfig;
    const arch = getCharacterArchetype(profile.title, profile.code);
    return getDefaultConfigFromArchetype(arch) || DEFAULT_AVATAR_CONFIG;
  });

  const [title, setTitle] = useState<string>(profile.title.replace(/\[?Lv\.\s*\d+\]?\s*/gi, '').trim());
  const [futureResolution, setFutureResolution] = useState<string>(profile.futureResolution || '');
  const [jobNotes, setJobNotes] = useState<Record<string, string>>(profile.jobNotes || {});

  if (!isOpen) return null;

  const handleNoteChange = (jobId: string, text: string) => {
    setJobNotes(prev => ({
      ...prev,
      [jobId]: text
    }));
  };

  const updateConfig = <K extends keyof CustomAvatarConfig>(key: K, value: CustomAvatarConfig[K]) => {
    setAvatarConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim() || '미래를 여는 멋진 주인공';
    
    const updated: CharacterProfile = {
      ...profile,
      title: cleanTitle,
      avatarConfig: avatarConfig,
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
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-indigo-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl shadow-md shrink-0 font-bold">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  나만의 봉봉미니 진로 아바타 스튜디오
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  수업 연계
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                남/여, 얼굴 표정, 헤어, 직업 옷, 소품, 안경을 골라 나만의 2D 미니미를 완성해보세요!
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
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/60">
          
          {/* ========================================================
              Section 1: 실시간 2D 봉봉미니 아바타 커스텀 스튜디오
             ======================================================== */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-indigo-100 shadow-sm space-y-4">
            
            {/* 상단: 캐릭터 실시간 라이브 프리뷰 + 칭호 간이 표시 */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-4 border-b border-slate-100">
              {/* 캐릭터 미리보기 원형 카드 */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-indigo-50 via-amber-50/40 to-slate-100 border-3 border-amber-400 flex items-center justify-center shadow-md overflow-hidden">
                  <ChibiCharacter
                    customConfig={avatarConfig}
                    title={title}
                    code={profile.code}
                    size={110}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 shadow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>실시간 2D</span>
                </div>
              </div>

              {/* 칭호 직접 입력창 */}
              <div className="flex-1 w-full space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-700">
                  내가 불리고 싶은 멋진 미래 칭호(호칭):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 사람을 살리는 AI 수의사, 감성 웹툰 작가"
                    maxLength={35}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-200 focus:border-indigo-600 focus:outline-hidden text-xs sm:text-sm font-bold text-slate-900 bg-slate-50/70"
                  />
                  <Edit3 className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* 추천 칭호 칩 */}
                <div className="pt-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">추천 칭호 쏙 골라보기:</span>
                  <div className="flex flex-wrap gap-1">
                    {TITLE_PRESETS.slice(0, 5).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTitle(p)}
                        className={`text-[9.5px] px-2 py-0.5 rounded-md border transition-all ${
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

            {/* 중단: 파츠 커스터마이징 탭 내비게이션 */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('gender_face')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'gender_face'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span>성별 & 얼굴</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hair')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'hair'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Palette className="w-4 h-4 text-indigo-500" />
                <span>헤어 & 컬러</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('outfit')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'outfit'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shirt className="w-4 h-4 text-emerald-500" />
                <span>직업 옷 입히기</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('item_acc')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'item_acc'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4 text-rose-500" />
                <span>손 소품 & 안경</span>
              </button>
            </div>

            {/* 하단: 탭별 파츠 선택 그리드 */}
            <div className="pt-1">
              
              {/* TAB 1: 성별 & 얼굴 표정 */}
              {activeTab === 'gender_face' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* 성별 선택 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ① 성별 캐릭터 베이스:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {GENDER_OPTIONS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => updateConfig('gender', g.id)}
                          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer ${
                            avatarConfig.gender === g.id
                              ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">{g.icon}</span>
                          <span>{g.label}</span>
                          {avatarConfig.gender === g.id && <Check className="w-4 h-4 text-amber-600 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 얼굴 표정 선택 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ② 얼굴 표정 선택:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {FACE_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => updateConfig('face', f.id)}
                          className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                            avatarConfig.face === f.id
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-2xl">{f.icon}</span>
                          <span className="text-xs font-bold">{f.label}</span>
                          <span className="text-[10px] text-slate-400">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 헤어스타일 & 머리색 */}
              {activeTab === 'hair' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* 헤어스타일 그리드 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ① 헤어스타일 고르기:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {HAIR_OPTIONS.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => updateConfig('hair', h.id)}
                          className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                            avatarConfig.hair === h.id
                              ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">{h.icon}</span>
                          <span className="text-xs">{h.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 머리 색상 팔레트 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ② 머리 색상 팔레트:
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {HAIR_COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => updateConfig('hairColor', c.color)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
                            avatarConfig.hairColor === c.color
                              ? 'border-indigo-600 bg-indigo-50 font-bold'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: c.color }} 
                          />
                          <span className="text-xs text-slate-800">{c.label}</span>
                          {avatarConfig.hairColor === c.color && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 직업 옷 입히기 */}
              {activeTab === 'outfit' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    내가 꿈꾸는 직업 의상 선택하기:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {OUTFIT_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => updateConfig('outfit', o.id)}
                        className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all cursor-pointer relative ${
                          avatarConfig.outfit === o.id
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-400'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-bold">
                          {o.badge}
                        </span>
                        <span className="text-2xl mt-1">{o.icon}</span>
                        <span className="text-xs">{o.label}</span>
                        {avatarConfig.outfit === o.id && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> 착용 중
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: 손 소품 & 안경 */}
              {activeTab === 'item_acc' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* 손 소품 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ① 손에 쥘 직업 시그니처 소품:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ITEM_OPTIONS.map((it) => (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => updateConfig('item', it.id)}
                          className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all cursor-pointer ${
                            avatarConfig.item === it.id
                              ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">{it.icon}</span>
                          <span className="text-xs">{it.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 안경 악세서리 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      ② 안경 악세서리:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {ACCESSORY_OPTIONS.map((acc) => (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => updateConfig('accessory', acc.id)}
                          className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all cursor-pointer ${
                            avatarConfig.accessory === acc.id
                              ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">{acc.icon}</span>
                          <span className="text-xs">{acc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ========================================================
              Section 2: 10년 뒤 나의 미래 모습 & 한 줄 다짐
             ======================================================== */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-indigo-100 shadow-xs space-y-2.5">
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
              className="w-full p-3 rounded-2xl border-2 border-indigo-100 focus:border-indigo-600 focus:outline-hidden text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/70"
            />
          </div>

          {/* ========================================================
              Section 3: 내가 찜한 직업(들) 간략한 활동 리포트 메모
             ======================================================== */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-indigo-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>3. 내가 찜한 직업({pickedJobs.length}개) 진로 탐구 메모</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                나만의 진로 리포트
              </span>
            </div>

            {pickedJobs.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">
                  아직 찜한 직업이 없습니다. 결과 화면에서 마음에 드는 직업 카드의 ❤️ 버튼을 눌러보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  각 직업을 왜 선택했는지, 이 직업을 위해 지금 무엇을 해볼 수 있을지 한 줄씩 적어보세요.
                </p>
                <div className="space-y-2.5">
                  {pickedJobs.map((job) => (
                    <div key={job.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          <span>{job.icon}</span>
                          <span>{job.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({job.categoryName})</span>
                        </span>
                        <span className="text-[10px] text-indigo-600 font-mono font-bold">
                          초임 약 {job.moneyTruth.entrySalary.toLocaleString()}만 원
                        </span>
                      </div>
                      <input
                        type="text"
                        value={jobNotes[job.id] || ''}
                        onChange={(e) => handleNoteChange(job.id, e.target.value)}
                        placeholder={`예: ${job.title}의 ${job.actionPlanForYouth.clubActivity} 활동을 동아리 시간에 꼭 해보고 싶다!`}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-hidden bg-white text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 안내 배너 */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>선생님 & 학생 안내:</strong> 저장 버튼을 누르면 설정한 봉봉미니 캐릭터와 칭호, 미래 다짐, 메모가 저장되어 프로필 카드 및 모바일 1장 카드에 자동으로 나타납니다!
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>나만의 아바타 & 다짐 저장하기</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
