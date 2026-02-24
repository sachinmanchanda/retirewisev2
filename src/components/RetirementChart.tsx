import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ProjectionPoint } from '../types';

interface Props {
  data: ProjectionPoint[];
  retirementAge: number;
  currencySymbol: string;
}

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl border border-zinc-800 text-xs">
        <p className="font-bold mb-1">Age {label}</p>
        <p className="text-zinc-400">
          Balance: <span className="text-white font-mono">{currencySymbol}{payload[0].value.toLocaleString()}</span>
        </p>
        {data.equity !== undefined && data.debt !== undefined && data.debt > 0 && (
          <>
            <p className="text-zinc-400">
              Equity: <span className="text-emerald-400 font-mono">{currencySymbol}{data.equity.toLocaleString()}</span>
            </p>
            <p className="text-zinc-400">
              Debt (FD): <span className="text-amber-400 font-mono">{currencySymbol}{data.debt.toLocaleString()}</span>
            </p>
          </>
        )}
        {data.expenses > 0 && (
          <p className="text-zinc-400">
            Expenses: <span className="text-rose-400 font-mono">{currencySymbol}{data.expenses.toLocaleString()}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const RetirementChart: React.FC<Props> = ({ data, retirementAge, currencySymbol }) => {
  return (
    <div className="h-[400px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis 
            dataKey="age" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12 }}
            tickFormatter={(value) => `${currencySymbol}${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />
          <ReferenceLine 
            x={retirementAge} 
            stroke="#18181b" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Retirement', 
              position: 'insideTopRight', 
              fill: '#18181b', 
              fontSize: 10, 
              fontWeight: 'bold',
              offset: 10
            }} 
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Net Worth"
            stroke="#18181b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Annual Expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
