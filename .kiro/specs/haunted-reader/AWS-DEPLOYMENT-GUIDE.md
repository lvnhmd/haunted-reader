# AWS Deployment Guide - The Haunted Reader

## 🚀 TASK-18: Deploy Application to AWS

**Status:** Ready for Deployment  
**Target:** AWS S3 + CloudFront  
**Build Status:** ✅ Successful (412 KB gzipped)

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ **AWS Account** - Active AWS account with billing enabled
2. ✅ **AWS CLI Installed** - Version 2.x recommended
3. ✅ **AWS Credentials Configured** - IAM user with appropriate permissions
4. ✅ **Production Build** - `npm run build` completed successfully

### Required AWS Permissions

Your IAM user needs these permissions:
- `s3:CreateBucket`
- `s3:PutObject`
- `s3:PutBucketPolicy`
- `s3:PutBucketWebsite`
- `cloudfront:CreateDistribution`
- `cloudfront:GetDistribution`
- `cloudfront:UpdateDistribution`

---

## Step-by-Step Deployment

### Step 1: Create Production Build ✅

```bash
npm run build
```

**Expected Output:**
- Build artifacts in `dist/` folder
- Total size: ~1.34 MB (gzipped: 412 KB)
- Files: index.html + 7 asset files

**Verify Build:**
```bash
ls -lh dist/
```

---

### Step 2: Create S3 Bucket

**Option A: Using AWS Console**

