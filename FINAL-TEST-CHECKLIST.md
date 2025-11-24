# Final Test Checklist ✅

## Quick Test

Run your app and test the full flow:

```bash
npm run dev
```

Then in your browser:

1. ✅ App loads without errors
2. ✅ Upload a text file (or paste text)
3. ✅ Select a spirit (e.g., "Edgar Allan Poe")
4. ✅ Click "Generate Interpretations"
5. ✅ See the spooky interpretation appear!

## What Changed

### Before (Not Working ❌)
```
Browser → Cognito Identity Pool → Bedrock
                ↓
         Session Policy Blocks Access
```

### After (Working ✅)
```
Browser → Lambda Function → Bedrock
              ↓
        Full IAM Permissions
```

## Configuration Summary

### .env File
```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc
VITE_API_ENDPOINT=https://nahwouwfcfbw6b77swlhvkaa4u0ufgos.lambda-url.us-east-1.on.aws/
```

### AWS Resources Created

1. **Lambda Function**: `HauntedReaderBedrockProxy`
   - Public URL with CORS enabled
   - Has Bedrock invoke permissions
   - Logs to CloudWatch

2. **IAM Role**: `HauntedReaderLambdaRole`
   - Trust policy for Lambda service
   - Bedrock invoke permissions
   - CloudWatch Logs permissions

## Verification Commands

### Test Lambda directly
```bash
node test-lambda-integration.mjs
```

### Check Lambda status
```bash
aws lambda get-function \
  --function-name HauntedReaderBedrockProxy \
  --region us-east-1 \
  --query 'Configuration.State' \
  --output text
```

### View Lambda logs
```bash
aws logs tail /aws/lambda/HauntedReaderBedrockProxy --follow
```

### Test with curl
```bash
curl -X POST "https://nahwouwfcfbw6b77swlhvkaa4u0ufgos.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
    "prompt": "Say hello in a spooky way",
    "options": {"maxTokens": 50}
  }'
```

## Expected Behavior

### Success Response
```json
{
  "text": "Greetings from beyond the veil, mortal..."
}
```

### Error Response (if something is wrong)
```json
{
  "error": "Error message here"
}
```

## Troubleshooting

### Issue: "Failed to fetch" error in browser
**Solution**: Check that CORS is enabled on Lambda function URL
```bash
aws lambda get-function-url-config \
  --function-name HauntedReaderBedrockProxy \
  --region us-east-1
```

### Issue: Lambda returns 403 error
**Solution**: Check Lambda role has Bedrock permissions
```bash
aws iam get-role-policy \
  --role-name HauntedReaderLambdaRole \
  --policy-name BedrockAccess
```

### Issue: App still uses Cognito
**Solution**: Make sure `.env` has `VITE_API_ENDPOINT` and restart dev server
```bash
# Check .env
cat .env | grep VITE_API_ENDPOINT

# Restart dev server
npm run dev
```

## Performance Notes

- Lambda cold start: ~1-2 seconds (first request)
- Lambda warm: ~200-500ms
- Bedrock response: ~2-5 seconds (depending on text length)
- Total time: ~3-7 seconds for first interpretation

## Cost Estimate (Hackathon Demo)

- Lambda: Free (within free tier)
- Bedrock Claude Haiku: ~$0.25 per 1M input tokens
- Estimated demo cost: < $0.50

## Success Criteria

✅ Lambda function deployed and accessible
✅ App code updated to use Lambda proxy
✅ Integration test passes
✅ Build completes without errors
✅ No TypeScript/ESLint errors

## Ready to Demo! 🎃

Your Haunted Reader is now fully functional and ready to summon literary spirits!
