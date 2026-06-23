import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import type { ApiResponse, WeaknessFrequency } from '../../../types';

export const RiskMatrix: React.FC = () => {
  const [weaknesses, setWeaknesses] = useState<WeaknessFrequency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeaknesses = async () => {
      try {
        const response = await api.get<ApiResponse<{ weaknesses: WeaknessFrequency[] }>>('/progress/weaknesses');
        setWeaknesses(response.data.data.weaknesses);
      } catch {
        setWeaknesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWeaknesses();
  }, []);

  if (loading) {
    return <div className="h-40 border border-[#26262b] bg-[#121215] animate-pulse" />;
  }

  // bucket purely by frequency count since the backend doesn't return a risk tier —
  // this is a presentation-only heuristic, not a value from the server
  const getRiskLabel = (count: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
    if (count >= 4) return 'HIGH';
    if (count >= 2) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal">
      <div className="text-xs font-black tracking-widest text-[#ff5500] border-b border-[#26262b] pb-2 mb-4 uppercase">
        02 // ARCHITECTURAL_RISK_FACTORS
      </div>

      {weaknesses.length === 0 ? (
        <div className="text-center p-6 border border-dashed border-[#26262b] text-xs text-[#8a8a93]">
          NO_RECURRING_WEAKNESSES_DETECTED_YET
        </div>
      ) : (
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
              {weaknesses.map((item, idx) => {
                const risk = getRiskLabel(item.count);
                return (
                  <tr key={idx} className="hover:bg-[#0a0a0c]/50 transition-colors">
                    <td className="py-2.5 font-bold text-white max-w-[200px] truncate">{item.topic}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase border ${
                        risk === 'HIGH' ? 'border-[#ff0033] text-[#ff0033] bg-[#ff0033]/5' :
                        risk === 'MEDIUM' ? 'border-[#ff5500] text-[#ff5500] bg-[#ff5500]/5' :
                        'border-[#8a8a93] text-[#8a8a93]'
                      }`}>
                        {risk}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-black text-gray-400">{item.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};