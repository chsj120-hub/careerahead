import React, { useRef, useState, useEffect, useMemo } from 'react';
import { CharacterProfile, Job, HexagonStats } from '../types/career';
import { toPng, toBlob } from 'html-to-image';
import QRCode from 'qrcode';
import { ChibiCharacter } from './ChibiCharacter';
import { 
  Download, 
  X, 
  Sparkles, 
  Heart,
  Copy,
  ImageIcon,
  Share2
} from 'lucide-react';

interface ShareableResultCardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CharacterProfile;
  pickedJobs: Job[];
}

export const ShareableResultCard: React.FC<ShareableResultCardProps> = ({
  isOpen,
  onClose,
  profile,
  pickedJobs
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [miniQrUrl, setMiniQrUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 칭호에서 Lv. 표기 제거
  const cleanTitle = profile.title.replace(/\[?Lv\.\s*\d+\]?\s*/gi, '').trim();

  // 육각형 능력치 메모이제이션
  const hexagonStats: HexagonStats = useMemo(() => {
    return profile.stats || {
      creativity: 85,
      logic: 88,
      communication: 82,
      grit: 90,
      tech: 86,
      leadership: 84
    };
  }, [profile.stats]);

  // 친구에게 공유할 '바로 열리는 카드 링크' 생성 (URL 쿼리 파라미터 기반)
  const getDirectShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams({
      share: '1',
      code: profile.code,
      title: cleanTitle,
      avatar: profile.avatar,
      c: String(hexagonStats.creativity),
      l: String(hexagonStats.logic),
      e: String(hexagonStats.communication),
      g: String(hexagonStats.grit),
      t: String(hexagonStats.tech),
      lead: String(hexagonStats.leadership)
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // QR 코드 생성 (친구가 링크로 바로 접속할 수 있는 주소)
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const params = new URLSearchParams({
        share: '1',
        code: profile.code,
        title: cleanTitle,
        avatar: profile.avatar,
        c: String(hexagonStats.creativity),
        l: String(hexagonStats.logic),
        e: String(hexagonStats.communication),
        g: String(hexagonStats.grit),
        t: String(hexagonStats.tech),
        lead: String(hexagonStats.leadership)
      });
      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

      QRCode.toDataURL(shareUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then(url => setMiniQrUrl(url))
        .catch(err => console.error('Failed to generate mini QR', err));
    }
  }, [isOpen, profile.code, profile.avatar, cleanTitle, hexagonStats]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. 고화질 이미지 PNG 파일 다운로드
  // 1. 고화질 이미지 PNG 파일 다운로드 (하단 잘림 방지 완벽 처리)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const node = cardRef.current;
      const targetWidth = node.offsetWidth || 420;
      const targetHeight = node.scrollHeight + 32;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: 'none',
          margin: '0',
          maxHeight: 'none',
          overflow: 'visible',
          paddingBottom: '36px'
        }
      });
      const link = document.createElement('a');
      link.download = `내일찾기_진로카드_${profile.code}.png`;
      link.href = dataUrl;
      link.click();
      showToast('💾 고화질 카드 이미지가 다운로드되었습니다!');
    } catch (err) {
      console.error('Failed to export image', err);
      showToast('이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. 카카오톡에 바로 붙여넣기 (클립보드에 이미지 파일 직접 복사, 하단 잘림 방지)
  const handleCopyImageToClipboard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const node = cardRef.current;
      const targetWidth = node.offsetWidth || 420;
      const targetHeight = node.scrollHeight + 32;

      // 이미지 Blob 생성
      const blob = await toBlob(node, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF',
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: 'none',
          margin: '0',
          maxHeight: 'none',
          overflow: 'visible',
          paddingBottom: '36px'
        }
      });

      if (!blob) throw new Error('Blob creation failed');

      // 최신 브라우저: 클립보드에 이미지 바이너리(image/png) 직접 복사!
      if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        
        // 다운로드도 함께 실행하여 보조
        const link = document.createElement('a');
        link.download = `내일찾기_진로카드_${profile.code}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();

        showToast('🎉 그림 파일이 클립보드에 복사되었습니다!\n카카오톡 대화창에서 [Ctrl + V] 또는 [붙여넣기]를 누르면 이미지가 바로 첨부됩니다!');
      } else {
        // 클립보드 이미지 미지원 환경 폴백: 이미지 자동 다운로드 + 링크 복사
        const directUrl = getDirectShareUrl();
        await navigator.clipboard.writeText(directUrl);
        const link = document.createElement('a');
        link.download = `내일찾기_진로카드_${profile.code}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        showToast('🖼️ 카드 이미지가 다운로드되었고, 바로 열리는 링크가 복사되었습니다!\n카톡 대화창에 붙여넣어 친구에게 보내보세요!');
      }
    } catch (err) {
      console.error('Failed to copy image to clipboard', err);
      // 폴백 링크 복사
      const directUrl = getDirectShareUrl();
      try {
        await navigator.clipboard.writeText(directUrl);
        showToast('🔗 바로 열리는 카드 링크가 복사되었습니다!\n카카오톡에 붙여넣어 친구에게 보내보세요.');
      } catch {
        showToast('클립보드 권한을 확인해주세요.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // 3. 누르면 바로 카드가 열리는 공유 링크 복사
  const handleCopyCardLink = async () => {
    const directUrl = getDirectShareUrl();
    try {
      await navigator.clipboard.writeText(directUrl);
      showToast('🔗 친구가 누르면 이 카드가 바로 열리는 링크가 복사되었습니다!\n카카오톡에 붙여넣기(Ctrl+V)하세요.');
    } catch {
      showToast('링크 복사에 실패했습니다.');
    }
  };

  // 4. 모바일 Web Share API
  const handleNativeShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    const directUrl = getDirectShareUrl();
    const primaryJobTitle = pickedJobs[0]?.title || profile.recommendedJobs[0]?.title || '다양한 미래 직업';
    const textMsg = `🌟 [내일찾기] 나의 미래 진로 캐릭터는 "${cleanTitle} (${profile.code})" 입니다!\n🎯 찜한 직업: ${primaryJobTitle}\n\n👇 아래 링크를 누르면 내 육각형 진로 카드가 바로 열려요!\n👉 링크: ${directUrl}`;

    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#090D16'
      });

      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] })) {
        const file = new File([blob], `내일찾기_진로카드_${profile.code}.png`, { type: 'image/png' });
        await navigator.share({
          title: `[내일찾기] 나의 진로 캐릭터: ${cleanTitle}`,
          text: textMsg,
          url: directUrl,
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `[내일찾기] 나의 진로 캐릭터: ${cleanTitle}`,
          text: textMsg,
          url: directUrl
        });
      } else {
        await handleCopyImageToClipboard();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        await handleCopyCardLink();
      }
    } finally {
      setIsExporting(false);
    }
  };

  // 대표 픽 직업
  const primaryJob = pickedJobs[0] || profile.recommendedJobs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border-4 border-indigo-500/40 overflow-hidden flex flex-col max-h-[95vh] relative">
        
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs sm:text-sm">모바일 1장 진로 공유 카드</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNativeShare}
              title="SNS/모바일 시스템 공유"
              className="p-1.5 px-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">SNS 공유</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 안내 토스트 팝업 */}
        {toastMessage && (
          <div className="absolute top-14 left-4 right-4 z-50 p-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-xl border-2 border-slate-950 text-center animate-in fade-in slide-in-from-top-2 whitespace-pre-line leading-relaxed">
            {toastMessage}
          </div>
        )}

        {/* Scrollable View Area (Containing the Exportable Card) */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-slate-950">
          
          {/* THE 1-PAGE EXPORTABLE CARD CONTAINER (모던 클린 화이트 테마 & 2D 2등신 캐릭터 탑재) */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-5 sm:p-6 pb-8 sm:pb-10 border-4 border-indigo-400 shadow-2xl relative overflow-visible"
          >
            {/* Watermark / Brand Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  내일찾기 CareerPath
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                  2026 V5
                </span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold">
                공공 진로 데이터 공식 연계
              </span>
            </div>

            {/* 1. Character Identity Title */}
            <div className="text-center py-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs mb-1.5 shadow-2xs">
                <span>진로 탐험가</span>
                <span className="font-mono text-[11px] bg-white px-1.5 py-0.2 rounded border border-amber-300">
                  {profile.code}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {cleanTitle}
              </h2>

              <p className="text-xs text-slate-600 mt-1 px-2 leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* 2. 2D 2등신 사람 캐릭터 일러스트 (육각형 차트 대신 배치!) */}
            <div className="my-3 py-3 px-4 rounded-2xl bg-gradient-to-b from-indigo-50/70 via-slate-50 to-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-800 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>나의 2D 진로 캐릭터</span>
              </div>
              <ChibiCharacter
                title={cleanTitle}
                code={profile.code}
                size={135}
              />
              <div className="mt-1 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-xs">
                핵심: {profile.highlightStats}
              </div>
            </div>

            {/* 3. My Picked Dream Jobs (연봉 표시 제외, 깔끔한 직업 분류 뱃지 적용) */}
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-900 font-bold mb-1.5">
                <span className="flex items-center gap-1 font-black">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  내가 찜한 꿈의 직업 (Dream Pick)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {pickedJobs.length > 0 ? `${pickedJobs.length}개 선택` : '맞춤 추천'}
                </span>
              </div>

              <div className="space-y-1.5">
                {pickedJobs.length > 0 ? (
                  pickedJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{job.icon}</span>
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">{job.title}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[170px]">
                            {job.summary}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                        {job.categoryName}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{primaryJob?.icon}</span>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">{primaryJob?.title}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[170px]">
                          {primaryJob?.summary}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      {primaryJob?.categoryName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Primary Job Mini Infographic Badges (초임 연봉 대신 희소성 뱃지와 칭호/분류로 대체 & 박스 핏 최적화) */}
            {primaryJob && (
              <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                {/* 1. 희소성 뱃지 */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-0.5">
                    🏆 희소성 뱃지
                  </span>
                  <span className="font-extrabold text-indigo-700 text-[11px] block truncate w-full px-1">
                    {primaryJob.badge}
                  </span>
                </div>

                {/* 2. 직업 분류 / 칭호 */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-0.5">
                    🏷️ 직업 분류
                  </span>
                  <span className="font-bold text-slate-800 text-[11px] block truncate w-full px-1">
                    {primaryJob.categoryName}
                  </span>
                </div>

                {/* 3. 미래 유망도 */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-0.5">
                    🚀 미래 유망도
                  </span>
                  <span className="font-bold text-emerald-700 text-[11px] block truncate w-full px-1">
                    {primaryJob.aiTrafficLight.statusText.split(' ')[0]}
                  </span>
                </div>
              </div>
            )}

            {/* 5. 친구 초대 및 바로가기 QR 코드 배너 (화이트 톤) */}
            <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-amber-50/60 border border-indigo-200 flex items-center justify-between gap-2.5">
              <div className="text-left flex-1 min-w-0">
                <span className="text-[11px] font-black text-indigo-900 flex items-center gap-1">
                  👉 내 진로 카드 바로 열기
                </span>
                <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">
                  QR을 비추거나 공유 링크를 누르면 이 카드가 바로 열립니다!
                </p>
                <span className="text-[8px] text-indigo-600 font-mono mt-0.5 block truncate">
                  🔗 {typeof window !== 'undefined' ? window.location.origin : '내일찾기'}
                </span>
              </div>

              {miniQrUrl && (
                <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200 shrink-0">
                  <img src={miniQrUrl} alt="내일찾기 QR" className="w-11 h-11 object-contain" />
                </div>
              )}
            </div>

            {/* 6. Footer */}
            <div className="mt-2.5 pt-2 border-t border-slate-200 text-center">
              <p className="text-[8px] text-slate-400">
                © 2026 내일찾기 (CareerPath Finder) · 한국고용정보원 데이터 기반
              </p>
            </div>
          </div>


        </div>

        {/* Action Buttons Footer: 사용자가 원하는 카카오톡 이미지 바로 붙여넣기 + 링크 복사 + 이미지 저장 */}
        <div className="p-3 sm:p-4 bg-slate-800/95 border-t border-slate-700 space-y-2">
          
          {/* 핵심 버튼 1: 카카오톡에 그림 바로 붙여넣기 (이미지 파일 클립보드 복사) */}
          <button
            onClick={handleCopyImageToClipboard}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-transform active:scale-95 shadow-lg shadow-amber-400/25 min-h-[46px]"
          >
            <ImageIcon className="w-4 h-4 text-slate-950" />
            <span>카톡에 그림 바로 붙여넣기 (클립보드 복사) 💬</span>
          </button>

          {/* 보조 버튼 2열: 친구가 누르면 바로 열리는 링크 복사 & 고화질 이미지 저장 */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyCardLink}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors border border-slate-600 min-h-[40px]"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-300" />
              <span>카드 링크 복사</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors min-h-[40px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>이미지 파일 저장</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center font-medium">
            💡 [그림 바로 붙여넣기]를 누른 뒤 카카오톡 대화창에서 <strong>Ctrl + V</strong>(또는 꾹 눌러 붙여넣기)를 하시면 이미지가 바로 전송됩니다!
          </p>
        </div>

      </div>
    </div>
  );
};
