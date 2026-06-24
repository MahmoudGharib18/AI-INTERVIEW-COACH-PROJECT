import { Button } from '@/components/ui/Button.tsx';
import { Input } from '@/components/ui/Input.tsx';
import { api } from '@/lib/api-client.ts';
import type { ApiResponse } from '@/types/index.ts';
import React, { useState } from 'react';


interface GithubSyncProps {
  sessionId: string;
  onSyncComplete: (message: string, type: 'success' | 'error') => void;
}

export const GithubSync: React.FC<GithubSyncProps> = ({ sessionId, onSyncComplete }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [commitUrl, setCommitUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleSyncTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setSyncing(true);
    try {
      await api.post<ApiResponse<unknown>>('/github', {
        sessionId,
        repositoryUrl: repoUrl,
        commitUrl: commitUrl || undefined,
        notes: notes || undefined,
      });

      onSyncComplete('GitHub link saved successfully.', 'success');
      setRepoUrl('');
      setCommitUrl('');
      setNotes('');
    } catch (err: any) {
      onSyncComplete(err.message || 'Failed to save GitHub link.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-[#121215] border-2 border-[#26262b] p-4 font-mono shadow-brutal hover:border-[#00ff66] transition-colors duration-300">
      <div className="text-xs font-black tracking-widest text-[#00ff66] border-b border-[#26262b] pb-2 mb-4 uppercase">
        01 // GIT_COMMIT_PIPELINE_SYNC
      </div>

      <form onSubmit={handleSyncTransmission} className="space-y-4">
        <Input
          label="Target Repository Link (MANDATORY)"
          type="url"
          required
          disabled={syncing}
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/mahmoud/supportnest"
        />

        <Input
          label="Verification Commit Link (OPTIONAL)"
          type="url"
          disabled={syncing}
          value={commitUrl}
          onChange={(e) => setCommitUrl(e.target.value)}
          placeholder="https://github.com/mahmoud/supportnest/commit/abc1234"
        />

        <div>
          <label className="block text-[10px] font-black tracking-widest text-[#8a8a93] mb-1 uppercase">
            Architectural Commit Notes
          </label>
          <textarea
            rows={3}
            disabled={syncing}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document optimizations or refactors executed during this session..."
            className="w-full bg-[#0a0a0c] border-2 border-[#26262b] focus:border-[#00ff66] focus:outline-none p-2.5 font-mono text-xs text-white resize-none"
          />
        </div>

        <Button type="submit" variant="neon" className="w-full" disabled={syncing || !repoUrl.trim()}>
          {syncing ? 'TRANSMITTING...' : 'ENGAGE_REPOSITORY_SYNC'}
        </Button>
      </form>
    </div>
  );
};