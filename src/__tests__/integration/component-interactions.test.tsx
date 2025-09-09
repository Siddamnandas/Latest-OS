// Component Integration Tests
// Tests how components interact with each other without external dependencies

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskManagement } from '@/components/TaskManagement';

// Mock kids-cache
jest.mock('@/lib/kids-cache', () => ({
  kidsCache: {
    set: jest.fn(),
    get: jest.fn().mockReturnValue(null),
    has: jest.fn().mockReturnValue(false),
    delete: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn(() => ({
      size: 0,
      hits: 0,
      misses: 0,
      hitRate: 0,
      memoryUsage: 0,
    })),
  },
}));

describe('TaskManagement Component Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Task Lifecycle Workflow', () => {
    it('should complete full task creation, editing, and completion workflow', async () => {
      const user = userEvent.setup();
      render(<TaskManagement />);

      // Initial state - should show task list
      expect(screen.getByText('Task Management')).toBeInTheDocument();
      expect(screen.getByText('Fair tasks, stronger relationship')).toBeInTheDocument();

      // Click Add Task button
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      // Modal should appear with form
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Task')).toBeInTheDocument();

      // Fill form
      const titleInput = screen.getByPlaceholderText('Enter task title');
      const descriptionInput = screen.getByPlaceholderText('Enter task description');

      await user.type(titleInput, 'Test Integration Task');
      await user.type(descriptionInput, 'Testing component integration flow');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Task should appear in list
      expect(screen.getByText('Test Integration Task')).toBeInTheDocument();
      expect(screen.getByText('Testing component integration flow')).toBeInTheDocument();

      // Find task completion checkbox and click it
      const taskItem = screen.getByText('Test Integration Task').closest('div');
      const checkbox = taskItem?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      await user.click(checkbox);

      // Task should be visually completed
      expect(taskItem).toHaveClass('opacity-75'); // Assuming completed tasks have opacity styling
    });

    it('should handle task filtering interactions', async () => {
      const user = userEvent.setup();

      // First add a completed task
      render(<TaskManagement />);

      // Add task
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Completed Task');

      const submitButton = screen.getByRole('button', { name: /add task/i });
      await user.click(submitButton);

      // Complete the task
      await waitFor(() => {
        expect(screen.getByText('Completed Task')).toBeInTheDocument();
      });

      const taskItem = screen.getByText('Completed Task').closest('div');
      const checkbox = taskItem?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      await user.click(checkbox);

      // Test filter buttons
      const pendingFilter = screen.getByRole('button', { name: /pending/i });
      const completedFilter = screen.getByRole('button', { name: /completed/i });
      const allFilter = screen.getByRole('button', { name: /all/i });

      // Switch to completed filter
      await user.click(completedFilter);
      expect(screen.getByText('Completed Task')).toBeInTheDocument();

      // Switch to pending filter (no tasks)
      await user.click(pendingFilter);
      expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();

      // Switch back to all
      await user.click(allFilter);
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });

    it('should integrate tab navigation with content', async () => {
      const user = userEvent.setup();
      render(<TaskManagement />);

      // Default tab should be "Tasks"
      expect(screen.getByText('Tasks')).toHaveAttribute('data-state', 'active');
      expect(screen.getByText('Task Management')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();

      // Switch to Analytics tab
      const analyticsTab = screen.getByRole('tab', { name: /analytics/i });
      await user.click(analyticsTab);

      // Content should change
      expect(screen.getByText('Task Analytics')).toBeInTheDocument();

      // Switch to AI Tips tab
      const aiTab = screen.getByRole('tab', { name: /ai-suggestions/i });
      await user.click(aiTab);

      // Content should change
      expect(screen.getByText('AI Task Suggestions')).toBeInTheDocument();

      // Come back to Tasks tab
      const tasksTab = screen.getByRole('tab', { name: /^tasks$/i });
      await user.click(tasksTab);

      expect(screen.getByText('Task Management')).toBeInTheDocument();
    });

    it('should handle task editing workflow', async () => {
      const user = userEvent.setup();
      render(<TaskManagement />);

      // Add initial task
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Original Task');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      await waitFor(() => {
        expect(screen.getByText('Original Task')).toBeInTheDocument();
      });

      // Find and click the edit button (assuming Edit button exists in task item)
      const taskItem = screen.getByText('Original Task').closest('div');
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Edit modal should open
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Modify the task
      const titleField = screen.getByDisplayValue('Original Task');
      await user.clear(titleField);
      await user.type(titleField, 'Updated Task');

      // Save changes
      const submitEdit = screen.getAllByRole('button', { name: /add task/i })[1] || screen.getByRole('button', { name: /update/i });
      await user.click(submitEdit);

      // Task should be updated
      await waitFor(() => {
        expect(screen.getByText('Updated Task')).toBeInTheDocument();
        expect(screen.queryByText('Original Task')).not.toBeInTheDocument();
      });
    });

    it('should handle state persistence across component updates', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<TaskManagement />);

      // Add a task
      const addButton = screen.getByRole('button', { name: /add task/i });
      await user.click(addButton);

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Persistent Test Task');

      await user.click(screen.getByRole('button', { name: /add task/i }));

      await waitFor(() => {
        expect(screen.getByText('Persistent Test Task')).toBeInTheDocument();
      });

      // Switch to Analytics tab
      const analyticsTab = screen.getByRole('tab', { name: /analytics/i });
      await user.click(analyticsTab);

      // Switch back to Tasks - task should still be there
      const tasksTab = screen.getByRole('tab', { name: /^tasks$/i });
      await user.click(tasksTab);

      expect(screen.getByText('Persistent Test Task')).toBeInTheDocument();
    });

    it('should display progress statistics correctly', async () => {
      const user = userEvent.setup();
      render(<TaskManagement />);

      // Add multiple tasks
      for (let i = 0; i < 3; i++) {
        const addButton = screen.getByRole('button', { name: /add task/i });
        await user.click(addButton);

        const titleInput = screen.getByPlaceholderText('Enter task title');
        await user.type(titleInput, `Task ${i + 1}`);

        await user.click(screen.getByRole('button', { name: /add task/i }));

        // Complete first task
        if (i === 0) {
          await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
          });

          const taskItem = screen.getByText('Task 1').closest('div');
          const checkbox = taskItem?.querySelector('input[type="checkbox"]') as HTMLInputElement;
          await user.click(checkbox);
        }
      }

      // Check progress bar
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();

      // Completion rate should be approximately 33%
      const statsText = screen.getByText(/of 3 tasks completed/);
      expect(statsText).toBeInTheDocument();
    });
  });
});
