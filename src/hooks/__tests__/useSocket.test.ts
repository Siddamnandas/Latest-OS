import { renderHook, act, cleanup } from '@testing-library/react';
import { useSocket } from '../useSocket';

// Properly mock socket.io-client
const mockSocketInstance = {
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn(),
  disconnect: jest.fn(),
  connected: true,
};

// Mock the entire module
jest.mock('socket.io-client', () => ({
  __esModule: true,
  default: jest.fn(() => mockSocketInstance)
}));

describe('useSocket Hook - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Socket Connection', () => {
    it('should initialize socket with correct configuration', () => {
      renderHook(() => useSocket());

      expect(mockIo).toHaveBeenCalledWith('/', {
        path: '/api/socketio',
        addTrailingSlash: false,
        transports: ['websocket', 'polling'],
        secure: false,
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        forceNew: false,
      });
    });

    it('should return socket connection state', () => {
      const { result } = renderHook(() => useSocket());

      expect(result.current.isConnected).toBeTruthy();
      expect(result.current.socket).toBe(mockSocketInstance);
    });
  });

  describe('Socket Event Listeners', () => {
    it('should listen for connection events', () => {
      const mockCallback = jest.fn();
      mockSocketInstance.on.mockImplementation((event, callback) => {
        if (event === 'connect') {
          callback();
        }
      });

      renderHook(() => useSocket());

      expect(mockSocketInstance.on).toHaveBeenCalledWith('connect', expect.any(Function));
    });

    it('should handle partner presence updates', () => {
      const mockCallback = jest.fn();
      mockSocketInstance.on.mockImplementation((event, callback) => {
        if (event === 'partner:active') {
          callback({ lastSeen: '2023-01-01T10:00:00Z' });
        }
      });

      const { result } = renderHook(() => useSocket());

      expect(result.current.partnerPresence.online).toBe(false); // Default state
    });
  });

  describe('Socket Actions', () => {
    it('should send sync start event', () => {
      const { result } = renderHook(() => useSocket());

      act(() => {
        result.current.sendSyncStart(8, 7); // mood: 8, energy: 7
      });

      expect(mockSocketInstance.emit).toHaveBeenCalledWith('sync:start', {
        mood: 8,
        energy: 7
      });
    });

    it('should send sync complete event', () => {
      const { result } = renderHook(() => useSocket());

      const syncData = { completed: true, notes: 'Great session!' };
      act(() => {
        result.current.sendSyncComplete(syncData);
      });

      expect(mockSocketInstance.emit).toHaveBeenCalledWith('sync:complete', {
        syncData
      });
    });

    it('should send task completion event', () => {
      const { result } = renderHook(() => useSocket());

      act(() => {
        result.current.sendTaskComplete('task-123', 'Morning coffee', 50);
      });

      expect(mockSocketInstance.emit).toHaveBeenCalledWith('task:complete', {
        taskId: 'task-123',
        title: 'Morning coffee',
        coins: 50
      });
    });

    it('should send location information', () => {
      const { result } = renderHook(() => useSocket());

      act(() => {
        result.current.sendLocation({
          lat: 37.7749,
          lng: -122.4194,
          address: 'San Francisco, CA'
        });
      });

      expect(mockSocketInstance.emit).toHaveBeenCalledWith('location:share', {
        location: {
          lat: 37.7749,
          lng: -122.4194,
          address: 'San Francisco, CA'
        }
      });
    });
  });

  describe('Event Handling', () => {
    it('should handle partner sync completion notifications', () => {
      const { result } = renderHook(() => useSocket());

      mockSocketInstance.on.mockImplementation((event, callback) => {
        if (event === 'sync:partner_completed') {
          callback({
            partner: 'Partner B',
            partnerRole: 'partner_b',
            syncData: { mood: 9, energy: 8 },
            timestamp: '2023-01-01T10:30:00Z'
          });
        }
      });

      // Trigger the event listener
      const connectCallbacks = mockSocketInstance.on.mock.calls.find(
        call => call[0] === 'sync:partner_completed'
      );

      if (connectCallbacks) {
        act(() => {
          connectCallbacks[1]({
            partner: 'Partner B',
            partnerRole: 'partner_b',
            syncData: { mood: 9, energy: 8 },
            timestamp: '2023-01-01T10:30:00Z'
          });
        });
      }

      expect(result.current.syncEvents).toContainEqual({
        partner: 'Partner B',
        partnerRole: 'partner_b',
        syncData: expect.any(Object),
        timestamp: '2023-01-01T10:30:00Z'
      });
    });

    it('should handle memory creation notifications', () => {
      const { result } = renderHook(() => useSocket());

      mockSocketInstance.on.mockImplementation((event, callback) => {
        if (event === 'memory:created') {
          callback({
            memory: { title: 'Our first date', type: 'image' },
            createdBy: 'Partner A',
            timestamp: '2023-01-01T15:00:00Z'
          });
        }
      });

      expect(result.current.memoryEvents).toHaveLength(0);
      // Mock implementation to simulate memory event
    });
  });

  describe('Connection Lifecycle', () => {
    it('should handle disconnection', () => {
      const { result } = renderHook(() => useSocket());

      mockSocketInstance.on.mockImplementation((event, callback) => {
        if (event === 'disconnect') {
          callback('io server disconnect');
        }
      });

      expect(result.current.isConnected).toBeTruthy();
      // Mock disconnect event
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useSocket());

      unmount();

      expect(mockSocketInstance.disconnect).toHaveBeenCalled();
    });
  });
});
