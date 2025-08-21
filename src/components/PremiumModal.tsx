'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Star } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGradient?: boolean;
  gradientColors?: string;
  badge?: string;
  icon?: ReactNode;
}

export function PremiumModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showGradient = true,
  gradientColors = 'from-purple-600 to-pink-600',
  badge,
  icon
}: PremiumModalProps) {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      default: return 'max-w-md';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className={`relative ${getSizeClasses()} w-full animate-bounce-in`}>
        {/* Gradient glow effect */}
        {showGradient && (
          <div className={`absolute -inset-4 bg-gradient-to-r ${gradientColors} rounded-3xl blur-2xl opacity-30 animate-pulse`}></div>
        )}
        
        {/* Main modal */}
        <div className="relative bg-white/95 backdrop-blur-lg border-0 shadow-2xl overflow-hidden rounded-3xl">
          {/* Header with gradient background */}
          <div className={`relative bg-gradient-to-r ${gradientColors} p-6 text-white`}>
            {/* Decorative elements */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
            
            {/* Header content */}
            <div className="flex items-start gap-4">
              {icon && (
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{title}</h2>
                  {badge && (
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {badge}
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className="text-white/80 text-sm">{description}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Specialized modals for different use cases
export function RewardModal({ 
  isOpen, 
  onClose, 
  coins, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  coins: number; 
  title: string;
}) {
  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Congratulations! You've earned coins for your activity."
      icon={<span className="text-2xl">🪙</span>}
      badge="Reward"
      gradientColors="from-yellow-500 to-orange-500"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg animate-bounce">
          +{coins}
        </div>
        <p className="text-gray-600">These coins have been added to your balance!</p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Later
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            Awesome!
          </Button>
        </div>
      </div>
    </PremiumModal>
  );
}

export function LevelUpModal({ 
  isOpen, 
  onClose, 
  level, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  level: number; 
  title: string;
}) {
  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={`Amazing! You've reached Level ${level}!`}
      icon={<span className="text-2xl">🏆</span>}
      badge="Level Up"
      gradientColors="from-purple-500 to-pink-500"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg animate-pulse">
          {level}
        </div>
        <p className="text-gray-600">Keep up the great work and continue strengthening your relationship!</p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Continue
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            Celebrate!
          </Button>
        </div>
      </div>
    </PremiumModal>
  );
}

export function MilestoneModal({ 
  isOpen, 
  onClose, 
  milestone, 
  description 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  milestone: string; 
  description: string;
}) {
  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={onClose}
      title="Milestone Achieved!"
      description={description}
      icon={<span className="text-2xl">🎯</span>}
      badge="Milestone"
      gradientColors="from-green-500 to-teal-500"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg animate-bounce">
          <Star className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{milestone}</h3>
        <p className="text-gray-600">This is a significant step in your relationship journey!</p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Share
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
          >
            Amazing!
          </Button>
        </div>
      </div>
    </PremiumModal>
  );
}