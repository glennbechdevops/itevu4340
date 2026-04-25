# Chaos Coffee - Project Structure

This document describes the complete structure of the chaos engineering lab.

## Project Overview

```
itevu4340/
├── README.md                           # Main lab instructions (Part 1 & 2)
├── PROJECT_STRUCTURE.md                # This file
│
├── part1.md                            # Presentation slides (Robust Architectures)
├── part2.md                            # Presentation slides (Antifragile)
├── part3.md                            # Presentation slides (AI & Architecture)
│
├── webapp/                             # Coffee shop web application (FRAGILE)
│   ├── index.html                      # HTML structure
│   ├── app.js                          # Application logic (no resilience)
│   ├── styles.css                      # Styling
│   ├── docker-compose.yml              # ToxiProxy container setup
│   ├── toxiproxy-config.json           # Proxy configuration
│   └── README.md                       # Webapp documentation
│
├── lambda/                             # Go Lambda function
│   ├── main.go                         # Handler (NO CORS headers)
│   ├── go.mod                          # Go dependencies
│   ├── Makefile                        # Build commands
│   └── README.md                       # Lambda documentation
│
├── infra/                              # Terraform module
│   ├── main.tf                         # Lambda + DynamoDB resources
│   ├── variables.tf                    # Input variables (student_id required)
│   ├── outputs.tf                      # Output values
│   └── README.md                       # Infrastructure documentation
│
└── solutions/                          # Reference implementations
    └── webapp-resilient/               # Resilient webapp with all patterns
        ├── app-resilient.js            # Resilient version with circuit breaker, retry, etc.
        └── README.md                   # Pattern explanations
```

## Component Descriptions

### Webapp (Intentionally Fragile)

**Purpose:** Coffee bean e-commerce site that demonstrates how systems fail

**Features:**
- 6 premium coffee products with cart
- Checkout sends order to Lambda
- NO error handling
- NO retry logic
- NO timeouts
- NO loading states

**Intentional Weaknesses:**
- CORS errors (Lambda doesn't send headers)
- No request timeout (hangs indefinitely)
- No retry on failures
- No circuit breaker
- Silent failures
- Duplicate orders on slow networks

### Lambda Function (Go)

**Purpose:** Order processor that stores data in DynamoDB

**Key Characteristics:**
- Function URL (no API Gateway)
- NO CORS headers (intentional)
- Stores orders in DynamoDB with student_id partition key
- Simple error handling
- CloudWatch logging

**Data Model:**
```
PK: student_id
SK: ORDER#<uuid>
```

### Infrastructure (Terraform Module)

**Purpose:** Reusable module for student deployments

**Key Features:**
- Requires `student_id` variable (no default)
- Creates isolated resources per student
- DynamoDB on-demand billing
- Lambda with 128MB, 10s timeout
- IAM roles with least privilege
- CloudWatch Logs (7-day retention)

**Outputs:**
- Lambda Function URL
- DynamoDB table name
- CloudWatch log group
- Instructions for next steps

### ToxiProxy Setup

**Purpose:** Inject network chaos between webapp and Lambda

**Available Toxics:**
- Latency (add delay and jitter)
- Timeout (close connections)
- Bandwidth limiting
- Packet slicing
- And more...

**Configuration:**
- Runs in Docker
- API on port 8474
- Proxy on port 8000
- JSON config for Lambda upstream

### Solutions (Reference Implementations)

**Purpose:** Show resilience patterns for Part 2

**Patterns Implemented:**
1. Request timeout (5 seconds using AbortController)
2. Retry with exponential backoff (3 attempts: 1s, 2s, 4s)
3. Circuit breaker (3 failures opens, 60s timeout)
4. Loading states and error messages
5. Optimistic rollback on failure
6. Console logging for observability

## Lab Flow

### Part 1: Chaos Experiments

1. **Deploy** - Terraform creates Lambda + DynamoDB
2. **Test** - Encounter CORS errors (aha moment!)
3. **Hypothesize** - Predict behavior under latency/failures
4. **Configure** - Set up ToxiProxy
5. **Experiment** - Inject latency, timeouts, bandwidth limits
6. **Observe** - Measure failures, duplicate orders, poor UX
7. **Reflect** - Document findings and design improvements

### Part 2: Build Resilience (Instructions TBD)

1. Fix CORS configuration
2. Implement timeout pattern
3. Add retry with backoff
4. Build circuit breaker
5. Add loading states
6. Validate under chaos

## File Purposes

### Documentation Files

- `README.md` - Main lab guide with step-by-step instructions
- `webapp/README.md` - Webapp setup and ToxiProxy usage
- `lambda/README.md` - Lambda details and data model
- `infra/README.md` - Terraform module documentation
- `solutions/webapp-resilient/README.md` - Pattern explanations

### Code Files

- `webapp/index.html` - Coffee shop UI
- `webapp/app.js` - Fragile checkout logic
- `webapp/styles.css` - Styling
- `lambda/main.go` - Order processor
- `infra/*.tf` - Infrastructure as code

### Configuration Files

- `lambda/go.mod` - Go dependencies
- `lambda/Makefile` - Build automation
- `webapp/docker-compose.yml` - ToxiProxy container
- `webapp/toxiproxy-config.json` - Proxy settings

## Student Workflow

### Setup (5-10 minutes)

```bash
# 1. Build Lambda
cd lambda
make package

# 2. Deploy infrastructure
cd ../
mkdir my-deployment
cd my-deployment
# Create main.tf with student_id
terraform init
terraform apply

# 3. Configure webapp
cd ../webapp
# Update app.js with Lambda URL

# 4. Start ToxiProxy
# Update toxiproxy-config.json with Lambda URL
docker-compose up -d
```

### Experiments (20-30 minutes)

```bash
# Run each experiment:
# 1. Add toxic via curl
# 2. Test checkout in browser
# 3. Observe failures
# 4. Document findings
# 5. Remove toxic
# 6. Repeat
```

### Cleanup (2 minutes)

```bash
# Stop ToxiProxy
cd webapp
docker-compose down

# Destroy infrastructure
cd my-deployment
terraform destroy
```

## Teaching Points

### Configuration Failures
- CORS is a common mistake in serverless
- Browser security model
- Infrastructure vs. application concerns

### Network Chaos
- Latency causes duplicate actions
- Timeouts without retries fail
- No feedback = confused users

### Resilience Patterns
- Circuit breakers prevent cascades
- Exponential backoff prevents thundering herd
- Timeouts fail fast
- Loading states improve UX

### Observability
- Browser console shows client view
- CloudWatch shows Lambda view
- DynamoDB shows data consistency

## Next Steps

After completing Part 1, students should have:

1. A working understanding of chaos engineering
2. Documentation of observed failures
3. Hypotheses about what resilience patterns would help
4. Experience with ToxiProxy
5. Appreciation for how systems fail

Part 2 will guide them through implementing each resilience pattern.

## Additional Resources

- ToxiProxy: https://github.com/Shopify/toxiproxy
- Chaos Engineering: https://principlesofchaos.org/
- Circuit Breaker: https://martinfowler.com/bliki/CircuitBreaker.html
- AWS Lambda Function URLs: https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html
