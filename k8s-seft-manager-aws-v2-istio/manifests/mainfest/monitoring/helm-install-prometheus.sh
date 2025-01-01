helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm upgrade devopseduvn prometheus-community/kube-prometheus-stack 
  --namespace monitoring 
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.accessModes[0]=ReadWriteOnce 
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=10Gi 
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.storageClassName=nfs-storage

helm pull prometheus-community/kube-prometheus-stack