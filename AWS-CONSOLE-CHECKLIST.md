# AWS Console Checklist - Step by Step

## 🎯 Quick Fix: Check IAM Role Policy

### Step 1: Go to IAM Console
1. Open AWS Console: https://console.aws.amazon.com/
2. Search for "IAM" in the top search bar
3. Click on **IAM** (Identity and Access Management)

### Step 2: Find Your Role
1. In the left sidebar, click **Roles**
2. In the search box, type: `HauntedReaderBedrockRole`
3. Click on the role name

### Step 3: Check the Policy
1. Scroll down to **Permissions policies**
2. You should see: `BedrockAccessPolicy`
3. Click the **▶** arrow next to it to expand
4. Click **Edit** (or click the policy name)

### Step 4: Verify the Policy JSON

The policy should look like this:

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
      "Resource": "arn:aws:bedrock:*::foundation-model/*"
    }
  ]
}
```

**Key point**: The `Resource` should be `"arn:aws:bedrock:*::foundation-model/*"` (with wildcards)

### Step 5: If It's Wrong, Fix It
1. Click **Edit policy**
2. Click the **JSON** tab
3. Replace the entire content with the JSON above
4. Click **Review policy**
5. Click **Save changes**

---

## 🔍 Alternative: Check Trust Relationship

### Step 1: Still in the IAM Role
1. Click the **Trust relationships** tab
2. Click **Edit trust policy**

### Step 2: Verify Trust Policy

Should look like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }
  ]
}
```

**Key point**: The `aud` value should match your Identity Pool ID from `.env`

---

## 🆔 Check Cognito Identity Pool

### Step 1: Go to Cognito Console
1. Search for "Cognito" in the top search bar
2. Click **Amazon Cognito**

### Step 2: Find Your Identity Pool
1. Click **Identity pools** (not User pools!)
2. Look for: `HauntedReaderPool`
3. Click on it

### Step 3: Verify the Identity Pool ID
1. The Identity Pool ID should be: `us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc`
2. This should match what's in your `.env` file

### Step 4: Check Role Attachment
1. Click **Edit identity pool** (top right)
2. Scroll down to **Unauthenticated role**
3. It should show: `HauntedReaderBedrockRole`
4. If it says "Create new role" or shows a different role, that's the problem!

### Step 5: Fix Role Attachment (if needed)
1. Click the dropdown under **Unauthenticated role**
2. Select: `HauntedReaderBedrockRole`
3. Click **Save Changes**

---

## 🤖 Check Bedrock Model Access

### Step 1: Go to Bedrock Console
1. Search for "Bedrock" in the top search bar
2. Click **Amazon Bedrock**

### Step 2: Check Model Access
1. In the left sidebar, click **Model access**
2. Look for these models:
   - ✅ **Claude 3 Haiku** - Should show "Access granted"
   - ✅ **Claude 3 Sonnet** - Should show "Access granted"

### Step 3: If Not Granted
1. Click **Manage model access** (top right)
2. Check the boxes for:
   - Anthropic → Claude 3 Haiku
   - Anthropic → Claude 3 Sonnet
3. Click **Request model access**
4. Wait 1-2 minutes for approval (usually instant)

---

## 🧪 Quick Test After Fixing

Run this in your terminal:

```bash
node test-bedrock-direct.mjs
```

You should see:
```
✅ SUCCESS! Bedrock is working!
👻 Ghost says: Boo! Friendly ghost!
```

If you see that, restart your dev server:
```bash
npm run dev
```

---

## 🚨 Most Common Issues

### Issue 1: Wrong Resource ARN in Policy
**Symptom**: "User is not authorized to perform: bedrock:InvokeModel"

**Fix**: 
- Go to IAM → Roles → HauntedReaderBedrockRole
- Edit the BedrockAccessPolicy
- Change Resource to: `"arn:aws:bedrock:*::foundation-model/*"`

### Issue 2: Role Not Attached to Identity Pool
**Symptom**: "AccessDeniedException" or "NotAuthorizedException"

**Fix**:
- Go to Cognito → Identity pools → HauntedReaderPool
- Edit identity pool
- Set Unauthenticated role to: HauntedReaderBedrockRole

### Issue 3: Bedrock Models Not Enabled
**Symptom**: "ResourceNotFoundException" or "Model not found"

**Fix**:
- Go to Bedrock → Model access
- Enable Claude 3 Haiku and Sonnet

### Issue 4: Wrong Identity Pool ID
**Symptom**: "IdentityPool not found"

**Fix**:
- Go to Cognito → Identity pools
- Copy the correct Identity Pool ID
- Update `.env` file
- Restart dev server

---

## 📸 Visual Checklist

### ✅ What Success Looks Like:

**IAM Role (HauntedReaderBedrockRole):**
- Has policy: BedrockAccessPolicy
- Resource: `arn:aws:bedrock:*::foundation-model/*`
- Trust relationship: cognito-identity.amazonaws.com

**Cognito Identity Pool (HauntedReaderPool):**
- ID: us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc
- Unauthenticated role: HauntedReaderBedrockRole
- Allow unauthenticated identities: ✅ Enabled

**Bedrock:**
- Claude 3 Haiku: ✅ Access granted
- Claude 3 Sonnet: ✅ Access granted

---

## 🆘 Still Not Working?

Run the diagnostic:
```bash
./test-aws-setup.sh
```

This will tell you exactly what's wrong.

Or share the error message and I'll help debug!
