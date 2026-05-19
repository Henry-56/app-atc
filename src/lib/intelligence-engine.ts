/**
 * Store Intelligence Engine
 * Handles KPI calculations, issue detection, and recommendation generation.
 */

export interface StoreDataPoint {
  traffic: number;
  entries: number;
  sales: number;
  avgTime: number;
  timestamp: string;
}

export interface StoreMetrics {
  current: StoreDataPoint;
  yesterday: StoreDataPoint;
  historicalAvg: StoreDataPoint;
}

export interface KPIResult {
  label: string;
  value: string | number;
  trend: number; // percentage change vs yesterday
  status: 'good' | 'alert' | 'danger';
  suffix?: string;
}

export interface Issue {
  id: string;
  type: 'conversion' | 'attraction' | 'operation' | 'performance' | 'success';
  severity: 'high' | 'medium' | 'low' | 'success';
  title: string;
  explanation: string;
  metricValue: number;
  threshold: number;
}

export interface Recommendation {
  issueId: string;
  action: string;
  priority: 'high' | 'medium' | 'low' | 'success';
  estimatedImpact: string;
}

export interface UIInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low' | 'success';
  action: string;
}

/**
 * 1. Calculate KPIs based on current and historical data
 */
export function calculateKPIs(metrics: StoreMetrics): KPIResult[] {
  const { current, yesterday } = metrics;
  
  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) return 0;
    return parseFloat(((curr - prev) / prev * 100).toFixed(1));
  };

  const conversionRate = current.entries > 0 ? (current.sales / current.entries * 100) : 0;
  const prevConversionRate = yesterday.entries > 0 ? (yesterday.sales / yesterday.entries * 100) : 0;

  return [
    {
      label: 'Tráfico Total',
      value: current.traffic,
      trend: calcTrend(current.traffic, yesterday.traffic),
      status: current.traffic >= yesterday.traffic ? 'good' : 'alert'
    },
    {
      label: 'Tasa de Conversión',
      value: conversionRate.toFixed(1),
      trend: calcTrend(conversionRate, prevConversionRate),
      status: conversionRate > 20 ? 'good' : conversionRate > 10 ? 'alert' : 'danger',
      suffix: '%'
    },
    {
      label: 'Ventas Totales',
      value: current.sales,
      trend: calcTrend(current.sales, yesterday.sales),
      status: current.sales >= yesterday.sales ? 'good' : 'alert'
    },
    {
      label: 'Tiempo en Tienda',
      value: Math.round(current.avgTime),
      trend: calcTrend(current.avgTime, yesterday.avgTime),
      status: current.avgTime < 30 ? 'good' : 'alert',
      suffix: 'min'
    }
  ];
}

/**
 * 2. Detect Issues and Strengths automatically
 */
