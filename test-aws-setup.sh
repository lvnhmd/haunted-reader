#!/bin/bash

# Test AWS Cognito and Bedrock Setup
echo "🔍 Testing AWS Configuration for The Haunted Reader..."
echo ""

# Load .env
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

IDENTITY_POOL_ID="${VITE_COGNITO_IDENTITY_POOL_ID}"
AWS_REGION="${VITE_AWS_REGION:-us-east-1}"

echo "📋 Configuration:"
echo "  Region: $AWS_REGION"
echo "  Identity Pool ID: $IDENTITY_POOL_ID"
echo ""

# Test 1: Check if Identity Pool exists
echo "1️⃣  Testing Cognito Identity Pool..."
if aws cognito-identity describe-identity-pool \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --region "$AWS_REGION" &>/dev/null; then
  echo "  ✅ Identity Pool exists"
else
  echo "  ❌ Identity Pool not found or no access"
  echo "  Run: ./setup-cognito.sh"
  exit 1
fi
echo ""

# Test 2: Get Identity Pool roles
echo "2️⃣  Checking Identity Pool roles..."
ROLES=$(aws cognito-identity get-identity-pool-roles \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --region "$AWS_REGION" \
  --query 'Roles.unauthenticated' \
  --output text 2>/dev/null)

if [ -n "$ROLES" ]; then
  echo "  ✅ Unauthenticated role attached"
  echo "  Role ARN: $ROLES"
  
  # Extract role name
  ROLE_NAME=$(echo "$ROLES" | awk -F'/' '{print $NF}')
  echo "  Role Name: $ROLE_NAME"
else
  echo "  ❌ No unauthenticated role attached"
  echo "  Run: ./setup-cognito.sh"
  exit 1
fi
echo ""

# Test 3: Check IAM role policies
echo "3️⃣  Checking IAM role policies..."
POLICIES=$(aws iam list-role-policies \
  --role-name "$ROLE_NAME" \
  --query 'PolicyNames' \
  --output text 2>/dev/null)

if [ -n "$POLICIES" ]; then
  echo "  ✅ Role has policies: $POLICIES"
  
  # Get policy document
  echo ""
  echo "  📜 Policy details:"
  aws iam get-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-name BedrockAccessPolicy \
    --query 'PolicyDocument.Statement[0].Action' \
    --output text 2>/dev/null | sed 's/^/    /'
else
  echo "  ❌ No policies attached to role"
  exit 1
fi
echo ""

# Test 4: Check Bedrock model access
echo "4️⃣  Checking Bedrock model access..."
MODELS=$(aws bedrock list-foundation-models \
  --region "$AWS_REGION" \
  --query 'modelSummaries[?contains(modelId, `claude-3-haiku`)].modelId' \
  --output text 2>/dev/null)

if [ -n "$MODELS" ]; then
  echo "  ✅ Bedrock models accessible"
  echo "  Available: $MODELS"
else
  echo "  ⚠️  Cannot list Bedrock models (might be permission issue)"
fi
echo ""

# Test 5: Try to get temporary credentials
echo "5️⃣  Testing credential generation..."
IDENTITY_ID=$(aws cognito-identity get-id \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --region "$AWS_REGION" \
  --query 'IdentityId' \
  --output text 2>/dev/null)

if [ -n "$IDENTITY_ID" ]; then
  echo "  ✅ Can generate identity: $IDENTITY_ID"
  
  # Try to get credentials
  CREDS=$(aws cognito-identity get-credentials-for-identity \
    --identity-id "$IDENTITY_ID" \
    --region "$AWS_REGION" 2>/dev/null)
  
  if [ $? -eq 0 ]; then
    echo "  ✅ Can get temporary credentials"
  else
    echo "  ❌ Cannot get credentials - role might not be attached correctly"
    exit 1
  fi
else
  echo "  ❌ Cannot generate identity"
  exit 1
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Your AWS setup looks good!"
echo ""
echo "If the app still shows errors, try:"
echo "  1. Restart your dev server (npm run dev)"
echo "  2. Clear browser cache and reload"
echo "  3. Check browser console for detailed errors"
echo "  4. Verify Bedrock models are enabled in AWS Console"
echo ""
echo "To test Bedrock directly, run:"
echo "  node test-bedrock-direct.mjs"
echo ""
