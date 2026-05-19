'use client';

import React from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  User, 
  Globe, 
  Save,
  HelpCircle
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500">Gestiona las preferencias de tu dashboard y del motor de IA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { label: 'General', icon: Settings, active: true },
            { label: 'Notificaciones', icon: Bell },
            { label: 'Seguridad', icon: Shield },
            { label: 'Conexión Sensores', icon: Database },
            { label: 'Usuarios', icon: User },
            { label: 'Idioma', icon: Globe },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 card-shadow space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4">Preferencias del Dashboard</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nombre de la Tienda</label>
                <input 
                  type="text" 
                  defaultValue="Tienda Plaza Central #402"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Frecuencia de Actualización</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none">
                  <option>Real-time (5 segundos)</option>
                  <option>Cada 1 minuto</option>
                  <option>Cada 15 minutos</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-slate-900">Modo Auto-Insights</p>
                  <p className="text-xs text-slate-500">Recibir sugerencias automáticas del asistente.</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-60">
                <div>
                  <p className="text-sm font-bold text-slate-900">Exportación Automática</p>
                  <p className="text-xs text-slate-500">Enviar reporte PDF al cierre de tienda.</p>
                </div>
                <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <button className="flex-1 bg-primary text-white py-3 rounded-2xl font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
                <Save size={18} />
                Guardar Cambios
              </button>
              <button className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50">
                Restablecer
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
            <div className="p-2 bg-amber-100 rounded-xl h-fit text-amber-600">
              <HelpCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">¿Necesitas ayuda con los sensores?</p>
              <p className="text-xs text-amber-700 mt-1 mb-3">Revisa nuestra guía de calibración de flujo de personas para mejorar la precisión del sistema.</p>
              <button className="text-xs font-bold text-amber-600 hover:underline">Ver documentación →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
