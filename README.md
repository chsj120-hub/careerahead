# 내일찾기 (CareerPath Finder) - 학생 맞춤형 진로 탐색 플랫폼 (V5)

> **초·중학생과 청소년을 위한 데이터 기반 RPG 게임형 현실 진로 탐색 웹 애플리케이션**  
> 딱딱하고 비현실적인 사전식 직업 정보를 탈피하여, 8단계 성향 퀘스트를 통해 나만의 미래 캐릭터를 찾고, 110개 직업의 진짜 현실(초임·10년차·상위 10% 연봉 및 도달 비결, 전국 종사자 수와 희소성, 3대 미래 메가트렌드 신호등, 서울 vs 지방 주거·생활비 격차 시뮬레이터)을 투명하게 안내합니다.

---

## 📌 1. 핵심 기능 및 컴포넌트 구조

```
src/
├── components/
│   ├── Header.tsx                 # 상단 헤더, 브랜드 로고(원클릭 초기화), QR 코드 및 탭 내비게이션
│   ├── SurveyStepModal.tsx        # 8단계 성향 퀘스트 모달 (임시저장 및 이어하기 지원)
│   ├── CharacterProfileCard.tsx   # RPG 캐릭터 스탯 카드 (Lv, 코드, 칭호, 6대 육각형 역량 차트, 2D Chibi 캐릭터)
│   ├── ChibiCharacter.tsx         # 7대 성향별 2D 2등신 Chibi 사람 캐릭터 고화질 SVG 벡터 일러스트
│   ├── JobCard.tsx                # 직업 도감 카드 (태그, 연봉, AI 신호등, 찜하기 버튼)
│   ├── JobDetailModal.tsx         # 5대 현실 Q&A 팩트시트 모달 (초봉/10년차/상위10%, 인구/AI/기후 신호등, 청소년 액션플랜)
│   ├── LivingCostSlider.tsx       # 서울 vs 지방 주거 & 체감 생활비 비교 시뮬레이터 (슬라이더 반응형)
│   ├── ShareableResultCard.tsx    # 모바일 1장 2열 모던 화이트 공유 카드 생성 및 이미지(PNG) 다운로드 (html-to-image)
│   ├── ExploreJobsView.tsx        # 110개 직업 검색 & 카테고리/정렬 필터링 도감
│   ├── UnregisteredJobModal.tsx   # 미등록 직업 조사 요청 피드백 루프 (LocalStorage 누적 및 서버리스 메일 전송)
│   └── QRCodeModal.tsx            # 교사용 수업 프로젝터용 학생 모바일 접속 QR 생성기
├── data/
│   ├── jobsData.ts                # 110개 엄선 직업 데이터베이스 (9개 카테고리)
│   ├── surveyData.ts              # 8단계 질문 정의 및 캐릭터 프로필/스탯 생성 알고리즘
│   ├── top10SalaryCalculator.ts   # 상위 10% 베테랑 연봉 및 도달 비결/응원 메시지 데이터
│   └── workforceStats.ts          # 전국 종사자 수, 취업자 대비 비율, 진입 난이도 게이지
├── types/
│   └── career.ts                  # 직업, 캐릭터, 설문 인터페이스 정의
└── utils/
    └── costCalculator.ts          # 세후 실수령액, 물가, 월세, 아파트 내 집 마련 소요 기간 계산식
```

---

## 🎮 2. 8단계 퀘스트(Survey) 및 캐릭터 매칭 로직

1. **Q1. 흥미 (교과목 연계)**: 코딩·테크 / 예술·미디어 / 과학·수학 / 국어·어학 / 사회·도덕 / 체육·실과
2. **Q2. 적성 (몰입 방식)**: 깊은 탐구형 / 창의 표현형 / 대인 소통형 / 손기술 실행형
3. **Q3. 슈퍼파워 (강점)**: 데이터 분석 / 심미 감각 / 설득 리더십 / 강철 끈기 / 얼리어답터
4. **Q4. 일터 (공간)**: 재택·원격 / 빌딩 오피스 / 거대 산업현장·바다 / 동네 매장
5. **Q5. 가치관 (소득&삶)**: 폭발적 부 / 워라밸 / 사회적 명예 / 장인 숙련
6. **Q6. 기술 태도**: AI/도구 최적화 / 사람 중심 감성 / 몸으로 체득
7. **Q7. 리스크 감수도**: 올인 승부 / 안정 최우선 / 전문 면허 보호
8. **Q8. 나만의 칭호**: 선택지 제공 + **학생 직접 키보드 입력 커스텀 칭호 지원**

> **결과 도출**:
> - 고유 코드 부여 (예: `[C-A-P]`, `[L-T-R]`)
> - 학생 응답 기반의 동적 5대 RPG 스탯(창의력, 논리력, 소통력, 끈기력, 첨단기술) 산출 (75~99점)
> - 110개 직업 중 최적 매칭 상위 6선 추천

---

## 💼 3. 110개 직업 9대 카테고리 구성 (학생 친화 정렬)

