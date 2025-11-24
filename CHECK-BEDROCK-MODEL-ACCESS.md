# Check Bedrock Model Access

## The Problem

You're getting this error:
```
User: arn:aws:sts::730710483519:assumed-role/HauntedReaderBedrockRole/CognitoIdentityCredentials 
is not authorized to perform: bedrock:InvokeModel on resource: 
arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0 
because no session policy allows the bedrock:InvokeModel action
```

The phrase "**no session policy allows**" is the key issue.

## Root Cause

You need to **request model access** in the Amazon Bedrock console. Even though the IAM permissions are correct, AWS Bedrock requires you to explicitly request access to foundation models (especially Anthropic Claude models).

## Solution: Request Model Access

### Step 1: Go to Bedrock Console
1. Open AWS Console
2. Navigate to **Amazon Bedrock** service
3. Make sure you're in **us-east-1** region

### Step 2: Request Model Access
1. In the left sidebar, click **"Model access"** (under "Foundation models")
2. Click the orange **"Manage model access"** or **"Modify model access"** button
3. Find **"Anthropic"** in the list
4. Check the boxes for:
   - ✅ Claude 3 Haiku
   - ✅ Claude 3 Sonnet (optional, for better quality)
5. Scroll down and click **"Request model access"** or **"Save changes"**

### Step 3: Wait for Approval
- Most models (including Claude) are **instantly approved**
- You'll see the status change from "Available to request" to "Access granted"
- This usually takes less than 1 minute

### Step 4: Verify Access
After requesting access, run this test:

```bash
node test-bedrock-with-cognito.mjs
```

If it works, you'll see:
```
🎉 Test PASSED! Your Cognito + Bedrock setup is working!
```

## Why This Happens

Amazon Bedrock requires explicit model access requests for compliance and cost management reasons. This is separate from IAM permissions:

- **IAM Permissions**: Allow your role to call Bedrock APIs ✅ (you have this)
- **Model Access**: Allow your AWS account to use specific models ❌ (you need this)

Both are required!

## Alternative: Test with AWS CLI

You can also test if model access is the issue:

```bash
# This will fail if you don't have model access
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","max_tokens":100,"messages":[{"role":"user","content":"Hello"}]}' \
  --region us-east-1 \
  /tmp/response.json

# If successful, check the response
cat /tmp/response.json
```

If this fails with AccessDeniedException, you definitely need to request model access in the console.
