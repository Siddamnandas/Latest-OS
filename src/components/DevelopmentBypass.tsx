'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Play, AlertTriangle } from 'lucide-react';

export function DevelopmentBypass() {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      // Attempt to sign in with development bypass
      const result = await signIn('dev-bypass', {
        passcode: 'dev123',
        redirect: false,
      });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipAuthEnter = () => {
    console.log('🔓 Skipping authentication - proceeding to relationship features...');
    // Set a flag in localStorage to indicate we're skipping auth
    localStorage.setItem('dev_skip_auth', 'true');
    // Reload the page to reprocess without auth
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-2">
            <Key className="w-6 h-6 mr-2" />
            <CardTitle>Development Access</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">
            Development Mode Active
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-lg mb-2">🚀 Relationship Platform Ready</h3>
            <p className="text-sm text-gray-600">
              Your relationship intelligence platform is ready for testing!
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Choose your preferred authentication bypass:
            </p>
          </div>

          <div className="space-y-3">
            {/* Quick Login Option */}
            <Button
              onClick={handleQuickLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Quick Login (Passcode: dev123)
                </div>
              )}
            </Button>

            {/* Skip Auth Option */}
            <Button
              onClick={handleSkipAuthEnter}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50"
              size="lg"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Skip Authentication (Development)
            </Button>
          </div>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center">
              ✨ Ready to Test
            </h4>
            <div className="space-y-1 text-xs text-gray-700">
              <div>• Memory Recording System</div>
              <div>• Achievement Gamification</div>
              <div>• Relationship Analytics</div>
              <div>• Profile Management</div>
              <div>• Daily Sync Features</div>
            </div>
          </div>

          {/* Development Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This development access will only appear during development.
              Production will require proper authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