export function detectIssues(metrics: StoreMetrics): Issue[] {
  const { current, historicalAvg } = metrics;
  const insights: Issue[] = [];

  const attractionRate = (current.entries / current.traffic) * 100;
  const conversionRate = current.entries > 0 ? (current.sales / current.entries) * 100 : 0;

  // --- PROBLEMS ---

  // Attraction Issue
  if (attractionRate < 15) {
    insights.push({
      id: 'attraction-001',
      type: 'attraction',
      severity: 'high',
      title: 'Baja Atracción (Vitrina)',
      explanation: `Solo el ${attractionRate.toFixed(1)}% de los transeúntes entran. Tu vitrina no está captando interés comparado con el flujo exterior.`,
      metricValue: attractionRate,
      threshold: 15
    });
  }

  // Conversion Issue
  if (conversionRate < 12) {
    insights.push({
      id: 'conversion-001',
      type: 'conversion',
      severity: 'high',
      title: 'Problema de Conversión',
      explanation: `Muchos clientes entran pero pocos compran (${conversionRate.toFixed(1)}%). Revisa stock, precios o atención.`,
      metricValue: conversionRate,
      threshold: 12
    });
  }

  // Operational Issue
  if (current.avgTime > 30 && conversionRate < 10) {
    insights.push({
      id: 'operation-001',
      type: 'operation',
      severity: 'medium',
      title: 'Fricción en Experiencia',
      explanation: `El tiempo de permanencia es alto (${Math.round(current.avgTime)} min) pero las ventas son bajas. Posibles colas o confusión en el layout.`,
      metricValue: current.avgTime,
      threshold: 30
    });
  }

  // Peak Hour Pattern
  if (current.traffic > historicalAvg.traffic * 1.5 && conversionRate < (historicalAvg.sales / historicalAvg.entries * 80)) {
    insights.push({
      id: 'performance-peak',
      type: 'performance',
      severity: 'medium',
      title: 'Saturación en Hora Pico',
      explanation: 'El tráfico es inusualmente alto pero la conversión está cayendo. Falta de personal detectada.',
      metricValue: current.traffic,
      threshold: historicalAvg.traffic * 1.5
    });
  }

  // --- STRENGTHS (Fortalezas) ---

  // Excellent Attraction
  if (attractionRate > 20) {
    insights.push({
      id: 'strength-attraction',
      type: 'success',
      severity: 'success',
      title: 'Excelente Atracción Visual',
      explanation: `La vitrina está captando un ${attractionRate.toFixed(1)}% del tráfico exterior, superando el promedio histórico.`,
      metricValue: attractionRate,
      threshold: 20
    });
  }

  // High Conversion
  if (conversionRate > 15) {
    insights.push({
      id: 'strength-conversion',
      type: 'success',
      severity: 'success',
      title: 'Alta Efectividad de Cierre',
      explanation: `La tasa de conversión es de ${conversionRate.toFixed(1)}%. El equipo de ventas está cerrando operaciones eficientemente.`,
      metricValue: conversionRate,
      threshold: 15
    });
  }

  // Operational Efficiency
  if (current.avgTime < 20 && conversionRate > 12) {
    insights.push({
      id: 'strength-operation',
      type: 'success',
      severity: 'success',
      title: 'Operación Ágil',
      explanation: 'Los clientes encuentran lo que buscan rápido y compran sin fricciones innecesarias.',
      metricValue: current.avgTime,
      threshold: 20
    });
  }

  // Abandonment in fitting rooms
  if (current.avgTime > 40 && conversionRate < 5) {
    insights.push({
      id: 'operation-fitting',
      type: 'operation',
      severity: 'high',
      title: 'Abandono en Probadores',
      explanation: `Los clientes pasan más de 40 min en promedio, pero la conversión es crítica (${conversionRate.toFixed(1)}%). El cuello de botella está en los probadores.`,
      metricValue: current.avgTime,
      threshold: 40
    });
  }

  // Stock Consistency Alert (Simulated)
  if (current.entries > 100 && current.sales === 0) {
    insights.push({
      id: 'performance-stock',
      type: 'performance',
      severity: 'high',
      title: 'Alerta de Disponibilidad',
      explanation: 'Se detecta un alto número de entradas sin ninguna venta. Posible falta de tallas o error en sistema de cobro.',
      metricValue: current.sales,
      threshold: 1
    });
  }

  return insights;
}

/**
 * 3. Generate Recommendations based on detected insights
 */
