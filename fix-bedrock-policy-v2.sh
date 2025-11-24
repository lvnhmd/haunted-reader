#!/bin/bash

# Fix Bedrock policy with correct resource ARN format for Bedrock Runtime

set -e

echo "🔧 Fixing Bedrock IAM Policy (v2 - with correct ARN format)..."
echo ""

ROLE_NAME="HauntedReaderBedrockRole"

# Delete old policies
echo "🗑️  Removing old policies..."
aws iam delete-role-policy --role-name "$ROLE_NAME" --policy-name BedrockAccessPolicy 2>/dev/null || true
aws iam delete-role-policy --role-name "$ROLE_NAME" --policy-name BedrockFullAccess 2>/dev/null || true

# Create the correct policy with proper Bedrock Runtime resource format
cat > /tmp/bedrock-runtime-policy.json << 'EOF'
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
        "arn:aws:bedrock:*::foundation-model/*"
      ]
    }
  ]
}
EOF

echo "📝 New policy document:"
cat /tmp/bedrock-runtime-policy.json
echo ""

echo "🔄 Creating new IAM role policy..."
aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "BedrockRuntimeAccess" \
  --policy-document file:///tmp/bedrock-runtime-policy.json

echo ""
echo "✅ Policy created successfully!"
echo ""

echo "🧪 Verifying the policy..."
aws iam get-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "BedrockRuntimeAccess" \
  --query 'PolicyDocument' \
  --output json

echo ""
echo "📋 All policies on this role:"
aws iam list-role-policies --role-name "$ROLE_NAME" --output table

echo ""
echo "🎉 Done! Wait 10 seconds for AWS to propagate, then test again."
