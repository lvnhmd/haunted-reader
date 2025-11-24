#!/bin/bash

# Fix the Bedrock IAM policy with correct resource ARN format

set -e

echo "🔧 Fixing Bedrock IAM Policy..."
echo ""

ROLE_NAME="HauntedReaderBedrockRole"
POLICY_NAME="BedrockAccessPolicy"

# Create the correct policy document
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

echo "📝 New policy document:"
cat /tmp/bedrock-policy.json
echo ""

echo "🔄 Updating IAM role policy..."
aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  --policy-document file:///tmp/bedrock-policy.json

echo ""
echo "✅ Policy updated successfully!"
echo ""

echo "🧪 Verifying the update..."
aws iam get-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME" \
  --query 'PolicyDocument' \
  --output json

echo ""
echo "🎉 Done! Try your app again now."
