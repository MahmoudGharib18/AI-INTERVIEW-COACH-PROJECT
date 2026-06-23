import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import type { ApiResponse, LinkedInDraft as LinkedInDraftType } from '../../../types';

interface LinkedinDraftProps {
  sessionId: string;
}

export const LinkedinDraft: React.FC<LinkedinDraftProps> = ({ sessionId }) => {
  const [drafts, setDrafts] = useState<LinkedInDraftType[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDrafts = async () => {
    try {
      const response = await api.get<ApiResponse<{ drafts: LinkedInDraftType[] }>>('/linkedin');
      setDrafts(response.data.data.drafts);
    } catch {
      // empty history is a normal state, not an error to surface
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg(null);
    try {
      await api.post<ApiResponse<{ draft: LinkedInDraftType }>>('/linkedin/generate', { sessionId });
      await fetchDrafts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate a draft.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return <div className="h-48 border border-[#26262b] bg-[#121215] flex items-center justify-center text-xs text-[#8a8a93]">LOADING_DRAFTS...</div>;
  }

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal scanlines">
      <div className="text-xs font-black tracking-widest text-[#ff5500] border-b border-[#26262b] pb-2 mb-4 uppercase flex items-center justify-between">
        <span>02 // EXTRACTED_ENGINEERING_INSIGHT_DRAFTS</span>
      </div>

      <Button variant="orange" className="w-full mb-4" onClick={handleGenerate} disabled={generating}>
        {generating ? 'GENERATING_DRAFT...' : 'GENERATE_NEW_DRAFT_FOR_THIS_SESSION'}
      </Button>

      {errorMsg && (
        <div className="bg-[#ff0033]/5 border border-[#ff0033] text-[#ff0033] p-2 text-xs uppercase font-bold mb-4">
          ⚠️ {errorMsg}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="text-center p-6 border border-dashed border-[#26262b] text-xs text-[#8a8a93]">
          NO_DRAFTS_YET — GENERATE ONE ABOVE.
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft, idx) => (
            <div key={draft._id || idx} className="border border-[#26262b] bg-[#0a0a0c] p-3 relative group">
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
                  {copiedIndex === idx ? '[✓ COPIED]' : '[📋 COPY]'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};