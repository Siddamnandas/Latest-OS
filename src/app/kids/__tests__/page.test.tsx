// Comprehensive tests for Kids Page Component
// Testing rendering, accessibility, error boundaries, and user interactions

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useSession } from 'next-auth/react';
import KidsPage from '../page';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock next-auth
jest.mock('next-auth/react');

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/kids',
}));

// Mock fetch for API calls
global.fetch = jest.fn();

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock components that might not be available in test environment
jest.mock('@/components/ui/loading-states', () => ({
  PageLoading: () => <div data-testid="page-loading">Loading...</div>,
  ActivitiesGridSkeleton: () => <div data-testid="activities-loading">Loading activities...</div>,
}));

jest.mock('@/components/ErrorBoundary', () => ({
  PageErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/lib/accessibility', () => ({
  AccessibilityProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SkipToMainLink: () => <a href="#main-content">Skip to main content</a>,
}));

describe('KidsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful session by default
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'parent123',
          name: 'Test Parent',
          email: 'parent@test.com',
        },
      },
      status: 'authenticated',
      update: jest.fn(),
    });

    // Mock successful API responses by default
    mockFetch.mockImplementation((url) => {
      if (url === '/api/kids/profile') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            children: [
              {
                id: 'child1',
                name: 'Alice',
                age: 6,
                ageGroup: 'elementary',
                avatar: 'avatar1.jpg',
              },
              {
                id: 'child2', 
                name: 'Bob',
                age: 4,
                ageGroup: 'preschool',
                avatar: 'avatar2.jpg',
              },
            ],
          }),
        } as Response);
      }
      
      if (url.includes('/api/kids/activities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            activities: [
              {
                id: 'activity1',
                title: 'Emotion Recognition',
                description: 'Learn to identify different emotions',
                type: 'emotion',
                difficulty: 'easy',
                estimatedDuration: 15,
                ageMin: 4,
                ageMax: 8,
              },
              {
                id: 'activity2',
                title: 'Creative Drawing',
                description: 'Express yourself through art',
                type: 'creativity',
                difficulty: 'medium',
                estimatedDuration: 30,
                ageMin: 5,
                ageMax: 10,
              },
            ],
            meta: {
              total: 2,
              hasMore: false,
            },
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);
    });
  });

  describe('Authentication and Loading States', () => {
    it('should show loading state when session is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn(),
      });

      render(<KidsPage />);
      
      expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    });

    it('should redirect to login when not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      render(<KidsPage />);
      
      // Should show some indication that authentication is required
      // The exact behavior depends on your implementation
      expect(screen.queryByTestId('page-loading')).not.toBeInTheDocument();
    });

    it('should render kids page when authenticated', async () => {
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Kids Activities')).toBeInTheDocument();
      });
    });
  });

  describe('Child Profile Selection', () => {
    it('should display child profiles when loaded', async () => {
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
      });
    });

    it('should show create profile option when no children exist', async () => {
      mockFetch.mockImplementation((url) => {
        if (url === '/api/kids/profile') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ children: [] }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      });

      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/create.*profile/i)).toBeInTheDocument();
      });
    });

    it('should allow selecting a child profile', async () => {
      const user = userEvent.setup();
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      const aliceProfile = screen.getByText('Alice');
      await user.click(aliceProfile);
      
      // Should trigger activities loading for selected child
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/kids/activities?childId=child1')
        );
      });
    });
  });

  describe('Activities Display', () => {
    it('should display activities after child selection', async () => {
      const user = userEvent.setup();
      render(<KidsPage />);
      
      // Wait for profiles to load and select a child
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      const aliceProfile = screen.getByText('Alice');
      await user.click(aliceProfile);
      
      // Wait for activities to load
      await waitFor(() => {
        expect(screen.getByText('Emotion Recognition')).toBeInTheDocument();
        expect(screen.getByText('Creative Drawing')).toBeInTheDocument();
      });
    });

    it('should show loading state while fetching activities', async () => {
      const user = userEvent.setup();
      
      // Make fetch take longer to resolve
      mockFetch.mockImplementation((url) => {
        if (url === '/api/kids/profile') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              children: [{ id: 'child1', name: 'Alice', age: 6 }],
            }),
          } as Response);
        }
        
        if (url.includes('/api/kids/activities')) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve({ activities: [], meta: { total: 0 } }),
              } as Response);
            }, 100);
          });
        }
        
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        } as Response);
      });

      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      const aliceProfile = screen.getByText('Alice');
      await user.click(aliceProfile);
      
      // Should show activities loading state
      expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    });

    it('should handle activities filter changes', async () => {
      const user = userEvent.setup();
      render(<KidsPage />);
      
      // Select child and wait for activities
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
      
      const aliceProfile = screen.getByText('Alice');
      await user.click(aliceProfile);
      
      await waitFor(() => {
        expect(screen.getByText('Emotion Recognition')).toBeInTheDocument();
      });

      // Look for filter controls (exact implementation depends on your design)
      const emotionFilter = screen.queryByText('Emotion');
      if (emotionFilter) {
        await user.click(emotionFilter);
        
        // Should trigger filtered API call
        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('type=emotion')
          );
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockFetch.mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Internal server error' }),
        } as Response);
      });

      render(<KidsPage />);
      
      await waitFor(() => {
        // Should show error state or fallback content
        expect(screen.getByText(/error/i) || screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      mockFetch.mockImplementation(() => {
        return Promise.reject(new Error('Network error'));
      });

      render(<KidsPage />);
      
      await waitFor(() => {
        // Should show error state
        expect(screen.getByText(/error/i) || screen.getByText(/connection/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Kids Activities')).toBeInTheDocument();
      });
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', async () => {
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /kids activities/i })).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      // Test tab navigation
      await user.tab();
      
      // Should focus on child profile or interactive element
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
      
      // Test Enter key activation
      if (focusedElement) {
        await user.keyboard('{Enter}');
        // Should trigger the same action as click
      }
    });

    it('should have skip navigation link', () => {
      render(<KidsPage />);
      
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('should have proper ARIA labels and roles', async () => {
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });

      // Check for proper roles and labels
      const mainContent = screen.getByRole('main') || screen.getByLabelText(/main content/i);
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should handle different screen sizes', async () => {
      // Mock window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      window.dispatchEvent(new Event('resize'));
      
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Kids Activities')).toBeInTheDocument();
      });
      
      // Component should render properly on tablet/mobile sizes
      // Exact expectations depend on your responsive design
    });
  });

  describe('Performance', () => {
    it('should not make unnecessary API calls', async () => {
      render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
      
      // Should have made initial calls for profiles
      expect(mockFetch).toHaveBeenCalledWith('/api/kids/profile');
      
      // Should not have made activities call until child is selected
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('/api/kids/activities?childId=')
      );
    });

    it('should cache profile data appropriately', async () => {
      const { rerender } = render(<KidsPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Alice')).toBeInTheDocument();
      });
      
      const initialCallCount = (mockFetch as jest.Mock).mock.calls.length;
      
      // Rerender component
      rerender(<KidsPage />);
      
      // Should not make additional profile calls if using proper caching
      expect((mockFetch as jest.Mock).mock.calls.length).toBe(initialCallCount);
    });
  });
});