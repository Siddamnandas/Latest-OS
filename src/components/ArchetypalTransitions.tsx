'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchetypalTransitionsProps {
  fromArchetype?: 'krishna' | 'ram' | 'shiva';
  toArchetype?: 'krishna' | 'ram' | 'shiva';
  showTransition?: boolean;
  onTransitionComplete?: () => void;
  duration?: number;
  message?: string;
}

export function ArchetypalTransition({
  fromArchetype,
  toArchetype,
  showTransition = false,
  onTransitionComplete,
  duration = 2000,
  message = "Shifting energies..."
}: ArchetypalTransitionsProps) {
  const [isVisible, setIsVisible] = useState(showTransition);

  useEffect(() => {
    setIsVisible(showTransition);

    if (showTransition && onTransitionComplete) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onTransitionComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [showTransition, onTransitionComplete, duration]);

  const getArchetypeInfo = (archetype?: string) => {
    switch (archetype) {
      case 'krishna':
        return {
          emoji: '💙',
          color: 'from-blue-500 to-cyan-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          name: 'Krishna Energy'
        };
      case 'ram':
        return {
          emoji: '🤝',
          color: 'from-yellow-500 to-orange-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          name: 'Ram Energy'
        };
      case 'shiva':
        return {
          emoji: '🧘',
          color: 'from-purple-500 to-violet-500',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          name: 'Shiva Energy'
        };
      default:
        return {
          emoji: '🕉️',
          color: 'from-gray-500 to-slate-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          name: 'Sacred Energy'
        };
    }
  };

  const fromInfo = getArchetypeInfo(fromArchetype);
  const toInfo = getArchetypeInfo(toArchetype);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
          >
            {/* Archetype Transition Visual */}
            <div className="relative mb-6">
              {/* From Archetype */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0.8, opacity: 0.6 }}
                transition={{ duration: duration / 1000 / 2 }}
                className={`absolute inset-0 flex items-center justify-center`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${fromInfo.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                  {fromInfo.emoji}
                </div>
              </motion.div>

              {/* To Archetype */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: duration / 1000 / 2, delay: duration / 1000 / 2 }}
                className={`flex items-center justify-center`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${toInfo.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                  {toInfo.emoji}
                </div>
              </motion.div>

              {/* Transition Sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-2xl animate-pulse">✨</span>
              </motion.div>
            </div>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-gray-900 mb-2"
            >
              Energy Flowing... 🕉️
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-lg font-medium mb-4 ${fromInfo.textColor}`}
            >
              {fromArchetype && toArchetype
                ? `${fromInfo.name} → ${toInfo.name}`
                : 'Balancing Sacred Energies'
              }
            </motion.p>

            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000 }}
              className="w-full bg-gray-200 rounded-full h-2 mb-4"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000 }}
                className={`h-2 bg-gradient-to-r ${toInfo.color} rounded-full`}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600"
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing archetypal transitions
export function useArchetypalTransition() {
  const [transitionState, setTransitionState] = useState<{
    show: boolean;
    from: 'krishna' | 'ram' | 'shiva';
    to: 'krishna' | 'ram' | 'shiva';
    message?: string;
    duration?: number;
  }>({
    show: false,
    from: 'krishna',
    to: 'krishna'
  });

  const triggerTransition = (
    from: 'krishna' | 'ram' | 'shiva',
    to: 'krishna' | 'ram' | 'shiva',
    message?: string,
    duration?: number
  ) => {
    setTransitionState({
      show: true,
      from,
      to,
      message,
      duration
    });
  };

  const completeTransition = () => {
    setTransitionState(prev => ({ ...prev, show: false }));
  };

  return {
    transitionState,
    triggerTransition,
    completeTransition
  };
}

// Archetypal energy ripple effect component
export function ArchetypalRipple({
  archetype,
  intensity = 3,
  duration = 2000
}: {
  archetype: 'krishna' | 'ram' | 'shiva';
  intensity?: number;
  duration?: number;
}) {
  const getRippleColor = (archetype: string) => {
    switch (archetype) {
      case 'krishna':
        return 'border-blue-400';
      case 'ram':
        return 'border-yellow-400';
      case 'shiva':
        return 'border-purple-400';
      default:
        return 'border-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]">
      {[...Array(intensity)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: duration / 1000,
            delay: (i * duration) / (intensity * 1000),
            ease: "easeOut"
          }}
          className={`absolute inset-0 border-2 ${getRippleColor(archetype)} rounded-full`}
        />
      ))}
    </div>
  );
}

export default ArchetypalTransition;
