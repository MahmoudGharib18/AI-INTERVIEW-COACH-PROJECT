import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api-client';
import type { ApiResponse, TrendPoint } from '../../../types';

export const TrendChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataPoints, setDataPoints] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const response = await api.get<ApiResponse<{ trend: TrendPoint[] }>>('/progress/trend');
        setDataPoints(response.data.data.trend);
      } catch {
        setDataPoints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendData();
  }, []);

  useEffect(() => {
    if (loading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (dataPoints.length === 0) return;

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    ctx.strokeStyle = '#26262b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const coordinates = dataPoints.map((point, index) => {
      const x = padding + (chartWidth / (dataPoints.length - 1 || 1)) * index;
      const y = padding + chartHeight - (chartHeight * (point.overallScore / 100));
      return { x, y, score: point.overallScore };
    });

    ctx.strokeStyle = '#00ff66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    coordinates.forEach((coord, idx) => {
      if (idx === 0) ctx.moveTo(coord.x, coord.y);
      else ctx.lineTo(coord.x, coord.y);
    });
    ctx.stroke();

    coordinates.forEach((coord) => {
      ctx.fillStyle = '#0a0a0c';
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${coord.score}%`, coord.x, coord.y - 8);
    });
  }, [dataPoints, loading]);

  if (loading) {
    return <div className="h-48 border border-[#26262b] bg-[#121215] flex items-center justify-center text-xs text-[#8a8a93]">CALCULATING_TREND_VECTORS...</div>;
  }

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal scanlines">
      <div className="text-xs font-black tracking-widest text-white border-b border-[#26262b] pb-2 mb-4 uppercase">
        01 // SCORE_PERFORMANCE_TREND
      </div>
      {dataPoints.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-xs text-[#8a8a93] uppercase">
          No completed sessions yet — trend will appear after your first session.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={650}
            height={200}
            className="bg-[#0a0a0c] border border-[#26262b] block mx-auto"
          />
        </div>
      )}
    </div>
  );
};