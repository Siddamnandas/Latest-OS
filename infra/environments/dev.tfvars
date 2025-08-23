env        = "dev"
aws_region = "us-east-1"
app_name   = "latest-os"

vpc_cidr        = "10.0.0.0/16"
public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]
azs             = ["us-east-1a", "us-east-1b"]

db_username          = "postgres"
db_password          = "devpassword"
db_name              = "latestos"
db_instance_class    = "db.t3.micro"
db_allocated_storage = 20
