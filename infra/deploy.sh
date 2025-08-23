#!/bin/bash

set -e

ENV=${1:-dev}
ACTION=${2:-plan}

if [ ! -f "environments/${ENV}.tfvars" ]; then
    echo "Error: Environment file environments/${ENV}.tfvars not found"
    exit 1
fi

echo "Running Terraform ${ACTION} for environment: ${ENV}"

# Initialize Terraform
terraform init \
    -backend-config="bucket=latest-os-${ENV}-terraform-state" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=us-east-1"

# Run the specified action
case $ACTION in
    plan)
        terraform plan -var-file="environments/${ENV}.tfvars"
        ;;
    apply)
        terraform apply -var-file="environments/${ENV}.tfvars" -auto-approve
        echo "RDS endpoint: $(terraform output -raw db_endpoint)"
        echo "S3 bucket: $(terraform output -raw s3_bucket_name)"
        ;;
    destroy)
        terraform destroy -var-file="environments/${ENV}.tfvars" -auto-approve
        ;;
    *)
        echo "Error: Invalid action. Use: plan, apply, or destroy"
        exit 1
        ;;
esac
