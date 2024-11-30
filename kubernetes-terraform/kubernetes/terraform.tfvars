cluster_prefix              = "k8s"
keypair_name                = "kubernetes-aws"
master_instance_type        = "t3.medium"
worker_instance_type        = "t3.medium"
master_instance_name        = "master"
worker_instance_name        = "worker"
region                      = "ap-southeast-2"
number_of_workers           = "2"
worker_disk_size            = "20"

#included_components         = ["haproxy", "argocd", "ingress-controller", "ebs-storageclass"]
included_components         = ["haproxy", "ebs-storageclass"]
# haproxy           : Install haproxy on master node and setup rule to kubernete ingress backend
# argocd            : Install argocd on installed kubernetes cluster using helm-chart
# ingress-controller: Install ingress-controller on installed kubernetes cluster using helm-chart
# ebs-storageclass  : Install storageclass using ebs volume on installed kubernetes cluster
# platform-app      : Install platform app by create argocd app and sync to kubernetes cluster. Currently include metric-server, cert-manager, kubernetes-dashboard
