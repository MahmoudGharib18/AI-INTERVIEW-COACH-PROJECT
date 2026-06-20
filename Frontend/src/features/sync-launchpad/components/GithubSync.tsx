import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';

export const GithubSync: React.FC = () => {
  // Local state for GitHub payload tracking
  const [repoLink, setRepoLink] = useState('');
  const [commitLink, setCommitLink] = useState('');
  const [notes, setNotes] = useState('');
  
  // Local state for LinkedIn draft data structures
  const [linkedinDraft, setLinkedinDraft] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const displayStatusNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleGitSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoLink.trim()) return;

    try {
      // Direct mapping to your backend contract: POST /api/github
      await api.post('/github', { repoLink, commitLink, notes });
      displayStatusNotification('GIT_METADATA_LOCKED: Artifact linked to session profile.');
      
      // Reset inputs post-execution
      setRepoLink('');
      setCommitLink('');
      setNotes('');
    } catch (err: any) {
      displayStatusNotification(`SYNC_ERROR: ${err.message}`);
    }
  };

  const handleTriggerLinkedInGeneration = async () => {
    setLoadingDraft(true);
    setLinkedinDraft(null);
    try {
      // Connects directly to POST /api/linkedin/generate
      const response: any = await api.post('/linkedin/generate');
      if (response.data && response.data.draft) {
        setLinkedinDraft(response.data.draft.postText);
        displayStatusNotification('DRAFT_RECOMPILED: Technical post loaded.');
      }
    } catch (err: any) {
      displayStatusNotification(`GENERATION_FAILED: ${err.message}`);
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!linkedinDraft) return;
    navigator.clipboard.writeText(linkedinDraft);
    displayStatusNotification('CLIPBOARD_SUCCESS: Draft copied to memory core.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono text-gray-200">
      
      {/* Top Banner Telemetry Bar */}
      <div className="flex items-center justify-between border-b-2 border-cyber-border pb-4">
        <h1 className="text-xl font-black tracking-wider text-white">SYNC_LAUNCHPAD // INTEGRATIONS</h1>
        {actionMessage && (
          <div className="text-[11px] text-cyber-neonGreen bg-cyber-surface border border-cyber-neonGreen px-3 py-1 rounded animate-pulse">
            {actionMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card Grid Panel: GitHub Artifact Submissions */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-5 shadow-brutal scanlines">
          <div className="flex items-center space-x-2 border-b border-cyber-border pb-3 mb-4">
            <span className="text-xs font-bold text-white tracking-widest">SYS//GITHUB_TRACKER</span>
          </div>
          
          <form onSubmit={handleGitSyncSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-cyber-textMuted font-bold mb-1 uppercase">Repository Path URL</label>
              <input
                type="url"
                required
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                placeholder="https://github.com/mahmoud/supportnest"
                className="w-full bg-cyber-bg border-2 border-cyber-border p-2 text-xs text-white focus:outline-none focus:border-cyber-neonGreen font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-cyber-textMuted font-bold mb-1 uppercase">Specific Commit reference Node (Optional)</label>
              <input
                type="url"
                value={commitLink}
                onChange={(e) => setCommitLink(e.target.value)}
                placeholder="https://github.com/mahmoud/supportnest/commit/a7b1c4..."
                className="w-full bg-cyber-bg border-2 border-cyber-border p-2 text-xs text-white focus:outline-none focus:border-cyber-neonGreen font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] text-cyber-textMuted font-bold mb-1 uppercase">Engineering Log / Design Decisions Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document complex architecture changes, algorithmic time performance, or structural refactoring blocks..."
                className="w-full bg-cyber-bg border-2 border-cyber-border p-2 text-xs text-white focus:outline-none focus:border-cyber-neonGreen font-mono resize-none"
              />
            </div>

            <Button type="submit" variant="neon" className="w-full text-xs">
              COMMIT_METADATA_RECORD
            </Button>
          </form>
        </div>

        {/* Right Card Grid Panel: LinkedIn AI Content Engine */}
        <div className="bg-cyber-surface border-2 border-cyber-border p-5 shadow-brutal flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-cyber-border pb-3 mb-4">
              <span className="text-xs font-bold text-cyber-neonOrange tracking-widest">SYS//LINKEDIN_CONTENT_DECK</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">
              Extract specialized summaries from your completed daily metrics. Focuses entirely on raw engineering decisions, debugging vectors, and architectural insights.
            </p>

            {loadingDraft && (
              <div className="h-40 border border-dashed border-cyber-border flex items-center justify-center text-xs text-cyber-neonOrange animate-pulse">
                PARSING_INTERVIEW_TELEMETRY_DRAFT...
              </div>
            )}

            {linkedinDraft && (
              <div className="bg-cyber-bg p-3 border border-cyber-border rounded text-xs text-gray-300 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-mono select-all">
                {linkedinDraft}
              </div>
            )}

            {!linkedinDraft && !loadingDraft && (
              <div className="h-40 border-2 border-dashed border-cyber-border rounded flex items-center justify-center text-xs text-cyber-textMuted uppercase tracking-wider">
                No Draft Pipeline Formed For This Cycle
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-cyber-border flex space-x-4">
            <Button variant="orange" className="flex-1 text-xs" onClick={handleTriggerLinkedInGeneration} disabled={loadingDraft}>
              GENERATE_POST_DRAFT
            </Button>
            {linkedinDraft && (
              <Button variant="muted" className="text-xs" onClick={handleCopyToClipboard}>
                COPY_MACRO
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};