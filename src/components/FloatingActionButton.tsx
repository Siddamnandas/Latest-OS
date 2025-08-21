'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Heart, Brain, Mic, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FABAction {
  id: string;
  icon: any;
  label: string;
  color: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainIcon?: any;
  position?: 'bottom-right' | 'bottom-left' | 'center-bottom';
}

export function FloatingActionButton({ 
  actions, 
  mainIcon: MainIcon = Plus,
  position = 'bottom-right' 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Default actions if none provided
  const defaultActions: FABAction[] = [
    {
      id: 'daily-sync',
      icon: MessageSquare,
      label: 'Daily Sync',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        toast({
          title: "Daily Sync Started",
          description: "Quick sync initiated! 📝",
          duration: 2000,
        });
        setIsOpen(false);
      }
    },
    {
      id: 'add-memory',
      icon: Heart,
      label: 'Add Memory',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => {
        toast({
          title: "Memory Recording",
          description: "Ready to capture a special moment! 💝",
          duration: 2000,
        });
        setIsOpen(false);
      }
    },
    {
      id: 'ai-coach',
      icon: Brain,
      label: 'AI Coach',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        toast({
          title: "AI Coach Ready",
          description: "How can I help your relationship today? 🤖",
          duration: 2000,
        });
        setIsOpen(false);
      }
    },
    {
      id: 'voice-command',
      icon: Mic,
      label: 'Voice Command',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => {
        toast({
          title: "Voice Activated",
          description: "Listening for your command... 🎤",
          duration: 2000,
        });
        setIsOpen(false);
      }
    }
  ];

  const fabActions = actions || defaultActions;

  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-24 right-6',
    'bottom-left': 'bottom-24 left-6',
    'center-bottom': 'bottom-24 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div 
      ref={fabRef}
      className={`fixed ${positionClasses[position]} z-50`}
    >
      <AnimatePresence>
        {isOpen && (
          <div className="space-y-3 mb-4">
            {fabActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  y: 20, 
                  scale: 0.8,
                  transition: { duration: 0.2 }
                }}
                className="flex items-end gap-3"
              >
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.1 + 0.1 }
                  }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap shadow-lg"
                >
                  {action.label}
                </motion.span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className={`${action.color} w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center`}
                >
                  <action.icon className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-white opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Icon animation */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MainIcon className="w-8 h-8" />}
        </motion.div>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 border-2 border-white rounded-full"
          animate={{
            scale: [1, 1.3, 1.5],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.button>
    </div>
  );
}