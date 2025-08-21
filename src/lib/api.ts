// API Service for Leela OS
export class LeelaOSAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Couple Management
  async createCouple(data: any) {
    return this.request('/couples', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCouple(coupleId: string) {
    return this.request(`/couples?id=${coupleId}`);
  }

  // Daily Sync
  async createSyncEntry(data: any) {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSyncEntries(coupleId: string, todayOnly = false) {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (todayOnly) params.append('today', 'true');
    return this.request(`/sync?${params}`);
  }

  // Task Management
  async createTask(data: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(coupleId: string, filters?: any) {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.status) params.append('status', filters.status);
    if (filters?.assigned_to) params.append('assigned_to', filters.assigned_to);
    return this.request(`/tasks?${params}`);
  }

  async updateTask(taskId: string, data: any) {
    return this.request(`/tasks?id=${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks?id=${taskId}`, {
      method: 'DELETE',
    });
  }

  // AI Suggestions
  async createAISuggestion(data: any) {
    return this.request('/ai-suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAISuggestions(coupleId: string, filters?: any) {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.type) params.append('type', filters.type);
    if (filters?.pending !== undefined) params.append('pending', filters.pending.toString());
    return this.request(`/ai-suggestions?${params}`);
  }

  async updateAISuggestion(suggestionId: string, action: 'accept' | 'complete' | 'reject') {
    return this.request(`/ai-suggestions?id=${suggestionId}&action=${action}`, {
      method: 'PUT',
    });
  }

  // Kids Activities
  async getDailyActivityTheme() {
    return this.request('/kids-activities');
  }

  async createKidActivity(data: any) {
    return this.request('/kids-activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKidActivities(childId: string, filters?: any) {
    const params = new URLSearchParams({ child_id: childId });
    if (filters?.theme) params.append('theme', filters.theme);
    if (filters?.completed !== undefined) params.append('completed', filters.completed.toString());
    return this.request(`/kids-activities?${params}`);
  }

  async updateKidActivity(activityId: string, data: any) {
    return this.request(`/kids-activities?id=${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Memories & Kindness Jar
  async createMemory(formData: FormData) {
    return this.request('/memories', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getMemories(coupleId: string, filters?: any) {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.type) params.append('type', filters.type);
    if (filters?.memory_type) params.append('memory_type', filters.memory_type);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    return this.request(`/memories?${params}`);
  }

  async updateMemory(memoryId: string, data: any) {
    return this.request(`/memories?id=${memoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(memoryId: string) {
    return this.request(`/memories?id=${memoryId}`, {
      method: 'DELETE',
    });
  }

  // Rewards & Gamification
  async getRewards(coupleId: string) {
    return this.request(`/rewards?couple_id=${coupleId}`);
  }

  async createRewardTransaction(data: any) {
    return this.request('/rewards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
export const leelaOSAPI = new LeelaOSAPI();

// React hook for API calls
export function useLeelaOSAPI() {
  return leelaOSAPI;
}