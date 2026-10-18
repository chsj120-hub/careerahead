// src/utils/costCalculator.ts

export interface CostComparison {
  annualSalary: number; // 만원 (연봉)
  monthlyNetSalary: number; // 만원 (실수령액 월)
  housingBenchmark: {
    seoulAvg30PyPrice: number;    // 만원 (서울·수도권 30평형 아파트 평균 매매 추정가: 11억 5천)
    provinceAvg30PyPrice: number; // 만원 (지방 거점도시 30평형 아파트 평균 매매 추정가: 3억 8천)
    priceDifference: number;      // 만원 (차액: 7억 7천만 원)
    priceRatio: number;           // 배율 (약 3.0배)
    seoulYearsToBuy: number;      // 서울 내 집 마련 소요 년수 (단순 저축 기준)
    provinceYearsToBuy: number;   // 지방 내 집 마련 소요 년수 (단순 저축 기준)
    yearsSaved: number;           // 지방에서 일할 때 단축되는 내 집 마련 년수
  };
  seoul: {
    rent: number;        // 주거비 (월세+관리비)
    living: number;      // 식비/생활비
    culture: number;     // 여가/학원/잡비
    disposable: number;  // 남는 여유 자금 (월 저축 가능액)
  };
  province: {
    rent: number;        // 주거비
    living: number;      // 식비/생활비
    culture: number;     // 여가/잡비
    disposable: number;  // 남는 여유 자금 (월 저축 가능액)
  };
}

export function calculateCostComparison(annualSalaryManwon: number): CostComparison {
  // 대한민국 4대보험 + 근로소득세 간이 계산 (약 10~22% 공제)
  let deductionRate = 0.11;
  if (annualSalaryManwon >= 10000) deductionRate = 0.22;
  else if (annualSalaryManwon >= 7000) deductionRate = 0.18;
  else if (annualSalaryManwon >= 4500) deductionRate = 0.14;

  const monthlyGross = annualSalaryManwon / 12;
  const monthlyNetSalary = Math.round(monthlyGross * (1 - deductionRate));

  // 서울 비용 모델 (만원)
  // 원룸/오피스텔 월세 75만 + 관리비 15만 = 90만
  const seoulRent = 85;
  const seoulLiving = Math.round(55 + (monthlyNetSalary * 0.1));
  const seoulCulture = Math.round(35 + (monthlyNetSalary * 0.05));
  const seoulTotalExpense = seoulRent + seoulLiving + seoulCulture;
  const seoulDisposable = Math.max(0, monthlyNetSalary - seoulTotalExpense);

  // 지방 거점/중소도시 비용 모델 (만원)
  // 원룸 월세 35만 + 관리비 7만 = 42만
  const provinceRent = 40;
  const provinceLiving = Math.round(40 + (monthlyNetSalary * 0.08));
  const provinceCulture = Math.round(25 + (monthlyNetSalary * 0.04));
  const provinceTotalExpense = provinceRent + provinceLiving + provinceCulture;
  const provinceDisposable = Math.max(0, monthlyNetSalary - provinceTotalExpense);

  // 2026년 기준 30평(전용 84㎡) 국민평형 아파트 평균 매매 추정가 (만원)
  const seoulAvg30PyPrice = 115000;    // 11억 5천만 원
  const provinceAvg30PyPrice = 38000;  // 3억 8천만 원
  const priceDifference = seoulAvg30PyPrice - provinceAvg30PyPrice; // 7억 7천만 원
  const priceRatio = Number((seoulAvg30PyPrice / provinceAvg30PyPrice).toFixed(1));

  // 단순 연간 저축액 기준 내 집 마련 소요 기간 (년)
  const seoulAnnualSavings = seoulDisposable * 12;
  const provinceAnnualSavings = provinceDisposable * 12;

  const seoulYearsToBuy = seoulAnnualSavings > 0 ? Math.round(seoulAvg30PyPrice / seoulAnnualSavings) : 999;
  const provinceYearsToBuy = provinceAnnualSavings > 0 ? Math.round(provinceAvg30PyPrice / provinceAnnualSavings) : 999;
  const yearsSaved = Math.max(0, seoulYearsToBuy - provinceYearsToBuy);

  return {
    annualSalary: annualSalaryManwon,
    monthlyNetSalary,
    housingBenchmark: {
      seoulAvg30PyPrice,
      provinceAvg30PyPrice,
      priceDifference,
      priceRatio,
      seoulYearsToBuy,
      provinceYearsToBuy,
      yearsSaved
    },
    seoul: {
      rent: seoulRent,
      living: seoulLiving,
      culture: seoulCulture,
      disposable: seoulDisposable
    },
    province: {
      rent: provinceRent,
      living: provinceLiving,
      culture: provinceCulture,
      disposable: provinceDisposable
    }
  };
}
