'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: 'Feature Tour',
    description: 'Learn about the main features of Latest-OS.'
  },
  {
    title: 'Profile Setup',
    description: 'Set up your profile to personalize the experience.'
  }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const now = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem('onboardedAt', now);
      }
      try {
        await fetch('/api/user/onboard', { method: 'POST' });
      } catch (err) {
        console.error('Failed to record onboarding', err);
      }
      router.push('/');
    }
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{steps[step].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-700">{steps[step].description}</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={back} disabled={step === 0}>
              Back
            </Button>
            <Button onClick={next}>{step === steps.length - 1 ? 'Finish' : 'Next'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
