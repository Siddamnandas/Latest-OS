'use client';

import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HomeDashboard } from '@/components/HomeDashboard';
import { TaskManagement } from '@/components/TaskManagement';
import { RitualSystem } from '@/components/RitualSystem';
import { GoalsHub } from '@/components/GoalsHub';
import { KidsActivities } from '@/components/KidsActivities';
import { ProfileSettings } from '@/components/ProfileSettings';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useToast } from '@/hooks/use-toast';
import { useLiveData } from '@/hooks/useLiveData';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { toast } = useToast();
  const { data: liveData, loading, error } = useLiveData();

  // Use live data or fallback to default values
  const streak = liveData?.stats.streak || 7;
  const coins = liveData?.stats.coins || 250;
  const relationshipLevel = liveData?.stats.relationshipLevel || 'Good Partners';
  const partnerA = liveData?.couple.partner_a || 'Arjun';
  const partnerB = liveData?.couple.partner_b || 'Priya';

  // Check for demo mode
  useEffect(() => {
    const checkDemoMode = () => {
      const cookies = document.cookie.split(';');
      const demoModeCookie = cookies.find(cookie => cookie.trim().startsWith('demo-mode='));
      setIsDemoMode(demoModeCookie?.includes('true') || false);
    };
    
    checkDemoMode();
  }, []);

  const exitDemoMode = () => {
    // Remove demo mode cookie
    document.cookie = 'demo-mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login
    window.location.href = '/login';
  };

  // Simulate daily login bonus
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today && liveData) {
      localStorage.setItem('lastLogin', today);
      // In a real app, this would call an API to update coins
      setShowCelebration(true);
      toast({
        title: "Daily Bonus! 🎉",
        description: "You earned 50 Lakshmi Coins for logging in today!",
        duration: 3000,
      });
      
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [toast, liveData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard streak={streak} coins={coins} />;
      case 'tasks':
        return <TaskManagement />;
      case 'rituals':
        return <RitualSystem />;
      case 'goals':
        return <GoalsHub />;
      case 'kids':
        return <KidsActivities />;
      case 'profile':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Profile Settings ⚙️</h2>
            <p className="text-gray-600 mb-4">Customize your experience and preferences.</p>
            <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 max-w-md mx-auto">
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-purple-600">{partnerA} & {partnerB}</h3>
                  <p className="text-sm text-gray-500">{liveData?.couple.city || 'Mumbai'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span>Current Streak:</span>
                  <span className="font-bold text-purple-600">{streak} days 🔥</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lakshmi Coins:</span>
                  <span className="font-bold text-yellow-600">{coins} 🪙</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Relationship Level:</span>
                  <span className="font-bold text-indigo-600">{relationshipLevel} ✨</span>
                </div>
                {liveData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Total Syncs:</span>
                      <span className="font-bold text-green-600">{liveData.stats.totalSyncs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completed Tasks:</span>
                      <span className="font-bold text-blue-600">{liveData.stats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Memories Created:</span>
                      <span className="font-bold text-pink-600">{liveData.stats.totalMemories}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-4 mt-4">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg mb-2">
                    Edit Profile
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg">
                    Settings
                  </button>
                </div>
                {loading && (
                  <div className="text-center text-sm text-gray-500">
                    Loading live data...
                  </div>
                )}
                {error && (
                  <div className="text-center text-sm text-red-500">
                    Using demo data (Database not connected)
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <HomeDashboard streak={streak} coins={coins} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">🔧 Demo Mode</span>
            <span>You're exploring without authentication</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={exitDemoMode}
            className="text-white hover:bg-white/20 h-6 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Exit
          </Button>
        </div>
      )}
      
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-bounce text-6xl">🎉</div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}