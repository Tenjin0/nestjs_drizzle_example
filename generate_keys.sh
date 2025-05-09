rm -rf certs
mkdir certs

openssl genrsa -out certs/private_key.pem 2048
openssl rsa -in certs/private_key.pem -pubout > certs/public_key.pem

openssl genrsa -out certs/refresh_private_key.pem 2048
openssl rsa -in certs/refresh_private_key.pem -pubout > certs/refresh_public_key.pem

openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out certs/ssl.crt \
            -keyout certs/ssl.key \
            -subj "/C=FR/ST=Paris/L=Paris/O=Security/OU=IT Department/CN=www.example.com"
