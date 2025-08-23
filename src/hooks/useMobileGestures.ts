'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
  allowedTime?: number;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

interface GestureState {
  isDragging: boolean;
  startPos: TouchPosition | null;
  currentPos: TouchPosition | null;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false,
    allowedTime = 300
  } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    isDragging: false,
    startPos: null,
    currentPos: null,
    direction: null,
    distance: 0
  });

  const startPosRef = useRef<TouchPosition | null>(null);
  const elemRef = useRef<HTMLElement | null>(null);

  const getTouchPosition = useCallback((e: TouchEvent): TouchPosition => {
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const calculateDistance = useCallback((start: TouchPosition, end: TouchPosition) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }, []);

  const getSwipeDirection = useCallback((start: TouchPosition, end: TouchPosition) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const pos = getTouchPosition(e);
    startPosRef.current = pos;
    
    setGestureState({
      isDragging: true,
      startPos: pos,
      currentPos: pos,
      direction: null,
      distance: 0
    });

    if (preventScroll) {
      e.preventDefault();
    }
  }, [getTouchPosition, preventScroll]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startPosRef.current) return;
    
    const currentPos = getTouchPosition(e);
    const distance = calculateDistance(startPosRef.current, currentPos);
    const direction = getSwipeDirection(startPosRef.current, currentPos);
    
    setGestureState(prev => ({
      ...prev,
      currentPos,
      direction,
      distance
    }));

    if (preventScroll && distance > 10) {
      e.preventDefault();
    }
  }, [getTouchPosition, calculateDistance, getSwipeDirection, preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!startPosRef.current) return;
    
    const endPos = getTouchPosition(e);
    const distance = calculateDistance(startPosRef.current, endPos);
    const direction = getSwipeDirection(startPosRef.current, endPos);
    const duration = endPos.time - startPosRef.current.time;
    
    // Reset state
    setGestureState({
      isDragging: false,
      startPos: null,
      currentPos: null,
      direction: null,
      distance: 0
    });
    
    // Check if it's a valid swipe
    if (distance >= threshold && duration <= allowedTime) {
      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
    }
    
    startPosRef.current = null;
  }, [getTouchPosition, calculateDistance, getSwipeDirection, threshold, allowedTime, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const bindGestures = useCallback((element: HTMLElement | null) => {
    if (elemRef.current) {
      elemRef.current.removeEventListener('touchstart', handleTouchStart);
      elemRef.current.removeEventListener('touchmove', handleTouchMove);
      elemRef.current.removeEventListener('touchend', handleTouchEnd);
    }
    
    elemRef.current = element;
    
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
      element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (elemRef.current) {
        elemRef.current.removeEventListener('touchstart', handleTouchStart);
        elemRef.current.removeEventListener('touchmove', handleTouchMove);
        elemRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    gestureState,
    bindGestures
  };
};

// Hook for pull-to-refresh gesture
export const usePullToRefresh = (onRefresh: () => Promise<void> | void, threshold = 60) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const { gestureState, bindGestures } = useSwipeGesture({
    onSwipeDown: async () => {
      if (gestureState.distance > threshold && window.scrollY === 0) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setIsPulling(false);
          setPullDistance(0);
        }
      }
    },
    threshold: threshold / 2,
    preventScroll: true
  });

  useEffect(() => {
    if (gestureState.isDragging && gestureState.direction === 'down' && window.scrollY === 0) {
      setIsPulling(true);
      setPullDistance(Math.min(gestureState.distance, threshold * 1.5));
    } else if (!gestureState.isDragging) {
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [gestureState, threshold]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    bindGestures,
    maxDistance: threshold
  };
};

// Hook for long press gesture
export const useLongPress = (onLongPress: () => void, duration = 500) => {
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const elemRef = useRef<HTMLElement | null>(null);

  const handleStart = useCallback(() => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
    }, duration);
  }, [onLongPress, duration]);

  const handleEnd = useCallback(() => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const bindLongPress = useCallback((element: HTMLElement | null) => {
    if (elemRef.current) {
      elemRef.current.removeEventListener('touchstart', handleStart);
      elemRef.current.removeEventListener('touchend', handleEnd);
      elemRef.current.removeEventListener('touchcancel', handleEnd);
      elemRef.current.removeEventListener('mousedown', handleStart);
      elemRef.current.removeEventListener('mouseup', handleEnd);
      elemRef.current.removeEventListener('mouseleave', handleEnd);
    }
    
    elemRef.current = element;
    
    if (element) {
      element.addEventListener('touchstart', handleStart, { passive: true });
      element.addEventListener('touchend', handleEnd, { passive: true });
      element.addEventListener('touchcancel', handleEnd, { passive: true });
      element.addEventListener('mousedown', handleStart);
      element.addEventListener('mouseup', handleEnd);
      element.addEventListener('mouseleave', handleEnd);
    }
  }, [handleStart, handleEnd]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (elemRef.current) {
        elemRef.current.removeEventListener('touchstart', handleStart);
        elemRef.current.removeEventListener('touchend', handleEnd);
        elemRef.current.removeEventListener('touchcancel', handleEnd);
        elemRef.current.removeEventListener('mousedown', handleStart);
        elemRef.current.removeEventListener('mouseup', handleEnd);
        elemRef.current.removeEventListener('mouseleave', handleEnd);
      }
    };
  }, [handleStart, handleEnd]);

  return {
    isPressed,
    bindLongPress
  };
};

export type { SwipeGestureOptions, GestureState, TouchPosition };