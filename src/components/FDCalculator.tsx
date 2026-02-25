import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Landmark, TrendingUp } from 'lucide-react';

interface Props {
  onBack: () => void;
  currencySymbol: string;
}

export const FDCalculator: React.FC<Props> = ({ onBack, currencySymbol }) => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7);
  const [tenure, setTenure] = useState(5);
  const [type, setType] = useState<'fd' | 'rd'>('fd');

  const result = useMemo(() => {
    const r = rate / 100;
    const n = 4; // Quarterly compounding for FD
    const t = tenure;

    if (type === 'fd') {
      const maturity = amount * Math.pow(1 + r / n, n * t);
      return {
        maturity,
        interest: maturity - amount,
        totalInvested: amount
      };
    } else {
      // RD Formula: M = P * [ (1+i)^n - 1 ] / [ 1 - (1+i)^(-1/3) ]
      // Simplified RD: Sum of FDs for each month
      let maturity = 0;
      const monthlyRate = r / 12;
      const totalMonths = t * 12;
      
      for (let i = 1; i <= totalMonths; i++) {
        maturity += amount * Math.pow(1 + r / 4, (4 * (totalMonths - i + 1)) / 12);
      }
      
      return {
        maturity,
        interest: maturity - (amount * totalMonths),
        totalInvested: amount * totalMonths
      };
    }
  }, [amount, rate, tenure, type]);

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
              <Landmark className="text-emerald-500" />
              {type === 'fd' ? 'Fixed Deposit' : 'Recurring Deposit'}
            </h1>
            <p className="text-zinc-500">Calculate your returns on safe investments.</p>
          </div>

          <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
            <button 
              onClick={() => setType('fd')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'fd' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              Fixed Deposit
            </button>
            <button 
              onClick={() => setType('rd')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'rd' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              Recurring Deposit
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                {type === 'fd' ? 'Investment Amount' : 'Monthly Deposit'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">{currencySymbol}</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-10 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Interest Rate (% p.a.)</label>
              <input 
                type="number"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Tenure (Years)</label>
              <input 
                type="number"
                value={tenure}
                onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
          <div className="space-y-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Maturity Summary</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-xs mb-1">Maturity Amount</p>
                <p className="text-5xl font-light tracking-tight text-emerald-400">
                  {currencySymbol}{result.maturity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-800">
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Total Invested</p>
                  <p className="text-xl font-medium">
                    {currencySymbol}{result.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs mb-1">Interest Earned</p>
                  <p className="text-xl font-medium text-emerald-400">
                    +{currencySymbol}{result.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-emerald-400/10 rounded-2xl border border-emerald-400/20 flex items-center gap-4">
            <TrendingUp className="text-emerald-400" size={24} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Your wealth grows by <span className="text-emerald-400 font-bold">{((result.interest / result.totalInvested) * 100).toFixed(1)}%</span> over {tenure} years.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
