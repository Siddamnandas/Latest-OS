# Beta Testing Distribution

This guide explains how to distribute mobile builds to TestFlight and Google Play internal testing, automate uploads from CI, invite beta testers, collect feedback, and require sign‑offs before promoting to production.

## TestFlight Setup

1. Create an App Store Connect app for iOS.
2. Define a beta tester group called `beta-testers` and invite testers by email.
3. Generate an App Store Connect API key and store it in the repository secrets as `APPLE_APP_ID`, `APPLE_TEAM_ID`, and an App‑specific password `APPLE_APP_SPECIFIC_PASSWORD`.

## Google Play Internal Testing

1. Create an application in the Google Play Console.
2. Set up an **Internal testing** track and a tester list named `beta-testers`.
3. Download a service account JSON key and add it as the `GOOGLE_SERVICE_ACCOUNT_KEY` secret.

## Continuous Integration Uploads

The workflow at `.github/workflows/mobile-beta.yml` builds and uploads new commits to both stores:

- Uses Expo EAS to build iOS and Android artifacts.
- Submits builds to TestFlight and Google Play internal tracks.
- Adds testers from the `beta-testers` group automatically.
- Opens a GitHub issue labeled `beta-feedback` for collecting reports.

Required secrets:

- `EAS_TOKEN`
- `APPLE_APP_ID`
- `APPLE_TEAM_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `GOOGLE_SERVICE_ACCOUNT_KEY`

## Feedback and Sign‑Offs

Each beta upload creates a feedback issue. Testers report bugs and suggestions in that issue. Production promotion is gated by a manual approval step that requires team sign‑off in GitHub Actions before the `promote` job runs.

## Promoting to Production

Once feedback is addressed and the release is approved:

1. Approve the **Promote** job in the workflow run to allow publishing to production tracks.
2. In App Store Connect and Google Play Console, review the submitted build and publish it to production.

This process ensures only vetted releases reach end users.
