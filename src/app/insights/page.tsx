'use client';

import React from 'react';
import { 
  Lightbulb, 
  Search, 
  ArrowRight, 
  BrainCircuit, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useData } from '@/context/data-store';
import { cn } from '@/lib/utils';
import InsightBox from '@/components/dashboard/InsightBox';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  const { uiInsights, metrics, timeRange, setTimeRange } = useData();

  const successInsights = uiInsights.filter(i => i.type === 'success' || i.type === 'info');
  const criticalInsights = uiInsights.filter(i => i.type === 'danger' || i.type === 'warning');

  const ranges: { id: typeof timeRange, label: string }[] = [
    { id: 'today', label: 'Hoy' },
    { id: 'lastMonth', label: 'Mes Pasado' },
    { id: '3months', label: 'Últimos 3 Meses' },
    { id: 'year', label: 'Último Año' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BrainCircuit className="text-primary" />
            Diagnóstico Inteligente
          </h2>
          <p className="text-slate-500">Análisis automático de patrones y cuellos de botella.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                timeRange === r.id 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="hidden xl:flex bg-white px-4 py-2 rounded-xl border border-slate-200 items-center gap-2 text-sm font-medium">
          <Activity size={16} className="text-emerald-500" />
          IA Engine v2.4 Activo
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Insights List */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              Problemas Detectados ({criticalInsights.length})
            </h3>
            <div className="space-y-4">
              {criticalInsights.map((insight, i) => (
                <InsightBox key={i} insight={insight} className="bg-white border-slate-100 card-shadow" />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-emerald-500" />
              Fortalezas y Oportunidades
            </h3>
            <div className="space-y-4">
              {successInsights.length > 0 ? (
                successInsights.map((insight, i) => (
                  <InsightBox key={i} insight={insight} className="bg-white border-slate-100 card-shadow" />
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-500 italic">No se detectan fortalezas críticas en este momento. Enfócate en las recomendaciones de mejora.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Intelligence Summary */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow">
            <h3 className="font-bold text-slate-900 mb-6">Resumen de Diagnóstico</h3>
            <div className="space-y-6">
              {[
                { 
                  label: 'Salud de Atracción', 
                  score: Math.min(100, Math.round(((metrics.current.entries / metrics.current.traffic) * 100) / 0.2)), 
                  color: (metrics.current.entries / metrics.current.traffic) * 100 < 15 ? 'bg-red-500' : 'bg-emerald-500'
                },
                { 
                  label: 'Efectividad de Venta', 
                  score: Math.min(100, Math.round(((metrics.current.sales / metrics.current.entries) * 100) / 0.2)), 
                  color: (metrics.current.sales / metrics.current.entries) * 100 < 12 ? 'bg-red-500' : 'bg-emerald-500'
                },
                { 
                  label: 'Experiencia en Tienda', 
                  score: Math.max(0, Math.min(100, 100 - Math.round((metrics.current.avgTime - 15) * 4))), 
                  color: metrics.current.avgTime > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                },
                { 
                  label: 'Retención de Tráfico', 
                  score: Math.min(100, Math.round((metrics.current.traffic / metrics.historicalAvg.traffic) * 50)), 
                  color: metrics.current.traffic < metrics.historicalAvg.traffic ? 'bg-amber-500' : 'bg-emerald-500'
                },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-slate-900">{item.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              <Lightbulb size={18} />
              Sabías que...
            </h4>
            <p className="text-sm text-primary/80 leading-relaxed italic">
              "El 70% de tus ventas ocurren cuando el cliente pasa más de 12 minutos en la sección de calzado. Optimizar la iluminación ahí podría subir la conversión un 8% adicional."
            </p>
            <button className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Ver más hallazgos <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h4 className="font-bold mb-4">Acción Inmediata Sugerida</h4>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 mb-4">
              <p className="text-sm font-medium">
                {uiInsights.length > 0 
                  ? uiInsights[0].action 
                  : "Sigue monitoreando los KPIs para detectar nuevas oportunidades."}
              </p>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              Ejecutar Recomendación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
