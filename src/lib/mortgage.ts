// Mortgage estimate using the standard amortization formula:
//   M = P · r / (1 − (1 + r)^−n)
// where P is the loan amount, r the monthly rate, n the number of payments.

export const MORTGAGE_DEFAULTS = {
  downPercent: 20,
  ratePercent: 6.5,
  termYears: 30,
  insuranceRate: 0.009, // yearly home insurance as a share of price
} as const;

export type MortgageInput = {
  price: number;
  downPercent: number;
  ratePercent: number;
  termYears: number;
  taxesYearly?: number;
  hoaMonthly?: number;
};

export type MortgageBreakdown = {
  principalAndInterest: number;
  tax: number;
  hoa: number;
  insurance: number;
  total: number;
  downPayment: number;
  loan: number;
};

export function estimateMortgage({
  price,
  downPercent,
  ratePercent,
  termYears,
  taxesYearly = 0,
  hoaMonthly = 0,
}: MortgageInput): MortgageBreakdown {
  const downPayment = price * (downPercent / 100);
  const loan = Math.max(price - downPayment, 0);
  const r = ratePercent / 100 / 12;
  const n = termYears * 12;
  const principalAndInterest =
    r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  const tax = taxesYearly / 12;
  const insurance = (price * MORTGAGE_DEFAULTS.insuranceRate) / 12;
  const hoa = hoaMonthly;

  return {
    principalAndInterest,
    tax,
    hoa,
    insurance,
    total: principalAndInterest + tax + hoa + insurance,
    downPayment,
    loan,
  };
}

// Monthly estimate using the default down payment, rate, and term.
export function defaultMonthlyPayment({
  price,
  taxesYearly,
  hoaMonthly,
}: {
  price: number;
  taxesYearly?: number;
  hoaMonthly?: number;
}) {
  return estimateMortgage({
    price,
    downPercent: MORTGAGE_DEFAULTS.downPercent,
    ratePercent: MORTGAGE_DEFAULTS.ratePercent,
    termYears: MORTGAGE_DEFAULTS.termYears,
    taxesYearly,
    hoaMonthly,
  }).total;
}
