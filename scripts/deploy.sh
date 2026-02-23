#!/usr/bin/env bash
set -euo pipefail

# Deploy static build to Timeweb Cloud S3
#
# Required environment variables:
#   S3_ACCESS_KEY  - Timeweb S3 access key
#   S3_SECRET_KEY  - Timeweb S3 secret key
#   S3_BUCKET      - Bucket name
#
# Optional:
#   S3_ENDPOINT    - S3 endpoint URL (default: https://s3.timeweb.cloud)
#   BUILD_DIR      - Build output directory (default: _build)

S3_ENDPOINT="${S3_ENDPOINT:-https://s3.timeweb.cloud}"
BUILD_DIR="${BUILD_DIR:-_build}"

if [ -z "${S3_ACCESS_KEY:-}" ] || [ -z "${S3_SECRET_KEY:-}" ] || [ -z "${S3_BUCKET:-}" ]; then
  echo "Error: S3_ACCESS_KEY, S3_SECRET_KEY, and S3_BUCKET must be set"
  exit 1
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: Build directory '$BUILD_DIR' not found. Run 'npm run build' first."
  exit 1
fi

# Configure AWS CLI for Timeweb Cloud S3
mkdir -p ~/.aws

cat > ~/.aws/credentials <<CREDS
[default]
aws_access_key_id = $S3_ACCESS_KEY
aws_secret_access_key = $S3_SECRET_KEY
CREDS

cat > ~/.aws/config <<CONF
[default]
region = ru-1
s3 =
  endpoint_url = $S3_ENDPOINT
  signature_version = s3v4
s3api =
  endpoint_url = $S3_ENDPOINT
CONF

echo "Deploying '$BUILD_DIR' to s3://$S3_BUCKET ..."

aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
  --endpoint-url "$S3_ENDPOINT" \
  --delete \
  --no-progress

echo "Deploy complete."