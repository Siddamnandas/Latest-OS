#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';

// Test data
const testCouple = {
  partner_a_name: 'Rahul',
  partner_b_name: 'Priya',
  anniversary_date: '2020-02-14',
  city: 'Mumbai',
  children: [
    { name: 'Aarav', age: 8 },
    { name: 'Ananya', age: 5 }
  ]
};

const testTask = {
  title: 'Buy groceries',
  description: 'Weekly grocery shopping',
  assigned_to: 'partner_a',
  category: 'WEEKLY'
};

const testSync = {
  partner: 'partner_a',
  mood_score: 4,
  energy_level: 7,
  mood_tags: ['#happy', '#productive'],
  context_notes: 'Had a great day at work'
};

// Test functions
async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const result = await response.json();

    console.log(`${method} ${endpoint}:`, response.status, result);
    
    if (!response.ok) {
      console.error(`❌ Error: ${result.error || 'Unknown error'}`);
    } else {
      console.log(`✅ Success`);
    }

    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Leela OS API Tests...\n');

  // Test 1: Create a couple
  console.log('1. Testing couple creation...');
  const couple = await testEndpoint('/couples', 'POST', testCouple);
  if (!couple) {
    console.log('❌ Failed to create couple, stopping tests');
    return;
  }
  const coupleId = couple.id;

  // Test 2: Get couple details
  console.log('\n2. Testing get couple...');
  await testEndpoint(`/couples?id=${coupleId}`);

  // Test 3: Create daily sync
  console.log('\n3. Testing daily sync creation...');
  const syncData = { ...testSync, couple_id: coupleId };
  const sync = await testEndpoint('/sync', 'POST', syncData);

  // Test 4: Get sync entries
  console.log('\n4. Testing get sync entries...');
  await testEndpoint(`/sync?couple_id=${coupleId}`);

  // Test 5: Create task
  console.log('\n5. Testing task creation...');
  const taskData = { ...testTask, couple_id: coupleId };
  const task = await testEndpoint('/tasks', 'POST', taskData);

  // Test 6: Get tasks
  console.log('\n6. Testing get tasks...');
  await testEndpoint(`/tasks?couple_id=${coupleId}`);

  // Test 7: Update task status
  console.log('\n7. Testing task completion...');
  if (task) {
    await testEndpoint(`/tasks?id=${task.id}&action=complete`, 'PUT', { status: 'COMPLETED' });
  }

  // Test 8: Create AI suggestion
  console.log('\n8. Testing AI suggestion creation...');
  const aiSuggestion = {
    couple_id: coupleId,
    type: 'ritual',
    archetype: 'radha_krishna',
    title: 'Evening Connection Ritual',
    description: 'Spend 15 minutes connecting with your partner',
    action_steps: ['Sit together', 'Share your day', 'Express gratitude'],
    estimated_duration: 15,
    reward_coins: 20,
    reasoning: { trigger: 'evening_routine', severity: 5, factors: ['connection', 'relaxation'] }
  };
  await testEndpoint('/ai-suggestions', 'POST', aiSuggestion);

  // Test 9: Get AI suggestions
  console.log('\n9. Testing get AI suggestions...');
  await testEndpoint(`/ai-suggestions?couple_id=${coupleId}`);

  // Test 10: Get kids activities
  console.log('\n10. Testing kids activities...');
  await testEndpoint('/kids-activities');

  // Test 11: Create kindness memory
  console.log('\n11. Testing kindness memory creation...');
  const memory = {
    couple_id: coupleId,
    type: 'text',
    content: 'Helped an elderly person cross the street today',
    title: 'Daily Kindness',
    memory_type: 'kindness',
    tags: ['kindness', 'helping', 'community']
  };
  await testEndpoint('/memories', 'POST', memory);

  // Test 12: Get memories
  console.log('\n12. Testing get memories...');
  await testEndpoint(`/memories?couple_id=${coupleId}`);

  // Test 13: Get rewards
  console.log('\n13. Testing rewards system...');
  await testEndpoint(`/rewards?couple_id=${coupleId}`);

  // Test 14: Create reward transaction
  console.log('\n14. Testing reward transaction...');
  const reward = {
    couple_id: coupleId,
    coins_earned: 50,
    activity: 'Completed weekly challenge'
  };
  await testEndpoint('/rewards', 'POST', reward);

  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };