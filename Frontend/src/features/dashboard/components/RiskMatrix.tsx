import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import { WeaknessRecord } from '../../../types';

export const RiskMatrix: React.FC = () => {
  const [weaknesses, setWeaknesses] = useState<WeaknessRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskMatrix = async () => {
      try {
        const response: any = await api.get('/progress/overview');
        // Fallback arrays or parsed mapping from nested weak items matching evaluation history fields
        if (response && response.data?.weaknesses) {
          setWeaknesses(response.data.weaknesses);
        } else {
          // Explicit default mocks to hydrate dashboard if profile history length is 0
          setWeaknesses([
            { topic: 'Node.js Event Loop Blockers', riskFactor: 'HIGH', count: 3 },
            { topic: 'Redis Cache Invalidation Patterns', riskFactor: 'MEDIUM', count: 1 },
            { topic: 'Big-O Time Optimization bounds', riskFactor: 'LOW', count: 1 }
          ]);
        }
      } catch (err) {
        console.warn('Risk matrix hydration deferred.');
      } finally {
        setLoading(false);
      }
    };
    fetchRiskMatrix();
  }, []);

  if (loading) {
    return <div className="h-40 border border-[#26262b] bg-[#121215] animate-pulse" />;
  }

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal">
      <div className="text-xs font-black tracking-widest text-[#ff5500] border-b border-[#26262b] pb-2 mb-4 uppercase">
        02 // ARCHITECTURAL_RISK_FACTORS
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs text-gray-300">
          <thead>
            <tr className="border-b-2 border-[#26262b] text-[#8a8a93] font-bold text-[10px] tracking-wider uppercase">
              <th className="pb-2">TOPIC_VECTOR</th>
              <th className="pb-2 text-center">RISK_THREAT</th>
              <th className="pb-2 text-right">OCCURRENCES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262b]">
            {weaknesses.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#0a0a0c]/50 transition-colors">
                <td className="py-2.5 font-bold text-white max-w-[200px] truncate">{item.topic}</td>
                <td className="py-2.5 text-center">
                  <span className={`px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase border ${
                    item.riskFactor === 'HIGH' ? 'border-[#ff0033] text-[#ff0033] bg-[#ff0033]/5' :
                    item.riskFactor === 'MEDIUM' ? 'border-[#ff5500] text-[#ff5500] bg-[#ff5500]/5' :
                    'border-[#8a8a93] text-[#8a8a93]'
                  }`}>
                    {item.riskFactor}
                  </span>
                </td>
                <td className="py-2.5 text-right font-black text-gray-400">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};