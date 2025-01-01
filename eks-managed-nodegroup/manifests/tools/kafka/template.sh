docker exec kafka kafka-topics.sh --create --if-not-exists \
  --bootstrap-server 3.27.146.230:9094 \
  --topic mail-services \
  --partitions 1 \
  --replication-factor 1