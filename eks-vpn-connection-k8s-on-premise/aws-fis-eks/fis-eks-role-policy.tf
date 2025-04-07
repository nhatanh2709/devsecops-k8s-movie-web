resource "aws_iam_role" "fis_experiment_role" {  
  name = "fis-experiment-role"  
  assume_role_policy = jsonencode({  
    Version = "2012-10-17",  
    Statement = [{  
      Effect = "Allow",  
      Principal = {  
        Service = "fis.amazonaws.com"  
      },  
      Action = "sts:AssumeRole"  
    }]  
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

resource "aws_iam_role_policy_attachment" "fis_eks_delete_pod" {
  policy_arn = aws_iam_policy.fis_eks_delete_pod.arn
  role       = aws_iam_role.fis_experiment_role.name
} 