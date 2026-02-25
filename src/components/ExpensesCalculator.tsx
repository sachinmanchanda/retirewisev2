import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Wallet, Plus, Trash2, PieChart } from 'lucide-react';

interface Props {
  onBack: () => void;
  currencySymbol: string;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
}

const DEFAULT_CATEGORIES = [
  { name: 'Rent/Mortgage', amount: 2000 },
  { name: 'Groceries', amount: 500 },
  { name: 'Utilities', amount: 200 },
  { name: 'Transport', amount: 300 },
  { name: 'Entertainment', amount: 200 },
  { name: 'Insurance', amount: 150 },
  { name: 'Children Expenses', amount: 1000 },
  { name: 'Maid', amount: 500 },
  { name: 'Travel', amount: 200 },
  { name: 'Misc', amount: 100 },
];

export const ExpensesCalculator: React.FC<Props> = ({ onBack, currencySymbol }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(
    DEFAULT_CATEGORIES.map(c => ({ id: Math.random().toString(36).substr(2, 9), category: c.name, amount: c.amount }))
  );
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalMonthly = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const totalAnnual = totalMonthly * 12;

  const addExpense = () => {
    if (newCategory && newAmount) {
      setExpenses([...expenses, { 
        id: Math.random().toString(36).substr(2, 9), 
        category: newCategory, 
        amount: parseFloat(newAmount) || 0 
      }]);
      setNewCategory('');
      setNewAmount('');
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string | number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

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
              <Wallet className="text-amber-500" />
              Expenses Calculator
            </h1>
            <p className="text-zinc-500">Understand your monthly burn rate and lifestyle costs.</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Category (e.g. Gym)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
              />
              <input 
                type="number"
                placeholder="Amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-24 bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
              />
              <button 
                onClick={addExpense}
                className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence initial={false}>
                {expenses.map((expense) => (
                  <motion.div 
                    key={expense.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl group hover:border-zinc-300 transition-all"
                  >
                    {editingId === expense.id ? (
                      <div 
                        className="flex gap-2 flex-1 mr-4"
                        onBlur={(e) => {
                          // Only close if the new focus target is outside this container
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setEditingId(null);
                          }
                        }}
                      >
                        <input 
                          autoFocus
                          type="text"
                          value={expense.category}
                          onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg py-1 px-2 outline-none text-sm focus:border-amber-500"
                        />
                        <input 
                          type="number"
                          value={expense.amount}
                          onChange={(e) => updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                          className="w-24 bg-zinc-50 border border-zinc-200 rounded-lg py-1 px-2 outline-none text-sm font-mono font-bold focus:border-amber-500"
                        />
                      </div>
                    ) : (
                      <>
                        <span 
                          onClick={() => setEditingId(expense.id)}
                          className="text-sm font-medium text-zinc-700 cursor-pointer hover:text-zinc-900"
                        >
                          {expense.category}
                        </span>
                        <div className="flex items-center gap-4">
                          <span 
                            onClick={() => setEditingId(expense.id)}
                            className="text-sm font-mono font-bold cursor-pointer hover:text-amber-600"
                          >
                            {currencySymbol}{expense.amount.toLocaleString()}
                          </span>
                          <button 
                            onClick={() => removeExpense(expense.id)}
                            className="text-zinc-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10">
          <div className="space-y-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Spending Summary</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-zinc-400 text-xs mb-1">Total Monthly Expenses</p>
                <p className="text-5xl font-light tracking-tight text-white">
                  {currencySymbol}{totalMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-800">
                <p className="text-zinc-400 text-xs mb-1">Total Annual Expenses</p>
                <p className="text-2xl font-light text-amber-400">
                  {currencySymbol}{totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-amber-400/10 rounded-2xl border border-amber-400/20 flex items-center gap-4">
            <PieChart className="text-amber-400" size={24} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Knowing your expenses is the first step to financial freedom. You need a corpus of <span className="text-amber-400 font-bold">{currencySymbol}{(totalAnnual * 25).toLocaleString()}</span> to retire (25x rule).
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
