set -o nounset

postgresql_username="$1"
postgresql_password="$2"
superset_username="$3"
superset_password="$4"

cat<<EOF
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Default values for superset.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

# User ID directive. This user must have enough permissions to run the bootstrap script
# Runn containers as root is not recommended in production. Change this to another UID - e.g. 1000 to be more secure
runAsUser: 0

# Install additional packages and do any other bootstrap configuration in this script
# For production clusters it's recommended to build own image with this step done in CI
bootstrapScript: |
  #!/bin/bash
  apt-get update -y &&   apt-get install -y --no-install-recommends nano &&   rm -rf /var/lib/apt/lists/*
  pip install psycopg2==2.8.5 redis==3.5.0
  pip install authlib

  if [ ! -f ~/bootstrap ]; then echo "Running Superset with uid {{ .Values.runAsUser }}" > ~/bootstrap; fi

custom_sso_security_manager: |
  import logging
  from superset.security import SupersetSecurityManager

  class CustomSsoSecurityManager(SupersetSecurityManager):

    def oauth_user_info(self, provider, response=None):
        logging.debug("Oauth2 provider: {0}.".format(provider))
        if provider == "Keycloak":
          me = self.appbuilder.sm.oauth_remotes[provider].get('openid-connect/userinfo')
          data = me.json()
          return { 'name' : data.get("name", ""), 'email' : data.get("email", ""), 'id' : data.get("sub", ""), 'username' : data.get("preferred_username", "")}
        else:
            return {}

## The name of the secret which we will use to generate a superset_config.py file
## Note: this secret must have the key superset_config.py in it and can include other files as well
##
configFromSecret: '{{ template "superset.fullname" . }}-config'

## The name of the secret which we will use to populate env vars in deployed pods
## This can be useful for secret keys, etc.
##
envFromSecret: '{{ template "superset.fullname" . }}-env'

## Extra environment variables that will be passed into pods
##
extraEnv: {}

## Extra environment variables to pass as secrets
##
extraSecretEnv:
  {}
  # MAPBOX_API_KEY: ...
  # GOOGLE_KEY: ...
  # GOOGLE_SECRET: ...

extraConfigs:
  datasources-init.yaml: |
    databases:
    - allow_csv_upload: true
      allow_ctas: true
      allow_cvas: true
      database_name: newdata

extraSecrets: {}

# A dictionary of overrides to append at the end of superset_config.py - the name does not matter
# WARNING: the order is not guaranteed
configOverrides:
  enable_oauth: |
    from flask_appbuilder.security.manager import AUTH_OAUTH
    AUTH_TYPE = AUTH_OAUTH
    from custom_sso_security_manager import CustomSsoSecurityManager
    CUSTOM_SECURITY_MANAGER = CustomSsoSecurityManager
    WTF_CSRF_ENABLED = False
    SESSION_COOKIE_SAMESITE = None

    OAUTH_PROVIDERS = [
        {
            "name": "Keycloak",
            "icon": "fa-key",
            "token_key": "access_token",
            "remote_app": {
                "client_id": "superset",
                "client_secret": "0a15eddd-f0e5-43b0-9b4e-593b1585bfd6",
                "api_base_url": "https://site.drakecore.com/auth/realms/site/protocol/openid-connect",
                "client_kwargs": {"scope": "email profile"},
                "request_token_url": None,
                "access_token_url": "https://site.drakecore.com/auth/realms/site/protocol/openid-connect/token",
                "authorize_url": "https://site.drakecore.com/auth/realms/site/protocol/openid-connect/auth",
            },
        }
    ]
    AUTH_USER_REGISTRATION = False
    AUTH_USER_REGISTRATION_ROLE = "Public"

configMountPath: "/app/pythonpath"

extraConfigMountPath: "/app/configs"

image:
  repository: apache/superset
  tag: latest
  pullPolicy: IfNotPresent

imagePullSecrets: []

service:
  type: NodePort
  port: 8088
  annotations:
    {}
    # cloud.google.com/load-balancer-type: "Internal"
  loadBalancerIP: null

ingress:
  enabled: false
  annotations:
    {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources:
  {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #   cpu: 100m
  #   memory: 128Mi
  # requests:
  #   cpu: 100m
  #   memory: 128Mi

##
## Superset node configuration
supersetNode:
  command:
    - "/bin/sh"
    - "-c"
    - ". {{ .Values.configMountPath }}/superset_bootstrap.sh; /usr/bin/docker-entrypoint.sh"
  connections:
    redis_host: '{{ template "superset.fullname" . }}-redis-master'
    redis_port: "6379"
    db_host: "postgresql.site.svc.cluster.local"
    db_port: "5432"
    db_user: $postgresql_username
    db_pass: $postgresql_password
    db_name: superset
  forceReload: false # If true, forces deployment to reload on each upgrade
  initContainers:
    - name: wait-for-postgres
      image: busybox:latest
      imagePullPolicy: IfNotPresent
      envFrom:
        - secretRef:
            name: "{{ tpl .Values.envFromSecret . }}"
      command:
        [
          "/bin/sh",
          "-c",
          "until nc -zv \$DB_HOST \$DB_PORT -w1; do echo 'waiting for db'; sleep 1; done",
        ]

  ## Annotations to be added to supersetNode deployment
  deploymentAnnotations: {}

  ## Annotations to be added to supersetNode pods
  podAnnotations: {}

##
## Superset worker configuration
supersetWorker:
  command:
    - "/bin/sh"
    - "-c"
    - ". {{ .Values.configMountPath }}/superset_bootstrap.sh; celery --app=superset.tasks.celery_app:app worker"
  forceReload: false # If true, forces deployment to reload on each upgrade
  initContainers:
    - name: wait-for-postgres
      image: busybox:latest
      imagePullPolicy: IfNotPresent
      envFrom:
        - secretRef:
            name: "{{ tpl .Values.envFromSecret . }}"
      command:
        [
          "/bin/sh",
          "-c",
          "until nc -zv \$DB_HOST \$DB_PORT -w1; do echo 'waiting for db'; sleep 1; done",
        ]

  ## Annotations to be added to supersetWorker deployment
  deploymentAnnotations: {}

  ## Annotations to be added to supersetWorker pods
  podAnnotations: {}

##
## Superset beat configuration (to trigger scheduled jobs like reports)
supersetCeleryBeat:
  # This is only required if you intend to use alerts and reports
  enabled: false
  command:
    - "/bin/sh"
    - "-c"
    - ". {{ .Values.configMountPath }}/superset_bootstrap.sh; celery --app=superset.tasks.celery_app:app beat --pidfile /tmp/celerybeat.pid --schedule /tmp/celerybeat-schedule"
  forceReload: false # If true, forces deployment to reload on each upgrade
  initContainers:
    - name: wait-for-postgres
      image: busybox:latest
      imagePullPolicy: IfNotPresent
      envFrom:
        - secretRef:
            name: "{{ tpl .Values.envFromSecret . }}"
      command:
        [
          "/bin/sh",
          "-c",
          "until nc -zv \$DB_HOST \$DB_PORT -w1; do echo 'waiting for db'; sleep 1; done",
        ]

  ## Annotations to be added to supersetCeleryBeat deployment
  deploymentAnnotations: {}

  ## Annotations to be added to supersetCeleryBeat pods
  podAnnotations: {}

##
## Init job configuration
init:
  # Configure resources
  # Warning: fab commant consumes a lot of ram and can
  # cause the process to be killed due to OOM if it exceeds limit
  resources:
    {}
    # limits:
    #   cpu:
    #   memory:
    # requests:
    #   cpu:
    #   memory:
  command:
    - "/bin/sh"
    - "-c"
    - ". {{ .Values.configMountPath }}/superset_bootstrap.sh; . {{ .Values.configMountPath }}/superset_init.sh"
  enabled: true
  loadExamples: false
  adminUser:
    username: $superset_username
    firstname: Superset
    lastname: Admin
    email: $superset_username
    password: $superset_password
  initContainers:
    - name: wait-for-postgres
      image: busybox:latest
      imagePullPolicy: IfNotPresent
      envFrom:
        - secretRef:
            name: "{{ tpl .Values.envFromSecret . }}"
      command:
        [
          "/bin/sh",
          "-c",
          "until nc -zv \$DB_HOST \$DB_PORT -w1; do echo 'waiting for db'; sleep 1; done",
        ]
  initscript: |-
    #!/bin/sh
    echo "Upgrading DB schema..."
    superset db upgrade
    echo "Initializing roles..."
    superset init
    echo "Creating admin user..."
    superset fab create-admin                     --username {{ .Values.init.adminUser.username }}                     --firstname {{ .Values.init.adminUser.firstname }}                     --lastname {{ .Values.init.adminUser.lastname }}                     --email {{ .Values.init.adminUser.email }}                     --password {{ .Values.init.adminUser.password }}                     || true
    {{ if .Values.init.loadExamples }}
    echo "Loading examples..."
    superset load_examples
    {{- end }}
##
## Configuration values for the postgresql dependency.
## ref: https://github.com/kubernetes/charts/blob/master/stable/postgresql/README.md
postgresql:
  ##
  ## Use the PostgreSQL chart dependency.
  ## Set to false if bringing your own PostgreSQL.
  enabled: false

  ##
  ## The name of an existing secret that contains the postgres password.
  existingSecret:

  ## Name of the key containing the secret.
  existingSecretKey: postgresql-password

  ##
  ## If you are bringing your own PostgreSQL, you should set postgresHost and
  ## also probably service.port, postgresqlUsername, postgresqlPassword, and postgresqlDatabase
  postgresHost: postgresql.site.svc.cluster.local
  ##
  ## PostgreSQL port
  service:
    port: 5432
  ## PostgreSQL User to create.
  postgresqlUsername: $postgresql_username
  ##
  ## PostgreSQL Password for the new user.
  ## If not set, a random 10 characters password will be used.
  postgresqlPassword: $postgresql_username
  ##
  ## PostgreSQL Database to create.
  postgresqlDatabase: superset
  ##
  ## Persistent Volume Storage configuration.
  ## ref: https://kubernetes.io/docs/user-guide/persistent-volumes
  persistence:
    ##
    ## Enable PostgreSQL persistence using Persistent Volume Claims.
    enabled: true
    ##
    ## Persistant class
    # storageClass: classname
    ##
    ## Access modes:
    accessModes:
      - ReadWriteOnce

## Configuration values for the Redis dependency.
## ref: https://github.com/kubernetes/charts/blob/master/stable/redis/README.md
redis:
  ##
  ## Use the redis chart dependency.
  ## Set to false if bringing your own redis.
  enabled: true

  usePassword: false

  ##
  ## The name of an existing secret that contains the redis password.
  existingSecret:

  ## Name of the key containing the secret.
  existingSecretKey: redis-password

  ##
  ## If you are bringing your own redis, you can set the host in redisHost.
  ## redisHost:
  ##
  ## Redis password
  ##
  password: superset
  ##
  ## Master configuration
  master:
    ##
    ## Image configuration
    # image:
    ##
    ## docker registry secret names (list)
    # pullSecrets: nil
    ##
    ## Configure persistance
    persistence:
      ##
      ## Use a PVC to persist data.
      enabled: true
      ##
      ## Persistant class
      # storageClass: classname
      ##
      ## Access mode:
      accessModes:
        - ReadWriteOnce
  ##
  ## Disable cluster management by default.
  cluster:
    enabled: false

nodeSelector: {}

tolerations: []

affinity: {}


EOF