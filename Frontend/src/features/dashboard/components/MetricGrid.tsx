import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import { Badge } from '../../../components/ui/Badge';
import type { ApiResponse, ProgressOverview } from '../../../types';

export const MetricGrid: React.FC = () => {
  const [metrics, setMetrics] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get<ApiResponse<{ overview: ProgressOverview }>>('/progress/overview');
        setMetrics(response.data.data.overview);
      } catch (err: any) {
        setError(err.message || 'Failed to load metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-[#121215] border-2 border-[#26262b]" />
        ))}
      </div>
    );
  }

  const m = metrics ?? { streakCount: 0, lateCount: 0, missedCount: 0, totalSessions: 0, completionRate: 0, averageScore: null };

  const cards = [
    { label: 'STREAK_STABILITY', val: m.streakCount, unit: 'DAYS', variant: 'neon' as const, meta: 'STABLE' },
    { label: 'COMPLIANCE_RUNS', val: m.totalSessions, unit: 'UNITS', variant: 'muted' as const, meta: 'RECORDED' },
    { label: 'LATE_INIT_ALERTS', val: m.lateCount, unit: 'WARNS', variant: 'orange' as const, meta: 'WARNING' },
    { label: 'DECOUPLING_FAULTS', val: m.missedCount, unit: 'MISSED', variant: 'red' as const, meta: 'RESET_TRIGGER' },
  ];

  return (
    <div className="space-y-4 font-mono">
      {error && (
        <div className="bg-[#ff0033]/5 border border-[#ff0033] text-[#ff0033] p-2 text-xs uppercase font-bold">
          ⚠️ METRICS_FALLBACK_ACTIVE: {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-[#121215] border-2 p-4 shadow-brutal relative overflow-hidden transition-colors duration-300 ${
              card.variant === 'neon' ? 'hover:border-[#00ff66]' :
              card.variant === 'orange' ? 'hover:border-[#ff5500]' :
              card.variant === 'red' ? 'hover:border-[#ff0033]' : 'hover:border-white'
            }`}
          >
            <div className="text-[9px] font-black text-[#8a8a93] tracking-widest block mb-2">{card.label}</div>
            <div className="flex items-baseline space-x-1">
              <span className={`text-4xl font-black ${
                card.variant === 'neon' ? 'text-[#00ff66]' :
                card.variant === 'orange' ? 'text-[#ff5500]' :
                card.variant === 'red' ? 'text-[#ff0033]' : 'text-white'
              }`}>{card.val}</span>
              <span className="text-[10px] text-[#8a8a93] font-bold">{card.unit}</span>
            </div>
            <div className="absolute top-3 right-3">
              <Badge status={card.meta} variant={card.variant} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};