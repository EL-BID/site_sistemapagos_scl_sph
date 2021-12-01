
[![Analytics](https://gabeacon.irvinlim.com/UA-4677001-16/site_sistemapagos_scl_sph/readme?useReferer)](https://github.com/EL-BID/site_sistemapagos_scl_sph)

<h1 align="center"> SITE - Sistema Informático de Transferencias de Emergencia</h1>


<p align="center"><img src="https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/Favicon_2x.png"/></p> 

<p align="center"><img src="https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/MenuLateral.png"/></p> 


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EL-BID_guia-de-publicacion&metric=alert_status)](https://sonarcloud.io/dashboard?id=EL-BID_guia-de-publicacion)


## Descripción y contexto.
---
Las transferencias monetarias a los hogares ha sido la estrategia seleccionada para afrontar los retos de corto y largo plazo que tienen muchos países en Latino América y el Caribe para superar la pobreza a través de programas de inclusión social, tales como el Programa de Transferencias de Emergencia (PTE) y el Programa de Transferencias para la Inclusión Social (PTIS). 

El Programa de Transferencias de Emergencia prevé realizar transferencias a todos los hogares del país, teniendo a las mujeres mayores de 18 años como receptoras y representantes de los hogares.

Progresivamente el programa de transferencias de emergencia irá dando paso al programa de transferencias focalizadas y condicionadas, hasta lograr el objetivo final de instaurar un sistema de transferencias directas dirigido a crear las condiciones para la superación de la pobreza estructural.

SITE pretende ser el sistema inicial para gestionar la información de programa de este tipo. Esta aplicación del tipo web, gestionada en Kubernetes y con un diseño arquitectónico de micro-aplicaciones (micro-applications.org) presenta un sistema que se puede instalar, escalar, modificar y mantener de manera muy fácil en servidores locales o cualquier proveedor de computación en la nube con soporte a Kubernetes. 

 	
## Guía de instalación.
---
### Requsitos de Instalación.

Para ejecutar el siguiente código se requiere:

- Cluster de kubernetes: kind k3s, EKS, OpenShift, Rancher GKE, AKS, DIgitalOcean
- Linux - debian
- Kubernetes 1.12+
- Kubelet
- Helm 2.11+ 
- Un servidor con las siguientes características mínimas:
      - Conexión a Internet
      - CPU: 3 core @ 2.5 GHz
      - RAM: 12Gb
      - Espacio en Disco: 50 GB

### Prerequisitos.

- Clonar el repositorio https://github.com/EL-BID/site_sistemapagos_scl_sph y abrir la terminar en la raíz del proyecto
- Instalar Openssl e Istioctl

      cd kubernetes
      ./prerequisites.sh
- Generar certificados para NGINX. La generación de estos certificados es opcional, por defecto el instalador tiene unos certificados de prueba previamente generados.

Nota: Se debe reemplazar example.com por el dominio de la aplicación.

      openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example.com.key -out example.com.crt
      openssl req -out nginx.example.com.csr -newkey rsa:2048 -nodes -keyout nginx.example.com.key -subj "/CN=nginx.example.com/O=nginx organization"
      openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 0 -in nginx.example.com.csr -out nginx.example.com.crt
      Replace private key and certificate in the file /kubernetes/scripts/nginx/secret.yaml
      kubectl apply -f secret.yaml


### Comandos de instalación
      cd kubernetes
      ./install.sh

Luego de ejecutar los comandos anteriores, debe responder cada una de las preguntas que el script muestra en pantalla e ingresar los datos solicitados

El superuser para el postgres es por defecto postgres


- ¿Desea remover instalaciones anteriores? Responder **n**
- ¿Es la primera instalación? Responder **y**
- ¿Instalar base de datos PostgreSQL? Responder **y**
  - Ingrese el usuario: usuario
  - Ingrese el clave del usuario: clave
  - Ingrese el clave del usuario root: claveroot
  - Ingrese el tamaño de disco de postgres (persistence size (Ejemplo: 10Gi)): 10Gi
- ¿Instalar Pgadmin? Responder **y**
  - Ingrese el email para administrar pgadmin: dbadmin@example.com
  - Ingrese la clave para administrar pgadmin: clavepgadmin
- ¿Instalar el credential manager o keycloak? Responder **y**
  - Ingrese el nombre del realm: site
  - Ingrese el email de administración del realm: keycloakadmin@example.com
  - Ingrese la clave de administración del realm: clavekeycloak
- ¿Instalar el API REST? Responder **y**
- ¿Instalar SITE front end? Responder **y**


Instalación de superset

La instalación del apache superset se hace posterior al resto de la instalación, ya que es necesario obtener parametros del credential manager para configurar el inicio de sesión.

1. Iniciar sesión en keycloak
2. Ir a la lista de clientes y seleccionar superset
3. Ir a la pestaña credentials y copiar el valor del secret
4. Pegar el valor en la linea 113 del archivo kubernetes/scripts/superset/values.yaml.sh o
configOverrides.enable_oauth.OAUTH_PROVIDERS.remote_app.client_secret
5. Ejecutar el script de instalación del superset

       cd kubernetes
       ./superset.sh

Luego de ejecutar los comandos anteriores, debe confirmar la instalación e ingresar los datos solicitados

- ¿Instalar superset? Responder **y**
  - Ingrese el usuario postgres (el mismo ingresado en el script anterior): usuarioroot
  - Ingrese el clave del usuario postgres (el mismo ingresado en el script anterior): claveroot
  - Ingrese el username de administración de superset: supersetadmin
  - Ingrese la clave de administración de superset: clavesuperset
  - Ingrese el tamaño de disco de superset  (persistence size (Ejemplo: 5Gi)): 10Gi

### Configuración adicional posterior a la instalación.

Apache superset posee los roles admin, alpha, gamma y public. Cada rol tiene niveles diferentes de administración, lectura o escritura.

Para que el nombre de los roles y el nivel de acceso coincida con los roles del credential manager debe cambiar en el superset los nombres de los roles de la siguiente manera:
- Admin: administrador
- Alfa: contribuidor
- Gama: colaborador

Aunque apache superset está integrado con keycloak para el inicio de sesión, es necesario que el administrador del sistema cree los usuarios en apache superset y les asigne un rol.


Modificar y ejecutar el archivo gateway para tener acceso a los servicios desde fuera del cluster, según los DNS del servicio

      cd kubernetes/scripts
      kubectl apply -f gateway.yaml -n site


Creación de tablas en la base de datos SITE

1. Ingresar al pgadmin previamente instalado.
2. Autenticarse con las credenciales escritas durante el script.
3. Abrir cada uno de los archivos de la carpeta kubernetes/scripts/database y copiar el contenido y pegarlo en la ventana de los scripts

- Instalar ingress: La instalación del ingress premite tener acceso a las diferentes aplicaciones fuera del cluster

      cd kubernetes/scripts
      kubectl apply -f gateway.yaml -n site

### Comandos de eliminación.

Si por algún motivo es necesario eliminar la instalación anterior puede ejecutar el siguiente script.

      cd kubernetes
      ./delete.sh

###  Dependencias.

El sistema se basa en los siguientes componentes de otros proveedores y que se detallan a continuación:

#### Servicios Pre-empaquetados.

- Nginx: actúa servidor proxy inverso y un acelerador web de alto rendimiento. Referirse a los siguientes enlaces para información oficial del producto: https://nginx.org/en/
https://nginx.org/en/docs/

- Keycloak: actúa como la solución de gestión de acceso e identidad. Keycloak se basa en protocolos estándar, por lo que puede usar cualquier biblioteca de recursos de OpenID Connect o biblioteca de proveedor de servicios SAML 2.0. Para mas información seguir la información oficial del producto https://www.keycloak.org/about
https://www.keycloak.org/documentation

- Apache Superset: actúa como la solución de inteligencia de negocios con una interfaz simple, rica en funciones de visualización de reportes. Para más información seguir la información de producto https://superset.apache.org/
https://superset.apache.org/docs/intro

- PgAdmin: es la herramienta de gestión de bases de datos PostgreSQL.

- PostgreSQL: es el sistema de base de datos relacional de objetos de código abierto con más de 30 años de desarrollo activo. Para más información seguir la información oficial de referencia https://www.postgresql.org/

## ¿Cómo contribuir?
---
Hemos puesto a disposición el código de esta herramienta y nos encantaría escuchar tu experiencia con ella. Para ver un listado de posibles mejoras que podrías hacer al SITE consulta la pestaña Issues de este repositorio y el CONTRIBUTING.md.


## Código de conducta. 
---
Puedes ver el código de conducta para este proyecto en el siguiente archivo CODEOFCONDUCT.md

## Autor/es.
---

© 2021 Banco Interamericano de Desarrollo y Disruptica LLC. Este software es el resultado de una cooperación técnica entre el Banco Interamericano de Desarrollo y Disruptica LLC. Los derechos de autor del software son compartidos por ambas organizaciones, incluso si el licenciante es únicamente el Banco Interamericano de Desarrollo.

**Banco Interamericano de Desarrollo**

- Diana Londoño
- Roberto Sánchez
- Marco Stampini
- Luis Tejerina

**Disruptica LLC**

- Jairo Anaya
- Felipe Jiménez
- Juliana Manrique
- Veronica Castillo
- Silvia Yepes




## Información adicional.
---
Este proyecto se inspira en el trabajo de Jay Anaya en micro-applications.org, para el desarrollo eficiente de código en Cloud Native. El diseño está basado en el concepto de micro aplicaciones para atomizar las funcionalidades del sistema al mismo tiempo que se separan los equipos de desarrollo y se definen las responsabilidades de negocio de los mismo. Este tipo de arquitectura permite el crecimiento de este a oeste y de norte a sur. 

El SITE sigue los siguientes objetivos de diseño:

- Rendimiento

- Robustez

- Seguridad

- Extensibilidad

- Usabilidad

### Enfoque de Diseño.



- Flujo de Datos

El flujo de datos de la aplicación es tipo web cliente servidor en una arquitectura principalmente del tipo micro-servicios con un enfoque de micro aplicaciones y soportada con una infraestructura de contendedores gestionada por Kubernetes. El almacenamiento de datos será centralizado en una base de datos en PostgreSQL. 

- Diseño Arquitectónico y patrón general de diseño

El diseño arquitectónico de la solución en general sigue un patrón de tres capas, la primera de seguridad, la segunda de servicios donde se alojan las APIs y aplicaciones clientes servidor o una combinación de ella y la tercera la capa de datos donde se almacenan los datos del sistema. Así mismo cada servicio definirá su propia arquitectura, prefiriéndose que las aplicaciones sigan el patrón de MVVC.

- Vista de alto nivel del sistema

En la siguiente figura se puede observar los componentes del sistema en un primer nivel de detalle.

<p align="center"><img src="https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/Design.png"/></p> 


A continuación, se presenta una descripción de cada uno de los componentes:

1.	Usuario UR: corresponde a los usuarios de sistema que tendrá cuatro roles, lectura, escritura, reportes y súper administración. 
2.	Firewall: es un componente físico o virtual provisto por la infraestructura de sistemas donde será alojada la aplicación. 
3.	Proxy Seguro: es un componente basado en NGINX que actuara como proxy para permitir el flujo seguro de datos desde internet hacia cada uno de los servicios o aplicaciones dentro la infraestructura. 
4.	Servicio de gestión de identidad: es un componente basado en Keycloak para la gestión de la identidad y el acceso de los usuarios al sistema. 
5.	API: es un componente basado en Loopback para el modelado de las API del tipo REST y GraphQL. 
6.	Aplicación de inteligencia de negocio: es un componente basado en Apache Superset para le generación de reportes desde la base de datos.
7.	Aplicación para la gestión de identidad: es un componente basado en la interfaz gráfica de Keycloak para la gestión de los usuarios y servicio de Keycloak en general. 
8.	Aplicación de gestión de la base de datos: es una aplicación basada en PgAdmin para la gestión total de la base de datos. 
9.	Aplicación para la gestión de los beneficiarios, importar y exportar archivos: es una aplicación del tipo SSR (Server Side Rendering) basada en Vue.js donde se modelarán los casos de uso relativo a la gestión de los beneficiarios.
11.	Base de datos: es el componente persistencia de datos basado en el motor PostgreSQL13.3 o superior.
12.	Sistema automático de gestión de contenedores: todos los servicios descritos anteriormente será contenedores que serán gestionados por Docker y Kubernetes. 
13.	Capa de hardware: corresponde al servidor o conjunto de servidores físicos o en la nube que sean capaces de correr los contenedores. 

- Reporte de Logs

Utilizando Apache Superset se creará un tablero para desplegar los eventos de las transacciones por usuario. 



## Licencia 
SITE es completamente gratis y de código abierto, licenciado bajo licencia [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Limitación de responsabilidades
IMPORTANTE: Esta sección es solo para herramientas financiadas por el BID.

El BID o Disruptica LLC no serán responsables, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.
