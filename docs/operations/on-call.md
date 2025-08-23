# On-call & Incident Response

## Rotation
- Primary engineers rotate weekly using the PagerDuty schedule `LatestOS-Primary`.
- A secondary engineer is assigned for backup coverage.
- Schedules are published on the team calendar and PagerDuty.

## Escalation
1. PagerDuty pages the primary on-call engineer.
2. If unacknowledged after 15 minutes, automatically escalate to the secondary.
3. For SEV-1 incidents, page the incident commander and notify leadership.

## Communication Channels
- Slack: real-time coordination in `#incidents`.
- Email: summary updates to `ops@latestos.example`.
- Status Page: public-facing updates at `https://status.latestos.example`.

## Handoff
- At the end of each shift, brief the next engineer on any open issues.
- Ensure runbooks and dashboards are up to date before sign-off.
