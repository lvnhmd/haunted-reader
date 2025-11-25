# Deployment Troubleshooting - File Upload Issue

## Issue: File Upload Not Working in Production

**Symptoms:**
- File upload works in development (`npm run dev`)
- File upload fails in production (S3 deployment)
- No visible error message or upload doesn't trigger

## Likely Causes

### 1. PDF.js Worker Loading Issue
**Problem:** PDF.js worker file not loading from CDN in production

**Solution:** The worker is configured to load from CDN:
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
```

**Check:** Open browser console and look for errors related to `pdf.worker.min.js`

### 2. CORS Issues
**Problem:** Browser blocking file reading due to CORS

**Solution:** S3 bucket needs CORS configuration

**Fix:**
```bash
BUCKET_NAME="haunted-reader-kiroween-1764092634"

cat > /tmp/cors-config.json <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration file:///tmp/cors-config.json

rm /tmp/cors-config.json
```

### 3. File Size Limits
**Problem:** Browser or S3 limiting file size

**Solution:** Check file size limits in code (currently 10MB)

### 4. Missing Content-Type Headers
**Problem:** Files served with wrong MIME types

**Solution:** Re-upload with correct content types

## Diagnostic Steps

### Step 1: Check Browser Console
1. Open deployed app: http://haunted-reader-kiroween-1764092634.s3-website-us-east-1.amazonaws.com
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try uploading a file
5. Look for errors

**Common Errors:**
- `Failed to load worker` - PDF.js worker issue
- `CORS policy` - CORS configuration needed
- `Network error` - File loading issue

### Step 2: Test with Simple Text
1. Try the "Paste Text" tab instead of file upload
2. If paste works but upload doesn't, it's a file parsing issue
3. If neither works, it's a broader issue

### Step 3: Test Different File Types
1. Try TXT file (simplest)
2. Try PDF file
3. Try EPUB file

### Step 4: Check Network Tab
1. Open DevTools → Network tab
2. Try uploading
3. Look for failed requests
4. Check response codes

## Quick Fixes

### Fix 1: Add CORS Configuration
```bash
BUCKET_NAME="haunted-reader-kiroween-1764092634"

aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }'
```

### Fix 2: Re-upload with Correct MIME Types
```bash
BUCKET_NAME="haunted-reader-kiroween-1764092634"

# Re-upload JS files with correct content-type
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --content-type-by-extension

aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"
```

### Fix 3: Invalidate Browser Cache
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Or clear browser cache
3. Or try incognito/private mode

### Fix 4: Use CloudFront (Recommended)
CloudFront handles CORS and caching better than S3 alone.

## Testing Locally vs Production

### Local (Works)
- Uses Vite dev server
- No CORS issues
- Hot module replacement
- Source maps available

### Production (May Have Issues)
- Static files on S3
- CORS may be needed
- Minified code
- CDN dependencies

## Solution: Add CORS and Re-deploy

Run this script to fix CORS and re-upload:

```bash
#!/bin/bash

BUCKET_NAME="haunted-reader-kiroween-1764092634"

echo "🔧 Fixing CORS configuration..."
aws s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }'

echo "✅ CORS configured"
echo ""
echo "🔨 Rebuilding application..."
npm run build

echo ""
echo "📤 Re-uploading files..."
aws s3 sync dist/ "s3://$BUCKET_NAME/" \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
  --cache-control "no-cache, no-store, must-revalidate"

echo ""
echo "✅ Fixed! Try the app again:"
echo "http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
```

## If Still Not Working

### Check These:
1. **Browser Console Errors** - What's the exact error?
2. **Network Tab** - Are files loading?
3. **File Type** - Try TXT first (simplest)
4. **File Size** - Try small file (< 1MB)
5. **Browser** - Try different browser
6. **Incognito Mode** - Rule out cache issues

### Report Issue With:
- Browser and version
- Exact error message from console
- File type and size being uploaded
- Network tab screenshot

## Most Likely Solution

**The issue is probably CORS.** Run the CORS fix script above and it should work!
