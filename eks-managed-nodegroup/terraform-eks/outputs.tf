data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_eks_cluster" "eks-cluster" {
  name = aws_eks_cluster.eks-cluster.name
}

output "eks_aws_oidc" {
  description = "Auto Scale Cluster for eks"
  value = local.oidc
}
