#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="$1"

if [[ -z "$ENVIRONMENT" ]]; then
  echo "Usage: $0 <dev|staging|prod>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

terraform init -backend-config="env/${ENVIRONMENT}.backend"
terraform apply -var-file="env/${ENVIRONMENT}.tfvars" -auto-approve

