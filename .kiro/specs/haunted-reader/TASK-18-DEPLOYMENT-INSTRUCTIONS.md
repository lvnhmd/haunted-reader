# TASK-18: Deploy Application to AWS - Instructions

## 🚀 Status: Ready for Deployment

**Task:** TASK-18 - Deploy Application to AWS  
**Date:** November 25, 2025  
**Build Status:** ✅ Successful (412 KB gzipped)

---

## Quick Start

### Option 1: Automated Deployment (Recommended)

Use the provided deployment script:

```bash
./deploy-to-s3.sh
```

This script will:
1. ✅ Build the application
2. ✅ Create S3 bucket
3. ✅ Enable static website hosting
4. ✅ Configure bucket policy
5. ✅ Upload all files
6. ✅ Provide S3 website URL

**Then manually create CloudFront distribution** (see Step 2 below).

### Option 2: Manual Deployment

Follow the comprehensive guide in `AWS-DEPLOYMENT-GUIDE.md`.

---

## Deployment Steps

### Step 1: Deploy to S3 (Automated)

```bash
# Make script executable (if not already)
chmod +x deploy-to-s3.sh

# Run deployment script
./deploy-to-s3.sh
```

**You'll be prompted for:**
- S3 bucket name (must be globally unique)
- AWS region (default: us-east-1)

**Script will:**
- Build the application
- Create S3 bucket
- Configure static website hosting
- Set bucket policy for public access
- Upload all files with proper cache headers
- Provide S3 website URL

**Expected Output:**
```
👻 The Haunted Reader - AWS Deployment Script
==============================================

✅ AWS CLI configured

Enter S3 bucket name: haunted-reader-app-12345
Enter AWS region: us-east-1

🔨 Building application...
✅ Build successful

🪣 Creating S3 bucket...
✅ Bucket created

🌐 Enabling static website hosting...
✅ Static website hosting enabled

🔓 Configuring bucket policy...
✅ Bucket policy configured

📤 Uploading files to S3...
✅ Files uploaded

==============================================
🎉 Deployment Complete!
==============================================

S3 Website URL (HTTP):
  http://haunted-reader-app-12345.s3-website-us-east-1.amazonaws.com
```

### Step 2: Create CloudFront Distribution (Manual)

**Why CloudFront?**
- ✅ HTTPS/SSL support
- ✅ Global CDN (faster worldwide)
- ✅ Better caching
- ✅ Custom domain support

**Steps:**

1. **Go to CloudFront Console:**
   - https://console.aws.amazon.com/cloudfront/

2. **Click "Create distribution"**

3. **Configure Origin:**
   - **Origin domain:** Your S3 website endpoint
     - Format: `bucket-name.s3-website-region.amazonaws.com`
     - ⚠️ Use website endpoint, NOT bucket endpoint
   - **Protocol:** HTTP only
   - **Name:** Leave default

4. **Configure Default Cache Behavior:**
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS
   - **Cache policy:** CachingOptimized

5. **Configure Settings:**
   - **Price class:** Use all edge locations
   - **Default root object:** `index.html`

6. **Configure Custom Error Responses (CRITICAL for SPA):**
   - Click "Create custom error response"
   - **Error code:** 403
   - **Response page path:** `/index.html`
   - **Response code:** 200
   - Click "Create"
   - **Repeat for error code 404**

7. **Click "Create distribution"**

8. **Wait 5-15 minutes** for deployment (Status: "Enabled")

9. **Copy CloudFront domain name:**
   - Format: `d1234567890abc.cloudfront.net`

### Step 3: Test Deployment

**Test S3 URL (HTTP):**
```
http://your-bucket-name.s3-website-region.amazonaws.com
```

**Test CloudFront URL (HTTPS):**
```
https://d1234567890abc.cloudfront.net
```

**Verify:**
- ✅ App loads over HTTPS
- ✅ All assets load correctly
- ✅ Navigation works (no 404s on refresh)
- ✅ Upload feature works
- ✅ Spirit selection works
- ✅ AI generation works (if Bedrock configured)
- ✅ Timeline visualization works
- ✅ Export functionality works

---

## Environment Variables

If your app needs AWS Bedrock credentials:

