#!/bin/bash

# The Haunted Reader - AWS S3 Deployment Script
# This script deploys the application to AWS S3 + CloudFront

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "👻 The Haunted Reader - AWS Deployment Script"
echo "=============================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    echo "Please run: aws configure"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"
echo ""

# Prompt for bucket name
read -p "Enter S3 bucket name (must be globally unique): " BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Bucket name cannot be empty${NC}"
    exit 1
fi

# Prompt for region
read -p "Enter AWS region (default: us-east-1): " REGION
REGION=${REGION:-us-east-1}

echo ""
echo "Configuration:"
echo "  Bucket: $BUCKET_NAME"
echo "  Region: $REGION"
echo ""

read -p "Continue with deployment? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "🔨 Step 1: Building application..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist/ directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

echo "🪣 Step 2: Creating S3 bucket..."
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    echo -e "${GREEN}✅ Bucket created${NC}"
else
    echo -e "${YELLOW}⚠️  Bucket already exists${NC}"
fi

echo ""
echo "🌐 Step 3: Enabling static website hosting..."
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

echo -e "${GREEN}✅ Static website hosting enabled${NC}"
echo ""

echo "🔓 Step 4: Configuring bucket policy..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json

rm /tmp/bucket-policy.json

echo -e "${GREEN}✅ Bucket policy configured${NC}"
echo ""

echo "📤 Step 5: Uploading files to S3..."
# Upload assets with long cache
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html"

# Upload index.html with no cache
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
    --cache-control "no-cache, no-store, must-revalidate"

echo -e "${GREEN}✅ Files uploaded${NC}"
echo ""

# Optional: Invalidate CloudFront cache if distribution ID is provided
read -p "Do you have a CloudFront distribution? (y/n): " HAS_CLOUDFRONT
if [ "$HAS_CLOUDFRONT" = "y" ]; then
    read -p "Enter CloudFront Distribution ID: " DISTRIBUTION_ID
    if [ ! -z "$DISTRIBUTION_ID" ]; then
        echo ""
        echo "🔄 Step 6: Invalidating CloudFront cache..."
        INVALIDATION_OUTPUT=$(aws cloudfront create-invalidation \
            --distribution-id "$DISTRIBUTION_ID" \
            --paths "/*" 2>&1)
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ CloudFront cache invalidation started${NC}"
            echo "   This will take 1-3 minutes to complete"
        else
            echo -e "${YELLOW}⚠️  CloudFront invalidation failed${NC}"
            echo "   You may need to invalidate manually in AWS Console"
        fi
    fi
fi

echo ""

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "=============================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "S3 Website URL (HTTP):"
echo "  $WEBSITE_URL"
echo ""

if [ ! -z "$DISTRIBUTION_ID" ]; then
    CLOUDFRONT_URL=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text 2>/dev/null)
    if [ ! -z "$CLOUDFRONT_URL" ]; then
        echo "CloudFront URL (HTTPS):"
        echo "  https://$CLOUDFRONT_URL"
        echo ""
    fi
fi

echo "⚠️  Note: If using CloudFront, always invalidate cache after deployment."
echo ""
echo "Next steps:"
echo "  1. Test your URL in a browser"
if [ -z "$DISTRIBUTION_ID" ]; then
    echo "  2. Create CloudFront distribution for HTTPS"
    echo "  3. See AWS-DEPLOYMENT-GUIDE.md for CloudFront setup"
fi
echo ""
echo "👻 The Haunted Reader is now deployed!"
