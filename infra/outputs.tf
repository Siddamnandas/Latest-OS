output "s3_bucket_name" {
  description = "Name of the created S3 bucket"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the created S3 bucket"
  value       = module.s3.bucket_arn
}

output "s3_secondary_bucket_name" {
  description = "Name of the secondary region S3 bucket"
  value       = module.s3_secondary.bucket_name
}

output "db_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_endpoint
}

output "db_read_replica_endpoint" {
  description = "Read replica endpoint"
  value       = aws_db_instance.read_replica.address
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "ecs_cluster_id" {
  description = "ECS cluster ID"
  value       = module.ecs.cluster_id
}

output "cdn_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.multi_region.domain_name
}

output "environment" {
  description = "Environment name"
  value       = var.env
}
