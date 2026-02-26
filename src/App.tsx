/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Page, RetirementData, ProjectionPoint, COUNTRIES, Country } from './types';
import { RetirementForm } from './components/RetirementForm';
import { RetirementChart } from './components/RetirementChart';
import { StrategyGuide } from './components/StrategyGuide';
import { CalculatorHub } from './components/CalculatorHub';
import { FDCalculator } from './components/FDCalculator';
import { EMICalculator } from './components/EMICalculator';
import { ExpensesCalculator } from './components/ExpensesCalculator';
import { SIPCalculator } from './components/SIPCalculator';
import { LearningHub } from './components/LearningHub';
import { getRetirementAdvice } from './services/gemini';
import { Sparkles, ArrowRight, Info, AlertCircle, CheckCircle2, Loader2, Table as TableIcon, TrendingUp as ChartIcon, Globe, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

const DEFAULT_DATA: RetirementData = {
  currentAge: 30,
  retirementAge: 60,
  currentSavings: 50000,
  monthlyContribution: 1000,
  contributionType: 'fixed',
  stepUpRate: 5,
  expectedReturn: 9,
  inflationRate: 5,
  monthlySpending: 5000,
  lifeExpectancy: 90,
  strategy: 'block',
  blockSize: 5,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('retirement');
  const [data, setData] = useState<RetirementData>(DEFAULT_DATA);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [view, setView] = useState<'chart' | 'table'>('chart');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, showGuide]);

  const projection = useMemo(() => {
    const points: ProjectionPoint[] = [];
    let currentBalance = data.currentSavings;
    let currentAnnualSpending = data.monthlySpending * 12;
    let currentMonthlyContribution = data.monthlyContribution;
    
    // Bucket strategy state
    let equityBalance = data.currentSavings;
    let fdCorpus = 0;
    
    const nominalReturn = data.expectedReturn / 100;
    const inflation = data.inflationRate / 100;
    const monthlyReturn = Math.pow(1 + nominalReturn, 1 / 12) - 1;
    const monthlyInflation = Math.pow(1 + inflation, 1 / 12) - 1;

    for (let age = data.currentAge; age <= data.lifeExpectancy; age++) {
      const isRetirement = age >= data.retirementAge;
      
      // Bucket Strategy: Rebalance at start of bucket
      const effectiveBlockSize = Math.max(1, data.blockSize);
      if (data.strategy === 'block' && isRetirement && (age - data.retirementAge) % effectiveBlockSize === 0) {
        const neededCorpus = currentAnnualSpending * effectiveBlockSize;
        const transfer = Math.min(equityBalance, neededCorpus);
        fdCorpus += transfer;
        equityBalance -= transfer;
      }

      points.push({
        age,
        balance: Math.max(0, data.strategy === 'block' ? (equityBalance + fdCorpus) : currentBalance),
        equity: data.strategy === 'block' ? equityBalance : currentBalance,
        debt: data.strategy === 'block' ? fdCorpus : 0,
        expenses: isRetirement ? currentAnnualSpending : 0,
        isRetirement,
      });

      // Monthly calculations
      for (let month = 0; month < 12; month++) {
        if (!isRetirement) {
          // Accumulation phase
          if (data.strategy === 'block') {
            equityBalance = (equityBalance + currentMonthlyContribution) * (1 + monthlyReturn);
          } else {
            currentBalance = (currentBalance + currentMonthlyContribution) * (1 + monthlyReturn);
          }
        } else {
          // Withdrawal phase
          const monthlyWithdrawal = currentAnnualSpending / 12;
          
          if (data.strategy === 'block') {
            // Take from FD first
            if (fdCorpus >= monthlyWithdrawal) {
              fdCorpus -= monthlyWithdrawal;
            } else {
              const remaining = monthlyWithdrawal - fdCorpus;
              fdCorpus = 0;
              equityBalance -= remaining;
            }
            
            // Growth
            equityBalance *= (1 + monthlyReturn);
            fdCorpus *= (1 + monthlyInflation); // FD return = inflation
          } else {
            currentBalance = (currentBalance - monthlyWithdrawal) * (1 + monthlyReturn);
          }
        }
      }

      // Inflate spending and contributions for the next year
      currentAnnualSpending *= (1 + inflation);
      if (data.contributionType === 'step-up') {
        currentMonthlyContribution *= (1 + data.stepUpRate / 100);
      }
    }
    return points;
  }, [data]);

  const finalBalance = useMemo(() => {
    if (projection.length === 0) return 0;
    const lastPoint = projection[projection.length - 1];
    return lastPoint.balance - lastPoint.expenses;
  }, [projection]);
  const isSuccessful = finalBalance > 0;
  const peakBalance = projection.length > 0 ? Math.max(...projection.map(p => p.balance)) : 0;

  const requiredCorpusAtRetirement = useMemo(() => {
    const yearsInRetirement = data.lifeExpectancy - data.retirementAge;
    if (yearsInRetirement <= 0) return 0;

    const inflation = data.inflationRate / 100;
    const returns = data.expectedReturn / 100;
    
    // Annual spending at the start of retirement (inflated from today)
    const initialRetirementSpending = (data.monthlySpending * 12) * Math.pow(1 + inflation, data.retirementAge - data.currentAge);
    
    // Real rate of return for the Equity portion
    const realRate = (1 + returns) / (1 + inflation) - 1;
    
    if (data.strategy === 'normal') {
      if (Math.abs(realRate) < 0.0001) {
        return initialRetirementSpending * yearsInRetirement;
      }
      return initialRetirementSpending * (1 - Math.pow(1 + realRate, -yearsInRetirement)) / (realRate / (1 + realRate));
    } else {
      // Bucket Strategy Calculation:
      // We sum the present value of each "bucket".
      // Each bucket covers 'blockSize' years.
      // Money for a bucket stays in Equity until it's needed, then moves to FD (0% real return).
      let totalCorpus = 0;
      const blockSize = Math.max(1, data.blockSize);
      
      for (let year = 0; year < yearsInRetirement; year += blockSize) {
        const currentBlockSize = Math.min(blockSize, yearsInRetirement - year);
        // The amount needed for this block (in terms of purchasing power at the start of the block)
        const blockAmountNeededAtStartOfBlock = initialRetirementSpending * currentBlockSize;
        
        // Discount this block back to the retirement date using the Equity real rate
        // The block is needed at 'year' years into retirement
        const pvOfBlock = blockAmountNeededAtStartOfBlock / Math.pow(1 + realRate, year);
        totalCorpus += pvOfBlock;
      }
      return totalCorpus;
    }
  }, [data]);

  const savingsShortfall = useMemo(() => {
    const retirementPoint = projection.find(p => p.age === data.retirementAge);
    const balanceAtRetirement = retirementPoint ? retirementPoint.balance : 0;
    return Math.max(0, requiredCorpusAtRetirement - balanceAtRetirement);
  }, [projection, requiredCorpusAtRetirement, data.retirementAge]);

  const additionalSavings = useMemo(() => {
    if (savingsShortfall <= 0) return { fixed: 0, stepUp: 0 };
    
    const yearsToRetirement = data.retirementAge - data.currentAge;
    if (yearsToRetirement <= 0) return { fixed: 0, stepUp: 0 };
    
    const annualReturn = data.expectedReturn / 100;
    const stepUpRate = data.stepUpRate / 100;
    const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
    const months = yearsToRetirement * 12;
    
    // 1. Fixed Additional Monthly Savings
    // FV = P * [ (1+r_m)^n - 1 ] / r_m
    const fixed = (savingsShortfall * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
    
    // 2. Step-up Additional Monthly Savings (increases by user's step-up rate annually)
    // Consistent formula accounting for monthly compounding within the year
    const C = (Math.pow(1 + monthlyReturn, 12) - 1) / monthlyReturn; // FV of $1/month for 12 months
    let stepUp = 0;
    if (Math.abs(annualReturn - stepUpRate) < 0.0001) {
      stepUp = savingsShortfall / (C * yearsToRetirement);
    } else {
      const numerator = savingsShortfall * (annualReturn - stepUpRate);
      const denominator = C * (Math.pow(1 + annualReturn, yearsToRetirement) - Math.pow(1 + stepUpRate, yearsToRetirement));
      stepUp = numerator / denominator;
    }
    
    return { fixed, stepUp };
  }, [savingsShortfall, data]);

  const handleGetAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      let result = await getRetirementAdvice(data, selectedCountry, requiredCorpusAtRetirement, additionalSavings);
      
      // If it failed, try one more time
      if (result.startsWith("Error:")) {
        console.log("First attempt failed, retrying...");
        result = await getRetirementAdvice(data, selectedCountry, requiredCorpusAtRetirement, additionalSavings);
      }
      
      setAdvice(result);
    } catch (err) {
      console.error("Advice generation failed:", err);
      setAdvice("Error: Failed to generate advice. Please try again later.");
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://picsum.photos/id/684/1920/1080')" }}
      />
      
      {/* Header */}
      <header className="border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('retirement')}>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <ArrowRight className="text-white -rotate-45" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">RetireWise</span>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setCurrentPage('calculators')}
                className={`text-xs font-bold transition-colors uppercase tracking-widest ${currentPage === 'calculators' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                Calculators
              </button>
              <button 
                onClick={() => setCurrentPage('learning')}
                className={`text-xs font-bold transition-colors uppercase tracking-widest ${currentPage === 'learning' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}
              >
                Learning
              </button>
            </nav>
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5">
              <Globe size={14} className="text-zinc-400" />
              <select 
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = COUNTRIES.find(c => c.code === e.target.value);
                  if (country) setSelectedCountry(country);
                }}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer pr-1"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name} ({c.currencyCode})</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleGetAdvice}
              disabled={isGeneratingAdvice}
              className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {isGeneratingAdvice ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              AI Advisor
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {showGuide ? (
            <StrategyGuide key="guide" onBack={() => setShowGuide(false)} />
          ) : currentPage === 'calculators' ? (
            <CalculatorHub key="hub" onSelect={setCurrentPage} />
          ) : currentPage === 'fd-rd' ? (
            <FDCalculator key="fd" onBack={() => setCurrentPage('calculators')} currencySymbol={selectedCountry.currencySymbol} />
          ) : currentPage === 'emi' ? (
            <EMICalculator key="emi" onBack={() => setCurrentPage('calculators')} currencySymbol={selectedCountry.currencySymbol} />
          ) : currentPage === 'expenses' ? (
            <ExpensesCalculator key="expenses" onBack={() => setCurrentPage('calculators')} currencySymbol={selectedCountry.currencySymbol} />
          ) : currentPage === 'sip' ? (
            <SIPCalculator key="sip" onBack={() => setCurrentPage('calculators')} currencySymbol={selectedCountry.currencySymbol} />
          ) : currentPage === 'learning' ? (
            <LearningHub key="learning" onBack={() => setCurrentPage('retirement')} />
          ) : (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              
              {/* Left Column: Inputs & Summary */}
              <div className="lg:col-span-5 space-y-8">
                <section>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {[
                        { name: 'FD/RD', id: 'fd-rd' },
                        { name: 'SIP', id: 'sip' },
                        { name: 'Loan EMI', id: 'emi' },
                        { name: 'Expenses', id: 'expenses' },
                        { name: 'Investments', id: 'learning' }
                      ].map((tool) => (
                        <button 
                          key={tool.id}
                          onClick={() => setCurrentPage(tool.id as Page)}
                          className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest"
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Plan your future.</h1>
                    <p className="text-zinc-500">Adjust your details to see how your retirement savings will grow over time in {selectedCountry.name}.</p>
                  </div>
                  <RetirementForm 
                    data={data} 
                    onChange={setData} 
                    currencySymbol={selectedCountry.currencySymbol} 
                    onShowGuide={() => setShowGuide(true)}
                  />
                </section>

                <section className="p-6 bg-zinc-900 text-white rounded-3xl shadow-2xl shadow-zinc-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Projection Summary</h2>
                    {isSuccessful ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-3 py-1 rounded-full">
                        <CheckCircle2 size={14} /> ON TRACK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400 text-xs font-bold bg-rose-400/10 px-3 py-1 rounded-full">
                        <AlertCircle size={14} /> SHORTFALL
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-zinc-400 text-xs mb-1">Estimated Required Corpus (at age {data.retirementAge})</p>
                      <p className="text-4xl font-light tracking-tight text-white">
                        {selectedCountry.currencySymbol}{requiredCorpusAtRetirement.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">To sustain spending until age {data.lifeExpectancy}</p>
                    </div>

                    {savingsShortfall > 0 && (
                      <div className="pt-6 border-t border-zinc-800 space-y-4">
                        <div>
                          <p className="text-rose-400 text-[10px] uppercase font-bold tracking-wider mb-1">Projected Shortfall</p>
                          <p className="text-2xl font-light text-white">
                            {selectedCountry.currencySymbol}{savingsShortfall.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Gap to be filled by additional savings</p>
                        </div>
                        
                        <div className="space-y-3 pt-2">
                          <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Ways to bridge the gap:</p>
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-zinc-500 uppercase">1. Fixed Monthly</span>
                            <p className="text-xl font-light text-emerald-400">
                              +{selectedCountry.currencySymbol}{additionalSavings.fixed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-zinc-500 uppercase">2. Step-up (+{data.stepUpRate}%/yr)</span>
                            <p className="text-xl font-light text-emerald-400">
                              +{selectedCountry.currencySymbol}{additionalSavings.stepUp.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-800">
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">Final Balance</p>
                        <p className={`text-xl font-medium ${isSuccessful ? 'text-white' : 'text-rose-400'}`}>
                          {selectedCountry.currencySymbol}{finalBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">Years Funded</p>
                        <p className="text-xl font-medium">
                          {projection.length === 0 ? '0' : isSuccessful ? (data.lifeExpectancy - data.retirementAge) : Math.max(0, projection.findIndex(p => p.balance === 0 && p.age >= data.retirementAge) - data.retirementAge + data.currentAge)} Years
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Chart & AI Advice */}
              <div className="lg:col-span-7 space-y-8">
                <section className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Wealth Projection</h2>
                    <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setView('chart')}
                        className={`p-1.5 rounded-md transition-all ${view === 'chart' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        <ChartIcon size={16} />
                      </button>
                      <button 
                        onClick={() => setView('table')}
                        className={`p-1.5 rounded-md transition-all ${view === 'table' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                      >
                        <TableIcon size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 mb-8">Nominal projection in {selectedCountry.currencyCode} including {data.inflationRate}% annual inflation</p>
                  
                  {view === 'chart' ? (
                    <RetirementChart data={projection} retirementAge={data.retirementAge} currencySymbol={selectedCountry.currencySymbol} />
                  ) : (
                    <div className="overflow-x-auto max-h-[400px] mt-8 scrollbar-hide">
                      <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white border-b border-zinc-100 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="pb-3 pr-4 text-left">Age</th>
                            <th className="pb-3 pr-4 text-left">Net Worth</th>
                            {data.strategy === 'block' && (
                              <>
                                <th className="pb-3 pr-4 text-left">Equity</th>
                                <th className="pb-3 pr-4 text-left">Debt (FD)</th>
                              </>
                            )}
                            <th className="pb-3 text-left">Annual Expenses</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {projection.map((p) => (
                            <tr key={p.age} className={p.age === data.retirementAge ? 'bg-zinc-50 font-bold' : ''}>
                              <td className="py-3 pr-4">{p.age} {p.age === data.retirementAge && '(Retire)'}</td>
                              <td className={`py-3 pr-4 font-mono ${p.balance > 0 ? 'text-zinc-900' : 'text-rose-500'}`}>
                                {selectedCountry.currencySymbol}{p.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </td>
                              {data.strategy === 'block' && (
                                <>
                                  <td className="py-3 pr-4 font-mono text-zinc-600">
                                    {selectedCountry.currencySymbol}{p.equity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </td>
                                  <td className="py-3 pr-4 font-mono text-zinc-600">
                                    {selectedCountry.currencySymbol}{p.debt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </td>
                                </>
                              )}
                              <td className="py-3 font-mono text-zinc-500">
                                {p.expenses > 0 ? `${selectedCountry.currencySymbol}${p.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <AnimatePresence>
                  {advice && (
                    <motion.section 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center">
                          <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                          <h2 className="font-bold">AI Financial Insights</h2>
                          <p className="text-xs text-zinc-500">Personalized strategy based on your data</p>
                        </div>
                      </div>
                      <div className="prose prose-zinc prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-zinc-600 prose-li:text-zinc-600">
                        <Markdown>{advice}</Markdown>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {isGeneratingAdvice && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-50 border border-zinc-200 rounded-3xl p-12 flex flex-col items-center text-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      <Loader2 className="text-zinc-900 animate-spin" size={24} />
                    </div>
                    <h3 className="font-bold mb-2">Consulting AI Advisor...</h3>
                    <p className="text-sm text-zinc-500 max-w-xs">
                      Analyzing your retirement data and crafting a personalized strategy. Please wait a moment.
                    </p>
                  </motion.div>
                )}

                {!advice && !isGeneratingAdvice && (
                  <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-3xl p-12 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                      <Info className="text-zinc-400" size={24} />
                    </div>
                    <h3 className="font-bold mb-2">Need a strategy?</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mb-6">
                      Click the AI Advisor button to get a personalized analysis of your retirement plan.
                    </p>
                    <button 
                      onClick={handleGetAdvice}
                      className="text-sm font-bold text-zinc-900 hover:underline flex items-center gap-2"
                    >
                      Generate Insights <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      <footer className="border-t border-zinc-100 py-16 mt-12 bg-zinc-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                  <ArrowRight className="text-white -rotate-45" size={16} />
                </div>
                <span className="font-bold text-lg tracking-tight">RetireWise</span>
              </div>
              <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                Empowering your retirement journey with data-driven insights and personalized financial strategies. Plan today for a secure tomorrow.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Calculators</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setCurrentPage('fd-rd')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">FD/RD Calculator</button></li>
                <li><button onClick={() => setCurrentPage('sip')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">SIP Calculator</button></li>
                <li><button onClick={() => setCurrentPage('emi')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Loan EMI Calculator</button></li>
                <li><button onClick={() => setCurrentPage('expenses')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Expenses Calculator</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-6">Learning</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setCurrentPage('learning')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Understanding Investments</button></li>
                <li><button onClick={() => setCurrentPage('learning')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Retirement Basics</button></li>
                <li><button onClick={() => setCurrentPage('learning')} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Tax Planning</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
              © 2024 RetireWise. All rights reserved.
            </p>
            <p className="text-[10px] text-zinc-400 text-center md:text-right max-w-md leading-relaxed">
              Estimates provided for informational purposes only. Actual results vary based on market performance and taxes. Consult a professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}