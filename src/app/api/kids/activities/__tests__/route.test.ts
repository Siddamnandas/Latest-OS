// Comprehensive tests for Kids Activities API Route
// Testing authentication, authorization, validation, error handling, and performance

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';
import { kidsCache } from '@/lib/kids-cache';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    childProfile: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    activity: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    activityCompletion: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    childProgress: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/monitoring', () => ({
  monitoring: {
    recordAPIMetric: jest.fn(),
    recordUserActivity: jest.fn(),
    recordKidsActivity: jest.fn(),
  },
}));

jest.mock('@/lib/kids-cache', () => ({
  kidsCache: {
    getStats: jest.fn(),
    clear: jest.fn(),
  },
  cacheHelpers: {
    getCachedActivityList: jest.fn(),
    cacheActivityList: jest.fn(),
    invalidateChildData: jest.fn(),
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockMonitoring = monitoring as jest.Mocked<typeof monitoring>;

describe('/api/kids/activities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/kids/activities', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/activities');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to access activities.');
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'GET', 401, expect.any(Number));
    });

    it('should return 404 when childId is provided but child does not belong to parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/activities?childId=child123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child not found or access denied. You can only access activities for your own children.');
    });

    it('should return cached activities when available', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const cachedActivities = [
        { id: 'activity1', title: 'Test Activity', type: 'emotion' }
      ];

      // Mock cache helpers
      const { cacheHelpers } = require('@/lib/kids-cache');
      cacheHelpers.getCachedActivityList.mockReturnValue(cachedActivities);

      const request = new NextRequest('http://localhost:3000/api/kids/activities?childId=child123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.activities).toEqual(cachedActivities);
      expect(data.cached).toBe(true);
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'GET', 200, expect.any(Number));
      expect(mockMonitoring.recordUserActivity).toHaveBeenCalledWith('parent123', 'get_activities_cached', 'child123');
    });

    it('should return activities from database when not cached', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        parentId: 'parent123',
        birthDate: new Date('2018-01-01'),
      };

      const mockActivities = [
        {
          id: 'activity1',
          title: 'Emotion Recognition',
          type: 'emotion',
          difficulty: 'easy',
          ageMin: 4,
          ageMax: 8,
          estimatedDuration: 15,
          tags: '["emotion", "faces"]',
          instructions: '["Step 1", "Step 2"]',
          materials: '["pictures"]',
          learningObjectives: '["recognize emotions"]',
          safetyNotes: '[]',
          accessibility: '{}',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const mockCompletions = [
        {
          activityId: 'activity1',
          completed: true,
          score: 85,
          completedAt: new Date(),
        }
      ];

      // Mock cache helpers to return null (no cache)
      const { cacheHelpers } = require('@/lib/kids-cache');
      cacheHelpers.getCachedActivityList.mockReturnValue(null);

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.childProfile.findUnique.mockResolvedValue(mockChild);
      mockPrisma.activity.count.mockResolvedValue(1);
      mockPrisma.activity.findMany.mockResolvedValue(mockActivities);
      mockPrisma.activityCompletion.findMany.mockResolvedValue(mockCompletions);

      const request = new NextRequest('http://localhost:3000/api/kids/activities?childId=child123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.activities).toHaveLength(1);
      expect(data.activities[0].title).toBe('Emotion Recognition');
      expect(data.activities[0].completion).toBeDefined();
      expect(data.meta.total).toBe(1);
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'GET', 200, expect.any(Number));
      expect(mockMonitoring.recordUserActivity).toHaveBeenCalledWith('parent123', 'get_activities', 'child123');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      // Mock cache helpers to return null (no cache)
      const { cacheHelpers } = require('@/lib/kids-cache');
      cacheHelpers.getCachedActivityList.mockReturnValue(null);

      mockPrisma.activity.count.mockRejectedValue(new Error('Database connection error'));

      const request = new NextRequest('http://localhost:3000/api/kids/activities');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error occurred while retrieving activities');
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'GET', 500, expect.any(Number));
    });

    it('should validate query parameters correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/activities?childId=invalid-uuid&limit=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid filter parameters');
      expect(data.details).toBeDefined();
    });

    it('should apply filters correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      // Mock cache helpers to return null (no cache)
      const { cacheHelpers } = require('@/lib/kids-cache');
      cacheHelpers.getCachedActivityList.mockReturnValue(null);

      mockPrisma.activity.count.mockResolvedValue(0);
      mockPrisma.activity.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/kids/activities?type=emotion,creativity&difficulty=easy&ageMin=4&ageMax=8');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.activity.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          type: { in: ['emotion', 'creativity'] },
          difficulty: { in: ['easy'] },
          AND: [
            { ageMax: { gte: 4 } },
            { ageMin: { lte: 8 } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20
      });
    });
  });

  describe('POST /api/kids/activities', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'child123',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          completed: true
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to submit activity results.');
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'POST', 401, expect.any(Number));
    });

    it('should validate request body correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'invalid-uuid',
          completed: true
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid activity result data');
      expect(data.details).toBeDefined();
    });

    it('should return 404 when child does not belong to parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          completed: true
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child not found or access denied. You can only submit results for your own children.');
    });

    it('should return 404 when activity does not exist', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        parentId: 'parent123',
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.activity.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'nonexistent',
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          completed: true
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Activity not found');
    });

    it('should successfully submit activity result', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        parentId: 'parent123',
      };

      const mockActivity = {
        id: 'activity1',
        title: 'Test Activity',
        type: 'emotion',
      };

      const mockCompletion = {
        id: 'completion1',
        childId: 'child123',
        activityId: 'activity1',
        completed: true,
        score: 85,
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.activity.findUnique.mockResolvedValue(mockActivity);
      mockPrisma.activityCompletion.create.mockResolvedValue(mockCompletion);

      // Mock progress update functions
      mockPrisma.childProgress.findUnique.mockResolvedValue({
        childId: 'child123',
        totalActivitiesCompleted: 5,
        currentStreak: 2,
        longestStreak: 3,
        kindnessPoints: 20,
        creativityScore: 15,
        emotionalIntelligenceLevel: 2,
      });

      mockPrisma.childProgress.update.mockResolvedValue({
        childId: 'child123',
        totalActivitiesCompleted: 6,
        currentStreak: 3,
        longestStreak: 3,
        kindnessPoints: 20,
        creativityScore: 15,
        emotionalIntelligenceLevel: 2,
      });

      const startTime = new Date().toISOString();
      const endTime = new Date().toISOString();

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          startTime,
          endTime,
          completed: true,
          score: 85,
          reflection: 'I learned about emotions'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.completion).toBeDefined();
      expect(data.message).toBe('Activity result submitted successfully');
      expect(mockMonitoring.recordAPIMetric).toHaveBeenCalledWith('/api/kids/activities', 'POST', 201, expect.any(Number));
      expect(mockMonitoring.recordUserActivity).toHaveBeenCalledWith('parent123', 'submit_activity', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    });

    it('should handle database errors during submission', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockChild = {
        id: 'child123',
        parentId: 'parent123',
      };

      const mockActivity = {
        id: 'activity1',
        type: 'emotion',
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.activity.findUnique.mockResolvedValue(mockActivity);
      mockPrisma.activityCompletion.create.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          completed: true
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error occurred while submitting result');
    });
  });
});