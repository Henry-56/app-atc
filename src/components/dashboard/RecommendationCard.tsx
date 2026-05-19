'use client';

import React from 'react';
import { Target, Zap, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Insight } from '@/lib/intelligence-engine';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  insight: Insight;
  index: number;
}

export default function RecommendationCard({ insight, index }: RecommendationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white p-5 rounded-2xl border border-slate-100 card-shadow hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Zap size={20} />
          </div>
          <h4 className="font-bold text-slate-900 leading-tight">{insight.action}</h4>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
          insight.priority === 'high' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
        )}>
          {insight.priority}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
            <Target size={14} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Impacto</p>
            <p className="text-xs font-bold text-slate-700">{insight.impact}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
            <Clock size={14} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Esfuerzo</p>
            <p className="text-xs font-bold text-slate-700">Medio</p>
          </div>
        </div>
      </div>

      <button className="w-full mt-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        Implementar Acción
      </button>
    </motion.div>
  );
}
