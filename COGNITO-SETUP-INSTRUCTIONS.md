# Cognito Identity Pool Setup Instructions

Choose your preferred method to set up AWS Cognito for The Haunted Reader.

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- AWS account with Bedrock models enabled
- Permissions to create Cognito Identity Pools and IAM Roles

## Method 1: Bash Script (Fastest) ⚡

### Step 1: Make script executable
```bash
chmod +x setup-cognito.sh
```

### Step 2: Run the script
```bash
./setup-cognito.sh
```

Or specify a different region:
```bash
AWS_REGION=us-west-2 ./setup-cognito.sh
```

### Step 3: Restart your dev server
```bash
npm run dev
```

**That's it!** The script will:
- ✅ Create Cognito Identity Pool
- ✅ Create IAM Role with Bedrock permissions
- ✅ Attach role to identity pool
- ✅ Update your `.env` file automatically

---

## Method 2: CloudFormation (Infrastructure as Code) 🏗️

### Step 1: Deploy the stack
```bash
aws cloudformation create-stack \
  --stack-name haunted-reader-cognito \
  --template-body file://cloudformation-cognito.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### Step 2: Wait for completion
```bash
aws cloudformation wait stack-create-complete \
  --stack-name haunted-reader-cognito \
  --region us-east-1
```

### Step 3: Get the outputs
```bash
aws cloudformation describe-stacks \
  --stack-name haunted-reader-cognito \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
```

### Step 4: Update your .env file
Copy the `IdentityPoolId` and `Region` from the outputs:

```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Step 5: Restart your dev server
```bash
npm run dev
```

---

## Method 3: AWS Console (Manual) 🖱️

If you prefer the AWS Console:

### Step 1: Create Identity Pool
1. Go to Amazon Cognito console
2. Click "Create identity pool"
3. Name: `HauntedReaderPool`
4. Enable "Unauthenticated identities"
5. Click "Create pool"

### Step 2: Create IAM Role
1. When prompted, create a new IAM role
2. Name: `HauntedReaderBedrockRole`
3. Add this inline policy:

```json
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
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-text-express-v1"
      ]
    }
  ]
}
```

### Step 3: Get Identity Pool ID
1. In Cognito console, click on your identity pool
2. Click "Edit identity pool"
3. Copy the "Identity pool ID" (format: `us-east-1:xxxx-xxxx-xxxx`)

### Step 4: Update .env
```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Verification

### Test the setup:

```bash
# Check if Identity Pool exists
aws cognito-identity describe-identity-pool \
  --identity-pool-id YOUR_POOL_ID \
  --region us-east-1

# Check if Role exists
aws iam get-role --role-name HauntedReaderBedrockRole

# Check if Role has Bedrock permissions
aws iam get-role-policy \
  --role-name HauntedReaderBedrockRole \
  --policy-name BedrockAccessPolicy
```

### Test Bedrock connection:

Create `test-bedrock.mjs`:

```javascript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-1" }),
    identityPoolId: "YOUR_POOL_ID_HERE"
  })
});

const command = new InvokeModelCommand({
  modelId: "anthropic.claude-3-haiku-20240307-v1:0",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 100,
    messages: [{ role: "user", content: "Say 'Boo!' like a friendly ghost." }]
  })
});

try {
  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  console.log("✅ Bedrock connected!");
  console.log("Response:", result.content[0].text);
} catch (error) {
  console.error("❌ Error:", error.message);
}
```

Run:
```bash
node test-bedrock.mjs
```

---

## Cleanup (When Done)

### If using bash script:
```bash
# Delete Identity Pool
aws cognito-identity delete-identity-pool \
  --identity-pool-id YOUR_POOL_ID \
  --region us-east-1

# Delete IAM Role
aws iam delete-role-policy \
  --role-name HauntedReaderBedrockRole \
  --policy-name BedrockAccessPolicy

aws iam delete-role --role-name HauntedReaderBedrockRole
```

### If using CloudFormation:
```bash
aws cloudformation delete-stack \
  --stack-name haunted-reader-cognito \
  --region us-east-1
```

---

## Troubleshooting

### Error: "AccessDeniedException"
- Check that Bedrock models are enabled in your region
- Verify IAM role has correct permissions
- Ensure role is attached to identity pool

### Error: "ResourceNotFoundException"
- Verify the Identity Pool ID is correct
- Check you're using the correct AWS region
- Ensure the identity pool exists

### Error: "ValidationException"
- Check that model IDs are correct
- Verify you're using supported models in your region
- Ensure request format matches Bedrock API

### App still shows "VITE_COGNITO_IDENTITY_POOL_ID not configured"
- Restart your dev server after updating .env
- Check .env file has no typos
- Verify environment variables are loaded (check browser console)

---

## Cost Monitoring

Set up a billing alarm:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name haunted-reader-bedrock-cost \
  --alarm-description "Alert if Bedrock costs exceed $10" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

---

## Security Best Practices

For production (post-hackathon):

1. **Add rate limiting** to prevent abuse
2. **Use authenticated identities** instead of unauthenticated
3. **Add CloudWatch logging** for monitoring
4. **Set up AWS WAF** for additional protection
5. **Implement request throttling** in your app
6. **Use API Gateway + Lambda** for better control

---

## Support

If you encounter issues:
1. Check AWS CloudWatch Logs
2. Verify IAM permissions
3. Test with AWS CLI first
4. Check Bedrock model availability in your region

Happy haunting! 👻
