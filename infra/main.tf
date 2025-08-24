terraform {
  required_version = ">= 1.0"
  backend "s3" {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "secondary"
  region = var.secondary_region
}

module "vpc" {
  source          = "./modules/vpc"
  vpc_cidr        = var.vpc_cidr
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  azs             = var.azs
}

module "s3" {
  source      = "./modules/s3"
  bucket_name = "${var.app_name}-${var.env}-data"
  env         = var.env
}

module "s3_secondary" {
  providers   = { aws = aws.secondary }
  source      = "./modules/s3"
  bucket_name = "${var.app_name}-${var.env}-data-${var.secondary_region}"
  env         = var.env
}

module "rds" {
  source            = "./modules/rds"
  identifier        = "${var.app_name}-${var.env}-db"
  subnet_ids        = module.vpc.private_subnet_ids
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  db_name           = var.db_name
  username          = var.db_username
  password          = var.db_password
}

resource "aws_db_instance" "read_replica" {
  provider            = aws.secondary
  identifier          = "${var.app_name}-${var.env}-db-replica"
  replicate_source_db = module.rds.db_instance_id
  instance_class      = var.db_instance_class
  publicly_accessible = false
  skip_final_snapshot = true
}

resource "aws_cloudfront_distribution" "multi_region" {
  enabled = true

  origin {
    domain_name = "${module.s3.bucket_name}.s3.${var.aws_region}.amazonaws.com"
    origin_id   = "primary"
    s3_origin_config {}
  }

  origin {
    domain_name = "${module.s3_secondary.bucket_name}.s3.${var.secondary_region}.amazonaws.com"
    origin_id   = "secondary"
    s3_origin_config {}
  }

  origin_group {
    origin_id = "group1"
    failover_criteria {
      status_codes = [403, 404, 500, 502, 503, 504]
    }
    member { origin_id = "primary" }
    member { origin_id = "secondary" }
  }

  default_cache_behavior {
    target_origin_id       = "group1"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

module "ecs" {
  source       = "./modules/ecs"
  cluster_name = "${var.app_name}-${var.env}-cluster"
}
