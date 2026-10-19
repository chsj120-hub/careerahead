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
        backgroundColor: '#FFFFFF'
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

  // 대표 픽 직업 및 찜한 직업 목록 (먼저 찜한 최대 2개까지)
  const primaryJob = pickedJobs[0] || profile.recommendedJobs[0];
  const displayPickedJobs = pickedJobs.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border-4 border-indigo-500/40 overflow-hidden flex flex-col max-h-[95vh] relative">
        
        {/* Top Control Bar */}
        <div className="p-3 sm:p-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs sm:text-sm">모바일 1장 진로 공유 카드</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNativeShare}
              title="SNS/모바일 시스템 공유"
              className="p-1.5 px-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">SNS 공유</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 안내 토스트 팝업 */}
        {toastMessage && (
          <div className="absolute top-14 left-4 right-4 z-50 p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-xl border-2 border-slate-950 text-center animate-in fade-in slide-in-from-top-2 whitespace-pre-line leading-relaxed">
            {toastMessage}
          </div>
        )}

        {/* Scrollable View Area (Containing the Exportable Card) */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-slate-950">
          
          {/* THE 1-PAGE EXPORTABLE CARD CONTAINER (모던 클린 화이트 & 콤팩트 2열 레이아웃) */}
          <div
            ref={cardRef}
            className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 rounded-3xl p-3.5 sm:p-4 pb-5 sm:pb-6 border-3 border-indigo-400 shadow-xl relative overflow-visible"
          >
            {/* Watermark / Brand Header (상단 슬림 헤더) */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  내일찾기 CareerPath
                </span>
                <span className="text-[8.5px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                  2026 V5
                </span>
              </div>
              <span className="text-[9px] text-indigo-600 font-bold">
                공공 진로 데이터 공식 연계
              </span>
            </div>

            {/* 메인 2열 분할 레이아웃: 왼쪽(진로 캐릭터 & 칭호 가운데 정렬) vs 오른쪽(희소성/분류/유망도/찜 4~5칸 세로정렬) */}
            <div className="grid grid-cols-2 gap-2 my-1 items-stretch">
              
              {/* [왼쪽 절반]: 2D 2등신 캐릭터 등장 창 (가운데 정렬) */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b from-indigo-50/80 via-slate-50 to-indigo-50/60 border border-indigo-100 text-center h-full">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] shadow-2xs mb-1">
                  <span>진로 탐험가</span>
                  <span className="font-mono text-[9px] bg-white/80 px-1 rounded">
                    {profile.code}
                  </span>
                </div>

                {/* 2D 2등신 사람 캐릭터 */}
                <div className="py-0.5">
                  <ChibiCharacter
                    title={cleanTitle}
                    code={profile.code}
                    size={105}
                  />
                </div>

                {/* 칭호 */}
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug px-0.5 break-keep">
                  {cleanTitle}
                </h2>

                {/* 핵심 매칭 역량 태그 */}
                <div className="mt-1.5 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-extrabold text-[9.5px] truncate max-w-full">
                  {profile.highlightStats}
                </div>
              </div>

              {/* [오른쪽 절반]: 희소성 뱃지(글자 안 짤리게) + 직업 분류 + 미래 유망도 + 찜한 꿈의 직업 (아이콘+이름만) 세로 정렬 */}
              <div className="flex flex-col justify-between gap-1.5 h-full">
                
                {/* 1. 희소성 뱃지 (글자 안 짤리게 여유 공간과 break-keep 적용) */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex flex-col justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-1">
                    🏆 희소성 뱃지
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-indigo-700 leading-tight break-keep">
                    {primaryJob.badge}
                  </span>
                </div>

                {/* 2. 직업 분류 */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex flex-col justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-1">
                    🏷️ 직업 분류
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight break-keep">
                    {primaryJob.categoryName}
                  </span>
                </div>

                {/* 3. 미래 유망도 */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex flex-col justify-center">
                  <span className="text-[9px] text-slate-500 font-bold mb-0.5 flex items-center gap-1">
                    🚀 미래 유망도
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-700 leading-tight">
                    {primaryJob.aiTrafficLight.statusText.split(' ')[0]}
                  </span>
                </div>

                {/* 4. 내가 찜한 꿈의 직업 1 (아이콘 + 직업 이름만 심플하게 표시) */}
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs flex flex-col justify-center">
                  <span className="text-[9px] text-amber-900 font-black mb-0.5 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                    {displayPickedJobs.length > 0 ? '찜한 꿈의 직업 1' : '맞춤 추천 직업'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-slate-900 truncate">
                    <span className="text-sm shrink-0">{displayPickedJobs[0] ? displayPickedJobs[0].icon : primaryJob.icon}</span>
                    <span className="truncate">{displayPickedJobs[0] ? displayPickedJobs[0].title : primaryJob.title}</span>
                  </div>
                </div>

                {/* 5. 내가 찜한 꿈의 직업 2 (2개 이상 찜했을 때만 5번째 칸 등장, 1개만 찜하면 4개 칸만 배치) */}
                {displayPickedJobs.length >= 2 && (
                  <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs flex flex-col justify-center animate-in fade-in">
                    <span className="text-[9px] text-amber-900 font-black mb-0.5 flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                      찜한 꿈의 직업 2
                    </span>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-slate-900 truncate">
                      <span className="text-sm shrink-0">{displayPickedJobs[1].icon}</span>
                      <span className="truncate">{displayPickedJobs[1].title}</span>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* 하단 미니 QR 바로가기 배너 (세로 높이 압축) */}
            <div className="mt-2 p-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-amber-50/70 border border-indigo-200 flex items-center justify-between gap-2">
              <div className="text-left flex-1 min-w-0">
                <span className="text-[9.5px] font-black text-indigo-900 flex items-center gap-1">
                  👉 내 진로 카드 바로 열기
                </span>
                <p className="text-[8px] text-slate-500 leading-tight">
                  QR을 비추거나 공유 링크로 바로 접속하세요!
                </p>
              </div>

              {miniQrUrl && (
                <div className="bg-white p-0.5 rounded-lg shadow-2xs border border-slate-200 shrink-0">
                  <img src={miniQrUrl} alt="내일찾기 QR" className="w-7 h-7 object-contain" />
                </div>
              )}
            </div>

            {/* 초미니 Footer */}
            <div className="mt-1.5 pt-1 border-t border-slate-200 text-center">
              <p className="text-[7.5px] text-slate-400">
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
