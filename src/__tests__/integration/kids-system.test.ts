// Integration Tests for Kids Activities System
// Testing complete workflows from API to UI components

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET as getActivities, POST as postActivity } from '@/app/api/kids/activities/route';
import { GET as getProgress } from '@/app/api/kids/progress/route';
import { GET as getProfiles, POST as createProfile } from '@/app/api/kids/profile/route';
import { prisma } from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';
import { kidsCache } from '@/lib/kids-cache';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    childProfile: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    childProgress: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    activityCompletion: {
      create: jest.fn(),
      findMany: jest.fn(),
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

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Kids Activities System Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    kidsCache.clear();
    
    // Mock authenticated session
    mockGetServerSession.mockResolvedValue({
      user: {
        id: 'parent123',
        name: 'Test Parent',
        email: 'parent@test.com',
      },
    } as any);
  });

  describe('Complete Parent Journey', () => {
    it('should handle complete parent workflow: create profile → get activities → submit completion', async () => {
      // Step 1: Create child profile
      const createProfileRequest = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          birthDate: '2018-01-01T00:00:00.000Z',
        }),
      });

      const mockNewChild = {
        id: 'child123',
        name: 'Alice',
        birthDate: new Date('2018-01-01'),
        parentId: 'parent123',
        preferences: {
          learningStyle: 'mixed',
          favoriteActivities: ['emotion', 'kindness'],
          difficulty: 'easy',
        },
      };

      mockPrisma.childProfile.count.mockResolvedValue(0);
      mockPrisma.childProfile.create.mockResolvedValue(mockNewChild);
      mockPrisma.childProgress.create.mockResolvedValue({
        id: 'progress123',
        childId: 'child123',
        totalActivitiesCompleted: 0,
      });

      const createResponse = await createProfile(createProfileRequest);
      const createData = await createResponse.json();

      expect(createResponse.status).toBe(201);
      expect(createData.child.name).toBe('Alice');
      expect(createData.child.id).toBe('child123');

      // Step 2: Get child profiles
      const getProfilesRequest = new NextRequest('http://localhost:3000/api/kids/profile');
      
      mockPrisma.childProfile.findMany.mockResolvedValue([{
        ...mockNewChild,
        progress: { totalActivitiesCompleted: 0 },
        achievements: [],
      }]);

      const profilesResponse = await getProfiles(getProfilesRequest);
      const profilesData = await profilesResponse.json();

      expect(profilesResponse.status).toBe(200);
      expect(profilesData.children).toHaveLength(1);
      expect(profilesData.children[0].name).toBe('Alice');

      // Step 3: Get activities for child
      const getActivitiesRequest = new NextRequest('http://localhost:3000/api/kids/activities?childId=child123');

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
          instructions: '["Look at the faces", "Identify emotions"]',
          materials: '["emotion cards"]',
          learningObjectives: '["recognize basic emotions"]',
          safetyNotes: '[]',
          accessibility: '{}',
          isActive: true,
        },
      ];

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockNewChild);
      mockPrisma.childProfile.findUnique.mockResolvedValue({
        ...mockNewChild,
        birthDate: new Date('2018-01-01'),
      });
      mockPrisma.activity.count.mockResolvedValue(1);
      mockPrisma.activity.findMany.mockResolvedValue(mockActivities);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      const activitiesResponse = await getActivities(getActivitiesRequest);
      const activitiesData = await activitiesResponse.json();

      expect(activitiesResponse.status).toBe(200);
      expect(activitiesData.activities).toHaveLength(1);
      expect(activitiesData.activities[0].title).toBe('Emotion Recognition');

      // Step 4: Submit activity completion
      const submitActivityRequest = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId: 'child123',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 900000).toISOString(), // 15 minutes later
          completed: true,
          score: 85,
          reflection: 'I learned about happy and sad faces!',
        }),
      });

      const mockCompletion = {
        id: 'completion123',
        childId: 'child123',
        activityId: 'activity1',
        completed: true,
        score: 85,
      };

      mockPrisma.activity.findUnique.mockResolvedValue(mockActivities[0]);
      mockPrisma.activityCompletion.create.mockResolvedValue(mockCompletion);
      mockPrisma.childProgress.findUnique.mockResolvedValue({
        childId: 'child123',
        totalActivitiesCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        kindnessPoints: 0,
        creativityScore: 0,
        emotionalIntelligenceLevel: 1,
      });
      mockPrisma.childProgress.update.mockResolvedValue({
        childId: 'child123',
        totalActivitiesCompleted: 1,
        currentStreak: 1,
        longestStreak: 1,
        kindnessPoints: 0,
        creativityScore: 0,
        emotionalIntelligenceLevel: 2,
      });

      const submitResponse = await postActivity(submitActivityRequest);
      const submitData = await submitResponse.json();

      expect(submitResponse.status).toBe(201);
      expect(submitData.completion.completed).toBe(true);
      expect(submitData.completion.score).toBe(85);
      expect(submitData.achievements).toBeDefined();

      // Step 5: Check updated progress
      const getProgressRequest = new NextRequest('http://localhost:3000/api/kids/progress?childId=child123');

      mockPrisma.childProfile.findFirst.mockResolvedValue({
        ...mockNewChild,
        progress: {
          totalActivitiesCompleted: 1,
          currentStreak: 1,
          kindnessPoints: 0,
          creativityScore: 0,
          emotionalIntelligenceLevel: 2,
        },
        achievements: [],
      });
      mockPrisma.activityCompletion.findMany.mockResolvedValue([
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
      ]);

      const progressResponse = await getProgress(getProgressRequest);
      const progressData = await progressResponse.json();

      expect(progressResponse.status).toBe(200);
      expect(progressData.progress.totalActivitiesCompleted).toBe(1);
      expect(progressData.recentActivities).toHaveLength(1);
      expect(progressData.recentActivities[0].activity.title).toBe('Emotion Recognition');
      expect(progressData.achievements.length).toBeGreaterThan(0); // Should have earned first activity achievement
    });
  });

  describe('Caching Integration', () => {
    it('should use cache for repeated requests', async () => {
      const childId = 'child123';
      const mockChild = {
        id: childId,
        name: 'Alice',
        parentId: 'parent123',
        birthDate: new Date('2018-01-01'),
      };

      const mockActivities = [
        {
          id: 'activity1',
          title: 'Test Activity',
          type: 'emotion',
          difficulty: 'easy',
          ageMin: 4,
          ageMax: 8,
          tags: '[]',
          instructions: '[]',
          materials: '[]',
          learningObjectives: '[]',
          safetyNotes: '[]',
          accessibility: '{}',
        },
      ];

      // First request - should hit database
      const request1 = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`);

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockChild);
      mockPrisma.childProfile.findUnique.mockResolvedValue(mockChild);
      mockPrisma.activity.count.mockResolvedValue(1);
      mockPrisma.activity.findMany.mockResolvedValue(mockActivities);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      const response1 = await getActivities(request1);
      const data1 = await response1.json();

      expect(response1.status).toBe(200);
      expect(data1.activities).toHaveLength(1);
      expect(data1.cached).toBeFalsy();

      // Second request with same parameters - should use cache
      const request2 = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`);
      
      const response2 = await getActivities(request2);
      const data2 = await response2.json();

      expect(response2.status).toBe(200);
      expect(data2.activities).toHaveLength(1);
      expect(data2.cached).toBe(true);

      // Database should only be called once (for the first request)
      expect(mockPrisma.activity.findMany).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache when child data changes', async () => {
      const childId = 'child123';
      
      // First, get activities (populate cache)
      const getRequest = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`);
      
      mockPrisma.childProfile.findFirst.mockResolvedValue({
        id: childId,
        parentId: 'parent123',
      });
      mockPrisma.activity.count.mockResolvedValue(0);
      mockPrisma.activity.findMany.mockResolvedValue([]);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      await getActivities(getRequest);

      // Submit an activity (should invalidate cache)
      const submitRequest = new NextRequest('http://localhost:3000/api/kids/activities', {
        method: 'POST',
        body: JSON.stringify({
          activityId: 'activity1',
          childId,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          completed: true,
        }),
      });

      mockPrisma.activity.findUnique.mockResolvedValue({
        id: 'activity1',
        type: 'emotion',
      });
      mockPrisma.activityCompletion.create.mockResolvedValue({
        id: 'completion1',
        childId,
      });
      mockPrisma.childProgress.findUnique.mockResolvedValue({
        childId,
        totalActivitiesCompleted: 0,
      });
      mockPrisma.childProgress.update.mockResolvedValue({
        childId,
        totalActivitiesCompleted: 1,
      });

      await postActivity(submitRequest);

      // Get activities again - should not use cache (cache was invalidated)
      const getRequest2 = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`);
      
      const response2 = await getActivities(getRequest2);
      const data2 = await response2.json();

      expect(data2.cached).toBeFalsy();
      expect(mockPrisma.activity.findMany).toHaveBeenCalledTimes(2); // Once for each request
    });
  });

  describe('Monitoring Integration', () => {
    it('should record metrics for all API operations', async () => {
      const childId = 'child123';

      // Test profile creation
      const createRequest = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          birthDate: '2018-01-01T00:00:00.000Z',
        }),
      });

      mockPrisma.childProfile.count.mockResolvedValue(0);
      mockPrisma.childProfile.create.mockResolvedValue({
        id: childId,
        name: 'Alice',
        parentId: 'parent123',
      });
      mockPrisma.childProgress.create.mockResolvedValue({});

      await createProfile(createRequest);

      // Test activity retrieval
      const getRequest = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`);

      mockPrisma.childProfile.findFirst.mockResolvedValue({
        id: childId,
        parentId: 'parent123',
      });
      mockPrisma.activity.count.mockResolvedValue(0);
      mockPrisma.activity.findMany.mockResolvedValue([]);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      await getActivities(getRequest);

      // Verify monitoring calls
      expect(monitoring.recordAPIMetric).toHaveBeenCalledWith(
        expect.stringContaining('/api/kids/'),
        expect.any(String),
        expect.any(Number),
        expect.any(Number)
      );
      expect(monitoring.recordUserActivity).toHaveBeenCalled();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle cascading errors gracefully', async () => {
      // Simulate database connection failure
      mockPrisma.childProfile.findMany.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/kids/profile');
      const response = await getProfiles(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error occurred while retrieving profiles');

      // Monitoring should still record the error
      expect(monitoring.recordAPIMetric).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        500,
        expect.any(Number)
      );
    });

    it('should handle invalid child access attempts', async () => {
      // Try to access another parent's child
      const unauthorizedChildId = 'unauthorized-child';
      
      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest(`http://localhost:3000/api/kids/activities?childId=${unauthorizedChildId}`);
      const response = await getActivities(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('access denied');

      // Should not have attempted to fetch activities
      expect(mockPrisma.activity.findMany).not.toHaveBeenCalled();
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple concurrent requests efficiently', async () => {
      const childId = 'child123';
      const parentId = 'parent123';

      // Mock data
      mockPrisma.childProfile.findFirst.mockResolvedValue({
        id: childId,
        parentId,
      });
      mockPrisma.activity.count.mockResolvedValue(1);
      mockPrisma.activity.findMany.mockResolvedValue([{
        id: 'activity1',
        title: 'Test',
        tags: '[]',
        instructions: '[]',
        materials: '[]',
        learningObjectives: '[]',
        safetyNotes: '[]',
        accessibility: '{}',
      }]);
      mockPrisma.activityCompletion.findMany.mockResolvedValue([]);

      // Create multiple concurrent requests
      const requests = Array.from({ length: 10 }, () =>
        getActivities(new NextRequest(`http://localhost:3000/api/kids/activities?childId=${childId}`))
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(async (response) => {
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.activities).toBeDefined();
      });

      // Only the first request should hit the database (others use cache)
      expect(mockPrisma.activity.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const childId = 'child123';
      const activityId = 'activity1';

      // Set up initial state
      mockPrisma.childProfile.findFirst.mockResolvedValue({
        id: childId,
        parentId: 'parent123',
      });
      mockPrisma.activity.findUnique.mockResolvedValue({
        id: activityId,
        type: 'emotion',
      });
      mockPrisma.activityCompletion.create.mockResolvedValue({
        id: 'completion1',
        childId,
        activityId,
        completed: true,
      });

      // Mock progress tracking
      let totalActivitiesCompleted = 0;
      mockPrisma.childProgress.findUnique.mockImplementation(() =>
        Promise.resolve({
          childId,
          totalActivitiesCompleted,
          currentStreak: 0,
          longestStreak: 0,
          kindnessPoints: 0,
          creativityScore: 0,
          emotionalIntelligenceLevel: 1,
        })
      );
      mockPrisma.childProgress.update.mockImplementation(({ data }) => {
        totalActivitiesCompleted = data.totalActivitiesCompleted;
        return Promise.resolve({
          childId,
          totalActivitiesCompleted,
          ...data,
        });
      });

      // Submit multiple activities
      for (let i = 0; i < 3; i++) {
        const request = new NextRequest('http://localhost:3000/api/kids/activities', {
          method: 'POST',
          body: JSON.stringify({
            activityId,
            childId,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            completed: true,
          }),
        });

        const response = await postActivity(request);
        expect(response.status).toBe(201);
      }

      // Verify progress was updated correctly
      expect(totalActivitiesCompleted).toBe(3);
      expect(mockPrisma.childProgress.update).toHaveBeenCalledTimes(3);
    });
  });
});