1. Go to [S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. **Bucket name:** `haunted-reader-app` (must be globally unique)
4. **Region:** Choose closest to your users (e.g., `us-east-1`)
5. **Block Public Access:** UNCHECK "Block all public access"
   - ⚠️ Acknowledge the warning (needed for public website)
6. Click "Create bucket"

**Option B: Using AWS CLI**

```bash
# Set your bucket name (must be globally unique)
BUCKET_NAME="haunted-reader-app-$(date +%s)"
REGION="us-east-1"

# Create bucket
aws s3 mb s3://${BUCKET_NAME} --region ${REGION}

# Enable static website hosting
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html
```

---

### Step 3: Configure Bucket Policy for Public Access

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
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```

**Replace `BUCKET_NAME` with your actual bucket name!**

Apply the policy:

```bash
# Using AWS CLI
aws s3api put-bucket-policy \
  --bucket ${BUCKET_NAME} \
  --policy file://bucket-policy.json
```

**Or via AWS Console:**
1. Go to your bucket → Permissions tab
2. Scroll to "Bucket policy"
3. Click "Edit" and paste the policy
4. Replace `BUCKET_NAME` with your bucket name
5. Click "Save changes"

---

### Step 4: Upload Build Files to S3

**Option A: Using AWS CLI (Recommended)**

```bash
# Upload all files from dist/ to S3
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

# Upload index.html separately with no-cache
aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

**Why different cache settings?**
- Assets (JS/CSS): Long cache (1 year) - they have content hashes
- index.html: No cache - ensures users get latest version

**Option B: Using AWS Console**

1. Go to your bucket
2. Click "Upload"
3. Drag all files from `dist/` folder
4. Click "Upload"

---

### Step 5: Test S3 Website Endpoint

Get your S3 website URL:

```bash
echo "http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
```

**Or find it in AWS Console:**
1. Go to bucket → Properties tab
2. Scroll to "Static website hosting"
3. Copy the "Bucket website endpoint"

**Test the URL in your browser** - The app should load!

⚠️ **Note:** This is HTTP only. We'll add HTTPS with CloudFront next.

---

### Step 6: Create CloudFront Distribution

**Why CloudFront?**
- ✅ HTTPS/SSL support
- ✅ Global CDN (faster loading worldwide)
- ✅ Custom domain support
- ✅ Better caching control

**Option A: Using AWS Console**

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"

**Origin Settings:**
- **Origin domain:** Select your S3 bucket website endpoint
  - ⚠️ Use the website endpoint, NOT the bucket endpoint
  - Format: `bucket-name.s3-website-region.amazonaws.com`
- **Protocol:** HTTP only (S3 website endpoints don't support HTTPS)
- **Name:** Leave default

**Default Cache Behavior:**
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Allowed HTTP methods:** GET, HEAD, OPTIONS
- **Cache policy:** CachingOptimized
- **Origin request policy:** None

**Settings:**
- **Price class:** Use all edge locations (or choose based on budget)
- **Alternate domain name (CNAME):** Leave empty (or add custom domain)
- **Custom SSL certificate:** Default CloudFront certificate
- **Default root object:** `index.html`

**Custom Error Responses (IMPORTANT for SPA):**
- Click "Create custom error response"
- **HTTP error code:** 403
- **Customize error response:** Yes
- **Response page path:** `/index.html`
- **HTTP response code:** 200
- Click "Create"
- Repeat for error code 404

3. Click "Create distribution"
4. Wait 5-15 minutes for deployment (Status: "Enabled")

**Option B: Using AWS CLI**

Create `cloudfront-config.json`:

```json
{
  "CallerReference": "haunted-reader-$(date +%s)",
  "Comment": "The Haunted Reader - Kiroween Hackathon",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-haunted-reader",
        "DomainName": "BUCKET_NAME.s3-website-REGION.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-haunted-reader",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 3,
      "Items": ["GET", "HEAD", "OPTIONS"]
    },
    "Compress": true,
    "MinTTL": 0
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  }
}
```

Deploy:

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

### Step 7: Test CloudFront Deployment

**Get your CloudFront URL:**

```bash
# List distributions
aws cloudfront list-distributions \
  --query "DistributionList.Items[0].DomainName" \
  --output text
```

**Or in AWS Console:**
1. Go to CloudFront → Distributions
2. Copy the "Distribution domain name"
3. Format: `d1234567890abc.cloudfront.net`

**Test the URL:**
```
https://d1234567890abc.cloudfront.net
```

**Verify:**
- ✅ App loads over HTTPS
- ✅ All assets load correctly
- ✅ Navigation works (no 404s on refresh)
- ✅ Upload, spirit selection, and generation work
- ✅ Timeline and export features work

---

### Step 8: Configure Environment Variables (If Needed)

If your app uses environment variables (like AWS Bedrock credentials):

**Option 1: Build-time Variables (Recommended)**

1. Create `.env.production`:
```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=your-pool-id
```

2. Rebuild:
```bash
npm run build
```

3. Re-upload to S3:
```bash
aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete
```

4. Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Option 2: Runtime Configuration**

Create `public/config.js` with runtime config (not recommended for sensitive data).

---

## Optional: Custom Domain Setup

### Step 9: Set Up Custom Domain (Optional)

**Prerequisites:**
- Domain registered (Route 53 or external registrar)
- SSL certificate in ACM (us-east-1 region for CloudFront)

**Steps:**

1. **Request SSL Certificate (ACM):**
   - Go to AWS Certificate Manager (us-east-1 region)
   - Request public certificate
   - Domain: `hauntedreader.com` and `www.hauntedreader.com`
   - Validate via DNS or email

2. **Update CloudFront Distribution:**
   - Go to CloudFront → Your distribution → Edit
   - Alternate domain names: Add your domain
   - SSL certificate: Select your ACM certificate
   - Save changes

3. **Create Route 53 Record:**
   - Go to Route 53 → Hosted zones → Your domain
   - Create record:
     - Name: Leave empty (or `www`)
     - Type: A
     - Alias: Yes
     - Alias target: Your CloudFront distribution
   - Create record

4. **Wait for DNS propagation** (5-60 minutes)

5. **Test:** `https://yourdomain.com`

---

## Deployment Checklist

### Pre-Deployment ✅
- [x] Production build successful
- [x] All tests passing (69/69)
- [x] No console errors
- [x] Environment variables configured
- [x] AWS credentials configured

### S3 Setup ✅
- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Bucket policy configured (public read)
- [ ] Files uploaded to S3
- [ ] S3 website endpoint tested

### CloudFront Setup ✅
- [ ] CloudFront distribution created
- [ ] Origin configured (S3 website endpoint)
- [ ] HTTPS redirect enabled
- [ ] Custom error responses configured (403/404 → index.html)
- [ ] Distribution deployed (Status: Enabled)
- [ ] CloudFront URL tested

### Post-Deployment Testing ✅
- [ ] App loads over HTTPS
- [ ] All static assets load
- [ ] SPA routing works (no 404s)
- [ ] Upload feature works
- [ ] Spirit selection works
- [ ] AI generation works (Bedrock)
- [ ] Timeline visualization works
- [ ] Export functionality works
- [ ] Mobile responsive
- [ ] Accessibility features work

### Performance Testing ✅
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90

---

## Troubleshooting

### Issue: 403 Forbidden on S3

**Solution:** Check bucket policy allows public read access.

```bash
aws s3api get-bucket-policy --bucket ${BUCKET_NAME}
```

### Issue: 404 on Page Refresh

**Solution:** Configure CloudFront custom error responses (403/404 → index.html).

### Issue: Old Version Showing

**Solution:** Invalidate CloudFront cache.

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Issue: Assets Not Loading

**Solution:** Check CORS and cache headers.

```bash
# Check asset URL in browser DevTools
# Verify S3 bucket policy allows GetObject
```

### Issue: Bedrock API Not Working

**Solution:** Check Cognito Identity Pool configuration and IAM roles.

---

## Cost Estimate

**Monthly costs for low-traffic app:**

- **S3 Storage:** ~$0.02/month (1 GB)
- **S3 Requests:** ~$0.01/month (1000 requests)
- **CloudFront:** ~$0.10/month (1 GB transfer)
- **Total:** ~$0.13/month

**Free Tier (First 12 months):**
- S3: 5 GB storage, 20,000 GET requests
- CloudFront: 1 TB transfer, 10M requests

**Bedrock Costs (Separate):**
- Claude 3 Haiku: ~$0.25 per 1M input tokens
- Claude 3 Sonnet: ~$3 per 1M input tokens

---

## Deployment Scripts

### Quick Deploy Script

Create `deploy.sh`:

```bash
#!/bin/bash

# Configuration
BUCKET_NAME="haunted-reader-app"
REGION="us-east-1"
DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"

# Build
echo "Building application..."
npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"

echo "Deployment complete!"
echo "URL: https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net"
```

Make executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

---

## Next Steps After Deployment

1. ✅ **Test deployed application thoroughly**
2. ✅ **Update README with deployment URL**
3. ✅ **Proceed to TASK-19: Create Demo Video**
4. ✅ **Proceed to TASK-20: Write Kiro Usage Documentation**
5. ✅ **Proceed to TASK-21: Final Submission Checklist**

---

## Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Review browser console for errors
3. Verify AWS credentials and permissions
4. Check CloudFront distribution status
5. Review S3 bucket policy

**The Haunted Reader is ready to haunt the web! 👻🎃**
