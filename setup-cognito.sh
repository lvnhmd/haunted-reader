#!/bin/bash

# Haunted Reader - AWS Cognito Identity Pool Setup Script
# This script creates a Cognito Identity Pool with IAM role for Bedrock access

set -e

echo "👻 Setting up Cognito Identity Pool for The Haunted Reader..."
echo ""

# Configuration
IDENTITY_POOL_NAME="HauntedReaderPool"
ROLE_NAME="HauntedReaderBedrockRole"
POLICY_NAME="BedrockAccessPolicy"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "📍 Using AWS Region: $AWS_REGION"
echo ""

# Get AWS Account ID
echo "🔍 Getting AWS Account ID..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "✅ Account ID: $ACCOUNT_ID"
echo ""

# Step 1: Create Cognito Identity Pool
echo "🏗️  Step 1: Creating Cognito Identity Pool..."
IDENTITY_POOL_ID=$(aws cognito-identity create-identity-pool \
  --identity-pool-name "$IDENTITY_POOL_NAME" \
  --allow-unauthenticated-identities \
  --region "$AWS_REGION" \
  --query 'IdentityPoolId' \
  --output text)

echo "✅ Identity Pool Created: $IDENTITY_POOL_ID"
echo ""

# Step 2: Create Trust Policy for Cognito
echo "🔐 Step 2: Creating IAM Trust Policy..."
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "$IDENTITY_POOL_ID"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
EOF

echo "✅ Trust policy created"
echo ""

# Step 3: Create IAM Role
echo "👤 Step 3: Creating IAM Role..."
ROLE_ARN=$(aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --description "Role for Haunted Reader to access Amazon Bedrock" \
  --query 'Role.Arn' \
  --output text)

echo "✅ Role Created: $ROLE_ARN"
echo ""

# Step 4: Create Bedrock Access Policy
echo "📜 Step 4: Creating Bedrock Access Policy..."
cat > /tmp/bedrock-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:$AWS_REGION::foundation-model/*"
      ]
    }
  ]
}
EOF

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  --policy-document file:///tmp/bedrock-policy.json

echo "✅ Bedrock access policy attached"
echo ""

# Step 5: Attach Role to Identity Pool
echo "🔗 Step 5: Attaching Role to Identity Pool..."
aws cognito-identity set-identity-pool-roles \
  --identity-pool-id "$IDENTITY_POOL_ID" \
  --roles unauthenticated="$ROLE_ARN" \
  --region "$AWS_REGION"

echo "✅ Role attached to Identity Pool"
echo ""

# Step 6: Update .env file
echo "📝 Step 6: Updating .env file..."
if [ -f .env ]; then
  # Update existing .env
  if grep -q "VITE_COGNITO_IDENTITY_POOL_ID" .env; then
    sed -i.bak "s|VITE_COGNITO_IDENTITY_POOL_ID=.*|VITE_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID|" .env
  else
    echo "VITE_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID" >> .env
  fi
  
  if grep -q "VITE_AWS_REGION" .env; then
    sed -i.bak "s|VITE_AWS_REGION=.*|VITE_AWS_REGION=$AWS_REGION|" .env
  else
    echo "VITE_AWS_REGION=$AWS_REGION" >> .env
  fi
else
  # Create new .env from example
  cp .env.example .env
  sed -i.bak "s|VITE_COGNITO_IDENTITY_POOL_ID=.*|VITE_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID|" .env
  sed -i.bak "s|VITE_AWS_REGION=.*|VITE_AWS_REGION=$AWS_REGION|" .env
fi

rm -f .env.bak

echo "✅ .env file updated"
echo ""

# Cleanup temp files
rm -f /tmp/trust-policy.json /tmp/bedrock-policy.json

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuration Summary:"
echo "  • Identity Pool ID: $IDENTITY_POOL_ID"
echo "  • IAM Role: $ROLE_NAME"
echo "  • Role ARN: $ROLE_ARN"
echo "  • AWS Region: $AWS_REGION"
echo ""
echo "✅ Your .env file has been updated with:"
echo "  VITE_AWS_REGION=$AWS_REGION"
echo "  VITE_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID"
echo ""
echo "🚀 Next Steps:"
echo "  1. Restart your dev server: npm run dev"
echo "  2. Test the app by uploading text and generating interpretations"
echo "  3. The spirits should now respond! 👻"
echo ""
echo "💰 Cost Estimate:"
echo "  • Claude 3 Haiku: ~\$0.25 per 1M input tokens"
echo "  • Expected hackathon cost: \$0.50-\$2.00"
echo ""
echo "🔒 Security Notes:"
echo "  • Unauthenticated access is enabled (good for demo)"
echo "  • Consider adding rate limiting for production"
echo "  • Credentials are temporary and scoped to Bedrock only"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
