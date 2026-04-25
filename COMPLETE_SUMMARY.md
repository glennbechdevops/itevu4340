# Chaos Engineering Lab - Complete Summary

## What We've Built

A complete, production-ready chaos engineering lab for teaching students about building antifragile systems. The webapp looks professional with React and Framer Motion, but is intentionally fragile under the hood for educational purposes.

## Project Components

### 1. Modern React Webapp ✨
- **Framework:** React 18 with Vite
- **Animations:** Framer Motion for smooth UX
- **Styling:** Professional CSS with Inter font
- **Features:**
  - 6 premium coffee products
  - Animated cart with slide-in panel
  - Beautiful product cards with hover effects
  - Smooth page transitions
  - **Intentionally fragile checkout** (no retries, timeouts, or error handling)

### 2. Go Lambda Function
- Serverless order processor
- DynamoDB integration
- Function URL (no API Gateway)
- **No CORS headers** (intentional teaching moment)
- CloudWatch logging

### 3. Terraform Infrastructure Module
- Reusable module with `student_id` variable
- Creates Lambda + DynamoDB + IAM
- Example deployment configuration
- Multiple students can deploy independently

### 4. ToxiProxy Setup
- Docker Compose configuration
- Ready-to-use toxics for:
  - Latency injection
  - Bandwidth limiting
  - Timeouts
  - Packet slicing

### 5. Solutions Reference
- Resilient webapp implementation
- Circuit breaker pattern
- Retry with exponential backoff
- Request timeout
- Error handling and loading states

### 6. Dev Container
- VS Code dev container with all tools
- Terraform, AWS CLI, Go, Docker, Node.js
- Claude Code pre-installed
- Works with GitHub Codespaces

## File Count

24 files created including:
- 8 React components and configuration files
- 4 Terraform files
- 4 Go Lambda files
- 8 Documentation files

## Quick Start for Students

```bash
# 1. Install dependencies
cd webapp
npm install

# 2. Build Lambda
cd ../lambda
make package

# 3. Deploy infrastructure
mkdir my-deployment
cd my-deployment
# Create main.tf with your student_id
terraform init
terraform apply

# 4. Configure webapp
# Update webapp/src/config.js with Lambda URL

# 5. Run webapp
cd ../webapp
npm run dev

# 6. Start ToxiProxy
docker-compose up -d

# 7. Run chaos experiments!
```

## What Students Will Learn

### Part 1: Chaos Experiments
1. Deploy a beautiful-looking but fragile system
2. Encounter CORS errors (aha moment!)
3. Inject network chaos with ToxiProxy
4. Observe system degradation
5. Document failures

### Part 2: Build Resilience
1. Fix CORS configuration
2. Implement request timeout
3. Add retry with exponential backoff
4. Build circuit breaker
5. Add error messages and loading states
6. Validate improvements

## Key Teaching Moments

1. **Professional UX matters** - Even demo apps should look good
2. **CORS is tricky** - Common serverless mistake
3. **Latency compounds** - 2s delay = frustrated users clicking multiple times
4. **Timeouts prevent hangs** - Fail fast is better than waiting forever
5. **Circuit breakers save resources** - Stop trying when service is down
6. **Observability is key** - Browser DevTools + CloudWatch + DynamoDB

## Technologies Demonstrated

- React 18 & Hooks
- Framer Motion animations
- Vite for fast builds
- AWS Lambda (Go)
- DynamoDB
- Terraform modules
- Docker & ToxiProxy
- Infrastructure as Code
- Chaos Engineering principles

## What Makes This Special

- **Professional design** - Students engage more with beautiful UIs
- **Modern stack** - React, Vite, Framer Motion (relevant to industry)
- **Real chaos** - ToxiProxy injects realistic network failures
- **Complete IaC** - Terraform module for multi-student deployments
- **DevContainer ready** - Works in GitHub Codespaces
- **Well documented** - 8 README files covering every aspect

## Cost Estimate

Per student for 2-3 hour lab:
- Lambda: Free tier (< 100 requests)
- DynamoDB: ~$0.00 (on-demand, minimal data)
- CloudWatch: ~$0.00 (7-day logs)

**Total: < $0.01 per student** (if cleaned up after)

## Next Steps

The lab is complete and ready for Monday's class!

Students will:
1. Be impressed by the professional UI
2. Deploy their own isolated infrastructure
3. Experience real chaos engineering
4. Learn resilience patterns hands-on
5. Have fun breaking and fixing things

Good luck with your class!

