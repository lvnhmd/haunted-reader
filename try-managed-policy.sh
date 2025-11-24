#!/bin/bash

# Try using AWS managed policy for Bedrock instead of inline policy

set -e

echo "🔧 Trying AWS Managed Policy Approach..."
echo ""

ROLE_NAME="HauntedReaderBedrockRole"

# Remove inline policies
echo "🗑️  Removing inline policies..."
aws iam delete-role-policy --role-name "$ROLE_NAME" --policy-name "BedrockRuntimeAccess" 2>/dev/null || true

# Attach AWS managed policy for Bedrock (if it exists)
echo "📎 Checking for AWS managed Bedrock policies..."
aws iam list-policies --scope AWS --query 'Policies[?contains(PolicyName, `Bedrock`)].{Name:PolicyName,Arn:Arn}' --output table

echo ""
echo "Since there's no managed policy, creating a customer managed policy..."

# Create a customer managed policy
cat > /tmp/bedrock-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create the policy
POLICY_ARN=$(aws iam create-policy \
  --policy-name HauntedReaderBedrockPolicy \
  --policy-document file:///tmp/bedrock-policy.json \
  --query 'Policy.Arn' \
  --output text 2>/dev/null || \
  aws iam list-policies --scope Local --query 'Policies[?PolicyName==`HauntedReaderBedrockPolicy`].Arn' --output text)

echo "   Policy ARN: $POLICY_ARN"

# Attach to role
echo ""
echo "📎 Attaching policy to role..."
aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "$POLICY_ARN" 2>/dev/null || echo "   (Policy already attached)"

echo ""
echo "✅ Done! Waiting 10 seconds for propagation..."
sleep 10

echo ""
echo "🧪 Testing..."
node test-bedrock-with-cognito.mjs
