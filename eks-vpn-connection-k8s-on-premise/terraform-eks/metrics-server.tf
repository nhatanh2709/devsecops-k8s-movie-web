resource "null_resource" "helm_repo_update" {
  provisioner "local-exec" {
    command = "helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/   && helm repo update"
  }
}

resource "helm_release" "metrics_server" {
    name = "metrics-server"
    repository = "https://kubernetes-sigs.github.io/metrics-server/"
    chart = "metrics-server"
    namespace = "kube-system"
    version = "3.12.1"
    values = [file("${path.module}/values/metrics-server.yaml")]
    depends_on = [aws_eks_node_group.node-ec2]
}