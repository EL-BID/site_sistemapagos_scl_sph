export default {
  importFile: {
    title: "Cargar información beneficiarios",
    typeFile: "Tipo de archivo a cargar",
    selectFile: "Seleccionar archivo",
    loadFiles: "Cargar documentos",
    previewFiles: "Previsualizar documentos",
    typeFileLabel: "Tipo de archivo:",
    nameFileLabel: "Archivo importado:",
    alertTitle:
      "Se presentaron algunas alertas en la importación, despliega para conocer más",
    confirmButton: "Cargar información",
    cancelButton: "Cancelar",
    dangerTitleAlert: "Error",
    warningTitleAlert: "Documento en proceso",
    successTitleAlert: "Documento cargado con éxito",
    successMessageAlert:
      "El documento ha sido cargado con éxito en la base de datos del sistema",
    warningMessageAlert:
      "El documento esta siendo procesado. por favor guardar la URL para validación de cargue.",
    dangerMessageAlert:
      "Ocurrió un error procesando el documento, por favor revisar el cuadro de alertas.",
    totalRecordsLabel: "Total de registros:",
    noRecords: "No se encontraron registros",
    typeFileRequired: "El tipo de documento es requerido.",
    fileRequired: "El documento es requerido.",
    typeFileBDI: "Archivo de base de datos inicial - Superintendencia bancaria",
    typeFileBDA: "Base de datos actualizada - Superintendencia bancaria",
    typeFileARC: "Base de datos actualizada - Autoridad de registro civil",
    typeFileAM: "Base de Datos actualizada - Autoridad migratoria",
    typeFileRPIB: "Reportes de pago instituciones bancarias",
    typeFileFM: "Base de datos cuadro familiar"
  },
  detailsBeneficiary: {
    title: "Detalle beneficiario",
    beneficiaryTitle: "beneficiaria",
    familyGroupMemberTitle: "Grupo familiar",
    activate: "Activar",
    inactivate: "Inactivar",
    active: "Activo",
    inactive: "Inactivo",
    createdLabel: "Fecha de creación del registro:",
    ageLabel: "Edad:",
    updatedLabel: "Última actualización del registro:",
    bankCodeLabel: "Código entidad bancaria:",
    nationalIdNumberLabel: "Cédula:",
    accountNumberLabel: "Número de cuenta:",
    nationalIdTypeLabel: "Tipo cliente:",
    instrumentLabel: "Tipo de cuenta:",
    birthdayLabel: "Fecha de nacimiento:",
    statusLabel: "Estatus:",
    backBeneficiaries: "Regresar a beneficiarios",
    messageAlert: "¿Está seguro de {status} el beneficiario?",
    titleAlert: "{status} beneficiario"
  },
  reportToBanks: {
    title: "Reporte a bancos",
    typeFileLabel: "Tipo de planilla a exportar",
    selectedBanksLabel: "Bancos deleccionados:",
    banksLabel: "Seleccionar el banco",
    initialDateLabel: "Fecha de inicio",
    finishDate: "Fecha de finalización",
    previewDocumentButton: "Previsualizar documento",
    previewDocumentTitle: "Previsualización del archivo",
    exportButton: "Exportar",
    cancelButton: "Cancelar",
    noRecords: "No se encontraron registros",
    typeFileCentralBank: "Planilla de pagos para banco central",
    typeFileBanks: "Planilla de pagos para bancos"
  },
  searchBeneficiary: {
    title: "Consultar beneficiarios",
    resultTitle: "Resultados de la busqueda",
    noRecords: "No se encontraron registros",
    nationalIdType: "Tipo cliente",
    nationalIdNumber: "Cédula",
    firstName: "Primer nombre",
    middleName: "Segundo nombre",
    lastName1: "Primer apellido",
    lastName2: "Segundo apellido",
    birthday: "Fecha de nacimiento",
    bankCode: "Código entidad bancaria",
    accountNumber: "Número de cuenta",
    instrument: "Tipo de cuenta",
    status: "Estatus",
    created: "Fecha de creación (DD/MM/YYYY)"
  },
  generatePayments: {
    title: "Generación de reporte de pagos",
    amount: "Monto",
    amountRequired: "El monto es requerido.",
    period: "Periodo",
    periodRequired: "El periodo es requerido.",
    generatePayments: "Generar reporte",
    infoTitleAlert: "Confirmación generación de reporte",
    warningTitleAlert: "El reporte ya existe",
    dangerTitleAlert: "Error en generación de reporte de pago",
    successTitleAlert: "Reporte generado con éxito",
    successMessageAlert: "El reporte de pago ha sido generado con éxito.",
    warningMessageAlert: "El reporte del periodo seleccionado ya fue generado anteriormente.",
    infoMessageAlert: "¿Está seguro de generar el reporte pago?",
    dangerMessageAlert: "Ocurrió un error en la generación del reporte de pagos."
  },
  header: {
    logout: "Cerrar sesión"
  },
  error: {
    message: "Upps, algo inesperado sucedió"
  },
  accordion: {
    genderLabel: "Género:",
    female: "Femenino",
    male: "Masculino",
    educationLevelLabel: "Nivel de escolaridad:",
    nationalIdNumberLabel: "Cédula:",
    healthInsuranceLabel: "Tipo de afiliación en la salud:",
    yes: "Si",
    no: "No",
    maritalStatusLabel: "Estado civil:",
    specialNeedsLabel: "Grupo de atención especial:",
    relationshipLabel: "Parentesco:",
    handicapLabel: "Discapacidad:",
    addIncomeLabel: "Aporta ingresos económicos:"
  },
  alert: {
    closeButton: "Cerrar",
    confirmButton: "Confirmar"
  },
  grid: {
    noRecords: "No hay registros"
  },
  footer: {
    text: "SITE - Sistema informático de gestión del PTE"
  },
  menu: {
    manageIdentities: "Gestionar identidades",
    manageDB: "Gestionar BD",
    searchTransactionLog: "Consultar log de transacciones",
    searchBeneficiary: "Consultar benficiarios",
    importFile: "Cargar información beneficiarios",
    reportToBanks: "Reporte a bancos",
    viewReports: "Generar / Ver reportes",
    generatePayments: "Generación de pagos"
  },
  filterSearch: {
    firstNameLabel: "Primer nombre",
    middleNameLabel: "Segundo nombre",
    lastName1Label: "Primer apellido",
    lastName2Label: "Segundo apellido",
    nationalIdNumberLabel: "Número de cédula",
    accountNumberLabel: "Número de cuenta bancaria",
    searchButton: "Buscar",
    clearButton: "Limpiar"
  }
};
