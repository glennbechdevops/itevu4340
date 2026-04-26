variable "student_id" {
  description = "Unique student identifier for resource naming and data partitioning"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.student_id))
    error_message = "student_id must contain only lowercase letters, numbers, and hyphens"
  }

  validation {
    condition     = length(var.student_id) > 0 && length(var.student_id) <= 20
    error_message = "student_id must be between 1 and 20 characters"
  }
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-north-1"
}
