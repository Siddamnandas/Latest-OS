# Analytics

## Event Standardization
Events emitted by the application are defined in `src/lib/analytics.ts` and follow a common naming scheme using snake_case.

| Event | Properties |
|-------|------------|
| `user_signed_up` | `userId`, `plan` |
| `user_logged_in` | `userId`, `method` |
| `page_view` | `path`, `userId?` |
| `task_completed` | `userId`, `taskId` |

## Provider Integration
Set environment variables in `.env` to choose an analytics provider:

```
ANALYTICS_PROVIDER=segment
SEGMENT_WRITE_KEY=your-key
SNOWPLOW_COLLECTOR_URL=https://collector.example.com
```

Events will be piped to Segment or Snowplow automatically via the `trackEvent` helper.

## ETL to BigQuery or Redshift
Both Segment and Snowplow provide native pipelines to forward collected data into warehouses such as BigQuery or Redshift. Configure the destination in the chosen provider's dashboard to enable automated ETL.

## Dashboards
Once data is available in the warehouse, use a BI tool (e.g. Looker, Data Studio, or Metabase) to build dashboards for activation, retention, and funnel analysis.
