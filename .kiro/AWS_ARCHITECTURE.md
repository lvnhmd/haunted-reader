# The Haunted Reader - AWS Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           User Browser                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         React App (Haunted Reader SPA)                     │ │
│  │  - Spirit Gallery                                          │ │
│  │  - Text Upload/Parser                                      │ │
│  │  - Interpretation Viewer                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────┬─────────────────────────────┬───────────────────┘
                │                             │
                │ Static Assets               │ AI Requests
                │                             │
        ┌───────▼────────┐           ┌────────▼─────────┐
        │  CloudFront    │           │    Cognito       │
        │     (CDN)      │           │ Identity Pool    │
        └───────┬────────┘           └────────┬─────────┘
                │                             │
                │                             │ Temporary Credentials
        ┌───────▼────────┐                    │
        │   S3 Bucket    │           ┌────────▼─────────┐
        │ (Static Site)  │           │  Amazon Bedrock  │
        │  - index.html  │           │  - Claude 3      │
        │  - JS/CSS      │           │  - Haiku/Sonnet  │
        │  - Assets      │           └──────────────────┘
        └────────────────┘
```

## Components

### 1. Frontend (React SPA)
- **Technology**: React + Vite
- **Hosting**: S3 Static Website
- **CDN**: CloudFront for global distribution
- **Features**:
  - Text upload and parsing
  - Spirit gallery and selection
  - AI-powered interpretation generation
  - Multi-perspective comparison view
  - Export functionality

### 2. Authentication (Amazon Cognito)
- **Service**: Cognito Identity Pool
- **Type**: Unauthenticated access (no user accounts needed)
- **Purpose**: Provides temporary AWS credentials to browser
- **Permissions**: Limited to `bedrock:InvokeModel` only
- **Security**: Credentials expire automatically, no API keys in code

### 3. AI Generation (Amazon Bedrock)
- **Service**: Amazon Bedrock
- **Models**:
  - Claude 3 Sonnet (best quality, creative writing)
  - Claude 3 Haiku (fast, cost-effective)
- **Access**: Direct from browser using Cognito credentials
- **Features**:
  - Text generation
  - Streaming responses
  - Multiple model selection

### 4. Content Delivery (CloudFront + S3)
- **S3**: Static website hosting
- **CloudFront**: Global CDN with:
  - HTTPS by default
  - Automatic compression
  - Edge caching
  - Custom error pages (404 → index.html for SPA routing)

## Data Flow

### Initial Page Load
```
User → CloudFront → S3 → React App Loads
```

### AI Generation Request
```
User selects spirit
    ↓
React App builds prompt
    ↓
Request temporary credentials from Cognito
    ↓
Call Bedrock with credentials
    ↓
Bedrock generates text using Claude 3
    ↓
Stream response back to React App
    ↓
Display interpretation to user
```

### File Upload
```
User uploads file (PDF/EPUB/TXT)
    ↓
Browser parses file locally (no upload to server)
    ↓
Text extracted and displayed
    ↓
User can then generate interpretations
```

## Security Model

### No Backend = No Server-Side Secrets
- All processing happens in browser or AWS managed services
- No API keys to manage or expose
- Cognito provides temporary, scoped credentials
- IAM role limits permissions to Bedrock only

### IAM Role Policy
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
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-*"
      ]
    }
  ]
}
```

### What Users Can Do
✅ Generate text interpretations via Bedrock
✅ Access the static website

### What Users Cannot Do
❌ Access other AWS services
❌ Modify S3 bucket contents
❌ Use other Bedrock models
❌ Exceed rate limits (handled by Bedrock)

## Cost Breakdown

### Monthly Costs (Estimated for Hackathon)

| Service | Usage | Cost |
|---------|-------|------|
| **S3 Storage** | ~100MB static files | $0.02 |
| **S3 Requests** | ~1000 GET requests | $0.01 |
| **CloudFront** | ~1GB data transfer | $0.09 |
| **Cognito** | Unlimited identity pool | $0.00 (free) |
| **Bedrock (Haiku)** | ~1M input tokens | $0.25 |
| **Bedrock (Sonnet)** | ~100K input tokens | $0.30 |
| **Total** | | **~$0.67/month** |

