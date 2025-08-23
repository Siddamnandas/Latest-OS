'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Heart, 
  CheckSquare, 
  Camera, 
  User, 
  Menu,
  X,
  Wifi,
  WifiOff,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  description?: string;
}

interface MobileNavigationProps {
  isOnline?: boolean;
  notificationCount?: number;
  onSearch?: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOnline = true,
  notificationCount = 0,
  onSearch
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // Update active tab based on current path
    const currentPath = pathname.split('/')[1] || 'home';
    setActiveTab(currentPath);
  }, [pathname]);

  const mainNavItems: NavigationItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      description: 'Dashboard & overview'
    },
    {
      href: '/sync',
      label: 'Sync',
      icon: <Heart className="w-5 h-5" />,
      description: 'Daily relationship sync'
    },
    {
      href: '/tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: 3,
      description: 'Relationship tasks & goals'
    },
    {
      href: '/memories',
      label: 'Memories',
      icon: <Camera className="w-5 h-5" />,
      description: 'Capture special moments'
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      description: 'Settings & preferences'
    }
  ];

  const secondaryNavItems: NavigationItem[] = [
    {
      href: '/rituals',
      label: 'Rituals',
      icon: <Heart className="w-5 h-5" />,
      description: 'Connection exercises'
    },
    {
      href: '/goals',
      label: 'Goals',
      icon: <CheckSquare className="w-5 h-5" />,
      description: 'Shared relationship goals'
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: <Home className="w-5 h-5" />,
      description: 'Relationship insights'
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: <User className="w-5 h-5" />,
      description: 'App configuration'
    }
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/home';
    }
    return pathname.startsWith(href);
  };

  const NavItem: React.FC<{ item: NavigationItem; onClick?: () => void }> = ({ 
    item, 
    onClick 
  }) => {
    const isActive = isActiveRoute(item.href);
    
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 active:scale-95 ${
          isActive 
            ? 'bg-purple-100 text-purple-700 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
        }`}
      >
        <div className="relative">
          {item.icon}
          {item.badge && item.badge > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 min-w-4 p-0 text-xs flex items-center justify-center"
            >
              {item.badge > 9 ? '9+' : item.badge}
            </Badge>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{item.label}</div>
          {item.description && (
            <div className="text-xs text-gray-500 truncate">{item.description}</div>
          )}
        </div>
      </Link>
    );
  };

  if (!isMobile) {
    // Desktop sidebar navigation
    return (
      <nav className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-purple-600">Latest-OS</h1>
            <div className="ml-auto flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              {notificationCount > 0 && (
                <Badge variant="destructive">{notificationCount}</Badge>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="px-4 space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
              
              <div className="py-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 pb-2">
                  More
                </div>
                {secondaryNavItems.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </div>
            </nav>
          </div>
        </div>
      </nav>
    );
  }

  // Mobile navigation
  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b">
                  <h2 className="text-lg font-semibold text-purple-600">Latest-OS</h2>
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1 mb-6">
                    {mainNavItems.map((item) => (
                      <NavItem 
                        key={item.href} 
                        item={item} 
                        onClick={() => setIsMenuOpen(false)}
                      />
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 pb-3">
                      More Options
                    </div>
                    <div className="space-y-1">
                      {secondaryNavItems.map((item) => (
                        <NavItem 
                          key={item.href} 
                          item={item} 
                          onClick={() => setIsMenuOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold text-purple-600 truncate">
            {mainNavItems.find(item => isActiveRoute(item.href))?.label || 'Latest-OS'}
          </h1>

          <div className="flex items-center gap-2">
            {onSearch && (
              <Button variant="ghost" size="sm" onClick={onSearch}>
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 min-w-4 p-0 text-xs"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mainNavItems.slice(0, 5).map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 h-full transition-all duration-200 active:scale-95 ${
                  isActive ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                <div className="relative mb-1">
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: 'w-5 h-5'
                  })}
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-3 min-w-3 p-0 text-xs"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className={`text-xs font-medium truncate max-w-full ${
                  isActive ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Add padding to prevent content from being hidden behind bottom nav */}
      <div className="h-16 lg:hidden" />
    </>
  );
};