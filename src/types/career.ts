// src/types/career.ts

export type CategoryType = 
  | 'high_prestige'   // 💎 고선망 & 전문직
  | 'local_industry'  // 🏭 지방 거점 고연봉 특화
  | 'science_math'    // 🔬 과학·수학 유망 테크
  | 'popular'         // 🏆 학생 인기 희망직
  | 'office'          // 🏢 평범하지만 든든한 회사원
  | 'local_biz'       // 🏪 우리 동네 최다 생활 자영업
  | 'freelancer'      // 🏠 집에서 일하는 디지털 프리랜서
  | 'part_time'       // ⏱️ 청소년 & 대학생 첫걸음 알바
  | 'future';         // 🚀 미래에 뜨는 융합 직업

export type FutureSafetyStatus = 'very_safe' | 'adaptive' | 'caution'; // 🟢 미래 초유망·안전 | 🟡 변화 적응 필요 | 🔴 주의·수요 감소 위험

export interface Job {
  id: string;
  title: string;
  category: CategoryType;
  categoryName: string;
  icon: string;
  badge: string;
  summary: string;
  tags: string[];
  // RPG 5대 스탯 (1~100)
  stats: {
    creativity: number;     // 창의력
    logic: number;          // 논리수리력
    communication: number;  // 대인소통력
    grit: number;           // 끈기실행력
    tech: number;           // 첨단테크센스
  };
  // 5대 현실 Q&A 템플릿
  moneyTruth: {
    entrySalary: number;        // 만원 (초임 연봉 또는 초기 순익)
    tenYearSalary: number;      // 만원 (10년차 연봉 또는 안정기 순익)
    top10PercentSalary?: number;// 만원 (상위 10% 베테랑/탑티어 평균 연봉)
    top10Desc?: string;         // 상위 10% 도달 비결 및 직업적 고점 안내
    peakBonus: string;          // 성과급/최대 수입폭
    risk: string;               // 현실적인 리스크 & 고충
  };
  prepPeriod: {
    minAge: number;
    yearsRequired: number;
    stepBadge: string;       // 준비 걸음 수 뱃지
    licenseOrDegree: string; // 필수 자격증 및 학위
    workforceCount?: number; // 한국 종사자 수 (추정치, 명)
    workforceRatio?: number; // 전체 취업자 대비 비율 (%)
  };
  locationReality: {
    type: 'capital' | 'nationwide' | 'local' | 'remote';
    typeName: string;
    desc: string;
    capitalRatio: number; // 수도권 비중 % (재택은 0~100 자유)
  };
  // 기존 AI 뱃지를 미래 유망도 및 안전도(저출산/고령화, AI, 기후변화 3대 메가트렌드)로 통합/고도화
  aiTrafficLight: {
    status: 'partner' | 'cooperation' | 'caution'; // 하위 호환
    statusText: string;    // 예: "🟢 초유망·안전", "🟡 보통·적응필요", "🔴 주의·감소위험"
    reason: string;        // 핵심 진단 요약
  };
  // 3대 미래 메가트렌드 정밀 진단
  futureOutlook?: {
    safetyLevel: FutureSafetyStatus;
    safetyScore: number;   // 1~100점
    demographicImpact: string; // 저출산 & 고령화 영향 (학령인구 감소 vs 시니어 수요 등)
    aiAutomationImpact: string; // AI 및 무인화 영향 (협동 도구 vs 대체 위험)
    climateEnergyImpact: string; // 기후변화 & 탄소중립 영향 (친환경 규제 vs 재생에너지 기회)
  };
  actionPlanForYouth: {
    studyTip: string;        // 추천 교과 공부
    clubActivity: string;    // 추천 동아리
    freeTool: string;        // 지금 해볼 수 있는 무료 툴/체험
  };
  careerNetCode?: string;
}

export interface CharacterProfile {
  code: string;           // 예: [L-T-R]
  title: string;          // 예: 초정밀 알고리즘 개척자 (또는 학생 직접 입력 칭호)
  avatar: string;         // 이모지
  description: string;
  level: number;
  highlightStats: string;
  recommendedJobs: Job[]; // 4~8개 엄선
}

// 8단계 세분화 설문 상태 인터페이스
export interface SurveyState8 {
  q1_interests: string[];       // Q1: 교과목/친숙한 흥미 분야 (최대 2개)
  q2_aptitude: string;          // Q2: 몰입하는 행동 방식 (단일)
  q3_strengths: string[];       // Q3: 슈퍼파워 강점 (최대 2개)
  q4_workEnv: string;           // Q4: 이상적인 일하는 공간/방식 (단일)
  q5_lifestyle: string;         // Q5: 소득과 라이프스타일 가치 (단일)
  q6_techAttitude: string;      // Q6: 기계·도구·기술을 다루는 나의 스타일 (단일)
  q7_riskTolerance: string;     // Q7: 리스크 vs 안정성 성향 (단일 - 유머러스한 어조)
  q8_dreamTitle: string;        // Q8: 내가 고르거나 직접 입력한 내 캐릭터의 칭호
}

export interface UnregisteredJobRequest {
  id: string;
  jobName: string;
  reason: string;
  email?: string;
  createdAt: string;
}
