// api/send-analytics-report.ts
// Vercel Serverless Function: 관리자 전용 전체 활동 통계 리포트 이메일 발송

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetEmail, stats, unregisteredJobs } = req.body || {};

    const recipientEmail = (targetEmail && targetEmail.includes('@')) 
      ? targetEmail.trim() 
      : (process.env.ADMIN_NOTIFICATION_EMAIL || 'chsj120@gmail.com');

    const nowStr = new Date().toLocaleString('ko-KR');

    // 1. 인기 검색어 포맷팅
    const topKeywords = stats?.topKeywords?.length
      ? stats.topKeywords.map((k: any, i: number) => `${i + 1}위. ${k.name} (${k.count}회)`).join('\n')
      : '검색 기록 없음';

    // 2. 최다 조회 직업 포맷팅
    const topViewedJobs = stats?.topViewedJobs?.length
      ? stats.topViewedJobs.map((j: any, i: number) => `${i + 1}위. ${j.name} (${j.count}회)`).join('\n')
      : '조회 기록 없음';

    // 3. 최다 찜 직업 포맷팅
    const topPickedJobs = stats?.topPickedJobs?.length
      ? stats.topPickedJobs.map((p: any, i: number) => `${i + 1}위. ${p.name} (${p.count}회)`).join('\n')
      : '찜 기록 없음';

    // 4. 성향 캐릭터 분포 포맷팅
    const topCharacters = stats?.topCharacters?.length
      ? stats.topCharacters.map((c: any, i: number) => `${i + 1}위. ${c.name} (${c.count}명)`).join('\n')
      : '검사 완료 기록 없음';

    // 5. 물가 시뮬레이터 희망 연봉 구간
    const topSalaries = stats?.topSalaries?.length
      ? stats.topSalaries.map((s: any, i: number) => `${i + 1}위. ${s.name} (${s.count}회)`).join('\n')
      : '시뮬레이터 조작 기록 없음';

    // 6. 미등록 직업 조사 요청 목록
    const recentRequests = Array.isArray(unregisteredJobs) && unregisteredJobs.length
      ? unregisteredJobs.slice(0, 10).map((r: any, i: number) => 
          `${i + 1}. [${r.jobName}] 이유: ${r.reason || '없음'} (${r.createdAt || ''})`
        ).join('\n')
      : '추가 요청된 직업 없음';

    // FormSubmit 중계 발송 (한글 깨짐 방지를 위해 영문 Key 및 charset=UTF-8 사용)
    const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[CareerPath] Activity & Job Analytics Report (${nowStr})`,
        _template: 'table',
        _captcha: 'false',
        Report_Date: nowStr,
        Total_Visits: `${stats?.totalVisits || 0}회 (최초: ${stats?.firstVisit || '기록없음'})`,
        Surveys_Completed: `${stats?.completedSurveysCount || 0}회`,
        Top_Search_Keywords: topKeywords,
        Top_Viewed_Jobs: topViewedJobs,
        Top_Picked_Jobs: topPickedJobs,
        Character_Distribution: topCharacters,
        Salary_Simulations: topSalaries,
        Unregistered_Job_Requests: recentRequests,
        Notice: '본 리포트는 학생들의 실제 검색 및 직업 탐색 로그를 기반으로 생성되었습니다. Vercel Web Analytics 대시보드를 통해 접속 국가 및 시/도 지역 통계도 함께 확인하실 수 있습니다.'
      })
    });

    if (!response.ok) {
      console.warn('Mail relay failed with status', response.status);
    }

    return res.status(200).json({ 
      success: true, 
      recipient: recipientEmail,
      message: `${recipientEmail}로 활동 통계 리포트가 성공적으로 발송되었습니다.` 
    });
  } catch (error: any) {
    console.error('Error sending analytics report:', error);
    return res.status(500).json({ error: 'Failed to send analytics report' });
  }
}
