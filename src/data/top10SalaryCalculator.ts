// src/data/top10SalaryCalculator.ts
import { Job } from '../types/career';

export interface Top10SalaryInfo {
  salary: number; // 만원 (상위 10% 평균 연봉)
  ratioVsEntry: string; // 시작 초봉 대비 배율 (예: "2.8배")
  ratioVsTenYear: string; // 10년차 평균 대비 배율 (예: "1.4배")
  diffVsNationalAvg: number; // 2026 대한민국 근로자 상위 10% 기준선(약 1억 1,000만 원) 대비 차액
  levelBadge: string; // 예: "👑 최상위 마스터 클래스", "🌟 분야 최고 권위자", "🔥 실력파 억대 고수", "🚀 혁신 스타 플레이어"
  howToReach: string; // 상위 10%로 도약하는 현실적인 비결 & 성장 경로
  encouragement: string; // 학생들에게 전하는 직업적 편견 극복 및 응원 메시지
}

// 2026년 대한민국 전체 임금근로자 상위 10% 기준선 (연 약 1억 1,000만 원)
export const NATIONAL_TOP_10_SALARY_2026 = 11000;

// 직업 ID별 정밀 상위 10% 데이터 오버라이드 (공공 통계, 협회 공시, 실전 업계 데이터 기준)
const SPECIFIC_TOP_10_MAP: Record<string, { salary: number; howToReach: string; encouragement: string }> = {
  // 💎 1. 전문직 / 고선망
  'semiconductor-engineer': {
    salary: 22000,
    howToReach: '차세대 2나노 이하 공정 및 HBM 차세대 패키징 핵심 특허를 보유한 수석 엔지니어·펠로우(Fellow)로 승진 시 달성',
    encouragement: '초봉도 높지만 기술의 끝판왕이 되면 글로벌 빅테크에서도 수억 원대 연봉과 스톡옵션을 제시받습니다.'
  },
  'doctor': {
    salary: 45000,
    howToReach: '핵심 진료과 개원 성공, 중증 난치 질환 권위자 명의(名醫), 또는 대형 전문병원 네트워크 대표원장 도약 시 달성',
    encouragement: '치열한 수련 과정을 묵묵히 버텨내면 사람의 생명을 구하는 숭고함과 함께 독보적인 경제적 결실이 따릅니다.'
  },
  'pilot-harbor': {
    salary: 42000,
    howToReach: '부산항, 인천항, 여수광양항 등 컨테이너 및 초대형 위험물 선박 물동량이 전국 최고인 1급 무역항 수석 도선사',
    encouragement: '바다의 거친 파도를 극복하고 20년의 뱃길 경험을 쌓으면 대한민국 전체 직업 중 최정점의 소득을 누립니다.'
  },
  'judge': {
    salary: 17500,
    howToReach: '부장판사, 법원장, 고등법원 판사로 재직하며 호봉 상한에 도달하거나 퇴임 후 대형 로펌 대표변호사 영입 시',
    encouragement: '법관 재직 중에는 사회적 신뢰와 헌법적 명예가 가장 큰 보람이며, 퇴임 후에도 사회 최고의 대우를 받습니다.'
  },
  'patent-attorney': {
    salary: 32000,
    howToReach: '글로벌 AI·바이오 특허 국제 분쟁을 승리로 이끄는 대형 특허법인 대표 파트너 및 성공보수 수취 시',
    encouragement: '이과 공학 지식과 법률 지식을 융합한 드문 무기를 지닌 만큼, 전 세계 기업들이 최고의 자문료를 지불합니다.'
  },
  'lawyer': {
    salary: 35000,
    howToReach: '김앤장, 광장, 태평양 등 6대 대형 로펌 지분 파트너 변호사 또는 M&A·기업 금융 전문 부티크 대표',
    encouragement: '변호사 시장이 치열해져도 자신만의 특화 전문 분야(의료, IT, 조세, 형사)를 선점하면 고점은 무한히 열려 있습니다.'
  },
  'cpa-accountant': {
    salary: 28000,
    howToReach: '빅4 회계법인 시니어 파트너로 대기업 외부감사 총괄 및 수백억 단위 M&A 기업인수 실사 자문 총괄',
    encouragement: '숫자를 꿰뚫어 보는 눈과 기업의 신뢰를 얻으면 단순 세무 대리를 넘어 기업의 가장 든든한 최고 재무 책사가 됩니다.'
  },
  'fund-manager': {
    salary: 40000,
    howToReach: '사모펀드(PE) 또는 헤지펀드 대표 매니저로서 시장 수익률을 압도하는 초과 수익 달성 후 수억~수십억 성과급 수령',
    encouragement: '철저한 데이터 분석과 강철 같은 멘탈로 자본을 굴리면 나이와 상관없이 실력만으로 천문학적 보상을 쟁취합니다.'
  },
  'university-professor': {
    salary: 19000,
    howToReach: '국가 대형 국가 전략 R&D 연구과제 단장, 산학협력 기술 이전 로열티 수취 및 기업 사외이사 겸직',
    encouragement: '진리를 깊이 탐구하는 학자의 길이지만, 세상을 바꾸는 혁신 기술을 개발하면 거액의 기술 이전 수익까지 누릴 수 있습니다.'
  },
  'corporate-ceo': {
    salary: 150000,
    howToReach: '시가총액 수조 원대 대기업/중견기업 대표이사로서 글로벌 실적 갱신 및 주주가치 제고에 따른 성과급·스톡옵션 행사',
    encouragement: '조직을 이끄는 리더십과 대담한 결단력으로 기업을 번영으로 이끌면 대한민국 상위 0.01%의 영광과 결실을 거둡니다.'
  },

  // ⏱️ 2. 아르바이트 & 현장직의 잠재력 (편견 깨기)
  'cafe-barista-pt': {
    salary: 5800,
    howToReach: '매장 총괄 수석 매니저(점장) 승진, 원두 로스팅 스페셜티 랩 수석 바리스타 또는 바리스타 대회 입상 후 브랜드 앰버서더',
    encouragement: '알바로 시작했더라도 커피 맛의 본질과 매장 운영(손익·인사)을 깊이 체득하면 연 6천만 원 이상의 전문 총괄 디렉터로 우뚝 섭니다.'
  },
  'convenience-staff': {
    salary: 5200,
    howToReach: '직영점 매니저 거쳐 편의점 본사 영업관리(OFC/SV) 정규직 전환 및 다점포 우수 위탁경영 점주 도약',
    encouragement: '동네 편의점 알바 경험은 유통·물류와 소비 트렌드를 가장 가까이서 배우는 최고의 실전 MBA 교실입니다.'
  },
  'fastfood-crew': {
    salary: 5500,
    howToReach: '크루 ➡️ 트레이너 ➡️ 부점장 ➡️ 총괄 레스토랑 지점장(RGM) 또는 글로벌 본사 운영 컨설턴트 승진',
    encouragement: '글로벌 패스트푸드 본사 임원 중 상당수가 고교 시절 시급 알바 크루부터 출발한 입지전적 인물들입니다.'
  },
  'logistics-short-pt': {
    salary: 6200,
    howToReach: '물류 허브 센터 공정 관리자(Area Manager) 또는 지게차/자동화 WMS 시스템 총괄 오퍼레이터 정규직 발탁',
    encouragement: '단순 상하차로 끝나지 않고 물류 흐름의 데이터와 현장 동선을 장악하는 순간 고연봉 물류 관리자로 신분이 바뀝니다.'
  },
  'academy-tutor-pt': {
    salary: 12000,
    howToReach: '질의응답 조교에서 실력을 인정받아 학원 전임 강사로 데뷔, 대치동/인강 1타 강사로 도약',
    encouragement: '후배를 가르치는 아르바이트가 인생의 전환점이 되어 수만 명의 학생을 가르치는 스타 강사로 성장할 수 있습니다.'
  },
  'cinema-staff': {
    salary: 5000,
    howToReach: '멀티플렉스 사이트 총괄 매니저 또는 본사 배급·콘텐츠 마케팅 부서로 특별 정규직 채용',
    encouragement: '영화와 사람을 사랑하는 마음으로 시작한 작은 발걸음이 극장 전체를 지휘하는 전문 콘텐츠 경영인으로 연결됩니다.'
  },

  // 🏪 3. 동네 생활 자영업 (골목길의 영웅들)
  'cafe-owner': {
    salary: 14000,
    howToReach: '시그니처 디저트·원두로 인스타 핫플 등극 후 백화점 팝업 입점 및 3~5개 직영점 확장 프랜차이즈화',
    encouragement: '골목 카페라도 독창적인 맛과 감성 브랜딩이 더해지면 대기업 부장 연봉 부럽지 않은 순수익을 달성합니다.'
  },
  'bakery-chef': {
    salary: 15000,
    howToReach: '전국 빵지순례 필수 코스 등극, 성심당·런던베이글뮤지엄처럼 줄 서는 독점 시그니처 베이커리 브랜드 완성',
    encouragement: '새벽의 정직한 땀방울이 담긴 빵 하나가 수많은 사람을 행복하게 만들고 기업 수준의 고수익으로 보답받습니다.'
  },
  'chicken-owner': {
    salary: 13000,
    howToReach: '아파트 밀집 황금 상권 독점, 배달 플랫폼 랭킹 1위 유지 및 주변 2~3개 매장 다점포 복수 운영',
    encouragement: '국민 야식 치킨도 철저한 위생 관리와 속도전, 친절한 고객 관리 노하우가 쌓이면 억대 소득의 탄탄한 사업체가 됩니다.'
  },
  'hair-designer': {
    salary: 16000,
    howToReach: '청담/강남 탑티어 프리미엄 살롱 원장, 유명 연예인 전담 스타일리스트 및 개인 헤어 브랜드 론칭',
    encouragement: '가위 하나로 사람의 첫인상을 마법처럼 바꾸는 손기술은 AI 시대에도 절대 대체되지 않는 최고의 황금 자산입니다.'
  },
  'fitness-coach-owner': {
    salary: 15000,
    howToReach: '재활·체형교정 전문 최고 인기 트레이너, 회원권 완판 및 2~3호점 대형 피트니스 센터 확장',
    encouragement: '사람의 몸과 마음을 건강하게 변화시키는 보람과 함께, 실력과 신뢰가 쌓이면 엄청난 고수익을 창출합니다.'
  },
  'ecommerce-seller': {
    salary: 25000,
    howToReach: '자체 PB 브랜드 기획, 해외 소싱 독점 및 와디즈 펀딩·쿠팡 로켓그로스 대량 판매로 연 수십억 매출 달성',
    encouragement: '노트북 하나 들고 방구석에서 시작했더라도, 소비자의 숨은 필요를 읽어내면 글로벌 기업 부럽지 않은 사업가가 됩니다.'
  },

  // 🏠 4. 집에서 일하는 프리랜서 (디지털 노마드의 고점)
  'web-novelist': {
    salary: 30000,
    howToReach: '밀리언페이지(조회수 1,000만 회) 메가히트작 탄생, 웹툰화 및 글로벌 번역 수출, 드라마 영상화 판권 계약',
    encouragement: '오직 상상력과 키보드만으로 전 세계 독자들을 울고 웃기며, 히트작 하나로 평생의 경제적 자유를 얻기도 합니다.'
  },
  'music-composer-producer': {
    salary: 22000,
    howToReach: 'K-POP 아이돌 빌보드 차트 진입 타이틀곡 작곡, 넷플릭스 글로벌 드라마 메인 테마곡 저작권료 누적',
    encouragement: '방구석 작은 홈스튜디오에서 만든 멜로디가 전 세계 스타디움에 울려 퍼지며 끊이지 않는 음원 연금을 안겨줍니다.'
  },
  'webtoon-artist': {
    salary: 35000,
    howToReach: '네이버/카카오 목요·토요 최상위 랭킹 웹툰 작가, 굿즈·애니메이션화·단행본 수출 IP 잭팟',
    encouragement: '태블릿 펜 하나에 담긴 정성이 수백만 독자를 사로잡는 순간, 예술가이자 막강한 콘텐츠 기업의 주인공이 됩니다.'
  },
  'ai-prompt-engineer': {
    salary: 20000,
    howToReach: '글로벌 엔터프라이즈 AI 시스템 최적화 수석 아키텍트, 복합 멀티모달 프롬프트 파이프라인 독점 설계',
    encouragement: '새롭게 탄생한 미래 직업인 만큼, AI를 다루는 압도적 통찰력을 갖추면 전 세계가 먼저 고액 연봉으로 영입하려 합니다.'
  }
};

