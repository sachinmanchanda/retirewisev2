export interface Country {
  name: string;
  code: string;
  currencySymbol: string;
  currencyCode: string;
}

export const COUNTRIES: Country[] = [
  { name: 'USA', code: 'US', currencySymbol: '$', currencyCode: 'USD' },
  { name: 'India', code: 'IN', currencySymbol: '₹', currencyCode: 'INR' },
  { name: 'Australia', code: 'AU', currencySymbol: '$', currencyCode: 'AUD' },
  { name: 'Canada', code: 'CA', currencySymbol: '$', currencyCode: 'CAD' },
];

export type RetirementStrategy = 'normal' | 'block';

export type ContributionType = 'fixed' | 'step-up';

export interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  contributionType: ContributionType;
  stepUpRate: number;
  expectedReturn: number;
  inflationRate: number;
  retirementSpending: number;
  lifeExpectancy: number;
  strategy: RetirementStrategy;
  blockSize: number;
}

export interface ProjectionPoint {
  age: number;
  balance: number;
  equity: number;
  debt: number;
  expenses: number;
  isRetirement: boolean;
}

export interface AIAdvice {
  summary: string;
  recommendations: string[];
  riskAssessment: string;
}
