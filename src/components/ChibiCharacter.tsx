// src/components/ChibiCharacter.tsx
import React from 'react';

export type CharacterArchetype = 
  | 'tech' 
  | 'creator' 
  | 'billionaire' 
  | 'specialist' 
  | 'titan' 
  | 'healer' 
  | 'explorer';

function getCharacterArchetype(title: string, code?: string): CharacterArchetype {
  const t = title.toLowerCase();
  if (t.includes('테크') || t.includes('혁신') || t.includes('ai') || t.includes('개발') || t.includes('공학') || t.includes('데이터')) return 'tech';
  if (t.includes('크리에이터') || t.includes('창작') || t.includes('예술') || t.includes('디자이너') || t.includes('작가') || t.includes('웹툰')) return 'creator';
  if (t.includes('백만장자') || t.includes('부자') || t.includes('사업') || t.includes('투자') || t.includes('금융') || t.includes('ceo')) return 'billionaire';
  if (t.includes('권위자') || t.includes('전문직') || t.includes('의사') || t.includes('변호사') || t.includes('약사') || t.includes('연구')) return 'specialist';
  if (t.includes('거인') || t.includes('산업') || t.includes('엔지니어') || t.includes('플랜트') || t.includes('항공') || t.includes('선박')) return 'titan';
  if (t.includes('힐링') || t.includes('마스터') || t.includes('카페') || t.includes('선생님') || t.includes('상담') || t.includes('따뜻')) return 'healer';
  
  // 성향 코드 기반 보조 판별
  if (code && code.includes('T')) return 'tech';
  if (code && code.includes('C')) return 'creator';
  if (code && code.includes('L')) return 'specialist';
  
  return 'explorer';
}

interface ChibiCharacterProps {
  archetype?: CharacterArchetype;
  title?: string;
  code?: string;
  size?: number; // 기본 크기 (px)
  className?: string;
}

