# Instructor Notes - Chaos Coffee Lab

## Lab Overview

This is a complete chaos engineering lab for teaching students about building antifragile systems. Students will deploy a deliberately fragile coffee shop web application, inject network failures, observe degradation, and implement resilience patterns.

## Key Teaching Objectives

1. **Chaos Engineering Method** - Hypothesis → Experiment → Observe → Improve
2. **Real Failure Modes** - CORS, latency, timeouts, network partitions
3. **Resilience Patterns** - Retries, circuit breakers, timeouts, error handling
4. **Observability** - Browser DevTools, CloudWatch, DynamoDB Console
5. **Infrastructure as Code** - Terraform module design and reusability

## What's Intentionally Broken

Students will discover these failures:

### 1. CORS Configuration Failure
- Lambda doesn't send CORS headers
- Terraform doesn't configure CORS on Function URL
- Students encounter browser security error immediately
- **Teaching moment:** Common serverless mistake, browser security model

### 2. No Error Handling
- Webapp has zero error handling
- Silent failures confuse users
- **Teaching moment:** User experience degradation

### 3. No Timeouts
- Requests can hang indefinitely
- Poor UX, wasted resources
- **Teaching moment:** Fail fast principle

### 4. No Retry Logic
- Transient failures cause immediate failure
- **Teaching moment:** Network is unreliable

### 5. No Circuit Breaker
- Keeps trying when service is down
- Cascading failures
- **Teaching moment:** Preventing resource exhaustion

## Lab Timeline (Recommended 2-3 hours)

### Part 1: Deployment and Chaos (1.5 hours)

- **0:00-0:10** - Introduction to chaos engineering
- **0:10-0:25** - Deploy infrastructure (guided walkthrough)
- **0:25-0:35** - Test webapp, encounter CORS (first failure)
- **0:35-0:45** - Write hypotheses about network failures
- **0:45-1:05** - Run ToxiProxy experiments (3-4 scenarios)
- **1:05-1:20** - Group reflection and discussion
- **1:20-1:30** - Introduce resilience patterns

### Part 2: Implementation (1.5 hours or homework)

- **0:00-0:15** - Review solutions, explain patterns
- **0:15-0:45** - Students implement resilience (or pair programming)
- **0:45-1:15** - Test resilient version under chaos
- **1:15-1:30** - Compare before/after, wrap-up

## Prerequisites

Students should have:
- AWS account with credentials
- Basic JavaScript knowledge
- Basic understanding of HTTP/REST
- Familiarity with command line

Installed on their machine OR use devcontainer:
- Terraform
- AWS CLI configured
- Go 1.21+
- Docker Desktop
- Web browser with DevTools

## Setup Checklist for Instructors

### Before Class

- [ ] Test the entire lab yourself (build, deploy, chaos, cleanup)
- [ ] Verify AWS credentials work
- [ ] Ensure students have AWS accounts
- [ ] Share the repository link
- [ ] Prepare slides from part1.md, part2.md, part3.md
- [ ] Test ToxiProxy docker-compose setup
- [ ] Verify devcontainer works (if using Codespaces)

### During Class

- [ ] Quick poll: Who has AWS credentials configured?
- [ ] Who has Terraform/Docker installed?
- [ ] Offer devcontainer/Codespaces option
- [ ] Walk through QUICKSTART.md together
- [ ] First failure together (CORS) - teach browser security
- [ ] Students work in pairs on experiments
- [ ] Group reflection after each major experiment
- [ ] Show solutions but encourage independent implementation

### After Class

- [ ] Remind students to run `terraform destroy`
- [ ] Collect feedback
- [ ] Share additional resources
- [ ] Review Part 2 homework (if assigned)

## Common Student Questions

### "Why doesn't it work?" (CORS error)

**Answer:** This is intentional! CORS errors are one of the most common issues in serverless applications. The Lambda function doesn't send the required headers, and you'll fix this in Part 2.

**Teaching moment:** Browser same-origin policy, security model, how CORS works.

### "Can I just use a CORS proxy?"

**Answer:** For this lab, we want you to understand the root cause. In Part 2, you'll configure CORS properly in the Lambda response.

