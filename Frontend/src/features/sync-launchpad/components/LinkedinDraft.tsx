import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';

export const LinkedinDraft: React.FC = () => {
  const [drafts, setDrafts] = useState<{ id: string; postText: string; angle: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestDrafts = async () => {
      try {
        // Maps directly to GET /api/workspace/linkedin/drafts returning newest first
        const response: any = await api.get('/workspace/linkedin/drafts');
        if (response && response.data) {
          setDrafts(response.data);
        }
      } catch (err) {
        console.warn('LinkedIn telemetry buffer clean.');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestDrafts();
  }, []);

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return <div className="h-48 border border-[#26262b] bg-[#121215] flex items-center justify-center text-xs text-[#8a8a93]">RETRIEVING_DRAFT_TEXT_CHANNELS...</div>;
  }

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal scanlines">
      <div className="text-xs font-black tracking-widest text-[#ff5500] border-b border-[#26262b] pb-2 mb-4 uppercase">
        02 // EXTRACTED_ENGINEERING_INSIGHT_DRAFTS
      </div>

      {drafts.length === 0 ? (
        <div className="text-center p-6 border border-dashed border-[#26262b] text-xs text-[#8a8a93]">
          NO_DRAFTS_FOUND // SESSIONS MUST BE COMPLETELY EVALUATED TO GENERATE PROFESSIONAL TEXT PATHS.
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft, idx) => (
            <div key={draft.id || idx} className="border border-[#26262b] bg-[#0a0a0c] p-3 relative group">
              <div className="flex justify-between items-center mb-2 border-b border-[#121215] pb-1.5">
                <span className="text-[9px] bg-[#ff5500]/10 text-[#ff5500] border border-[#ff5500]/30 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                  ANGLE // {draft.angle.toUpperCase()}
                </span>
                <span className="text-[9px] text-[#8a8a93]">
                  {new Date(draft.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap select-text pr-2">
                {draft.postText}
              </p>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleCopyToClipboard(draft.postText, idx)}
                  className="text-[9px] font-black tracking-widest text-[#00ff66] hover:text-white border border-[#00ff66] px-2 py-1 uppercase bg-transparent transition-all duration-150"
                >
                  {copiedIndex === idx ? '[✓ COPIED_TO_CLIPBOARD]' : '[📋 COPY_CLEAN_TEXT]'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};