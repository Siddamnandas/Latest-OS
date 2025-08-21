'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RecoveryPage() {
  const [code, setCode] = useState('');

  const recover = async () => {
    await fetch('/api/security/totp/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recovery code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Enter one of your recovery codes if you cannot access your authenticator app.</p>
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="recovery code" />
          <Button onClick={recover}>Verify</Button>
        </CardContent>
      </Card>
    </div>
  );
}

