'use client';

import { useState } from 'react';
import { useAmbientSensing } from '@/hooks/useAmbientSensing';
import { AmbientDataDisplay } from '@/components/ContextualNudgeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Bell,
  Globe,
  Download,
  Trash2,
  Eye,
  Lock,
  Users,
  Database,
  Cloud,
  Heart,
  Zap,
  Award
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsPage() {
  const { toast } = useToast();
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    // Privacy Settings
    dataCollection: true,
    locationTracking: false,
    cameraAccess: true,
    microphoneAccess: false,
    notificationPermission: true,
    analyticalData: true,

    // Partner Communication
    partnerSharing: true,
    intimacyFeatures: true,
    challengeSuggestions: true,
    moodSyncing: true,

    // Notification Preferences
    dailySyncReminders: true,
    conflictAlerts: false,
    affectionNudges: true,
    taskReminders: true,
    gamificationRewards: true,
    relationshipMilestones: true,

    // Data Management
    dataExportConsent: true,
    anonymousAnalytics: false,
    partnerAnalytics: false,
    backupEnabled: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // Show feedback for important privacy changes
    if (key === 'dataCollection' || key === 'locationTracking') {
      toast({
        title: value ? "Consent Given" : "Privacy Enhanced",
        description: value ?
          "Thank you for consenting to help improve our service." :
          "Your privacy is our priority. This data won't be collected.",
        duration: 2000,
      });
    }
  };

  const handleDataExport = async () => {
    if (exportLoading) return; // Prevent multiple requests

    setExportLoading(true);
    setExportError(null);

    toast({
      title: "Data Export Started",
      description: "Preparing your data for download...",
      duration: 3000,
    });

    try {
      // Simulate network check
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // Simulate backend request with potential failures
      const exportPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random backend failures (for testing)
          const shouldFail = Math.random() < 0.3; // 30% failure rate for testing

          if (shouldFail) {
            const errors = [
              'Database connection failed. Please try again in a few minutes.',
              'Data encryption failed. Please contact support.',
              'Storage quota exceeded. Please free up space and try again.',
              'Server timeout. The request took too long to complete.',
              'Authentication expired. Please refresh the page and try again.'
            ];
            reject(new Error(errors[Math.floor(Math.random() * errors.length)]));
          } else {
            resolve({
              exportedAt: new Date().toISOString(),
              userId: "user_123",
              data: {
                profile: {},
                tasks: [],
                memories: [],
                relationshipInsights: []
              }
            });
          }
        }, 2000); // Simulate 2-second processing time
      });

      const exportData = await exportPromise;

      // Create and download file
      try {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });

        if (blob.size === 0) {
          throw new Error('Export file is empty. Please contact support.');
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relationship-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "✅ Export Complete",
          description: "Your data has been downloaded successfully.",
          duration: 4000,
        });

      } catch (fileError) {
        throw new Error(`File creation failed: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during export.';

      setExportError(errorMessage);

      toast({
        title: "🚨 Export Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });

      console.error('Data export error:', error);

    } finally {
      setExportLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (deleteLoading) return; // Prevent multiple requests

    const confirmed = confirm('Are you sure you want to delete all your data? This action cannot be undone.');
    if (!confirmed) return;

    setDeleteLoading(true);
    setDeleteError(null);

    toast({
      title: "Deletion Started",
      description: "Processing your request to delete all data...",
      duration: 3000,
    });

    try {
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // Simulate deletion request with potential failures
      const deletionPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random backend failures (for testing)
          const shouldFail = Math.random() < 0.4; // 40% failure rate for testing

          if (shouldFail) {
            const deleteErrors = [
              'Authentication failed. Please log in again and try the deletion request.',
              'Database connection error. Your request has been queued and will be processed when the service is restored.',
              'Cannot delete: You have active subscription features. Please cancel subscriptions first.',
              'Deletion request rate limit exceeded. Please try again in 24 hours.',
              'Server maintenance in progress. Deletion will be available again shortly.',
              'Data validation error. Some of your data may be corrupted. Please contact support.'
            ];
            reject(new Error(deleteErrors[Math.floor(Math.random() * deleteErrors.length)]));
          } else {
            resolve('Data deletion request submitted successfully');
          }
        }, 3000); // Simulate 3-second processing time
      });

      const result = await deletionPromise;

      toast({
        title: "✅ Deletion Request Submitted",
        description: "Your data will be permanently deleted in 30 days as per GDPR requirements. You will receive a confirmation email.",
        duration: 6000,
      });

      // Show success alert with additional instructions
      setTimeout(() => {
        alert('✅ Data deletion confirmed!\n\n' +
              '• Your data will be permanently deleted in 30 days\n' +
              '• You\'ll receive email confirmation at the address on file\n' +
              '• During the grace period, you can contact support to cancel\n' +
              '• After 30 days, all data will be permanently removed');
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during data deletion. Please try again or contact support.';

      setDeleteError(errorMessage);

      toast({
        title: "🚨 Deletion Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });

      console.error('Data deletion error:', error);

    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
              <p className="text-white/80 text-sm">Privacy, notifications, and data management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 backdrop-blur-lg rounded-full px-3 py-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-white" />
                <span className="text-xs text-white">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Privacy & Data Consent */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Privacy & Data Consent
              <Badge className="ml-auto bg-red-100 text-red-700">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">Data Collection</div>
                    <div className="text-sm text-gray-600">Allow anonymous usage data to improve service</div>
                  </div>
                </div>
                <Switch
                  checked={settings.dataCollection}
                  onCheckedChange={(value) => updateSetting('dataCollection', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Location Services</div>
                    <div className="text-sm text-gray-600">City & region for cultural recommendations</div>
                  </div>
                </div>
                <Switch
                  checked={settings.locationTracking}
                  onCheckedChange={(value) => updateSetting('locationTracking', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Camera Access</div>
                    <div className="text-sm text-gray-600">For capturing memories and profile photos</div>
                  </div>
                </div>
                <Switch
                  checked={settings.cameraAccess}
                  onCheckedChange={(value) => updateSetting('cameraAccess', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Automatic Backup</div>
                    <div className="text-sm text-gray-600">Backup data to cloud securely</div>
                  </div>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(value) => updateSetting('backupEnabled', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              Partner Communication
              <Badge className="ml-auto bg-pink-100 text-pink-700">Private</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <div>
                    <div className="font-medium text-gray-900">Intimacy Features</div>
                    <div className="text-sm text-gray-600">Private romantic challenges and nudges</div>
                  </div>
                </div>
                <Switch
                  checked={settings.intimacyFeatures}
                  onCheckedChange={(value) => updateSetting('intimacyFeatures', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">Challenge Suggestions</div>
                    <div className="text-sm text-gray-600">AI-powered intimacy activity recommendations</div>
                  </div>
                </div>
                <Switch
                  checked={settings.challengeSuggestions}
                  onCheckedChange={(value) => updateSetting('challengeSuggestions', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Mood Syncing</div>
                    <div className="text-sm text-gray-600">Synchronize ambient settings between devices</div>
                  </div>
                </div>
                <Switch
                  checked={settings.moodSyncing}
                  onCheckedChange={(value) => updateSetting('moodSyncing', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Notifications
              <Badge className="ml-auto bg-indigo-100 text-indigo-700">Customizable</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Daily Sync Reminders</div>
                    <div className="text-sm text-gray-600">Gentle nudges for your daily check-in</div>
                  </div>
                </div>
                <Switch
                  checked={settings.dailySyncReminders}
                  onCheckedChange={(value) => updateSetting('dailySyncReminders', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">Task Reminders</div>
                    <div className="text-sm text-gray-600">Reminders for assigned and due tasks</div>
                  </div>
                </div>
                <Switch
                  checked={settings.taskReminders}
                  onCheckedChange={(value) => updateSetting('taskReminders', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Achievement Notifications</div>
                    <div className="text-sm text-gray-600">Celebrate gamification milestones</div>
                  </div>
                </div>
                <Switch
                  checked={settings.gamificationRewards}
                  onCheckedChange={(value) => updateSetting('gamificationRewards', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <div>
                    <div className="font-medium text-gray-900">Affection Nudges</div>
                    <div className="text-sm text-gray-600">Sweet messages and love gestures</div>
                  </div>
                </div>
                <Switch
                  checked={settings.affectionNudges}
                  onCheckedChange={(value) => updateSetting('affectionNudges', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-600" />
              Data Management
              <Badge className="ml-auto bg-orange-100 text-orange-700">GDPR</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-gray-900">Data Export</span>
                    {exportError && (
                      <div className="text-xs text-red-600 mt-1">⚠️ Previous attempt failed</div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleDataExport}
                    disabled={exportLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {exportLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {exportLoading ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Download a complete copy of your personal data including profile, tasks, memories, and relationship insights.
                </p>
                {exportError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    Last attempt failed: {exportError}
                  </div>
                )}
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-gray-900">Data Deletion</span>
                    {deleteError && (
                      <div className="text-xs text-red-600 mt-1">⚠️ Previous attempt failed</div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDataDeletion}
                    disabled={deleteLoading}
                    className="disabled:opacity-50"
                  >
                    {deleteLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    {deleteLoading ? 'Deleting...' : 'Delete Data'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Permanently delete all your data (30-day grace period). This action cannot be undone.
                </p>
                {deleteError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    Last attempt failed: {deleteError}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Privacy Assurance</h3>
                  <p className="text-sm text-gray-700">
                    Your privacy is protected by industry-standard encryption and GDPR compliance.
                    All private communication (nudges, challenges, affections) remain confidential between you and your partner only.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Contact Support",
                  description: "Opening support chat...",
                });
              }}
            >
              💬 Contact Support
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "App Info",
                  description: "Version 1.0.0 - © 2024 Relationship Platform",
                });
              }}
            >
              ℹ️ About App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
