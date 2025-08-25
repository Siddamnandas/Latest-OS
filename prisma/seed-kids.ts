// Kids Activities Database Seed
// This file seeds the database with initial kids activities data

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const activitiesData = [
  {
    id: 'emotion_1',
    title: 'The Happy Bunny',
    description: 'Help the bunny understand different emotions',
    type: 'emotion',
    difficulty: 'easy',
    ageMin: 3,
    ageMax: 6,
    estimatedDuration: 10,
    tags: JSON.stringify(['emotions', 'animals', 'empathy']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Meet the Bunny',
        description: 'Look at the bunny and guess how it feels',
        interactionType: 'tap'
      },
      {
        step: 2,
        title: 'Choose the Emotion',
        description: 'Select the emotion that matches the bunny\'s face',
        interactionType: 'tap'
      },
      {
        step: 3,
        title: 'Talk About It',
        description: 'Discuss with your parent why the bunny feels this way',
        interactionType: 'speak'
      }
    ]),
    materials: JSON.stringify([]),
    learningObjectives: JSON.stringify(['Emotion recognition', 'Empathy development', 'Vocabulary building']),
    parentGuidance: 'Encourage your child to express their own emotions while helping the bunny',
    safetyNotes: JSON.stringify(['Supervised interaction recommended']),
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    })
  },
  {
    id: 'kindness_1',
    title: 'Helping Hands',
    description: 'Learn about helping others through simple acts',
    type: 'kindness',
    difficulty: 'easy',
    ageMin: 4,
    ageMax: 8,
    estimatedDuration: 15,
    tags: JSON.stringify(['kindness', 'helping', 'community']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Find Someone to Help',
        description: 'Look around and find someone who needs help',
        interactionType: 'move'
      },
      {
        step: 2,
        title: 'Offer Help',
        description: 'Ask if you can help them',
        interactionType: 'speak'
      },
      {
        step: 3,
        title: 'Help and Reflect',
        description: 'Help them and think about how it makes you feel',
        interactionType: 'move'
      }
    ]),
    materials: JSON.stringify([]),
    learningObjectives: JSON.stringify(['Kindness', 'Social awareness', 'Empathy']),
    parentGuidance: 'Guide your child to identify appropriate ways to help others',
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    })
  },
  {
    id: 'creative_1',
    title: 'Rainbow Art',
    description: 'Create beautiful rainbow art while learning about colors',
    type: 'creativity',
    difficulty: 'easy',
    ageMin: 3,
    ageMax: 10,
    estimatedDuration: 25,
    tags: JSON.stringify(['art', 'colors', 'creativity', 'fine-motor']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Gather Materials',
        description: 'Collect paper, colors, and brushes',
        interactionType: 'move'
      },
      {
        step: 2,
        title: 'Draw the Rainbow',
        description: 'Draw a beautiful rainbow using all the colors',
        interactionType: 'draw'
      },
      {
        step: 3,
        title: 'Share Your Art',
        description: 'Show your rainbow to family and explain what you love about it',
        interactionType: 'speak'
      }
    ]),
    materials: JSON.stringify(['Paper', 'Colored pencils or crayons', 'Paintbrush (optional)', 'Water colors (optional)']),
    learningObjectives: JSON.stringify(['Color recognition', 'Fine motor skills', 'Creative expression', 'Art appreciation']),
    parentGuidance: 'Encourage creativity and avoid correcting the child\'s artistic choices',
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: false,
      largeText: true,
      highContrast: false,
      reducedMotion: true,
      audioDescriptions: true
    })
  },
  {
    id: 'story_1',
    title: 'Krishna\'s Flute',
    description: 'Learn about Krishna and the magic of his flute music',
    type: 'story',
    difficulty: 'medium',
    ageMin: 5,
    ageMax: 10,
    estimatedDuration: 20,
    tags: JSON.stringify(['mythology', 'music', 'Krishna', 'culture']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Listen to the Story',
        description: 'Listen carefully to the story of Krishna and his magical flute',
        interactionType: 'read'
      },
      {
        step: 2,
        title: 'Answer Questions',
        description: 'Answer questions about what you learned',
        interactionType: 'tap'
      },
      {
        step: 3,
        title: 'Act Out the Story',
        description: 'Pretend to play the flute like Krishna',
        interactionType: 'move'
      }
    ]),
    materials: JSON.stringify(['Story book or device for audio', 'Optional: toy flute or pretend flute']),
    learningObjectives: JSON.stringify(['Cultural knowledge', 'Listening skills', 'Story comprehension', 'Creative play']),
    parentGuidance: 'Help your child understand the moral lessons in the story',
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    })
  },
  {
    id: 'music_1',
    title: 'Musical Emotions',
    description: 'Express different emotions through music and movement',
    type: 'music',
    difficulty: 'easy',
    ageMin: 3,
    ageMax: 8,
    estimatedDuration: 15,
    tags: JSON.stringify(['music', 'emotions', 'movement', 'expression']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Listen to Different Music',
        description: 'Listen to happy, sad, exciting, and calm music',
        interactionType: 'listen'
      },
      {
        step: 2,
        title: 'Move to the Music',
        description: 'Move your body to show how the music makes you feel',
        interactionType: 'move'
      },
      {
        step: 3,
        title: 'Create Your Own Music',
        description: 'Use simple instruments to make music that shows different feelings',
        interactionType: 'create'
      }
    ]),
    materials: JSON.stringify(['Simple instruments (shakers, bells, drums)', 'Music player or device', 'Open space for movement']),
    learningObjectives: JSON.stringify(['Emotional expression', 'Musical awareness', 'Body movement', 'Creative expression']),
    parentGuidance: 'Encourage free expression and validate all emotional responses to music',
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: false,
      audioDescriptions: true
    })
  },
  {
    id: 'movement_1',
    title: 'Animal Yoga',
    description: 'Learn yoga poses inspired by animals while building strength and flexibility',
    type: 'movement',
    difficulty: 'easy',
    ageMin: 4,
    ageMax: 10,
    estimatedDuration: 20,
    tags: JSON.stringify(['yoga', 'animals', 'movement', 'mindfulness']),
    instructions: JSON.stringify([
      {
        step: 1,
        title: 'Learn Animal Poses',
        description: 'Practice cat, dog, frog, and butterfly poses',
        interactionType: 'move'
      },
      {
        step: 2,
        title: 'Animal Stories',
        description: 'Tell stories while doing the poses',
        interactionType: 'speak'
      },
      {
        step: 3,
        title: 'Relaxation Time',
        description: 'End with quiet breathing like a sleeping animal',
        interactionType: 'breathe'
      }
    ]),
    materials: JSON.stringify(['Yoga mat or soft surface', 'Comfortable clothing', 'Calm music (optional)']),
    learningObjectives: JSON.stringify(['Physical coordination', 'Body awareness', 'Mindfulness', 'Animal knowledge']),
    parentGuidance: 'Focus on fun rather than perfect poses. Encourage gentle movement and breathing',
    accessibility: JSON.stringify({
      screenReaderSupport: true,
      voiceNavigation: true,
      largeText: true,
      highContrast: true,
      reducedMotion: true,
      audioDescriptions: true
    })
  }
];

