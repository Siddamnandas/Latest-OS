'use client';

import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HomeDashboard } from '@/components/HomeDashboard';
import { TaskManagement } from '@/components/TaskManagement';
import { RitualSystem } from '@/components/RitualSystem';
import { GoalsHub } from '@/components/GoalsHub';
import { CoupleSyncSystem } from '@/components/CoupleSyncSystem';
import { KidsActivities } from '@/components/KidsActivities';
import { ProfileSettings } from '@/components/ProfileSettings';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [streak, setStreak] = useState(7);
  const [coins, setCoins] = useState(250);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  // Simulate daily login bonus
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      localStorage.setItem('lastLogin', today);
      setCoins(prev => prev + 50);
      setShowCelebration(true);
      toast({
        title: "Daily Bonus! 🎉",
        description: "You earned 50 Lakshmi Coins for logging in today!",
        duration: 3000,
      });
      
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [toast]);

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
      case 'sync':
        return <CoupleSyncSystem />;
      case 'kids':
        return <KidsActivities />;
      case 'profile':
        return <ProfileSettings streak={streak} coins={coins} />;
      default:
        return <HomeDashboard streak={streak} coins={coins} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
      <FloatingActionButton hide={activeTab === 'kids'} />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}