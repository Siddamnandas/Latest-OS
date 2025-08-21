#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="latest-os"
IMAGE_TAG="${1:-latest}"

docker build -t "$IMAGE_NAME:$IMAGE_TAG" .
