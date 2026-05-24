resource "aws_fis_experiment_template" "delete_pod_eks_clusters_template" {
  description = "Terminate Load Balancer Pods in EKS Cluster in Workload Non-Prod"
  role_arn    = "arn:aws:iam::323135480174:role/fis-experiment-role"
  
  action {
    name      = "aws-delete-movie-web-load-balancer-pods"
    action_id = "aws:eks:pod-delete"
    
    parameter {
        key = "kubernetesServiceAccount" 
        value = "aws-fis"
    }
    
    target {
      key   = "Pods"
      value = "delete-movie-web-load-balancer-pods"
    }
  }

  target {
    name           = "delete-movie-web-load-balancer-pods"
    resource_type  = "aws:eks:pod"
    selection_mode = "ALL"
    
    parameters = {
      clusterIdentifier = "eks-cluster"
      namespace         = "movie-web"
      selectorType      = "labelSelector"       
      selectorValue     = "app=nginx"
    }
  }

  
  tags = {
    Name = "eks-movie-web-load-balancer-pods"
  }
  
  stop_condition {
    source = "none"
  }
}