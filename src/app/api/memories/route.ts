import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Memory creation validation schema
const createMemorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['text', 'audio', 'video', 'image']),
  content: z.string().optional(), // Text content or media URL
  memory_type: z.enum(['kindness', 'storybook', 'general']).optional(),
  is_private: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Search query validation
const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  type: z.enum(['text', 'audio', 'video', 'image']).optional(),
  memory_type: z.enum(['kindness', 'storybook', 'general']).optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

// Helper function to analyze emotions from text
async function analyzeEmotion(text: string): Promise<string> {
  // Simple emotion analysis (in production, use AI service)
  const lowerText = text.toLowerCase();

  // Emotional keywords mapping to sentiment
  const positiveWords = ['happy', 'love', 'joy', 'amazing', 'wonderful', 'great', 'beautiful', 'excited', 'proud', 'fulfilled'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'upset', 'difficult', 'challenging', 'worried'];

  const positiveCount = positiveWords.reduce((count, word) =>
    count + (lowerText.includes(word) ? 1 : 0), 0);
  const negativeCount = negativeWords.reduce((count, word) =>
    count + (lowerText.includes(word) ? 1 : 0), 0);

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Helper function to generate AI-powered tags
async function generateTags(content: string, type: string): Promise<string[]> {
  const tags: string[] = [];

  // Basic tag generation based on content patterns
  if (content.includes('birthday') || content.includes('anniversary')) {
    tags.push('celebration');
  }
  if (content.includes('beach') || content.includes('vacation')) {
    tags.push('travel', 'vacation');
  }
  if (content.includes('family') || content.includes('parents') || content.includes('kids')) {
    tags.push('family');
  }
  if (content.includes('food') || content.includes('restaurant') || content.includes('cooking')) {
    tags.push('food', 'cooking');
  }

  // Media type specific tags
  if (type === 'image') tags.push('photo', 'visual');
  if (type === 'video') tags.push('video', 'motion');
  if (type === 'audio') tags.push('audio', 'sound');

  return [...new Set(tags)]; // Remove duplicates
}

// Helper function to determine memory type
async function categorizeMemory(content: string): Promise<string> {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('kind') || lowerContent.includes('helped') ||
      lowerContent.includes('support') || lowerContent.includes('caring')) {
    return 'kindness';
  }

  if (lowerContent.includes('story') || lowerContent.includes('read') ||
      lowerContent.includes('fairytale') || lowerContent.includes('storybook')) {
    return 'storybook';
  }

  return 'general';
}

// Helper function to analyze relationship insights from memories
async function extractRelationshipInsights(coupleId: string): Promise<{
  totalMemories: number;
  emotionalBalance: 'positive' | 'neutral' | 'negative';
  dominantCategories: string[];
  memoryFrequency: string;
  topEmotions: string[];
  growthAreas: string[];
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const recentMemories = await prisma.memory.findMany({
    where: {
      couple_id: coupleId,
      created_at: {
        gte: thirtyDaysAgo,
      },
    },
  });

  if (recentMemories.length === 0) {
    return {
      totalMemories: 0,
      emotionalBalance: 'neutral',
      dominantCategories: [],
      memoryFrequency: 'No data',
      topEmotions: [],
      growthAreas: [],
    };
  }

  // Analyze emotional patterns
  const sentiments = recentMemories.map(mem => mem.sentiment);
  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const emotionalBalance = positiveCount > sentiments.length * 0.6 ? 'positive' :
                          positiveCount < sentiments.length * 0.3 ? 'negative' : 'neutral';

  // Identify dominant categories
  const categories = recentMemories.map(mem => mem.memory_type).filter(Boolean);
  const categoryCounts = categories.reduce((acc: Record<string, number>, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const dominantCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat,]) => cat);

  // Calculate memory frequency
  const totalDays = 30;
  const uniqueDays = new Set(
    recentMemories.map(mem => mem.created_at.toISOString().split('T')[0])
  ).size;

  const frequencyRate = uniqueDays / totalDays;
  let memoryFrequency = 'Rare';
  if (frequencyRate > 0.8) memoryFrequency = 'Excellent';
  else if (frequencyRate > 0.6) memoryFrequency = 'Good';
  else if (frequencyRate > 0.4) memoryFrequency = 'Fair';
  else if (frequencyRate > 0.2) memoryFrequency = 'Poor';

  // Analyze common emotions
  const emotionTags = recentMemories.flatMap(mem =>
    JSON.parse(mem.tags || '[]') as string[]
  );
  const emotionCounts = emotionTags.reduce((acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topEmotions = Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([emotion,]) => emotion);

  // Identify growth areas
  const growthAreas: string[] = [];
  if (positiveCount < sentiments.length * 0.3) {
    growthAreas.push('Emotional connection needs strengthening');
  }
  if (dominantCategories.length === 0) {
    growthAreas.push('Categorizing memories could improve insights');
  }
  if (memoryFrequency === 'Rare') {
    growthAreas.push('Regular memory sharing could enhance relationship');
  }

  return {
    totalMemories: recentMemories.length,
    emotionalBalance,
    dominantCategories,
    memoryFrequency,
    topEmotions: topEmotions.length > 0 ? topEmotions : ['neutral'],
    growthAreas,
  };
}

