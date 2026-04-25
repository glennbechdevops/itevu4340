# Chaos Engineering Lab: Building Antifragile Systems

## Overview

This hands-on lab teaches chaos engineering principles through practical experimentation. You will deploy a simple web application with a serverless backend, intentionally inject failures using ToxiProxy, observe how the system degrades, and then implement resilience patterns to make it antifragile.

This lab is divided into two parts:
- **Part 1:** Deploy the system, run chaos experiments, observe failures
- **Part 2:** Implement resilience patterns to make the system antifragile

By the end of this lab, you will understand:
- How distributed systems fail under stress
- The scientific method of chaos engineering
- Practical resilience patterns: retries, timeouts, circuit breakers
- How to build systems that improve from failure

## Architecture

```
[Web Browser]
     |
     | HTTP POST
     |
     v
[ToxiProxy] -----> [AWS Lambda Function URL]
                            |
                            | DynamoDB SDK
                            v
                   [DynamoDB Table]
```

The application is a simple "Chaos Clicker" where:
- Users click a button to increment their chaos score
- The webapp calls a Lambda function via HTTP
- Lambda stores the score in DynamoDB
- ToxiProxy sits between webapp and Lambda to inject network failures

## Prerequisites

- AWS Account with credentials configured
- Terraform installed (v1.0+)
- Go installed (1.21+) for Lambda development
- Docker Desktop running (for ToxiProxy)
- Modern web browser
- Text editor

## Lab Structure

This lab follows the chaos engineering cycle:

1. **Steady State**: Understand how the system works normally
2. **Hypothesis**: Predict how it will fail under stress
3. **Experiment**: Inject real-world failures
4. **Observation**: Measure the impact
5. **Improvement**: Implement resilience patterns
6. **Validation**: Verify the improvements

---

# Part 1: Chaos Engineering Experiments

In Part 1, you will deploy a deliberately fragile system, run chaos experiments, and observe how it fails.

## Step 1: Familiarize with the Code

### Explore the Lambda Function

Navigate to `lambda/` and examine `main.go`:

```bash
cd lambda
cat main.go
```

**Key observations:**
- The handler accepts POST requests with JSON payload
- It stores data in DynamoDB with `student_id` as partition key
- **Notice: No CORS headers are set** - this is intentional
- Simple error handling with basic logging

### Explore the Web Application

Navigate to `webapp/` and examine the code:

```bash
cd ../webapp
cat index.html
cat app.js
```

**Key observations:**
- Vanilla JavaScript, no frameworks
- Makes POST requests to Lambda function URL
- **No retry logic or error handling** - failures show immediately
- Displays score from DynamoDB

### Explore the Infrastructure

Navigate to `infra/` and examine the Terraform code:

```bash
cd ../infra
cat main.tf
cat variables.tf
cat outputs.tf
```

**Key observations:**
- Terraform module that requires `student_id` variable
- Creates DynamoDB table with on-demand billing
- Lambda function with Function URL enabled
- IAM role with DynamoDB permissions

## Step 2: Deploy Your Infrastructure

Create a deployment directory for your instance:

```bash
cd /Users/glennbech/dev/presenter/itevu4340
mkdir -p my-deployment
cd my-deployment
```

Create a `main.tf` file that uses the module:

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "chaos_clicker" {
  source = "../infra"

  student_id = "YOUR_NAME_HERE"  # Replace with your name (lowercase, no spaces)
}

output "lambda_function_url" {
  value = module.chaos_clicker.lambda_function_url
  description = "URL to call from webapp"
}

output "dynamodb_table_name" {
  value = module.chaos_clicker.dynamodb_table_name
}
```

Deploy the infrastructure:

```bash
terraform init
terraform plan
terraform apply
```

**Save the outputs** - you'll need the `lambda_function_url` for the webapp.

## Step 3: Test the Application (Without Chaos)

### Configure the Webapp

Open `webapp/app.js` and update the Lambda function URL:

```javascript
const LAMBDA_URL = 'YOUR_FUNCTION_URL_HERE';  // From terraform output
```

### Open the Webapp

Simply open `webapp/index.html` in your browser:

```bash
open webapp/index.html  # macOS
# or just double-click index.html
```

### Encounter the First Failure

Click the "Increment Score" button.

**What happens?**
- Open browser Developer Tools (F12) → Console tab
- You'll see a CORS error: `Access-Control-Allow-Origin header is missing`

**Why does this happen?**
- Browsers enforce same-origin policy for security
- The Lambda function doesn't send CORS headers
- This is our first chaos element - a configuration failure

**Document your observation:**
- What error message did you see?
- How does the webapp behave?
- What is the user experience?

This CORS error is part of the chaos - a configuration failure that's common in distributed systems. You'll address this in Part 2.

## Step 4: Hypothesize About Network Failures

Before injecting chaos, make predictions using the scientific method.

**Write down your hypothesis:**

1. **What will happen when we add 2000ms latency?**
   - How will the UI respond?
   - Will users click multiple times?
   - What will happen to DynamoDB (duplicate records)?

2. **What will happen when we add 50% packet loss?**
   - How many requests will fail?
   - Will the UI show errors?
   - What will users think is broken?

3. **What will happen when we add random timeouts?**
   - Will some requests succeed?
   - How will users know if their click worked?

**Save your hypotheses** - you'll compare them to actual results.

## Step 5: Configure ToxiProxy

ToxiProxy is a proxy that lets you inject network failures between your webapp and Lambda.

### Start ToxiProxy

```bash
cd webapp
docker-compose up -d
```

This starts:
- ToxiProxy server on port 8474 (control API)
- Proxy listening on port 8000 (forwards to Lambda)

### Configure the Proxy

Update `webapp/app.js` to use ToxiProxy instead of direct Lambda URL:

```javascript
const LAMBDA_URL = 'http://localhost:8000';  // Through ToxiProxy
```

### Add Latency Toxic

Use ToxiProxy CLI or HTTP API to add latency:

```bash
# Add 2000ms latency
docker exec -it toxiproxy /bin/sh -c "toxiproxy-cli toxic add chaos-proxy -t latency -a latency=2000"
```

Or use curl:

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{"name": "latency", "type": "latency", "attributes": {"latency": 2000}}'
```

