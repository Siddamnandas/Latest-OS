env              = "prod"
aws_region       = "us-east-1"
secondary_region = "us-west-2"
app_name         = "latest-os"

vpc_cidr        = "10.1.0.0/16"
public_subnets  = ["10.1.1.0/24", "10.1.2.0/24"]
private_subnets = ["10.1.3.0/24", "10.1.4.0/24"]
azs             = ["us-east-1a", "us-east-1b"]

db_username          = "postgres"
db_password          = "prodpassword"
db_name              = "latestos"
db_instance_class    = "db.t3.small"
db_allocated_storage = 20
