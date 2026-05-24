variable "networking" {
  type = object({
    cidr_block      = string
    region          = string
    vpc_name        = string
    azs             = list(string)
    public_subnets  = list(string)
    private_subnets = list(string)
    nat_gateways    = bool
  })
  default = {
    cidr_block      = "10.0.0.0/16"
    region          = "ap-southeast-2"
    vpc_name        = "custom-vpc"
    azs             = ["ap-southeast-2a", "ap-southeast-2b", "ap-southeast-2c"]
    public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
    private_subnets = ["10.0.6.0/24", "10.0.7.0/24", "10.0.8.0/24"]
    nat_gateways    = true
  }
}

variable "security_groups" {
  type = list(object({
    name        = string
    description = string
    ingress = list(object({
      description      = string
      protocol         = string
      from_port        = number
      to_port          = number
      cidr_blocks      = list(string)
      ipv6_cidr_blocks = list(string)
    }))
    egress = list(object({
      description      = string
      protocol         = string
      from_port        = number
      to_port          = number
      cidr_blocks      = list(string)
      ipv6_cidr_blocks = list(string)
    }))
  }))
  default = [{
    name        = "custom-security-group"
    description = "Inbound & Outbound traffic for custom-security-group"
    ingress = [
       {
        description      = "Allow SSH"
        protocol         = "tcp"
        from_port        = 22
        to_port          = 22
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      },
      {
        description      = "Allow HTTPS"
        protocol         = "tcp"
        from_port        = 443
        to_port          = 443
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      },
      {
        description      = "Allow HTTP"
        protocol         = "tcp"
        from_port        = 80
        to_port          = 80
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      },
      {
        description      = "Allow All Traffic from NodePort"
        protocol         = "tcp"
        from_port        = 30000
        to_port          = 32727
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      },
      {
        description      = "Allow All TCP Traffic on Subnet"
        protocol         = "tcp"
        from_port        = 0
        to_port          = 65535
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      },
      {
        description      = "Allow All ICMP Traffic on Subnet"
        protocol         = "icmp"
        from_port        = -1
        to_port          = -1
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = null
      }
    ]
    egress = [
      {
        description      = "Allow all outbound traffic"
        protocol         = "-1"
        from_port        = 0
        to_port          = 0
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
      }
    ]
  }]
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "customer_gateway_name" {
  description = "Name of Customer Gateway"
  type        = string
  default     = "EKS Customer Gateway"
}

variable "vpn_gateway_name" {
  description = "Name of VPN Gateway "
  type        = string
  default     = "EKS Virtual Private Gateway"
}

variable "vpn_site_to_site_connection" {
  description = "Name of VPN Site to Site"
  type        = string
  default     = "EKS VPN Site To Site"
}

variable "ip_address" {
  description = "IP Address"
  type        = string
  default     = "171.235.188.237"
}