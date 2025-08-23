# Security Audit Plan

## Automated Testing

- Run OWASP ZAP against the staging environment:

```bash
docker run --rm -v $(pwd)/reports:/zap/wrk:rw -t owasp/zap2docker-weekly zap-full-scan.py -t https://staging.example.com -r zap-report.html
```

- Alternatively, engage an external security firm to perform a penetration test.

## Remediation

- **SQL injection**: refactor queries to use parameterized statements or ORM methods and validate all inputs.
- **Cross-site scripting (XSS)**: sanitize user-supplied data and escape output in templates.
- **Authentication bypass**: enforce server-side session checks, restrict access to protected routes, and validate authorization tokens.
- After applying patches, redeploy to staging and rerun the scan to confirm the issues are resolved.

## Documentation

- Record each finding and its resolution in `docs/security-audit-log.md`.
- Note any infrastructure changes (e.g., WAF rules, database configuration) made during remediation.

## Recurring Audits

- Schedule automated OWASP ZAP scans monthly as part of the CI pipeline.
- Engage a third-party security assessment annually or after major feature releases.
- Review and update this document whenever new classes of vulnerabilities are identified.
