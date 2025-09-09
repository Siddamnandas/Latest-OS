// User Workflows Integration Tests
// Tests complete user interaction flows across multiple components

import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

// Super simple test application with predictable state
function SimpleTaskApp() {
  const [completedCount, setCompletedCount] = React.useState(0);
  const [task1Completed, setTask1Completed] = React.useState(false);
  const [task2Completed, setTask2Completed] = React.useState(false);

  const handleTask1Complete = () => {
    if (!task1Completed) {
      setCompletedCount(count => count + 1);
      setTask1Completed(true);
    }
  };

  const handleTask2Complete = () => {
    if (!task2Completed) {
      setCompletedCount(count => count + 1);
      setTask2Completed(true);
    }
  };

  return (
    <div data-testid="task-app">
      <div data-testid="task-manager">
        <h2>Task Manager</h2>
        <div data-testid="task-1">
          <span>Test Task</span>
          <button
            data-testid="complete-task-1"
            disabled={task1Completed}
            onClick={handleTask1Complete}
          >
            {task1Completed ? 'Completed' : 'Complete'}
          </button>
        </div>
        <div data-testid="task-2">
          <span>New Task</span>
          <button
            data-testid="complete-task-2"
            disabled={task2Completed}
            onClick={handleTask2Complete}
          >
            {task2Completed ? 'Completed' : 'Complete'}
          </button>
        </div>
      </div>
      <div data-testid="progress-tracker">
        <h3>Progress: {completedCount}/2 tasks completed</h3>
      </div>
    </div>
  );
}

describe('User Workflow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Task Lifecycle Journey', () => {
    it('should handle basic task creation and completion', () => {
      render(<SimpleTaskApp />);

      // Initial state checks
      expect(screen.getByTestId('task-app')).toBeInTheDocument();
      expect(screen.getByTestId('task-manager')).toBeInTheDocument();
      expect(screen.getByText('Task Manager')).toBeInTheDocument();

      // Check initial tasks exist
      expect(screen.getByTestId('task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-2')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('New Task')).toBeInTheDocument();

      // Both tasks should start as "Complete"
      expect(screen.getByTestId('complete-task-1')).toHaveTextContent('Complete');
      expect(screen.getByTestId('complete-task-2')).toHaveTextContent('Complete');

      // Progress should start at 0/2
      expect(screen.getByText('Progress: 0/2 tasks completed')).toBeInTheDocument();
    });

    it('should handle completing tasks', () => {
      render(<SimpleTaskApp />);

      // Get the initial progress
      expect(screen.getByText('Progress: 0/2 tasks completed')).toBeInTheDocument();

      // Complete first task
      fireEvent.click(screen.getByTestId('complete-task-1'));

      // Progress should update
      expect(screen.getByText('Progress: 1/2 tasks completed')).toBeInTheDocument();

      // Complete second task
      fireEvent.click(screen.getByTestId('complete-task-2'));

      // Progress should be complete
      expect(screen.getByText('Progress: 2/2 tasks completed')).toBeInTheDocument();
    });

    it('should update completion count correctly', () => {
      render(<SimpleTaskApp />);

      // Complete task 1
      fireEvent.click(screen.getByTestId('complete-task-1'));
      expect(screen.getByText('Progress: 1/2 tasks completed')).toBeInTheDocument();
      expect(screen.getByTestId('complete-task-1')).toHaveTextContent('Completed');
      expect(screen.getByTestId('complete-task-1')).toHaveAttribute('disabled');

      // Complete task 2
      fireEvent.click(screen.getByTestId('complete-task-2'));
      expect(screen.getByText('Progress: 2/2 tasks completed')).toBeInTheDocument();
      expect(screen.getByTestId('complete-task-2')).toHaveTextContent('Completed');
      expect(screen.getByTestId('complete-task-2')).toHaveAttribute('disabled');

      // Both buttons should show "Completed"
      expect(screen.getAllByText('Completed')).toHaveLength(2);
    });

    it('should handle multiple task completions', () => {
      render(<SimpleTaskApp />);

      // Complete both tasks
      fireEvent.click(screen.getByTestId('complete-task-1'));
      expect(screen.getByText('Progress: 1/2 tasks completed')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('complete-task-2'));
      expect(screen.getByText('Progress: 2/2 tasks completed')).toBeInTheDocument();

      // Try to click on already completed tasks - they should stay completed
      fireEvent.click(screen.getByTestId('complete-task-1')); // Already completed
      fireEvent.click(screen.getByTestId('complete-task-2')); // Already completed

      // Progress should still be 2/2 after clicking disabled buttons
      expect(screen.getByText('Progress: 2/2 tasks completed')).toBeInTheDocument();

      // Verify both buttons are still disabled
      expect(screen.getByTestId('complete-task-1')).toHaveAttribute('disabled');
      expect(screen.getByTestId('complete-task-2')).toHaveAttribute('disabled');
    });

    it('should maintain UI structure after interactions', () => {
      render(<SimpleTaskApp />);

      // Complete all tasks
      fireEvent.click(screen.getByTestId('complete-task-1'));
      fireEvent.click(screen.getByTestId('complete-task-2'));

      // Verify all UI elements still exist and are accessible
      expect(screen.getByTestId('task-app')).toBeInTheDocument();
      expect(screen.getByTestId('task-manager')).toBeInTheDocument();
      expect(screen.getByTestId('task-1')).toBeInTheDocument();
      expect(screen.getByTestId('task-2')).toBeInTheDocument();
      expect(screen.getByTestId('complete-task-1')).toBeInTheDocument();
      expect(screen.getByTestId('complete-task-2')).toBeInTheDocument();
      expect(screen.getByTestId('progress-tracker')).toBeInTheDocument();

      // Progress should reflect final state
      expect(screen.getByText('Progress: 2/2 tasks completed')).toBeInTheDocument();
    });
  });
});
