add-apt-repository ppa:deadsnakes/ppa
apt install python3.11 python3.11-venv python3.11-dev
python3.11 -m venv venv
source venv/bin/activate
pip install .