### Available Toxics

ToxiProxy supports many failure modes:

**Latency:** Add delay to requests
```bash
{"type": "latency", "attributes": {"latency": 2000, "jitter": 500}}
```

**Bandwidth:** Limit throughput
```bash
{"type": "bandwidth", "attributes": {"rate": 1024}}
```

**Timeout:** Close connection after delay
```bash
{"type": "timeout", "attributes": {"timeout": 1000}}
```

**Slicer:** Slice data into small packets
```bash
{"type": "slicer", "attributes": {"average_size": 64, "size_variation": 32, "delay": 10}}
```

## Step 6: Run Experiments and Observe

### Experiment 1: High Latency

**Setup:** 2000ms latency, 500ms jitter

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{"name": "high-latency", "type": "latency", "attributes": {"latency": 2000, "jitter": 500}}'
```

**Test:**
1. Click "Increment Score" button
2. Observe the delay
3. Click multiple times before first response returns
4. Check DynamoDB for duplicate records

**Measure:**
- How long does each request take?
- Do users get frustrated and click again?
- Are there duplicate records in the database?
- Does the UI give any feedback during the wait?

### Experiment 2: Random Failures

**Setup:** 5000ms timeout

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{"name": "timeout", "type": "timeout", "attributes": {"timeout": 5000}}'
```

**Test:**
1. Click button multiple times
2. Some requests will timeout
3. Others will succeed

**Measure:**
- What is the failure rate?
- How does the UI show failures?
- Can users tell if their click worked?

### Experiment 3: Limited Bandwidth

**Setup:** 1KB/s bandwidth limit

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{"name": "slow-bandwidth", "type": "bandwidth", "attributes": {"rate": 1024}}'
```

**Test:**
1. Make requests and observe slow responses
2. Multiple concurrent requests

**Measure:**
- How does slow bandwidth affect user experience?
- Do requests queue up?

### Reset Between Experiments

Remove all toxics to reset:

```bash
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/high-latency
```

## Step 7: Reflect and Document Your Findings

Compare your hypothesis to actual observations:

**Analysis Questions:**

1. **What was the worst user experience?**
   - Long waits with no feedback?
   - Silent failures?
   - Duplicate actions?
   - CORS errors?

2. **What resilience patterns would help?**
   - Retries for transient failures?
   - Timeouts to fail fast?
   - Optimistic UI updates?
   - Circuit breaker to prevent cascading failures?
   - CORS configuration?

3. **What should the steady state be?**
   - Response time < 500ms for 99% of requests?
   - No duplicate records?
   - Clear error messages?
   - Successful CORS handling?

**Document your findings:**

Create a brief report with:
- Hypothesis for each experiment
- Actual observed behavior
- Screenshots or logs showing failures
- List of proposed improvements

Save your findings - you'll implement improvements in Part 2.

---

# Part 2: Implementing Resilience

Part 2 instructions will be provided separately. In Part 2, you will:

1. Fix the CORS configuration issue
2. Implement request timeouts
3. Add retry logic with exponential backoff
4. Implement a circuit breaker pattern
5. Add loading states and error messages
6. Validate improvements under chaos

For reference implementations, see `solutions/webapp-resilient/`

---

## Cleanup


When you're done, destroy the infrastructure to avoid charges:

```bash
cd my-deployment
terraform destroy
```

Stop ToxiProxy:

```bash
cd ../webapp
docker-compose down
```

## Conclusion

You've completed a full chaos engineering cycle:

1. Built a distributed system
2. Established steady state behavior
3. Hypothesized about failure modes
4. Injected real-world failures
5. Observed degradation
6. Implemented resilience patterns
7. Validated improvements

**Key Learnings:**

- Distributed systems fail in complex ways
- Latency is a common failure mode that cascades
- User experience degrades without proper error handling
- Resilience patterns (retries, timeouts, circuit breakers) are essential
- Chaos engineering helps you find weaknesses before users do
- Antifragile systems improve from stress and failure

## Additional Challenges

1. **Add CloudWatch Alarms** - Alert when Lambda errors exceed threshold
2. **Implement Request Deduplication** - Use idempotency keys
3. **Add Caching** - Store scores locally, sync periodically
4. **Multi-Region** - Deploy to two regions for higher availability
5. **Chaos in Production** - Gradually roll out chaos to real users (with safeguards!)

## References

- [Principles of Chaos Engineering](https://principlesofchaos.org/)
- [ToxiProxy Documentation](https://github.com/Shopify/toxiproxy)
- [AWS Lambda Function URLs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
