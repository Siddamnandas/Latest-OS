'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Check if login was successful
        const session = await getSession();
        if (session) {
          router.push('/');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setEmail('arjun@example.com');
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: 'arjun@example.com',
        password: 'password123',
        redirect: false,
      });

      if (result?.error) {
        setError('Demo login failed');
      } else {
        const session = await getSession();
        if (session) {
          router.push('/');
        }
      }
    } catch (error) {
      setError('Demo login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleSkipSignIn = () => {
    // Set a cookie to indicate demo mode (accessible by middleware)
    document.cookie = 'demo-mode=true; path=/; max-age=' + (60 * 60 * 24 * 7); // 7 days
    // Redirect to homepage
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-rose-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Latest-OS relationship dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or try demo
                </span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Demo Login (Arjun & Priya)
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full" 
              onClick={handleSkipSignIn}
              disabled={loading}
            >
              Skip Sign In (Demo Mode)
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Test credentials:</span>
            <div className="mt-1 text-sm font-mono">
              <div>Email: arjun@example.com</div>
              <div>Password: password123</div>
            </div>
            <div className="mt-2 text-sm font-mono">
              <div>Or: priya@example.com</div>
              <div>Password: password123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}