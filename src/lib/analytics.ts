import { env } from './config';
import { Kafka, Producer } from 'kafkajs';

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

let kafkaProducer: Producer | null = null;

async function sendToKafka(event: EventPayloads) {
  if (!env.KAFKA_BROKERS) return;
  if (!kafkaProducer) {
    const kafka = new Kafka({
      clientId: env.KAFKA_CLIENT_ID ?? 'latest-os',
      brokers: env.KAFKA_BROKERS.split(',').map((b) => b.trim()),
    });
    kafkaProducer = kafka.producer();
    await kafkaProducer.connect();
  }
  await kafkaProducer.send({
    topic: env.KAFKA_USER_EVENTS_TOPIC ?? 'user-events',
    messages: [{ value: JSON.stringify(event) }],
  });
}

export async function trackEvent(event: EventPayloads) {
  const tasks: Promise<unknown>[] = [sendToKafka(event)];
  switch (env.ANALYTICS_PROVIDER) {
    case 'segment':
      tasks.push(sendToSegment(event));
      break;
    case 'snowplow':
      tasks.push(sendToSnowplow(event));
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.debug('analytics event', event);
      }
  }
  await Promise.all(tasks);
}

export type { EventPayloads as AnalyticsEvent };

