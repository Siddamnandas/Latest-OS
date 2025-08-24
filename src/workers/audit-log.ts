import { Kafka } from 'kafkajs';
import { env } from '../lib/config';

export async function startAuditLogWorker() {
  if (!env.KAFKA_BROKERS) {
    console.warn('Kafka not configured');
    return;
  }
  const topic = env.KAFKA_USER_EVENTS_TOPIC ?? 'user-events';
  const kafka = new Kafka({
    clientId: env.KAFKA_CLIENT_ID ?? 'latest-os',
    brokers: env.KAFKA_BROKERS.split(',').map((b) => b.trim()),
  });
  const consumer = kafka.consumer({ groupId: 'audit-log-service' });
  const admin = kafka.admin();
  await consumer.connect();
  await admin.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  let processed = 0;
  setInterval(async () => {
    const offsets = await admin.fetchTopicOffsets(topic);
    const committed = await consumer.committedOffsets(
      offsets.map(({ partition }) => ({ topic, partition }))
    );
    const lag = offsets.reduce((sum, off, idx) => {
      const committedOffset = committed[idx]?.offset ?? '0';
      return sum + (Number(off.high) - Number(committedOffset));
    }, 0);
    const throughput = processed / 10; // messages per second
    console.log(`[audit-log] Lag: ${lag} msgs, throughput: ${throughput.toFixed(2)} msg/s`);
    processed = 0;
  }, 10_000);

  await consumer.run({
    eachMessage: async ({ message }) => {
      processed++;
      console.log('audit event', message.value?.toString());
      // TODO: persist audit events to storage
    },
  });
}
