import type { paths } from './api-types';

type APIRequest<P extends keyof paths, M extends keyof paths[P]> =
  paths[P][M] extends { requestBody?: { content?: { 'application/json'?: infer R } } }
    ? R
    : unknown;

type APIResponse<P extends keyof paths, M extends keyof paths[P]> =
  paths[P][M] extends { responses: { 200: { content?: { 'application/json'?: infer R } } } }
    ? R
    : unknown;

type APIQuery<P extends keyof paths, M extends keyof paths[P]> =
  paths[P][M] extends { parameters: { query?: infer Q } }
    ? Q extends Record<string, unknown> ? Q : Record<string, string>
    : Record<string, string>;

export type APIError = { error: string };

// API Service for Leela OS
export class LeelaOSAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  private async request<TResponse>(endpoint: string, options: RequestInit = {}): Promise<TResponse> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let error: APIError;
      try {
        error = await response.json();
      } catch {
        error = { error: 'API request failed' };
      }
      throw new Error(error.error);
    }

    return response.json() as Promise<TResponse>;
  }

  // Couple Management
  async createCouple(
    data: APIRequest<'/api/couples', 'post'>
  ): Promise<APIResponse<'/api/couples', 'post'>> {
    return this.request<APIResponse<'/api/couples', 'post'>>('/couples', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCouple(coupleId: string): Promise<APIResponse<'/api/couples', 'get'>> {
    return this.request<APIResponse<'/api/couples', 'get'>>(`/couples?id=${coupleId}`);
  }

  // Daily Sync
  async createSyncEntry(
    data: APIRequest<'/api/sync', 'post'>
  ): Promise<APIResponse<'/api/sync', 'post'>> {
    return this.request<APIResponse<'/api/sync', 'post'>>('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSyncEntries(
    coupleId: string,
    todayOnly = false
  ): Promise<APIResponse<'/api/sync', 'get'>> {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (todayOnly) params.append('today', 'true');
    return this.request<APIResponse<'/api/sync', 'get'>>(`/sync?${params}`);
  }

  // Task Management
  async createTask(
    data: APIRequest<'/api/tasks', 'post'>
  ): Promise<APIResponse<'/api/tasks', 'post'>> {
    return this.request<APIResponse<'/api/tasks', 'post'>>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTasks(
    coupleId: string,
    filters?: APIQuery<'/api/tasks', 'get'>
  ): Promise<APIResponse<'/api/tasks', 'get'>> {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.['status']) params.append('status', filters['status']);
    if (filters?.['assigned_to']) params.append('assigned_to', filters['assigned_to']);
    return this.request<APIResponse<'/api/tasks', 'get'>>(`/tasks?${params}`);
  }

  async updateTask(
    taskId: string,
    data: APIRequest<'/api/tasks', 'put'>
  ): Promise<APIResponse<'/api/tasks', 'put'>> {
    return this.request<APIResponse<'/api/tasks', 'put'>>(`/tasks?id=${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: string): Promise<APIResponse<'/api/tasks', 'delete'>> {
    return this.request<APIResponse<'/api/tasks', 'delete'>>(`/tasks?id=${taskId}`, {
      method: 'DELETE',
    });
  }

  // AI Suggestions
  async createAISuggestion(
    data: APIRequest<'/api/ai-suggestions', 'post'>
  ): Promise<APIResponse<'/api/ai-suggestions', 'post'>> {
    return this.request<APIResponse<'/api/ai-suggestions', 'post'>>('/ai-suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAISuggestions(
    coupleId: string,
    filters?: APIQuery<'/api/ai-suggestions', 'get'>
  ): Promise<APIResponse<'/api/ai-suggestions', 'get'>> {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.['type']) params.append('type', filters['type']);
    if (filters?.['pending'] !== undefined) params.append('pending', String(filters['pending']));
    return this.request<APIResponse<'/api/ai-suggestions', 'get'>>(`/ai-suggestions?${params}`);
  }

  async updateAISuggestion(
    suggestionId: string,
    action: 'accept' | 'complete' | 'reject'
  ): Promise<APIResponse<'/api/ai-suggestions', 'put'>> {
    return this.request<APIResponse<'/api/ai-suggestions', 'put'>>(
      `/ai-suggestions?id=${suggestionId}&action=${action}`,
      {
        method: 'PUT',
      }
    );
  }

  // Kids Activities
  async getDailyActivityTheme(): Promise<APIResponse<'/api/kids-activities', 'get'>> {
    return this.request<APIResponse<'/api/kids-activities', 'get'>>('/kids-activities');
  }

  async createKidActivity(
    data: APIRequest<'/api/kids-activities', 'post'>
  ): Promise<APIResponse<'/api/kids-activities', 'post'>> {
    return this.request<APIResponse<'/api/kids-activities', 'post'>>('/kids-activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKidActivities(
    childId: string,
    filters?: APIQuery<'/api/kids-activities', 'get'>
  ): Promise<APIResponse<'/api/kids-activities', 'get'>> {
    const params = new URLSearchParams({ child_id: childId });
    if (filters?.['theme']) params.append('theme', filters['theme']);
    if (filters?.['completed'] !== undefined)
      params.append('completed', String(filters['completed']));
    return this.request<APIResponse<'/api/kids-activities', 'get'>>(`/kids-activities?${params}`);
  }

  async updateKidActivity(
    activityId: string,
    data: APIRequest<'/api/kids-activities', 'put'>
  ): Promise<APIResponse<'/api/kids-activities', 'put'>> {
    return this.request<APIResponse<'/api/kids-activities', 'put'>>(
      `/kids-activities?id=${activityId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  // Memories & Kindness Jar
  async createMemory(formData: FormData) {
    return this.request('/memories', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getMemories(
    coupleId: string,
    filters?: APIQuery<'/api/memories', 'get'>
  ): Promise<APIResponse<'/api/memories', 'get'>> {
    const params = new URLSearchParams({ couple_id: coupleId });
    if (filters?.['type']) params.append('type', filters['type']);
    if (filters?.['memory_type']) params.append('memory_type', filters['memory_type']);
    if (filters?.['limit']) params.append('limit', String(filters['limit']));
    return this.request<APIResponse<'/api/memories', 'get'>>(`/memories?${params}`);
  }

  async updateMemory(
    memoryId: string,
    data: APIRequest<'/api/memories', 'put'>
  ): Promise<APIResponse<'/api/memories', 'put'>> {
    return this.request<APIResponse<'/api/memories', 'put'>>(`/memories?id=${memoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(memoryId: string): Promise<APIResponse<'/api/memories', 'delete'>> {
    return this.request<APIResponse<'/api/memories', 'delete'>>(`/memories?id=${memoryId}`, {
      method: 'DELETE',
    });
  }

  // Rewards & Gamification
  async getRewards(coupleId: string): Promise<APIResponse<'/api/rewards', 'get'>> {
    return this.request<APIResponse<'/api/rewards', 'get'>>(`/rewards?couple_id=${coupleId}`);
  }

  async createRewardTransaction(
    data: APIRequest<'/api/rewards', 'post'>
  ): Promise<APIResponse<'/api/rewards', 'post'>> {
    return this.request<APIResponse<'/api/rewards', 'post'>>('/rewards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Billing
  async getSubscription(coupleId: string): Promise<APIResponse<'/api/payments', 'get'>> {
    return this.request<APIResponse<'/api/payments', 'get'>>(`/payments?couple_id=${coupleId}`);
  }
}

// Create singleton instance
export const leelaOSAPI = new LeelaOSAPI();

// React hook for API calls
export function useLeelaOSAPI() {
  return leelaOSAPI;
}