/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          primary: '#6366F1',     // 부드러운 인디고/보라
          accent: '#F59E0B',      // 황금 코인/스타
          success: '#10B981',     // 짝꿍 초록
          warning: '#FBBF24',     // 협동 노랑
          danger: '#EF4444',      // 주의 빨강
          dark: '#1E1B4B',        // RPG 배경 어두운 남색
          card: '#FFFFFF',
          lightBg: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['"SUITE"', '"SUIT"', '"Pretendard"', 'sans-serif', 'system-ui'],
      },
      boxShadow: {
        'game-card': '0 8px 24px -4px rgba(79, 70, 229, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'pixel': '0 4px 0 0 #4338CA',
        'pixel-amber': '0 4px 0 0 #D97706',
        'pixel-emerald': '0 4px 0 0 #059669',
      }
    },
  },
  plugins: [],
}
