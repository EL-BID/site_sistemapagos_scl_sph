DOCUMENTO CONFIDENCIAL - BORRADOR Vrs. 1

# Autenticación.

Esta interfaz será única para todas las aplicaciones que implementan Single Sign On.
Para acceder a la aplicación ingresa a https://site.drakecore.com/

![Autenticación](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/Login.png)

Una vez cargada la página de "Iniciar Sesión", ingresamos las credenciales de usuario o email y contraseña, damos clic a Iniciar sesión.
En caso de no recordar la contraseña debe solicitarse al Administrador. 

# Menú Principal.

Esta interfaz es el punto de inicio de toda la solución. Desde aquí los usuarios acceden a los servicios o aplicaciones disponibles en el sistema. 

![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/MenuPrincipal.png)
Existen dos tipos de roles mediante los cuales los usuarios podrán acceder al sistema:
1.	Usuario administrador: Podrá acceder a los ítems “Administrador” y “Aplicaciones” teniendo así acceso a todas las opciones brindadas por el sistema. En el ítem “Administrador” este usuario tendrá disponible las opciones de “Gestionar identidades”, “Gestionar BD” y “Consultar Log de transacciones” 
2.	Usuario regular: Podrá acceder al ítem “Aplicaciones”. En el ítem “Aplicaciones” el usuario tendrá disponible las opciones de “Consultar beneficiarios”, “Cargar información de beneficiarios”, “Reporte a bancos”, “Generar/ver reportes”

En la esquina superior derecha se encuentran el nombre del usuario que accede al sistema y al lado derecho de este la opción de “Cerrar sesión”. 
En la esquina superior izquierda se encuentra el logo del SITE y al lado izquierdo de este encontraremos el “Menú de acceso rápido”.

**Menú de acceso rápido.**

![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/MenuLateral.png)

Al dar clic en los tres (3) puntos se desplegará un menú con las opciones de acceso para los usuarios administradores - si es el caso - y para los usuarios regulares. 
# Consultar Beneficiarios.

La primera opción a la que podrán acceder los usuarios regulares es a "Consultar beneficiarios".
Este grupo de interfaces está dispuesto para permitir la búsqueda y visualización del detalle de un beneficiario en particular y su grupo familiar. La búsqueda de los beneficiarios podrá efectuarse con el diligenciamiento de uno o de varios campos, los cuales son: "Primer nombre", "Segundo nombre", "Primer apellido", "Segundo apellido", "Número de cédula", "Número de la cuenta bancaria".

![Búsqueda de beneficiarios](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/BusquedaBeneficiarios.png)

**Resultados de la búsqueda.**
Al diligenciar uno o varios campos y dar clic en "Buscar", los registros que coincidan con el criterio de búsqueda serán listados en una tabla. La tabla desplegara los nombres, cedula, y otra información importante de visualización. En caso de necesitar realizar una nueva búsqueda, para eliminar la información diligenciada dar clic en "Limpiar".

Cada uno los registros listados en la tabla, tienen un enlace contenido en el campo "Cédula" para visualizar el detalle del beneficiario y/o activar o desactivar un beneficiario de acuerdo con el nivel de permiso que tenga el usuario. 

![Resultados Beneficiarios](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/BuscarBeneficiario2.png)

**Detalle de beneficiario y botón activar/inactivar beneficiario.**
Al dar clic en la cédula de un beneficiario, se desplegara una nueva venta con la información detallada de este beneficiario y la información de su cuadro familiar. Adicionalmente en la parte superior izquierda de la información detallada del beneficiario encontramos el botón "Activar" usuario, el cual al darle clic cambia a "Inactivar". 
En la parte inferior encontramos la opción de "Regresar a beneficiarios", al dar clic regresaremos a la pestaña de "Consultar beneficiarios".

![Resultados Beneficiarios](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/BuscarBeneficiario2.png)

# Cargar información de beneficiarios (Importar archivos).

![Cargar información de beneficiarios](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco1.png)

Al dar clic en la opción "Cargar información beneficiarios" del menú principal o del menú de acceso rápido se despliega una nueva ventana donde se podrán importar los archivos al sistema.  
Esta interfaz esta provista para permitir la importación de archivos que son entregados por las distintas instituciones.

Al dar clic en "Tipo de archivo a cargar" se listan los diferentes archivos que se pueden importar, los cuales son:

