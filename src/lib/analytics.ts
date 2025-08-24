import { env } from './config';

export const EVENTS = {
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  PAGE_VIEW: 'page_view',
  TASK_COMPLETED: 'task_completed',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

type BaseProps = {
  userId?: string;
  anonymousId?: string;
  timestamp?: number;
};

type EventPayloads =
  | { name: 'user_signed_up'; properties: BaseProps & { plan?: string } }
  | { name: 'user_logged_in'; properties: BaseProps & { method?: string } }
  | { name: 'page_view'; properties: BaseProps & { path: string } }
  | { name: 'task_completed'; properties: BaseProps & { taskId: string } };

async function sendToSegment(event: EventPayloads) {
  if (!env.SEGMENT_WRITE_KEY) return;
  const auth = Buffer.from(`${env.SEGMENT_WRITE_KEY}:`).toString('base64');
  await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: event.name,
      properties: event.properties,
      userId: event.properties.userId,
      anonymousId: event.properties.anonymousId,
      timestamp: new Date(event.properties.timestamp ?? Date.now()).toISOString(),
    }),
  });
}

async function sendToSnowplow(event: EventPayloads) {
  if (!env.SNOWPLOW_COLLECTOR_URL) return;
  await fetch(env.SNOWPLOW_COLLECTOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
}

export async function trackEvent(event: EventPayloads) {
  switch (env.ANALYTICS_PROVIDER) {
    case 'segment':
      return sendToSegment(event);
    case 'snowplow':
      return sendToSnowplow(event);
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.debug('analytics event', event);
      }
  }
}

export type { EventPayloads as AnalyticsEvent };

