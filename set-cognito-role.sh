#!/bin/bash

# Script to set IAM role for Cognito Identity Pool (unauthenticated access)
# This bypasses the AWS Console UI limitations

set -e

echo "🔧 Setting up Cognito Identity Pool IAM Role..."
echo ""

# Configuration
IDENTITY_POOL_ID="us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc"
ROLE_NAME="HauntedReaderBedrockRole"

# Get AWS Account ID
echo "📋 Getting AWS Account ID..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "   Account ID: $ACCOUNT_ID"
echo ""

# Construct Role ARN
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"

# Set the identity pool roles
echo "🎭 Assigning IAM role to Identity Pool..."
echo "   Identity Pool: $IDENTITY_POOL_ID"
echo "   Unauthenticated Role: $ROLE_ARN"
echo ""

aws cognito-identity set-identity-pool-roles \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --roles unauthenticated="$ROLE_ARN"

echo "✅ Role assignment complete!"
echo ""
echo "🧪 Testing the configuration..."
echo ""

# Test by getting credentials
aws cognito-identity get-id \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --query 'IdentityId' \
  --output text > /tmp/identity_id.txt

IDENTITY_ID=$(cat /tmp/identity_id.txt)
echo "   Identity ID: $IDENTITY_ID"

aws cognito-identity get-credentials-for-identity \
  --identity-id "$IDENTITY_ID" \
  --query 'Credentials.AccessKeyId' \
  --output text > /dev/null

echo "✅ Successfully retrieved credentials!"
echo ""
echo "🎉 Setup complete! Your Haunted Reader app should now work."
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Upload a text file"
echo "3. Generate spirit interpretations"
