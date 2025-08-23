# Infrastructure

This directory contains Terraform configuration for Latest-OS infrastructure.

## Setup

1. Install Terraform >= 1.0
2. Configure AWS credentials
3. Create S3 bucket for Terraform state:
   ```bash
   aws s3 mb s3://latest-os-dev-terraform-state
   aws s3 mb s3://latest-os-prod-terraform-state
   ```

## Usage

### Development Environment
```bash
cd infra
./deploy.sh dev plan    # Plan changes
./deploy.sh dev apply   # Apply changes
./deploy.sh dev destroy # Destroy resources
```

### Production Environment
```bash
cd infra
./deploy.sh prod plan    # Plan changes
./deploy.sh prod apply   # Apply changes
./deploy.sh prod destroy # Destroy resources
```

## Monitoring

Datadog monitors and dashboards are managed via `datadog.tf`.

Set the following variables before applying:

- `datadog_api_key`
- `datadog_app_key`

Example:

```bash
export TF_VAR_datadog_api_key=...
export TF_VAR_datadog_app_key=...
./deploy.sh dev apply
```

## Structure

- `main.tf` - Main Terraform configuration
- `datadog.tf` - Datadog monitors and dashboards
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `environments/` - Environment-specific configurations
- `deploy.sh` - Deployment script

## CI/CD

Infrastructure changes are automatically deployed via GitHub Actions when changes are pushed to the main branch.
