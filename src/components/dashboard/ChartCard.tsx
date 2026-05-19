'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("bg-white p-6 rounded-2xl border border-slate-100 card-shadow", className)}
    >
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </motion.div>
  );
}
