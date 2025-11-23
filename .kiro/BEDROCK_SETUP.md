# Amazon Bedrock Setup Guide

## Why Bedrock for The Haunted Reader?

Amazon Bedrock provides:
- ✅ **No API keys to manage** - Uses AWS IAM
- ✅ **Multiple models** - Claude 3, Titan, Llama 2
- ✅ **AWS ecosystem** - Integrates with your S3/CloudFront deployment
- ✅ **Pay-per-use** - No upfront costs
- ✅ **Better security** - Temporary credentials via Cognito
- ✅ **Hackathon-friendly** - Shows AWS expertise

## Prerequisites

1. AWS Account with Bedrock access
2. Enable Bedrock models in your AWS region

## Step 1: Enable Bedrock Models

### Via AWS Console:
1. Go to Amazon Bedrock console
2. Navigate to "Model access" in left sidebar
3. Click "Manage model access"
4. Enable these models:
   - ✅ **Claude 3 Sonnet** (anthropic.claude-3-sonnet-20240229-v1:0)
   - ✅ **Claude 3 Haiku** (anthropic.claude-3-haiku-20240307-v1:0) - Faster/cheaper
   - ✅ **Amazon Titan Text Express** (amazon.titan-text-express-v1) - Optional
5. Click "Save changes"

**Note**: Model access approval is usually instant, but can take up to 24 hours.

### Via AWS CLI:
```bash
# Check available models
aws bedrock list-foundation-models --region us-east-1

# Request access (done via console)
```

## Step 2: Choose Your Architecture

### Option A: Client-Side with Cognito (Recommended for Hackathon)

**Pros:**
- No backend needed
- Simpler setup
- Faster development
- Good for demo

**Cons:**
- Credentials visible in browser (temporary only)
- Harder to implement rate limiting
- Users need AWS region access

**Setup:**

1. **Create Cognito Identity Pool**

```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name HauntedReaderPool \
  --allow-unauthenticated-identities \
  --region us-east-1
```

Save the `IdentityPoolId` from the response.

2. **Create IAM Role for Unauthenticated Users**

Create `cognito-role-policy.json`:

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
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }
  ]
}
```

Create the role:

```bash
aws iam create-role \
  --role-name HauntedReaderCognitoRole \
  --assume-role-policy-document file://trust-policy.json

aws iam put-role-policy \
  --role-name HauntedReaderCognitoRole \
  --policy-name BedrockAccess \
  --policy-document file://cognito-role-policy.json
```

3. **Attach Role to Identity Pool**

```bash
aws cognito-identity set-identity-pool-roles \
  --identity-pool-id us-east-1:xxxx-xxxx-xxxx \
  --roles unauthenticated=arn:aws:iam::ACCOUNT_ID:role/HauntedReaderCognitoRole
