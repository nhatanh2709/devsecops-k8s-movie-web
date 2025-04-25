helm delete kibana -n logging
kubectl delete serviceaccounts post-delete-kibana-kibana -n logging
kubectl delete configmap kibana-kibana-helm-scripts -n logging
kubectl delete roles.rbac.authorization.k8s.io post-delete-kibana-kibana -n logging
kubectl delete roles.rbac.authorization.k8s.io pre-install-kibana-kibana -n logging
kubectl delete rolebindings.rbac.authorization.k8s.io pre-install-kibana-kibana -n logging
kubectl delete rolebindings.rbac.authorization.k8s.io post-delete-kibana-kibana -n logging
kubectl delete secret kibana-kibana-es-token -n logging
kubectl delete serviceaccounts pre-install-kibana-kibana -n logging
kubectl delete jobs.batch pre-install-kibana-kibana -n logging
kubectl delete jobs.batch post-delete-kibana-kibana -n logging

helm upgrade --install kibana elastic/kibana -n logging -f kibana-values.yaml