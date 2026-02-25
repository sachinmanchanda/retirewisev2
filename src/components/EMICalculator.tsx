import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, PieChart } from 'lucide-react';

interface Props {
  onBack: () => void;
  currencySymbol: string;
}

export const EMICalculator: React.FC<Props> = ({ onBack, currencySymbol }) => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    
    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    return {
      emi,
      totalPayment,
      totalInterest,
      interestRatio: (totalInterest / totalPayment) * 100
    };
  }, [loanAmount, rate, tenure]);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Calculators
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <CreditCard className="text-rose-500" />
              EMI Calculator
            </h1>
            <p className="text-zinc-500">Plan your home, car, or personal loans.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">{currencySymbol}</span>
                <input 
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-10 pr-4 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Interest Rate (% p.a.)</label>
              <input 
                type="number"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Tenure (Years)</label>
              <input 
                type="number"
                value={tenure}
                onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
              />
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-rose-500/10">
          <div className="space-y-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Repayment Summary</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-xs mb-1">Monthly EMI</p>
                <p className="text-5xl font-light tracking-tight text-white">
                  {currencySymbol}{result.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-800">
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Total Interest</p>
                  <p className="text-xl font-medium text-rose-400">
                    {currencySymbol}{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Total Payment</p>
                  <p className="text-xl font-medium">
                    {currencySymbol}{result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-rose-400/10 rounded-2xl border border-rose-400/20 flex items-center gap-4">
            <PieChart className="text-rose-400" size={24} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Interest makes up <span className="text-rose-400 font-bold">{result.interestRatio.toFixed(1)}%</span> of your total repayment.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
