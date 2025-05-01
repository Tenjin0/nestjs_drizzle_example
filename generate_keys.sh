rm -rf .certs
mkdir .certs

openssl genrsa -out .certs/private_key.pem 2048
openssl rsa -in .certs/private_key.pem -pubout > .certs/public_key.pem
