import { Button } from '@/components/ui/Button.tsx';
import { Input } from '@/components/ui/Input.tsx';
import { useAuth } from '@/context/AuthContext.tsx';
import { userService } from '@/features/settings/services/user.ts';
import React, { useState } from 'react';


export const SettingsPanel: React.FC = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [preferredInterviewTime, setPreferredInterviewTime] = useState(
    user?.preferredInterviewTime ?? '09:00'
  );
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const hasChanges =
    name.trim() !== (user?.name ?? '') ||
    preferredInterviewTime !== (user?.preferredInterviewTime ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSaving(true);
    setStatusMsg(null);
    try {
      const payload: { name?: string; preferredInterviewTime?: string } = {};
      if (name.trim() !== user?.name) payload.name = name.trim();
      if (preferredInterviewTime !== user?.preferredInterviewTime) {
        payload.preferredInterviewTime = preferredInterviewTime;
      }

      const response = await userService.updateProfile(payload);
      setUser(response.data.data.user);
      setStatusMsg({ text: 'Profile updated successfully.', type: 'success' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg space-y-6 font-mono">
      <div>
        <h1 className="text-xl font-black text-white tracking-tight uppercase mb-1">OPERATOR_PROFILE_CONFIG</h1>
        <p className="text-xs text-[#8a8a93]">UPDATE YOUR NAME AND DAILY SESSION SCHEDULE</p>
      </div>

      <div className="bg-[#121215] border-2 border-[#26262b] p-6 shadow-brutal">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Operator Name"
            type="text"
            required
            disabled={saving}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Daily Session Launch Time (HH:MM)"
            type="text"
            required
            disabled={saving}
            value={preferredInterviewTime}
            onChange={(e) => setPreferredInterviewTime(e.target.value)}
            placeholder="09:00"
          />

          <div className="bg-[#0a0a0c] border border-[#26262b] p-2.5 text-[10px] text-[#8a8a93] leading-relaxed">
            Email cannot currently be changed.{' '}
            <span className="text-white font-bold">{user.email}</span>
          </div>

          {statusMsg && (
            <div
              className={`p-2 text-xs uppercase font-bold border ${
                statusMsg.type === 'success'
                  ? 'border-[#00ff66] text-[#00ff66] bg-[#00ff66]/5'
                  : 'border-[#ff0033] text-[#ff0033] bg-[#ff0033]/5'
              }`}
            >
              {statusMsg.type === 'success' ? '✓' : '⚠️'} {statusMsg.text}
            </div>
          )}

          <Button type="submit" variant="neon" className="w-full" disabled={saving || !hasChanges}>
            {saving ? 'SAVING...' : 'SAVE_CHANGES'}
          </Button>
        </form>
      </div>
    </div>
  );
};