import React from 'react';
import { motion } from 'motion/react';
import { Landmark, CreditCard, Wallet, ArrowRight, Calculator } from 'lucide-react';
import { Page } from '../types';

interface Props {
  onSelect: (page: Page) => void;
}

export const CalculatorHub: React.FC<Props> = ({ onSelect }) => {
  const calculators = [
    {
      id: 'retirement' as Page,
      title: 'Retirement Planner',
      description: 'Calculate how much you need to save for a comfortable retirement.',
      icon: <Calculator className="text-indigo-500" size={24} />,
      color: 'bg-indigo-50'
    },
    {
      id: 'fd-rd' as Page,
      title: 'FD/RD Calculator',
      description: 'Estimate returns on your Fixed Deposits and Recurring Deposits.',
      icon: <Landmark className="text-emerald-500" size={24} />,
      color: 'bg-emerald-50'
    },
    {
      id: 'emi' as Page,
      title: 'Loan EMI Calculator',
      description: 'Plan your loans by calculating monthly installments and interest.',
      icon: <CreditCard className="text-rose-500" size={24} />,
      color: 'bg-rose-50'
    },
    {
      id: 'expenses' as Page,
      title: 'Expenses Calculator',
      description: 'Track and categorize your monthly spending to find saving opportunities.',
      icon: <Wallet className="text-amber-500" size={24} />,
      color: 'bg-amber-50'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Financial Calculators</h1>
        <p className="text-zinc-500">Choose a tool to help you manage your finances and plan for the future.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calc, index) => (
          <motion.button
            key={calc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(calc.id)}
            className="flex items-start gap-6 p-8 bg-white border border-zinc-100 rounded-3xl text-left hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/50 transition-all group"
          >
            <div className={`w-14 h-14 ${calc.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              {calc.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {calc.title}
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {calc.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
