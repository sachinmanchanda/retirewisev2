import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  currencySymbol: string;
}

export const SIPCalculator: React.FC<Props> = ({ onBack, currencySymbol }) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenure, setTenure] = useState(10);
  const [stepUp, setStepUp] = useState(10);
  const [isStepUp, setIsStepUp] = useState(false);

  const result = useMemo(() => {
    const r = expectedReturn / 100 / 12;
    const months = tenure * 12;
    
    let totalInvested = 0;
    let maturityValue = 0;
    let currentMonthly = monthlyInvestment;

    for (let m = 1; m <= months; m++) {
      // If step-up is enabled, increase monthly investment every 12 months (starting from month 13)
      if (isStepUp && m > 1 && (m - 1) % 12 === 0) {
        currentMonthly = currentMonthly * (1 + stepUp / 100);
      }
      
      totalInvested += currentMonthly;
      // Each monthly installment grows until the end of the tenure
      const monthsRemaining = months - m + 1;
      maturityValue += currentMonthly * Math.pow(1 + r, monthsRemaining);
    }

    return {
      maturityValue,
      totalInvested,
      wealthGained: maturityValue - totalInvested
    };
  }, [monthlyInvestment, expectedReturn, tenure, stepUp, isStepUp]);

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
              <TrendingUp className="text-indigo-500" />
              SIP Calculator
            </h1>
            <p className="text-zinc-500">Calculate the future value of your monthly investments.</p>
          </div>

          <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
            <button 
              onClick={() => setIsStepUp(false)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isStepUp ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              Regular SIP
            </button>
            <button 
              onClick={() => setIsStepUp(true)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isStepUp ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              Step-up SIP
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Monthly Investment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">{currencySymbol}</span>
                <input 
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {isStepUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Annual Step-up (%)</label>
                <input 
                  type="number"
                  value={stepUp}
                  onChange={(e) => setStepUp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Expected Return Rate (% p.a.)</label>
              <input 
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Tenure (Years)</label>
              <input 
                type="number"
                value={tenure}
                onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/10">
          <div className="space-y-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Wealth Projection</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-xs mb-1">Estimated Returns</p>
                <p className="text-5xl font-light tracking-tight text-indigo-400">
                  {currencySymbol}{result.maturityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                  <p className="text-zinc-400 text-xs mb-1">Wealth Gained</p>
                  <p className="text-xl font-medium text-indigo-400">
                    +{currencySymbol}{result.wealthGained.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-indigo-400/10 rounded-2xl border border-indigo-400/20 flex items-center gap-4">
            <Sparkles className="text-indigo-400" size={24} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              By investing {currencySymbol}{monthlyInvestment.toLocaleString()} monthly, you could build a corpus of <span className="text-indigo-400 font-bold">{currencySymbol}{result.maturityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> in {tenure} years.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
