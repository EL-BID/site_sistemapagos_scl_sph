# Generate certificate and private key

## Prerequesites
### Install openssl on the computer and execute the next steps
- openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example.com.key -out example.com.crt

- openssl req -out nginx.example.com.csr -newkey rsa:2048 -nodes -keyout nginx.example.com.key -subj "/CN=nginx.example.com/O=nginx organization"
openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 0 -in nginx.example.com.csr -out nginx.example.com.crt

Related links: https://www.howtoforge.com/tutorial/how-to-install-openssl-from-source-on-linux

### Create secret
- Replace private key and certificate in the file /kubernetes/scripts/nginx/secret.yaml
- Execute command in the shell: "kubectl apply -f secret.yaml"