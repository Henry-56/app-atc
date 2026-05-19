'use client';

import React, { useState } from 'react';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useData } from '@/context/data-store';
import ChartCard from '@/components/dashboard/ChartCard';

export default function AnalyticsPage() {
  const { history, metrics } = useData();

  const [heatmapData, setHeatmapData] = useState<number[]>([]);

  React.useEffect(() => {
    setHeatmapData(Array.from({ length: 64 }).map((_, i) => Math.floor(Math.random() * 100)));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Análisis Detallado</h2>
          <p className="text-slate-500">Comportamiento histórico y tendencias de tráfico.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
            <p className="text-sm font-medium text-slate-500 mb-1">Crecimiento Tráfico</p>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900">+18.2%</h3>
              <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={12} /> vs ayer
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[70%]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
            <p className="text-sm font-medium text-slate-500 mb-1">Eficiencia de Vitrina</p>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900">14.5%</h3>
              <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                <ArrowDownRight size={12} /> -2.1%
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[45%]" />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={16} /> Filtros de Análisis
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Segmento</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm">
                  <option>Todos los clientes</option>
                  <option>Nuevos</option>
                  <option>Recurrentes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Zona de Tienda</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm">
                  <option>Toda la tienda</option>
                  <option>Calzado</option>
                  <option>Ropa Hombre</option>
                  <option>Ropa Mujer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Charts */}
        <div className="lg:col-span-3 space-y-8">
          <ChartCard title="Fidelización vs Atracción">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="traffic" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tráfico Público" />
                <Bar dataKey="entries" fill="#10b981" radius={[4, 4, 0, 0]} name="Clientes Interesados" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900">Mapa de Calor (Heatmap)</h3>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold uppercase">Distribución Planta</span>
              </div>
              <div className="grid grid-cols-8 gap-1 aspect-square bg-slate-50 p-2 rounded-xl border border-slate-100">
                {heatmapData.map((val, i) => (
                  <div 
                    key={i} 
                    className="rounded-[2px] transition-all hover:scale-110 cursor-pointer"
                    style={{ 
                      backgroundColor: val > 80 ? '#ef4444' : val > 50 ? '#f97316' : val > 20 ? '#3b82f6' : '#e2e8f0',
                      opacity: val / 100 + 0.2
                    }}
                    title={`Densidad: ${val}%`}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400">
                <span>ENTRADA</span>
                <span>PROBADORES</span>
                <span>CAJA</span>
              </div>

              {/* Intelligent Interpretation */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Interpretación Inteligente
                </h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Optimización de Layout:</span> Mover mercancía estratégica a las zonas rojas detectadas lejos del flujo principal.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Prevención de Saturación:</span> Las zonas oscuras constantes sugieren necesidad de más personal en probadores.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-900">Evaluación de Vitrinas:</span> Las celdas azules en nuevas colecciones indican baja efectividad visual.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ChartCard title="Tiempo de Permanencia Promedio">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip />
                  <Line 
                    type="stepAfter" 
                    dataKey="entries" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={false} 
                    name="Minutos promedio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}
