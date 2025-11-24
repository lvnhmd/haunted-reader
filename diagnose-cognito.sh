#!/bin/bash

# Diagnostic script to check Cognito Identity Pool configuration

set -e

echo "🔍 Diagnosing Cognito Identity Pool Configuration..."
echo ""

IDENTITY_POOL_ID="us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc"
ROLE_NAME="HauntedReaderBedrockRole"

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 Account ID: $ACCOUNT_ID"
echo ""

# Check Identity Pool configuration
echo "🎭 Checking Identity Pool settings..."
aws cognito-identity describe-identity-pool \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --output json > /tmp/identity-pool.json

echo "   Allow Unauthenticated Access: $(cat /tmp/identity-pool.json | grep -o '"AllowUnauthenticatedIdentities": [^,]*')"
echo ""

# Check role assignment
echo "🔗 Checking role assignments..."
aws cognito-identity get-identity-pool-roles \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --output json > /tmp/pool-roles.json

cat /tmp/pool-roles.json
echo ""

# Check if role exists
echo "🎯 Checking IAM role..."
if aws iam get-role --role-name "$ROLE_NAME" &>/dev/null; then
  echo "   ✅ Role exists: $ROLE_NAME"
  
  # Check trust policy
  echo ""
  echo "🔐 Trust Policy:"
  aws iam get-role --role-name "$ROLE_NAME" \
    --query 'Role.AssumeRolePolicyDocument' \
    --output json
  
  echo ""
  echo "📜 Attached Policies:"
  aws iam list-attached-role-policies --role-name "$ROLE_NAME" \
    --query 'AttachedPolicies[*].PolicyName' \
    --output table
    
  echo ""
  echo "📝 Inline Policies:"
  aws iam list-role-policies --role-name "$ROLE_NAME" \
    --query 'PolicyNames' \
    --output table
else
  echo "   ❌ Role NOT found: $ROLE_NAME"
  echo "   You need to create this role first!"
fi

echo ""
echo "🧪 Testing credential retrieval..."
IDENTITY_ID=$(aws cognito-identity get-id \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --query 'IdentityId' \
  --output text)

echo "   Identity ID: $IDENTITY_ID"

echo ""
echo "🔑 Getting credentials..."
aws cognito-identity get-credentials-for-identity \
  --identity-id "$IDENTITY_ID" \
  --output json > /tmp/credentials.json

if [ $? -eq 0 ]; then
  echo "   ✅ Successfully retrieved credentials"
  echo "   Access Key: $(cat /tmp/credentials.json | grep -o '"AccessKeyId": "[^"]*"' | cut -d'"' -f4)"
else
  echo "   ❌ Failed to retrieve credentials"
fi

echo ""
echo "📊 Summary:"
echo "   Identity Pool ID: $IDENTITY_POOL_ID"
echo "   Role Name: $ROLE_NAME"
echo "   Account: $ACCOUNT_ID"
