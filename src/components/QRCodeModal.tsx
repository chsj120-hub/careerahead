import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Copy, Check, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [currentUrl] = useState<string>(() => typeof window !== 'undefined' ? window.location.href : '');

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
      const url = window.location.href;
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e1b4b', // deep indigo
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      })
        .then(dataUrl => setQrDataUrl(dataUrl))
        .catch(err => console.error('Failed to generate QR code', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-indigo-500/40 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                학생 접속용 QR 코드 (교사용)
              </h3>
              <p className="text-[11px] sm:text-xs text-indigo-200">
                수업 빔프로젝터에 띄우거나 화면을 보여주세요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4 flex flex-col items-center">
          
          {/* QR Code Display Frame */}
          <div className="p-3 bg-white rounded-3xl border-4 border-indigo-100 shadow-xl inline-block transition-transform hover:scale-102">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="접속용 QR 코드" 
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-2xl mx-auto" 
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-sm">
                QR 생성 중...
              </div>
            )}
          </div>

          {/* Student Instruction Banner */}
          <div className="w-full p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs sm:text-sm">
              <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>학생 참여 방법:</span>
            </div>
            <ol className="text-xs text-indigo-900 list-decimal list-inside space-y-1 font-medium pl-1">
              <li>스마트폰 또는 태블릿의 <strong>기본 카메라</strong>를 켭니다.</li>
              <li>화면의 QR 코드를 비추면 나타나는 노란색 링크를 누릅니다.</li>
              <li>로그인 없이 바로 <strong>8단계 진로 탐색</strong>이 시작됩니다!</li>
            </ol>
          </div>

          {/* URL Copy Bar */}
          <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-xs text-slate-500 truncate flex-1 px-2 font-mono text-left">
              {currentUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0 ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> 복사됨!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> 주소 복사
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs sm:text-sm hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
