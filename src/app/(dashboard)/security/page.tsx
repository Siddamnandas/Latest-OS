'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SecurityPage() {
  const [code, setCode] = useState('');

  const enable = async () => {
    await fetch('/api/security/totp/enable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Scan the QR code with your authenticator app and enter the code to enable.</p>
          <Input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="123456"
          />
          <Button onClick={enable}>Enable</Button>
        </CardContent>
      </Card>
    </div>
  );
}