async function seedKidsActivities() {
  console.log('🌱 Seeding kids activities database...');

  try {
    // Clear existing activities
    await prisma.activityCompletion.deleteMany();
    await prisma.activity.deleteMany();
    
    console.log('📝 Creating activities...');
    
    // Create activities
    for (const activity of activitiesData) {
      await prisma.activity.create({
        data: activity
      });
    }
    
    console.log(`✅ Created ${activitiesData.length} activities`);
    console.log('🎉 Kids activities database seeded successfully!');
    
    // Log summary
    const emotionActivities = activitiesData.filter(a => a.type === 'emotion').length;
    const kindnessActivities = activitiesData.filter(a => a.type === 'kindness').length;
    const creativeActivities = activitiesData.filter(a => a.type === 'creativity').length;
    const storyActivities = activitiesData.filter(a => a.type === 'story').length;
    const musicActivities = activitiesData.filter(a => a.type === 'music').length;
    const movementActivities = activitiesData.filter(a => a.type === 'movement').length;
    
    console.log('📊 Activity Summary:');
    console.log(`   • Emotion activities: ${emotionActivities}`);
    console.log(`   • Kindness activities: ${kindnessActivities}`);
    console.log(`   • Creative activities: ${creativeActivities}`);
    console.log(`   • Story activities: ${storyActivities}`);
    console.log(`   • Music activities: ${musicActivities}`);
    console.log(`   • Movement activities: ${movementActivities}`);
    
  } catch (error) {
    console.error('❌ Error seeding kids activities database:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedKidsActivities();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { seedKidsActivities };