# Outage Runbook

## Detection
- Automated alerts from Datadog monitors or Prometheus rules
- Reports from users or customer support
- Sentry spikes or error dashboards

## Triage
1. Acknowledge the alert in the incident channel.
2. Determine the scope and impact (services affected, severity).
3. Collect context: recent deployments, infrastructure changes, ongoing incidents.

## Mitigation
1. Roll back to the last known good build if a deployment is suspect.
2. Reboot unhealthy services or scale up resources when capacity is constrained.
3. Communicate status updates to stakeholders every 30 minutes in `#incidents` and on the status page.

## Recovery
1. Validate that primary user flows work as expected.
2. Remove incident banners and resolve monitors.
3. Announce resolution in the incident channel and close out any support tickets.

## Postmortem
1. Create an incident report within 24 hours.
2. Document root cause, timeline, and follow-up actions.
3. Track remediation tasks in the engineering backlog.
