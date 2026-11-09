// src/components/ChibiCharacter.tsx
import React from 'react';
import { CustomAvatarConfig, DEFAULT_AVATAR_CONFIG } from '../types/career';
import { CharacterArchetype, getCharacterArchetype, getDefaultConfigFromArchetype } from '../utils/avatarUtils';

interface ChibiCharacterProps {
  archetype?: CharacterArchetype;
  customConfig?: CustomAvatarConfig;
  title?: string;
  code?: string;
  size?: number;
  className?: string;
}

export const ChibiCharacter: React.FC<ChibiCharacterProps> = ({
  archetype,
  customConfig,
  title = '',
  code = '',
  size = 120,
  className = ''
}) => {
  const currentArchetype = archetype || getCharacterArchetype(title, code);
  const config: CustomAvatarConfig = customConfig || getDefaultConfigFromArchetype(currentArchetype) || DEFAULT_AVATAR_CONFIG;

  const hairColor = config.hairColor || '#1E293B';

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${title || '진로 캐릭터'} 2D 진로 아바타`}
    >
      <svg
        viewBox="0 0 120 130"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="skinGradV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF3E8" />
            <stop offset="100%" stopColor="#FCD5BD" />
          </linearGradient>
          <linearGradient id="doctorCoatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="policeSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="chefSuitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="pilotSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="judgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3F0E1E" />
            <stop offset="100%" stopColor="#1C060E" />
          </linearGradient>
        </defs>

        {/* 1. 뒷머리 레이어 (포니테일, 롱웨이브, 양갈래 번 등) */}
        {config.hair === 'long_wave' && (
          <g id="back-hair-wave">
            <path
              d="M30 46 C24 64 24 95 38 108 C42 96 36 78 40 60 Z"
              fill={hairColor}
            />
            <path
              d="M90 46 C96 64 96 95 82 108 C78 96 84 78 80 60 Z"
              fill={hairColor}
            />
          </g>
        )}

        {config.hair === 'ponytail' && (
          <g id="back-hair-ponytail">
            <path
              d="M78 30 C95 18 108 30 102 52 C94 56 88 42 78 38 Z"
              fill={hairColor}
            />
            <ellipse cx="80" cy="33" rx="4" ry="3" fill="#EC4899" />
          </g>
        )}

        {config.hair === 'space_buns' && (
          <g id="back-hair-spacebuns">
            <circle cx="28" cy="28" r="11" fill={hairColor} />
            <circle cx="92" cy="28" r="11" fill={hairColor} />
            <ellipse cx="32" cy="35" rx="4" ry="2.5" fill="#F43F5E" />
            <ellipse cx="88" cy="35" rx="4" ry="2.5" fill="#F43F5E" />
          </g>
        )}

        {/* 2. 하체 & 다리 & 신발 (2등신 앙증맞은 다리) */}
        <g id="legs-and-feet">
          <rect x="46" y="98" width="9" height="18" rx="4.5" fill={config.outfit === 'suit' || config.outfit === 'police' || config.outfit === 'pilot' ? '#0F172A' : '#334155'} />
          <rect x="65" y="98" width="9" height="18" rx="4.5" fill={config.outfit === 'suit' || config.outfit === 'police' || config.outfit === 'pilot' ? '#0F172A' : '#334155'} />
          
          <ellipse cx="50.5" cy="117" rx="7" ry="4.5" fill="#1E293B" />
          <ellipse cx="69.5" cy="117" rx="7" ry="4.5" fill="#1E293B" />
          <ellipse cx="50.5" cy="115.5" rx="5" ry="2" fill="#FFFFFF" opacity="0.3" />
          <ellipse cx="69.5" cy="115.5" rx="5" ry="2" fill="#FFFFFF" opacity="0.3" />
        </g>

        {/* 3. 직업 의상 레이어 (몸통 & 팔) */}
        <g id="outfit-body">
          {/* 의상 1: 단정 교복 (school) */}
          {config.outfit === 'school' && (
            <g id="outfit-school">
              <path d="M41 78 C41 73 79 73 79 78 L77 103 C77 106 43 106 43 103 Z" fill="#1E293B" />
              <polygon points="53,77 67,77 60,89" fill="#FFFFFF" />
              <polygon points="58,80 62,80 61,96 59,96" fill="#EF4444" />
              <path d="M42 80 C34 85 35 96 43 98" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" />
              <path d="M78 80 C86 85 85 96 77 98" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 2: 힙한 캐주얼 후드 (hoodie) */}
          {config.outfit === 'hoodie' && (
            <g id="outfit-hoodie">
              <path d="M40 77 C40 72 80 72 80 77 L78 104 C78 107 42 107 42 104 Z" fill="#0D9488" />
              <ellipse cx="60" cy="79" rx="8" ry="4" fill="#115E59" />
              <line x1="57" y1="82" x2="57" y2="92" stroke="#CCFBF1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="63" y1="82" x2="63" y2="92" stroke="#CCFBF1" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M48 94 H72 L70 102 H50 Z" fill="#0F766E" rx="2" />
              <path d="M41 80 C33 86 35 96 43 99" stroke="#0D9488" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 80 C87 86 85 96 77 99" stroke="#0D9488" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 3: 의사/약사/연구원 화이트 가운 (doctor) */}
          {config.outfit === 'doctor' && (
            <g id="outfit-doctor">
              <path d="M40 76 C40 71 80 71 80 76 L78 106 C78 108 42 108 42 106 Z" fill="url(#doctorCoatGrad)" stroke="#CBD5E1" strokeWidth="1" />
              <polygon points="52,75 68,75 60,88" fill="#0284C7" />
              <path d="M50 78 L50 106 M70 78 L70 106" stroke="#E2E8F0" strokeWidth="1.2" />
              <rect x="44" y="85" width="6" height="5" rx="1" fill="#0284C7" />
              <path d="M41 79 C33 85 34 96 42 99" stroke="#F8FAFC" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#F8FAFC" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 4: IT 개발자 네이비 후드 & 사원증 (developer) */}
          {config.outfit === 'developer' && (
            <g id="outfit-developer">
              <path d="M41 77 C41 72 79 72 79 77 L77 104 C77 107 43 107 43 104 Z" fill="#312E81" />
              <path d="M57 77 L63 77 L61 104 L59 104 Z" fill="#818CF8" opacity="0.6" />
              <path d="M54 78 L60 88 L66 78" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
              <rect x="56" y="88" width="8" height="10" rx="1.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="0.8" />
              <rect x="58" y="90" width="4" height="2" fill="#38BDF8" />
              <path d="M42 80 C33 86 34 96 42 99" stroke="#312E81" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M78 80 C87 86 86 96 78 99" stroke="#312E81" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 5: 셰프 조리복 & 스카프 (chef) */}
          {config.outfit === 'chef' && (
            <g id="outfit-chef">
              <path d="M40 76 C40 71 80 71 80 76 L78 105 C78 108 42 108 42 105 Z" fill="url(#chefSuitGrad)" stroke="#CBD5E1" strokeWidth="0.8" />
              <path d="M52 75 Q60 84 68 75 Z" fill="#DC2626" />
              <circle cx="56" cy="85" r="1.5" fill="#334155" />
              <circle cx="64" cy="85" r="1.5" fill="#334155" />
              <circle cx="56" cy="93" r="1.5" fill="#334155" />
              <circle cx="64" cy="93" r="1.5" fill="#334155" />
              <path d="M41 79 C33 85 34 96 42 99" stroke="#F1F5F9" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#F1F5F9" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 6: 경찰/소방 제복 유니폼 & 금빛 뱃지 (police) */}
          {config.outfit === 'police' && (
            <g id="outfit-police">
              <path d="M40 76 C40 71 80 71 80 76 L78 104 C78 107 42 107 42 104 Z" fill="url(#policeSuitGrad)" />
              <polygon points="53,75 67,75 60,86" fill="#FFFFFF" />
              <polygon points="58,78 62,78 61,94 59,94" fill="#F59E0B" />
              <rect x="42" y="76" width="6" height="2.5" fill="#F59E0B" rx="1" />
              <rect x="72" y="76" width="6" height="2.5" fill="#F59E0B" rx="1" />
              <polygon points="46,85 48,82 50,85 49,88 47,88" fill="#FBBF24" />
              <path d="M41 79 C33 85 34 96 42 99" stroke="#1E3A8A" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#1E3A8A" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 7: 크리에이터 멜빵바지 & 스트라이프 티 (creator) */}
          {config.outfit === 'creator' && (
            <g id="outfit-creator">
              <path d="M41 77 C41 72 79 72 79 77 L77 104 C77 107 43 107 43 104 Z" fill="#F8FAFC" />
              <line x1="43" y1="81" x2="77" y2="81" stroke="#3B82F6" strokeWidth="2" />
              <line x1="43" y1="86" x2="77" y2="86" stroke="#3B82F6" strokeWidth="2" />
              <line x1="43" y1="91" x2="77" y2="91" stroke="#3B82F6" strokeWidth="2" />
              <rect x="48" y="88" width="24" height="16" rx="3" fill="#D97706" />
              <line x1="50" y1="77" x2="52" y2="88" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="70" y1="77" x2="68" y2="88" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="52" cy="89" r="1.2" fill="#FDE047" />
              <circle cx="68" cy="89" r="1.2" fill="#FDE047" />
              <path d="M42 80 C33 86 34 96 42 99" stroke="#F8FAFC" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M78 80 C87 86 86 96 78 99" stroke="#F8FAFC" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 8: 비즈니스 수트 & 넥타이 (suit) */}
          {config.outfit === 'suit' && (
            <g id="outfit-suit">
              <path d="M41 76 C41 71 79 71 79 76 L77 104 C77 107 43 107 43 104 Z" fill="#0F172A" />
              <polygon points="53,75 67,75 60,88" fill="#FFFFFF" />
              <polygon points="58,78 62,78 61,96 59,96" fill="#3B82F6" />
              <line x1="48" y1="78" x2="54" y2="95" stroke="#334155" strokeWidth="1.2" />
              <line x1="72" y1="78" x2="66" y2="95" stroke="#334155" strokeWidth="1.2" />
              <path d="M41 79 C33 85 34 96 42 99" stroke="#0F172A" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#0F172A" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 9: 항공기 조종사 파일럿 제복 (pilot) - 신규 */}
          {config.outfit === 'pilot' && (
            <g id="outfit-pilot">
              <path d="M40 76 C40 71 80 71 80 76 L78 104 C78 107 42 107 42 104 Z" fill="url(#pilotSuitGrad)" />
              <polygon points="53,75 67,75 60,86" fill="#FFFFFF" />
              <polygon points="58,78 62,78 61,94 59,94" fill="#0F172A" />
              {/* 골드 스트라이프 견장 */}
              <rect x="42" y="76" width="6" height="1.8" fill="#F59E0B" />
              <rect x="42" y="78.8" width="6" height="1.5" fill="#F59E0B" />
              <rect x="72" y="76" width="6" height="1.8" fill="#F59E0B" />
              <rect x="72" y="78.8" width="6" height="1.5" fill="#F59E0B" />
              {/* 골드 윙 뱃지 */}
              <path d="M46 86 L50 83.5 L54 86 L50 87.5 Z" fill="#FBBF24" />
              <circle cx="50" cy="85.5" r="1.2" fill="#D97706" />
              {/* 양팔 + 소매 골드 스트라이프 */}
              <path d="M41 79 C33 85 34 96 42 99" stroke="#0F172A" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#0F172A" strokeWidth="7.5" strokeLinecap="round" />
              <line x1="39" y1="94" x2="44" y2="97" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="81" y1="94" x2="76" y2="97" stroke="#F59E0B" strokeWidth="1.5" />
            </g>
          )}

          {/* 의상 10: 산업 엔지니어 안전조끼 (engineer) - 신규 */}
          {config.outfit === 'engineer' && (
            <g id="outfit-engineer">
              {/* 이너 워크 셔츠 */}
              <path d="M40 76 C40 71 80 71 80 76 L78 104 C78 107 42 107 42 104 Z" fill="#475569" />
              {/* 형광 오렌지 안전 조끼 */}
              <path d="M43 77 H77 L75 104 H45 Z" fill="#EA580C" />
              {/* 반사띠 스트라이프 */}
              <rect x="45" y="87" width="30" height="4" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.5" />
              <line x1="53" y1="77" x2="53" y2="104" stroke="#FEF08A" strokeWidth="2.5" />
              <line x1="67" y1="77" x2="67" y2="104" stroke="#FEF08A" strokeWidth="2.5" />
              {/* 양팔 */}
              <path d="M41 79 C33 85 34 96 42 99" stroke="#475569" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#475569" strokeWidth="7.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 11: 법관/교수 법복 가운 (judge) - 신규 */}
          {config.outfit === 'judge' && (
            <g id="outfit-judge">
              <path d="M39 76 C39 70 81 70 81 76 L79 108 C79 110 41 110 41 108 Z" fill="url(#judgeGrad)" stroke="#17040B" strokeWidth="0.8" />
              {/* 화이트 밴드 칼라 */}
              <ellipse cx="60" cy="77" rx="10" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="60" y1="81" x2="60" y2="108" stroke="#881337" strokeWidth="2.2" />
              <line x1="52" y1="83" x2="50" y2="108" stroke="#000000" strokeWidth="1" opacity="0.4" />
              <line x1="68" y1="83" x2="70" y2="108" stroke="#000000" strokeWidth="1" opacity="0.4" />
              {/* 양팔 와이드 소매 */}
              <path d="M41 79 C32 85 33 97 42 101" stroke="#3F0E1E" strokeWidth="8.5" strokeLinecap="round" />
              <path d="M79 79 C88 85 87 97 78 101" stroke="#3F0E1E" strokeWidth="8.5" strokeLinecap="round" />
            </g>
          )}

          {/* 의상 12: 스포츠/e스포츠 스포티 져지 (athlete) - 신규 */}
          {config.outfit === 'athlete' && (
            <g id="outfit-athlete">
              <path d="M40 76 C40 71 80 71 80 76 L78 104 C78 107 42 107 42 104 Z" fill="#0284C7" />
              {/* 센터 화이트 지퍼 & 스트라이프 */}
              <line x1="60" y1="76" x2="60" y2="104" stroke="#FFFFFF" strokeWidth="1.8" />
              <path d="M44 80 L52 104 M76 80 L68 104" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.75" />
              {/* 백넘버 7 뱃지 */}
              <circle cx="50" cy="88" r="3.5" fill="#FFFFFF" />
              <circle cx="50" cy="88" r="2.5" fill="#0284C7" />
              {/* 양팔 */}
              <path d="M41 79 C33 85 34 96 42 99" stroke="#0284C7" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M79 79 C87 85 86 96 78 99" stroke="#0284C7" strokeWidth="7.5" strokeLinecap="round" />
              <line x1="37" y1="86" x2="41" y2="92" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="83" y1="86" x2="79" y2="92" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}

          {/* 손 (피부톤 원) */}
          <circle cx="42" cy="99" r="4.5" fill="url(#skinGradV)" />
          <circle cx="78" cy="99" r="4.5" fill="url(#skinGradV)" />
        </g>

        {/* 4. 손 소품 레이어 (item: 12종) */}
        <g id="hand-item">
          {config.item === 'laptop' && (
            <g id="item-laptop">
              <rect x="73" y="90" width="18" height="13" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <rect x="75" y="92" width="14" height="8" rx="1" fill="#38BDF8" />
              <line x1="77" y1="95" x2="85" y2="95" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="77" y1="97" x2="82" y2="97" stroke="#FFFFFF" strokeWidth="1" />
            </g>
          )}

          {config.item === 'stethoscope' && (
            <g id="item-stethoscope">
              <path d="M52 80 C50 90 60 97 74 96" stroke="#0EA5E9" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="74" cy="96" r="4" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.2" />
              <circle cx="74" cy="96" r="1.5" fill="#0EA5E9" />
            </g>
          )}

          {config.item === 'tablet' && (
            <g id="item-tablet">
              <rect x="73" y="89" width="16" height="15" rx="2.5" fill="#1E293B" stroke="#475569" strokeWidth="0.8" />
              <rect x="75" y="91" width="12" height="10" rx="1" fill="#EC4899" opacity="0.8" />
              <line x1="86" y1="96" x2="93" y2="88" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          )}

          {config.item === 'book' && (
            <g id="item-book">
              <rect x="72" y="90" width="16" height="14" rx="2" fill="#4F46E5" />
              <rect x="70" y="92" width="3" height="10" rx="1" fill="#FBBF24" />
              <line x1="75" y1="94" x2="84" y2="94" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1="75" y1="98" x2="82" y2="98" stroke="#FFFFFF" strokeWidth="1.2" />
            </g>
          )}

          {config.item === 'mic' && (
            <g id="item-mic">
              <line x1="78" y1="99" x2="85" y2="91" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
              <circle cx="87" cy="89" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
              <circle cx="87" cy="89" r="2.5" fill="#FDE68A" />
            </g>
          )}

          {config.item === 'pan' && (
            <g id="item-pan">
              <line x1="78" y1="99" x2="84" y2="96" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="91" cy="92" r="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <circle cx="91" cy="92" r="5" fill="#F59E0B" opacity="0.6" />
            </g>
          )}

          {config.item === 'beaker' && (
            <g id="item-beaker">
              <polygon points="76,102 86,102 83,93 83,90 79,90 79,93" fill="#A855F7" opacity="0.85" stroke="#7E22CE" strokeWidth="1" />
              <ellipse cx="81" cy="98" rx="3" ry="1.5" fill="#E9D5FF" />
            </g>
          )}

          {/* 소품 9: 미니 비행기 모형 (airplane) - 신규 */}
          {config.item === 'airplane' && (
            <g id="item-airplane">
              <ellipse cx="84" cy="94" rx="8" ry="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" transform="rotate(-25 84 94)" />
              <polygon points="80,97 86,90 84,97" fill="#38BDF8" />
              <polygon points="76,96 78,92 80,95" fill="#0284C7" />
              <circle cx="88" cy="91" r="1.2" fill="#EF4444" />
            </g>
          )}

          {/* 소품 10: 정의의 법봉 (gavel) - 신규 */}
          {config.item === 'gavel' && (
            <g id="item-gavel">
              <line x1="77" y1="100" x2="86" y2="90" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="82" y="86" width="10" height="5" rx="1.5" fill="#92400E" stroke="#451A03" strokeWidth="0.8" transform="rotate(-40 87 88.5)" />
              <line x1="84" y1="87" x2="89" y2="91" stroke="#F59E0B" strokeWidth="1" />
            </g>
          )}

          {/* 소품 11: e스포츠 게이밍 패드 (controller) - 신규 */}
          {config.item === 'controller' && (
            <g id="item-controller">
              <rect x="73" y="89" width="17" height="12" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1" />
              <path d="M77 93 H81 M79 91 V95" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="85" cy="92" r="1" fill="#EF4444" />
              <circle cx="87" cy="94" r="1" fill="#3B82F6" />
              <circle cx="85" cy="96" r="1" fill="#10B981" />
              <circle cx="83" cy="94" r="1" fill="#F59E0B" />
            </g>
          )}

          {/* 소품 12: 엔지니어 만능 렌치 (wrench) - 신규 */}
          {config.item === 'wrench' && (
            <g id="item-wrench">
              <line x1="77" y1="101" x2="88" y2="88" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
              <path d="M86 86 C88 83 92 84 94 87 C91 88 90 91 93 93 C90 95 86 93 85 90 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            </g>
          )}
        </g>

        {/* 5. 2등신 얼굴 베이스 (대두 & 발그레 볼터치) */}
        <g id="head-base">
          <circle cx="33" cy="52" r="5" fill="url(#skinGradV)" />
          <circle cx="87" cy="52" r="5" fill="url(#skinGradV)" />

          <path
            d="M35 48 C35 32 44 22 60 22 C76 22 85 32 85 48 C85 65 76 73 60 73 C44 73 35 65 35 48 Z"
            fill="url(#skinGradV)"
          />

          {/* 발그레 핑크 볼터치 */}
          <ellipse cx="43" cy="57" rx="5" ry="3" fill="#FF8A9E" opacity="0.6" />
          <ellipse cx="77" cy="57" rx="5" ry="3" fill="#FF8A9E" opacity="0.6" />

          {/* 표정 1: sparkle (초롱초롱) */}
          {config.face === 'sparkle' && (
            <g id="face-sparkle">
              <ellipse cx="49" cy="49" rx="5" ry="6.5" fill="#1E293B" />
              <ellipse cx="71" cy="49" rx="5" ry="6.5" fill="#1E293B" />
              <circle cx="47" cy="47" r="2.2" fill="#FFFFFF" />
              <circle cx="51" cy="51" r="1.2" fill="#FFFFFF" />
              <circle cx="69" cy="47" r="2.2" fill="#FFFFFF" />
              <circle cx="73" cy="51" r="1.2" fill="#FFFFFF" />
              <path d="M45 40 Q49 37 53 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M67 40 Q71 37 75 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M57 61 Q60 66 63 61" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 표정 2: smile (방긋 미소) */}
          {config.face === 'smile' && (
            <g id="face-smile">
              <path d="M44 49 Q49 43 54 49" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M66 49 Q71 43 76 49" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M45 40 Q49 37 53 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M67 40 Q71 37 75 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M56 60 Q60 67 64 60 Z" fill="#E11D48" />
            </g>
          )}

          {/* 표정 3: wink (깜찍 윙크) */}
          {config.face === 'wink' && (
            <g id="face-wink">
              <path d="M44 49 L49 46 L44 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <ellipse cx="71" cy="49" rx="5" ry="6.5" fill="#1E293B" />
              <circle cx="69" cy="47" r="2.2" fill="#FFFFFF" />
              <circle cx="73" cy="51" r="1.2" fill="#FFFFFF" />
              <path d="M57 61 Q61 66 64 62" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 표정 4: confident (당당·열정) */}
          {config.face === 'confident' && (
            <g id="face-confident">
              <ellipse cx="49" cy="49" rx="4.8" ry="6" fill="#1E293B" />
              <ellipse cx="71" cy="49" rx="4.8" ry="6" fill="#1E293B" />
              <circle cx="47.5" cy="47" r="2" fill="#FFFFFF" />
              <circle cx="69.5" cy="47" r="2" fill="#FFFFFF" />
              <path d="M44 41 L53 38" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M76 41 L67 38" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M56 61 Q61 64 64 60" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* 표정 5: focus (연구·집중) - 신규 */}
          {config.face === 'focus' && (
            <g id="face-focus">
              <ellipse cx="49" cy="49" rx="4.5" ry="5.8" fill="#0F172A" />
              <ellipse cx="71" cy="49" rx="4.5" ry="5.8" fill="#0F172A" />
              <circle cx="48.5" cy="47.5" r="1.8" fill="#FFFFFF" />
              <circle cx="70.5" cy="47.5" r="1.8" fill="#FFFFFF" />
              <path d="M43 43 L52 40" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M77 43 L68 40" stroke="#0F172A" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="57" y1="62" x2="63" y2="62" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          )}

          {/* 표정 6: healing (힐링·다정) - 신규 */}
          {config.face === 'healing' && (
            <g id="face-healing">
              <path d="M44 49 Q49 44 54 49" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M66 49 Q71 44 76 49" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M45 41 Q49 39 53 42" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M67 42 Q71 39 75 41" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M57 60 Q60 64 63 60" stroke="#E11D48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <circle cx="43" cy="55" r="3.5" fill="#FF8A9E" opacity="0.4" />
              <circle cx="77" cy="55" r="3.5" fill="#FF8A9E" opacity="0.4" />
            </g>
          )}

          {/* 표정 7: star_eyes (반짝 감동) - 신규 */}
          {config.face === 'star_eyes' && (
            <g id="face-star-eyes">
              <path d="M49 43.5 L50.5 47 L54.5 47.5 L51.5 50.5 L52.5 54.5 L49 52 L45.5 54.5 L46.5 50.5 L43.5 47.5 L47.5 47 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
              <path d="M71 43.5 L72.5 47 L76.5 47.5 L73.5 50.5 L74.5 54.5 L71 52 L67.5 54.5 L68.5 50.5 L65.5 47.5 L69.5 47 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
              <circle cx="49" cy="49" r="1.5" fill="#FFFFFF" />
              <circle cx="71" cy="49" r="1.5" fill="#FFFFFF" />
              <path d="M45 40 Q49 37 53 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M67 40 Q71 37 75 40" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse cx="60" cy="62" rx="3.5" ry="4.5" fill="#E11D48" />
              <circle cx="60" cy="60" r="1.5" fill="#FFFFFF" opacity="0.6" />
            </g>
          )}

          {/* 표정 8: playful (장난꾸러기 메롱) - 신규 */}
          {config.face === 'playful' && (
            <g id="face-playful">
              <path d="M44 48 L49 45 L44 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M76 48 L71 45 L76 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M55 59 H65 Q60 67 55 59 Z" fill="#E11D48" />
              <path d="M58 61 C58 66 62 66 62 61 Z" fill="#FB7185" />
            </g>
          )}
        </g>

        {/* 6. 안경 레이어 (accessory: round, square, sunglasses) */}
        <g id="accessory">
          {config.accessory === 'round' && (
            <g id="acc-round">
              <circle cx="49" cy="49" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.6" />
              <circle cx="71" cy="49" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.6" />
              <line x1="57" y1="49" x2="63" y2="49" stroke="#F59E0B" strokeWidth="1.6" />
            </g>
          )}

          {config.accessory === 'square' && (
            <g id="acc-square">
              <rect x="41" y="43" width="15" height="12" rx="3" fill="none" stroke="#0F172A" strokeWidth="2" />
              <rect x="64" y="43" width="15" height="12" rx="3" fill="none" stroke="#0F172A" strokeWidth="2" />
              <line x1="56" y1="48" x2="64" y2="48" stroke="#0F172A" strokeWidth="2" />
            </g>
          )}

          {config.accessory === 'sunglasses' && (
            <g id="acc-sunglasses">
              <rect x="40" y="43" width="17" height="12" rx="3.5" fill="#0F172A" />
              <rect x="63" y="43" width="17" height="12" rx="3.5" fill="#0F172A" />
              <line x1="57" y1="47" x2="63" y2="47" stroke="#0F172A" strokeWidth="2.5" />
              <line x1="42" y1="45" x2="55" y2="52" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
              <line x1="65" y1="45" x2="78" y2="52" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
            </g>
          )}
        </g>

        {/* 7. 앞머리 & 메인 헤어 레이어 (hair & hairColor: 10종) */}
        <g id="front-hair">
          {/* 헤어 1: 단정 숏컷 (short_dandy) */}
          {config.hair === 'short_dandy' && (
            <path
              d="M33 46 C32 28 44 14 60 14 C76 14 88 28 87 46 C85 41 80 37 76 36 C70 40 65 35 59 36 C52 36 46 40 42 36 C38 39 35 42 33 46 Z"
              fill={hairColor}
            />
          )}

          {/* 헤어 2: 트렌디 쉼표머리 (comma) */}
          {config.hair === 'comma' && (
            <g id="hair-comma">
              <path
                d="M33 46 C32 26 44 14 60 14 C76 14 88 28 87 46 C84 38 78 34 71 36 C64 33 58 35 55 38 C52 32 42 34 38 38 C35 40 34 43 33 46 Z"
                fill={hairColor}
              />
              <path d="M55 35 C58 42 54 48 48 45 C52 40 54 36 55 35 Z" fill={hairColor} />
            </g>
          )}

          {/* 헤어 3: 둥글고 귀여운 단발 (bob) */}
          {config.hair === 'bob' && (
            <path
              d="M31 52 C30 26 42 14 60 14 C78 14 90 26 89 52 C89 62 84 66 84 66 C84 46 80 38 74 37 C66 41 60 36 54 37 C46 36 41 42 36 38 C36 46 36 66 36 66 C36 66 31 62 31 52 Z"
              fill={hairColor}
            />
          )}

          {/* 헤어 4: 포니테일 앞머리 (ponytail) */}
          {config.hair === 'ponytail' && (
            <path
              d="M33 46 C32 26 44 14 60 14 C76 14 87 26 87 46 C84 40 79 36 74 36 C68 41 63 36 57 37 C51 36 45 40 41 36 C37 39 35 42 33 46 Z"
              fill={hairColor}
            />
          )}

          {/* 헤어 5: 우아한 롱 웨이브 앞머리 (long_wave) */}
          {config.hair === 'long_wave' && (
            <path
              d="M32 48 C31 26 43 14 60 14 C77 14 89 26 88 48 C85 41 80 36 75 36 C69 41 64 36 58 37 C51 36 45 40 41 36 C37 39 34 42 32 48 Z"
              fill={hairColor}
            />
          )}

          {/* 헤어 6: 투블럭 컷 (two_block) */}
          {config.hair === 'two_block' && (
            <g id="hair-two-block">
              <path d="M33 44 C33 34 38 24 45 19 L45 36 Z" fill="#0F172A" opacity="0.6" />
              <path d="M87 44 C87 34 82 24 75 19 L75 36 Z" fill="#0F172A" opacity="0.6" />
              <path
                d="M35 38 C34 22 45 13 60 13 C75 13 86 22 85 38 C81 33 77 31 72 34 C66 31 60 33 56 32 C50 31 44 33 40 32 C37 34 35 36 35 38 Z"
                fill={hairColor}
              />
            </g>
          )}

          {/* 헤어 7: 가르마 리프컷 (leaf_part) - 신규 */}
          {config.hair === 'leaf_part' && (
            <g id="hair-leaf-part">
              <path
                d="M33 46 C32 26 44 14 60 14 C76 14 88 28 87 46 C84 37 76 34 68 35 C62 31 54 33 50 37 C44 33 38 36 34 42 Z"
                fill={hairColor}
              />
              <path d="M50 37 C54 44 51 50 46 47 C49 42 50 38 50 37 Z" fill={hairColor} />
              <path d="M68 35 C66 43 70 48 74 46 C71 41 69 37 68 35 Z" fill={hairColor} />
            </g>
          )}

          {/* 헤어 8: 양갈래 번 앞머리 (space_buns) - 신규 */}
          {config.hair === 'space_buns' && (
            <path
              d="M32 46 C31 26 43 14 60 14 C77 14 89 26 88 46 C85 41 80 37 74 38 C68 37 60 38 54 38 C46 37 40 41 35 38 C33 41 32 43 32 46 Z"
              fill={hairColor}
            />
          )}

          {/* 헤어 9: 볼륨 쉐도우 펌 (curly_perm) - 신규 */}
          {config.hair === 'curly_perm' && (
            <g id="hair-curly-perm">
              <path
                d="M32 46 C30 32 38 18 50 15 C54 13 66 13 70 15 C82 18 90 32 88 46 C86 42 82 39 78 40 C74 36 68 37 64 35 C60 38 54 36 50 38 C46 36 40 38 36 41 C33 42 32 44 32 46 Z"
                fill={hairColor}
              />
              <circle cx="42" cy="27" r="7" fill={hairColor} />
              <circle cx="54" cy="21" r="7.5" fill={hairColor} />
              <circle cx="66" cy="21" r="7.5" fill={hairColor} />
              <circle cx="78" cy="27" r="7" fill={hairColor} />
            </g>
          )}

          {/* 헤어 10: 샤프한 포마드 올림머리 (pomade) - 신규 */}
          {config.hair === 'pomade' && (
            <g id="hair-pomade">
              <path
                d="M34 44 C33 34 38 22 46 16 C54 11 68 11 76 16 C84 22 88 34 86 44 C84 38 80 35 76 34 C70 33 60 32 50 34 C44 35 38 38 34 44 Z"
                fill={hairColor}
              />
              <path d="M46 16 Q60 22 74 18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.3" fill="none" />
              <path d="M42 24 Q60 30 78 26" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.25" fill="none" />
            </g>
          )}
        </g>

        {/* 8. 셰프 모자 (chef 의상 선택 시 귀여운 요리사 모자 장착) */}
        {config.outfit === 'chef' && (
          <g id="chef-hat">
            <ellipse cx="60" cy="14" rx="20" ry="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M44 14 Q60 2 76 14 Z" fill="#FFFFFF" />
            <rect x="46" y="13" width="28" height="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" rx="1.5" />
          </g>
        )}

        {/* 9. 귀여운 반짝이 별빛 효과 (Sparkles) */}
        <g id="sparkles-fx" opacity="0.85">
          <path d="M96 24 L98 19 L100 24 L105 26 L100 28 L98 33 L96 28 L91 26 Z" fill="#FBBF24" />
          <path d="M19 68 L20.5 64 L22 68 L26 69.5 L22 71 L20.5 75 L19 71 L15 69.5 Z" fill="#38BDF8" />
        </g>
      </svg>
    </div>
  );
};
