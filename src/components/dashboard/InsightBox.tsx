'use client';

import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Info, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UIInsight } from '@/lib/intelligence-engine';
import { motion } from 'framer-motion';

interface InsightBoxProps {
  insight: UIInsight;
  className?: string;
}

export default function InsightBox({ insight, className }: InsightBoxProps) {
  const icons = {
    success: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    danger: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  };

  const style = icons[insight.type] || icons.info;
  const Icon = style.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-5 rounded-2xl border flex gap-5 transition-all hover:shadow-lg",
        style.bg,
        style.border,
        className
      )}
    >
      <div className={cn("p-3 rounded-xl h-fit shadow-sm", style.bg, "brightness-95")}>
        <Icon size={24} className={style.color} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-900 text-base">{insight.title}</h4>
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider",
            insight.priority === 'high' ? "bg-red-600 text-white" : 
            insight.priority === 'medium' ? "bg-amber-500 text-white" : 
            insight.priority === 'success' ? "bg-emerald-600 text-white" : "bg-slate-400 text-white"
          )}>
            Prioridad {insight.priority}
          </span>
        </div>
        
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {insight.description}
        </p>

        {/* Actionable Recommendation Box */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-900">
            <Lightbulb size={16} className="text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-tight">Recomendación Sugerida</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-3">
            {insight.action}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Impacto Estimado:</span>
              <span className="text-sm font-black text-primary">{insight.impact}</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:gap-2 transition-all">
              Ejecutar <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
