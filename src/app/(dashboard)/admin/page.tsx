import React from 'react';

async function fetchCrashLogs() {
  const org = process.env.SENTRY_ORG;
  const project = process.env.SENTRY_PROJECT;
  const token = process.env.SENTRY_AUTH_TOKEN;
  if (!org || !project || !token) return [];
  const res = await fetch(`https://sentry.io/api/0/projects/${org}/${project}/events/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  const events: any[] = await fetchCrashLogs();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Crash Logs</h1>
      {events.length === 0 && <p>No crash logs available.</p>}
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="border rounded p-4">
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">{event.eventID}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
