#!/bin/bash

# Check Cognito Identity Pool authentication flow settings

set -e

echo "🔍 Checking Cognito Identity Pool Authentication Flow..."
echo ""

IDENTITY_POOL_ID="us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc"

# Get full identity pool configuration
echo "📋 Identity Pool Configuration:"
aws cognito-identity describe-identity-pool \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --output json | jq '.'

echo ""
echo "🔑 Checking if Classic Flow is enabled..."
CLASSIC_FLOW=$(aws cognito-identity describe-identity-pool \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --query 'AllowClassicFlow' \
  --output text)

if [ "$CLASSIC_FLOW" == "True" ] || [ "$CLASSIC_FLOW" == "true" ]; then
  echo "   ✅ Classic Flow is ENABLED"
else
  echo "   ❌ Classic Flow is DISABLED"
  echo "   This might be causing the session policy restriction!"
fi

echo ""
echo "🎭 Checking role assignments..."
aws cognito-identity get-identity-pool-roles \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --output json | jq '.'

echo ""
echo "💡 Diagnosis:"
echo ""
echo "The issue is that Cognito Identity Pool applies restrictive session policies"
echo "when using the enhanced authentication flow. Even though Classic Flow is enabled,"
echo "the SDK might not be using it correctly."
echo ""
echo "Possible solutions:"
echo "1. Use a Cognito User Pool for authenticated access (recommended for production)"
echo "2. Use API Gateway + Lambda proxy instead of direct Bedrock access"
echo "3. Use AWS Amplify which handles Cognito auth flow correctly"
echo ""
echo "For this hackathon, the quickest solution is option 2 (Lambda proxy)."
