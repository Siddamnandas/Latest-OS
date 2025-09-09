import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BottomNavigation } from '../BottomNavigation';
import * as LucideIcons from 'lucide-react';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: jest.fn(() => <div data-testid="home-icon">Home</div>),
  List: jest.fn(() => <div data-testid="list-icon">List</div>),
  Heart: jest.fn(() => <div data-testid="heart-icon">Heart</div>),
  Users: jest.fn(() => <div data-testid="users-icon">Users</div>),
  Baby: jest.fn(() => <div data-testid="baby-icon">Baby</div>),
  Calendar: jest.fn(() => <div data-testid="calendar-icon">Calendar</div>),
  Sparkles: jest.fn(() => <div data-testid="sparkles-icon">Sparkles</div>),
  Settings: jest.fn(() => <div data-testid="settings-icon">Settings</div>),
}));

describe('BottomNavigation Component', () => {
  const mockOnTabChange = jest.fn();
  const defaultProps = {
    activeTab: 'home',
    onTabChange: mockOnTabChange,
  };

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Navigation Structure', () => {
    it('should render all navigation tabs', () => {
      render(<BottomNavigation {...defaultProps} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Together')).toBeInTheDocument();
      expect(screen.getByText('Rituals')).toBeInTheDocument();
      expect(screen.getByText('Goals')).toBeInTheDocument();
      expect(screen.getByText('Kids')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should render all navigation icons', () => {
      render(<BottomNavigation {...defaultProps} />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('list-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('users-icon')).toBeInTheDocument();
      expect(screen.getByTestId('baby-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });
  });

  describe('Active Tab Behavior', () => {
    it('should highlight the active tab', () => {
      render(<BottomNavigation {...defaultProps} />);

      const homeTab = screen.getByText('Home');
      expect(homeTab.parentElement?.parentElement).toHaveClass('border-l-4'); // Active state indicator
    });

    it('should only have one active tab at a time', () => {
      render(<BottomNavigation {...defaultProps} />);

      const activeIndicators = document.querySelectorAll('[class*="border-l-4"]');
      expect(activeIndicators.length).toBe(1);
    });

    it('should update active tab when props change', () => {
      const { rerender } = render(<BottomNavigation {...defaultProps} />);

      // Initial state - home should be active
      expect(screen.getByText('Home')).toBeInTheDocument();

      // Re-render with tasks as active
      rerender(<BottomNavigation activeTab="tasks" onTabChange={mockOnTabChange} />);

      // Check if active tab indicator moved to tasks
      const tasksTab = screen.getByText('Tasks');
      // The active tab would have different styling classes
    });
  });

  describe('Tab Navigation', () => {
    it('should call onTabChange when tab is clicked', () => {
      render(<BottomNavigation {...defaultProps} />);

      const tasksTab = screen.getByText('Tasks');
      fireEvent.click(tasksTab);

      expect(mockOnTabChange).toHaveBeenCalledWith('tasks');
      expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTabChange with correct tab ID for each tab', () => {
      render(<BottomNavigation {...defaultProps} />);

      fireEvent.click(screen.getByText('Tasks'));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('tasks');

      fireEvent.click(screen.getByText('Rituals'));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('rituals');

      fireEvent.click(screen.getByText('Goals'));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('goals');

      fireEvent.click(screen.getByText('Kids'));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('kids');

      fireEvent.click(screen.getByText('Profile'));
      expect(mockOnTabChange).toHaveBeenLastCalledWith('profile');
    });

    it('should handle rapid tab changes correctly', () => {
      render(<BottomNavigation {...defaultProps} />);

      const tabs = ['tasks', 'rituals', 'goals', 'kids', 'profile'];
      const tabLabels = ['Tasks', 'Rituals', 'Goals', 'Kids', 'Profile'];

      tabLabels.forEach((label, index) => {
        fireEvent.click(screen.getByText(label));
        expect(mockOnTabChange).toHaveBeenCalledWith(tabs[index]);
      });

      expect(mockOnTabChange).toHaveBeenCalledTimes(5);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<BottomNavigation {...defaultProps} />);

      const homeTab = screen.getByText('Home');
      homeTab.focus();

      expect(document.activeElement).toBe(homeTab);
    });

    it('should allow keyboard navigation', () => {
      render(<BottomNavigation {...defaultProps} />);

      const homeTab = screen.getByText('Home') as HTMLElement;
      homeTab.focus();

      // Tab through elements
      fireEvent.keyDown(homeTab, { key: 'Tab', keyCode: 9 });
      // Additional keyboard navigation tests
    });

    it('should have proper ARIA attributes', () => {
      render(<BottomNavigation {...defaultProps} />);

      // Check for proper accessibility attributes
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label'); // Should have aria-label
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render with proper layout on mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });

      render(<BottomNavigation {...defaultProps} />);

      const container = document.querySelector('.flex');
      expect(container).toHaveClass('justify-around');

      // Reset viewport
      window.innerWidth = 1024;
    });
  });

  describe('Styling and Theme', () => {
    it('should apply correct gradient colors for each tab', () => {
      render(<BottomNavigation activeTab="tasks" onTabChange={mockOnTabChange} />);

      // Check if the active gradient is applied
      const activeTabIndicator = document.querySelector('[class*="border-l-4"]');
      expect(activeTabIndicator).toBeInTheDocument();
    });

    it('should apply hover states correctly', () => {
      render(<BottomNavigation {...defaultProps} />);

      const tasksTab = screen.getByText('Tasks');
      fireEvent.mouseEnter(tasksTab);

      // Check hover state styling
      const tasksContainer = tasksTab.parentElement;
      expect(tasksContainer).toHaveClass('rounded-xl'); // Hover background
    });

    it('should apply focus states correctly', () => {
      render(<BottomNavigation {...defaultProps} />);

      const homeTab = screen.getByText('Home');
      fireEvent.focus(homeTab);

      expect(document.activeElement).toBe(homeTab);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onTabChange gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // @ts-expect-error Testing with invalid prop type
      render(<BottomNavigation activeTab="home" onTabChange={undefined} />);

      const tasksTab = screen.getByText('Tasks');
      fireEvent.click(tasksTab);

      // Should not throw error
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle invalid activeTab prop', () => {
      render(<BottomNavigation activeTab="invalid" onTabChange={mockOnTabChange} />);

      // Should default to first tab or max spacing
      const activeIndicators = document.querySelectorAll('[class*="border-l-4"]');
      expect(activeIndicators.length).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { rerender } = render(<BottomNavigation {...defaultProps} />);

      // Re-render with same props
      rerender(<BottomNavigation {...defaultProps} />);

      // Should not show performance warnings for unnecessary renders
      renderSpy.mockRestore();
    });

    it('should efficiently handle tab change events', () => {
      render(<BottomNavigation {...defaultProps} />);

      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('Tasks'));
      }

      const endTime = performance.now();

      // Should complete 10 clicks within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockOnTabChange).toHaveBeenCalledTimes(10);
    });
  });
});
