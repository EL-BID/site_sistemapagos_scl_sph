DOCUMENTO CONFIDENCIAL - BORRADOR Vrs. 1

# Autenticación.

Esta interfaz será única para todas las aplicaciones que implementan Single Sign On.
Para acceder a la aplicación ingresa a https://site.drakecore.com/

![Autenticación](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/SITE/Login.png)

Una vez cargada la página de "Iniciar Sesión", ingresamos las credenciales de usuario o email y contraseña, damos clic a Iniciar sesión.

# Menú Principal.

Esta interfaz es el punto de inicio de toda la solución. Desde aquí los usuarios acceden a los servicios o aplicaciones disponibles en el sistema. 

![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/SITE/MenuPrincipal.png)
El usuario administrador: Podrá acceder a los ítems “Administrador” y “Aplicaciones” teniendo así acceso a todas las opciones brindadas por el sistema. En el ítem “Administrador” este usuario tendrá disponible las opciones de “Gestionar identidades”, “Gestionar base de datos” y “Consultar Log de transacciones” 

En este documento se detallan las opciones a las que puede acceder el Usuario Administrador en el item "Administrador", las opciones de acceso como usuario regular se encuentran detalladas en el "Manual de Usuario Aplicación Búsqueda, Carga y Exportación de la Información- UR"

![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/SITE/MenuPrincipal.png)

Al acceder a la opción **"Gestionar identidades"**, el sistema remite al usario a **Keycloack**, el cual es una solución de gestión de acceso e identidad de código abierto destinada a aplicaciones y servicios de última generación. Keycloak facilita la protección de aplicaciones y servicios con poco o ningún código.

El objetivo de utilizar este servicio es que los usuarios se autentican con Keycloak y no con aplicaciones individuales. Esto significa que sus aplicaciones no tienen que lidiar con formularios de inicio de sesión, autenticar usuarios y almacenar usuarios. Una vez que haya iniciado sesión en Keycloak, los usuarios no tienen que volver a iniciar sesión para acceder a una aplicación diferente.

Esto también se aplica al cierre de sesión. Keycloak proporciona un cierre de sesión único, lo que significa que los usuarios solo tienen que cerrar la sesión una vez para cerrar la sesión de todas las aplicaciones que usan Keycloak.

Keycloak se basa en protocolos estándar, por lo que puede usar cualquier biblioteca de recursos de OpenID Connect o biblioteca de proveedor de servicios SAML 2.0.

A través de la consola de administración de cuentas, los super usuarios pueden administrar sus propias cuentas. Pueden actualizar el perfil, cambiar las contraseñas y configurar la autenticación de dos factores y gestionar las cuentas de los usuarios regulares, como solicitar cambio de contraseña o activar la autenticación de dos factores.

Los usuarios también pueden administrar sesiones y ver el historial de la cuenta.

Para gestionar la identidad el SITE utilizando KeyCloak se limitará al uso de los siguientes servicios: administrar permisos y roles, entre ellos crear usuario, editar usuario, desactivar usuario y ver el listado de usuario del sistema. 

Solo los usuarios administradores de la UR tendrán acceso a esta interfaz de administración donde podran gestionar los realms, clientes, y roles. Favor seguir la documentación de Keykloak para la administración https://www.keycloak.org/documentation.html.

El gestor de identidad del SITE tiene las siguientes configuraciones particulares

Realms
- Master: Realm donde se crean los usuarios que administran el gestor de identidad
- SITE: Realm donde se crean todos los usuarios que utilizan las aplicaciones de la UR

Clients
- Account-account-console-security-admin-console: Clients administrativos por defecto de keycloak cuando se crea el realm
- Site-front: Cliente de la aplicación de importar y explorar archivos de la UR
- Superset: Cliente de la aplicación de bussines intelligence apache superset

Roles
- Colaborador: Gestión de la información, tiene permisos de lectura
- Contribuidor: Gestión de la información y cargar archivos, tiene permisos de escritura y lectura
- Administrador: Gestión y administración del sistema, tiene permisos de escirtura y lectura.

Al acceder a **"Consultar log de transacciones"**, el usuario inicia sesión en **Apache Superset**, el cual es una aplicación de código abierto de BI moderna con una interfaz simple, rica en funciones de visualización de reportes. Esta aplicación es simple y no requiere programación, y permite al usuario explorar, filtrar y organizar datos. Así mismo cuenta con el editor SQL / IDE para consultas interactivas.

Puede establecer permisos utilizando los mismos roles definidos en Keycloak, así como otorgar acceso a determinadas vistas o menús. 

Apache superset está integrado con keycloak, pero es necesario crear los usuarios manualmente en la aplicación, coincidiendo el email en ambos sistemas.

Solo los usuarios administradores de la UR tendrán acceso a las opciones de administración de Apache Superset donde podran configurar los usuarios, roles, databases y datasets.

En la pestaña "settings" en la sección "security" están las siguientes opciones
 - List User: Tabla con la lista de usuarios registrados en el sitema de reportes, cada usuario tiene la opción de mostrar, editar o eliminar
- List Roles: Tabla con los roles registrados en el sistema. Los roles admin, colaborador y contribuidor coinciden con el alcance definido en el gestor de identidades

Para más información seguir la información de producto https://superset.apache.org/
https://superset.apache.org/docs/intro

Ver sección 2.6.4.6 para la visualización del reporte de ejemplo usuarios activos e inactivos.


Al acceder a **"Gestionar BD"**, el usuario accede a **PgAdmin¨**, que es una herramienta de gestión para PostgreSQL y bases de datos relacionales derivadas como EDB Advanced Server de EnterpriseDB. Puede ejecutarse como una aplicación web o de escritorio. 

Para el SITE en particular utilizando la aplicación Postgresql el usuario administrador ingresando un usuario y contraseña podrá acceder a los siguientes servicios que proveen total administración de los datos:

- Lista tablas de sistemas: para dar administración a todas las tablas utilizadas por el sistema administrador.
- Ejecutar consultas en lenguaje SQL sobre todas las tablas.
- Administrar usuarios de BD para dar permisos a otros usuarios en la gestión de la información. 

Este módulo es de super-administración y solo podrá ser accedido por el super-administrador del sistema. 

Restricciones adicionales como rango de IP y segundo factor de autenticación podrían aplicarse para asegurar la seguridad en el acceso al sistema.