```

4. **Configure in Your App**

Create `.env`:

```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxx-xxxx-xxxx
```

---

### Option B: API Gateway + Lambda (Production-Ready)

**Pros:**
- Credentials stay server-side
- Better security
- Easy rate limiting
- More control

**Cons:**
- More complex setup
- Additional AWS services
- Slightly higher latency

**Setup:**

1. **Create Lambda Function**

Create `lambda/bedrock-proxy.js`:

```javascript
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const { prompt, modelId, maxTokens, temperature } = JSON.parse(event.body);
    
    const command = new InvokeModelCommand({
      modelId: modelId || "anthropic.claude-3-sonnet-20240229-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens || 2000,
        temperature: temperature || 0.7,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

2. **Deploy Lambda**

```bash
# Package dependencies
cd lambda
npm install @aws-sdk/client-bedrock-runtime
zip -r function.zip .

# Create function
aws lambda create-function \
  --function-name haunted-reader-bedrock \
  --runtime nodejs20.x \
  --role arn:aws:iam::ACCOUNT_ID:role/LambdaBedrockRole \
  --handler bedrock-proxy.handler \
  --zip-file fileb://function.zip \
  --timeout 30 \
  --memory-size 512
```

3. **Create API Gateway**

```bash
# Create REST API
aws apigateway create-rest-api \
  --name haunted-reader-api \
  --description "Bedrock proxy for Haunted Reader"

# Create resource and method
# (Use console for easier setup)
```

4. **Configure in Your App**

```bash
VITE_API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
```

---

## Step 3: Install Dependencies

```bash
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers
```

## Step 4: Implement Bedrock Provider

Create `src/services/aiProviders/bedrockProvider.js`:

```javascript
import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

class BedrockProvider {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: import.meta.env.VITE_AWS_REGION }),
        identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID
      })
    });
  }

  async generate(prompt, options = {}) {
    const {
      modelId = "anthropic.claude-3-sonnet-20240229-v1:0",
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = ""
    } = options;

    const body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body)
    });

    const response = await this.client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    return result.content[0].text;
  }

  async generateStreaming(prompt, onChunk, options = {}) {
    const {
      modelId = "anthropic.claude-3-sonnet-20240229-v1:0",
      maxTokens = 2000,
      temperature = 0.7,
      systemPrompt = ""
    } = options;

    const body = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const command = new InvokeModelWithResponseStreamCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(body)
    });

    const response = await this.client.send(command);
    
    let fullText = "";
    for await (const event of response.body) {
      if (event.chunk) {
        const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
        if (chunk.type === "content_block_delta") {
          const text = chunk.delta.text;
          fullText += text;
          onChunk(text, fullText);
        }
      }
    }
    
    return fullText;
  }

  estimateTokens(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export default BedrockProvider;
```

## Step 5: Model Selection

Create `src/services/aiProviders/bedrockModels.js`:

```javascript
export const BEDROCK_MODELS = {
  // Claude 3 Sonnet - Best for creative writing, balanced performance
  CLAUDE_SONNET: "anthropic.claude-3-sonnet-20240229-v1:0",
  
  // Claude 3 Haiku - Fastest, most cost-effective
  CLAUDE_HAIKU: "anthropic.claude-3-haiku-20240307-v1:0",
  
  // Amazon Titan - AWS native, good for summaries
  TITAN_EXPRESS: "amazon.titan-text-express-v1",
};

export const MODEL_CONFIGS = {
  [BEDROCK_MODELS.CLAUDE_SONNET]: {
    name: "Claude 3 Sonnet",
    maxTokens: 4096,
    costPer1kTokens: 0.003, // Input: $3/1M tokens
    bestFor: "Creative writing, style transformation"
  },
  [BEDROCK_MODELS.CLAUDE_HAIKU]: {
    name: "Claude 3 Haiku",
    maxTokens: 4096,
    costPer1kTokens: 0.00025, // Input: $0.25/1M tokens
    bestFor: "Fast summaries, quick interpretations"
  },
  [BEDROCK_MODELS.TITAN_EXPRESS]: {
    name: "Amazon Titan Text Express",
    maxTokens: 8192,
    costPer1kTokens: 0.0002, // Input: $0.20/1M tokens
    bestFor: "Summaries, analysis"
  }
};

// Recommended model per task type
export const TASK_MODELS = {
  summary: BEDROCK_MODELS.CLAUDE_HAIKU,      // Fast, cheap
  rewrite: BEDROCK_MODELS.CLAUDE_SONNET,     // Best quality
  ending: BEDROCK_MODELS.CLAUDE_SONNET,      // Creative
  analysis: BEDROCK_MODELS.CLAUDE_HAIKU      // Fast analysis
};
```

## Step 6: Update AI Service

Create `src/services/aiService.js`:

```javascript
import BedrockProvider from './aiProviders/bedrockProvider';
import { TASK_MODELS } from './aiProviders/bedrockModels';

class AIService {
  constructor() {
    this.provider = new BedrockProvider();
  }

  async generate(prompt, taskType = 'rewrite', options = {}) {
    const modelId = options.modelId || TASK_MODELS[taskType];
    
    try {
      return await this.provider.generate(prompt, {
        ...options,
        modelId
      });
    } catch (error) {
      console.error('AI generation error:', error);
      throw this.handleError(error);
    }
  }

  async generateStreaming(prompt, onChunk, taskType = 'rewrite', options = {}) {
    const modelId = options.modelId || TASK_MODELS[taskType];
    
    return await this.provider.generateStreaming(prompt, onChunk, {
      ...options,
      modelId
    });
  }

  estimateTokens(text) {
    return this.provider.estimateTokens(text);
  }

  handleError(error) {
    if (error.name === 'ThrottlingException') {
      return new Error('The spirits are overwhelmed! Please wait a moment and try again.');
    }
    if (error.name === 'ValidationException') {
      return new Error('The text is too long for the spirits to process. Try a shorter passage.');
    }
    if (error.name === 'AccessDeniedException') {
      return new Error('Unable to reach the spirit realm. Check your AWS configuration.');
    }
    return new Error('The spirits are restless... try again.');
  }
}

export default new AIService();
```

## Cost Estimation

For a hackathon demo with moderate usage:

### Claude 3 Haiku (Recommended for demos):
- Input: $0.25 per 1M tokens
- Output: $1.25 per 1M tokens
- **Estimate**: ~$0.50-2 for entire hackathon

### Claude 3 Sonnet (Best quality):
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- **Estimate**: ~$5-10 for entire hackathon

**Tip**: Use Haiku for development/testing, Sonnet for final demo.

## Testing Bedrock Connection

Create a test script `test-bedrock.js`:

```javascript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "us-east-1" }),
    identityPoolId: "us-east-1:YOUR-POOL-ID"
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
  console.error("❌ Bedrock error:", error);
}
```

Run: `node test-bedrock.js`

## Troubleshooting

### Error: "Could not resolve model"
- Ensure model access is enabled in Bedrock console
- Check model ID spelling
- Verify region supports the model

### Error: "AccessDeniedException"
- Check IAM role has `bedrock:InvokeModel` permission
- Verify Cognito Identity Pool is configured correctly
- Ensure role is attached to identity pool

### Error: "ThrottlingException"
- Implement exponential backoff
- Use Haiku model for higher rate limits
- Consider Lambda proxy for better control

### Error: "ValidationException: Input is too long"
- Reduce text length
- Implement text truncation
- Split into smaller chunks

## Advantages for Hackathon Judges

Using Bedrock shows:
- ✅ **AWS expertise** - Native AWS service integration
- ✅ **Security awareness** - IAM-based authentication
- ✅ **Cost optimization** - Model selection based on task
- ✅ **Scalability** - Managed service, no infrastructure
- ✅ **Innovation** - Using cutting-edge AWS AI services

Perfect for the Kiroween hackathon! 🎃👻
