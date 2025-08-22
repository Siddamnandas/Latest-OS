variable "env" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "latest-os"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}