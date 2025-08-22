'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

interface MagicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

export function MagicButton({ children, onClick, className = '', variant = 'default', size = 'default', disabled = false }: MagicButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    const newSparkles = [];
    for (let i = 0; i < 6; i++) {
      newSparkles.push({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50
      });
    }
    setSparkles(newSparkles);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTimeout(() => setSparkles([]), 300);
  };

  return (
    <div className="relative inline-block">
      {/* Sparkle effects */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `calc(50% + ${sparkle.x}px)`,
            top: `calc(50% + ${sparkle.y}px)`,
            animationDuration: '0.5s'
          }}
        >
          <Star className="w-2 h-2 text-yellow-400 fill-current" />
        </div>
      ))}
      
      <Button
        onClick={onClick}
        className={`${className} transition-all duration-300 transform ${
          isHovering ? 'scale-105 shadow-lg' : ''
        } relative overflow-hidden`}
        variant={variant}
        size={size}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full animate-shimmer" />
        
        <div className="flex items-center gap-2">
          {children}
          {isHovering && <Sparkles className="w-4 h-4 animate-spin" />}
        </div>
      </Button>
    </div>
  );
}