# Triển khai quy trình Pipeline DevSecOps
## 1.Tổng quan:
### Architecture
![](https://i.imgur.com/8PAyuGX.png)


**Frontend**: ReactJS

**Backend**: Nodejs

**Database**: Mongodb, Elastic Search

**DevSecOps Tools:**
- Frontend: SonarQube, Snyk, Trivyfs, Trivy Scan, Arachni , ZAP, K6
- Backend: SonarQube, Snyk, Trivyfs , Trivy Scan
- Registry: Portus Registry
- DAST: Arachni
- Performence Testing: K6

**Orchestration**: Kubernetes

**CI/CD Pipeline**: Gitlab CI

**GitOps**: ArgoCD

**Monitoring K8S Cluter:**
- Prometheus
- Grafana

**Message Broken**: Kafka

**Backup K8s Cluster**: 
- On Cloud: Velero + S3 
- On Premise: Velero + Minio 


**Application Storage:**
- Application Metadata: Firebase Storage

**Kubernetes Storage**: 
- OnPremise: NFS Ganesha  
- OnCloud: AWS EBS

**Uptime**: Uptime Kuma

**Hosting Provider**: Hostinger

**IAC:** Terraform

**VPN**: 
- AWS Customer Gateway
- AWS Virtual Private Gateway
- AWS VPN Site to Site

**CDN**: CloudFront

**Kubernetes Cluster** : 
- K8s Local KubeSpray
- K8s Local Kubectl and Kubeadm
- K8s Seft Manager Node AWS (Normal and Service Mesh)
- EKS Manager Node Group
- K8s On Premise and Cloud 

**IDS**: Falco

**Audit Logging**: 
- ElasticSearch
- Kibana
- Filebeat
- Logstash

**API Gateway**: Kong Gateway

**Application Firewall**: 
- On Cloud:AWS WAFs
- On Premise: IngressNginx and ModSecurity

**Cloud** : 
- Provider: AWS
- Load-Balancer: AWS-LoadBalancer
- Monitoring: CloudWatch
- Routing : Route53
- Certificate: Certficate Manager
- AutoScale System: Auto Scaling Group
- Cloud Alert: AWS CloudWatch, AWS Alarm, AWS SNS, Versus Incident, Slack

**Management Infrastructure**: Teleport

## 2.Chi tiết dự án:
### Architecture:
![](https://i.imgur.com/UeKEIpx.png)

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
- Mỗi Services đều được triển khai dưới mô hình MVC
- Api gateway: Proxy Pass các traffic đến server đến các service đích
- User Service: Quản trị toàn bộ user của hệ thống
- Movie Service: Quản lí toàn bộ movie hệ thống
- Bill Service: Thực hiện thanh toán Zalo Pay


### DevSecOps Pipeline: 
- SAST(Snyk, SonarQube): Là công cụ Static Application Security Testing dùng test
source code ReactJs và NodeJS
- SCA(Trivy fs): Là công cụ Software Composition Analysis dùng kiểm thử
các library và dependencies
- Registry: Portus Registry bảo mật các docker image
- Sau khi tiến hành thực hiện xong quy trình sẽ cập nhật lại manifest của
service đó trên gitlab và Argocd sẽ tiến hành monitoring và tự động triển khai nó lên ( GitOps)
- DAST(Arachni,ZAP): Là công cụ Dynamic Application Security Testing dùng testcác malware của application sau khi đã deploy
- Performance Testing(K6): Công cụ kiểm thử Performance của application

### Kubernetes Cluster:
#### Options 1: Kubernetes On-Premise Kubespray
![](https://docs.wallarm.com/pt-br/images/waf-installation/kubernetes/nginx-ingress-controller.png)

#### Cluster:
- Cluster: 3 Master
- Tools: Ansible và Kubespray
- Storage: NFS

#### Options 2: Kubernetes Seft-Manager AWS Version 1
#### Cluster:
- Cluster: 1 Master và 2 Worker
- IAC: Terraform
- Cloud Networking: AWS VPC
- Container Runtime: Containerd
- CNI: Calico
- K8S Networking: Kube-proxy
- Storage Class: EBS, EFS, S3

#### Options 3: Kubernetes Seft-Manager AWS Version 2
#### Cluster:
![Alt text](https://i.imgur.com/Aa2M6YI.jpg)
- Cluster: 1 Master và 2 Worker
- IAC: Terraform
- Cloud Networking: AWS VPC
- Container Runtime: Containerd
- CNI: Calico
- K8S Networking: Service Mesh (Istio)
- Strategy: A/B Testing Application
- Storage Class: EBS, EFS
- Backup: S3

-> Versions 2 được update để triển khai theo A/B Testing Strategy để giảm latency và tăng performence cho từng service

### Options 4: EKS Manager Node Group
![Alt text](https://imgur.com/kEw7284.jpg)
- Cluster: 
- Master: AWS EKS Manager
- Worker: EC2 Instance
- IAC: Terraform
- Cloud Networking: AWS VPC
- Tools EKS Terraform: Helm Chart, AWS-EBS, AWS-LoadBalancer, AWS-Auto Scaling Group, AWS-Metrics-Server
- ADDONS Kubernetes Terraform : Kube-proxy, VPC-CNI, CoreDNS
- Identity Provider EKS: OIDC 
- Storage Class: EBS, EFS
- Backup: S3

### Options 5: K8s On Premise and Cloud 
[![images.png](https://i.postimg.cc/kXJzRNLY/images.png)](https://postimg.cc/HjNBfMYb)
- Cluster: 1 Master và 2 Worker
- IAC: Terraform
- Cloud Networking: AWS VPC
- Container Runtime: Containerd
- CNI: Calico



### Cloud :
- AWS LoadBalancer: AWS Load Balancer là dịch vụ phân phối lưu lượng truy cập tự động đến nhiều máy chủ, Traffic đi vào sẽ được redirect và phân chia đều  tới cụm k8s
- AWS WAFs: Là dịch vụ web application firewall của AWS được sử dụng để handle traffic tới AWS LoadBalancer theo các rule được enable
- CloudWatch là dịch vụ monitoring của AWS được sử dụng như công cụ giám sát WAFs
- Route53: Là công cụ giúp quản lý tên miền, định tuyến lưu lượng truy cập đến các tài nguyên, định tuyến traffic tới các resource như AWS LoadBalancer, CloudFront
- Certificate Manager: Là dịch vụ cung cấp certificates cho các domain của AWS
- Auto Scaling Group: Là dịch vụ tự động release 1 instance ec2 khi traffic trong cụm quá lớn, nếu lượng tài nguyên các node trong cụm ko thể enable được các service,pods,... sắp triển khai hoặc đang cần scale lên trong eks thì sẽ tự động scale thêm instance để tăng tải

### Monitoring:
- Prometheus : Giám sát cụm k8s đặc biệt 2 thành quan trong là network và
metrics
- Grafana: Thực hiện trực quan hóa dữ liệu
- ArgoCD: Thực hiện 1 GitOps process sau khi ứng dụng được kiểm thử và
cập nhật thành công thì sẽ lấy tất cả cấu hình bao gồm conatiner image
mới được triển khai ở manifest gitlab để tiến hành update cho cụm k8s


### Velero: 
- Là dịch vụ backup cụm kubernetes phù hợp cho môi trường on-premise như Minio và cả trên on-cloud với nhiều options cho storage như S3, EBS,...

### Backup:
- Backup Metadata của application như movie, picture bằng Firebase Storage
- Backup Stateful set khi triển khai cho K8S bằng NFS Server và NFS Client
- Backup cho toàn bộ cụm k8s bằng velero và lưu trữ nó trên AWS S3
- Backup High Availablity Database Cluster với môi trường Premise : NFS
- Backup  Database với môi trường Cloud : EBS
- Backup High Availablity Database Cluster với môi trường Cloud: EFS

### VPN: 

- Virtual Private Gateway: Điểm cuối quản lý lưu lượng và mạng trong AWS VPC. Đây là thành phần do AWS quản lý, hoạt động như router ảo tại phía AWS để thiết lập kết nối VPN an toàn.
- Customer Gateway: Điểm cuối quản lý lưu lượng và mạng tại hệ thống on-premise. Đây là thiết bị vật lý hoặc phần mềm tại trung tâm dữ liệu của doanh nghiệp, cấu hình để kết nối với Virtual Private Gateway của AWS.
- VPN Site-to-Site: Kết nối Virtual Private Gateway với Customer Gateway thông qua 2 đường hầm riêng biệt, sử dụng giao thức IPSec tùy chỉnh. Hai đường hầm này hoạt động đồng thời để đảm bảo tính sẵn sàng cao.

### Audit Logging:
- Elasticsearch: Highe Available Database dùng để storage dữ liệu.
- Kibana: Công cụ trực quan hóa dùng cho phân tích và báo cáo nhật ký.
- Filebeat: Bộ thu thập logs chuyển tiếp dữ liệu đến Elasticsearch với nhiều loại dữ liệu như dữ liệu container Kubernetes.
- Logstash: Đường ống xử lý làm phong phú nhật ký trước khi lưu trữ.


### Teleport: 
- Hạ tầng quản lý Zero Trust, Quản lý cụm on-premise Kubernetes , cân bằng tải, Máy chủ NFS,...

### Falco: 
- Hệ thống phát hiện xâm nhập (IDS) và Cảnh báo cho kernel, container, syscall, mạng, truy cập tệp, quy trình, thời gian thực, nhật ký kiểm toán với tích hợp Slack nếu cảnh báo nguy hiểm

### Kong Gateway: 
- API Gateway cho phép quản lý API an toàn, có khả năng mở rộng trên các microservices với nhiều tính năng mạnh mẽ như Rate Limiting , Monitoring Traffic, Identity Authentication Protocol 

### Alert:
- AWS CloudWatch theo dõi các chỉ số của máy chủ
- AWS Alarm kích hoạt khi vượt ngưỡng cho phép (RAM, CPU,...) của máy chủ AWS
- AWS SNS gửi thông báo
- Cảnh báo được chuyển đến Versus Incident, nơi sẽ định dạng thông tin theo mẫu tùy chỉnh và gửi đến Slack

### Web Application Kubernetes:
- ModSecurity: Kết hợp với Ingress-Nginx và tiến hành dựng các Rate Limiting, Block Traffic From Country, OWASP Top 10 rule để triển khai thành WAF 

### Link:
- Gitlab Link: https://gitlab.com/movie-web-manifest
- K8s Cluster Version 1 DevSecOps Pipeline : https://gitlab.com/movie-web3
- K8s Cluster Version 1 Manifest: https://gitlab.com/manifest6343345
- K8S Cluster Version 2 DevSecOps Pipeline: https://gitlab.com/movie-web-v2
- K8s Cluster Version 2 Manifest: https://gitlab.com/movie-web-v2
- Portus Registry: https://dev.nhatanhdevops.website
- K8S-Local-KubeSpray: https://drive.google.com/file/d/1wKfk8NljcuQrWKQUd7t6sVMHatMa-P5M/view
- K8S-Seft-Manager-AWS: https://drive.google.com/file/d/1p40rtNCu2HDGyF5mWNfF-Oo5gaZ09IG0/view
- EKS-Manager-NodeGroup: https://drive.google.com/file/d/1TqxcqIi5QeHfNrQDAyWoxIfOSC4Ta8nw/view?usp=sharing
- Falco Url:https://falco.nhatanhmovie.website
- Kibana Url: https://kibana.nhatanhmovie.website
- Kong Manager Url: https://kong-manager.nhatanhmovie.website
- ArgoCD Url: https://argocd.nhatanhmovie.website
- Kubernetes Dashboard Url: https://kubernetes-dashboard.nhatanhmovie.website
- Teleport Url: https://teleport.nhatanhmovie.website
- Application Url: https://movie.nhatanhweb.website
- Final Demo: https://drive.google.com/drive/folders/1u0Dt7nhlwluU4BEcXaiEZLaqwkRjuOk6?hl=vi






