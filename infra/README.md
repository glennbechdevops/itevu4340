# Chaos Coffee Infrastructure

This Terraform module creates the AWS infrastructure for the Chaos Coffee chaos engineering lab.

## Architecture

```
┌─────────────┐
│   Webapp    │
│ (Browser)   │
└──────┬──────┘
       │
       │ HTTP POST
       ▼
┌─────────────────────┐
│  Lambda Function    │
│  (Function URL)     │
└──────┬──────────────┘
       │
       │ PutItem
       ▼
┌─────────────────────┐
│  DynamoDB Table     │
│  PK: student_id     │
│  SK: ORDER#<uuid>   │
└─────────────────────┘
```

## Resources Created

### DynamoDB Table
- **Name:** `chaos-coffee-${student_id}`
- **Billing:** Pay-per-request (on-demand)
- **Key Schema:**
  - Partition Key (PK): Student ID
  - Sort Key (SK): ORDER#<uuid>

### Lambda Function
- **Name:** `chaos-coffee-${student_id}`
- **Runtime:** Go 1.21 (custom runtime provided.al2023)
- **Memory:** 128 MB
- **Timeout:** 10 seconds
- **Trigger:** Function URL (public, no auth)

### IAM Role & Policies
- Lambda execution role with:
  - CloudWatch Logs write permissions
  - DynamoDB PutItem, GetItem, Query permissions

### CloudWatch Logs
- **Log Group:** `/aws/lambda/chaos-coffee-${student_id}`
- **Retention:** 7 days

## Required Variables

### `student_id` (required)
- **Type:** string
- **Description:** Unique identifier for your deployment
- **Constraints:**
  - Must contain only lowercase letters, numbers, and hyphens
  - Length: 1-20 characters
- **Example:** `john-doe`, `team-1`, `alice-smith`

### `aws_region` (optional)
- **Type:** string
- **Description:** AWS region for deployment
- **Default:** `us-east-1`

## Usage

### Prerequisites

1. AWS credentials configured (via AWS CLI or environment variables)
2. Terraform installed (v1.0+)
3. Lambda function built and packaged (`lambda/function.zip`)

### Build Lambda Function

```bash
cd ../lambda
make package
cd ../infra
```

### Deploy Infrastructure

Create a working directory:

```bash
mkdir -p ../deployments/my-deployment
cd ../deployments/my-deployment
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
  source = "../../infra"

  student_id = "your-name-here"  # CHANGE THIS
}

output "lambda_function_url" {
  value = module.chaos_coffee.lambda_function_url
}

output "dynamodb_table_name" {
  value = module.chaos_coffee.dynamodb_table_name
}

output "instructions" {
  value = module.chaos_coffee.instructions
}
```

Initialize and apply:

```bash
terraform init
terraform plan
terraform apply
```

### Outputs

After applying, Terraform will output:

- **lambda_function_url:** URL to configure in webapp
- **dynamodb_table_name:** Table name for querying orders
- **cloudwatch_log_group:** Log group name for debugging
- **instructions:** Next steps for the lab

## Updating Lambda Code

After changing Lambda code:

```bash
cd lambda
make package

cd ../deployments/my-deployment
terraform apply
```

Terraform detects the change via `source_code_hash` and updates the function.

## Monitoring

### View Lambda Logs

```bash
aws logs tail /aws/lambda/chaos-coffee-<student-id> --follow
```

### Query Orders in DynamoDB

Scan all orders:

```bash
aws dynamodb scan --table-name chaos-coffee-<student-id>
```

Query orders for a specific student:

```bash
aws dynamodb query \
  --table-name chaos-coffee-<student-id> \
  --key-condition-expression "PK = :student" \
  --expression-attribute-values '{":student":{"S":"your-name-here"}}'
```

### CloudWatch Metrics

View metrics in AWS Console:
- Lambda → Functions → chaos-coffee-{student_id} → Monitoring
- DynamoDB → Tables → chaos-coffee-{student_id} → Metrics

## Cleanup

To destroy all resources and avoid ongoing charges:

```bash
terraform destroy
```

This will delete:
- Lambda function
- DynamoDB table (and all data)
- IAM roles and policies
- CloudWatch log group

## Cost Estimate

For typical lab usage (1-2 hours, ~100 requests):

- **Lambda:** Free tier (1M requests/month free)
- **DynamoDB:** ~$0.00 (on-demand, minimal requests)
- **CloudWatch Logs:** ~$0.00 (7-day retention)

**Total:** < $0.01 for the lab exercise

**Important:** Run `terraform destroy` when done to ensure no ongoing costs.

## Troubleshooting

### Lambda Function Not Found

If Terraform can't find `lambda/function.zip`:

```bash
cd lambda
make package
cd ../infra
```

### Permission Denied Errors

Ensure AWS credentials are configured:

```bash
aws sts get-caller-identity
```

### CORS Errors (Expected!)

CORS errors are **intentional** for this lab. Students will:
1. Encounter the error
2. Learn about browser security
3. Implement solutions in Part 2

### DynamoDB Access Denied

Check IAM role policy is attached:

```bash
terraform state show aws_iam_role_policy.lambda_dynamodb
```

## Module Structure

```
infra/
├── main.tf          # Main resources (Lambda, DynamoDB)
├── variables.tf     # Input variables
├── outputs.tf       # Output values
└── README.md        # This file
```

## Security Considerations

### For Production Use (Not for this lab)

This lab uses simplified security for educational purposes. For production:

1. **Authentication:** Add API Gateway with OAuth/JWT
2. **CORS:** Configure proper CORS headers with specific origins
3. **Encryption:** Enable DynamoDB encryption at rest
4. **VPC:** Run Lambda in VPC with private subnets
5. **Secrets:** Use AWS Secrets Manager for sensitive data
6. **Rate Limiting:** Add API Gateway throttling
7. **WAF:** Add AWS WAF for DDoS protection

## Next Steps

After deploying:
1. Update `webapp/app.js` with the Lambda Function URL
2. Open `webapp/index.html` in browser
3. Follow the lab instructions in the main README.md

## Support

For issues with Terraform or AWS:
- Check CloudWatch Logs for Lambda errors
- Verify AWS credentials and permissions
- Ensure Lambda function.zip exists
- Check Terraform version compatibility