export function generateRecommendations(issues: Issue[]): Recommendation[] {
  return issues.map(issue => {
    switch (issue.type) {
      case 'attraction':
        return {
          issueId: issue.id,
          action: 'Rediseñar vitrina o lanzar promociones visibles al exterior',
          priority: issue.severity,
          estimatedImpact: '+10% entradas'
        };
      case 'conversion':
        return {
          issueId: issue.id,
          action: 'Capacitación en técnicas de cierre o revisión de precios competitivos',
          priority: issue.severity,
          estimatedImpact: '+15% conversión'
        };
      case 'performance':
        if (issue.id === 'performance-stock') {
          return {
            issueId: issue.id,
            action: 'Verificar inventario de productos top-sellers y sistema de POS',
            priority: 'high',
            estimatedImpact: '+25% ventas recuperadas'
          };
        }
        return {
          issueId: issue.id,
          action: 'Aumentar personal de apoyo en horas de alto tráfico',
          priority: issue.severity,
          estimatedImpact: '+18% ventas estimadas'
        };
      case 'operation':
        if (issue.id === 'operation-fitting') {
          return {
            issueId: issue.id,
            action: 'Asignar un asistente exclusivo para control de probadores y retornos',
            priority: 'high',
            estimatedImpact: '+12% conversión en tienda'
          };
        }
        return {
          issueId: issue.id,
          action: 'Optimizar flujo de caja o simplificar recorrido de tienda',
          priority: issue.severity,
          estimatedImpact: '-20% fricción'
        };
      case 'success':
        return {
          issueId: issue.id,
          action: 'Mantener estrategias actuales y analizar qué elementos están funcionando mejor',
          priority: 'success',
          estimatedImpact: 'Sostenibilidad'
        };
      default:
        return {
          issueId: issue.id,
          action: 'Analizar métricas detalladas',
          priority: 'low',
          estimatedImpact: 'Variable'
        };
    }
  });
}

/**
 * Helper to map issues/recommendations to UI format
 */
export function getUIInsights(issues: Issue[], recommendations: Recommendation[]): UIInsight[] {
  return issues.map(issue => {
    const rec = recommendations.find(r => r.issueId === issue.id);
    return {
      type: issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warning' : issue.severity === 'success' ? 'success' : 'info',
      title: issue.title,
      description: issue.explanation,
      impact: rec?.estimatedImpact || 'Mejora operativa',
      priority: issue.severity,
      action: rec?.action || 'Analizar problema'
    };
  });
}

/**
 * 4. Generate the main intelligent insight text
 */
export function generateMainInsight(metrics: StoreMetrics): string {
  const kpis = calculateKPIs(metrics);
  const convKPI = kpis.find(k => k.label === 'Tasa de Conversión');
  const trafficKPI = kpis.find(k => k.label === 'Tráfico Total');

  if (!convKPI || !trafficKPI) return "Analizando datos...";

  if (trafficKPI.trend > 0 && parseFloat(convKPI.value.toString()) < 15) {
    return `Alta afluencia (${trafficKPI.trend}% más que ayer) pero baja conversión (${convKPI.value}%). Posible problema en atención o pricing.`;
  }
  
  if (parseFloat(convKPI.value.toString()) > 20) {
    return `Buen rendimiento: alta conversión (${convKPI.value}%) con tráfico estable. Mantén las estrategias actuales.`;
  }

  return `Operación estable. El tráfico ha variado un ${trafficKPI.trend}% y la conversión se mantiene en ${convKPI.value}%.`;
}

/**
 * Helper for Assistant Response
 */
export function getAssistantResponse(query: string, metrics: StoreMetrics): string {
  const q = query.toLowerCase();
  
  if (q.includes('qué está pasando') || q.includes('estado') || q.includes('hoy')) {
    return generateMainInsight(metrics);
  }

  const issues = detectIssues(metrics);
  if (q.includes('problema') || q.includes('mal') || q.includes('mejorar')) {
    const problems = issues.filter(i => i.severity !== 'success');
    if (problems.length === 0) return "No detecto problemas críticos hoy. Todo funciona según lo esperado.";
    return `He detectado ${problems.length} áreas de mejora. La principal es: ${problems[0].title}. Explicación: ${problems[0].explanation}`;
  }

  if (q.includes('recomendación') || q.includes('consejo') || q.includes('hacer')) {
    const recs = generateRecommendations(issues);
    if (recs.length === 0) return "Sigue monitoreando los KPIs. Por ahora no se requieren acciones urgentes.";
    return `Mi recomendación prioritaria: ${recs[0].action}. Impacto estimado: ${recs[0].estimatedImpact}.`;
  }

  return "Hola, soy tu analista de tienda inteligente. Puedo decirte qué está pasando hoy, detectar problemas o darte recomendaciones accionables.";
}
