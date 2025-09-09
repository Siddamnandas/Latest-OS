'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Shield,
  Database,
  Eye,
  Globe,
  Bell,
  AlertCircle,
  CheckCircle2,
  X,
  Lock,
  Users,
  Heart,
  Brain,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (consents: PrivacyConsents) => void;
}

export interface PrivacyConsents {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  location: boolean;
  camera: boolean;
  microphone: boolean;
  notifications: boolean;
  dataSharing: boolean;
  aiPersonalization: boolean;
  partnerDataLinking: boolean;
}

export function PrivacyConsentModal({ isOpen, onClose, onAccept }: PrivacyConsentModalProps) {
  const { toast } = useToast();
  const [consents, setConsents] = useState<PrivacyConsents>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    location: false,
    camera: true,
    microphone: false,
    notifications: true,
    dataSharing: false,
    aiPersonalization: true,
    partnerDataLinking: true
  });

  const [consentVersion] = useState("1.2.0");

  const handleConsentChange = (key: keyof PrivacyConsents, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));

    if (!value && key === 'essential') {
      toast({
        title: "Required Consent",
        description: "Essential services cannot be disabled - they enable the core functionality of our relationship platform.",
        duration: 3000,
      });
      setConsents(prev => ({ ...prev, essential: true }));
    }
  };

  const handleAccept = () => {
    // Validate required consents
    if (consents.essential) {
      onAccept(consents);

      toast({
        title: "✅ Privacy Settings Saved",
        description: "Your privacy preferences have been updated.",
        duration: 3000,
      });

      onClose();
    } else {
      toast({
        title: "Required Consent Missing",
        description: "Essential consent is required to continue.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDecline = () => {
    toast({
      title: "Privacy Policy Declined",
      description: "Access to relationship features requires consent acceptance.",
      variant: "destructive",
      duration: 3000,
    });

    // Could redirect to login or limited mode
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-bold">Privacy Settings</h1>
                <p className="text-sm opacity-90">Control your data & personalize your experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">

            {/* Consent Categories */}
            <div className="space-y-4">

              {/* Essential Consent */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-red-600" />
                    Essential Services
                    <Badge className="bg-red-100 text-red-700">Required</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Core Relationship Features</div>
                      <div className="text-sm text-gray-600">
                        Account management, relationship tracking, and essential app functionality
                      </div>
                    </div>
                    <Switch
                      checked={consents.essential}
                      onCheckedChange={(v) => handleConsentChange('essential', v)}
                      disabled
                    />
                  </div>
                  <div className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    This consent is required to use the app
                  </div>
                </CardContent>
              </Card>

              {/* Data Privacy */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Data & Privacy
                    <Badge className="bg-blue-100 text-blue-700">Recommended</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Analytics & Usage Insights</div>
                        <div className="text-sm text-gray-600">Anonymous app usage data to improve service quality</div>
                      </div>
                    </div>
                    <Switch
                      checked={consents.analytics}
                      onCheckedChange={(v) => handleConsentChange('analytics', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Personalized Notifications</div>
                          <div className="text-sm text-gray-600">Tailored reminders and relationship insights</div>
                        </div>
                      </div>
                      <Switch
                        checked={consents.notifications}
                        onCheckedChange={(v) => handleConsentChange('notifications', v)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">AI Personalization</div>
                        <div className="text-sm text-gray-600">Smart suggestions and relationship intelligence</div>
                      </div>
                    </div>
                    <Switch
                      checked={consents.aiPersonalization}
                      onCheckedChange={(v) => handleConsentChange('aiPersonalization', v)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Device Permissions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Device Access
                    <Badge className="bg-indigo-100 text-indigo-700">Optional</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Location Access</div>
                        <div className="text-sm text-gray-600">Cultural and weather-based recommendations</div>
                      </div>
                    </div>
                    <Switch
                      checked={consents.location}
                      onCheckedChange={(v) => handleConsentChange('location', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Camera Permission</div>
                          <div className="text-sm text-gray-600">Capture memories and relationship photos</div>
                        </div>
                      </div>
                      <Switch
                        checked={consents.camera}
                        onCheckedChange={(v) => handleConsentChange('camera', v)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partner Sharing */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-600" />
                    Partner & Relationship
                    <Badge className="bg-pink-100 text-pink-700">Private</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="font-medium">Partner Data Linking</div>
                        <div className="text-sm text-gray-600">Connect relationship data between partners (secure)</div>
                      </div>
                    </div>
                    <Switch
                      checked={consents.partnerDataLinking}
                      onCheckedChange={(v) => handleConsentChange('partnerDataLinking', v)}
                    />
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Privacy Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Your Privacy Rights</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      • All data is encrypted and GDPR compliant<br/>
                      • Private communications remain confidential between partners<br/>
                      • You can withdraw consent and delete data at any time<br/>
                      • No data is sold or shared with third parties for marketing
                    </p>
                    <div className="text-xs text-gray-500">
                      Privacy Policy Version {consentVersion} • Last updated: January 2024
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 shrink-0">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="flex-1"
            >
              Decline All
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Accept & Continue
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            By accepting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyConsentModal;
