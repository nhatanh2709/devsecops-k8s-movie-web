# Triển khai quy trình Pipeline DevSecOps
## 1.Tổng quan:
### Architecture
[![](https://i.ibb.co/BP2mrBP/Screenshot-2024-12-03-173943.png)](https://ibb.co/b35x2X3)

**Frontend**: ReactJS
**Backend**: Nodejs
**Database**: Mongodb, Elastic Search
**DevSecOps Tools:**
- Frontend: Snyk, Trivyfs, Trivy Scan
- Backend: Snyk, Trivyfs, Trivy Scan
- Registry: Portus Registry

**Orchestration**: Kubernetes
**CI**: Gitlab CI
**CD**: ArgoCD
**Monitoring K8S Cluter:**
- Prometheus
- Grafana

**Backup:**
- Metadata: Firebase Storage
- Database K8S: NFS Server
- K8S Cluster : Velero with S3

**Cloud:** AWS
**IAC:** Terraform
**Networking K8S:** Service Mesh(Istio)

## 2.Chi tiết dự án:
### Mô hình triển khai:
- Triển khai theo mô hình micro service
### Các tính năng:
- Login, Register với username , password thông thường
- Gửi nhận thông báo với Kafka
- Lựa chọn các list phim ( Rating, Most View)
- Lựa chọn các thể loại phim với ( Movie, TV Show)
- Comment cho mỗi phim
- Đánh Rating cho mỗi phim
- Filter Search Movie với Elastic Search
- Quản lí Profile cá nhân với Database là MongoDB
- Thực hiện thanh toán với Zalo Pay để xem được nhiều phim hơn

### Các Service được triển khai:
- Api gateway: Proxy Pass các traffic đến server đến các service đích
- User Service: Quản trị toàn bộ user của hệ thống
- Movie Service: Quản lí toàn bộ movie hệ thống
- Bill Service: Thực hiện thanh toán Zalo Pay


### DevSecOps Pipeline: 
- SAST(Snyk): Là công cụ Static Application Security Testing dùng test
source code ReactJs và NodeJS
- SCA(Trivy fs): Là công cụ Software Composition Analysis dùng kiểm thử
các library và dependencies
- Registry: Portus Registry bảo mật các docker image
- Sau khi tiến hành thực hiện xong quy trình sẽ cập nhật lại manifest của
service đó trên gitlab và Argocd sẽ tiến hành monitoring và tự động triển khai nó lên ( GitOps)
- DAST(Arachni): Là công cụ Dynamic Application Security Testing dùng testcác malware của application sau khi đã deploy
- Performance Testing(K6): Công cụ kiểm thử Performance của application

### Kubernetes Cluster:
#### Version 1: Triển khai theo mô hình ingress nginx
![](https://docs.wallarm.com/pt-br/images/waf-installation/kubernetes/nginx-ingress-controller.png)

##### Onpremise:
- Triển khai cụm 3 master với ansible và kubespray
- CNI: Calico
##### Oncloud: 
- AWS VPC
- Triển khai cụm 1 master và 2 worker với 1 số tools kèm theo bằng kubeadm với iac là terraform
- Conatiner runtime: Containerd
- CNI: Calico

-> Toàn bộ Versions 1 đã được Demo. Link ở Github
#### Version 2 : Triển khai theo mô hình Service Mesh
![](https://miro.medium.com/v2/resize:fit:2000/1*0KRmprOLmuS42GsKV8oy7A.png)
##### On premise:
- Triển khai cụm 1 master và 2 worker với kubeadm
- Conatiner runtime: Containerd
- CNI: Calico
- Networking: Service Mesh (Istio)

-> Versions 2 được update để triển khai theo A/B Testing Strategy để giảm latency và tăng performence cho từng service

### LoadBalancing:
- Nginx được sữ dụng để proxy pass tới master trong cụm k8s
và sử dụng CertBot của Let's Encyprtion handle https

### Monitoring:
- Prometheus : Giám sát cụm k8s đặc biệt 2 thành quan trong là network và
metrics
- Grafana: Thực hiện trực quan hóa dữ liệu
- ArgoCD: Thực hiện 1 GitOps process sau khi ứng dụng được kiểm thử và
cập nhật thành công thì sẽ lấy tất cả cấu hình bao gồm conatiner image
mới được triển khai ở manifest gitlab để tiến hành update cho cụm k8s


### Backup:
- Backup Metadata của application như movie, picture bằng Firebase Storage
- Backup Stateful set khi triển khai cho K8S bằng NFS Server và NFS Client
- Backup cho toàn bộ cụm k8s bằng velero và lưu trữ nó trên AWS S3


### Link:
- Github Link: https://github.com/nhatanh2709/devsecops-k8s-movie-web
- K8s Cluster Version 1 DevSecOps Pipeline : https://gitlab.com/movie-web3
- K8s Cluster Version 1 Manifest: https://gitlab.com/manifest6343345
- K8S Cluster Version 2 DevSecOps Pipeline: https://gitlab.com/movie-web-v2
- K8s Cluster Version 2 Manifest: https://gitlab.com/movie-web-v2
- Portus Registry: https://dev.nhatanhdevops.website






