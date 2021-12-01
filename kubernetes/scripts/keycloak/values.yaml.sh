set -o nounset

postgresql_username="$1"
postgresql_password="$2"
keycloak_realm="$3"
keycloak_username="$4"
keycloak_password="$5"

cat<<EOF
  # Optionally override the fully qualified name
  fullnameOverride: ""

  # Optionally override the name
  nameOverride: ""

  # The number of replicas to create (has no effect if autoscaling enabled)
  replicas: 1

  image:
    # The Keycloak image repository
    repository: disrupticallc/keycloak-site
    # Overrides the Keycloak image tag whose default is the chart version
    tag: "test"
    # The Keycloak image pull policy
    pullPolicy: Always

  # Image pull secrets for the Pod
  imagePullSecrets:
    - name: dockeraccess

  # Mapping between IPs and hostnames that will be injected as entries in the Pod's hosts files
  hostAliases: []
  # - ip: "1.2.3.4"
  #   hostnames:
  #     - "my.host.com"

  # Indicates whether information about services should be injected into Pod's environment variables, matching the syntax of Docker links
  enableServiceLinks: true

  # Pod management policy. One of "Parallel" or "OrderedReady"
  podManagementPolicy: Parallel

  # Pod restart policy. One of "Always", "OnFailure", or "Never"
  restartPolicy: Always

  serviceAccount:
    # Specifies whether a ServiceAccount should be created
    create: true
    # The name of the service account to use.
    # If not set and create is true, a name is generated using the fullname template
    name: ""
    # Additional annotations for the ServiceAccount
    annotations: {}
    # Additional labels for the ServiceAccount
    labels: {}
    # Image pull secrets that are attached to the ServiceAccount
    imagePullSecrets: []

  rbac:
    create: false
    rules: []
    # RBAC rules for KUBE_PING
    #  - apiGroups:
    #      - ""
    #    resources:
    #      - pods
    #    verbs:
    #      - get
    #      - list

  # SecurityContext for the entire Pod. Every container running in the Pod will inherit this SecurityContext. This might be relevant when other components of the environment inject additional containers into running Pods (service meshes are the most prominent example for this)
  podSecurityContext:
    fsGroup: 1000

  # SecurityContext for the Keycloak container
  securityContext:
    runAsUser: 1000
    runAsNonRoot: true

  # Additional init containers, e. g. for providing custom themes
  extraInitContainers: ""

  # Additional sidecar containers, e. g. for a database proxy, such as Google's cloudsql-proxy
  extraContainers: ""

  # Lifecycle hooks for the Keycloak container
  lifecycleHooks: |
  #  postStart:
  #    exec:
  #      command:
  #        - /bin/sh
  #        - -c
  #        - ls

  # Termination grace period in seconds for Keycloak shutdown. Clusters with a large cache might need to extend this to give Infinispan more time to rebalance
  terminationGracePeriodSeconds: 60

  # The internal Kubernetes cluster domain
  clusterDomain: cluster.local

  ## Overrides the default entrypoint of the Keycloak container
  command: []

  ## Overrides the default args for the Keycloak container
  args: []

  # Additional environment variables for Keycloak
  extraEnv: |
    - name: DB_VENDOR
      value: postgres
    - name: DB_ADDR
      value: postgresql.site.svc.cluster.local
    - name: DB_PORT
      value: "5432"
    - name: DB_DATABASE
      value: keycloak
    - name: KEYCLOAK_USER
      value: "$keycloak_username"
    - name: KEYCLOAK_PASSWORD
      value: "$keycloak_password"
    - name: KEYCLOAK_IMPORT
      value: /tmp/import-realm.json

  # Additional environment variables for Keycloak mapped from Secret or ConfigMap
  extraEnvFrom: |
    - secretRef:
        name: '{{ include "keycloak.fullname" . }}-db'

  #  Pod priority class name
  priorityClassName: ""

  # Pod affinity
  affinity: |
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              {{- include "keycloak.selectorLabels" . | nindent 10 }}
            matchExpressions:
              - key: app.kubernetes.io/component
                operator: NotIn
                values:
                  - test
          topologyKey: kubernetes.io/hostname
      preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 100
          podAffinityTerm:
            labelSelector:
              matchLabels:
                {{- include "keycloak.selectorLabels" . | nindent 12 }}
              matchExpressions:
                - key: app.kubernetes.io/component
                  operator: NotIn
                  values:
                    - test
            topologyKey: failure-domain.beta.kubernetes.io/zone

  # Node labels for Pod assignment
  nodeSelector: {}

  # Node taints to tolerate
  tolerations: []

  # Additional Pod labels
  podLabels: {}

  # Additional Pod annotations
  podAnnotations: {}

  # Liveness probe configuration
  livenessProbe: |
    httpGet:
      path: /auth/
      port: http
    initialDelaySeconds: 300
    timeoutSeconds: 5

  # Readiness probe configuration
  readinessProbe: |
    httpGet:
      path: /auth/realms/master
      port: http
    initialDelaySeconds: 30
    timeoutSeconds: 1

  # Pod resource requests and limits
  resources: {}
    # requests:
    #   cpu: "500m"
    #   memory: "1024Mi"
    # limits:
    #   cpu: "500m"
    #   memory: "1024Mi"

  # Startup scripts to run before Keycloak starts up
  startupScripts:
    # WildFly CLI script for configuring the node-identifier
    keycloak.cli: |
      {{- .Files.Get "scripts/keycloak.cli" }}

  customScripts:

    import-realm.json: |
      {
          "realm": "$keycloak_realm",
          "enabled": true,
          "sslRequired": "external",
          "registrationAllowed": true,
          "requiredCredentials": [ "password" ],
          "users" : [
              {
                  "username" : "$keycloak_username",
                  "enabled": true,
                  "email" : "keycloak_email",
                  "firstName": "Administrator",
                  "lastName": "",
                  "credentials" : [
                      { "type" : "password",
                        "value" : "$keycloak_password" }
                  ],
                  "realmRoles": [ "user", "collaborator" ,"contributor","report" ],
                  "clientRoles": {
                      "account": ["view-profile", "manage-account"]
                  }
              }
          ],
          "roles" : {
              "realm" : [
                  {
                      "name": "user",
                      "description": "Privilegios de usuario regular"
                  },
                  {
                      "name": "collaborator",
                      "description": "Gestion de la información"
                  },
                  {
                      "name": "report",
                      "description": "Gestion de reportes en superset"
                  },
                  {
                      "name": "contributor",
                      "description": "Modificación de registros"
                  },
                  {
                      "name": "administrador",
                      "description": "Gestion del sistema"
                  }
              ]
          },
          "scopeMappings": [
              {
                  "client": "site",
                  "roles": ["user", "collaborator" ,"contributor","report"]
              }
          ],
          "clients": [
              {
                  "clientId": "site-front",
                  "name": "site-front",
                  "adminUrl": "",
                  "baseUrl": "https://site.drakecore.com",
                  "surrogateAuthRequired": false,
                  "enabled": true,
                  "alwaysDisplayInConsole": false,
                  "clientAuthenticatorType": "client-secret",
                  "redirectUris": [
                      "https://site.drakecore.com/*"
                  ],
                  "webOrigins": [
                      "*"
                  ],
                  "notBefore": 1617122645,
                  "bearerOnly": false,
                  "consentRequired": false,
                  "standardFlowEnabled": true,
                  "implicitFlowEnabled": false,
                  "directAccessGrantsEnabled": true,
                  "serviceAccountsEnabled": false,
                  "publicClient": true,
                  "frontchannelLogout": false,
                  "protocol": "openid-connect",
                  "attributes": {
                      "saml.assertion.signature": "false",
                      "saml.force.post.binding": "false",
                      "saml.multivalued.roles": "false",
                      "saml.encrypt": "false",
                      "login_theme": "site",
                      "oauth2.device.authorization.grant.enabled": "false",
                      "backchannel.logout.revoke.offline.tokens": "false",
                      "saml.server.signature": "false",
                      "saml.server.signature.keyinfo.ext": "false",
                      "use.refresh.tokens": "true",
                      "exclude.session.state.from.auth.response": "false",
                      "oidc.ciba.grant.enabled": "false",
                      "saml.artifact.binding": "false",
                      "backchannel.logout.session.required": "true",
                      "client_credentials.use_refresh_token": "false",
                      "saml_force_name_id_format": "false",
                      "saml.client.signature": "false",
                      "tls.client.certificate.bound.access.tokens": "false",
                      "saml.authnstatement": "false",
                      "display.on.consent.screen": "false",
                      "saml.onetimeuse.condition": "false"
                  },
                  "authenticationFlowBindingOverrides": {},
                  "fullScopeAllowed": true,
                  "nodeReRegistrationTimeout": -1,
                  "protocolMappers": [
                      {
                          "name": "ID",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-attribute-mapper",
                          "consentRequired": false,
                          "config": {
                              "aggregate.attrs": "true",
                              "userinfo.token.claim": "true",
                              "user.attribute": "ID",
                              "id.token.claim": "true",
                              "access.token.claim": "true",
                              "claim.name": "ID",
                              "jsonType.label": "String"
                          }
                      },
                      {
                          "name": "organization",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-attribute-mapper",
                          "consentRequired": false,
                          "config": {
                              "aggregate.attrs": "true",
                              "userinfo.token.claim": "true",
                              "user.attribute": "organization",
                              "id.token.claim": "true",
                              "access.token.claim": "true",
                              "claim.name": "organization",
                              "jsonType.label": "String"
                          }
                      }
                  ],
                  "defaultClientScopes": [
                      "web-origins",
                      "roles",
                      "profile",
                      "email"
                  ],
                  "optionalClientScopes": [
                      "address",
                      "phone",
                      "offline_access",
                      "microprofile-jwt"
                  ],
                  "access": {
                      "view": true,
                      "configure": true,
                      "manage": true
                  }
              },
              {
                  "clientId": "superset",
                  "name": "superset",
                  "adminUrl": "",
                  "baseUrl": "https://bi.drakecore.com",
                  "surrogateAuthRequired": false,
                  "enabled": true,
                  "alwaysDisplayInConsole": false,
                  "clientAuthenticatorType": "client-secret",
                  "redirectUris": [
                      "https://bi.drakecore.com/*"
                  ],
                  "webOrigins": [
                      "*"
                  ],
                  "notBefore": 1617122645,
                  "bearerOnly": false,
                  "consentRequired": false,
                  "standardFlowEnabled": true,
                  "implicitFlowEnabled": true,
                  "directAccessGrantsEnabled": true,
                  "serviceAccountsEnabled": true,
                  "authorizationServicesEnabled": true,
                  "publicClient": false,
                  "frontchannelLogout": false,
                  "protocol": "openid-connect",
                  "attributes": {
                      "saml.assertion.signature": "false",
                      "saml.force.post.binding": "false",
                      "saml.multivalued.roles": "false",
                      "saml.encrypt": "false",
                      "login_theme": "site",
                      "oauth2.device.authorization.grant.enabled": "false",
                      "backchannel.logout.revoke.offline.tokens": "false",
                      "saml.server.signature": "false",
                      "saml.server.signature.keyinfo.ext": "false",
                      "use.refresh.tokens": "true",
                      "exclude.session.state.from.auth.response": "false",
                      "oidc.ciba.grant.enabled": "false",
                      "saml.artifact.binding": "false",
                      "backchannel.logout.session.required": "false",
                      "client_credentials.use_refresh_token": "false",
                      "saml_force_name_id_format": "false",
                      "saml.client.signature": "false",
                      "tls.client.certificate.bound.access.tokens": "false",
                      "saml.authnstatement": "false",
                      "display.on.consent.screen": "false",
                      "saml.onetimeuse.condition": "false"
                  },
                  "authenticationFlowBindingOverrides": {},
                  "fullScopeAllowed": true,
                  "nodeReRegistrationTimeout": -1,
                  "protocolMappers": [
                      {
                          "name": "roles",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-client-role-mapper",
                          "consentRequired": false,
                          "config": {
                              "multivalued": "true",
                              "userinfo.token.claim": "true",
                              "id.token.claim": "false",
                              "access.token.claim": "true",
                              "claim.name": "roles",
                              "jsonType.label": "String",
                              "usermodel.clientRoleMapping.clientId": "site"
                          }
                      },
                      {
                          "name": "organization",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-attribute-mapper",
                          "consentRequired": false,
                          "config": {
                              "aggregate.attrs": "true",
                              "userinfo.token.claim": "true",
                              "user.attribute": "organization",
                              "id.token.claim": "true",
                              "access.token.claim": "true",
                              "claim.name": "organization",
                              "jsonType.label": "String"
                          }
                      },
                      {
                          "name": "realm roles",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-realm-role-mapper",
                          "consentRequired": false,
                          "config": {
                              "multivalued": "true",
                              "userinfo.token.claim": "true",
                              "id.token.claim": "false",
                              "access.token.claim": "true",
                              "claim.name": "roles",
                              "jsonType.label": "String"
                          }
                      },
                      {
                          "name": "ID",
                          "protocol": "openid-connect",
                          "protocolMapper": "oidc-usermodel-attribute-mapper",
                          "consentRequired": false,
                          "config": {
                              "aggregate.attrs": "true",
                              "userinfo.token.claim": "true",
                              "user.attribute": "ID",
                              "id.token.claim": "true",
                              "access.token.claim": "true",
                              "claim.name": "ID",
                              "jsonType.label": "String"
                          }
                      }
                  ],
                  "defaultClientScopes": [
                      "web-origins",
                      "roles",
                      "profile",
                      "email"
                  ],
                  "optionalClientScopes": [
                      "address",
                      "phone",
                      "offline_access",
                      "microprofile-jwt"
                  ],
                  "access": {
                      "view": true,
                      "configure": true,
                      "manage": true
                  }
              }
            ],
            "clientScopeMappings": {
                "account": [
                    {
                        "client": "site",
                        "roles": ["view-profile"]
                    }
                ]
            }
          }


  # Add additional volumes, e. g. for custom themes
  extraVolumes: ""

  # Add additional volumes mounts, e. g. for custom themes
  extraVolumeMounts: ""

  # Add additional ports, e. g. for admin console or exposing JGroups ports
  extraPorts: []

  # Pod disruption budget
  podDisruptionBudget: {}
  #  maxUnavailable: 1
  #  minAvailable: 1

  # Annotations for the StatefulSet
  statefulsetAnnotations: {}

  # Additional labels for the StatefulSet
  statefulsetLabels: {}

  # Configuration for secrets that should be created
  secrets:
    db:
      stringData:
        DB_USER: '$postgresql_username'
        DB_PASSWORD: '$postgresql_password'

  service:
    # Annotations for headless and HTTP Services
    annotations: {}
    # Additional labels for headless and HTTP Services
    labels: {}
    # key: value
    # The Service type
    type: NodePort
    # Optional IP for the load balancer. Used for services of type LoadBalancer only
    loadBalancerIP: ""
    # The http Service port
    httpPort: 80
    # The HTTP Service node port if type is NodePort
    httpNodePort: null
    # The HTTPS Service port
    httpsPort: 443
    # The HTTPS Service node port if type is NodePort
    httpsNodePort: null
    # The WildFly management Service port
    httpManagementPort: 9990
    # The WildFly management Service node port if type is NodePort
    httpManagementNodePort: null
    # Additional Service ports, e. g. for custom admin console
    extraPorts: []
    # When using Service type LoadBalancer, you can restrict source ranges allowed
    # to connect to the LoadBalancer, e. g. will result in Security Groups
    # (or equivalent) with inbound source ranges allowed to connect
    loadBalancerSourceRanges: []
    # Session affinity
    # See https://kubernetes.io/docs/concepts/services-networking/service/#proxy-mode-userspace
    sessionAffinity: ""
    # Session affinity config
    sessionAffinityConfig: {}

  ingress:
    # If "true", an Ingress is created
    enabled: false
    # The Service port targeted by the Ingress
    servicePort: http
    # Ingress annotations
    annotations: {}
      ## Resolve HTTP 502 error using ingress-nginx:
      ## See https://www.ibm.com/support/pages/502-error-ingress-keycloak-response
      # nginx.ingress.kubernetes.io/proxy-buffer-size: 128k

    # Additional Ingress labels
    labels: {}
    # List of rules for the Ingress
    rules:
      -
        # Ingress host
        host: '{{ .Release.Name }}.keycloak.example.com'
        # Paths for the host
        paths:
          - /
    # TLS configuration
    tls:
      - hosts:
          - keycloak.example.com
        secretName: ""

    # ingress for console only (/auth/admin)
    console:
      # If "true", an Ingress is created for console path only
      enabled: false
      # Ingress annotations for console ingress only
      # Useful to set nginx.ingress.kubernetes.io/whitelist-source-range particularly
      annotations: {}
      rules:
        -
          # Ingress host
          host: '{{ .Release.Name }}.keycloak.example.com'
          # Paths for the host
          paths:
            - /auth/admin/

  ## Network policy configuration
  networkPolicy:
    # If true, the Network policies are deployed
    enabled: false

    # Additional Network policy labels
    labels: {}

    # Define all other external allowed source
    # See https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#networkpolicypeer-v1-networking-k8s-io
    extraFrom: []

  route:
    # If "true", an OpenShift Route is created
    enabled: false
    # Path for the Route
    path: /
    # Route annotations
    annotations: {}
    # Additional Route labels
    labels: {}
    # Host name for the Route
    host: ""
    # TLS configuration
    tls:
      # If "true", TLS is enabled for the Route
      enabled: false
      # Insecure edge termination policy of the Route. Can be "None", "Redirect", or "Allow"
      insecureEdgeTerminationPolicy: Redirect
      # TLS termination of the route. Can be "edge", "passthrough", or "reencrypt"
      termination: edge

  pgchecker:
    image:
      # Docker image used to check Postgresql readiness at startup
      repository: docker.io/busybox
      # Image tag for the pgchecker image
      tag: 1.32
      # Image pull policy for the pgchecker image
      pullPolicy: IfNotPresent
    # SecurityContext for the pgchecker container
    securityContext:
      allowPrivilegeEscalation: false
      runAsUser: 1000
      runAsGroup: 1000
      runAsNonRoot: true
    # Resource requests and limits for the pgchecker container
    resources:
      requests:
        cpu: "10m"
        memory: "16Mi"
      limits:
        cpu: "10m"
        memory: "16Mi"

  postgresql:
    # If "true", the Postgresql dependency is enabled
    enabled: false
    # PostgreSQL User to create
    postgresqlUsername:  $postgresql_username
    # PostgreSQL Password for the new user
    postgresqlPassword: $postgresql_username
    # PostgreSQL Database to create
    postgresqlDatabase: keycloak
    # PostgreSQL network policy configuration
    networkPolicy:
      enabled: false

  serviceMonitor:
    # If "true", a ServiceMonitor resource for the prometheus-operator is created
    enabled: false
    # Optionally sets a target namespace in which to deploy the ServiceMonitor resource
    namespace: ""
    # Optionally sets a namespace for the ServiceMonitor
    namespaceSelector: {}
    # Annotations for the ServiceMonitor
    annotations: {}
    # Additional labels for the ServiceMonitor
    labels: {}
    # Interval at which Prometheus scrapes metrics
    interval: 10s
    # Timeout for scraping
    scrapeTimeout: 10s
    # The path at which metrics are served
    path: /metrics
    # The Service port at which metrics are served
    port: http-management

  extraServiceMonitor:
    # If "true", a ServiceMonitor resource for the prometheus-operator is created
    enabled: false
    # Optionally sets a target namespace in which to deploy the ServiceMonitor resource
    namespace: ""
    # Optionally sets a namespace for the ServiceMonitor
    namespaceSelector: {}
    # Annotations for the ServiceMonitor
    annotations: {}
    # Additional labels for the ServiceMonitor
    labels: {}
    # Interval at which Prometheus scrapes metrics
    interval: 10s
    # Timeout for scraping
    scrapeTimeout: 10s
    # The path at which metrics are served
    path: /auth/realms/master/metrics
    # The Service port at which metrics are served
    port: http

  prometheusRule:
    # If "true", a PrometheusRule resource for the prometheus-operator is created
    enabled: false
    # Annotations for the PrometheusRule
    annotations: {}
    # Additional labels for the PrometheusRule
    labels: {}
    # List of rules for Prometheus
    rules: []
    # - alert: keycloak-IngressHigh5xxRate
    #   annotations:
    #     message: The percentage of 5xx errors for keycloak over the last 5 minutes is over 1%.
    #   expr: |
    #     (
    #       sum(
    #         rate(
    #           nginx_ingress_controller_response_duration_seconds_count{exported_namespace="mynamespace",ingress="mynamespace-keycloak",status=~"5[0-9]{2}"}[1m]
    #         )
    #       )
    #       /
    #       sum(
    #         rate(
    #           nginx_ingress_controller_response_duration_seconds_count{exported_namespace="mynamespace",ingress="mynamespace-keycloak"}[1m]
    #         )
    #       )
    #     ) * 100 > 1
    #   for: 5m
    #   labels:
    #     severity: warning

  autoscaling:
    # If "true", a autoscaling/v2beta2 HorizontalPodAutoscaler resource is created (requires Kubernetes 1.18 or above)
    # Autoscaling seems to be most reliable when using KUBE_PING service discovery (see README for details)
    # This disables the "replicas" field in the StatefulSet
    enabled: false
    # Additional HorizontalPodAutoscaler labels
    labels: {}
    # The minimum and maximum number of replicas for the Keycloak StatefulSet
    minReplicas: 3
    maxReplicas: 10
    # The metrics to use for scaling
    metrics:
      - type: Resource
        resource:
          name: cpu
          target:
            type: Utilization
            averageUtilization: 80
    # The scaling policy to use. This will scale up quickly but only scale down a single Pod per 5 minutes.
    # This is important because caches are usually only replicated to 2 Pods and if one of those Pods is terminated this will give the cluster time to recover.
    behavior:
      scaleDown:
        stabilizationWindowSeconds: 300
        policies:
          - type: Pods
            value: 1
            periodSeconds: 300

  test:
    # If "true", test resources are created
    enabled: false
    image:
      # The image for the test Pod
      repository: docker.io/unguiculus/docker-python3-phantomjs-selenium
      # The tag for the test Pod image
      tag: v1
      # The image pull policy for the test Pod image
      pullPolicy: IfNotPresent
    # SecurityContext for the entire test Pod
    podSecurityContext:
      fsGroup: 1000
    # SecurityContext for the test container
    securityContext:
      runAsUser: 1000
      runAsNonRoot: true

EOF