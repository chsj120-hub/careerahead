// src/utils/freeToolLinks.ts

export interface FreeToolLink {
  url: string;
  label: string;
  buttonText: string;
}

/**
 * 직업 액션 플랜의 '오늘 바로 해보는 무료 툴 & 체험' 텍스트를 분석하여,
 * 웹이나 인터넷으로 직접 연결 가능한 경우 공식 링크 정보를 반환합니다.
 * 오프라인 체험(예: 스콘 굽기, 핸드드립 향 맡기 등)은 null을 반환합니다.
 */
export function getFreeToolLink(freeToolText: string | undefined): FreeToolLink | null {
  if (!freeToolText) return null;

  const t = freeToolText.trim();

  // 1. 제외 대상: 인터넷 사이트가 아닌 순수 오프라인/현장 실습 행동
  const offlineKeywords = [
    '직캠 모니터링',
    '3D 안경 착용 앱',
    '오븐 토스터',
    '배달앱 리뷰 이벤트',
    '키오스크 결제 프로세스',
    '헤어스타일 가상 변경',
    '핸드드립 원두 향',
    '편의점 행사 상품 분석',
    '영화관 앱 패스트오더',
    '수경재배 키트'
  ];

  for (const keyword of offlineKeywords) {
    if (t.includes(keyword)) {
      return null;
    }
  }

  // 2. 텍스트 내에 명시적인 도메인이 있는 경우 우선 매핑
  if (t.includes('glaw.scourt.go.kr')) {
    return { url: 'https://glaw.scourt.go.kr', label: '대법원 종합법률정보', buttonText: '대법원 판결문 검색 바로가기' };
  }
  if (t.includes('likms.assembly.go.kr')) {
    return { url: 'https://likms.assembly.go.kr', label: '대한민국 국회 의안정보시스템', buttonText: '국회 의안정보 바로가기' };
  }
  if (t.includes('eum.go.kr')) {
    return { url: 'https://www.eum.go.kr', label: '토지이음', buttonText: '토지이음 열람 바로가기' };
  }
  if (t.includes('earth.nullschool.net')) {
    return { url: 'https://earth.nullschool.net', label: 'Earth Nullschool 지구 시뮬레이션', buttonText: '실시간 지구 대기 관찰하기' };
  }
  if (t.includes('Windy.com') || t.includes('윈디')) {
    return { url: 'https://www.windy.com', label: 'Windy 해상/대기 관측', buttonText: 'Windy 실시간 관측 바로가기' };
  }
  if (t.includes('playentry.org') || t.includes('엔트리')) {
    return { url: 'https://playentry.org', label: '엔트리(Entry)', buttonText: '엔트리 무료 코딩 바로가기' };
  }
  if (t.includes('gov.kr') || t.includes('정부24')) {
    return { url: 'https://www.gov.kr', label: '정부24', buttonText: '정부24 바로가기' };
  }
  if (t.includes('iros.go.kr') || t.includes('인터넷등기소')) {
    return { url: 'http://www.iros.go.kr', label: '대법원 인터넷등기소', buttonText: '인터넷등기소 바로가기' };
  }
  if (t.includes('sg.sbiz.or.kr') || t.includes('상권정보시스템')) {
    return { url: 'https://sg.sbiz.or.kr', label: '소상공인 상권정보시스템', buttonText: '상권분석 무료 체험 바로가기' };
  }

  // 3. 주요 웹 툴 및 시뮬레이터 플랫폼 매핑
  if (t.includes('Tinkercad Circuits')) {
    return { url: 'https://www.tinkercad.com/circuits', label: '틴커캐드 서킷 (Tinkercad Circuits)', buttonText: '무료 가상 회로 실습 바로가기' };
  }
  if (t.includes('Tinkercad')) {
    return { url: 'https://www.tinkercad.com', label: '틴커캐드 (Tinkercad 3D)', buttonText: '무료 3D 모델링 체험 바로가기' };
  }
  if (t.includes('Complete Anatomy')) {
    return { url: 'https://3d4medical.com', label: 'Complete Anatomy 3D 인체해부학', buttonText: '해부학 3D 앱 구경하기' };
  }
  if (t.includes('MarineTraffic')) {
    return { url: 'https://www.marinetraffic.com', label: 'MarineTraffic 선박 실시간 추적', buttonText: '전 세계 실시간 선박 지도 열기' };
  }
  if (t.includes('키프리스') || t.includes('KIPRIS')) {
    return { url: 'http://www.kipris.or.kr', label: '특허정보넷 키프리스(KIPRIS)', buttonText: '대한민국 특허 무료 검색하기' };
  }
  if (t.includes('로앤굿')) {
    return { url: 'https://www.lawngood.com', label: '로앤굿 AI 법률 플랫폼', buttonText: 'AI 법률 플랫폼 둘러보기' };
  }
  if (t.includes('DART') || t.includes('전자공시시스템')) {
    return { url: 'https://dart.fss.or.kr', label: '금융감독원 전자공시시스템(DART)', buttonText: '기업 실적 공시 조회하기' };
  }
  if (t.includes('네이버 증권') || t.includes('야후 파이낸스')) {
    return { url: 'https://finance.naver.com', label: '네이버 증권', buttonText: '주식·차트 분석 바로가기' };
  }
  if (t.includes('네이버 부동산') || t.includes('아실')) {
    return { url: 'https://asil.kr', label: '아실(ASIL) 부동산 빅데이터', buttonText: '부동산 실거래가 조회하기' };
  }
  if (t.includes('Google Scholar') || t.includes('구글 학술검색')) {
    return { url: 'https://scholar.google.com', label: 'Google Scholar (구글 학술검색)', buttonText: '무료 학술 논문 검색하기' };
  }
  if (t.includes('하버드 비즈니스 리뷰') || t.includes('HBR')) {
    return { url: 'https://hbr.org', label: 'Harvard Business Review', buttonText: 'HBR 경영 아티클 구경하기' };
  }
  if (t.includes('의약품안전나라')) {
    return { url: 'https://nedrug.mfds.go.kr', label: '식약처 의약품안전나라', buttonText: '의약품 성분 검색 바로가기' };
  }
  if (t.includes('Canva')) {
    return { url: 'https://www.canva.com', label: 'Canva (캔바)', buttonText: '무료 캔바 디자인 툴 열기' };
  }
  if (t.includes('MS 플라이트 시뮬레이터') || t.includes('플라이트 시뮬레이터')) {
    return { url: 'https://www.flightsimulator.com', label: 'Microsoft Flight Simulator', buttonText: '플라이트 시뮬레이터 둘러보기' };
  }
  if (t.includes('동물보호관리시스템')) {
    return { url: 'https://www.animal.go.kr', label: '농림축산식품부 동물보호관리시스템', buttonText: '동물보호관리시스템 바로가기' };
  }
  if (t.includes('DWSIM')) {
    return { url: 'https://dwsim.org', label: 'DWSIM 화학공정 시뮬레이터', buttonText: 'DWSIM 공식 사이트 바로가기' };
  }
  if (t.includes('한국원자력연구원') || t.includes('KAERI')) {
    return { url: 'https://www.kaeri.re.kr', label: '한국원자력연구원(KAERI)', buttonText: '원자력 연구 포털 바로가기' };
  }
  if (t.includes('Park1538') || t.includes('포스코')) {
    return { url: 'https://park1538.posco.com', label: '포스코 Park1538 가상투어', buttonText: 'Park1538 가상투어 둘러보기' };
  }
  if (t.includes('퓨전360') || t.includes('Fusion 360') || t.includes('오토데스크')) {
    return { url: 'https://www.autodesk.co.kr/products/fusion-360/personal', label: 'Autodesk Fusion 360', buttonText: '무료 3D CAD 설계 둘러보기' };
  }
  if (t.includes('현대자동차 테크 블로그')) {
    return { url: 'https://tech.hyundaimotorgroup.com', label: '현대자동차 테크 블로그', buttonText: '현대차 모빌리티 기술 구경하기' };
  }
  if (t.includes('국가과학기술연구회') || t.includes('NST')) {
    return { url: 'https://www.nst.re.kr', label: '국가과학기술연구회 (NST)', buttonText: '정부출연연 연구성과 포털 열기' };
  }
  if (t.includes('한국바이오협회')) {
    return { url: 'https://www.koreabio.org', label: '한국바이오협회', buttonText: '한국바이오협회 바로가기' };
  }
  if (t.includes('글로벌 윈드 아틀라스') || t.includes('Global Wind Atlas')) {
    return { url: 'https://globalwindatlas.info', label: 'Global Wind Atlas 풍황 지도', buttonText: '전 세계 해상 풍황 지도 보기' };
  }
  if (t.includes('IBM Quantum Composer')) {
    return { url: 'https://quantum.ibm.com/composer', label: 'IBM Quantum Composer', buttonText: 'IBM 클라우드 양자회로 실습' };
  }
  if (t.includes('알파폴드') || t.includes('AlphaFold')) {
    return { url: 'https://alphafold.ebi.ac.uk', label: 'AlphaFold Protein Structure Database', buttonText: '3D 단백질 구조 열람하기' };
  }
  if (t.includes('PhET')) {
    return { url: 'https://phet.colorado.edu/ko/simulations/filter?type=html', label: 'PhET 대화형 과학/수학 시뮬레이션', buttonText: 'PhET 과학 시뮬레이션 바로가기' };
  }
  if (t.includes('CryptoHack')) {
    return { url: 'https://cryptohack.org', label: 'CryptoHack 온라인 암호학', buttonText: '무료 암호 퍼즐 도전하기' };
  }
  if (t.includes('NCBI BLAST') || t.includes('BLAST')) {
    return { url: 'https://blast.ncbi.nlm.nih.gov/Blast.cgi', label: 'NCBI BLAST 유전자 서열 검색', buttonText: 'BLAST 유전자 검색기 바로가기' };
  }
  if (t.includes('OpenBCI')) {
    return { url: 'https://openbci.com', label: 'OpenBCI 오픈소스 뇌파 인터페이스', buttonText: 'OpenBCI 프로젝트 둘러보기' };
  }
  if (t.includes('CARLA')) {
    return { url: 'https://carla.org', label: 'CARLA 자율주행 시뮬레이터', buttonText: 'CARLA 자율주행 오픈소스 사이트' };
  }
  if (t.includes('Kaggle')) {
    return { url: 'https://www.kaggle.com', label: 'Kaggle (캐글)', buttonText: 'Kaggle 데이터셋 둘러보기' };
  }
  if (t.includes('Materials Project')) {
    return { url: 'https://next-gen.materialsproject.org', label: 'The Materials Project', buttonText: '무료 신소재 물성 데이터베이스 열기' };
  }
  if (t.includes('CapCut') || t.includes('Vrew')) {
    return { url: 'https://www.capcut.com', label: 'CapCut 무료 영상 편집', buttonText: '무료 영상 편집 툴 바로가기' };
  }
  if (t.includes('메디방') || t.includes('이비스 페인트')) {
    return { url: 'https://medibangpaint.com', label: '메디방 페인트 (MediBang Paint)', buttonText: '무료 웹툰/일러스트 그리기' };
  }
  if (t.includes('OP.GG')) {
    return { url: 'https://www.op.gg', label: 'OP.GG 게임 데이터 분석', buttonText: 'e스포츠 경기 데이터 분석하기' };
  }
  if (t.includes('Nike Training Club')) {
    return { url: 'https://www.nike.com/kr/ntc-app', label: 'Nike Training Club (NTC)', buttonText: 'NTC 트레이닝 앱 둘러보기' };
  }
  if (t.includes('Roblox Studio')) {
    return { url: 'https://create.roblox.com', label: '로블록스 스튜디오 (Roblox Studio)', buttonText: '무료 게임 제작 스튜디오 바로가기' };
  }
  if (t.includes('만개의 레시피')) {
    return { url: 'https://www.10000recipe.com', label: '만개의 레시피', buttonText: '레시피 포털 바로가기' };
  }
  if (t.includes('Pinterest')) {
    return { url: 'https://www.pinterest.co.kr', label: '핀터레스트 (Pinterest)', buttonText: '디자인 무드보드 구경하기' };
  }
  if (t.includes('백준')) {
    return { url: 'https://www.acmicpc.net', label: '백준 온라인 저지', buttonText: '알고리즘 문제 풀기 바로가기' };
  }
  if (t.includes('구글 스프레드시트')) {
    return { url: 'https://docs.google.com/spreadsheets/', label: '구글 스프레드시트', buttonText: '무료 온라인 스프레드시트 열기' };
  }
  if (t.includes('Meta 광고 라이브러리')) {
    return { url: 'https://www.facebook.com/ads/library/', label: 'Meta 광고 라이브러리', buttonText: '실제 기업 마케팅 광고 분석하기' };
  }
  if (t.includes('TED')) {
    return { url: 'https://www.ted.com', label: 'TED 명강연', buttonText: 'TED 프레젠테이션 영상 보기' };
  }
  if (t.includes('한국은행 어린이 경제마을')) {
    return { url: 'https://www.bok.or.kr/kids/', label: '한국은행 어린이 경제마을', buttonText: '어린이 경제마을 바로가기' };
  }
  if (t.includes('Figma')) {
    return { url: 'https://www.figma.com', label: '피그마 (Figma)', buttonText: '무료 피그마 디자인 시작하기' };
  }
  if (t.includes('1365')) {
    return { url: 'https://www.1365.go.kr', label: '1365 자원봉사포털', buttonText: '1365 자원봉사포털 바로가기' };
  }
  if (t.includes('원티드') || t.includes('Wanted')) {
    return { url: 'https://www.wanted.co.kr', label: '원티드(Wanted)', buttonText: '최신 채용 공고 분석하기' };
  }
  if (t.includes('EBS')) {
    return { url: 'https://mid.ebs.co.kr', label: 'EBS 중학 강좌', buttonText: 'EBS 1타 강사 강좌 둘러보기' };
  }
  if (t.includes('인스타그램')) {
    return { url: 'https://www.instagram.com', label: '인스타그램 디자인 트렌드', buttonText: '인스타그램 트렌드 둘러보기' };
  }
  if (t.includes('오늘의집')) {
    return { url: 'https://ohou.se', label: '오늘의집 3D 인테리어', buttonText: '3D 인테리어 시뮬레이터 열기' };
  }
  if (t.includes('농촌진흥청')) {
    return { url: 'https://www.rda.go.kr', label: '농촌진흥청', buttonText: '농촌진흥청 공식 포털 바로가기' };
  }
  if (t.includes('모야모')) {
    return { url: 'http://www.moyamo.co.kr', label: '모야모 식물 백과', buttonText: '식물 식별 모야모 둘러보기' };
  }
  if (t.includes('아이템스카우트')) {
    return { url: 'https://itemscout.io', label: '아이템스카우트 이커머스 분석', buttonText: '키워드 발굴 무료 체험하기' };
  }
  if (t.includes('노션') || t.includes('Notion')) {
    return { url: 'https://www.notion.so', label: '노션 (Notion)', buttonText: '노션 무료 노트 툴 열기' };
  }
  if (t.includes('BandLab')) {
    return { url: 'https://www.bandlab.com', label: 'BandLab 무료 웹 작곡 스튜디오', buttonText: '온라인 무료 작곡 툴 바로가기' };
  }
  if (t.includes('DeepL')) {
    return { url: 'https://www.deepl.com', label: 'DeepL AI 번역기', buttonText: 'DeepL AI 번역기 바로가기' };
  }
  if (t.includes('Blender') || t.includes('블렌더')) {
    return { url: 'https://www.blender.org', label: '블렌더 (Blender 3D)', buttonText: 'Blender 무료 다운로드 사이트' };
  }
  if (t.includes('다빈치 리졸브') || t.includes('DaVinci Resolve')) {
    return { url: 'https://www.blackmagicdesign.com/kr/products/davinciresolve', label: 'DaVinci Resolve 영상 편집기', buttonText: '다빈치 리졸브 무료 버전 둘러보기' };
  }
  if (t.includes('클립스튜디오') || t.includes('프로크리에이트')) {
    return { url: 'https://www.clipstudio.net/kr', label: '클립스튜디오 (CLIP STUDIO PAINT)', buttonText: '클립스튜디오 둘러보기' };
  }
  if (t.includes('Audacity')) {
    return { url: 'https://www.audacityteam.org', label: 'Audacity 무료 오디오 편집기', buttonText: 'Audacity 공식 사이트 바로가기' };
  }
  if (t.includes('크라우드웍스') || t.includes('에이아이웍스')) {
    return { url: 'https://www.crowdworks.kr', label: '크라우드웍스 AI 데이터 라벨링', buttonText: '데이터 라벨링 플랫폼 둘러보기' };
  }
  if (t.includes('패들릿') || t.includes('Padlet')) {
    return { url: 'https://padlet.com', label: '패들릿 (Padlet)', buttonText: '패들릿 대화형 협업 툴 열기' };
  }
  if (t.includes('Framer') || t.includes('프레이머')) {
    return { url: 'https://www.framer.com', label: '프레이머 (Framer 노코드 웹)', buttonText: '프레이머 무료 제작 시작하기' };
  }
  if (t.includes('아임웹')) {
    return { url: 'https://imweb.me', label: '아임웹 (Imweb)', buttonText: '아임웹 무료 제작 바로가기' };
  }
  if (t.includes('표준근로계약서')) {
    return { url: 'https://www.moel.go.kr', label: '고용노동부 표준근로계약서', buttonText: '고용노동부 공식 포털 열기' };
  }
  if (t.includes('Liftoff')) {
    return { url: 'https://www.liftoff-game.com', label: 'Liftoff FPV 드론 시뮬레이터', buttonText: 'Liftoff 드론 시뮬레이터 둘러보기' };
  }
  if (t.includes('Gemini') || t.includes('ChatGPT')) {
    return { url: 'https://gemini.google.com', label: 'Google Gemini AI 대화', buttonText: 'Gemini 무료 AI와 대화하기' };
  }
  if (t.includes('ROS') || t.includes('마인드스톰')) {
    return { url: 'https://www.ros.org', label: 'ROS (Robot Operating System)', buttonText: 'ROS 로봇 운영체제 사이트 열기' };
  }
  if (t.includes('Dreamhack') || t.includes('드림핵')) {
    return { url: 'https://dreamhack.io', label: '드림핵 (Dreamhack)', buttonText: '드림핵 무료 화이트해킹 워게임 열기' };
  }
  if (t.includes('전력데이터개방포털')) {
    return { url: 'https://opm.kepco.co.kr', label: '한전 전력데이터 개방포털', buttonText: '전력 발전량 데이터 그래프 보기' };
  }
  if (t.includes('Kerbal Space Program') || t.includes('KSP')) {
    return { url: 'https://www.kerbalspaceprogram.com', label: 'Kerbal Space Program', buttonText: 'KSP 우주 궤도 역학 시뮬레이터 둘러보기' };
  }
  if (t.includes('네이버 지도')) {
    return { url: 'https://map.naver.com', label: '네이버 지도', buttonText: '네이버 지도 상권/입지 분석하기' };
  }

  // 4. 유튜브 키워드가 포함된 경우 유튜브 검색 결과로 연결
  if (t.includes('유튜브') || t.includes('영상 시청')) {
    const cleanQuery = t.replace(/유튜브|영상|시청|강좌|다큐멘터리/g, '').trim();
    const query = cleanQuery || t;
    return {
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      label: `유튜브: ${query}`,
      buttonText: '유튜브 관련 영상 시청하기'
    };
  }

  return null;
}
