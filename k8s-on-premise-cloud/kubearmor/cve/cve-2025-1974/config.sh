add-apt-repository ppa:deadsnakes/ppa
apt install python3.11 python3.11-venv python3.11-dev
python3.11 -m venv venv
source venv/bin/activate
pip install .
LD_PRELOAD=./shell.so /bin/ls
curl -LO https://dl.k8s.io/release/v1.31.0/bin/linux/amd64/kubectl