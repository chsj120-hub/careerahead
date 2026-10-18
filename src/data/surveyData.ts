// src/data/surveyData.ts
import { CharacterProfile, SurveyState8 } from '../types/career';
import { JOBS_DATABASE } from './jobsData';

export interface QuestionOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tag: string;
  tooltip?: string; // 학생들을 위한 알기 쉬운 예시 툴팁
}

export interface SurveyStepConfig {
  step: number;
  category: '흥미' | '적성' | '능력' | '공간' | '가치' | '기술' | '리스크' | '칭호';
  title: string;
  subtitle: string;
  isMultiSelect: boolean;
  maxSelect?: number;
  isCustomInputAllowed?: boolean; // Q8 직접 입력 지원
  customPlaceholder?: string;
  options: QuestionOption[];
}

export const SURVEY_STEPS: SurveyStepConfig[] = [
  // 1단계: 흥미 (학교 과목 및 친숙한 활동 기반 표준화)
  {
    step: 1,
    category: '흥미',
    title: 'Q1. 학교나 일상에서 어떤 분야가 가장 재미있고 관심 가나요?',
    subtitle: '관심 가거나 가슴 뛰는 분야를 최대 2개 골라보세요. (아이콘에 마우스를 올리면 예시가 나와요!)',
    isMultiSelect: true,
    maxSelect: 2,
    options: [
      { 
        id: 'tech_code', 
        title: '디지털·컴퓨터·코딩', 
        subtitle: '스마트폰 앱, 게임 개발, 인공지능, 컴퓨터 다루기', 
        icon: '💻', 
        tag: '정보·컴퓨터',
        tooltip: '예: 로블록스 게임 만들기, 파이썬 코딩, 컴퓨터 조립, 최신 전자기기 탐구'
      },
      { 
        id: 'media_art', 
        title: '미술·디자인·영상 미디어', 
        subtitle: '웹툰, 유튜브 영상, 음악 작곡, 패션, 캐릭터 그리기', 
        icon: '🎨', 
        tag: '예술·미디어',
        tooltip: '예: 아이패드로 이모티콘 그리기, 숏폼 영상 편집, 음악 플레이리스트 만들기'
      },
      { 
        id: 'science_nature', 
        title: '수학·과학·실험·우주', 
        subtitle: '알쏭달쏭한 수학 퀴즈, 신기한 화학 실험, 동물과 우주', 
        icon: '🔬', 
        tag: '수학·과학',
        tooltip: '예: 과학관 체험, 화학 반응 실험, 동물 생태 관찰, 우주 다큐멘터리 시청'
      },
      { 
        id: 'writing_lang', 
        title: '국어·문학·외국어', 
        subtitle: '상상력 넘치는 글쓰기, 책 읽기, 유창한 외국어 대화', 
        icon: '📖', 
        tag: '국어·외국어',
        tooltip: '예: 웹소설 읽고 쓰기, 영어 팝송 따라 부르기, 독서 토론'
      },
      { 
        id: 'people_society', 
        title: '사회·역사·사람·정의', 
        subtitle: '친구들 고민 상담, 역사 속 인물 탐구, 사회 문제 해결', 
        icon: '🤝', 
        tag: '사회·도덕',
        tooltip: '예: 모의법정, 학급 반장 활동, 봉사활동, 시사 토론'
      },
      { 
        id: 'physical_making', 
        title: '체육·요리·만들기', 
        subtitle: '땀 흘리는 운동, 맛있는 음식 요리, 손으로 뚝딱뚝딱 조립', 
        icon: '🍳', 
        tag: '체육·실과',
        tooltip: '예: 축구·농구 경기, 주말 홈베이킹, 레고 조립, 자전거 타기'
      },
    ]
  },
  // 2단계: 적성 (Aptitude)
  {
    step: 2,
    category: '적성',
    title: 'Q2. 시간 가는 줄 모르고 푹 빠져드는 나의 행동 방식은?',
    subtitle: '내가 문제를 해결할 때 가장 자연스럽게 나오는 스타일을 골라보세요.',
    isMultiSelect: false,
    options: [
      { 
        id: 'deep_logic', 
        title: '조용히 혼자 파고들어 끝까지 원인 찾기', 
        subtitle: '수수께끼나 어려운 문제의 답을 찾을 때까지 파고드는 탐구형', 
        icon: '🔍', 
        tag: '탐구왕',
        tooltip: '혼자 차분하게 책이나 인터넷을 검색해서 끝까지 궁금증을 풀어내는 사람'
      },
      { 
        id: 'creative_expression', 
        title: '머릿속 기발한 생각을 글/그림으로 표현하기', 
        subtitle: '세상에 없던 새로운 세계관이나 독특한 작품을 만드는 창작형', 
        icon: '✨', 
        tag: '아이디어 뱅크',
        tooltip: '남들과 똑같은 건 싫어! 나만의 독창적인 방식으로 표현하는 사람'
      },
      { 
        id: 'social_empathy', 
        title: '친구들과 어울려 대화하고 분위기 띄우기', 
        subtitle: '남의 기분을 금방 알아채고 다 함께 화합을 이끄는 소통형', 
        icon: '💖', 
        tag: '분위기 메이커',
        tooltip: '친구들의 이야기를 잘 들어주고 팀 프로젝트에서 갈등을 해결해주는 사람'
      },
      { 
        id: 'hands_on_execution', 
        title: '말보다 행동! 일단 몸으로 부딪쳐서 해보기', 
        subtitle: '생각만 오래 하기보다 직접 손으로 만들고 실천하는 돌격형', 
        icon: '🏃‍♂️', 
        tag: '실천 돌격대장',
        tooltip: '계획만 짜는 건 지루해! 일단 바로 시작해서 눈앞의 결과물을 보는 사람'
      },
    ]
  },
  // 3단계: 능력/슈퍼파워 (Ability)
  {
    step: 3,
    category: '능력',
    title: 'Q3. 친구들이나 선생님이 나에게 감탄하는 슈퍼파워는?',
    subtitle: '내가 가장 자신 있는 역량을 최대 2개 골라보세요.',
    isMultiSelect: true,
    maxSelect: 2,
    options: [
      { id: 'math_data', title: '계산 & 논리 추론력', subtitle: '숫자에 밝고 복잡한 규칙이나 통계를 빠르게 이해함', icon: '📊', tag: '수리력 99' },
      { id: 'art_aesthetic', title: '미적 센스 & 스토리텔링', subtitle: '사람들의 눈길을 사로잡는 감각과 몰입시키는 이야기 능력', icon: '🎭', tag: '감각력 99' },
      { id: 'persuasion_lead', title: '친화력 & 말솜씨', subtitle: '처음 만난 사람과도 금방 친해지고 내 생각에 공감하게 만듦', icon: '🤝', tag: '친화력 99' },
      { id: 'iron_grit', title: '포기 없는 끈기 & 체력', subtitle: '한번 마음먹으면 끝까지 버텨내고 완성해내는 뚝심', icon: '🛡️', tag: '끈기력 99' },
      { id: 'tech_fluency', title: '기계·도구 초고속 적응력', subtitle: '새로운 기기나 앱 사용법을 설명서 없이도 척척 알아냄', icon: '⚡', tag: '도구센스 99' },
    ]
  },
  // 4단계: 희망 작업 공간 (Work Environment)
  {
    step: 4,
    category: '공간',
    title: 'Q4. 어른이 되었을 때, 내가 일하고 싶은 이상적인 공간은?',
    subtitle: '내가 가장 행복하고 능률이 쑥쑥 오를 것 같은 일터를 골라보세요.',
    isMultiSelect: false,
    options: [
      { id: 'remote_home', title: '🏠 내 방 책상이나 카페 (100% 자율 재택)', subtitle: '출퇴근 복잡함 없이 내 스케줄대로 자유롭게 일하는 프리랜서 공간', icon: '💻', tag: '자율 재택' },
      { id: 'modern_office', title: '🏢 세련된 테크 밸리 & 고층 빌딩 오피스', subtitle: '동료들과 팀워크를 맞추며 멋진 사옥과 복지를 누리는 도심 회사', icon: '🏙️', tag: '도심 기업' },
      { id: 'giant_plant', title: '🏭 거대한 배, 에너지 발전소, 드넓은 야외 현장', subtitle: '웅장한 스케일의 대형 산업 현장에서 가슴 뛰는 보람을 느끼는 필드', icon: '⚓', tag: '거대 현장' },
      { id: 'local_store', title: '🏪 내 손으로 아기자기하게 꾸민 동네 나만의 가게', subtitle: '손님들과 반갑게 눈인사하며 내 가게의 주인이 되는 골목 매장', icon: '☕', tag: '나만의 가게' },
    ]
  },
  // 5단계: 가치관 & 라이프스타일 (Value/Wish)
  {
    step: 5,
    category: '가치',
    title: 'Q5. 내가 생각하는 가장 멋진 성공의 기준은?',
    subtitle: '직업을 가질 때 절대 포기할 수 없는 1순위 가치를 골라보세요.',
    isMultiSelect: false,
    options: [
      { id: 'wealth_growth', title: '💰 내 실력만큼 억대 연봉으로 부자 되기', subtitle: '성과급 팍팍 받고 경제적 자유를 누리는 부자가 되고 싶어요!', icon: '💵', tag: '억대 연봉' },
      { id: 'worklife_peace', title: '⚖️ 정시 칼퇴근하고 주말 여가를 즐기는 워라밸', subtitle: '일은 적당히 열심히 하고, 내 취미와 꿀 같은 휴식이 제일 소중해요!', icon: '🏖️', tag: '워라밸 평화' },
      { id: 'public_honor', title: '🏛️ 정의를 지키고 사람들에게 존경받는 명예', subtitle: '사회에 좋은 영향을 미치고 떳떳한 자부심을 느끼고 싶어요!', icon: '🎖️', tag: '사회 정의' },
      { id: 'mastery_craft', title: '🌟 한 분야의 대체 불가능한 최고 장인 되기', subtitle: '남들이 쉽게 흉내 낼 수 없는 나만의 독보적인 기술로 인정받을래요!', icon: '👑', tag: '독보적 장인' },
    ]
  },
  // 6단계: 기계·도구·기술을 대하는 나의 태도 (범용적 기술 친화도)
  {
    step: 6,
    category: '기술',
    title: 'Q6. 최신 기계나 디지털 도구를 다룰 때 나의 스타일은?',
    subtitle: '기술을 대하는 나의 편안한 자세를 골라보세요.',
    isMultiSelect: false,
    options: [
      { 
        id: 'early_adopter', 
        title: '⚡ 새로운 기기나 앱이 나오면 남보다 먼저 써보는 얼리어답터!', 
        subtitle: '새로운 전자기기, 최신 소프트웨어, 신기한 도구를 만져보는 게 너무 재미있어요.', 
        icon: '🚀', 
        tag: '얼리어답터' 
      },
      { 
        id: 'human_centered', 
        title: '🤝 기계 화면보다는 사람과 직접 만나 이야기 나누는 인간 친화파!', 
        subtitle: '도구는 도구일 뿐! 사람의 마음을 어루만지고 눈을 마주치는 소통이 훨씬 중요해요.', 
        icon: '💖', 
        tag: '사람 중심' 
      },
      { 
        id: 'physical_maker', 
        title: '🛠️ 가상 세계보다 진짜 손으로 만지고 몸으로 움직이는 실전 행동파!', 
        subtitle: '모니터만 쳐다보는 건 답답해요. 직접 물건을 만들거나 현장에서 뛰는 게 진짜예요.', 
        icon: '🧱', 
        tag: '손맛 실전' 
      },
    ]
  },
  // 7단계: 리스크 감수 성향 (유머러스하고 친숙한 말투)
  {
    step: 7,
    category: '리스크',
    title: 'Q7. 돈과 직업에 대한 나의 모험 성향은?',
    subtitle: '실패의 위험과 보상에 대해 솔직한 내 마음을 골라보세요.',
    isMultiSelect: false,
    options: [
      { 
        id: 'all_in_boom', 
        title: '🔥 "인생은 한방이지! 100억 벌거나 쫄딱 망하거나 난 끝까지 간다!"', 
        subtitle: '실패가 두렵지 않아요. 크게 성공해서 대박을 터뜨리는 도전이 제일 짜릿해요! (대박 모험형)', 
        icon: '🎰', 
        tag: '인생은 한방' 
      },
      { 
        id: 'safety_first', 
        title: '🛡️ "안전제일! 망하면 큰일 나요. 작아도 매달 꼬박꼬박 나오는 안전빵이 최고!"', 
        subtitle: '절대 무리하지 않아요. 안정적인 월급과 정년이 확실하게 보장되는 평화가 좋아요! (철밥통 안정형)', 
        icon: '🏰', 
        tag: '안전제일' 
      },
      { 
        id: 'license_shield', 
        title: '📜 "평생 굶어 죽지 않는 나만의 전문 면허증 하나 딱 따놓을래!"', 
        subtitle: '시험이 조금 어렵더라도, 국가 자격증 하나 있으면 어디서든 독립적으로 살 수 있어요! (면허 방패형)', 
        icon: '🛡️', 
        tag: '면허 방패' 
      },
    ]
  },
  // 8단계: 10년 뒤 캐릭터 칭호 (예시 선택 + 직접 입력 지원!)
  {
    step: 8,
    category: '칭호',
    title: 'Q8. [최종 각성] 내 캐릭터 카드에 달고 싶은 멋진 칭호는?',
    subtitle: '마음에 드는 추천 칭호를 콕 누르거나, 아래 입력창에 내가 원하는 칭호를 직접 적어보세요!',
    isMultiSelect: false,
    isCustomInputAllowed: true,
    customPlaceholder: '내가 원하는 나만의 칭호 직접 쓰기 (예: 방구석 코딩 괴물, 우주를 구할 과학자 등)',
    options: [
      { id: 'title_future_tech', title: '🚀 [Lv.99] 미래를 개척하는 첨단 테크 혁신가', subtitle: '양자, AI, 우주를 연구하며 세상을 바꿀 미래 기술의 마스터', icon: '🪐', tag: '테크 혁신' },
      { id: 'title_master_creator', title: '✨ [Lv.99] 수많은 팬을 사로잡는 마스터 크리에이터', subtitle: '스토리, 음악, 그림, 영상으로 사람들의 심장을 울리는 천재 창작자', icon: '🎭', tag: '창작 예술' },
      { id: 'title_billionaire', title: '💰 [Lv.99] 100억 신화를 쓰는 젊은 백만장자', subtitle: '남다른 사업 감각과 투자로 경제적 자유를 조기에 이뤄낸 부자', icon: '💵', tag: '영앤리치' },
      { id: 'title_supreme_specialist', title: '👑 [Lv.99] 타의 추종을 불허하는 절대 권위자', subtitle: '의학, 법률, 특허, 금융에서 사람과 사회를 이끄는 최고 전문직', icon: '🏛️', tag: '절대 권위' },
      { id: 'title_industry_titan', title: '⚓ [Lv.99] 대양과 국가 경제를 지탱하는 거인', subtitle: '거대한 배와 플랜트, 에너지를 호령하는 든든한 산업의 기둥', icon: '🔱', tag: '산업 거인' },
      { id: 'title_cozy_master', title: '☕ [Lv.99] 사람들에게 쉼을 선물하는 힐링 마스터', subtitle: '나만의 공간과 따뜻한 온기로 단골들에게 행복을 선물하는 장인', icon: '🍰', tag: '동네 힐러' },
    ]
  }
];

