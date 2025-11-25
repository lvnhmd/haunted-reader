#!/bin/bash

# Fix deployment issues - Add CORS and re-upload

set -e

BUCKET_NAME="haunted-reader-kiroween-1764092634"
REGION="us-east-1"

echo "👻 The Haunted Reader - Deployment Fix Script"
echo "=============================================="
echo ""

echo "🔧 Step 1: Adding CORS configuration..."
aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }'

echo "✅ CORS configured"
echo ""

echo "🔨 Step 2: Rebuilding application..."
npm run build 2>&1 | grep -E "(✓|built|error)" | tail -5

echo ""
echo "📤 Step 3: Re-uploading files..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --quiet

aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --quiet

echo "✅ Files re-uploaded"
echo ""

WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "=============================================="
echo "🎉 Deployment Fixed!"
echo "=============================================="
echo ""
echo "S3 Website URL:"
echo "  $WEBSITE_URL"
echo ""
echo "Changes made:"
echo "  ✅ CORS configuration added"
echo "  ✅ Files re-uploaded"
echo ""
echo "Try uploading a file now!"
echo "If still not working, check browser console for errors."
echo ""
echo "👻 The Haunted Reader is ready!"
