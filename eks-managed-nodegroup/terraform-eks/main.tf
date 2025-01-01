provider "aws" {
  region = var.networking.region
}

module "aws_vpc" {
    source = "./vpc"
    networking = var.networking
    security_groups = var.security_groups
    cluster_name = var.cluster_config.name
}

resource "aws_eks_cluster" "eks-cluster" {
  name     = var.cluster_config.name
  role_arn = aws_iam_role.EKSClusterRole.arn
  version  = var.cluster_config.version
  vpc_config {
    subnet_ids         = flatten([module.aws_vpc.public_subnets_id, module.aws_vpc.private_subnets_id])
    security_group_ids = flatten(module.aws_vpc.security_groups_id)
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSClusterPolicy
  ]

}

locals {
  oidc = trimprefix(data.aws_eks_cluster.eks-cluster.identity[0].oidc[0].issuer, "https://")
}

# NODE GROUP
resource "aws_eks_node_group" "node-ec2" {
  for_each        = { for node_group in var.node_groups : node_group.name => node_group }
  cluster_name    = aws_eks_cluster.eks-cluster.name
  node_group_name = each.value.name
  node_role_arn   = aws_iam_role.NodeGroupRole.arn
  subnet_ids      = flatten(module.aws_vpc.private_subnets_id)

  scaling_config {
    desired_size = try(each.value.scaling_config.desired_size, 2)
    max_size     = try(each.value.scaling_config.max_size, 3)
    min_size     = try(each.value.scaling_config.min_size, 1)
  }

  update_config {
    max_unavailable = try(each.value.update_config.max_unavailable, 1)
  }

  ami_type       = each.value.ami_type
  instance_types = each.value.instance_types
  capacity_type  = each.value.capacity_type
  disk_size      = each.value.disk_size
  
  tags = {
    "Name" = "eks-workernode"
  }
  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.AmazonEKS_CNI_Policy
  ]
}

resource "aws_eks_addon" "addons" {
  for_each          = { for addon in var.addons : addon.name => addon }
  cluster_name      = aws_eks_cluster.eks-cluster.id
  addon_name        = each.value.name
  addon_version     = each.value.version
  resolve_conflicts_on_create = "OVERWRITE" 
  resolve_conflicts_on_update = "OVERWRITE" 
}

data "tls_certificate" "eks" {
  url = data.aws_eks_cluster.eks-cluster.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  url             = "https://${local.oidc}"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks.certificates[0].sha1_fingerprint]
}