1. `part_time`: ⏱️ 청소년 & 대학생 첫걸음 알바
2. `local_biz`: 🏪 우리 동네 최다 생활 자영업
3. `office`: 🏢 평범하지만 든든한 회사원
4. `popular`: 🏆 학생 인기 희망직 (크리에이터, 파일럿, 프로게이머 등)
5. `freelancer`: 🏠 집에서 일하는 디지털 프리랜서
6. `high_prestige`: 💎 고선망 & 최고 연봉 전문직
7. `local_industry`: 🏭 지방 거점 고연봉 특화 (중공업, 정유화학, 원전 등)
8. `science_math`: 🔬 과학·수학 유망 테크 (AI, 반도체, 바이오, 우주항공 등)
9. `future`: 🚀 미래에 뜨는 융합 신직업

---

## 📊 4. 4대 정밀 데이터 엔진

1. **연봉 및 상위 10% 엔진 (`top10SalaryCalculator.ts`)**:
   - 초임 연봉, 10년차 연봉, 상위 10% 베테랑 연봉 비교
   - 상위 10% 도달 현실적 비결 및 진로 편견 극복 메시지
2. **종사자 수 & 진입 장벽 엔진 (`workforceStats.ts`)**:
   - 2026년 한국 총 취업자 2,850만 명 기준 희소성 비율 및 "N명 중 1명 꼴" 계산
   - 1~100점 진입 난이도 게이지 및 학생 눈높이 해설
3. **3대 메가트렌드 신호등 (`futureOutlook`)**:
   - 저출산 & 고령화 수혜/감소 진단
   - AI 및 무인화 대체율 vs 협동 생산성 진단
   - 기후변화 & 탄소중립 영향 진단
4. **체감 주거 & 생활비 시뮬레이터 (`costCalculator.ts`)**:
   - 서울 vs 지방 거점 연봉별 세후 실수령액, 주거비, 식비, 30평 아파트 마련 기간 비교

---

## 🛠️ 5. 개발 및 실행 지침

### 개발 환경 요건
- Node.js: v18 이상 (Node v20/v24 권장)
- 패키지 매니저: npm (Windows 환경에서는 `npm.cmd` 또는 CMD 세션 사용)

### 명령어
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (기본 포트 5173)
npm run dev

# 타입스크립트 검사 및 프로덕션 빌드
npm run build

# 코드 정적 분석 (Oxlint)
npm run lint

# 빌드 결과 미리보기
npm run preview
```

---

## 🚀 6. 이어서 작업 시 점검 & 확장 가이드

1. **신규 직업 추가 시**:
   - `src/types/career.ts`의 `CategoryType` 확인
   - `src/data/jobsData.ts`에 `Job` 규격에 맞춰 항목 추가 (`id`, `stats`, `moneyTruth`, `prepPeriod`, `aiTrafficLight`, `actionPlanForYouth` 등 필수)
   - `src/data/top10SalaryCalculator.ts`의 `SPECIFIC_TOP_10_MAP`에 상위 10% 연봉 및 도달 비결 추가
   - `src/data/workforceStats.ts`의 `WORKFORCE_DATABASE`에 전국 종사자 수 및 난이도 등록
2. **설문 질문 항목 확장 시**:
   - `src/data/surveyData.ts`의 `SURVEY_STEPS` 배열 및 `SurveyState8` 인터페이스 수정
   - `generateCharacterProfile8`의 가중치 및 스탯 산출 로직에 반영
3. **배포**:
   - `vercel.json` 설정이 포함되어 있어 Vercel 또는 GitHub Pages, Netlify에 단 한 번의 커맨드로 배포 가능

---

## ⚖️ 7. 출처 권리자, 라이선스 및 보안 컴플라이언스

본 프로젝트의 공공데이터 출처(한국고용정보원, 고용노동부, 통계청 등), 공공누리 제1유형 출처표시 준수, 오픈소스 라이브러리(React, Lucide, Tailwind 등) 라이선스, 그리고 학생 개인정보 보호(PII 미수집 및 LocalStorage 보안 원칙)에 관한 상세한 법적·보안 명세는 **[`COMPLIANCE.md`](file:///c:/Users/User/Desktop/careerahead/COMPLIANCE.md)** 문서에 전수 기록되어 있습니다.

---

## 📚 8. 프로그램 사용 안내서 및 초등학교 수업 자료, 공모전 제안서

* **공모전 종합 제안서 (Competition Proposal)**: **[`PROJECT_PROPOSAL.md`](file:///c:/Users/User/Desktop/careerahead/PROJECT_PROPOSAL.md)**  
  공모전 심사용 공식 기획서: 제안 배경 및 필요성, 4대 정밀 데이터 엔진 및 기술 차별성, 2D Chibi 캐릭터 및 6각 차트, Vercel 서버리스 피드백 루프, No-PII 보안 컴플라이언스, 2차시 수업 연계 효과 및 중장기 로드맵 총망라
* **공식 사용 안내서**: **[`USER_GUIDE.md`](file:///c:/Users/User/Desktop/careerahead/USER_GUIDE.md)**  
  교사용 접속 QR 띄우기, 8단계 퀘스트 가이드, 6대 육각형 능력치 해석, 5대 테마 전환, 카카오톡 이미지 바로 붙여넣기 기능 완벽 수록
* **초등 진로 수업 지도안 & 활동지 세트**: **[`LESSON_PLAN.md`](file:///c:/Users/User/Desktop/careerahead/LESSON_PLAN.md)**  
  초등 5~6학년 대상 *"2036년 미래의 나 소개하기(미래 명함 & 희망 연봉 & 3단계 로드맵 만들기)"* 2차시 교수·학습 과정안, 인쇄용 학생 활동지, 모범 답안 예시 수록

