import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Calendar, Wallet, TrendingUp, Calculator, Info, AlertCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  currencySymbol: string;
}

export const GoalCalculator: React.FC<Props> = ({ onBack, currencySymbol }) => {
  const [goalName, setGoalName] = useState("Child's Graduation");
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [yearsToGoal, setYearsToGoal] = useState(15);
  const [currentCost, setCurrentCost] = useState(500000);
  const [currentSavings, setCurrentSavings] = useState(20000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflationRate, setInflationRate] = useState(7);

  const results = useMemo(() => {
    const goalAge = currentAge + yearsToGoal;
    if (yearsToGoal < 0) return null;

    // 1. Future Cost of Goal (Inflation Adjusted)
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToGoal);

    // 2. Future Value of Current Savings
    const fvSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToGoal);

    // 3. Future Value of Monthly Contributions
    // Contributions stop at retirement or goal age, whichever is earlier
    const contributionYears = Math.min(goalAge, retirementAge) - currentAge;
    const months = Math.max(0, contributionYears * 12);
    const monthlyRate = expectedReturn / 100 / 12;
    
    let fvContributions = 0;
    if (months > 0) {
      fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      
      // If goal is after retirement, the accumulated contribution corpus continues to grow until goal age
      const gapYears = Math.max(0, goalAge - retirementAge);
      if (gapYears > 0) {
        fvContributions *= Math.pow(1 + expectedReturn / 100, gapYears);
      }
    }

    const totalEstimatedCorpus = fvSavings + fvContributions;
    const shortfall = Math.max(0, futureCost - totalEstimatedCorpus);
    const isAchievable = totalEstimatedCorpus >= futureCost;

    // 4. Required Monthly Contribution (if shortfall exists)
    // How much more monthly is needed from today until retirement/goal age?
    let additionalMonthlyNeeded = 0;
    let additionalLumpSumNeeded = 0;

    if (shortfall > 0) {
        // Additional Monthly
        if (months > 0) {
            const gapYears = Math.max(0, goalAge - retirementAge);
            const requiredAtEndofContribution = shortfall / Math.pow(1 + expectedReturn / 100, gapYears);
            additionalMonthlyNeeded = requiredAtEndofContribution / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
        }

        // Additional Lump Sum Today
        // PV = FV / (1 + r)^n
        additionalLumpSumNeeded = shortfall / Math.pow(1 + expectedReturn / 100, yearsToGoal);
    }

    return {
      futureCost,
      totalEstimatedCorpus,
      shortfall,
      isAchievable,
      additionalMonthlyNeeded,
      additionalLumpSumNeeded,
      yearsToGoal,
      goalAge
    };
  }, [currentAge, retirementAge, yearsToGoal, currentCost, currentSavings, monthlyContribution, expectedReturn, inflationRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencySymbol === '₹' ? 'INR' : 'USD',
      maximumFractionDigits: 0,
    }).format(val).replace('INR', '₹');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 relative z-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Calculators
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
          <Target className="text-indigo-500" />
          Goal Based Planner
        </h1>
        <p className="text-zinc-500">Calculate exactly what you need to achieve your life's milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <section className="p-8 bg-white/80 backdrop-blur-sm border border-zinc-100 rounded-[32px] shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> Goal Name
                </label>
                <input 
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  placeholder="e.g. Child's Education"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Current Age
                  </label>
                  <input 
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Years to reach Goal
                  </label>
                  <input 
                    type="number"
                    value={yearsToGoal}
                    onChange={(e) => setYearsToGoal(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                  <p className="text-[10px] text-zinc-400 italic">Target Age: {currentAge + yearsToGoal}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Retirement Age
                </label>
                <input 
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                />
                <p className="text-[10px] text-zinc-400 italic">Monthly contributions are assumed to stop at this age or goal year, whichever is earlier.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Wallet size={14} /> Current Cost of Goal ({currencySymbol})
                </label>
                <input 
                  type="number"
                  value={currentCost}
                  onChange={(e) => setCurrentCost(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} /> Current Savings
                  </label>
                  <input 
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} /> Monthly Saving
                  </label>
                  <input 
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} /> Exp. Return (%)
                </label>
                <input 
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} /> Inflation (%)
                </label>
                <input 
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          {results ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <section className="p-8 bg-zinc-900 text-white rounded-[32px] shadow-2xl shadow-zinc-200">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">Goal Projection</h2>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">Future Cost of {goalName}</p>
                    <p className="text-4xl font-bold tracking-tight">{formatCurrency(results.futureCost)}</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Adjusted for {inflationRate}% inflation over {results.yearsToGoal} years.</p>
                  </div>

                  <div className="h-px bg-zinc-800"></div>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <p className="text-xs text-zinc-400 mb-1">Estimated Corpus</p>
                      <p className="text-2xl font-bold">{formatCurrency(results.totalEstimatedCorpus)}</p>
                    </div>
                    
                    {results.shortfall > 0 ? (
                      <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                        <div className="flex items-center gap-2 text-rose-400 mb-2">
                          <AlertCircle size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Shortfall Detected</span>
                        </div>
                        <p className="text-xl font-bold text-rose-100">{formatCurrency(results.shortfall)}</p>
                        <div className="mt-4 space-y-3">
                          <p className="text-[11px] text-rose-300/70 leading-relaxed">
                            To bridge this gap, you can either:
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                              <p className="text-[10px] text-rose-300 uppercase tracking-wider mb-1">Invest Extra Monthly</p>
                              <p className="text-sm font-bold text-white">+{formatCurrency(results.additionalMonthlyNeeded)}</p>
                            </div>
                            <div className="flex items-center gap-3 py-1">
                              <div className="h-px flex-1 bg-white/10"></div>
                              <span className="text-[10px] font-bold text-rose-300/40 uppercase tracking-widest">OR</span>
                              <div className="h-px flex-1 bg-white/10"></div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                              <p className="text-[10px] text-rose-300 uppercase tracking-wider mb-1">Add Lump Sum Today</p>
                              <p className="text-sm font-bold text-white">{formatCurrency(results.additionalLumpSumNeeded)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <Target size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">On Track</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-100">Surplus: {formatCurrency(results.totalEstimatedCorpus - results.futureCost)}</p>
                        <p className="text-[11px] text-emerald-300/70 mt-3 leading-relaxed">
                          Your current plan is sufficient to achieve this goal!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="p-6 bg-white border border-zinc-100 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Info className="text-indigo-500" size={16} />
                  </div>
                  <h3 className="font-bold text-sm">Planning Insight</h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  This calculation assumes your monthly contributions will continue until you reach age {Math.min(results.goalAge, retirementAge)}. If the goal is achieved after retirement, your accumulated corpus continues to grow at {expectedReturn}% annually.
                </p>
              </section>
            </motion.div>
          ) : (
            <div className="p-12 bg-zinc-50 border border-dashed border-zinc-200 rounded-[32px] flex flex-col items-center text-center">
              <Calculator className="text-zinc-300 mb-4" size={48} />
              <p className="text-sm text-zinc-500">Enter your goal details to see the projection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
