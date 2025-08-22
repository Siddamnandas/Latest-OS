'use client';

import { useState, useEffect } from 'react';

interface FloatingEmojiProps {
  emoji: string;
  count?: number;
  duration?: number;
  trigger: boolean;
}

interface FloatingEmojiInstance {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocity: { x: number; y: number };
}

export function FloatingEmoji({ emoji, count = 5, duration = 2000, trigger }: FloatingEmojiProps) {
  const [emojis, setEmojis] = useState<FloatingEmojiInstance[]>([]);

  useEffect(() => {
    if (trigger) {
      const newEmojis: FloatingEmojiInstance[] = [];
      
      for (let i = 0; i < count; i++) {
        newEmojis.push({
          id: Date.now() + i,
          x: Math.random() * 80 + 10,
          y: 100,
          size: Math.random() * 20 + 20,
          opacity: 1,
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: -Math.random() * 3 - 2
          }
        });
      }
      
      setEmojis(newEmojis);
      
      const interval = setInterval(() => {
        setEmojis(prev => 
          prev.map(emoji => ({
            ...emoji,
            x: emoji.x + emoji.velocity.x,
            y: emoji.y + emoji.velocity.y,
            opacity: Math.max(0, emoji.opacity - 0.02),
            velocity: {
              x: emoji.velocity.x * 0.98,
              y: emoji.velocity.y + 0.05
            }
          })).filter(emoji => emoji.opacity > 0 && emoji.y < 150)
        );
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        setEmojis([]);
      }, duration);
    }
  }, [trigger, count, duration, emoji]);

  if (emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {emojis.map(emojiInstance => (
        <div
          key={emojiInstance.id}
          className="absolute select-none"
          style={{
            left: `${emojiInstance.x}%`,
            top: `${emojiInstance.y}%`,
            fontSize: `${emojiInstance.size}px`,
            opacity: emojiInstance.opacity,
            transform: `rotate(${emojiInstance.x * 2}deg)`,
            transition: 'all 0.1s ease-out'
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}