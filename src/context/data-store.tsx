'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  StoreMetrics, 
  StoreDataPoint, 
  calculateKPIs, 
  detectIssues, 
  generateRecommendations, 
  getUIInsights, 
  generateMainInsight,
  KPIResult,
  Issue,
  Recommendation,
  UIInsight
} from '@/lib/intelligence-engine';

export type TimeRange = 'today' | 'lastMonth' | '3months' | 'year';

interface DataContextType {
  metrics: StoreMetrics;
  kpis: KPIResult[];
  issues: Issue[];
  recommendations: Recommendation[];
  uiInsights: UIInsight[];
  mainInsight: string;
  history: StoreDataPoint[];
  lastUpdate: Date;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRangeState] = useState<TimeRange>('today');
  const [metrics, setMetrics] = useState<StoreMetrics>({
    current: { traffic: 1850, entries: 140, sales: 6, avgTime: 32.5, timestamp: new Date().toISOString() },
    yesterday: { traffic: 1100, entries: 180, sales: 32, avgTime: 16.2, timestamp: new Date().toISOString() },
    historicalAvg: { traffic: 1150, entries: 185, sales: 30, avgTime: 17.5, timestamp: new Date().toISOString() }
  });

  const [history, setHistory] = useState<StoreDataPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const setTimeRange = useCallback((range: TimeRange) => {
    setTimeRangeState(range);
    
    // Simulate data change based on range
    switch (range) {
      case 'today':
        setMetrics({
          current: { traffic: 1850, entries: 140, sales: 6, avgTime: 32.5, timestamp: new Date().toISOString() },
          yesterday: { traffic: 1100, entries: 180, sales: 32, avgTime: 16.2, timestamp: new Date().toISOString() },
          historicalAvg: { traffic: 1150, entries: 185, sales: 30, avgTime: 17.5, timestamp: new Date().toISOString() }
        });
        break;
      case 'lastMonth':
        setMetrics({
          current: { traffic: 45000, entries: 6000, sales: 1200, avgTime: 18.2, timestamp: 'Marzo 2026' },
          yesterday: { traffic: 42000, entries: 8000, sales: 1100, avgTime: 19.5, timestamp: 'Febrero 2026' },
          historicalAvg: { traffic: 40000, entries: 7500, sales: 1000, avgTime: 18.5, timestamp: 'Promedio Mensual' }
        });
        break;
      case '3months':
        setMetrics({
          current: { traffic: 135000, entries: 28000, sales: 1800, avgTime: 17.8, timestamp: 'Q1 2026' },
          yesterday: { traffic: 120000, entries: 25000, sales: 4000, avgTime: 18.0, timestamp: 'Q4 2025' },
          historicalAvg: { traffic: 125000, entries: 26000, sales: 4200, avgTime: 17.5, timestamp: 'Promedio Trimestral' }
        });
        break;
      case 'year':
        setMetrics({
          current: { traffic: 540000, entries: 110000, sales: 18500, avgTime: 35.5, timestamp: '2025-2026' },
          yesterday: { traffic: 500000, entries: 100000, sales: 17000, avgTime: 18.5, timestamp: '2024-2025' },
          historicalAvg: { traffic: 520000, entries: 105000, sales: 17500, avgTime: 18.0, timestamp: 'Promedio Anual' }
        });
        break;
    }
  }, []);

  useEffect(() => {
    // Initialize history
    const initialHistory = Array.from({ length: 12 }).map((_, i) => ({
      timestamp: `${8 + i}:00`,
      traffic: Math.floor(Math.random() * 200) + 50,
      entries: Math.floor(Math.random() * 50) + 10,
      sales: Math.floor(Math.random() * 10) + 1,
      avgTime: 15 + Math.random() * 10,
    }));
    setHistory(initialHistory);

    // Only update real-time if range is 'today'
    const interval = setInterval(() => {
      if (timeRange === 'today') {
        setMetrics(prev => {
          const newCurrent = {
            ...prev.current,
            traffic: prev.current.traffic + Math.floor(Math.random() * 5),
            entries: prev.current.entries + (Math.random() > 0.7 ? 1 : 0),
            sales: prev.current.sales + (Math.random() > 0.9 ? 1 : 0),
            avgTime: 32.5 + (Math.random() * 2 - 1),
            timestamp: new Date().toISOString()
          };
          
          return {
            ...prev,
            current: newCurrent
          };
        });
        setLastUpdate(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const kpis = calculateKPIs(metrics);
  const issues = detectIssues(metrics);
  const recommendations = generateRecommendations(issues);
  const uiInsights = getUIInsights(issues, recommendations);
  const mainInsight = generateMainInsight(metrics);

  return (
    <DataContext.Provider value={{ 
      metrics, 
      kpis, 
      issues, 
      recommendations, 
      uiInsights,
      mainInsight, 
      history, 
      lastUpdate,
      timeRange,
      setTimeRange
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
