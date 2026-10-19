// src/utils/feedbackSender.ts
import { UnregisteredJobRequest } from '../types/career';

const STORAGE_KEY = 'unregistered_job_logs';

// 관리자 이메일 마스킹 토큰 (난독화 안전 보관: chsj120 [at] gmail.com)
// Base64 인코딩으로 스팸 수집 봇의 단순 텍스트 크롤링을 방어합니다.
const OBFUSCATED_ADMIN_TOKEN = 'Y2hzajEyMEBnbWFpbC5jb20=';

const getDecodedEndpoint = (): string => {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(OBFUSCATED_ADMIN_TOKEN);
    }
  } catch {
    // silent
  }
  return '';
};

export interface SendJobRequestResult {
  success: boolean;
  isSavedLocally: boolean;
  isMailSent: boolean;
  message: string;
}

/**
 * 학생의 직업 조사 요청을 로컬에 누적 저장하고 관리자 메일로 자동 발송
 */
export async function sendJobRequestFeedback(
  jobName: string,
  reason: string,
  studentEmail: string
): Promise<SendJobRequestResult> {
  const newRequest: UnregisteredJobRequest = {
    id: Date.now().toString(),
    jobName: jobName.trim(),
    reason: reason.trim(),
    email: studentEmail.trim(),
    createdAt: new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  // 1. 브라우저 localStorage에 영구 누적 저장 (오프라인/네트워크 오류 시에도 보존)
  let isSavedLocally = false;
  try {
    const existingLogs: UnregisteredJobRequest[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
    existingLogs.unshift(newRequest); // 최신순 정렬
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingLogs));
    isSavedLocally = true;
  } catch (e) {
    console.error('Failed to save log to localStorage', e);
  }

  // 2. 관리자 메일로 자동 발송 시도
  let isMailSent = false;
  try {
    // 2-1. Vercel 서버리스 API 호출 시도 (/api/request-job)
    const serverlessResponse = await fetch('/api/request-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobName: newRequest.jobName,
        reason: newRequest.reason,
        studentEmail: newRequest.email,
        createdAt: newRequest.createdAt
      })
    });

    if (serverlessResponse.ok) {
      isMailSent = true;
    } else {
      // 2-2. 서버리스 API가 지원되지 않는 정적 호스팅(GitHub Pages 등)일 때 안전한 폴백 중계 발송
      const targetAdmin = getDecodedEndpoint();
      if (targetAdmin) {
        await fetch(`https://formsubmit.co/ajax/${targetAdmin}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[내일찾기 V5] 학생의 신규 직업 조사 요청: ${newRequest.jobName}`,
            _template: 'table',
            _captcha: 'false',
            '요청_직업명': newRequest.jobName,
            '궁금한_점': newRequest.reason || '내용 없음',
            '학생_이메일': newRequest.email || '미입력',
            '접수_일시': newRequest.createdAt
          })
        });
        isMailSent = true;
      }
    }
  } catch (err) {
    console.warn('Mail relay fallback notice:', err);
    // 메일 발송이 실패하더라도 로컬에 저장되었으므로 학생에게는 성공 안내
  }

  return {
    success: true,
    isSavedLocally,
    isMailSent,
    message: '직업 조사 요청이 성공적으로 접수되었습니다!'
  };
}

/**
 * 관리자가 나중에 분기별 업데이트에 참고할 수 있도록 모든 누적 로그를 CSV로 다운로드
 */
export function exportJobRequestsToCSV(): void {
  try {
    const existingLogs: UnregisteredJobRequest[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );

    if (existingLogs.length === 0) {
      alert('현재 누적된 직업 조사 요청 내역이 없습니다.');
      return;
    }

    // CSV BOM (Excel 한글 깨짐 방지)
    let csvContent = '\uFEFF';
    csvContent += '접수일시,요청 직업명,궁금한 점 및 이유,학생 이메일\n';

    existingLogs.forEach(log => {
      const cleanJob = `"${(log.jobName || '').replace(/"/g, '""')}"`;
      const cleanReason = `"${(log.reason || '').replace(/"/g, '""')}"`;
      const cleanEmail = `"${(log.email || '').replace(/"/g, '""')}"`;
      const cleanDate = `"${(log.createdAt || '').replace(/"/g, '""')}"`;
      csvContent += `${cleanDate},${cleanJob},${cleanReason},${cleanEmail}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `내일찾기_미등록직업_요청목록_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export CSV', err);
    alert('CSV 내보내기 중 오류가 발생했습니다.');
  }
}

/**
 * 누적된 요청 건수 확인
 */
export function getStoredJobRequestsCount(): number {
  try {
    const existingLogs: UnregisteredJobRequest[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    );
    return existingLogs.length;
  } catch {
    return 0;
  }
}
