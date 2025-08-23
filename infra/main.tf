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

module "ecs" {
  source       = "./modules/ecs"
  cluster_name = "${var.app_name}-${var.env}-cluster"
}
