resource "aws_iam_role" "fis_experiment_role" {
  name = "fis-experiment-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "fis.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      },
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "fis_service_policy" {
  name        = "fis-service-policy"
  description = "Policy for FIS to manage experiments"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "fis:CreateExperimentTemplate",
          "fis:GetExperimentTemplate",
          "fis:UpdateExperimentTemplate",
          "fis:DeleteExperimentTemplate",
          "fis:ListExperimentTemplates",
          "fis:StartExperiment",
          "fis:GetExperiment",
          "fis:ListExperiments",
          "fis:StopExperiment",
          "fis:ListActions",
          "fis:ListTargetResourceTypes",
          "iam:PassRole",
          "cloudwatch:DescribeAlarms"
        ]
        Resource = "*"
      }
    ]
  })
}


resource "aws_iam_policy" "fis_eks_delete_pod" {  
  name = "fis-eks-delete-pod"  
  policy = jsonencode({  
    Version = "2012-10-17",  
    Statement = [{  
      Effect   = "Allow",  
      Action   = [
        "eks:DescribeCluster",
        "eks:DescribeSubnets",
        "tag:GetResources",
        "eks:ListPods",
        "eks:DeletePod"
      ],  
      Resource = "*"
    }]  
  })  
}

resource "aws_iam_policy" "eks_access_policy" {
  name        = "eks-access-policy"
  description = "Policy for FIS to access EKS cluster"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "eks:AccessKubernetesApi",
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_access_attach" {
  policy_arn = aws_iam_policy.eks_access_policy.arn
  role       = aws_iam_role.fis_experiment_role.name
}

resource "aws_iam_role_policy_attachment" "fis_eks_delete_pod_attach_1" {
  policy_arn = aws_iam_policy.fis_eks_delete_pod.arn
  role       = aws_iam_role.fis_experiment_role.name
} 

resource "aws_iam_role_policy_attachment" "fis_eks_delete_pod_attach_2" {
  policy_arn = aws_iam_policy.fis_service_policy.arn
  role       = aws_iam_role.fis_experiment_role.name
} 