// POST - Create new memory with AI processing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validationResult = createMemorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const memoryData = validationResult.data;

    // For now, get user ID from mock (in real app, from session/auth)
    const mockCoupleId = '1';
    const mockPartners = ['partner1']; // In real app, determine based on request

    // AI Processing Pipeline
    const contentToAnalyze = memoryData.content || memoryData.title;

    // Run AI analysis concurrently
    const [sentiment, aiTags, memoryType] = await Promise.all([
      analyzeEmotion(contentToAnalyze),
      generateTags(contentToAnalyze, memoryData.type),
      categorizeMemory(contentToAnalyze),
    ]);

    // Combine user tags with AI tags
    const allTags = [...(memoryData.tags || []), ...aiTags];
    const uniqueTags = [...new Set(allTags)];

    // Create memory in database
    const memory = await prisma.memory.create({
      data: {
        couple_id: mockCoupleId,
        title: memoryData.title,
        description: memoryData.description || null,
        type: memoryData.type,
        content: memoryData.content || null,
        tags: JSON.stringify(uniqueTags),
        sentiment: sentiment,
        partners: JSON.stringify(mockPartners),
        is_private: memoryData.is_private || false,
        memory_type: memoryData.memory_type || memoryType,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Update couple's reward transactions with memory creation
    await prisma.rewardTransaction.create({
      data: {
        couple_id: mockCoupleId,
        coins_earned: memoryData.memory_type === 'kindness' ? 25 : 15,
        coins_spent: 0,
        activity: `Created ${memoryData.type} memory: ${memoryData.title}`,
      },
    });

    // Transform response
    const responseMemory = {
      id: memory.id,
      title: memory.title,
      description: memory.description,
      type: memory.type,
      content: memory.content,
      tags: uniqueTags,
      sentiment: memory.sentiment,
      memory_type: memory.memory_type,
      is_private: memory.is_private,
      date: memory.date.toISOString(),
      created_at: memory.created_at.toISOString(),
      updated_at: memory.updated_at.toISOString(),
      aiInsights: {
        generatedTags: aiTags,
        emotionAnalysis: sentiment,
        category: memoryType,
        emotionalScore: sentiment === 'positive' ? 8 : sentiment === 'neutral' ? 5 : 3,
      },
    };

    return NextResponse.json({
      memory: responseMemory,
      insights: {
        message: `${sentiment === 'positive' ? 'Beautiful memory!' : sentiment === 'neutral' ? 'Happy milestone!' : 'Memory captured for reflection.'}`,
        suggestions: uniqueTags.length > 0 ? `Consider exploring memories tagged with: ${uniqueTags.slice(0, 2).join(', ')}` : '',
      },
    });

  } catch (error) {
    console.error('Error creating memory:', error);
    return NextResponse.json(
      { error: 'Failed to create memory' },
      { status: 500 }
    );
  }
}

// GET - Fetch memories with intelligent filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const searchQuery = searchParams.get('q');
    const typeFilter = searchParams.get('type');
    const memoryTypeFilter = searchParams.get('memory_type');
    const sentimentFilter = searchParams.get('sentiment');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // For now, get mock couple ID
    const mockCoupleId = '1';

    // Build query conditions
    const whereClause: any = {
      couple_id: mockCoupleId,
    };

    // Add filters
    if (typeFilter) whereClause.type = typeFilter;
    if (memoryTypeFilter) whereClause.memory_type = memoryTypeFilter;
    if (sentimentFilter) whereClause.sentiment = sentimentFilter;

    // Date filters
    if (fromDate || toDate) {
      whereClause.date = {};
      if (fromDate) whereClause.date.gte = new Date(fromDate);
      if (toDate) whereClause.date.lte = new Date(toDate);
    }

    // Text search across title, description, and content
    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
        {
          AND: [
            { tags: { contains: searchQuery.toLowerCase() } }
          ]
        }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.memory.count({
      where: whereClause,
    });

    // Fetch memories with pagination and sorting
    const memories = await prisma.memory.findMany({
      where: whereClause,
      orderBy: {
        [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc',
      },
      take: limit,
      skip: offset,
    });

    // Transform memories for response
    const transformedMemories = memories.map(memory => ({
      id: memory.id,
      title: memory.title,
      description: memory.description,
      type: memory.type,
      content: memory.content,
      tags: JSON.parse(memory.tags || '[]'),
      sentiment: memory.sentiment,
      memory_type: memory.memory_type,
      is_private: memory.is_private,
      date: memory.date.toISOString(),
      created_at: memory.created_at.toISOString(),
      updated_at: memory.updated_at.toISOString(),
    }));

    // Get relationship insights if not searching
    const shouldIncludeInsights = !searchQuery && sortBy === 'created_at';
    const insights = shouldIncludeInsights ?
      await extractRelationshipInsights(mockCoupleId) : null;

    const response = {
      memories: transformedMemories,
      pagination: {
        total: totalCount,
        limit: limit,
        offset: offset,
        hasMore: offset + limit < totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      ...(insights && { relationshipInsights: insights }),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}
