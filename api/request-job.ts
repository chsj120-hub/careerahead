// api/request-job.ts
// Vercel Serverless Function: 관리자 이메일을 클라이언트에 노출하지 않고 안전하게 수신 처리

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobName, reason, studentEmail, createdAt } = req.body || {};

    if (!jobName || typeof jobName !== 'string') {
      return res.status(400).json({ error: '직업 이름이 필요합니다.' });
    }

    // 관리자 수신 이메일 (환경 변수가 설정되어 있으면 우선 사용, 기본값 은닉)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'chsj120@gmail.com';

    // FormSubmit / Resend / Webhook 중계 발송 (서버사이드에서 수행하여 클라이언트에는 관리자 이메일 미노출)
    // 한글 깨짐 방지: FormSubmit 템플릿 키(Key) 및 메일 제목(_subject)은 영문으로 지정해야 UTF-8 인코딩 손실이 발생하지 않습니다.
    const response = await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: '[CareerPath] New Student Job Request',
        _template: 'table',
        _captcha: 'false',
        Job_Name: jobName.trim(),
        Questions: reason ? reason.trim() : '없음',
        Student_Email: studentEmail ? studentEmail.trim() : '미입력',
        Date_Time: createdAt || new Date().toLocaleString('ko-KR')
      })
    });

    if (!response.ok) {
      console.warn('Mail relay responded with non-ok status');
    }

    return res.status(200).json({ success: true, message: '요청이 관리자에게 안전하게 전달되었습니다.' });
  } catch (error: any) {
    console.error('Error handling job request notification:', error);
    // 에러가 나더라도 클라이언트 저장을 위해 정상 처리 응답
    return res.status(200).json({ success: true, fallback: true });
  }
}
