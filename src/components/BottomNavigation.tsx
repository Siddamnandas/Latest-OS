'use client';

import { useState } from 'react';
import { Home, List, Heart, Users, Settings, Baby, Calendar, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-purple-500 to-pink-500' },
    { id: 'tasks', label: 'Tasks', icon: List, color: 'from-blue-500 to-cyan-500' },
    { id: 'together', label: 'Together', icon: Sparkles, color: 'from-red-500 to-pink-500' },
    { id: 'rituals', label: 'Rituals', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'goals', label: 'Goals', icon: Users, color: 'from-green-500 to-emerald-500' },
    { id: 'kids', label: 'Kids', icon: Baby, color: 'from-teal-500 to-cyan-500' },
    { id: 'profile', label: 'Profile', icon: Settings, color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="flex justify-around items-center py-3 px-2 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`
              relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
              ${isActive 
                ? 'text-white shadow-lg transform scale-110' 
                : 'text-gray-400 hover:text-gray-600'
              }
            `}
          >
            {/* Background effect */}
            {isActive && (
              <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-xl blur-sm opacity-75`}></div>
            )}
            
            {/* Hover effect */}
            {isHovered && !isActive && (
              <div className="absolute inset-0 bg-gray-100 rounded-xl"></div>
            )}
            
            {/* Icon */}
            <div className={`relative z-10 transition-all duration-300 ${
              isActive ? 'text-white scale-110' : 'text-gray-400'
            }`}>
              <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
            </div>
            
            {/* Label */}
            <span className={`relative z-10 text-xs mt-1 font-medium transition-all duration-300 ${
              isActive ? 'text-white' : isHovered ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
            
            {/* Active indicator dot */}
            {isActive && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
