# AWS Deployment Guide

## Overview

Deploy The Haunted Reader as a static site using AWS S3 + CloudFront for global CDN distribution.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Node.js project built (`npm run build`)

## Step-by-Step Deployment

### 1. Build the Application

```bash
npm run build
```

This creates a `dist/` folder with your production-ready static files.

### 2. Create S3 Bucket

```bash
# Replace 'haunted-reader-app' with your unique bucket name
aws s3 mb s3://haunted-reader-app --region us-east-1
```

### 3. Configure S3 for Static Website Hosting

```bash
aws s3 website s3://haunted-reader-app \
  --index-document index.html \
  --error-document index.html
```

### 4. Set Bucket Policy for Public Access

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::haunted-reader-app/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket haunted-reader-app \
  --policy file://bucket-policy.json
```

### 5. Upload Built Files to S3

```bash
aws s3 sync dist/ s3://haunted-reader-app \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

# Upload index.html separately with no-cache
aws s3 cp dist/index.html s3://haunted-reader-app/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

**Why different cache settings?**
- Static assets (JS, CSS, images) are hashed and can be cached forever
- index.html should not be cached so users always get the latest version

### 6. Create CloudFront Distribution

Create a file `cloudfront-config.json`:

```json
{
  "CallerReference": "haunted-reader-2024",
  "Comment": "Haunted Reader CDN",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-haunted-reader-app",
        "DomainName": "haunted-reader-app.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultRootObject": "index.html",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-haunted-reader-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "PriceClass": "PriceClass_100"
}
```

Create the distribution:

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**Note**: CloudFront deployment takes 15-20 minutes to propagate globally.

### 7. Get CloudFront URL

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='Haunted Reader CDN'].DomainName" \
  --output text
```

Your app will be available at: `https://d1234567890abc.cloudfront.net`

## Alternative: Using AWS Console

If you prefer the GUI:

### S3 Setup:
1. Go to S3 Console
2. Create bucket (unique name, us-east-1 region)
3. Upload `dist/` contents
4. Properties → Static website hosting → Enable
5. Permissions → Bucket Policy → Add public read policy
6. Note the website endpoint URL

### CloudFront Setup:
1. Go to CloudFront Console
2. Create Distribution
3. Origin domain: Select your S3 bucket website endpoint
4. Viewer protocol policy: Redirect HTTP to HTTPS
5. Compress objects: Yes
6. Default root object: index.html
7. Error pages: Add custom error response (404 → /index.html, 200)
8. Create distribution
9. Wait 15-20 minutes for deployment
10. Note the CloudFront domain name

## Environment Variables

**Important**: Since this is a static site, environment variables are embedded in the build.

Create `.env.production`:

```bash
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_TEXT_LENGTH=50000
```

**Security Warning**: API keys will be visible in the client bundle. For production apps, consider:
- Using AWS API Gateway + Lambda to proxy AI requests
- Implementing rate limiting
- Using AWS Secrets Manager for key rotation

## Deployment Script

Create `deploy.sh` for easy redeployment:

```bash
#!/bin/bash

BUCKET_NAME="haunted-reader-app"
DISTRIBUTION_ID="E1234567890ABC"  # Get from CloudFront console

echo "🎃 Building Haunted Reader..."
npm run build

echo "👻 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo "🔮 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Your app: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
```

Make it executable:

```bash
chmod +x deploy.sh
```

Then deploy with:

```bash
./deploy.sh
```

## Custom Domain (Optional)

### 1. Request SSL Certificate (ACM)

```bash
aws acm request-certificate \
  --domain-name hauntedreader.com \
  --validation-method DNS \
  --region us-east-1
```

**Note**: Certificate must be in us-east-1 for CloudFront.

### 2. Validate Certificate

Follow the DNS validation instructions in ACM console.

### 3. Update CloudFront Distribution

Add alternate domain name (CNAME) and attach the SSL certificate in CloudFront settings.

### 4. Create Route 53 Record

```bash
# Create A record (alias) pointing to CloudFront distribution
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://route53-change.json
```

## Cost Estimate

For a hackathon project with moderate traffic:

- **S3**: ~$0.023/GB storage + $0.09/GB transfer = ~$1-5/month
- **CloudFront**: First 1TB free tier, then $0.085/GB = ~$0-10/month
- **Route 53** (if using custom domain): $0.50/hosted zone/month

**Total**: ~$1-15/month depending on traffic

## Monitoring

### CloudWatch Metrics
- CloudFront requests
- S3 bucket size
- Error rates

### Enable CloudFront Logging (Optional)

```bash
aws cloudfront update-distribution \
  --id E1234567890ABC \
  --logging-config Enabled=true,Bucket=haunted-reader-logs.s3.amazonaws.com,Prefix=cloudfront/
```

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Ensure CloudFront custom error response redirects 404 to /index.html

### Issue: Old version still showing
**Solution**: Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

### Issue: CORS errors
**Solution**: Add CORS configuration to S3 bucket:
```bash
aws s3api put-bucket-cors \
  --bucket haunted-reader-app \
  --cors-configuration file://cors.json
```

### Issue: Slow initial load
**Solution**: 
- Enable CloudFront compression
- Optimize bundle size with code splitting
- Use lazy loading for heavy components

## Security Best Practices

1. **Enable S3 versioning** for rollback capability
2. **Use CloudFront signed URLs** for sensitive content (if needed)
3. **Implement WAF rules** to prevent abuse (optional)
4. **Rotate API keys regularly**
5. **Monitor CloudWatch for unusual traffic patterns**
6. **Consider API Gateway + Lambda** for server-side API key management

## Hackathon Submission

Your deployed URL will be:
- CloudFront: `https://d1234567890abc.cloudfront.net`
- Or custom domain: `https://hauntedreader.com`

Add this URL to your README.md and hackathon submission form.

## Cleanup (After Hackathon)

To avoid ongoing charges:

```bash
# Delete CloudFront distribution (must disable first)
aws cloudfront delete-distribution --id E1234567890ABC

# Empty and delete S3 bucket
aws s3 rm s3://haunted-reader-app --recursive
aws s3 rb s3://haunted-reader-app

# Delete Route 53 records (if created)
# Delete ACM certificate (if created)
```

Happy haunting! 👻🎃
