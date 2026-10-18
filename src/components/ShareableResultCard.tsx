import React, { useRef, useState, useEffect } from 'react';
import { CharacterProfile, Job } from '../types/career';
import { toPng, toBlob } from 'html-to-image';
import QRCode from 'qrcode';
import { 
  Download, 
  Share2, 
  X, 
  Sparkles, 
  DollarSign, 
  Bot, 
  Footprints, 
  Award, 
  Heart 
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

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const origin = window.location.origin;
      QRCode.toDataURL(origin, {
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
  }, [isOpen]);

  if (!isOpen) return null;

  // 1장 이미지 다운로드 함수
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#0F172A'
      });
      const link = document.createElement('a');
      link.download = `내일찾기_진로카드_${profile.code}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('이미지 생성 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  // 카카오톡 및 모바일 SNS 이미지/링크 공유
  const handleKakaoShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    const shareUrl = window.location.origin;
    const primaryJobTitle = pickedJobs[0]?.title || profile.recommendedJobs[0]?.title || '다양한 미래 직업';
    const textMsg = `🌟 [내일찾기] 나의 미래 성향 캐릭터는 "${profile.title} (${profile.code})" 입니다!\n🎯 나의 찜한 직업: ${primaryJobTitle}\n\n친구야, 너도 8개 퀘스트 풀고 너만의 캐릭터와 미래 직업 찾아봐!\n👉 바로가기: ${shareUrl}`;

    try {
      // 이미지 Blob 생성
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#0F172A'
      });

      // Web Share API로 이미지 파일 직접 공유 시도 (모바일 카카오톡, 인스타 등)
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'my_career_card.png', { type: 'image/png' })] })) {
        const file = new File([blob], `내일찾기_진로카드_${profile.code}.png`, { type: 'image/png' });
        await navigator.share({
          title: `[내일찾기] 나의 진로 캐릭터: ${profile.title}`,
          text: textMsg,
          url: shareUrl,
          files: [file]
        });
      } else if (navigator.share) {
        // 이미지 파일 전송 불가 브라우저의 경우 URL 및 텍스트 공유
        await navigator.share({
          title: `[내일찾기] 나의 진로 캐릭터: ${profile.title}`,
          text: textMsg,
          url: shareUrl
        });
      } else {
        // PC 또는 클립보드 폴백: 카드 자동 다운로드 + 텍스트 복사
        await handleDownloadImage();
        await navigator.clipboard.writeText(textMsg);
        alert('🎉 멋진 진로 카드 이미지가 다운로드되었고, 공유용 링크가 복사되었습니다!\n카카오톡 대화창에 붙여넣기(Ctrl+V)하여 친구에게 보내보세요!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        navigator.clipboard.writeText(textMsg);
        alert('공유 링크가 클립보드에 복사되었습니다! 카카오톡에 붙여넣어 친구에게 보내보세요.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // 대표 픽 직업 (1~2개)
  const primaryJob = pickedJobs[0] || profile.recommendedJobs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border-4 border-indigo-500/40 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-xs sm:text-sm">모바일 1장 진로 공유 카드</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable View Area (Containing the Exportable Card) */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 flex justify-center bg-slate-950">
          
          {/* THE 1-PAGE EXPORTABLE CARD CONTAINER */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden"
          >
            {/* Watermark / Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-indigo-700/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  내일찾기 CareerPath Finder
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-800 text-indigo-200 font-mono">
                  2026 V5
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold">
                공공 진로 데이터 공식 연계
              </span>
            </div>

            {/* 1. Character Identity Title & Avatar */}
            <div className="text-center py-1 sm:py-2">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-400 p-0.5 shadow-xl shadow-indigo-950 mb-3">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-4xl">
                  <span>{profile.avatar}</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs mb-1.5 shadow">
                <Award className="w-3.5 h-3.5" /> Lv.{profile.level} {profile.code}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {profile.title}
              </h2>

              <p className="text-xs text-indigo-200 mt-1 px-2 sm:px-4 leading-relaxed line-clamp-2">
                {profile.description}
              </p>
            </div>

            {/* 2. My Picked Dream Jobs */}
            <div className="mt-3.5 p-3.5 rounded-2xl bg-indigo-900/60 border border-indigo-500/40">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-2">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  내가 찜한 꿈의 직업 (Dream Pick)
                </span>
                <span className="text-[10px] text-indigo-300">
                  {pickedJobs.length > 0 ? `${pickedJobs.length}개 선택` : '맞춤 추천'}
                </span>
              </div>

              <div className="space-y-2">
                {pickedJobs.length > 0 ? (
                  pickedJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{job.icon}</span>
                        <div>
                          <span className="font-bold text-xs text-white">{job.title}</span>
                          <span className="text-[10px] text-indigo-300 block truncate max-w-[140px] sm:max-w-[180px]">
                            {job.summary}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-amber-400 shrink-0">
                        연 {job.moneyTruth.entrySalary.toLocaleString()}만~
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{primaryJob?.icon}</span>
                      <div>
                        <span className="font-bold text-xs text-white">{primaryJob?.title}</span>
                        <span className="text-[10px] text-indigo-300 block truncate max-w-[140px] sm:max-w-[180px]">
                          {primaryJob?.summary}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400 shrink-0">
                      연 {primaryJob?.moneyTruth.entrySalary.toLocaleString()}만~
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Primary Job Mini Infographic Badges */}
            {primaryJob && (
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 mb-0.5">
                    <DollarSign className="w-3 h-3 text-amber-400" /> 초임 연봉
                  </div>
                  <span className="font-black text-amber-300 text-xs block">
                    {primaryJob.moneyTruth.entrySalary.toLocaleString()}만
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 mb-0.5">
                    <Bot className="w-3 h-3" /> 미래 유망도
                  </div>
                  <span className="font-bold text-white text-[11px] block truncate">
                    {primaryJob.aiTrafficLight.statusText.split(' ')[0]}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/70 border border-slate-700">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-indigo-300 mb-0.5">
                    <Footprints className="w-3 h-3 text-amber-400" /> 준비 걸음
                  </div>
                  <span className="font-bold text-white text-[11px] block truncate">
                    {primaryJob.prepPeriod.stepBadge.split('(')[0]}
                  </span>
                </div>
              </div>
            )}

            {/* 4. 친구 초대 및 바로가기 QR 코드 배너 (공유 시 즉시 접속 유도) */}
            <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-900/90 border border-indigo-500/50 flex items-center justify-between gap-3">
              <div className="text-left flex-1 min-w-0">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  👉 나도 내일찾기에서 진로 찾아보기!
                </span>
                <p className="text-[10px] text-indigo-200 mt-0.5 leading-tight">
                  스마트폰 카메라로 QR 코드를 비추면 3분 만에 내 미래 직업과 연봉을 찾을 수 있어요!
                </p>
                <span className="text-[9px] text-slate-400 font-mono mt-1 block truncate">
                  🔗 {typeof window !== 'undefined' ? window.location.origin : '내일찾기 플랫폼'}
                </span>
              </div>

              {miniQrUrl && (
                <div className="bg-white p-1 rounded-xl shadow-lg border border-white/40 shrink-0">
                  <img src={miniQrUrl} alt="내일찾기 QR" className="w-12 h-12 object-contain" />
                </div>
              )}
            </div>

            {/* 5. Footer */}
            <div className="mt-3 pt-2.5 border-t border-indigo-800/60 text-center">
              <p className="text-[9px] text-slate-400">
                © 2026 내일찾기 (CareerPath Finder) · 한국고용정보원 데이터 기반
              </p>
            </div>
          </div>

        </div>

        {/* Action Buttons Footer (Mobile Friendly Touch Targets) */}
        <div className="p-3.5 sm:p-4 bg-slate-800/90 border-t border-slate-700 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm hover:bg-indigo-500 transition-colors shadow-md active:scale-95 disabled:opacity-50 min-h-[48px]"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '카드 굽는 중...' : '1장 이미지 저장'}</span>
          </button>

          <button
            onClick={handleKakaoShare}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm hover:bg-amber-300 transition-colors shadow-md active:scale-95 min-h-[48px]"
          >
            <Share2 className="w-4 h-4" />
            <span>카톡 / SNS 공유 🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
};
