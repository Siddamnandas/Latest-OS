'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wifi, 
  WifiOff, 
  Cloud, 
  Smartphone, 
  RefreshCw, 
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Settings,
  BarChart3,
  Shield,
  Activity,
  MessageCircle,
  Trophy,
  Camera
} from 'lucide-react';

interface RefreshCwStatus {
  isOnline: boolean;
  lastRefreshCw: string;
  pendingUploads: number;
  pendingDownloads: number;
  syncInProgress: boolean;
  syncError: string | null;
}

interface OfflineData {
  conversations: number;
  activities: number;
  milestones: number;
  photos: number;
  totalSize: number;
}

interface RefreshCwQueueItem {
  id: string;
  type: 'conversation' | 'activity' | 'milestone' | 'photo' | 'settings';
  action: 'create' | 'update' | 'delete';
  timestamp: string;
  size: number;
  priority: 'high' | 'medium' | 'low';
}

interface OfflineModeProps {
  currentUserId: string;
  onRefreshCwNow: () => void;
  onClearOfflineData: () => void;
  onSettingsUpdate: (settings: any) => void;
}

export function OfflineMode({ 
  currentUserId, 
  onRefreshCwNow, 
  onClearOfflineData, 
  onSettingsUpdate 
}: OfflineModeProps) {
  const [activeTab, setActiveTab] = useState('status');
  const [syncStatus, setRefreshCwStatus] = useState<RefreshCwStatus>({
    isOnline: navigator.onLine,
    lastRefreshCw: new Date().toISOString(),
    pendingUploads: 3,
    pendingDownloads: 1,
    syncInProgress: false,
    syncError: null
  });

  const [offlineData, setOfflineData] = useState<OfflineData>({
    conversations: 45,
    activities: 12,
    milestones: 8,
    photos: 23,
    totalSize: 156 // MB
  });

  const [syncQueue, setRefreshCwQueue] = useState<RefreshCwQueueItem[]>([
    {
      id: '1',
      type: 'conversation',
      action: 'create',
      timestamp: new Date().toISOString(),
      size: 0.5,
      priority: 'high'
    },
    {
      id: '2',
      type: 'activity',
      action: 'update',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      size: 0.2,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'milestone',
      action: 'create',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      size: 0.1,
      priority: 'low'
    }
  ]);

  const [offlineSettings, setOfflineSettings] = useState({
    autoRefreshCw: true,
    wifiOnly: true,
    offlineMode: true,
    maxOfflineStorage: 500, // MB
    dataCompression: true,
    backgroundRefreshCw: true
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setRefreshCwStatus(prev => ({ ...prev, isOnline: true }));
      if (offlineSettings.autoRefreshCw) {
        handleAutoRefreshCw();
      }
    };

    const handleOffline = () => {
      setRefreshCwStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineSettings.autoRefreshCw]);

  const handleAutoRefreshCw = async () => {
    if (syncStatus.syncInProgress || !syncStatus.isOnline) return;

    setRefreshCwStatus(prev => ({ ...prev, syncInProgress: true, syncError: null }));

    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setRefreshCwStatus(prev => ({
        ...prev,
        syncInProgress: false,
        lastRefreshCw: new Date().toISOString(),
        pendingUploads: 0,
        pendingDownloads: 0
      }));

      setRefreshCwQueue([]);
    } catch (error) {
      setRefreshCwStatus(prev => ({
        ...prev,
        syncInProgress: false,
        syncError: 'RefreshCw failed. Please try again.'
      }));
    }
  };

  const handleRefreshCwNow = async () => {
    onRefreshCwNow();
    await handleAutoRefreshCw();
  };

  const formatFileSize = (mb: number) => {
    if (mb < 1) return `${Math.round(mb * 1024)} KB`;
    return `${mb} MB`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return <MessageCircle className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      case 'photo': return <Camera className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`text-center p-4 rounded-lg ${
              syncStatus.isOnline ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`text-2xl font-bold ${
                syncStatus.isOnline ? 'text-green-600' : 'text-red-600'
              }`}>
                {syncStatus.isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {syncStatus.pendingUploads + syncStatus.pendingDownloads}
              </div>
              <div className="text-sm text-gray-600">Pending RefreshCw</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatTimeAgo(syncStatus.lastRefreshCw)}
              </div>
              <div className="text-sm text-gray-600">Last RefreshCw</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatFileSize(offlineData.totalSize)}
              </div>
              <div className="text-sm text-gray-600">Offline Data</div>
            </div>
          </div>

          {syncStatus.syncError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">{syncStatus.syncError}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Button 
              onClick={handleRefreshCwNow} 
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
              className="flex-1"
            >
              {syncStatus.syncInProgress ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              RefreshCw Now
            </Button>
            <Button 
              variant="outline" 
              onClick={onClearOfflineData}
              className="flex-1"
            >
              <Database className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          {/* Offline Data Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Offline Data Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {offlineData.conversations}
                    </div>
                    <div className="text-xs text-gray-600">Conversations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {offlineData.activities}
                    </div>
                    <div className="text-xs text-gray-600">Activities</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {offlineData.milestones}
                    </div>
                    <div className="text-xs text-gray-600">Milestones</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {offlineData.photos}
                    </div>
                    <div className="text-xs text-gray-600">Photos</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Storage Used</span>
                    <span>{formatFileSize(offlineData.totalSize)} / {formatFileSize(offlineSettings.maxOfflineStorage)}</span>
                  </div>
                  <Progress 
                    value={(offlineData.totalSize / offlineSettings.maxOfflineStorage) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RefreshCw Progress */}
          {syncStatus.syncInProgress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  RefreshCw in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Uploading changes...</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-gray-600">
                    RefreshCwing 3 of 4 items. Please keep the app open.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          {/* RefreshCw Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  RefreshCw Queue
                </span>
                <Badge variant="outline">
                  {syncQueue.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncQueue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <div className="font-medium capitalize">
                          {item.type} • {item.action}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTimeAgo(item.timestamp)} • {formatFileSize(item.size)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      {syncStatus.isOnline && (
                        <Button size="sm" variant="outline">
                          RefreshCw Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {syncQueue.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>All data is synced! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* Offline Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Offline Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Auto RefreshCw</div>
                    <div className="text-sm text-gray-500">Automatically sync when online</div>
                  </div>
                </div>
                <Switch
                  checked={offlineSettings.autoRefreshCw}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...offlineSettings, autoRefreshCw: checked };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">WiFi Only</div>
                    <div className="text-sm text-gray-500">Only sync over WiFi connection</div>
                  </div>
                </div>
                <Switch
                  checked={offlineSettings.wifiOnly}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...offlineSettings, wifiOnly: checked };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Offline Mode</div>
                    <div className="text-sm text-gray-500">Store data for offline access</div>
                  </div>
                </div>
                <Switch
                  checked={offlineSettings.offlineMode}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...offlineSettings, offlineMode: checked };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Data Compression</div>
                    <div className="text-sm text-gray-500">Compress data to save space</div>
                  </div>
                </div>
                <Switch
                  checked={offlineSettings.dataCompression}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...offlineSettings, dataCompression: checked };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Background RefreshCw</div>
                    <div className="text-sm text-gray-500">RefreshCw data in background</div>
                  </div>
                </div>
                <Switch
                  checked={offlineSettings.backgroundRefreshCw}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...offlineSettings, backgroundRefreshCw: checked };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Maximum Offline Storage
                </label>
                <select
                  value={offlineSettings.maxOfflineStorage}
                  onChange={(e) => {
                    const newSettings = { ...offlineSettings, maxOfflineStorage: parseInt(e.target.value) };
                    setOfflineSettings(newSettings);
                    onSettingsUpdate(newSettings);
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={100}>100 MB</option>
                  <option value={250}>250 MB</option>
                  <option value={500}>500 MB</option>
                  <option value={1000}>1 GB</option>
                  <option value={2000}>2 GB</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* RefreshCw Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                RefreshCw Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">RefreshCw Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.3s</div>
                    <div className="text-sm text-gray-600">Avg RefreshCw Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Total RefreshCws</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Recent RefreshCw Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today</span>
                      <span className="text-green-600">12 syncs • All successful</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yesterday</span>
                      <span className="text-green-600">8 syncs • All successful</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last 7 days</span>
                      <span className="text-green-600">67 syncs • 98% success</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Data Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This month</span>
                      <span>45.2 MB uploaded • 12.1 MB downloaded</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last month</span>
                      <span>38.7 MB uploaded • 9.8 MB downloaded</span>
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