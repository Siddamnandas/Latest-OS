'use client';

import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react';

export function ConnectionStatus() {
  const {
    isConnected,
    partnerPresence,
    syncEvents,
    taskEvents,
    memoryEvents,
    locationEvents,
    activityFeed
  } = useSocket();

  // Get recent activity (last 3 events total)
  const recentActivity = [
    ...syncEvents.slice(0, 1),
    ...taskEvents.slice(0, 1),
    ...memoryEvents.slice(0, 1),
    ...locationEvents.slice(0, 1),
    ...activityFeed.slice(0, 1)
  ].slice(0, 3);

  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {isConnected ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
          Couple Connection
          <Badge className={`ml-auto ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isConnected ? partnerPresence.online ? 'Both Online ✨' : 'Online 🟢' : 'Offline 🔴'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="bg-white/60 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Real-time Status</span>
            <div className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${partnerPresence.online ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
              <span className="text-xs text-gray-600">
                {partnerPresence.online ? `Both partners connected 💕` : `Waiting for ${partnerPresence.partner}...`}
              </span>
            </div>
          </div>

          {partnerPresence.activity && (
            <div className="text-xs text-gray-600 mt-1">
              🟢 {partnerPresence.partner} is {partnerPresence.activity}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Activity className="w-4 h-4 text-blue-600" />
              Recent Partner Activity
            </div>

            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <div key={index} className="bg-white/40 rounded-md p-2 text-xs text-gray-700 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {('partner' in activity) ? activity.partner :
                       ('updatedBy' in activity) ? activity.updatedBy :
                       ('createdBy' in activity) ? activity.createdBy : 'Partner'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-600">
                    {'activity' in activity ? activity.activity :
                     'updatedBy' in activity ? `Updated task` :
                     'createdBy' in activity ? `Created memory` :
                     'location' in activity ? `Shared location: ${activity.location.address}` : 'Partner activity'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Connection Lost</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Real-time updates paused. Sync will resume when connection is restored.
            </p>
          </div>
        )}

        {/* Activity Summary */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-green-200">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{syncEvents.length}</div>
            <div className="text-xs text-gray-600">Syncs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{taskEvents.length}</div>
            <div className="text-xs text-gray-600">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{memoryEvents.length}</div>
            <div className="text-xs text-gray-600">Memories</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-pink-600">{activityFeed.length}</div>
            <div className="text-xs text-gray-600">Activities</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
