resource "aws_iam_role" "aws_lbc" {
    name               = "${aws_eks_cluster.eks-cluster.name}-aws-lbc"
    assume_role_policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = "sts:AssumeRoleWithWebIdentity"
          Principal = {
            Federated = aws_iam_openid_connect_provider.eks.arn
          }
          Condition = {
            StringEquals = {
              "${local.oidc}:sub": "system:serviceaccount:kube-system:aws-load-balancer-controller",
              "${local.oidc}:aud": "sts.amazonaws.com"
            }
          }
        }
      ]
    })
}
resource "aws_iam_policy" "aws_lbc" {
  policy = file("./iam/AWSLoadBalancerController.json")
  name   = "AWSLoadBalancerController"
}

resource "aws_iam_role_policy_attachment" "aws_lbc" {
  policy_arn = aws_iam_policy.aws_lbc.arn
  role       = aws_iam_role.aws_lbc.name
}


resource "helm_release" "aws_lbc" {
  name = "aws-load-balancer-controller"

  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"
  version    = "1.8.1"

  set {
    name  = "clusterName"
    value = aws_eks_cluster.eks-cluster.name
  }
  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.aws_lbc.arn
  }
  set {
    name  = "serviceAccount.create"
    value = "true"
  }
  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "vpcId"
    value = module.aws_vpc.id
  }

  depends_on = [helm_release.cluster_autoscaler]
}
