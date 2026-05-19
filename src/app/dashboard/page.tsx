'use client';

import React from 'react';
import { 
  Users, 
  DoorOpen, 
  ShoppingBag, 
  Clock, 
  Percent,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useData } from '@/context/data-store';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import InsightBox from '@/components/dashboard/InsightBox';
import RecommendationCard from '@/components/dashboard/RecommendationCard';

export default function DashboardPage() {
  const { metrics, history, kpis, uiInsights, mainInsight } = useData();

  const iconMap = {
    'Tráfico Total': Users,
    'Tasa de Conversión': Percent,
    'Ventas Totales': ShoppingBag,
    'Tiempo en Tienda': Clock,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resumen Operativo</h2>
          <p className="text-slate-500">Visualiza el rendimiento de tu tienda en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Descargar Reporte
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
            Nueva Campaña
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard 
            key={i}
            title={kpi.label} 
            value={kpi.value} 
            icon={iconMap[kpi.label as keyof typeof iconMap] || Users} 
            trend={kpi.trend}
            status={kpi.status}
            suffix={kpi.suffix}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-8">
          <ChartCard 
            title="Flujo de Personas por Hora" 
            subtitle="Comparativa de tráfico exterior vs entradas a tienda"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="timestamp" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTraffic)" 
                  name="Tráfico Exterior"
                />
                <Area 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={0} 
                  name="Entradas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartCard title="Entradas vs Compras">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="entries" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Entradas" />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
              <h3 className="font-semibold text-slate-900 mb-6">Embudo de Conversión</h3>
              <div className="space-y-6">
                {[
                  { label: 'Tráfico Exterior', value: metrics.current.traffic, color: 'bg-blue-500', width: '100%' },
                  { label: 'Interés (Entradas)', value: metrics.current.entries, color: 'bg-indigo-500', width: `${(metrics.current.entries / metrics.current.traffic * 100).toFixed(0)}%` },
                  { label: 'Conversión (Ventas)', value: metrics.current.sales, color: 'bg-emerald-500', width: `${(metrics.current.sales / metrics.current.traffic * 100).toFixed(0)}%` }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.value}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                        style={{ width: item.width }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Tasa Final</span>
                <span className="text-emerald-600 font-bold text-lg">
                  {kpis.find(k => k.label === 'Tasa de Conversión')?.value || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} />
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              Store Intelligence
            </h3>
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <p className="text-sm font-medium leading-relaxed">
                {mainInsight}
              </p>
            </div>

            <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-bold bg-white text-slate-900 py-3 rounded-2xl hover:bg-slate-100 transition-colors">
              Ver Diagnóstico Completo
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="font-bold text-slate-900 px-1 mt-8">Recomendaciones Top</h3>
          <div className="space-y-4">
            {uiInsights.slice(0, 3).map((insight, i) => (
              <RecommendationCard key={i} insight={insight} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Sparkles = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