/**
 * 직업의 상위 10% 소득 정보 계산
 */
export function getTop10SalaryInfo(job: Job): Top10SalaryInfo {
  // 1. 커스텀 매핑이 있으면 최우선 사용
  const specific = SPECIFIC_TOP_10_MAP[job.id];
  
  let topSalary: number;
  let howToReach: string;
  let encouragement: string;

  if (specific) {
    topSalary = specific.salary;
    howToReach = specific.howToReach;
    encouragement = specific.encouragement;
  } else if (job.moneyTruth.top10PercentSalary) {
    topSalary = job.moneyTruth.top10PercentSalary;
    howToReach = job.moneyTruth.top10Desc || '남다른 전문성과 독창적인 실력으로 업계 상위 10%에 도달할 때 달성';
    encouragement = '직업의 평균 수치에 갇히지 않고 나만의 무기를 갈고닦으면 어떤 분야든 상상 이상의 높은 고점에 도달합니다.';
  } else {
    // 2. 카테고리 및 직업별 기본 고점 추정 공식 (평균 10년차 대비 1.5~2.2배)
    const tenYear = job.moneyTruth.tenYearSalary;
    const cat = job.category;

    let multiplier = 1.6;
    if (cat === 'freelancer' || cat === 'popular' || cat === 'local_biz') {
      multiplier = 2.0; // 성과와 인기에 따라 상방이 크게 열린 직종
    } else if (cat === 'part_time') {
      multiplier = 1.7; // 관리자/전문가 승급 시
    } else if (cat === 'high_prestige' || cat === 'science_math' || cat === 'future') {
      multiplier = 1.85; // 기술/면허 최고 권위자
    } else if (cat === 'local_industry') {
      multiplier = 1.55; // 기능장/현장 최고 기술명장
    } else {
      multiplier = 1.5; // 회사원 임원급 승진
    }

    topSalary = Math.round((tenYear * multiplier) / 100) * 100;

    howToReach = `${job.title} 분야에서 10년 이상 독보적 실력을 인정받아 핵심 관리자, 기술 명장, 또는 독자적인 독립 브랜드를 구축할 때 도달합니다.`;
    encouragement = `어떤 직업이든 시작점이 다를 뿐, 열정과 끈기로 상위 10%의 고수에 이르면 남들이 부러워하는 높은 소득과 존경을 동시에 얻을 수 있습니다.`;
  }

  // 배율 계산
  const ratioVsEntry = (topSalary / Math.max(1, job.moneyTruth.entrySalary)).toFixed(1);
  const ratioVsTenYear = (topSalary / Math.max(1, job.moneyTruth.tenYearSalary)).toFixed(1);
  const diffVsNationalAvg = topSalary - NATIONAL_TOP_10_SALARY_2026;

  // 등급 뱃지
  let levelBadge = '🔥 실력파 억대 고수';
  if (topSalary >= 30000) {
    levelBadge = '👑 대한민국 0.1% 최상위 마스터';
  } else if (topSalary >= 18000) {
    levelBadge = '💎 업계 최고 권위자 & 스타 플레이어';
  } else if (topSalary >= 10000) {
    levelBadge = '🌟 억대 연봉 핵심 리더';
  } else {
    levelBadge = '🚀 차별화된 실력파 스페셜리스트';
  }

  return {
    salary: topSalary,
    ratioVsEntry,
    ratioVsTenYear,
    diffVsNationalAvg,
    levelBadge,
    howToReach,
    encouragement
  };
}