export const ChibiCharacter: React.FC<ChibiCharacterProps> = ({
  archetype,
  title = '',
  code = '',
  size = 120,
  className = ''
}) => {
  const currentArchetype = archetype || getCharacterArchetype(title, code);

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label={`${title || '진로 캐릭터'} 2D 2등신 일러스트`}
    >
      <svg
        viewBox="0 0 120 130"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0E5" />
            <stop offset="100%" stopColor="#FCD5BD" />
          </linearGradient>
          <linearGradient id="techSuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id="creatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="richGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="specialistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="titanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="healerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="explorerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* ========================================================
            1. 공통 다리 & 발 (2등신 앙증맞은 다리)
           ======================================================== */}
        <g id="legs">
          <ellipse cx="50" cy="116" rx="6.5" ry="4.5" fill="#334155" />
          <ellipse cx="70" cy="116" rx="6.5" ry="4.5" fill="#334155" />
          <rect x="46" y="100" width="8" height="15" rx="4" fill="#475569" />
          <rect x="66" y="100" width="8" height="15" rx="4" fill="#475569" />
        </g>

        {/* ========================================================
            2. 캐릭터별 몸통 & 의상 (Archetype Body & Arms)
           ======================================================== */}
        {currentArchetype === 'tech' && (
          <g id="body-tech">
            {/* IT 후드집업 & 태블릿 */}
            <path d="M42 80 C42 74 78 74 78 80 L76 104 C76 107 44 107 44 104 Z" fill="url(#techSuitGrad)" />
            <path d="M57 80 L63 80 L61 104 L59 104 Z" fill="#E0E7FF" opacity="0.8" />
            {/* 왼팔 */}
            <path d="M42 82 C34 88 34 98 40 102" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
            <circle cx="40" cy="102" r="4.5" fill="url(#skinGrad)" />
            {/* 오른팔 + 홀로그램 태블릿 */}
            <path d="M78 82 C86 86 84 96 76 99" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
            <circle cx="76" cy="99" r="4.5" fill="url(#skinGrad)" />
            <rect x="74" y="92" width="16" height="12" rx="2.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <path d="M77 96 H87 M77 99 H84" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}

        {currentArchetype === 'creator' && (
          <g id="body-creator">
            {/* 트렌디 멜빵/자켓 & 팔레트 */}
            <path d="M42 80 C42 74 78 74 78 80 L76 104 C76 107 44 107 44 104 Z" fill="url(#creatorGrad)" />
            <circle cx="60" cy="90" r="3" fill="#FDE047" />
            {/* 왼팔 + 팔레트 */}
            <path d="M42 82 C33 87 34 97 42 99" stroke="#8B5CF6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="42" cy="99" r="4.5" fill="url(#skinGrad)" />
            <ellipse cx="33" cy="97" rx="8" ry="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="31" cy="95" r="1.5" fill="#EF4444" />
            <circle cx="35" cy="95" r="1.5" fill="#3B82F6" />
            <circle cx="33" cy="99" r="1.5" fill="#10B981" />
            {/* 오른팔 붓 */}
            <path d="M78 82 C86 86 87 96 82 101" stroke="#8B5CF6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="82" cy="101" r="4.5" fill="url(#skinGrad)" />
            <line x1="84" y1="99" x2="93" y2="90" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <path d="M93 90 L95 88" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {currentArchetype === 'billionaire' && (
          <g id="body-rich">
            {/* 고급 수트 & 골드 타이 */}
            <path d="M42 79 C42 74 78 74 78 79 L76 104 C76 107 44 107 44 104 Z" fill="#0F172A" />
            {/* 화이트 셔츠 & 골드 타이 */}
            <polygon points="54,78 66,78 60,88" fill="#FFFFFF" />
            <polygon points="58,80 62,80 61,96 59,96" fill="#F59E0B" />
            {/* 양팔 당당한 포즈 */}
            <path d="M42 81 C34 85 36 96 44 97" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
            <circle cx="44" cy="97" r="4.5" fill="url(#skinGrad)" />
            <path d="M78 81 C86 85 84 96 76 97" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
            <circle cx="76" cy="97" r="4.5" fill="url(#skinGrad)" />
            {/* 골드 시계 액센트 */}
            <circle cx="76" cy="94" r="2.5" fill="#F59E0B" />
          </g>
        )}

        {currentArchetype === 'specialist' && (
          <g id="body-specialist">
            {/* 전문직 화이트 랩코트 & 스마트 셔츠 */}
            <path d="M42 79 C42 74 78 74 78 79 L76 104 C76 107 44 107 44 104 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="54,78 66,78 60,88" fill="#0284C7" />
            <path d="M52 82 L52 104 M68 82 L68 104" stroke="#CBD5E1" strokeWidth="1" />
            {/* 왼팔 + 스마트 차트/패드 */}
            <path d="M42 81 C34 86 35 97 42 100" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
            <circle cx="42" cy="100" r="4.5" fill="url(#skinGrad)" />
            <rect x="28" y="92" width="13" height="16" rx="2" fill="#0369A1" />
            <line x1="31" y1="96" x2="38" y2="96" stroke="white" strokeWidth="1" />
            <line x1="31" y1="100" x2="38" y2="100" stroke="white" strokeWidth="1" />
            {/* 오른팔 */}
            <path d="M78 81 C85 86 84 96 77 98" stroke="#F8FAFC" strokeWidth="7" strokeLinecap="round" />
            <circle cx="77" cy="98" r="4.5" fill="url(#skinGrad)" />
          </g>
        )}

        {currentArchetype === 'titan' && (
          <g id="body-titan">
            {/* 안전 조끼 & 든든한 워크자켓 */}
            <path d="M42 79 C42 74 78 74 78 79 L76 104 C76 107 44 107 44 104 Z" fill="url(#titanGrad)" />
            {/* 반사띠 형광 스트라이프 */}
            <rect x="44" y="87" width="32" height="4" fill="#FDE047" />
            <path d="M52 78 L52 104 M68 78 L68 104" stroke="#FDE047" strokeWidth="2.5" />
            {/* 주먹 쥔 든든한 양팔 */}
            <path d="M42 81 C33 86 35 98 42 100" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="42" cy="100" r="5" fill="url(#skinGrad)" />
            <path d="M78 81 C87 86 85 98 78 100" stroke="#C2410C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="78" cy="100" r="5" fill="url(#skinGrad)" />
          </g>
        )}

        {currentArchetype === 'healer' && (
          <g id="body-healer">
            {/* 따뜻한 포근 에이프런 & 티타임 머그 */}
            <path d="M42 79 C42 74 78 74 78 79 L76 104 C76 107 44 107 44 104 Z" fill="#FDE68A" />
            <path d="M47 84 H73 V104 H47 Z" fill="url(#healerGrad)" rx="3" />
            {/* 왼팔 머그컵 */}
            <path d="M42 81 C34 86 35 96 44 98" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
            <circle cx="44" cy="98" r="4.5" fill="url(#skinGrad)" />
            <rect x="42" y="93" width="9" height="10" rx="2" fill="#FFFFFF" stroke="#059669" strokeWidth="1" />
            <path d="M45 90 Q46.5 87 48 90" stroke="#10B981" strokeWidth="1" strokeLinecap="round" />
            {/* 오른팔 반갑게 인사 */}
            <path d="M78 81 C86 85 88 95 82 99" stroke="#F59E0B" strokeWidth="7" strokeLinecap="round" />
            <circle cx="82" cy="99" r="4.5" fill="url(#skinGrad)" />
          </g>
        )}

        {currentArchetype === 'explorer' && (
          <g id="body-explorer">
            {/* 활기찬 어드벤처 조끼 & 나침반 배지 */}
            <path d="M42 79 C42 74 78 74 78 79 L76 104 C76 107 44 107 44 104 Z" fill="url(#explorerGrad)" />
            <polygon points="56,79 64,79 60,86" fill="#FEF3C7" />
            {/* 골드 나침반 펜던트 */}
            <circle cx="60" cy="92" r="3.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            {/* 왼팔 파이팅 */}
            <path d="M42 81 C34 84 34 94 40 97" stroke="#D97706" strokeWidth="7" strokeLinecap="round" />
            <circle cx="40" cy="97" r="4.5" fill="url(#skinGrad)" />
            {/* 오른팔 인사하는 포즈 */}
            <path d="M78 81 C86 83 89 74 86 68" stroke="#D97706" strokeWidth="7" strokeLinecap="round" />
            <circle cx="86" cy="68" r="4.5" fill="url(#skinGrad)" />
          </g>
        )}

        {/* ========================================================
            3. 공통 2등신 얼굴 (귀엽고 둥근 대두 페이스)
           ======================================================== */}
        <g id="head-base">
          {/* 귀 */}
          <circle cx="34" cy="53" r="5" fill="url(#skinGrad)" />
          <circle cx="86" cy="53" r="5" fill="url(#skinGrad)" />

          {/* 얼굴 윤곽 */}
          <path
            d="M36 50 C36 34 44 24 60 24 C76 24 84 34 84 50 C84 66 75 74 60 74 C45 74 36 66 36 50 Z"
            fill="url(#skinGrad)"
          />

          {/* 볼터치 (사랑스러운 분홍 볼) */}
          <ellipse cx="44" cy="58" rx="4.5" ry="2.5" fill="#FF8A9E" opacity="0.55" />
          <ellipse cx="76" cy="58" rx="4.5" ry="2.5" fill="#FF8A9E" opacity="0.55" />

          {/* 반짝이는 초롱초롱 눈망울 (Chibi Sparkle Eyes) */}
          <ellipse cx="49" cy="50" rx="4.5" ry="6" fill="#1E293B" />
          <ellipse cx="71" cy="50" rx="4.5" ry="6" fill="#1E293B" />
          {/* 눈빛 하이라이트 */}
          <circle cx="47.5" cy="48" r="2" fill="#FFFFFF" />
          <circle cx="50.5" cy="52" r="1" fill="#FFFFFF" />
          <circle cx="69.5" cy="48" r="2" fill="#FFFFFF" />
          <circle cx="72.5" cy="52" r="1" fill="#FFFFFF" />

          {/* 눈썹 */}
          <path d="M45 42 Q49 39 53 42" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M67 42 Q71 39 75 42" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />

          {/* 귀여운 스마일 입 */}
          <path d="M57 62 Q60 66 63 62" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================
            4. 성향별 헤어스타일 & 시그니처 악세서리
           ======================================================== */}
        {currentArchetype === 'tech' && (
          <g id="hair-tech">
            {/* 사이버 인디고 볼륨 헤어 */}
            <path
              d="M34 46 C33 30 44 16 60 16 C76 16 87 30 86 46 C84 41 81 37 77 34 C72 39 68 33 60 34 C52 35 47 38 43 35 C39 37 36 41 34 46 Z"
              fill="#312E81"
            />
            {/* 스마트 글래스 (테크 안경) */}
            <rect x="42" y="45" width="14" height="10" rx="3" fill="#38BDF8" fillOpacity="0.25" stroke="#4F46E5" strokeWidth="1.5" />
            <rect x="64" y="45" width="14" height="10" rx="3" fill="#38BDF8" fillOpacity="0.25" stroke="#4F46E5" strokeWidth="1.5" />
            <line x1="56" y1="49" x2="64" y2="49" stroke="#4F46E5" strokeWidth="1.5" />
          </g>
        )}

        {currentArchetype === 'creator' && (
          <g id="hair-creator">
            {/* 바이올렛 웨이브 헤어 */}
            <path
              d="M33 48 C32 32 42 18 60 18 C78 18 88 32 87 48 C85 42 81 37 76 36 C70 41 65 34 58 36 C50 37 45 40 41 36 C38 39 35 43 33 48 Z"
              fill="#7C3AED"
            />
            {/* 예술가 핑크 베레모 */}
            <ellipse cx="60" cy="22" rx="26" ry="11" fill="#F43F5E" />
            <circle cx="60" cy="11" r="2.5" fill="#FDE047" />
          </g>
        )}

        {currentArchetype === 'billionaire' && (
          <g id="hair-rich">
            {/* 고급스러운 골드 브라운 가르마 헤어 */}
            <path
              d="M34 46 C33 30 44 16 60 16 C76 16 87 30 86 46 C83 40 78 35 73 35 C68 35 63 38 58 35 C50 35 44 39 40 36 C37 38 35 42 34 46 Z"
              fill="#92400E"
            />
            {/* 미니 골든 크라운 */}
            <polygon points="52,16 55,8 60,13 65,8 68,16" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="60" cy="11" r="1.5" fill="#EF4444" />
          </g>
        )}

        {currentArchetype === 'specialist' && (
          <g id="hair-specialist">
            {/* 단정하고 지적인 네이비 헤어 */}
            <path
              d="M34 46 C34 30 45 17 60 17 C75 17 86 30 86 46 C84 41 79 36 74 36 C68 36 64 38 60 36 C54 36 48 39 42 36 C38 39 35 42 34 46 Z"
              fill="#1E293B"
            />
            {/* 은색 라운드 스마트 안경 */}
            <circle cx="49" cy="50" r="7.5" fill="none" stroke="#0284C7" strokeWidth="1.4" />
            <circle cx="71" cy="50" r="7.5" fill="none" stroke="#0284C7" strokeWidth="1.4" />
            <line x1="56.5" y1="50" x2="63.5" y2="50" stroke="#0284C7" strokeWidth="1.4" />
          </g>
        )}

        {currentArchetype === 'titan' && (
          <g id="hair-titan">
            {/* 든든한 다크 브라운 헤어 */}
            <path
              d="M33 46 C33 30 44 18 60 18 C76 18 87 30 87 46 C85 41 80 37 76 36 C70 40 65 35 59 36 C52 36 46 40 42 36 C38 39 35 42 33 46 Z"
              fill="#451A03"
            />
            {/* 노란색 안전모 헬멧 */}
            <path d="M36 26 C36 12 84 12 84 26 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            <rect x="33" y="24" width="54" height="4.5" rx="2" fill="#EAB308" />
          </g>
        )}

        {currentArchetype === 'healer' && (
          <g id="hair-healer">
            {/* 포근한 에메랄드 리프 헤어 & 클로버 핀 */}
            <path
              d="M33 48 C32 30 44 17 60 17 C76 17 88 30 87 48 C85 42 80 38 75 37 C69 41 64 35 58 37 C51 37 45 41 41 37 C37 40 34 43 33 48 Z"
              fill="#065F46"
            />
            {/* 앙증맞은 네잎클로버 머리핀 */}
            <circle cx="78" cy="30" r="3" fill="#34D399" />
            <circle cx="83" cy="30" r="3" fill="#34D399" />
            <circle cx="80.5" cy="27" r="3" fill="#34D399" />
            <circle cx="80.5" cy="33" r="3" fill="#34D399" />
          </g>
        )}

        {currentArchetype === 'explorer' && (
          <g id="hair-explorer">
            {/* 자유로운 브라운 모험가 헤어 */}
            <path
              d="M33 48 C32 30 44 17 60 17 C76 17 88 30 87 48 C85 42 80 38 75 37 C69 41 64 35 58 37 C51 37 45 41 41 37 C37 40 34 43 33 48 Z"
              fill="#78350F"
            />
            {/* 탐험가 페도라 모자 */}
            <ellipse cx="60" cy="22" rx="28" ry="7" fill="#D97706" />
            <path d="M42 22 C42 12 78 12 78 22 Z" fill="#B45309" />
            <rect x="42" y="19" width="36" height="3" fill="#78350F" />
          </g>
        )}

        {/* 깜찍한 반짝이 효과 (Sparkle Star) */}
        <g id="sparkles" opacity="0.85">
          <path d="M96 26 L98 21 L100 26 L105 28 L100 30 L98 35 L96 30 L91 28 Z" fill="#FBBF24" />
          <path d="M20 70 L21.5 66 L23 70 L27 71.5 L23 73 L21.5 77 L20 73 L16 71.5 Z" fill="#38BDF8" />
        </g>
      </svg>
    </div>
  );
};
