// Handle Backend on Terraform Cloud of Hashicorp instead of Backend Standard

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.18.0"
    }
  }
}