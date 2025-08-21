'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Share2,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Camera,
  Mic,
  FileText,
  Heart,
  Settings,
  BarChart3,
  Megaphone,
  ExternalLink,
  MapPin,
  Activity,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface PrivacySettings {
  dataEncryption: boolean;
  twoFactorAuth: boolean;
  biometricLock: boolean;
  autoLock: boolean;
  autoLockTime: number;
  screenshotProtection: boolean;
  readReceipts: boolean;
  locationSharing: boolean;
  activityStatus: boolean;
  backupEnabled: boolean;
  dataRetention: number;
}

interface SecurityAudit {
  id: string;
  type: 'login' | 'data_access' | 'settings_change' | 'export' | 'share';
  action: string;
  timestamp: string;
  device: string;
  location: string;
  status: 'success' | 'failed' | 'blocked';
}

interface DataSharingControl {
  id: string;
  name: string;
  description: string;
  category: 'essential' | 'analytics' | 'marketing' | 'third_party';
  enabled: boolean;
  required: boolean;
}

interface PrivacySecurityProps {
  currentUserId: string;
  onSettingsUpdate: (settings: PrivacySettings) => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
}

export function PrivacySecurity({ 
  currentUserId, 
  onSettingsUpdate, 
  onExportData, 
  onDeleteAccount 
}: PrivacySecurityProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState<PrivacySettings>({
    dataEncryption: true,
    twoFactorAuth: false,
    biometricLock: true,
    autoLock: true,
    autoLockTime: 5,
    screenshotProtection: true,
    readReceipts: false,
    locationSharing: false,
    activityStatus: true,
    backupEnabled: true,
    dataRetention: 365
  });

  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const securityAudits: SecurityAudit[] = [
    {
      id: '1',
      type: 'login',
      action: 'Successful login',
      timestamp: '2024-01-15T10:30:00Z',
      device: 'iPhone 14 Pro',
      location: 'Mumbai, India',
      status: 'success'
    },
    {
      id: '2',
      type: 'data_access',
      action: 'Exported relationship data',
      timestamp: '2024-01-14T15:45:00Z',
      device: 'iPhone 14 Pro',
      location: 'Mumbai, India',
      status: 'success'
    }
  ];

  const dataSharingControls: DataSharingControl[] = [
    {
      id: '1',
      name: 'Essential App Functionality',
      description: 'Required for core app features like syncing between partners',
      category: 'essential',
      enabled: true,
      required: true
    },
    {
      id: '2',
      name: 'Analytics & Improvement',
      description: 'Help us improve the app with anonymous usage data',
      category: 'analytics',
      enabled: true,
      required: false
    },
    {
      id: '3',
      name: 'Personalized Recommendations',
      description: 'AI-powered suggestions based on your relationship patterns',
      category: 'analytics',
      enabled: true,
      required: false
    }
  ];

  const getSecurityScore = () => {
    let score = 0;
    if (settings.dataEncryption) score += 20;
    if (settings.twoFactorAuth) score += 25;
    if (settings.biometricLock) score += 20;
    if (settings.autoLock) score += 15;
    if (settings.screenshotProtection) score += 10;
    if (settings.dataRetention <= 90) score += 10;
    return Math.min(score, 100);
  };

  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Weak', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const securityScore = getSecurityScore();
  const securityLevel = getSecurityLevel(securityScore);

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsUpdate(newSettings);
  };

  const getAuditIcon = (type: string) => {
    switch (type) {
      case 'login': return <Smartphone className="w-4 h-4" />;
      case 'data_access': return <Database className="w-4 h-4" />;
      case 'settings_change': return <Settings className="w-4 h-4" />;
      case 'export': return <FileText className="w-4 h-4" />;
      case 'share': return <Share2 className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getDataIcon = (category: string) => {
    switch (category) {
      case 'essential': return <Heart className="w-4 h-4 text-red-500" />;
      case 'analytics': return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'marketing': return <Megaphone className="w-4 h-4 text-green-500" />;
      case 'third_party': return <ExternalLink className="w-4 h-4 text-purple-500" />;
      default: return <Database className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className={`text-3xl font-bold ${securityLevel.color}`}>
                {securityScore}%
              </div>
              <div className="text-sm text-gray-600">Security Score</div>
              <Badge className={`mt-2 ${securityLevel.bg} ${securityLevel.color}`}>
                {securityLevel.level}
              </Badge>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {settings.twoFactorAuth ? 'Active' : 'Off'}
              </div>
              <div className="text-sm text-gray-600">Two-Factor Auth</div>
              {!settings.twoFactorAuth && (
                <Button size="sm" className="mt-2" variant="outline">
                  Enable
                </Button>
              )}
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {securityAudits.length}
              </div>
              <div className="text-sm text-gray-600">Recent Activities</div>
              <Button size="sm" className="mt-2" variant="outline">
                View All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="audit">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Read Receipts</div>
                    <div className="text-sm text-gray-500">Let your partner know when you've read messages</div>
                  </div>
                </div>
                <Switch
                  checked={settings.readReceipts}
                  onCheckedChange={(checked) => handleSettingChange('readReceipts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Location Sharing</div>
                    <div className="text-sm text-gray-500">Share location with partner for safety features</div>
                  </div>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => handleSettingChange('locationSharing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Activity Status</div>
                    <div className="text-sm text-gray-500">Show when you're active in the app</div>
                  </div>
                </div>
                <Switch
                  checked={settings.activityStatus}
                  onCheckedChange={(checked) => handleSettingChange('activityStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Screenshot Protection</div>
                    <div className="text-sm text-gray-500">Prevent screenshots in sensitive areas</div>
                  </div>
                </div>
                <Switch
                  checked={settings.screenshotProtection}
                  onCheckedChange={(checked) => handleSettingChange('screenshotProtection', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sharing & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataSharingControls.map((control) => (
                <div key={control.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDataIcon(control.category)}
                    <div>
                      <div className="font-medium">{control.name}</div>
                      <div className="text-sm text-gray-500">{control.description}</div>
                      <Badge variant="outline" className="mt-1">
                        {control.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {control.required && (
                      <Badge className="bg-blue-100 text-blue-700">Required</Badge>
                    )}
                    <Switch
                      checked={control.enabled}
                      onCheckedChange={(checked) => {
                        if (!control.required) {
                          // Handle sharing control update
                        }
                      }}
                      disabled={control.required}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">End-to-End Encryption</div>
                    <div className="text-sm text-gray-500">All data is encrypted between you and your partner</div>
                  </div>
                </div>
                <Switch
                  checked={settings.dataEncryption}
                  onCheckedChange={(checked) => handleSettingChange('dataEncryption', checked)}
                  disabled={true} // Always enabled for security
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                  </div>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Biometric Lock</div>
                    <div className="text-sm text-gray-500">Use fingerprint or face recognition to unlock</div>
                  </div>
                </div>
                <Switch
                  checked={settings.biometricLock}
                  onCheckedChange={(checked) => handleSettingChange('biometricLock', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Auto-Lock</div>
                    <div className="text-sm text-gray-500">Automatically lock app after inactivity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.autoLock}
                    onCheckedChange={(checked) => handleSettingChange('autoLock', checked)}
                  />
                  {settings.autoLock && (
                    <select
                      value={settings.autoLockTime}
                      onChange={(e) => handleSettingChange('autoLockTime', parseInt(e.target.value))}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value={1}>1 min</option>
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                    </select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Current Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">New Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                />
              </div>
              
              <Button className="w-full">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Auto Backup</div>
                    <div className="text-sm text-gray-500">Automatically backup your data to secure cloud storage</div>
                  </div>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => handleSettingChange('backupEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Data Retention</div>
                    <div className="text-sm text-gray-500">How long to keep your data</div>
                  </div>
                </div>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>6 months</option>
                  <option value={365}>1 year</option>
                  <option value={0}>Forever</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Data Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Data Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Export Your Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Download all your relationship data, memories, and conversations in a secure format.
                </p>
                <Button onClick={onExportData} variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium mb-2 text-red-800">Delete Account</h4>
                <p className="text-sm text-red-600 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  onClick={onDeleteAccount} 
                  variant="destructive" 
                  className="w-full"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {/* Security Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Security Activity Log</span>
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAudits.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAuditIcon(audit.type)}
                      <div>
                        <div className="font-medium">{audit.action}</div>
                        <div className="text-sm text-gray-500">
                          {audit.device} • {audit.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        {new Date(audit.timestamp).toLocaleDateString()}
                      </div>
                      {audit.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {audit.status === 'failed' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {audit.status === 'blocked' && (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Use Strong Passwords</div>
                    <div className="text-sm text-gray-600">
                      Create unique passwords and change them regularly
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Fingerprint className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Enable Biometric Lock</div>
                    <div className="text-sm text-gray-600">
                      Add an extra layer of security with fingerprint or face recognition
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Review Privacy Settings</div>
                    <div className="text-sm text-gray-600">
                      Regularly check and update your privacy preferences
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}