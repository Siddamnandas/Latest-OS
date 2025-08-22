'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  colors?: string[];
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
  rotationSpeed: number;
}

export function InteractiveConfetti({ trigger, duration = 3000, colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'] }: ConfettiProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const pieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)]!,
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: Math.random() * 3 + 2
          },
          rotationSpeed: (Math.random() - 0.5) * 10
        });
      }
      
      setConfettiPieces(pieces);
      
      setTimeout(() => {
        setIsActive(false);
        setConfettiPieces([]);
      }, duration);
    }
  }, [trigger, colors, duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setConfettiPieces(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.velocity.x,
          y: piece.y + piece.velocity.y,
          rotation: piece.rotation + piece.rotationSpeed,
          velocity: {
            x: piece.velocity.x * 0.99,
            y: piece.velocity.y + 0.1
          }
        })).filter(piece => piece.y < 120)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive || confettiPieces.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 1 - (piece.y / 120),
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        />
      ))}
    </div>,
    document.body
  );
}