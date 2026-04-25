# Quick Start Guide

For instructors and students who want to get started quickly.

## Prerequisites Check

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Terraform
terraform version

# Check Go
go version

# Check Docker
docker --version
docker ps
```

## 5-Minute Setup

### 1. Build Lambda Function

```bash
cd lambda
make package
cd ..
```

You should see `lambda/function.zip` created.

### 2. Create Your Deployment

```bash
mkdir my-deployment
cd my-deployment
```

Create `main.tf`:

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

module "chaos_coffee" {
  source = "../infra"

  student_id = "alice"  # CHANGE THIS to your name
}

output "lambda_function_url" {
  value = module.chaos_coffee.lambda_function_url
}

output "instructions" {
  value = module.chaos_coffee.instructions
}
```

### 3. Deploy

```bash
terraform init
terraform apply
```

Copy the `lambda_function_url` from the output.

### 4. Configure Webapp

Edit `webapp/app.js`:

```javascript
const LAMBDA_URL = 'PASTE_YOUR_LAMBDA_URL_HERE';
```

Edit `webapp/toxiproxy-config.json`:

```json
[
  {
    "name": "chaos-proxy",
    "listen": "0.0.0.0:8000",
    "upstream": "PASTE_YOUR_LAMBDA_URL_HERE",
    "enabled": true
  }
]
```

### 5. Start ToxiProxy

```bash
cd ../webapp
docker-compose up -d
```

### 6. Open Webapp

```bash
open index.html
```

## First Test

1. Open browser DevTools (F12)
2. Go to Console tab
3. Add items to cart
4. Click Checkout
5. See CORS error (expected!)

## First Chaos Experiment

### Add 2-second latency:

```bash
curl -X POST http://localhost:8474/proxies/chaos-proxy/toxics \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "latency-test",
    "type": "latency",
    "attributes": {"latency": 2000}
  }'
```

Update `webapp/app.js` to use ToxiProxy:

```javascript
const LAMBDA_URL = 'http://localhost:8000';
```

Refresh page, try checkout, observe the delay!

### Remove latency:

```bash
curl -X DELETE http://localhost:8474/proxies/chaos-proxy/toxics/latency-test
```

## Cleanup

```bash
# Stop ToxiProxy
cd webapp
docker-compose down

# Destroy infrastructure
cd ../my-deployment
terraform destroy
```

## Troubleshooting

### Lambda URL not working

Check Terraform output:
```bash
terraform output lambda_function_url
```

### CORS errors (Expected!)

This is intentional for Part 1 of the lab. You'll fix it in Part 2.

### ToxiProxy not starting

```bash
docker-compose logs
docker-compose down
docker-compose up -d
```

### Lambda not responding

Check CloudWatch Logs:
```bash
aws logs tail /aws/lambda/chaos-coffee-alice --follow
```

### Terraform errors

Check you built the Lambda:
```bash
ls -lh lambda/function.zip
```

## Common Student Issues

1. **Forgot to change student_id** - Each student needs unique ID
2. **Didn't update Lambda URL** - Update both app.js and toxiproxy-config.json
3. **Docker not running** - Start Docker Desktop first
4. **AWS credentials expired** - Refresh credentials

## Teaching Tips

1. **Start with CORS failure** - Great teachable moment about browser security
2. **Hypothesis first** - Make students write predictions before experiments
3. **Measure everything** - Use DevTools Network tab, CloudWatch, DynamoDB Console
4. **Compare before/after** - Run same experiment on fragile vs. resilient versions
5. **Reflect together** - Group discussion about observed failures

## Sample Schedule (2-hour lab)

- 0:00-0:15 - Setup and deployment
- 0:15-0:30 - Test without chaos, encounter CORS
- 0:30-0:45 - Write hypotheses
- 0:45-1:15 - Run 3-4 chaos experiments
- 1:15-1:30 - Group reflection
- 1:30-1:45 - Review resilience patterns
- 1:45-2:00 - Cleanup and Q&A

Part 2 (implementing resilience) can be homework or a second 2-hour session.

## Next Steps

After Quick Start, proceed to the full README.md for detailed instructions.