**For hackathon demo**: Likely under $2 total

## Scalability

### Current Architecture Handles
- ✅ 1000s of concurrent users (CloudFront + S3)
- ✅ Global distribution (CloudFront edge locations)
- ✅ Automatic scaling (all managed services)
- ✅ No server maintenance

### Bottlenecks
- ⚠️ Bedrock rate limits (can request increase)
- ⚠️ Cognito credential refresh (handled automatically)
- ⚠️ Browser memory for large file parsing

### Future Scaling Options
If the app grows beyond hackathon:
1. Add API Gateway + Lambda for rate limiting
2. Implement user accounts with Cognito User Pools
3. Add DynamoDB for saving interpretations
4. Use S3 for large file processing
5. Add CloudWatch for monitoring

## Deployment Pipeline

```
Developer Machine
    ↓
npm run build
    ↓
dist/ folder created
    ↓
aws s3 sync dist/ s3://bucket
    ↓
aws cloudfront create-invalidation
    ↓
Live on CloudFront URL
```

Automated with `deploy.sh` script.

## Monitoring

### CloudWatch Metrics (Available)
- CloudFront requests/errors
- S3 bucket size
- Bedrock invocations
- Bedrock throttling events

### Cost Monitoring
- AWS Cost Explorer
- Bedrock usage dashboard
- CloudFront usage reports

## Advantages of This Architecture

### For Hackathon
✅ **Fast to build** - No backend code needed
✅ **Low cost** - Under $2 for entire hackathon
✅ **Impressive** - Shows AWS expertise
✅ **Scalable** - Can handle demo traffic easily
✅ **Secure** - No API keys to leak

### For Judges
✅ **AWS native** - Uses multiple AWS services
✅ **Best practices** - IAM, Cognito, managed services
✅ **Production-ready** - Could scale to real users
✅ **Cost-optimized** - Smart model selection
✅ **Well-architected** - Follows AWS patterns

## Alternative Architectures Considered

### Option B: API Gateway + Lambda
**Pros**: Better rate limiting, server-side logic
**Cons**: More complex, higher latency, more cost
**Decision**: Not needed for hackathon scope

### Option C: Direct OpenAI/Anthropic API
**Pros**: Simpler integration
**Cons**: API keys in client, not AWS-native
**Decision**: Bedrock better for AWS showcase

### Option D: EC2 + Self-hosted LLM
**Pros**: Full control
**Cons**: High cost, maintenance, slow
**Decision**: Managed services better for hackathon

## Disaster Recovery

### Backup Strategy
- S3 versioning enabled
- CloudFormation/Terraform for infrastructure (optional)
- Git for code

### Rollback Process
```bash
# Revert to previous S3 version
aws s3api list-object-versions --bucket haunted-reader-app

# Restore previous version
aws s3api copy-object --copy-source "bucket/key?versionId=xxx"

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id xxx --paths "/*"
```

## Future Enhancements

### Phase 2 (Post-Hackathon)
- [ ] Add DynamoDB for saving interpretations
- [ ] Implement user accounts (Cognito User Pools)
- [ ] Add API Gateway for rate limiting
- [ ] Use Lambda for background processing
- [ ] Add CloudWatch dashboards
- [ ] Implement A/B testing with CloudFront

### Phase 3 (Production)
- [ ] Multi-region deployment
- [ ] WAF for security
- [ ] Advanced caching strategies
- [ ] Cost optimization with Reserved Capacity
- [ ] Custom domain with Route 53
- [ ] SSL certificate with ACM

## Questions for Judges

This architecture demonstrates:
1. **Serverless-first thinking** - No servers to manage
2. **Cost optimization** - Pay only for what you use
3. **Security best practices** - IAM, temporary credentials
4. **Scalability** - Handles growth automatically
5. **AWS expertise** - Multiple services integrated seamlessly

Perfect for the Kiroween Frankenstein category! 🎃👻
