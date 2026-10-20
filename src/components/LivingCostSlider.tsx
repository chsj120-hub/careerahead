// src/components/LivingCostSlider.tsx
import React, { useState } from 'react';
import { calculateCostComparison } from '../utils/costCalculator';
import { Coins, Home, Building2, Sparkles, Building, KeyRound, ArrowUp } from 'lucide-react';

interface LivingCostSliderProps {
  initialSalary?: number;
  onBackToResult?: () => void;
}

export const LivingCostSlider: React.FC<LivingCostSliderProps> = ({
  initialSalary = 4500,
  onBackToResult
}) => {
  const [annualSalary, setAnnualSalary] = useState<number>(initialSalary);
  const costData = calculateCostComparison(annualSalary);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-indigo-200/90 shadow-xl relative overflow-hidden">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/60 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm shadow-xs flex items-center gap-1">
              <Coins className="w-4 h-4" /> 체감 경제 & 주거 격차 시뮬레이터
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
              지역별 체감 현실
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
            서울 vs 지방, 같은 월급이면 내 손에 남는 돈과 내 집 마련 격차는?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            단순히 연봉 숫자만 볼 게 아니라, 수도권과 지방의 30평 아파트 가격과 생활비 차이를 직접 비교해보세요!
          </p>
        </div>

        {/* Live Monthly Net Salary Tag & Back to Result Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-2xl text-right">
            <span className="text-[11px] text-slate-500 font-medium">예상 월 실수령액 (세후)</span>
            <p className="text-xl sm:text-2xl font-black text-indigo-700">
              월 약 {costData.monthlyNetSalary.toLocaleString()}만 원
            </p>
          </div>
          {onBackToResult && (
            <button
              type="button"
              onClick={onBackToResult}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer"
              title="내 추천 직업 결과 화면으로 바로 돌아가기"
            >
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] whitespace-nowrap">결과로 복귀</span>
            </button>
          )}
        </div>
      </div>

      {/* 🎯 [간결함 & 명확성] 학생 눈높이 2대 핵심 결론 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
            💰
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-900 block">지방에서 일할 때 매달 더 모으는 돈</span>
            <p className="text-lg sm:text-xl font-black text-emerald-700">
              월 +{(costData.province.disposable - costData.seoul.disposable).toLocaleString()}만 원 더 저축!
            </p>
            <span className="text-[11px] text-emerald-800/80">월세와 물가 절약으로 1년에 약 {((costData.province.disposable - costData.seoul.disposable) * 12).toLocaleString()}만 원 추가 축적</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-300 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
            🏡
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-900 block">30평 내 집 마련 시간 단축</span>
            <p className="text-lg sm:text-xl font-black text-indigo-700">
              {costData.housingBenchmark.yearsSaved}년 더 빠르게 내 집 마련!
            </p>
            <span className="text-[11px] text-indigo-800/80">서울 30평(11.5억) vs 지방 거점(3.8억)으로 주거 안정성 월등</span>
          </div>
        </div>
      </div>

      {/* Interactive Slider Bar */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 relative z-10">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="salary-slider" className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
            <span>목표 희망 연봉 조절:</span>
            <span className="text-indigo-600 font-extrabold text-base sm:text-lg">
              {annualSalary.toLocaleString()}만 원
            </span>
          </label>
          <div className="flex gap-1.5">
            {[3000, 5000, 8000, 12000].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setAnnualSalary(val)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  annualSalary === val
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {val >= 10000 ? `${val / 10000}억` : `${val}만`}
              </button>
            ))}
          </div>
        </div>

        <input
          id="salary-slider"
          type="range"
          min={2400}
          max={15000}
          step={100}
          value={annualSalary}
          onChange={(e) => setAnnualSalary(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
          <span>초년생 (2,400만)</span>
          <span>평균 (5,000만)</span>
          <span>고소득 (8,000만)</span>
          <span>전문직/대기업 (1억 5,000만)</span>
        </div>
      </div>

      {/* 🏢 NEW: 30평 아파트 평균 매매가 & 내 집 마련 기간 비교 인포그래픽 */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-700/40 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-indigo-800/60 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
              <Building className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                30평(84㎡) 아파트 평균 매매가 & 내 집 마련 기간 비교
              </h3>
              <p className="text-[11px] text-indigo-200/80">
                2026년 기준 대한민국 부동산 실거래 추정치 (단순 저축 기준)
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
            서울 집값 = 지방의 약 {costData.housingBenchmark.priceRatio}배
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* 서울·수도권 30평 아파트 */}
          <div className="p-4 rounded-xl bg-slate-800/90 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-400" /> 서울·수도권 30평 아파트
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-900/60 text-sky-300">
                  국민평형 (84㎡)
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300 my-1.5">
                약 {(costData.housingBenchmark.seoulAvg30PyPrice / 10000).toFixed(1)}억 원
              </div>
              <span className="text-[11px] text-slate-400">
                수도권 평균 실거래가 약 {costData.housingBenchmark.seoulAvg30PyPrice.toLocaleString()}만 원 추정
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/80 bg-slate-900/60 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                이 연봉으로 내 집 마련 소요:
              </span>
              <span className="font-black text-rose-400 text-sm">
                약 {costData.housingBenchmark.seoulYearsToBuy}년
              </span>
            </div>
          </div>

          {/* 지방 거점도시 30평 아파트 */}
          <div className="p-4 rounded-xl bg-slate-800/90 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-emerald-400" /> 지방 거점도시 30평 아파트
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300">
                  국민평형 (84㎡)
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 my-1.5">
                약 {(costData.housingBenchmark.provinceAvg30PyPrice / 10000).toFixed(1)}억 원
              </div>
              <span className="text-[11px] text-slate-400">
                지방 주요 도시 평균 실거래가 약 {costData.housingBenchmark.provinceAvg30PyPrice.toLocaleString()}만 원 추정
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/80 bg-slate-900/60 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                이 연봉으로 내 집 마련 소요:
              </span>
              <span className="font-black text-emerald-400 text-sm">
                약 {costData.housingBenchmark.provinceYearsToBuy}년
              </span>
            </div>
          </div>

        </div>

        {/* 내 집 마련 격차 한눈에 보기 배너 */}
        <div className="p-3 rounded-xl bg-indigo-900/70 border border-indigo-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🚀</span>
            <span className="text-indigo-100 font-medium">
              같은 월급이라도 지방에서 일하면 30평 내 집 마련을 <strong className="text-amber-300 font-black">{costData.housingBenchmark.yearsSaved}년</strong> 더 빠르게 이룰 수 있어요!
            </span>
          </div>
          <span className="text-[11px] text-indigo-300 font-mono shrink-0">
            아파트 가격 차이: 약 {(costData.housingBenchmark.priceDifference / 10000).toFixed(1)}억 원
          </span>
        </div>
      </div>

      {/* Comparison Infographic Grid (Seoul vs Province Monthly Expenses) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        
        {/* 1. 서울 (Seoul) */}
        <div className="rounded-2xl p-5 border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800 font-bold">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">서울 (수도권)</h3>
                  <span className="text-[11px] text-slate-500">문화·인프라 우수하나 월세와 물가 부담</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                수도권 생활비
              </span>
            </div>

            {/* Monthly Expenses Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-100/70 text-slate-600">
                <span>🏠 월세 및 관리비</span>
                <span className="font-bold text-slate-800">월 {costData.seoul.rent}만 원</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-100/70 text-slate-600">
                <span>🍚 식비 및 생필품</span>
                <span className="font-bold text-slate-800">월 {costData.seoul.living}만 원</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-100/70 text-slate-600">
                <span>🎬 교통/여가/학원비</span>
                <span className="font-bold text-slate-800">월 {costData.seoul.culture}만 원</span>
              </div>
            </div>
          </div>

          {/* Seoul Disposable */}
          <div className="mt-5 pt-4 border-t border-slate-200 bg-indigo-50/70 p-4 rounded-xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-900 block mb-1">
              💰 한 달 쓰고 통장에 남는 월 저축 가능액:
            </span>
            <div className="text-2xl font-black text-indigo-700">
              월 {costData.seoul.disposable.toLocaleString()}만 원
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              (연간 모을 수 있는 돈: 약 {(costData.seoul.disposable * 12).toLocaleString()}만 원)
            </span>
          </div>
        </div>

        {/* 2. 지방 (Province) */}
        <div className="rounded-2xl p-5 border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  <Home className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">지방 거점 및 중소도시</h3>
                  <span className="text-[11px] text-emerald-700 font-medium">안정적인 주거비 · 압도적 실질 저축력</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                저축 극대화
              </span>
            </div>

            {/* Monthly Expenses Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50/70 text-slate-600">
                <span>🏠 월세 및 관리비</span>
                <span className="font-bold text-emerald-900">월 {costData.province.rent}만 원 (서울의 절반!)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50/70 text-slate-600">
                <span>🍚 식비 및 생필품</span>
                <span className="font-bold text-slate-800">월 {costData.province.living}만 원</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50/70 text-slate-600">
                <span>🎬 교통/여가/잡비</span>
                <span className="font-bold text-slate-800">월 {costData.province.culture}만 원</span>
              </div>
            </div>
          </div>

          {/* Province Disposable */}
          <div className="mt-5 pt-4 border-t border-emerald-200 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-950 block mb-1">
              🎉 한 달 쓰고 통장에 남는 월 저축 가능액:
            </span>
            <div className="text-2xl font-black text-emerald-700 flex items-baseline gap-2">
              <span>월 {costData.province.disposable.toLocaleString()}만 원</span>
              <span className="text-xs font-bold text-emerald-600">
                (+{costData.province.disposable - costData.seoul.disposable}만 원 더 저축!)
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 block mt-1">
              (연간 모을 수 있는 돈: 약 {(costData.province.disposable * 12).toLocaleString()}만 원)
            </span>
          </div>
        </div>

      </div>

      {/* Insight Tip Box */}
      <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-900">내일찾기 진로 통찰 꿀팁: </span>
          <span>
            겉으로 보이는 명목 연봉도 중요하지만, 내가 살게 될 도시의 <strong>'30평 아파트 가격과 주거비'</strong>에 따라 통장에 쌓이는 실질 자산이 크게 달라져요. 
            울산, 여수, 포항, 당진 등 지방 거점의 고연봉 특화 직업들이 성인들에게 높은 인기를 끄는 이유도 바로 여기에 있답니다!
          </span>
        </div>
      </div>
    </div>
  );
};
