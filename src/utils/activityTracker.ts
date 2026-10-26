// src/utils/activityTracker.ts

const STATS_STORAGE_KEY = 'careerahead_activity_stats';

export interface ActivityStatsData {
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  completedSurveysCount: number;
  characterCounts: Record<string, number>;
  searchKeywordCounts: Record<string, number>;
  jobViewCounts: Record<string, number>;
  pickedJobCounts: Record<string, number>;
  salarySimulationCounts: Record<string, number>;
}

const defaultStats: ActivityStatsData = {
  firstVisit: '',
  lastVisit: '',
  totalVisits: 0,
  completedSurveysCount: 0,
  characterCounts: {},
  searchKeywordCounts: {},
  jobViewCounts: {},
  pickedJobCounts: {},
  salarySimulationCounts: {}
};

export function loadActivityStats(): ActivityStatsData {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { ...defaultStats, firstVisit: new Date().toLocaleString('ko-KR') };
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return defaultStats;
  }
}

export function saveActivityStats(stats: ActivityStatsData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save activity stats', e);
  }
}

// 1. 방문 기록
export function trackVisit(): void {
  const stats = loadActivityStats();
  const now = new Date().toLocaleString('ko-KR');
  if (!stats.firstVisit) stats.firstVisit = now;
  stats.lastVisit = now;
  stats.totalVisits = (stats.totalVisits || 0) + 1;
  saveActivityStats(stats);
}

// 2. 검색어 기록
export function trackSearch(keyword: string): void {
  const clean = keyword.trim();
  if (!clean || clean.length < 2) return;
  const stats = loadActivityStats();
  stats.searchKeywordCounts[clean] = (stats.searchKeywordCounts[clean] || 0) + 1;
  saveActivityStats(stats);
}

// 3. 직업 상세 조회(클릭) 기록
export function trackJobView(jobTitle: string): void {
  if (!jobTitle) return;
  const stats = loadActivityStats();
  stats.jobViewCounts[jobTitle] = (stats.jobViewCounts[jobTitle] || 0) + 1;
  saveActivityStats(stats);
}

// 4. 찜(Pick) 기록
export function trackPick(jobTitle: string, isPicked: boolean): void {
  if (!jobTitle || !isPicked) return;
  const stats = loadActivityStats();
  stats.pickedJobCounts[jobTitle] = (stats.pickedJobCounts[jobTitle] || 0) + 1;
  saveActivityStats(stats);
}

// 5. 설문(퀘스트) 완료 기록
export function trackSurveyComplete(characterTitle: string): void {
  const stats = loadActivityStats();
  stats.completedSurveysCount = (stats.completedSurveysCount || 0) + 1;
  if (characterTitle) {
    stats.characterCounts[characterTitle] = (stats.characterCounts[characterTitle] || 0) + 1;
  }
  saveActivityStats(stats);
}

// 6. 물가 시뮬레이터 연봉 조절 기록
export function trackSalarySimulation(salary: number): void {
  if (!salary) return;
  const stats = loadActivityStats();
  const key = `${salary.toLocaleString()}만 원`;
  stats.salarySimulationCounts[key] = (stats.salarySimulationCounts[key] || 0) + 1;
  saveActivityStats(stats);
}

// 헬퍼: 빈도 높은 순 Top N 정렬
export function getTopEntries(record: Record<string, number>, topN = 5): Array<{ name: string; count: number }> {
  return Object.entries(record || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
