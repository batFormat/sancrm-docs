#!/usr/bin/env bash
set -euo pipefail

# Deploy static build to Timeweb Cloud S3 via rclone
#
# Required environment variables:
#   S3_ACCESS_KEY  - Timeweb S3 access key
#   S3_SECRET_KEY  - Timeweb S3 secret key
#   S3_BUCKET      - Bucket name
#
# Optional:
#   S3_ENDPOINT    - S3 endpoint URL (default: https://s3.twcstorage.ru)
#   BUILD_DIR      - Build output directory (default: _build)

S3_ENDPOINT="${S3_ENDPOINT:-https://s3.twcstorage.ru}"
BUILD_DIR="${BUILD_DIR:-_build}"

if [ -z "${S3_ACCESS_KEY:-}" ] || [ -z "${S3_SECRET_KEY:-}" ] || [ -z "${S3_BUCKET:-}" ]; then
  echo "Error: S3_ACCESS_KEY, S3_SECRET_KEY, and S3_BUCKET must be set"
  exit 1
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: Build directory '$BUILD_DIR' not found. Run 'npm run build' first."
  exit 1
fi

if ! command -v rclone &> /dev/null; then
  echo "Error: rclone is not installed. Install it: https://rclone.org/install/"
  exit 1
fi

export RCLONE_CONFIG_TW_TYPE=s3
export RCLONE_CONFIG_TW_PROVIDER=Other
export RCLONE_CONFIG_TW_ACCESS_KEY_ID="$S3_ACCESS_KEY"
export RCLONE_CONFIG_TW_SECRET_ACCESS_KEY="$S3_SECRET_KEY"
export RCLONE_CONFIG_TW_ENDPOINT="$S3_ENDPOINT"
export RCLONE_CONFIG_TW_REGION=ru-1

echo "Deploying '$BUILD_DIR' to tw:$S3_BUCKET ..."

rclone sync "$BUILD_DIR" "tw:$S3_BUCKET" --verbose

echo "Deploy complete."