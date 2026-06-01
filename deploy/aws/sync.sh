#!/usr/bin/env bash
set -euo pipefail

: "${AWS_S3_BUCKET:?Set AWS_S3_BUCKET}"
: "${AWS_REGION:=us-east-1}"

aws s3 sync dist/ "s3://${AWS_S3_BUCKET}" --delete --region "${AWS_REGION}"

if [[ -n "${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  aws cloudfront create-invalidation \
    --distribution-id "${AWS_CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/*"
fi