### Option 1: Build-time Variables (Recommended)

1. Create `.env.production`:
```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=your-pool-id-here
```

2. Rebuild:
```bash
npm run build
```

3. Re-deploy:
```bash
./deploy-to-s3.sh
```

4. Invalidate CloudFront cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Option 2: Use Existing Configuration

If you already have `.env` configured, the build will use those values.

---

## Updating the Deployment

After making changes to your code:

```bash
# 1. Build
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://YOUR_BUCKET_NAME/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://YOUR_BUCKET_NAME/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

Or use the deployment script again:
```bash
./deploy-to-s3.sh
```

---

## Troubleshooting

### Issue: "Bucket name already exists"

**Solution:** Choose a different bucket name (must be globally unique).

```bash
# Try adding timestamp
haunted-reader-app-$(date +%s)
```

### Issue: "Access Denied" when accessing S3 URL

**Solution:** Check bucket policy allows public read access.

```bash
aws s3api get-bucket-policy --bucket YOUR_BUCKET_NAME
```

### Issue: 404 errors on page refresh

**Solution:** Configure CloudFront custom error responses (403/404 → index.html).

### Issue: Old version showing after update

**Solution:** Invalidate CloudFront cache.

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Issue: AWS CLI not found

**Solution:** Install AWS CLI.

```bash
# macOS
brew install awscli

# Or download from
# https://aws.amazon.com/cli/
```

### Issue: AWS credentials not configured

**Solution:** Configure AWS credentials.

```bash
aws configure
```

You'll need:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

---

## Cost Estimate

**Monthly costs for low-traffic app:**

- **S3 Storage:** ~$0.02/month (1 GB)
- **S3 Requests:** ~$0.01/month (1000 requests)
- **CloudFront:** ~$0.10/month (1 GB transfer)
- **Total:** ~$0.13/month

**AWS Free Tier (First 12 months):**
- S3: 5 GB storage, 20,000 GET requests
- CloudFront: 1 TB transfer, 10M requests

Most likely **FREE** for hackathon demo! 🎉

---

## Deployment Checklist

### Pre-Deployment
- [x] Production build successful
- [x] All tests passing (69/69)
- [x] No console errors
- [x] AWS CLI installed
- [x] AWS credentials configured

### S3 Deployment
- [ ] Run `./deploy-to-s3.sh`
- [ ] S3 bucket created
- [ ] Files uploaded successfully
- [ ] S3 website URL works (HTTP)

### CloudFront Setup
- [ ] CloudFront distribution created
- [ ] Origin configured (S3 website endpoint)
- [ ] HTTPS redirect enabled
- [ ] Custom error responses configured (403/404)
- [ ] Distribution deployed (Status: Enabled)
- [ ] CloudFront URL works (HTTPS)

### Post-Deployment Testing
- [ ] App loads over HTTPS
- [ ] All static assets load
- [ ] SPA routing works (no 404s)
- [ ] Upload feature works
- [ ] Spirit selection works
- [ ] AI generation works
- [ ] Timeline works
- [ ] Export works
- [ ] Mobile responsive
- [ ] Accessibility works

### Documentation
- [ ] Update README with deployment URL
- [ ] Document CloudFront domain
- [ ] Note any environment variables needed

---

## Next Steps

After successful deployment:

1. ✅ **Update README.md** with deployment URL
2. ✅ **Test all features** in production
3. ✅ **Proceed to TASK-19:** Create Demo Video
4. ✅ **Proceed to TASK-20:** Write Kiro Usage Documentation
5. ✅ **Proceed to TASK-21:** Final Submission Checklist

---

## Resources

- **Deployment Guide:** `AWS-DEPLOYMENT-GUIDE.md` (comprehensive)
- **Deployment Script:** `deploy-to-s3.sh` (automated)
- **CloudFront Config:** `cloudfront-distribution-config.json` (template)

**AWS Documentation:**
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)

---

## Support

If you need help:

1. Check `AWS-DEPLOYMENT-GUIDE.md` for detailed instructions
2. Review AWS CloudWatch logs
3. Check browser console for errors
4. Verify AWS credentials and permissions
5. Check CloudFront distribution status

**The Haunted Reader is ready to haunt the web! 👻🎃**
