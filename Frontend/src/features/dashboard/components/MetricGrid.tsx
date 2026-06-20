import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';

interface CoreMetrics {
  streakCount: number;
  lateCount: number;
  missedCount: number;
  totalSessions: number;
  averageScore: number;
}

export const MetricGrid: React.FC = () => {
  const [metrics, setMetrics] = useState<CoreMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardTelemetry = async () => {
      try {
        const res: any = await api.get('/progress/overview');
        if (res.data) {
          setMetrics(res.data);
        }
      } catch (err: any) {
        setSystemAlert('FALLBACK_MODE: Telemetry metrics connection delayed.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardTelemetry();
  }, []);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center font-mono text-cyber-neonGreen animate-pulse text-xs tracking-widest">
        FETCHING_CORE_PERFORMANCE_REGISTERS...
      </div>
    );
  }

  // Safe fallback metrics if fields haven't populated on database sync yet
  const activeMetrics = metrics || { streakCount: 0, lateCount: 0, missedCount: 0, totalSessions: 0, averageScore: 0 };

  return (
    <div className="space-y-6 font-mono text-gray-200">
      
      {/* Top Telemetry Header Ribbon */}
      <div className="flex items-center justify-between border-b-2 border-cyber-border pb-4">
        <div>
          <h1 className="text-xl font-black tracking-wider text-white">COMMAND_CENTER // STATUS_OVERVIEW</h1>
          <p className="text-[10px] text-cyber-textMuted uppercase mt-1">Operational performance matrices compiled in real-time</p>
        </div>
        {systemAlert && (
          <div className="text-[10px] text-cyber-neonOrange border border-cyber-neonOrange px-2 py-0.5 rounded">
            {systemAlert}
          </div>
        )}
      </div>

      {/* Primary Metrics Grid Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Core Metric Unit: Streak Engine */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-4 shadow-brutal relative overflow-hidden group hover:border-cyber-neonGreen transition-colors">
          <div className="text-[10px] font-bold text-cyber-textMuted tracking-wider mb-2">STREAK_STABILITY_CORE</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black text-cyber-neonGreen drop-shadow-[0_0_8px_rgba(0,255,102,0.15)]">
              {activeMetrics.streakCount}
            </span>
            <span className="text-xs text-cyber-neonGreen font-bold">DAYS</span>
          </div>
          <div className="absolute right-2 bottom-1 text-[24px] font-black text-cyber-border select-none pointer-events-none group-hover:text-cyber-neonGreen/5">STRK</div>
        </div>

        {/* Core Metric Unit: Total Executed Sessions */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-4 shadow-brutal relative overflow-hidden group hover:border-white transition-colors">
          <div className="text-[10px] font-bold text-cyber-textMuted tracking-wider mb-2">COMPLIANCE_RUNS</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black text-white">
              {activeMetrics.totalSessions}
            </span>
            <span className="text-xs text-cyber-textMuted font-bold">RECORDS</span>
          </div>
          <div className="absolute right-2 bottom-1 text-[24px] font-black text-cyber-border select-none pointer-events-none group-hover:text-white/5">TOTAL</div>
        </div>

        {/* Core Metric Unit: Late Count Violations */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-4 shadow-brutal relative overflow-hidden group hover:border-cyber-neonOrange transition-colors">
          <div className="text-[10px] font-bold text-cyber-textMuted tracking-wider mb-2">LATE_INIT_WARNINGS</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black text-cyber-neonOrange">
              {activeMetrics.lateCount}
            </span>
            <span className="text-xs text-cyber-neonOrange font-bold">WARNS</span>
          </div>
          <div className="absolute right-2 bottom-1 text-[24px] font-black text-cyber-border select-none pointer-events-none group-hover:text-cyber-neonOrange/5">LATE</div>
        </div>

        {/* Core Metric Unit: Missed Sessions (Streak resets to 0) */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-4 shadow-brutal relative overflow-hidden group hover:border-cyber-neonRed transition-colors">
          <div className="text-[10px] font-bold text-cyber-textMuted tracking-wider mb-2">SYSTEM_DECOUPLING_FAULTS</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-black text-cyber-neonRed">
              {activeMetrics.missedCount}
            </span>
            <span className="text-xs text-cyber-neonRed font-bold">MISSED</span>
          </div>
          <div className="absolute right-2 bottom-1 text-[24px] font-black text-cyber-border select-none pointer-events-none group-hover:text-cyber-neonRed/5">FAULTS</div>
        </div>

      </div>

      {/* Secondary Interface Strip: Canvas Analytics Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 bg-cyber-surface border-2 border-cyber-border p-5 shadow-brutal scanlines">
          <div className="text-xs font-bold text-white tracking-widest border-b border-cyber-border pb-2 mb-4 uppercase">
            01 // EVALUATION_TREND_VECTOR
          </div>
          {/* Custom vector representation placeholder frame */}
          <div className="h-44 bg-cyber-bg border border-cyber-border rounded flex flex-col items-center justify-center relative p-2">
            <div className="text-2xl font-black text-cyber-neonGreen opacity-80">{activeMetrics.averageScore}%</div>
            <div className="text-[10px] text-cyber-textMuted uppercase tracking-wider mt-1">Current Matrix Aggregation Index</div>
            <div className="w-full absolute bottom-4 px-6 flex justify-between text-[9px] text-cyber-textMuted font-mono">
              <span>CYC_01</span>
              <span>CYC_02</span>
              <span>CYC_03</span>
              <span>CURRENT_INDEX</span>
            </div>
          </div>
        </div>

        {/* System Operations Configuration Meta Info Panel */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-5 shadow-brutal flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white tracking-widest border-b border-cyber-border pb-2 mb-3 uppercase">
              02 // ENGINE_HEALTH
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-gray-400">
              <div className="flex justify-between border-b border-cyber-border/40 pb-1">
                <span className="text-cyber-textMuted">SCHEDULER_CRON:</span>
                <span className="text-cyber-neonGreen font-bold">ACTIVE//ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border/40 pb-1">
                <span className="text-cyber-textMuted">QUEUE_WORKER (BullMQ):</span>
                <span className="text-cyber-neonGreen font-bold">LISTENING_127.0.0.1</span>
              </div>
              <div className="flex justify-between border-b border-cyber-border/40 pb-1">
                <span className="text-cyber-textMuted">GUARDRAIL_LEAK_DETECTOR:</span>
                <span className="text-cyber-neonGreen font-bold">ENFORCED</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-cyber-neonOrange bg-cyber-bg p-2 border border-cyber-border rounded text-center font-bold tracking-widest uppercase mt-4">
            System Fully Job Ready
          </div>
        </div>
      </div>

    </div>
  );
};