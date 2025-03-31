aws cloudwatch put-metric-alarm \
  --alarm-name "Load_Balancer_EC2_CPU_High" \
  --alarm-description "Load Balancer Instance CPU utilization over 8%" \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0283c4d4a16cd8952 \
  --statistic Average \
  --period 300 \
  --threshold 8 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:ap-southeast-2:145023122173:Load-Balancer-EC2-CPU-Alarm-Topic

aws cloudwatch put-metric-alarm \
  --alarm-name "Gitlab_Runner_EC2_CPU_High" \
  --alarm-description "Gitlab Runner Instance CPU utilization over 10%" \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-0455c8e3394054c7f \
  --statistic Average \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:ap-southeast-2:145023122173:Gitlab-Runner-EC2-CPU-Alarm-Topic

aws cloudwatch put-metric-alarm \
  --alarm-name "VPN_Tunnel_Data_Out_High" \
  --alarm-description "Alarm triggers when TunnelDataOut exceeds 4000 bytes" \
  --namespace "AWS/VPN" \
  --metric-name "TunnelDataOut" \
  --dimensions Name=TunnelIpAddress,Value=13.236.133.77 \
  --statistic Average \
  --period 300 \
  --threshold 4000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:ap-southeast-2:145023122173:VPN-Tunnel-Data-Out-Alarm-Topic

aws cloudwatch put-metric-alarm \
  --alarm-name "VPN_Tunnel_Data_In_High" \
  --alarm-description "Alarm triggers when TunnelDataOut exceeds 100000 bytes" \
  --namespace "AWS/VPN" \
  --metric-name "TunnelDataOut" \
  --dimensions Name=TunnelIpAddress,Value=54.153.170.133 \
  --statistic Average \
  --period 300 \
  --threshold 100000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:ap-southeast-2:145023122173:VPN-Tunnel-Data-In-Alarm-Topic