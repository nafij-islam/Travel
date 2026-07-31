'use client';

import React from 'react';
import { ExpenseItem } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet } from 'lucide-react';

interface ExpenseChartProps {
  expenses: ExpenseItem[];
  totalCost: number;
  costPerPerson: number;
  travelerCount: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#5C55E1',
  accommodation: '#7BBBFF',
  food: '#C9A37C',
  activities: '#9ED454',
  tickets: '#3B3398',
  shopping: '#E2C7A8',
  guide: '#BCF5FF',
  other: '#64748B',
};

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  expenses,
  totalCost,
  costPerPerson,
  travelerCount,
}) => {
  const categoryMap: Record<string, number> = {};
  expenses.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });

  const chartData = Object.entries(categoryMap).map(([cat, amount]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: amount,
    color: CATEGORY_COLORS[cat] || '#64748B',
  }));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-purple" />
            <span>Complete Expense Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed itemized breakdown for {travelerCount} travelers.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-brand-cyan/30 px-4 py-2 rounded-2xl border border-brand-cyan">
          <div>
            <div className="text-[10px] uppercase font-bold text-brand-purple">Cost Per Person</div>
            <div className="text-base font-black text-navy-900">৳{costPerPerson.toLocaleString()}</div>
          </div>
          <div className="h-8 w-px bg-brand-sky/40" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Group Total</div>
            <div className="text-base font-black text-brand-sand">৳{totalCost.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Recharts Pie Chart */}
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Itemized Log</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-brand-cyan/20 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#64748B' }}
                  />
                  <div>
                    <div className="font-bold text-slate-800">{item.description}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{item.category} ({item.quantity}x)</div>
                  </div>
                </div>
                <div className="font-extrabold text-navy-900">৳{item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
