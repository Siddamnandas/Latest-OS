// Comprehensive tests for Kids Profile API Route
// Testing profile CRUD operations, validation, and parent-child relationship security

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET, POST, PUT, DELETE } from '../route';
import { prisma } from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';

// Mock dependencies
jest.mock('next-auth');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    childProfile: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    childProgress: {
      create: jest.fn(),
      delete: jest.fn(),
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

describe('/api/kids/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/kids/profile', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to access child profiles.');
    });

    it('should return all child profiles for authenticated parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockProfiles = [
        {
          id: 'child1',
          name: 'Alice',
          birthDate: new Date('2018-01-01'),
          avatar: 'avatar1.jpg',
          parentId: 'parent123',
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: {
            totalActivitiesCompleted: 10,
            currentStreak: 3,
          },
          achievements: [
            { name: 'First Steps', earned: true },
          ],
        },
        {
          id: 'child2',
          name: 'Bob',
          birthDate: new Date('2020-06-15'),
          avatar: 'avatar2.jpg',
          parentId: 'parent123',
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: {
            totalActivitiesCompleted: 5,
            currentStreak: 1,
          },
          achievements: [],
        },
      ];

      mockPrisma.childProfile.findMany.mockResolvedValue(mockProfiles);

      const request = new NextRequest('http://localhost:3000/api/kids/profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.children).toHaveLength(2);
      expect(data.children[0].name).toBe('Alice');
      expect(data.children[0].age).toBeDefined();
      expect(data.children[0].ageGroup).toBeDefined();
      expect(data.children[1].name).toBe('Bob');
    });

    it('should return specific child profile when childId is provided', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockProfile = {
        id: 'child1',
        name: 'Alice',
        birthDate: new Date('2018-01-01'),
        avatar: 'avatar1.jpg',
        parentId: 'parent123',
        preferences: {
          favoriteActivities: ['emotion', 'creativity'],
          difficulty: 'medium',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {
          totalActivitiesCompleted: 10,
          currentStreak: 3,
        },
        achievements: [],
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(mockProfile);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.child.name).toBe('Alice');
      expect(data.child.age).toBeDefined();
      expect(data.child.ageGroup).toBeDefined();
      expect(data.child.preferences).toBeDefined();
    });

    it('should return 404 when specific child is not found or access denied', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=unauthorized-child');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child profile not found or access denied.');
    });

    it('should handle database errors gracefully', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findMany.mockRejectedValue(new Error('Database connection error'));

      const request = new NextRequest('http://localhost:3000/api/kids/profile');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error occurred while retrieving profiles');
    });
  });

  describe('POST /api/kids/profile', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          birthDate: '2018-01-01',
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to create child profiles.');
    });

    it('should validate profile data correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: '', // Invalid empty name
          birthDate: 'invalid-date', // Invalid date format
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid profile data');
      expect(data.details).toBeDefined();
    });

    it('should enforce maximum child profile limit', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.count.mockResolvedValue(10); // Already at max limit

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          birthDate: '2018-01-01T00:00:00.000Z',
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Maximum number of child profiles reached (10). Please contact support if you need more.');
    });

    it('should successfully create child profile with default preferences', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const mockNewChild = {
        id: 'child123',
        name: 'Alice',
        birthDate: new Date('2018-01-01'),
        avatar: null,
        parentId: 'parent123',
        preferences: {
          learningStyle: 'mixed',
          favoriteActivities: ['emotion', 'kindness'],
          difficulty: 'easy',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.childProfile.count.mockResolvedValue(0);
      mockPrisma.childProfile.create.mockResolvedValue(mockNewChild);
      mockPrisma.childProgress.create.mockResolvedValue({
        id: 'progress123',
        childId: 'child123',
        totalActivitiesCompleted: 0,
      });

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Alice',
          birthDate: '2018-01-01T00:00:00.000Z',
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.child.name).toBe('Alice');
      expect(data.child.age).toBeDefined();
      expect(data.child.ageGroup).toBeDefined();
      expect(data.message).toBe('Child profile created successfully');
      expect(mockPrisma.childProgress.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          childId: 'child123',
          totalActivitiesCompleted: 0,
        })
      });
    });

    it('should create profile with custom preferences', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const customPreferences = {
        learningStyle: 'visual',
        favoriteActivities: ['creativity', 'music'],
        difficulty: 'medium',
        parentalControls: {
          screenTimeLimit: 45,
          requireParentApproval: true,
        },
      };

      const mockNewChild = {
        id: 'child123',
        name: 'Bob',
        birthDate: new Date('2020-06-15'),
        avatar: 'custom-avatar.jpg',
        parentId: 'parent123',
        preferences: customPreferences,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.childProfile.count.mockResolvedValue(1);
      mockPrisma.childProfile.create.mockResolvedValue(mockNewChild);
      mockPrisma.childProgress.create.mockResolvedValue({
        id: 'progress123',
        childId: 'child123',
      });

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Bob',
          birthDate: '2020-06-15T00:00:00.000Z',
          avatar: 'custom-avatar.jpg',
          preferences: customPreferences,
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.child.name).toBe('Bob');
      expect(data.child.preferences).toEqual(customPreferences);
    });
  });

  describe('PUT /api/kids/profile', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to update child profiles.');
    });

    it('should return 400 when childId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Child ID is required');
    });

    it('should return 404 when child does not belong to parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=unauthorized-child', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child profile not found or access denied.');
    });

    it('should successfully update child profile', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const existingChild = {
        id: 'child123',
        name: 'Alice',
        birthDate: new Date('2018-01-01'),
        avatar: 'old-avatar.jpg',
        parentId: 'parent123',
        preferences: {
          difficulty: 'easy',
        },
      };

      const updatedChild = {
        ...existingChild,
        name: 'Alice Updated',
        avatar: 'new-avatar.jpg',
        preferences: {
          difficulty: 'medium',
          favoriteActivities: ['creativity'],
        },
        progress: null,
        achievements: [],
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(existingChild);
      mockPrisma.childProfile.update.mockResolvedValue(updatedChild);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Alice Updated',
          avatar: 'new-avatar.jpg',
          preferences: {
            favoriteActivities: ['creativity'],
          },
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.child.name).toBe('Alice Updated');
      expect(data.child.avatar).toBe('new-avatar.jpg');
      expect(data.message).toBe('Child profile updated successfully');
    });

    it('should merge preferences correctly', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const existingChild = {
        id: 'child123',
        name: 'Alice',
        parentId: 'parent123',
        preferences: {
          difficulty: 'easy',
          learningStyle: 'visual',
          parentalControls: {
            screenTimeLimit: 60,
          },
        },
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(existingChild);
      mockPrisma.childProfile.update.mockImplementation(({ data }) => 
        Promise.resolve({ ...existingChild, ...data, progress: null, achievements: [] })
      );

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123', {
        method: 'PUT',
        body: JSON.stringify({
          preferences: {
            difficulty: 'medium', // Update existing
            favoriteActivities: ['creativity'], // Add new
          },
        })
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockPrisma.childProfile.update).toHaveBeenCalledWith({
        where: { id: 'child123' },
        data: expect.objectContaining({
          preferences: {
            difficulty: 'medium',
            learningStyle: 'visual',
            parentalControls: {
              screenTimeLimit: 60,
            },
            favoriteActivities: ['creativity'],
          },
        }),
        include: {
          progress: true,
          achievements: true,
        },
      });
    });
  });

  describe('DELETE /api/kids/profile', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123&confirm=true', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required. Parents must be logged in to delete child profiles.');
    });

    it('should return 400 when childId is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?confirm=true', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Child ID is required');
    });

    it('should return 400 when confirmation is missing', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Deletion must be confirmed. Add confirm=true to the request.');
    });

    it('should return 404 when child does not belong to parent', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      mockPrisma.childProfile.findFirst.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=unauthorized-child&confirm=true', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Child profile not found or access denied.');
    });

    it('should successfully delete child profile and related data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'parent123' },
      } as any);

      const existingChild = {
        id: 'child123',
        name: 'Alice',
        parentId: 'parent123',
      };

      mockPrisma.childProfile.findFirst.mockResolvedValue(existingChild);
      mockPrisma.childProgress.delete.mockResolvedValue({});
      mockPrisma.childProfile.delete.mockResolvedValue(existingChild);

      const request = new NextRequest('http://localhost:3000/api/kids/profile?childId=child123&confirm=true', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Child profile deleted successfully');
      expect(mockPrisma.childProgress.delete).toHaveBeenCalledWith({
        where: { childId: 'child123' },
      });
      expect(mockPrisma.childProfile.delete).toHaveBeenCalledWith({
        where: { id: 'child123' },
      });
    });
  });
});