helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm pull ingress-nginx/ingress-nginx
tar -xvf ingress-nginx-4.11.3.tgz
helm install ingress-nginx -n ingress-nginx -f ingress-ng
inx/values.yaml  ingress-nginx