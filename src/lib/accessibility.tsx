// Kids Activities Accessibility System
'use client';

// Production-ready accessibility features for inclusive design

import React from 'react';
import { logger } from '@/lib/logger';

// Accessibility configuration
export interface AccessibilityConfig {
  screenReaderSupport: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceNavigation: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  colorBlindSupport: boolean;
  focusManagement: boolean;
  semanticHtml: boolean;
}

// Default accessibility settings
export const defaultA11yConfig: AccessibilityConfig = {
  screenReaderSupport: true,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  voiceNavigation: false,
  keyboardNavigation: true,
  audioDescriptions: false,
  colorBlindSupport: false,
  focusManagement: true,
  semanticHtml: true
};

// Accessibility Context
export const AccessibilityContext = React.createContext<{
  config: AccessibilityConfig;
  updateConfig: (updates: Partial<AccessibilityConfig>) => void;
}>({
  config: defaultA11yConfig,
  updateConfig: () => {}
});

// Accessibility Provider
export function AccessibilityProvider({ 
  children, 
  initialConfig = defaultA11yConfig 
}: { 
  children: React.ReactNode; 
  initialConfig?: AccessibilityConfig;
}) {
  const [config, setConfig] = React.useState<AccessibilityConfig>(initialConfig);

  const updateConfig = React.useCallback((updates: Partial<AccessibilityConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Apply accessibility settings to document
      applyAccessibilitySettings(newConfig);
      
      // Log accessibility changes
      logger.info('Accessibility settings updated', { 
        updates, 
        newConfig 
      });
      
      return newConfig;
    });
  }, []);

  // Apply initial settings
  React.useEffect(() => {
    applyAccessibilitySettings(config);
  }, []);

  return (
    <AccessibilityContext.Provider value={{ config, updateConfig }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export function useAccessibility() {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// Apply accessibility settings to document
function applyAccessibilitySettings(config: AccessibilityConfig) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  const body = document.body;

  // High contrast mode
  if (config.highContrast) {
    html.classList.add('high-contrast');
  } else {
    html.classList.remove('high-contrast');
  }

  // Large text mode
  if (config.largeText) {
    html.classList.add('large-text');
  } else {
    html.classList.remove('large-text');
  }

  // Reduced motion
  if (config.reducedMotion) {
    html.classList.add('reduced-motion');
  } else {
    html.classList.remove('reduced-motion');
  }

  // Color blind support
  if (config.colorBlindSupport) {
    html.classList.add('colorblind-support');
  } else {
    html.classList.remove('colorblind-support');
  }

  // Focus management
  if (config.focusManagement) {
    html.classList.add('focus-management');
  } else {
    html.classList.remove('focus-management');
  }
}

// Screen Reader only component
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Live region for announcements
export function LiveRegion({ 
  children, 
  level = 'polite' 
}: { 
  children: React.ReactNode; 
  level?: 'polite' | 'assertive';
}) {
  return (
    <div 
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Skip to main content link
export function SkipToMainLink() {
  return (
    <a
      href="#main-content"
      className="skip-to-main absolute -top-10 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded focus:top-4 transition-all duration-200"
      onFocus={(e) => e.currentTarget.classList.add('top-4')}
      onBlur={(e) => e.currentTarget.classList.remove('top-4')}
    >
      Skip to main content
    </a>
  );
}

// Accessible button component
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  variant = 'primary',
  size = 'default',
  type = 'button',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}) {
  const { config } = useAccessibility();

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  const sizeClasses = {
    sm: config.largeText ? 'h-10 px-4 py-2 text-base' : 'h-8 px-3 py-1 text-sm',
    default: config.largeText ? 'h-12 px-6 py-3 text-lg' : 'h-10 px-4 py-2',
    lg: config.largeText ? 'h-14 px-8 py-4 text-xl' : 'h-12 px-8 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Accessible form field component
export function AccessibleFormField({
  label,
  id,
  children,
  error,
  description,
  required = false,
  className = ''
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
}) {
  const { config } = useAccessibility();
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={id}
        className={`block font-medium ${config.largeText ? 'text-lg' : 'text-sm'} ${
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      {description && (
        <p 
          id={descriptionId}
          className={`${config.largeText ? 'text-base' : 'text-sm'} text-gray-600 dark:text-gray-400`}
        >
          {description}
        </p>
      )}
      
      <div className="relative">
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
                id,
                'aria-invalid': error ? 'true' : undefined,
                'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
                className: `${child.props.className || ''} ${
                  error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`
              })
            : child
        )}
      </div>
      
      {error && (
        <p 
          id={errorId}
          role="alert"
          className={`${config.largeText ? 'text-base' : 'text-sm'} text-red-600 dark:text-red-400`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible modal component
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
  closeOnOverlayClick = true
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}) {
  const { config } = useAccessibility();
  const [previousFocus, setPreviousFocus] = React.useState<HTMLElement | null>(null);

  // Manage focus when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setPreviousFocus(document.activeElement as HTMLElement);
      // Focus first focusable element in modal
      const modal = document.querySelector('[role="dialog"]');
      const firstFocusable = modal?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      firstFocusable?.focus();
    } else if (previousFocus) {
      previousFocus.focus();
    }
  }, [isOpen, previousFocus]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`w-full ${sizeClasses[size]} bg-white dark:bg-gray-900 rounded-lg shadow-xl ${
          config.reducedMotion ? '' : 'animate-in fade-in zoom-in-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 
            id="modal-title"
            className={`font-semibold ${config.largeText ? 'text-xl' : 'text-lg'}`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Accessible tooltip component
export function AccessibleTooltip({
  children,
  content,
  placement = 'top'
}: {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const tooltipId = React.useId();

  const showTooltip = isVisible || isFocused;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-describedby={showTooltip ? tooltipId : undefined}
      >
        {children}
      </div>
      
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg ${
            placement === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2' :
            placement === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-2' :
            placement === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-2' :
            'left-full top-1/2 transform -translate-y-1/2 ml-2'
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

// Accessible announcement hook
export function useAnnouncement() {
  const [announcement, setAnnouncement] = React.useState<string>('');

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message);
    
    // Clear announcement after a delay to allow screen readers to announce it
    setTimeout(() => setAnnouncement(''), 1000);
    
    logger.debug('Screen reader announcement', { message, priority });
  }, []);

  return {
    announce,
    AnnouncementRegion: () => (
      <LiveRegion level="polite">
        {announcement}
      </LiveRegion>
    )
  };
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement }>,
  options: {
    wrap?: boolean;
    orientation?: 'horizontal' | 'vertical';
    onSelect?: (id: string) => void;
  } = {}
) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { wrap = true, orientation = 'vertical', onSelect } = options;

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    const isNext = (orientation === 'vertical' && e.key === 'ArrowDown') ||
                   (orientation === 'horizontal' && e.key === 'ArrowRight');
    const isPrev = (orientation === 'vertical' && e.key === 'ArrowUp') ||
                   (orientation === 'horizontal' && e.key === 'ArrowLeft');

    if (isNext) {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev + 1;
        return wrap ? next % items.length : Math.min(next, items.length - 1);
      });
    } else if (isPrev) {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev - 1;
        return wrap ? (next < 0 ? items.length - 1 : next) : Math.max(next, 0);
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem && onSelect) {
        onSelect(activeItem.id);
      }
    }
  }, [items, activeIndex, wrap, orientation, onSelect]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    activeIndex,
    setActiveIndex
  };
}