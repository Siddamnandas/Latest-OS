# Service Level Objectives

This document defines the core SLOs for Latest OS and how they are enforced.

## Request Latency

- **Objective:** 95% of requests complete within **300ms**.
- **Alert:** Datadog monitor `high_latency` triggers if p95 latency exceeds 300ms for 5 minutes.

## Error Rate

- **Objective:** Error rate remains below **1%** of total requests.
- **Alert:** Datadog monitor `high_error_rate` triggers when the threshold is exceeded for 5 minutes.

## Error Budget

The monthly error budget is calculated from the above SLOs. When the error budget is exhausted:

- Deployments are blocked by the `npm run check-error-budget` step in CI.
- Teams must investigate and reduce errors before further releases.
