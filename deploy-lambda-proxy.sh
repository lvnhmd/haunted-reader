#!/bin/bash

# Deploy Lambda function as Bedrock proxy

set -e

echo "🚀 Deploying Lambda Bedrock Proxy..."
echo ""

FUNCTION_NAME="HauntedReaderBedrockProxy"
ROLE_NAME="HauntedReaderLambdaRole"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Step 1: Create Lambda execution role
echo "1️⃣ Creating Lambda execution role..."

# Trust policy for Lambda
cat > /tmp/lambda-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document file:///tmp/lambda-trust-policy.json \
  2>/dev/null || echo "   Role already exists"

# Attach basic Lambda execution policy
aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
  2>/dev/null || echo "   Policy already attached"

# Create Bedrock policy for Lambda
cat > /tmp/lambda-bedrock-policy.json << 'EOF'
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

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "BedrockAccess" \
  --policy-document file:///tmp/lambda-bedrock-policy.json

echo "   ✅ Role created: arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"

# Step 2: Package Lambda function
echo ""
echo "2️⃣ Packaging Lambda function..."

mkdir -p /tmp/lambda-package
cp lambda-bedrock-proxy.mjs /tmp/lambda-package/index.mjs

cd /tmp/lambda-package
npm init -y > /dev/null 2>&1
npm install @aws-sdk/client-bedrock-runtime > /dev/null 2>&1

zip -r /tmp/lambda-function.zip . > /dev/null

echo "   ✅ Package created: /tmp/lambda-function.zip"

# Step 3: Create/Update Lambda function
echo ""
echo "3️⃣ Deploying Lambda function..."

# Wait for role to propagate
sleep 10

# Try to create function
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs20.x \
  --role "arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME" \
  --handler index.handler \
  --zip-file fileb:///tmp/lambda-function.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1 \
  2>/dev/null && echo "   ✅ Function created" || \
  (aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb:///tmp/lambda-function.zip \
    --region us-east-1 > /dev/null && echo "   ✅ Function updated")

# Step 4: Create Function URL
echo ""
echo "4️⃣ Creating Function URL..."

FUNCTION_URL=$(aws lambda create-function-url-config \
  --function-name "$FUNCTION_NAME" \
  --auth-type NONE \
  --cors "AllowOrigins=*,AllowMethods=POST,AllowHeaders=Content-Type" \
  --region us-east-1 \
  --query 'FunctionUrl' \
  --output text 2>/dev/null || \
  aws lambda get-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --region us-east-1 \
    --query 'FunctionUrl' \
    --output text)

# Add permission for public access
aws lambda add-permission \
  --function-name "$FUNCTION_NAME" \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE \
  --region us-east-1 \
  2>/dev/null || echo "   Permission already exists"

echo "   ✅ Function URL: $FUNCTION_URL"

# Step 5: Test the function
echo ""
echo "5️⃣ Testing Lambda function..."

curl -X POST "$FUNCTION_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
    "prompt": "Say hello from the spirit realm in a spooky way!",
    "options": {"maxTokens": 100}
  }' | jq '.'

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Add this to your .env file:"
echo "VITE_API_ENDPOINT=$FUNCTION_URL"
