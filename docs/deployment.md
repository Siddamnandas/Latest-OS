# Deployment Guide

This document outlines how to deploy the application to common hosting providers and set up the required environment variables.

## Hosting Options

### Vercel
Vercel offers a streamlined deployment experience for Next.js applications:
1. [Create a Vercel account](https://vercel.com/signup) and install the Vercel CLI.
2. Link this repository with `vercel` and follow the prompts.
3. Configure environment variables (see below) in the Vercel dashboard.
4. Vercel will build and deploy automatically on pushes to the default branch.

### AWS
You can deploy the container image to AWS services such as Elastic Container Service (ECS) or Elastic Kubernetes Service (EKS):
1. Use the provided build script to create a Docker image.
2. Push the image to Amazon Elastic Container Registry (ECR).
3. Create an ECS service or EKS deployment referencing the image.
4. Ensure the service runs the migration script during deployment.

## Environment Setup

1. Create a `.env` file in the project root.
2. Define the following variables:
   - `DATABASE_URL` – connection string for your database.
   - `PORT` (optional) – port the server should listen on (defaults to `3000`).
3. When deploying, make sure the environment variables are configured in your hosting platform.

## Deployment Scripts

Use the scripts in the `scripts/` directory to automate deployment tasks:
- `scripts/build-image.sh` – builds a Docker image for the application.
- `scripts/run-migrations.sh` – runs database migrations using Prisma.

Ensure Docker and Node.js are installed on your deployment machine.

## OTA Updates & Release Channels

The CI workflow publishes over-the-air updates with Expo EAS. Commits to
different branches are mapped to release channels:

- `main` ➜ `staging`
- `production` ➜ `production`

### Rollback

If an update causes issues, republish a previous commit to the affected
channel:

```bash
eas update --non-interactive --channel <channel> --commit <commit-hash>
```

This will make the selected commit active again for all users on that
release channel.