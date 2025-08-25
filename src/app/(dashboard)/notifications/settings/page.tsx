'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function NotificationSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for saving preferences via API
    console.log('Preferences saved', { emailEnabled, pushEnabled });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notification Preferences</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch id="email" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          <Label htmlFor="email">Email Notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="push" checked={pushEnabled} onCheckedChange={setPushEnabled} />
          <Label htmlFor="push">Push Notifications</Label>
        </div>
        <Button type="submit">Save Preferences</Button>
      </form>
    </div>
  );
}

