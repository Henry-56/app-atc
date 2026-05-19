'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  status?: 'good' | 'alert' | 'danger';
  suffix?: string;
  className?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, status, suffix, className }: KPICardProps) {
  const isPositive = trend && trend > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-between h-full", className)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-2.5 rounded-xl border transition-colors",
          status === 'good' ? "bg-green-50 text-green-600 border-green-100" :
          status === 'alert' ? "bg-amber-50 text-amber-600 border-amber-100" :
          status === 'danger' ? "bg-red-50 text-red-600 border-red-100" :
          "bg-slate-50 text-slate-600 border-slate-100"
        )}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {suffix && <span className="text-sm font-medium text-slate-400">{suffix}</span>}
        </div>
      </div>
    </motion.div>
  );
}
