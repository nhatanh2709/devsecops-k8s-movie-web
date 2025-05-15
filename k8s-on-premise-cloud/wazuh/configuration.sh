#kubectl taint nodes k8s-worker-1 node.kubernetes.io/disk-pressure:NoSchedule-
#kubectl taint nodes k8s-worker-2 node.kubernetes.io/disk-pressure:NoSchedule-
rm -rf /data/wazuh/manager-worker-1/*
rm -rf /data/wazuh/manager-worker-2/*
rm -rf /data/wazuh/manager-master/*
rm -rf /data/wazuh/indexer-1/*
rm -rf /data/wazuh/indexer-2/*
rm -rf /data/wazuh/indexer-3/*

kubectl delete pv wazuh-manager-worker-pv-1
kubectl delete pv wazuh-manager-worker-pv-2
kubectl delete pv wazuh-manager-master-pv
kubectl delete pv wazuh-indexer-pv-1
kubectl delete pv wazuh-indexer-pv-2
kubectl delete pv wazuh-indexer-pv-3