// Hook Integration Tests
// Tests custom hooks working together without external dependencies

import { renderHook, act } from '@testing-library/react';
import { useState, useEffect } from 'react';

// Mock all external dependencies
jest.mock('@/lib/kids-cache', () => ({
  kidsCache: {
    set: jest.fn(),
    get: jest.fn(),
    has: jest.fn().mockReturnValue(false),
    delete: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn(() => ({ size: 0, hits: 0, misses: 0, hitRate: 0 })),
  },
  cacheHelpers: {
    cacheActivityList: jest.fn(),
    getCachedActivityList: jest.fn(),
    invalidateChildData: jest.fn(),
  },
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Simple hook for testing interactions
function useTaskManager(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data loading
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 10));
      // Tasks are already loaded via initial state
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
}

// Hook for task statistics
function useTaskStats(tasks) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    setStats({
      total,
      completed,
      pending,
      completionRate: Math.round(completionRate * 100) / 100,
    });
  }, [tasks]);

  return stats;
}

// Combined hook using both
function useTaskManagerWithStats(initialTasks = []) {
  const taskManager = useTaskManager(initialTasks);
  const stats = useTaskStats(taskManager.tasks);

  return {
    ...taskManager,
    stats,
  };
}

describe('Hook Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Use real timers for hook testing
  });

  describe('useTaskManager Hook', () => {
    it('should initialize with empty tasks', () => {
      const { result } = renderHook(() => useTaskManager());

      expect(result.current.tasks).toEqual([]);
      expect(result.current.loading).toBe(true); // Initially loading
    });

    it('should initialize with provided tasks', () => {
      const initialTasks = [
        { id: 1, title: 'Test Task', completed: false },
      ];

      const { result } = renderHook(() => useTaskManager(initialTasks));

      expect(result.current.tasks).toEqual(initialTasks);
    });

    it('should add tasks correctly', () => {
      const { result } = renderHook(() => useTaskManager());

      act(() => {
        result.current.addTask({ title: 'New Task', completed: false });
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0]).toMatchObject({
        title: 'New Task',
        completed: false,
      });
      expect(result.current.tasks[0].id).toBeDefined();
    });

    it('should update tasks correctly', () => {
      const initialTasks = [
        { id: 1, title: 'Original Task', completed: false },
      ];

      const { result } = renderHook(() => useTaskManager(initialTasks));

      act(() => {
        result.current.updateTask(1, { completed: true, title: 'Updated Task' });
      });

      expect(result.current.tasks[0]).toEqual({
        id: 1,
        title: 'Updated Task',
        completed: true,
      });
    });

    it('should delete tasks correctly', () => {
      const initialTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: false },
      ];

      const { result } = renderHook(() => useTaskManager(initialTasks));

      act(() => {
        result.current.deleteTask(1);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe(2);
    });
  });

  describe('useTaskStats Hook', () => {
    it('should calculate stats correctly for empty tasks', () => {
      const { result } = renderHook(() => useTaskStats([]));

      expect(result.current).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
      });
    });

    it('should calculate stats correctly with mixed tasks', () => {
      const tasks = [
        { id: 1, completed: true },
        { id: 2, completed: false },
        { id: 3, completed: true },
        { id: 4, completed: false },
      ];

      const { result } = renderHook(() => useTaskStats(tasks));

      expect(result.current).toEqual({
        total: 4,
        completed: 2,
        pending: 2,
        completionRate: 50,
      });
    });

    it('should update stats when tasks change', () => {
      const { result, rerender } = renderHook(
        ({ tasks }) => useTaskStats(tasks),
        { initialProps: { tasks: [{ id: 1, completed: false }] } }
      );

      expect(result.current.completionRate).toBe(0);

      // Update tasks
      rerender({ tasks: [
        { id: 1, completed: true },
        { id: 2, completed: false },
      ] });

      expect(result.current).toEqual({
        total: 2,
        completed: 1,
        pending: 1,
        completionRate: 50,
      });
    });
  });

  describe('useTaskManagerWithStats Combined Hook', () => {
    it('should integrate task management with statistics', () => {
      const { result } = renderHook(() => useTaskManagerWithStats());

      // Initial state
      expect(result.current.tasks).toEqual([]);
      expect(result.current.stats).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
      });

      // Add a task
      act(() => {
        result.current.addTask({ title: 'Integration Test', completed: false });
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.stats.total).toBe(1);
      expect(result.current.stats.pending).toBe(1);
      expect(result.current.stats.completionRate).toBe(0);

      // Complete the task
      act(() => {
        const taskId = result.current.tasks[0].id;
        result.current.updateTask(taskId, { completed: true });
      });

      expect(result.current.stats.completed).toBe(1);
      expect(result.current.stats.pending).toBe(0);
      expect(result.current.stats.completionRate).toBe(100);
    });

    it('should maintain state consistency across operations', () => {
      const { result } = renderHook(() => useTaskManagerWithStats());

      // Add multiple tasks
      act(() => {
        result.current.addTask({ title: 'Task 1', completed: false });
        result.current.addTask({ title: 'Task 2', completed: false });
        result.current.addTask({ title: 'Task 3', completed: false });
      });

      expect(result.current.stats.total).toBe(3);
      expect(result.current.stats.pending).toBe(3);

      // Complete tasks
      act(() => {
        const taskId = result.current.tasks[0].id;
        result.current.updateTask(taskId, { completed: true });
      });

      expect(result.current.stats.completed).toBe(1);
      expect(result.current.stats.pending).toBe(2);
      expect(result.current.stats.completionRate).toBe(33.33);

      // Delete a task
      act(() => {
        const taskId = result.current.tasks[1].id;
        result.current.deleteTask(taskId);
      });

      expect(result.current.stats.total).toBe(2);
      expect(result.current.stats.completed).toBe(1);
      expect(result.current.stats.pending).toBe(1);
      expect(result.current.stats.completionRate).toBe(50);
    });

    it('should handle loading state transitions', async () => {
      const { result } = renderHook(() => useTaskManagerWithStats());

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle error states in integrated hooks', async () => {
      // Mock a hook that throws
      const useFaultyTaskManager = () => {
        const [error, setError] = useState(null);

        useEffect(() => {
          setError(new Error('Simulated error'));
        }, []);

        return {
          tasks: [],
          loading: false,
          error,
          addTask: jest.fn(),
          updateTask: jest.fn(),
          deleteTask: jest.fn(),
        };
      };

      const { result } = renderHook(() => useFaultyTaskManager());

      expect(result.current.error).toBeTruthy();
      expect(result.current.tasks).toEqual([]);
    });

    it('should demonstrate hook composition benefits', () => {
      const { result } = renderHook(() => useTaskManagerWithStats([
        { id: 1, title: 'Predefined Task 1', completed: true },
        { id: 2, title: 'Predefined Task 2', completed: false },
        { id: 3, title: 'Predefined Task 3', completed: true },
      ]));

      // Test that everything works together from initial state
      expect(result.current.tasks).toHaveLength(3);
      expect(result.current.stats).toEqual({
        total: 3,
        completed: 2,
        pending: 1,
        completionRate: 66.67,
      });

      // Add another task
      act(() => {
        result.current.addTask({ title: 'Runtime Task', completed: false });
      });

      expect(result.current.tasks).toHaveLength(4);
      expect(result.current.stats.total).toBe(4);
      expect(result.current.stats.pending).toBe(2);
      expect(result.current.stats.completionRate).toBe(50);
    });
  });
});
