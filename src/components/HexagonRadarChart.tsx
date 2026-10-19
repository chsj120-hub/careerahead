// src/components/HexagonRadarChart.tsx
import React from 'react';
import { HexagonStats } from '../types/career';

interface HexagonRadarChartProps {
  stats: HexagonStats;
  theme?: 'indigo' | 'white' | 'emerald' | 'sunset' | 'violet';
  size?: number; // 차트 크기 (px)
}

interface StatAxis {
  key: keyof HexagonStats;
  label: string;
  icon: string;
  color: string;
}

const AXES: StatAxis[] = [
  { key: 'creativity', label: '창의·표현', icon: '🎨', color: '#F59E0B' },     // 위 (0도 또는 -90도)
  { key: 'logic', label: '논리·탐구', icon: '🔍', color: '#38BDF8' },          // 우상단 (30도)
  { key: 'tech', label: '첨단·테크', icon: '💻', color: '#818CF8' },           // 우하단 (90도 또는 150도)
  { key: 'grit', label: '끈기·실행', icon: '🏃', color: '#34D399' },           // 하단
  { key: 'leadership', label: '도전·주도', icon: '🧭', color: '#F43F5E' },     // 좌하단
  { key: 'communication', label: '대인·소통', icon: '💖', color: '#EC4899' },  // 좌상단
];

export const HexagonRadarChart: React.FC<HexagonRadarChartProps> = ({
  stats,
  theme = 'white',
  size = 280
}) => {
  const isLight = theme === 'white';
  const center = size / 2;
  const radius = (size / 2) - 42; // 라벨 공간 확보

  // 6개 축 좌표 계산 함수 (위쪽 꼭짓점부터 시계방향 60도씩)
  const getCoordinates = (index: number, valueRatio: number) => {
    // 0번 축이 위쪽(-90도)을 향하도록 설정
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // 배경 4단계 동심 육각형 폴리곤 포인트
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map(level => {
    return Array.from({ length: 6 }).map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(' ');
  });

  // 데이터 폴리곤 좌표 계산 (최소 20점 ~ 최대 100점 -> 0.2 ~ 1.0 비율)
  const dataPoints = AXES.map((axis, i) => {
    const rawVal = stats[axis.key] || 75;
    // 0~100 스케일을 0.25~1.0 비율로 매핑
    const ratio = Math.max(0.25, Math.min(1.0, rawVal / 100));
    return getCoordinates(i, ratio);
  });

  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // 색상 테마별 스타일
  const gridStroke = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)';
  const gridFill = isLight ? '#F8FAFC' : 'rgba(15, 23, 42, 0.3)';
  const axisLineStroke = isLight ? '#CBD5E1' : 'rgba(255, 255, 255, 0.12)';
  const labelTextColor = isLight ? '#1E293B' : '#E2E8F0';
  const scoreTextColor = isLight ? '#4F46E5' : '#FDE047';
  const polygonStroke = isLight ? '#4F46E5' : '#FBBF24';

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="overflow-visible"
          aria-label="육각형 성향 능력치 차트"
        >
          <defs>
            {/* 데이터 채우기 그라데이션 */}
            <linearGradient id={`radarGrad-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={polygonStroke} stopOpacity={isLight ? 0.35 : 0.55} />
              <stop offset="100%" stopColor={isLight ? '#38BDF8' : '#818CF8'} stopOpacity={0.2} />
            </linearGradient>
            {/* 글로우 필터 */}
            <filter id={`glow-${theme}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={polygonStroke} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* 1. 배경 동심 육각형 그리드 */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill={idx === 0 ? gridFill : 'none'}
              stroke={gridStroke}
              strokeWidth="1.2"
              strokeDasharray={idx < 3 ? '2,2' : undefined}
            />
          ))}

          {/* 2. 중심에서 각 꼭짓점으로 뻗는 축 라인 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={axisLineStroke}
                strokeWidth="1"
              />
            );
          })}

          {/* 3. 데이터 폴리곤 영역 */}
          <polygon
            points={dataPolygon}
            fill={`url(#radarGrad-${theme})`}
            stroke={polygonStroke}
            strokeWidth="2.5"
            filter={`url(#glow-${theme})`}
            className="transition-all duration-700 ease-out"
          />

          {/* 4. 데이터 꼭짓점 포인트 원 */}
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill={AXES[i].color}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="transition-all duration-700 ease-out"
            />
          ))}

          {/* 5. 6개 꼭짓점 라벨 및 점수 */}
          {AXES.map((axis, i) => {
            const { x, y } = getCoordinates(i, 1.22);
            const score = stats[axis.key] || 75;
            
            return (
              <g key={axis.key} transform={`translate(${x}, ${y})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-bold text-[11px]"
                  fill={labelTextColor}
                >
                  <tspan x="0" dy="-7">{axis.icon} {axis.label}</tspan>
                  <tspan x="0" dy="14" fill={scoreTextColor} className="font-extrabold text-[12px]">
                    {score}점
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 6대 스탯 중 최고점 강점 뱃지 */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        {AXES.slice()
          .sort((a, b) => (stats[b.key] || 0) - (stats[a.key] || 0))
          .slice(0, 2)
          .map((topAxis, idx) => (
            <span
              key={topAxis.key}
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 text-[11px] shadow-xs ${
                idx === 0
                  ? isLight
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-amber-400 text-slate-950'
                  : isLight
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                    : 'bg-indigo-950 text-indigo-200 border border-indigo-700'
              }`}
            >
              <span>{idx === 0 ? '🏆 1위 강점:' : '🥈 2위 강점:'}</span>
              <span>{topAxis.icon} {topAxis.label} ({stats[topAxis.key]}점)</span>
            </span>
          ))}
      </div>
    </div>
  );
};