- Archivo de base de datos inicial - Superintendencia bancaria
- Base de datos actualizada - Superintendencia bancaria
- Base de datos actualizada - Autoridad de registro civil
- Base de datos actualizada - Autoridad migratoria
- Reporte de pago instituciones bancarias 
- Base de datos cuadro familiar

Para mas detalles de los formatos ver la sección [Formatos](#formatos)

**Previsualización.**

Al elegir el "Tipo de archivo a cargar" y "Seleccionar archivo", dar clic en en el botón "Previsualizar documentos". 
![Cargar información de beneficiarios](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco1.png)

Al dar clic en "Previsualizar documento" se listara una tabla con la información contenida en el archivo. En la parte inferior de la tabla se encuentran las opciones "Cargar información" y "Cancelar". Al dar clic en "Cancelar" regresamos a la interfaz "Cargar información beneficiarios".
![Previsualización del archivo](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco3.png)

-------

![Botón de carga del archivo del archivo](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco3_1.png)

Al dar clic en la opción "Cargar información" se despliega un dialogo o notificación de carga del archivo, en donde podremos observar el porcentaje de carga del mismo.

![Dialogo de carga del archivo](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco_3_1_url.png)

Al cargarse completamente el archivo, el sistema despliega una notificación de confirmación de carga exitosa del archivo. En caso de presentarse error en el cargue del archivo el sistema despliega una notificación informando el error.

![Dialogo de carga del archivo](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/CargarBanco5OK.png)

# Reporte a bancos (Exportar archivos).

Esta interfaz esta provista para la exportación de archivos hacia los bancos o el banco central. 
Para mas detalles de los formatos ver la sección [Formatos](#formatos)
Al dar clic en "Tipo de planilla a exportar" se listan los diferentes archivos que se pueden exportar:

- Planilla de pagos para banco central
- Planilla de pagos para bancos

En la opción "Seleccionar banco" se listan los bancos a los cuales se le realizan las transferencias y en las opciones "Fecha de inicio" y "Fecha de finalización" podemos elegir el rango de fechas en la que queremos sea desplegado el reporte.


![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/ExportarBanco.png)

# Reporte de Beneficiarios.

Esta interfaz es provista por Apache Superset, dispone el reporte de usuarios activos e inactivos, así como otras opciones de filtrado por estado, institución bancaria, estado civil, y tipo de beneficiario.

![Menú Principal](https://github.com/BID-SCL/site_sistemapagos_sph/raw/master/docs/images/ReporteBeneficiariosActivos.png)

# Reporte de Logs.

Utilizando Apache Superset se creará un tablero para desplegar los eventos de las transacciones por usuario, permitiendo filtrar la información y generar reportes por Tipo, evento y usuario

![Menú Principal](https://raw.githubusercontent.com/BID-SCL/site_sistemapagos_sph/master/docs/images/LogDeTransacciones.png)


# Formatos 


**Archivo Base de Datos Inicial (Archivo BDI)** 

El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
|Código Identificación Banco   |  | Numérico   |
| Número de Cuenta Banco   |  | Numérico |
| Nacionalidad de la clienta  | E = Extranjero    | Alfabético   |
| Cédula de identidad de la clienta  |  | Numérico   |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  | | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Fecha de Nacimiento de la cliente   | Formato (MMDDAAAA).   | Numérico   |
| Clasificación por Tipo de Instrumento  | 4=Cuentas corrientes no remuneradas - 5=Cuentas corrientes remuneradas - 6=Depósitos de ahorro.   | Numérico   |
  

**Archivo Base de Datos Actualizada (Archivo BDA)** 

El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Código Identificación Banco  |  | Numérico   |
| Número de Cuenta Banco   |  | Numérico   |
| Nacionalidad de la clienta  |  | Alfabético  |
| Cédula de identidad de la clienta   |  | Numérico  |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  |  | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Fecha de Nacimiento de la cliente   | Formato (MMDDAAAA).   | Numérico   |
| Clasificación por Tipo de Instrumento  | 4=Cuentas corrientes no remuneradas - 5=Cuentas corrientes remuneradas - 6=Depósitos de ahorro.   | Numérico   |
| Nota de actualización   | NC=Nueva cuenta - CC=Cuenta cancelada | Alfabético |
  

**Archivos Reportes de Pago de las Instituciones Bancarias (Archivo RPIB)**  

El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Código Identificación Banco  |  | Numérico   |
| Número de Cuenta Banco   |  | Numérico  |
| Nacionalidad de la clienta   |  | Alfabético   |
| Cédula de identidad de la clienta   |  | Numérico  |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  | | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Resultado de la operación   | 1=Exitoso – 0=Rechazo  | Numérico |
| Razón rechazo  | CC=Cuenta cancelada - CB=Cuenta bloqueada -  ED=Error en datos - NA=No aplica.   | Alfabético   |
| Movimientos 21 días posteriores al pago | CM=Con movimiento - SM=Sin movimiento.   | Alfabético   |
| Devolución de recursos | 1=Si - 0=No | Numérico  |
| Monto a devolver   |  | Numérico  |
| Movimientos días siguientes a 21 días posteriores al pago  |  | Alfabético  |
| Periodo | | Alfabético  |


**Archivo Autoridad de registro civil (Archivo BDA)** 

El archivo será en formato CSV estándar RFC 4180.  


| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Nacionalidad de la clienta   | E=Extranjero -    | Alfabético  |
| Cédula de identidad de la clienta   |  | Numérico  |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  |  | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Fecha de Nacimiento de la cliente   | Formato (MMDDAAAA).   | Numérico   |
| Estatus | 1=Vivo -  2=Fallecido   | Numérico |

**Archivo Autoridad migratoria** 

El archivo será en formato CSV estándar RFC 4180.  
  
| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Nacionalidad de la clienta   | E=Extranjero    | Alfabético  |
| Cédula de identidad de la clienta   |  | Numérico  |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  |  | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Fecha de Nacimiento de la cliente   | Formato (MMDDAAAA).   | Numérico   |
| Estatus | 1=Dentro del país  -  0=Fuera del País     | Numérico |

**Archivo Cuadro Familiar** 

El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  |  | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Documento de identificación|  | Numérico  |
| Documento de identificación tipo   |  | Numérico |
| Estado Civil   |  | Numérico |
| Parentesco con la mujer beneficiaria   |  | Alfabético  |
| Aporta ingresos económicos  | 1=Si - 0=No | Numérico  |
| Nivel de escolaridad   |  | Alfabético   |
| Tipo de afiliación en salud  |  | Numérico   |
| Grupo de atención especial   |  | Alfabético  |
| Discapacidad   |  | Numérico   |
|Cedula Beneficiaria  |  | Numérico  |
| Estatus  | Activo - Inactivo  - Convertido (este registro se convirtió en un beneficiario)   | Alfanumérico  |



## Para la exportación de los archivos se generarán los siguientes casos:  

**Archivos Instituciones Bancarias (Archivo IB)** 
  
El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Código Identificación Banco   |  | Numérico |
| Número de Cuenta de la clienta   |  | Alfabético   |
| Nacionalidad de la clienta   | E=Extranjero  | Alfabético |
| Cédula de identidad de la clienta   |  | Numérico  |
| Primer Nombre   |  | Alfabético  |
| Segundo Nombre   |  | Alfabético   |
| Primer Apellido  |  | Alfabético   |
| Segundo Apellido  |  | Alfabético   |
| Monto a abonar   | | Numérico   |

Formato nombre de archivo:  
- Nombre: IB.  
- Código de la entidad bancaria suministrado por la Superintendencia bancaria.  
- Fecha de elaboración: (mes, día y año: MMDDAA).  
- Extensión. “.CSV”.  

  
**Archivo al Banco Central (Archivo BCV)** 

El archivo será en formato CSV estándar RFC 4180.  

| **NOMBRE**  | **DESCRIPCIÓN**  | **TIPO**  |
| --------------- | --------------- | --------------- |
| Código Identificación Banco |  | Numérico   |
| RNombre entidad bancaria   |  | Alfabético  |
| Número de cuenta entidad bancaria en el BCV   | | Numérico   |
| Número de cuenta bancaria UR   |  | Numérico  |
| Número de RIF de la UR   |  | Numérico     |
| Monto a abonar  | | Numérico |

 
Formato nombre de archivo:  
- Nombre: BC.  
- Fecha de elaboración: (mes, día y año: MMDDAA).  
- Extensión. “.CSV”.  
