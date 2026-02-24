import React from 'react';
import { RetirementData } from '../types';
import { Calculator, Wallet, Calendar, TrendingUp, User, Layers } from 'lucide-react';

interface Props {
  data: RetirementData;
  onChange: (data: RetirementData) => void;
  currencySymbol: string;
  onShowGuide?: () => void;
}

interface InputGroupProps {
  label: string;
  name: string;
  icon: any;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
}

const InputGroup = ({ label, name, icon: Icon, value, onChange, min, max, step = 1, prefix = "" }: InputGroupProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
      <Icon size={14} className="text-zinc-400" />
      {label}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
          {prefix}
        </span>
      )}
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={`w-full bg-white border border-zinc-200 rounded-xl py-2.5 ${prefix ? 'pl-7' : 'pl-4'} pr-4 text-zinc-900 font-medium focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all outline-none text-sm`}
      />
    </div>
  </div>
);

export const RetirementForm: React.FC<Props> = ({ data, onChange, currencySymbol, onShowGuide }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'strategy') {
      onChange({ ...data, strategy: value as any });
    } else {
      onChange({ ...data, [name]: parseFloat(value) || 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Strategy Section */}
      <div className="p-6 bg-zinc-50/50 rounded-2xl border border-zinc-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Layers size={18} /> Withdrawal Strategy
          </h3>
          {onShowGuide && (
            <button 
              onClick={onShowGuide}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest flex items-center gap-1 transition-colors"
            >
              <Layers size={12} /> Compare Strategies
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Choose your strategy</label>
            <div className="flex p-1 bg-zinc-100 rounded-xl">
              <button
                onClick={() => onChange({ ...data, strategy: 'normal' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${data.strategy === 'normal' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Normal
              </button>
              <button
                onClick={() => onChange({ ...data, strategy: 'block' })}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${data.strategy === 'block' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Bucket strategy
              </button>
            </div>
          </div>
          {data.strategy === 'block' && (
            <InputGroup 
              label="Bucket Size (Years)" 
              name="blockSize" 
              icon={Layers} 
              value={data.blockSize} 
              onChange={handleChange} 
              min={1} 
              max={20} 
            />
          )}
        </div>
        {data.strategy === 'block' && (
          <p className="mt-4 text-[11px] text-zinc-500 leading-relaxed">
            <span className="font-bold text-zinc-700">Bucket Strategy:</span> Every {data.blockSize} years, a corpus is moved to Fixed Deposit (FD) to cover expenses. FD returns match inflation, while the remainder grows in Equity.
          </p>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-50/50 rounded-2xl border border-zinc-200">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <User size={18} /> Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Current Age" name="currentAge" icon={Calendar} value={data.currentAge} onChange={handleChange} min={18} max={100} />
            <InputGroup label="Retire Age" name="retirementAge" icon={Calendar} value={data.retirementAge} onChange={handleChange} min={data.currentAge} max={100} />
          </div>
          <InputGroup label="Life Expectancy" name="lifeExpectancy" icon={Calendar} value={data.lifeExpectancy} onChange={handleChange} min={data.retirementAge} max={120} />
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Wallet size={18} /> Financials
          </h3>
          <InputGroup label="Current Savings" name="currentSavings" icon={Calculator} value={data.currentSavings} onChange={handleChange} />
          <div className="space-y-1.5">
            <InputGroup label="Monthly Savings (till retirement)" name="monthlyContribution" icon={TrendingUp} value={data.monthlyContribution} onChange={handleChange} />
            <div className="flex p-1 bg-zinc-100 rounded-xl mt-2">
              <button
                type="button"
                onClick={() => onChange({ ...data, contributionType: 'fixed' })}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${data.contributionType === 'fixed' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, contributionType: 'step-up' })}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${data.contributionType === 'step-up' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                Step-up
              </button>
            </div>
            {data.contributionType === 'step-up' && (
              <div className="mt-2">
                <InputGroup 
                  label="Annual Step-up (%)" 
                  name="stepUpRate" 
                  icon={TrendingUp} 
                  value={data.stepUpRate} 
                  onChange={handleChange} 
                  step={0.1} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <TrendingUp size={18} /> Assumptions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Exp. Return (%)" name="expectedReturn" icon={TrendingUp} value={data.expectedReturn} onChange={handleChange} step={0.1} />
            <InputGroup label="Inflation (%)" name="inflationRate" icon={TrendingUp} value={data.inflationRate} onChange={handleChange} step={0.1} />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Calculator size={18} /> Retirement Needs
          </h3>
          <InputGroup label="Annual Spending" name="retirementSpending" icon={Wallet} value={data.retirementSpending} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};