// =========================================================================
// 8단계 정밀 스윗스팟 매칭 알고리즘
// =========================================================================
export function generateCharacterProfile8(answers: SurveyState8): CharacterProfile {
  // 성향 코드 생성
  const q1Code = answers.q1_interests[0] ? answers.q1_interests[0].slice(0, 1).toUpperCase() : 'T';
  const q2Code = answers.q2_aptitude ? answers.q2_aptitude.slice(0, 1).toUpperCase() : 'L';
  const q4Code = answers.q4_workEnv ? answers.q4_workEnv.slice(0, 1).toUpperCase() : 'O';
  const code = `[${q2Code}-${q1Code}-${q4Code}]`;

  // 대표 칭호 및 아바타 결정 (학생 직접 입력 칭호 최우선 반영!)
  let title = '미래를 여는 지혜로운 탐험가';
  let avatar = '🧙‍♂️';
  let description = '다양한 역량을 균형 있게 갖추고 자신만의 길을 개척하는 잠재력 가득한 탐험가입니다.';
  let highlightStats = '창의력 95 / 논리력 94';

  // 사용자가 칭호를 직접 입력했거나 선택한 경우
  if (answers.q8_dreamTitle && answers.q8_dreamTitle.trim()) {
    const raw = answers.q8_dreamTitle.trim();
    // 프리셋 칭호 매핑
    if (raw === 'title_future_tech') {
      title = '미래를 개척하는 첨단 테크 혁신가';
      avatar = '🧑‍💻';
      description = '수학과 양자, AI의 첨단 경계를 허물며 미래 문명을 설계하는 영리한 두뇌입니다.';
      highlightStats = '논리력 99 / 테크 센스 100';
    } else if (raw === 'title_master_creator') {
      title = '수많은 팬을 사로잡는 마스터 크리에이터';
      avatar = '✨';
      description = '스토리와 음악, 비주얼로 전 세계 사람들의 마음을 움직이는 독창적 창작자입니다.';
      highlightStats = '창의력 99 / 감각 센스 96';
    } else if (raw === 'title_billionaire') {
      title = '100억 신화를 쓰는 젊은 백만장자';
      avatar = '💰';
      description = '기회를 포착하는 동물적인 비즈니스 감각으로 경제적 자유를 거머쥐는 승부사입니다.';
      highlightStats = '추진력 99 / 리스크 감수 98';
    } else if (raw === 'title_supreme_specialist') {
      title = '타의 추종을 불허하는 절대 권위자';
      avatar = '👑';
      description = '법과 의학, 특허와 금융에서 정밀한 판단으로 사람과 사회를 이끄는 최고 전문직입니다.';
      highlightStats = '논리력 98 / 전문성 100';
    } else if (raw === 'title_industry_titan') {
      title = '대양과 국가 경제를 지탱하는 산업의 거인';
      avatar = '⚓';
      description = '에너지, 플랜트, 거대한 항만과 제조업 현장을 호령하는 강인한 리더입니다.';
      highlightStats = '끈기력 100 / 실행력 98';
    } else if (raw === 'title_cozy_master') {
      title = '사람들에게 쉼을 선물하는 힐링 마스터';
      avatar = '☕';
      description = '나만의 따뜻한 공간과 섬세한 손길로 사람들에게 위로와 미소를 전하는 연출가입니다.';
      highlightStats = '공감력 98 / 손맛 센스 96';
    } else {
      // 학생이 직접 키보드로 입력한 나만의 맞춤 칭호!
      title = raw.startsWith('[') ? raw : `[Lv.99] ${raw}`;
      avatar = '🌟';
      description = `스스로 정한 멋진 꿈 "${raw}"을(를) 향해 거침없이 전진하는 당찬 주인공입니다!`;
      highlightStats = '자율성 100 / 잠재력 99';
    }
  }

  // 100개 직업 대상 정밀 다차원 스코어링 (4~8개 스윗스팟 도출)
  const scoredJobs = JOBS_DATABASE.map(job => {
    let score = 0;

    // 1. Q1 흥미 매칭 (가중치 40점)
    if (answers.q1_interests.includes('tech_code') && (job.category === 'science_math' || job.tags.includes('tech') || job.tags.includes('coding') || job.tags.includes('ai'))) score += 35;
    if (answers.q1_interests.includes('media_art') && (job.category === 'popular' || job.category === 'freelancer' || job.tags.includes('art') || job.tags.includes('creative') || job.tags.includes('media'))) score += 35;
    if (answers.q1_interests.includes('science_nature') && (job.category === 'science_math' || job.tags.includes('science') || job.tags.includes('math') || job.tags.includes('physics') || job.tags.includes('chemistry') || job.tags.includes('medicine'))) score += 40;
    if (answers.q1_interests.includes('writing_lang') && (job.tags.includes('writing') || job.tags.includes('language') || job.id === 'web-novelist' || job.id === 'specialized-translator')) score += 40;
    if (answers.q1_interests.includes('people_society') && (job.tags.includes('people') || job.tags.includes('law') || job.tags.includes('public') || job.tags.includes('education') || job.tags.includes('welfare'))) score += 35;
    if (answers.q1_interests.includes('physical_making') && (job.tags.includes('food') || job.tags.includes('sports') || job.tags.includes('physical') || job.category === 'local_biz')) score += 35;

    // 2. Q2 적성 매칭 (가중치 25점)
    if (answers.q2_aptitude === 'deep_logic' && job.stats.logic >= 92) score += 25;
    if (answers.q2_aptitude === 'creative_expression' && job.stats.creativity >= 90) score += 25;
    if (answers.q2_aptitude === 'social_empathy' && job.stats.communication >= 90) score += 25;
    if (answers.q2_aptitude === 'hands_on_execution' && (job.stats.grit >= 92 || job.tags.includes('physical') || job.tags.includes('grit'))) score += 25;

    // 3. Q3 슈퍼파워 능력 매칭 (가중치 25점)
    if (answers.q3_strengths.includes('math_data') && (job.stats.logic >= 95 || job.tags.includes('math'))) score += 25;
    if (answers.q3_strengths.includes('art_aesthetic') && (job.stats.creativity >= 94 || job.tags.includes('art'))) score += 25;
    if (answers.q3_strengths.includes('persuasion_lead') && (job.stats.communication >= 94 || job.tags.includes('leadership') || job.tags.includes('people'))) score += 25;
    if (answers.q3_strengths.includes('iron_grit') && (job.stats.grit >= 95 || job.tags.includes('grit'))) score += 25;
    if (answers.q3_strengths.includes('tech_fluency') && (job.stats.tech >= 92 || job.tags.includes('tech'))) score += 25;

    // 4. Q4 작업 공간 매칭 (가중치 30점)
    if (answers.q4_workEnv === 'remote_home' && (job.category === 'freelancer' || job.locationReality.type === 'remote')) score += 35;
    if (answers.q4_workEnv === 'modern_office' && (job.category === 'office' || (job.category === 'high_prestige' && job.locationReality.type === 'capital'))) score += 30;
    if (answers.q4_workEnv === 'giant_plant' && (job.category === 'local_industry' || job.tags.includes('ocean') || job.tags.includes('aviation'))) score += 35;
    if (answers.q4_workEnv === 'local_store' && job.category === 'local_biz') score += 35;

    // 5. Q5 가치관 매칭 (가중치 25점)
    if (answers.q5_lifestyle === 'wealth_growth' && job.moneyTruth.tenYearSalary >= 10000) score += 30;
    if (answers.q5_lifestyle === 'worklife_peace' && (job.tags.includes('work_life') || job.category === 'part_time')) score += 25;
    if (answers.q5_lifestyle === 'public_honor' && (job.tags.includes('public') || job.tags.includes('law') || job.tags.includes('education'))) score += 30;
    if (answers.q5_lifestyle === 'mastery_craft' && (job.category === 'high_prestige' || job.category === 'science_math' || job.tags.includes('specialist'))) score += 25;

    // 6. Q6 기술 스타일 매칭 (가중치 20점)
    if (answers.q6_techAttitude === 'early_adopter' && (job.stats.tech >= 92 || job.aiTrafficLight.status === 'partner')) score += 20;
    if (answers.q6_techAttitude === 'human_centered' && (job.stats.communication >= 90 || job.tags.includes('people'))) score += 20;
    if (answers.q6_techAttitude === 'physical_maker' && (job.tags.includes('physical') || job.tags.includes('grit') || job.category === 'local_biz')) score += 20;

    // 7. Q7 리스크 성향 (가중치 20점)
    if (answers.q7_riskTolerance === 'all_in_boom' && (job.tags.includes('high_growth') || job.category === 'freelancer' || job.category === 'popular')) score += 25;
    if (answers.q7_riskTolerance === 'safety_first' && (job.tags.includes('public') || job.tags.includes('corporate') || job.category === 'office')) score += 25;
    if (answers.q7_riskTolerance === 'license_shield' && (job.prepPeriod.licenseOrDegree.includes('자격증') || job.prepPeriod.licenseOrDegree.includes('면허'))) score += 25;

    return { job, score };
  });

  // 정렬 후 상위 6개(4~8개 범위 내 최적 6선) 도출
  scoredJobs.sort((a, b) => b.score - a.score);
  const recommendedJobs = scoredJobs.slice(0, 6).map(item => item.job);

  return {
    code,
    title,
    avatar,
    description,
    level: 1,
    highlightStats,
    recommendedJobs
  };
}
