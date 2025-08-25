# Event Streams

## Topics

### `user-events`
Captures key user actions such as sign ups, logins, page views and task completions. Messages are JSON-encoded `AnalyticsEvent` objects.

## Consumers

- **recommendations-service**: processes events to update recommendation models.
- **audit-log-service**: records user actions for compliance and security review.

Both consumers track their throughput and lag using the Kafka admin API. Lag is calculated by comparing the latest partition offsets to the consumer's committed offsets, while throughput is measured as processed messages per second.

## Monitoring

Metrics are logged every 10 seconds by the workers, but they can also be scraped by external monitoring systems. Alerting should trigger if lag grows steadily or throughput drops significantly.
