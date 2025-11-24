# Lambda Proxy Setup Complete! 🎉

## Problem Solved

The original issue was that **Cognito Identity Pool applies restrictive session policies** that prevented direct Bedrock API access, even with correct IAM permissions. The error message was:

```
User: arn:aws:sts::730710483519:assumed-role/HauntedReaderBedrockRole/CognitoIdentityCredentials 
is not authorized to perform: bedrock:InvokeModel 
because no session policy allows the bedrock:InvokeModel action
```

## Solution: Lambda Proxy

We deployed a Lambda function that acts as a proxy between your app and Amazon Bedrock. This bypasses the Cognito session policy restrictions entirely.

### What Was Deployed

1. **Lambda Function**: `HauntedReaderBedrockProxy`
   - Runtime: Node.js 20.x
   - Region: us-east-1
   - Function URL: https://nahwouwfcfbw6b77swlhvkaa4u0ufgos.lambda-url.us-east-1.on.aws/

2. **IAM Role**: `HauntedReaderLambdaRole`
   - Has full Bedrock access
   - Has CloudWatch Logs access for debugging

3. **Updated App Code**:
   - Created `src/services/aiProviders/lambdaProvider.js`
   - Updated `src/services/aiService.js` to use Lambda proxy when configured
   - Updated `.env` with `VITE_API_ENDPOINT`

### How It Works

```
Browser App → Lambda Function → Amazon Bedrock → Claude Model
     ↑                                              ↓
     └──────────────── Response ────────────────────┘
```

The Lambda function:
- Receives requests from your browser app
- Forwards them to Bedrock using its own IAM role (which works!)
- Returns the AI-generated text back to your app

### Configuration

Your `.env` file now has:
```bash
VITE_API_ENDPOINT=https://nahwouwfcfbw6b77swlhvkaa4u0ufgos.lambda-url.us-east-1.on.aws/
```

When this is set, the app automatically uses the Lambda proxy instead of direct Bedrock access.

## Testing

✅ Lambda function tested and working
✅ App code updated and built successfully
✅ Integration test passed

## Next Steps

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Test the full flow**:
   - Upload a text file
   - Select a spirit (e.g., Edgar Allan Poe)
   - Click "Generate Interpretations"
   - You should see the spirit's interpretation appear!

3. **If you encounter issues**:
   - Check browser console for errors
   - Check Lambda logs in CloudWatch: `/aws/lambda/HauntedReaderBedrockProxy`
   - Run the test script: `node test-lambda-integration.mjs`

## Cost Considerations

- **Lambda**: Free tier includes 1M requests/month
- **Bedrock**: Pay per token (Claude Haiku is ~$0.25 per 1M input tokens)
- For a hackathon demo, costs should be negligible (< $1)

## Files Created

- `lambda-bedrock-proxy.mjs` - Lambda function code
- `deploy-lambda-proxy.sh` - Deployment script
- `src/services/aiProviders/lambdaProvider.js` - Lambda provider for app
- `test-lambda-integration.mjs` - Integration test script
- This documentation file

## Troubleshooting

### Lambda function not responding
```bash
# Check function status
aws lambda get-function --function-name HauntedReaderBedrockProxy --region us-east-1

# Check recent logs
aws logs tail /aws/lambda/HauntedReaderBedrockProxy --follow
```

### App still showing credential errors
1. Make sure `.env` has `VITE_API_ENDPOINT` set
2. Restart your dev server (`npm run dev`)
3. Hard refresh your browser (Cmd+Shift+R on Mac)

### Need to redeploy Lambda
```bash
./deploy-lambda-proxy.sh
```

## Success! 🎃

Your Haunted Reader app is now ready to summon spirits and generate spooky interpretations!
