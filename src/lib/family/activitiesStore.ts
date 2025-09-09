type ActivityRecord = {
  id: string;
  childId: string;
  title: string;
  type: string;
  duration: number;
  completed: boolean;
  date: string;
  participants?: string[];
  notes?: string;
  location?: string;
};

const store: ActivityRecord[] = [];

export function addActivity(record: Omit<ActivityRecord, 'id'>): ActivityRecord {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const full: ActivityRecord = { id, ...record };
  store.push(full);
  return full;
}

export function getActivities(childId: string): ActivityRecord[] {
  return store.filter((r) => r.childId === childId).sort((a, b) => b.date.localeCompare(a.date));
}

export function getStats(childId: string) {
  const activities = getActivities(childId);
  const byType: Record<string, { count: number; duration: number }> = {};
  for (const a of activities) {
    if (!byType[a.type]) byType[a.type] = { count: 0, duration: 0 };
    byType[a.type].count += 1;
    byType[a.type].duration += a.duration || 0;
  }
  return Object.entries(byType).map(([type, agg]) => ({ type, count: agg.count, duration: agg.duration }));
}

