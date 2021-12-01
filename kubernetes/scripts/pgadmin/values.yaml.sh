set -o nounset

postgresql_username="$1"
pgadmin_email="$2"
pgadmin_password="$3"

cat<<EOF
  # Default values for pgadmin.

  replicaCount: 1

  ## pgAdmin container image
  ##
  image:
    repository: dpage/pgadmin4
    tag: 4.18
    pullPolicy: IfNotPresent

  service:
    type: NodePort
    port: 8090

  ## Strategy used to replace old Pods by new ones
  ## Ref: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy
  ##
  strategy: {}
    # type: RollingUpdate
    # rollingUpdate:
    #   maxSurge: 0
    #   maxUnavailable: 1

  ## Server definitions will be loaded at launch time. This allows connection
  ## information to be pre-loaded into the instance of pgAdmin in the container.
  ## Ref: https://www.pgadmin.org/docs/pgadmin4/4.13/import_export_servers.html
  ##
  serverDefinitions:
    ## If true, server definitions will be created
    ##
    enabled: true

    servers: |-
      "1": {
        "Name": "SITE databases",
        "Group": "Servers",
        "Port": 5432,
        "Username": "$postgresql_username",
        "Host": "postgresql.site.svc.cluster.local",
        "SSLMode": "prefer",
        "MaintenanceDB": "postgres"
      }

  ingress:
    ## If true, pgAdmin Ingress will be created
    ##
    enabled: false

    ## pgAdmin Ingress annotations
    ##
    annotations: {}
      # kubernetes.io/ingress.class: nginx
      # kubernetes.io/tls-acme: "true"

    ## pgAdmin Ingress hostnames with optional path
    ## Must be provided if Ingress is enabled
    hosts:
      - host: chart-example.local
        paths: []

    ## pgAdmin Ingress TLS configuration
    ## Secrets must be manually created in the namespace
    tls: []
    #  - secretName: chart-example-tls
    #    hosts:
    #      - chart-example.local


  ## pgAdmin startup configuration
  ## Values in here get injected as environment variables
  ##
  env:
    email: $pgadmin_email
    password: $pgadmin_password

    ## If True, allows pgAdmin to create session cookies based on IP address
    ## Ref: https://www.pgadmin.org/docs/pgadmin4/4.18/config_py.html
    #
    enhanced_cookie_protection: "False"

  persistentVolume:
    ## If true, pgAdmin will create/use a Persistent Volume Claim
    ## If false, use emptyDir
    ##
    enabled: true

    ## pgAdmin Persistent Volume Claim annotations
    ##
    annotations: {}

    ## pgAdmin Persistent Volume access modes
    ## Must match those of existing PV or dynamic provisioner
    ## Ref: http://kubernetes.io/docs/user-guide/persistent-volumes/
    accessModes:
      - ReadWriteOnce

    ## pgAdmin Persistent Volume Size
    ##
    size: 2Gi

    ## pgAdmin Persistent Volume Storage Class
    ## If defined, storageClassName: <storageClass>
    ## If set to "-", storageClassName: "", which disables dynamic provisioning
    ## If undefined (the default) or set to null, no storageClassName spec is
    ##   set, choosing the default provisioner.  (gp2 on AWS, standard on
    ##   GKE, AWS & OpenStack)
    ##
    # storageClass: "-"
    # existingClaim: ""

  ## Security context to be added to pgAdmin pods
  ##
  securityContext:
    runAsUser: 5050
    runAsGroup: 5050
    fsGroup: 5050

  resources:
    limits:
      cpu: 256m
      memory: 256Mi
    requests:
      cpu: 256m
      memory: 256Mi

  ## pgAdmin readiness and liveness probe initial delay and timeout
  ## Ref: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
  ##
  livenessProbe:
    initialDelaySeconds: 30
    periodSeconds: 60
    timeoutSeconds: 15
    successThreshold: 1
    failureThreshold: 3

  readinessProbe:
    initialDelaySeconds: 30
    periodSeconds: 60
    timeoutSeconds: 15
    successThreshold: 1
    failureThreshold: 3

  ## Node labels for pgAdmin pod assignment
  ## Ref: https://kubernetes.io/docs/user-guide/node-selection/
  ##
  nodeSelector: {}

  ## Node tolerations for server scheduling to nodes with taints
  ## Ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
  ##
  tolerations: []

  ## Pod affinity
  ##
  affinity: {}

EOF