### "Why use ToxiProxy instead of just breaking Lambda?"

**Answer:** ToxiProxy lets us inject realistic network failures (latency, packet loss) that happen in production. It's more realistic than just turning off the Lambda.

### "Why Go for Lambda?"

**Answer:** Go compiles to a single binary, starts fast, and demonstrates cross-platform builds. Plus, it's a good learning opportunity!

### "Can we use API Gateway instead of Function URL?"

**Answer:** Sure! In Part 2 or as an extension, you could refactor to use API Gateway. Compare the trade-offs.

## Grading Rubric (If Applicable)

### Part 1: Chaos Experiments (40 points)

- [ ] Infrastructure deployed successfully (10 pts)
- [ ] Documented 3+ chaos experiments (15 pts)
- [ ] Hypothesis vs. actual observations (10 pts)
- [ ] Screenshots/logs showing failures (5 pts)

### Part 2: Resilience Implementation (60 points)

- [ ] CORS fixed (10 pts)
- [ ] Request timeout implemented (10 pts)
- [ ] Retry with backoff implemented (15 pts)
- [ ] Circuit breaker implemented (15 pts)
- [ ] Error messages and loading states (10 pts)

**Bonus:**
- Request deduplication (+5 pts)
- CloudWatch alarms (+5 pts)
- Creative chaos experiment (+5 pts)

## Extension Activities

For advanced students:

1. **Multi-region deployment** - Deploy to 2 regions with Route53 failover
2. **Metrics and monitoring** - Add CloudWatch dashboards and alarms
3. **Request deduplication** - Implement idempotency keys
4. **API Gateway migration** - Replace Function URL with API Gateway + CORS
5. **Canary deployments** - Use Lambda versions and aliases
6. **Custom toxics** - Write custom ToxiProxy toxic in Go
7. **Chaos in production** - Gradual rollout with feature flags

## Resources to Share

### Documentation
- AWS Lambda: https://docs.aws.amazon.com/lambda/
- ToxiProxy: https://github.com/Shopify/toxiproxy
- Terraform: https://www.terraform.io/docs

### Reading
- "Release It!" by Michael Nygard
- "Site Reliability Engineering" by Google
- Chaos Engineering principles: https://principlesofchaos.org/

### Videos
- AWS re:Invent chaos engineering talks
- Netflix Chaos Monkey presentations
- GOTO conferences on resilience

## Troubleshooting Guide

### Students can't deploy

1. Check AWS credentials: `aws sts get-caller-identity`
2. Check function.zip exists: `ls -lh lambda/function.zip`
3. Check Terraform version: `terraform version`
4. Try: `terraform init -upgrade`

### Lambda not responding

1. Check CloudWatch Logs
2. Verify IAM permissions
3. Check DynamoDB table exists
4. Test Lambda in AWS Console

### ToxiProxy not working

1. Check Docker running: `docker ps`
2. Check logs: `docker-compose logs`
3. Verify config: `cat toxiproxy-config.json`
4. Restart: `docker-compose down && docker-compose up -d`

### CORS still broken after fix

1. Clear browser cache
2. Hard refresh (Cmd/Ctrl + Shift + R)
3. Check Lambda response headers in Network tab
4. Verify Lambda code was redeployed

## Success Metrics

Students successfully completed the lab if they can:

1. Explain the chaos engineering cycle
2. Identify 3+ failure modes they observed
3. Implement at least 2 resilience patterns
4. Demonstrate improved behavior under chaos
5. Articulate trade-offs of different patterns

## Feedback Collection

Ask students:

1. What was the most surprising failure mode?
2. Which resilience pattern was hardest to implement?
3. How would you apply this to your own projects?
4. What other chaos experiments would you try?
5. What would you change about the lab?

## Next Steps for Students

After completing the lab:

1. Apply chaos to a personal project
2. Read "Release It!" book
3. Try Chaos Toolkit or LitmusChaos
4. Explore AWS Fault Injection Simulator
5. Practice chaos in production (safely!)

## Contact

For questions or feedback about this lab:
- Create an issue in the repository
- Share your chaos engineering stories!

Good luck and happy chaos engineering!
