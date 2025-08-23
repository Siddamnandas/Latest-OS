import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a sample couple
  const couple = await prisma.couple.create({
    data: {
      partner_a_name: "Arjun",
      partner_b_name: "Priya",
      anniversary_date: new Date("2022-02-14"),
      city: "Mumbai",
      region: "north-india",
      language: "hindi",
      children: JSON.stringify([]),
      encryption_key: "sample-key-123",
    },
  });

  console.log("Created couple:", couple);

  // Create test users for the couple
  const passwordHash = await bcrypt.hash('password123', 12);
  
  await prisma.user.createMany({
    data: [
      {
        couple_id: couple.id,
        name: "Arjun Kumar",
        email: "arjun@example.com",
        password_hash: passwordHash,
        role: "USER",
      },
      {
        couple_id: couple.id,
        name: "Priya Sharma",
        email: "priya@example.com",
        password_hash: passwordHash,
        role: "USER",
      },
    ],
  });

  // Create some sync entries
  await prisma.syncEntry.createMany({
    data: [
      {
        couple_id: couple.id,
        partner: "partner_a",
        mood_score: 4,
        energy_level: 8,
        mood_tags: JSON.stringify(["happy", "energetic"]),
        context_notes: "Great day at work, feeling productive",
      },
      {
        couple_id: couple.id,
        partner: "partner_b",
        mood_score: 5,
        energy_level: 7,
        mood_tags: JSON.stringify(["peaceful", "content"]),
        context_notes: "Had a relaxing afternoon with yoga",
      },
    ],
  });

  // Create some tasks
  await prisma.task.createMany({
    data: [
      {
        couple_id: couple.id,
        title: "Plan Date Night",
        description: "Choose a restaurant and make reservations for Friday evening",
        assigned_to: "both",
        status: "PENDING",
        category: "WEEKLY",
        due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      },
      {
        couple_id: couple.id,
        title: "Daily Check-in",
        description: "Share highlights of the day and express gratitude",
        assigned_to: "both",
        status: "COMPLETED",
        category: "DAILY",
        completed_at: new Date(),
      },
      {
        couple_id: couple.id,
        title: "Weekend Grocery Shopping",
        description: "Buy ingredients for cooking together on Sunday",
        assigned_to: "partner_a",
        status: "IN_PROGRESS",
        category: "WEEKLY",
      },
    ],
  });

  // Create ritual sessions
  await prisma.ritualSession.createMany({
    data: [
      {
        couple_id: couple.id,
        ritual_type: "DAILY_SYNC",
        archetype: "RADHA_KRISHNA",
        duration_minutes: 15,
        completion_data: JSON.stringify({
          mood_alignment: 92,
          topics_discussed: ["work", "plans", "gratitude"],
        }),
        completed_at: new Date(),
      },
      {
        couple_id: couple.id,
        ritual_type: "CONNECTION_RITUAL",
        archetype: "SHIVA_SHAKTI",
        duration_minutes: 30,
        completion_data: JSON.stringify({
          connection_level: 95,
          activities: ["meditation", "sharing", "intention_setting"],
        }),
        completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
    ],
  });

  // Create Rasa balance
  await prisma.rasaBalance.create({
    data: {
      couple_id: couple.id,
      play_percentage: 65.0,
      duty_percentage: 35.0,
      balance_percentage: 85.0,
    },
  });

  // Create reward transactions
  await prisma.rewardTransaction.createMany({
    data: [
      {
        couple_id: couple.id,
        coins_earned: 50,
        coins_spent: 0,
        activity: "Daily login bonus",
      },
      {
        couple_id: couple.id,
        coins_earned: 25,
        coins_spent: 0,
        activity: "Completed daily sync ritual",
      },
      {
        couple_id: couple.id,
        coins_earned: 30,
        coins_spent: 0,
        activity: "Maintained 7-day streak",
      },
      {
        couple_id: couple.id,
        coins_earned: 0,
        coins_spent: 20,
        activity: "Unlocked premium ritual guide",
      },
    ],
  });

  // Create memories
  await prisma.memory.createMany({
    data: [
      {
        couple_id: couple.id,
        type: "text",
        content: "Had the most beautiful sunset dinner on our anniversary. The way you looked at me reminded me why I fell in love with you.",
        title: "Anniversary Sunset",
        description: "Romantic dinner celebrating our love",
        tags: JSON.stringify(["anniversary", "romantic", "dinner", "sunset"]),
        sentiment: "positive",
        partners: JSON.stringify(["partner_a", "partner_b"]),
        memory_type: "general",
      },
      {
        couple_id: couple.id,
        type: "text",
        content: "Today you surprised me by making my favorite chai when I was feeling down. Small gestures like these make my heart full.",
        title: "Chai Love",
        description: "Thoughtful gesture during a difficult day",
        tags: JSON.stringify(["kindness", "care", "chai", "surprise"]),
        sentiment: "positive",
        partners: JSON.stringify(["partner_b"]),
        memory_type: "kindness",
      },
    ],
  });

  // Create shared goals
  await prisma.sharedGoal.createMany({
    data: [
      {
        couple_id: couple.id,
        title: "Communication Growth",
        description: "Improve our daily communication and active listening skills",
        target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
        completed: false,
      },
      {
        couple_id: couple.id,
        title: "Plan Dream Vacation",
        description: "Research and plan our trip to Kerala backwaters",
        target_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        completed: false,
      },
      {
        couple_id: couple.id,
        title: "Monthly Date Nights",
        description: "Commit to having quality time together twice a month",
        completed: true,
      },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        couple_id: couple.id,
        title: "Daily Sync Reminder",
        message: "Time for your evening connection ritual! 💕",
        read: false,
      },
      {
        couple_id: couple.id,
        title: "Streak Achievement",
        message: "Congratulations! You've maintained your relationship streak for 7 days! 🔥",
        read: true,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`👫 Couple: ${couple.partner_a_name} & ${couple.partner_b_name}`);
  console.log(`🔥 Sample data created for relationship tracking`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });