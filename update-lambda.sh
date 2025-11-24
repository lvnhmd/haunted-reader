#!/bin/bash

set -e

echo "📦 Packaging updated Lambda function..."

# Clean and prepare
rm -rf /tmp/lambda-update
mkdir -p /tmp/lambda-update
cp lambda-bedrock-proxy.mjs /tmp/lambda-update/index.mjs

# Install dependencies
echo '{"type":"module"}' > /tmp/lambda-update/package.json
npm install --prefix /tmp/lambda-update @aws-sdk/client-bedrock-runtime > /dev/null 2>&1

# Create zip
rm -f /tmp/lambda-update.zip
zip -j -r /tmp/lambda-update.zip /tmp/lambda-update/* > /dev/null

echo "🚀 Updating Lambda function..."
aws lambda update-function-code \
  --function-name HauntedReaderBedrockProxy \
  --zip-file fileb:///tmp/lambda-update.zip \
  --region us-east-1 \
  --query 'LastModified' \
  --output text

echo "✅ Lambda function updated!"
echo ""
echo "🧪 Testing..."
sleep 3

curl -X POST "https://jokrlr5u5tfu42bojwgrfr3k2q0kohaz.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"modelId": "anthropic.claude-3-haiku-20240307-v1:0", "prompt": "Say hello", "options": {"maxTokens": 20}}' \
  | jq '.'

echo ""
echo "✅ Done! Restart your dev server and try again."
