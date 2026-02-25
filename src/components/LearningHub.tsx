import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const LearningHub: React.FC<Props> = ({ onBack }) => {
  const articles = [
    {
      title: 'Understanding Asset Allocation',
      description: 'Learn how to balance risk and reward by spreading your investments across different asset classes.',
      icon: <PieChart className="text-indigo-500" />,
      tag: 'Basics'
    },
    {
      title: 'The Power of Compounding',
      description: 'Why starting early is the single most important factor in building long-term wealth.',
      icon: <TrendingUp className="text-emerald-500" />,
      tag: 'Strategy'
    },
    {
      title: 'Risk Management in Retirement',
      description: 'How to protect your corpus from market volatility as you approach your retirement date.',
      icon: <ShieldCheck className="text-rose-500" />,
      tag: 'Advanced'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
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
            className="p-8 bg-white border border-zinc-100 rounded-3xl flex flex-col md:flex-row gap-6 items-start hover:border-zinc-300 transition-all"
          >
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0">
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
              <button className="text-xs font-bold text-zinc-900 hover:underline pt-2 inline-block">Read Article →</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
