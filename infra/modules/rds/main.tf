resource "aws_db_subnet_group" "this" {
  name       = "${var.identifier}-subnet-group"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "this" {
  identifier           = var.identifier
  engine               = "postgres"
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  db_name              = var.db_name
  username             = var.username
  password             = var.password
  db_subnet_group_name = aws_db_subnet_group.this.name
  skip_final_snapshot  = true
  publicly_accessible  = false
}
