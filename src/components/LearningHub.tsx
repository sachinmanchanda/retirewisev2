import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, TrendingUp, ShieldCheck, PieChart, ChevronLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type ArticleId = 'asset-allocation' | 'compounding' | 'risk-management';

export const LearningHub: React.FC<Props> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleId | null>(null);

  // Scroll to top when selecting an article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedArticle]);

  const articles = [
    {
      id: 'asset-allocation' as ArticleId,
      title: 'Understanding Asset Allocation',
      description: 'Learn how to balance risk and reward by spreading your investments across different asset classes.',
      icon: <PieChart className="text-indigo-500" />,
      tag: 'Basics',
      content: (
        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            Asset allocation is the process of dividing your investment portfolio among different asset categories, such as stocks, bonds, and cash. It is widely considered one of the most important decisions you'll make as an investor.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h4 className="font-bold text-indigo-900 mb-2">Stocks</h4>
              <p className="text-sm text-indigo-700">High growth potential but higher volatility. Best for long-term goals.</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2">Bonds</h4>
              <p className="text-sm text-emerald-700">Steady income and lower risk. Acts as a cushion during market downturns.</p>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">Cash</h4>
              <p className="text-sm text-amber-700">Lowest risk and highly liquid. Essential for short-term needs and emergencies.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">Why it Matters</h3>
          <p className="mb-6">
            The goal of asset allocation is to minimize risk while maximizing returns based on your time horizon and risk tolerance. By diversifying across asset classes that don't move in perfect sync, you can reduce the overall volatility of your portfolio.
          </p>

          <div className="bg-zinc-900 text-white p-8 rounded-3xl mb-8">
            <h4 className="text-xl font-bold mb-4">Key Strategies</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                <p><span className="font-bold">Diversification:</span> Don't put all your eggs in one basket. Spread investments within each asset class.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                <p><span className="font-bold">Rebalancing:</span> Periodically adjust your portfolio back to your target allocation as market movements shift your weightings.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                <p><span className="font-bold">Time Horizon:</span> Your allocation should shift towards safer assets as you get closer to your retirement date.</p>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'compounding' as ArticleId,
      title: 'The Power of Compounding',
      description: 'Why starting early is the single most important factor in building long-term wealth.',
      icon: <TrendingUp className="text-emerald-500" />,
      tag: 'Strategy',
      content: (
        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            Albert Einstein famously called compounding the "eighth wonder of the world." It is the process where the value of an investment increases because the earnings on an investment earn interest as time passes.
          </p>

          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl mb-12 text-center">
            <h4 className="text-emerald-900 font-bold text-xl mb-2">The Magic Formula</h4>
            <code className="text-2xl font-mono text-emerald-600">A = P(1 + r/n)^(nt)</code>
            <p className="text-sm text-emerald-700 mt-4">Where time (t) is the exponent—making it the most powerful variable in the equation.</p>
          </div>

          <h3 className="text-2xl font-bold mb-4">Time is Your Best Friend</h3>
          <p className="mb-6">
            The longer your money stays invested, the more dramatic the growth becomes. In the early years, the growth might seem slow, but as the base amount grows, the interest earned each year becomes significantly larger than the original principal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Starting at 25</h4>
              <p className="text-sm text-zinc-500">Investing $500/month at 8% return until age 65 results in approximately <span className="font-bold text-zinc-900">$1.6 Million</span>.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-lg">Starting at 35</h4>
              <p className="text-sm text-zinc-500">Investing the same $500/month at 8% return until age 65 results in approximately <span className="font-bold text-zinc-900">$700,000</span>.</p>
            </div>
          </div>

          <p className="p-6 bg-zinc-100 rounded-2xl italic text-zinc-600">
            "The best time to plant a tree was 20 years ago. The second best time is now." — Proverb
          </p>
        </div>
      )
    },
    {
      id: 'risk-management' as ArticleId,
      title: 'Risk Management in Retirement',
      description: 'How to protect your corpus from market volatility as you approach your retirement date.',
      icon: <ShieldCheck className="text-rose-500" />,
      tag: 'Advanced',
      content: (
        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            As you approach retirement, the focus shifts from wealth accumulation to wealth preservation. Managing risk becomes critical because you no longer have a steady paycheck to offset market losses.
          </p>

          <h3 className="text-2xl font-bold mb-6">The Three Pillars of Retirement Risk</h3>
          
          <div className="space-y-6 mb-12">
            <div className="flex gap-6 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="text-rose-500" size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Sequence of Returns Risk</h4>
                <p className="text-sm text-zinc-500">The danger of experiencing poor market returns in the first few years of retirement while you are withdrawing funds.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <PieChart className="text-blue-500" size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Inflation Risk</h4>
                <p className="text-sm text-zinc-500">The risk that the rising cost of living will erode the purchasing power of your fixed retirement income over 20-30 years.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Longevity Risk</h4>
                <p className="text-sm text-zinc-500">The risk of outliving your savings. With increasing life expectancies, planning for a 30+ year retirement is essential.</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">The Bucket Strategy</h3>
          <p className="mb-8">
            One effective way to manage these risks is the Bucket Strategy. You divide your portfolio into three buckets:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Bucket 1 (0-2 Years)</span>
              <p className="text-sm font-medium mt-1">Cash & Liquid Assets for immediate expenses.</p>
            </div>
            <div className="p-4 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Bucket 2 (3-7 Years)</span>
              <p className="text-sm font-medium mt-1">Bonds & Fixed Income for medium-term stability.</p>
            </div>
            <div className="p-4 border border-zinc-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Bucket 3 (7+ Years)</span>
              <p className="text-sm font-medium mt-1">Equities for long-term growth and inflation protection.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentArticle = articles.find(a => a.id === selectedArticle);

  return (
    <div className="max-w-4xl mx-auto py-12 relative z-10">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Planner
            </button>

            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                <BookOpen className="text-indigo-500" />
                Financial Learning
              </h1>
              <p className="text-zinc-500">Master the fundamentals of wealth creation and retirement planning.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white/80 backdrop-blur-sm border border-zinc-100 rounded-3xl flex flex-col md:flex-row gap-6 items-start hover:border-zinc-300 transition-all group cursor-pointer"
                  onClick={() => setSelectedArticle(article.id)}
                >
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {article.icon}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{article.title}</h3>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-full uppercase tracking-widest">{article.tag}</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
                      {article.description}
                    </p>
                    <button className="text-xs font-bold text-zinc-900 group-hover:underline pt-2 inline-block">Read Article →</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="article"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-md border border-zinc-100 rounded-[40px] p-8 md:p-16 shadow-2xl shadow-zinc-200/50"
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-12 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Articles
            </button>

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold rounded-full uppercase tracking-widest">{currentArticle?.tag}</span>
                <span className="text-zinc-300">•</span>
                <span className="text-xs text-zinc-400 font-medium">5 min read</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                {currentArticle?.title}
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
            </div>

            {currentArticle?.content}

            <div className="mt-16 pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-white font-bold text-xs">RW</div>
                <div>
                  <p className="text-sm font-bold">RetireWise Editorial</p>
                  <p className="text-xs text-zinc-400">Financial Planning Team</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-8 py-3 bg-zinc-900 text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-all"
              >
                Finish Reading
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};