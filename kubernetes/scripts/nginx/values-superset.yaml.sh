set -o nounset


cat<<EOF
  # Default values for disruptica-ai-nginx.
  # This is a YAML-formatted file.
  # Declare variables to be passed into your templates.

  replicaCount: 1

  image:
    repository: nginx
    pullPolicy: IfNotPresent
    # Overrides the image tag whose default is the chart appVersion.
    tag: "latest"

  imagePullSecrets: []
  nameOverride: ""
  fullnameOverride: ""

  serviceAccount:
    # Specifies whether a service account should be created
    create: true
    # Annotations to add to the service account
    annotations: {}
    # The name of the service account to use.
    # If not set and create is true, a name is generated using the fullname template
    name: ""

  podAnnotations: {}
    #sidecar.istio.io/inject: "false"

  podSecurityContext: {}
    # fsGroup: 2000

  securityContext: {}
    #capabilities:
    #  drop:
    #  - ALL
    #readOnlyRootFilesystem: true
    #runAsNonRoot: true
    #runAsUser: 1000

  service:
    type: NodePort
    port: 80
    httpsport: 443

  ingress:
    enabled: false
    annotations: {}
      # kubernetes.io/ingress.class: nginx
      # kubernetes.io/tls-acme: "true"
    hosts:
      - host: chart-example.local
        paths: []
    tls: []
    #  - secretName: chart-example-tls
    #    hosts:
    #      - chart-example.local

  resources:
    # We usually recommend not to specify default resources and to leave this as a conscious
    # choice for the user. This also increases chances charts run on environments with little
    # resources, such as Minikube. If you do want to specify resources, uncomment the following
    # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
    limits:
      cpu: 100m
      memory: 150Mi
    requests:
      cpu: 100m
      memory: 150Mi

  volumes:
    configname: nginx-proxy-config
    configMapName: nginx-proxy-conf-v1
    certsname: nginx-proxy-certs
    secretName: nginx-secret

  #volumeMounts:
  #  volumeMount:
  #    mountPath: /etc/nginx/proxy.conf
  #    subPath: proxy.conf
  #  volumeMount:
  #    mountPath: /etc/nginx/nginx.conf
  #    subPath: nginx.conf
  #  volumeMount:
  #    mountPath: /etc/letsencrypt/localhost.crt
  #    subPath: nginx-crt
  #  volumeMount:
  #    mountPath: /etc/letsencrypt/localhost.key
  #    subPath: nginx-key

  configFiles:
    proxy.conf: |-
      # HTTP 1.1 support
      proxy_http_version 1.1;
      proxy_cache_bypass  \$http_upgrade;
      proxy_buffering off;
      proxy_set_header Host \$http_host;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$proxy_x_forwarded_proto;
      proxy_read_timeout 10m;
      client_max_body_size 1024m;
    nginx.conf: |-
      events {
      }
      http {
        server {
          listen 80;

          server_name _;
          return 301 https://\$host\$request_uri;
        }
        server {
          server_name site.drakecore.com;
          include       /etc/nginx/mime.types;
        
          listen 443;
          ssl_protocols TLSv1.2 TLSv1.3;
          ssl_certificate  /etc/letsencrypt/localhost.crt;
          ssl_certificate_key /etc/letsencrypt/localhost.key;

          add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
          add_header Content-Security-Policy "default-src 'self' *; font-src 'self' * data:; frame-ancestors 'self' *; script-src 'self' * 'unsafe-inline'; style-src 'self' * 'unsafe-inline'; img-src * https://\$host;";   
          add_header X-XSS-Protection: "1; mode=block";

          proxy_set_header X-Forwarded-For \$proxy_protocol_addr; # To forward the original client's IP address 
          proxy_set_header X-Forwarded-Proto \$scheme; # to forward the  original protocol (HTTP or HTTPS)


          location / {
            client_max_body_size 1024m;
            proxy_set_header Host \$host; # to forward the original host requested by the client
            proxy_pass http://site-frontend.site.svc.cluster.local:8080;
          }

          location /auth {
            proxy_set_header Host \$host; # to forward the original host requested by the client
            proxy_pass https://keycloak-http.site.svc.cluster.local:443;
          }

          location /api {
            proxy_set_header Host \$host; # to forward the original host requested by the client
            client_max_body_size 1024m;
            proxy_pass http://site-api-rest.site.svc.cluster.local:3000;
          }
        }

        server {
          server_name bi.drakecore.com;
          include       /etc/nginx/mime.types;
        
          listen 443;
          ssl_protocols TLSv1.2 TLSv1.3;
          ssl_certificate  /etc/letsencrypt/localhost.crt;
          ssl_certificate_key /etc/letsencrypt/localhost.key;

          add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
          add_header Content-Security-Policy "default-src 'self' *;font-src 'self' data:; frame-ancestors 'self'; script-src 'self'  'unsafe-inline' 'unsafe-eval' *; style-src 'self' * 'unsafe-inline'; img-src https://\$host;";   
          add_header X-XSS-Protection: "1; mode=block";

          proxy_set_header X-Forwarded-For \$proxy_protocol_addr; # To forward the original client's IP address 
          proxy_set_header X-Forwarded-Proto \$scheme; # to forward the  original protocol (HTTP or HTTPS)

          location / {
            proxy_set_header Host \$host; # to forward the original host requested by the client
            proxy_pass http://superset.site.svc.cluster.local:8088;
            proxy_http_version 1.1;
          }
        }

        server {
          server_name da.drakecore.com;
          include       /etc/nginx/mime.types;
        
          listen 443;
          ssl_protocols TLSv1.2 TLSv1.3;
          ssl_certificate  /etc/letsencrypt/localhost.crt;
          ssl_certificate_key /etc/letsencrypt/localhost.key;

          add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
          add_header Content-Security-Policy "default-src 'self' *; font-src 'self' data:;frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' * 'unsafe-inline'; img-src 'self' data:";  
          add_header X-XSS-Protection: "1; mode=block";

          proxy_set_header X-Forwarded-For \$proxy_protocol_addr; # To forward the original client's IP address 
          proxy_set_header X-Forwarded-Proto \$scheme; # to forward the  original protocol (HTTP or HTTPS)

          location / {
            proxy_set_header Host \$host; # to forward the original host requested by the client
            proxy_pass http://pgadmin.site.svc.cluster.local:8090;
            proxy_http_version 1.1;
          }
        }     

        }

  nodeSelector: {}
  tolerations: []
  affinity: {}


EOF