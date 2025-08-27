// Comprehensive tests for Kids Progress API Route
// Testing progress tracking, achievements calculation, and goal management

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST, PUT } from '../route';
import { prisma } from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    childProfile: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    childProgress: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    childGoal: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    activityCompletion: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@/lib/monitoring', () => ({
  monitoring: {
    recordAPIMetric: jest.fn(),
    recordUserActivity: jest.fn(),
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockMonitoring = monitoring as jest.Mocked<typeof monitoring>;

describe('/api/kids/progress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/kids/progress', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=child123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to access child progress.');
    });

    it('should return 400 when childId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/progress');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid child ID format');
    });

    it('should return 400 when childId format is invalid', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=invalid-uuid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid child ID format');
    });

    it('should return 404 when child does not belong to parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child not found or access denied. You can only view progress for your own children.');
    });

    it('should create default progress when child has no progress record', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        name: 'Test Child',
        parentId: 'parent123',
        progress: null,
        achievements: [],
      };

      const mockDefaultProgress = {
        id: 'progress123',
        childId: 'child123',
        totalActivitiesCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        kindnessPoints: 0,
        creativityScore: 0,
        emotionalIntelligenceLevel: 1,
        updatedAt: new Date(),
      };

      const mockRecentActivities = [];

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.childProgress.create.mockResolvedValue(mockDefaultProgress);
      mockPrisma.activityCompletion.findMany.mockResolvedValue(mockRecentActivities);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.childId).toBe('child123');
      expect(data.childName).toBe('Test Child');
      expect(data.progress.totalActivitiesCompleted).toBe(0);
      expect(data.achievements).toBeDefined();
      expect(data.recentActivities).toEqual([]);
      expect(mockPrisma.childProgress.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          childId: 'child123',
          totalActivitiesCompleted: 0,
        })
      });
    });

    it('should return existing progress with achievements', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockProgress = {
        id: 'progress123',
        childId: 'child123',
        totalActivitiesCompleted: 15,
        currentStreak: 5,
        longestStreak: 10,
        kindnessPoints: 75,
        creativityScore: 50,
        emotionalIntelligenceLevel: 3,
        updatedAt: new Date(),
      };

      const mockChild = {
        id: 'child123',
        name: 'Test Child',
        parentId: 'parent123',
        progress: mockProgress,
        achievements: [],
      };

      const mockRecentActivities = [
        {
          activityId: 'activity1',
          completed: true,
          score: 85,
          completedAt: new Date(),
          activity: {
            title: 'Emotion Recognition',
            type: 'emotion',
            difficulty: 'easy',
          },
        },
      ];

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.activityCompletion.findMany.mockResolvedValue(mockRecentActivities);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.childId).toBe('child123');
      expect(data.progress.totalActivitiesCompleted).toBe(15);
      expect(data.progress.kindnessPoints).toBe(75);
      expect(data.achievements).toBeDefined();
      expect(data.achievements.length).toBeGreaterThan(0); // Should have calculated achievements
      expect(data.recentActivities).toHaveLength(1);
      expect(data.recentActivities[0].activity.title).toBe('Emotion Recognition');
    });

    it('should calculate correct achievements based on progress', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockProgress = {
        id: 'progress123',
        childId: 'child123',
        totalActivitiesCompleted: 25, // Should trigger multiple achievements
        currentStreak: 8,
        longestStreak: 10,
        kindnessPoints: 60,
        creativityScore: 40,
        emotionalIntelligenceLevel: 4,
        updatedAt: new Date(),
      };

      const mockChild = {
        id: 'child123',
        name: 'Test Child',
        parentId: 'parent123',
        progress: mockProgress,
        achievements: [],
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.achievements).toBeDefined();
      
      // Check for specific achievements that should be earned
      const achievementNames = data.achievements.map((a: any) => a.name);
      expect(achievementNames).toContain('First Steps');
      expect(achievementNames).toContain('Learning Explorer');
      expect(achievementNames).toContain('Super Learner');
      expect(achievementNames).toContain('Kind Heart');
      expect(achievementNames).toContain('Kindness Champion');
      expect(achievementNames).toContain('Week Warrior');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockRejectedValue(new Error('Database connection error'));

      const request = new NextRequest('http://localhost:3000/api/kids/progress?childId=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error occurred while retrieving progress');
    });
  });

  describe('POST /api/kids/progress (Goal Creation)', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/progress', {
        method: 'POST',
        body: JSON.stringify({
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          title: 'Complete 5 Activities',
          description: 'Finish 5 activities this week',
          target: 5,
          deadline: new Date().toISOString(),
          category: 'emotion'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to create goals.');
    });

    it('should validate goal data correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/progress', {
        method: 'POST',
        body: JSON.stringify({
          childId: 'invalid-uuid',
          title: '', // Invalid empty title
          target: -1, // Invalid negative target
          category: 'invalid-category'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid goal data');
      expect(data.details).toBeDefined();
    });

    it('should successfully create a goal', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        parentId: 'parent123',
      };

      const mockGoal = {
        id: 'goal123',
        childId: 'child123',
        title: 'Complete 5 Activities',
        description: 'Finish 5 activities this week',
        target: 5,
        current: 0,
        deadline: new Date(),
        category: 'emotion',
        priority: 'medium',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.childGoal.create.mockResolvedValue(mockGoal);

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);

      const request = new NextRequest('http://localhost:3000/api/kids/progress', {
        method: 'POST',
        body: JSON.stringify({
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          title: 'Complete 5 Activities',
          description: 'Finish 5 activities this week',
          target: 5,
          deadline: deadline.toISOString(),
          category: 'emotion',
          priority: 'medium'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.goal.title).toBe('Complete 5 Activities');
      expect(data.goal.target).toBe(5);
      expect(data.message).toBe('Goal created successfully');
    });
  });

  describe('PUT /api/kids/progress (Goal Update)', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?goalId=goal123', {
        method: 'PUT',
        body: JSON.stringify({
          current: 3
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to update goals.');
    });

    it('should return 400 when goalId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/progress', {
        method: 'PUT',
        body: JSON.stringify({
          current: 3
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Goal ID is required');
    });

    it('should successfully update goal progress', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockGoal = {
        id: 'goal123',
        childId: 'child123',
        title: 'Complete 5 Activities',
        target: 5,
        current: 2,
        completed: false,
        child: {
          parentId: 'parent123',
        },
      };

      const mockUpdatedGoal = {
        ...mockGoal,
        current: 3,
      };

      mockPrisma.childGoal.findUnique = jest.fn().mockResolvedValue(mockGoal);
      mockPrisma.childGoal.update.mockResolvedValue(mockUpdatedGoal);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?goalId=goal123', {
        method: 'PUT',
        body: JSON.stringify({
          current: 3
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.goal.current).toBe(3);
      expect(data.message).toBe('Goal updated successfully');
    });

    it('should mark goal as completed when target is reached', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockGoal = {
        id: 'goal123',
        childId: 'child123',
        title: 'Complete 5 Activities',
        target: 5,
        current: 4,
        completed: false,
        child: {
          parentId: 'parent123',
        },
      };

      const mockUpdatedGoal = {
        ...mockGoal,
        current: 5,
        completed: true,
      };

      mockPrisma.childGoal.findUnique = jest.fn().mockResolvedValue(mockGoal);
      mockPrisma.childGoal.update.mockResolvedValue(mockUpdatedGoal);

      const request = new NextRequest('http://localhost:3000/api/kids/progress?goalId=goal123', {
        method: 'PUT',
        body: JSON.stringify({
          current: 5
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.goal.completed).toBe(true);
      expect(data.goalCompleted).toBe(true);
    });
  });
});