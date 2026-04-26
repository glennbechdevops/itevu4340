terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# DynamoDB table for storing orders
resource "aws_dynamodb_table" "orders" {
  name         = "chaos-coffee-${var.student_id}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  tags = {
    Name      = "chaos-coffee-${var.student_id}"
    Student   = var.student_id
    Project   = "chaos-engineering-lab"
  }
}
