export const VERSION_DATE = "05/01/2018";
export const PERSONA_NATURAL = 451;
export const PERSONA_JURIDICA = 452;
export const FILE_OPTION_SOCIAL_STYLE_CONTACT = 1;
export const FILE_OPTION_REPORT_VISIT = 2;
export const FILE_OPTION_SHOPPING_MAP = 3;
export const FILE_OPTION_PRE_VISIT_GUIDE = 4;
export const CONSULT_PARAMETER_NAME = 'CONSULT_PARAMETER_NAME';
export const CHANGE_VALUE_LOGS = 'CHANGE_VALUE_LOGS';
export const CONSULT_VALUE_LOGS = 'CONSULT_VALUE_LOGS';
export const SAVE_DRAFT = 0;
export const SAVE_PUBLISHED = 1;
export const REQUEST_ERROR = 500;
export const REQUEST_ERROR_XSS = 600;
export const REQUEST_SUCCESS = 200;
export const ERROR_MESSAGE_REQUEST_TITLE = 'Error cargando información';
export const ERROR_MESSAGE_REQUEST = 'Lo sentimos, ocurrió un error ejecutando la acción.';
export const MESSAGE_USER_WITHOUT_PERMISSIONS = 'Lo sentimos, usted no tiene permisos para ejecutar la acción.';
export const ACTIVE_LOGS = "db6d27e0-9a1d-4286-805b-6732d4cacc6d";
export const SESSION_EXPIRED = "-2";
export const MESSAGE_SAVE_DATA = "Guardando...";
export const MESSAGE_DOWNLOAD_DATA = "Descargando...";
export const MESSAGE_LOAD_DATA = "Cargando...";
export const CONSUMING_SERVICE = "Consumiendo servicio";
export const NON_VALIDATE_ENTER = "NON_VALIDATE_ENTER";
export const AEC_NO_APLIED = "AEC: No aplica";
export const BLUE_COLOR = "#337ab7";
export const GREEN_COLOR = "#5cb85c";
export const ORANGE_COLOR = "#f0ad4e";
export const RED_COLOR = "#d9534f";
export const GRAY_COLOR = "#c8c8c8";
export const APP_NAME = "FRONT_OFFICE";
export const YES = 1;
export const NO = 0;

export const TITLE_CONCLUSIONS_VISIT = "En este campo se podrán ingresar los aspectos más relevantes, los acuerdos " +
    " y compromisos que se dieron en la reunión. Además, registrar los comentarios del estado de servicio.\n\n" +
    "Si en la visita se presentó una propuesta de negocio al cliente, se deberá indicar ¿qué tan real es el " +
    " interés del cliente en nuestra propuesta? Para dar respuesta a esta pregunta tenga en cuenta las " +
    " dimensiones del “Mapa de Proceso de Compra del Cliente”, utilícelo como una herramienta de chequeo " +
    " (ver pdf).";
export const TITLE_OTHERS_PARTICIPANTS = "En esta sección se podrán ingresar los otros participantes que asistieron a la " +
    " reunión, tanto participantes por parte del Grupo Bancolombia como del cliente.\n" +
    "Los campos “nombre”, “cargo” y “empresa” son de texto libre, diligencie los 3 campos " +
    " y haga clic en el botón  “+ agregar participante”.";
export const TITLE_BANC_PARTICIPANTS = "En esta sección se podrán adicionar como “participantes en la reunión " +
    "por parte del Grupo Bancolombia” a personas que estén creadas como usuarios en Biztrack.\n\n" +
    "Si desea adicionar un participante y no está creado en Biztrack, haga uso de la sección " +
    "“Otros participantes en la reunión”.";
export const TITLE_CLIENT_PARTICIPANTS = "En esta sección se podrán adicionar como “participantes en la reunión por parte del cliente” a los contactos del cliente en Biztrack. Si desea adicionar un participante y que este no quede como contacto haga uso de la sección “Otros participantes en la reunión”\n\n" +
    "Agregar un participante:\n" +
    "1. Ingrese el nombre del contacto (campo: “Nombre”)\n" +
    "2. Seleccione el contacto que desea como participante\n" +
    "3. Haga clic en el botón “+ agregar participante”\n\n" +
    "Los campos “cargo”, “estilo social”, “actitud frente al grupo”, se alimentan automáticamente de la información del contacto registrada en Biztrack, si salen en blanco deberá:\n" +
    "a. Guardar el informe como borrador\n" +
    "b. Ir la pestaña de “contactos” y completar los campos.\n" +
    "c. Retomar la edición del informe y agregar el contacto\n\n" +
    "Crear contacto:\n" +
    "Si desea crear un contacto en Biztrack para adicionarlo como participante haga clic en el botón “crear contacto” y diligencie todos los campos. Repita los pasos para agregar participante.\n";
export const TITLE_OPPORTUNITY_BUSINESS = "Piense en: Medio Ambiente de la Industria, Medio ambiente económico, Mercado, Competencia, Medio Ambiente Político, Legislación, Tendencias Sociales.";
export const OPTION_REQUIRED = "Debe seleccionar una opción";
export const VALUE_REQUIERED = "Debe ingresar un valor";
export const VALUE_XSS_INVALID = "La información ingresada contiene caracteres invalidos.";
export const INVALID_EMAIL = "Debe ingresar un formato válido";
export const DATE_REQUIERED = "Debe seleccionar un día";
export const DATE_START_AFTER = "La fecha inicial es superior a la final";
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATETIME_FORMAT = "DD/MM/YYYY hh:mm a";
export const REVIEWED_DATE_FORMAT = "DD MMM YYYY";
export const ONLY_POSITIVE_INTEGER = 1;
export const ALLOWS_NEGATIVE_INTEGER = 2;
export const MESSAGE_ERROR = "error";
export const MESSAGE_SERVER_ERROR = "Ocurrió un error en el servidor"
export const MESSAGE_WARNING = "warning";
export const MESSAGE_SUCCESS = "success";

export const OTHER = "Otro";

//Variable de tipo de aplicacion
export const FRONT_APP = "Front";

//Variables de los permisos
export const VISUALIZAR = "Visualizar";
export const CREAR = "Crear";
export const EDITAR = "Editar";
export const ELIMINAR = "Eliminar";
export const DESCARGAR = "Descargar";
export const FINALIZAR = "Finalizar";
export const VINCULAR = "Vincular";
export const ESTUDIO_DE_CREDITO = "Estudio de crédito";
export const ENTREGA_ESTRUCTURADA = "Entrega estructurada";
export const COMMERCIAL = "Comercial";
export const ANALYST = "Analista";
export const TRACKING_ENVIRONMENTAL = "Seguimiento ambiental";

//Variables de los modulos de la aplicación
export const MODULE_MANAGERIAL_VIEW = "Vista gerencial";
export const MODULE_CLIENTS = "Clientes";
export const MODULE_PROSPECT = "Prospectos";
export const MODULE_CONTACTS = "Contactos";
export const MODULE_PARTNERS = "Socios";
export const MODULE_SHAREHOLDERS = "Accionistas";
export const MODULE_BOARD_MEMBERS = "Miembros de junta";
export const MODULE_PREVISITS = "Previsitas";
export const MODULE_VISITS = "Visitas";
export const MODULE_TASKS = "Tareas";
export const MODULE_PIPELINE = "Pipeline";
export const MODULE_BUSSINESS_PLAN = "Planes de negocios";
export const MODULE_ALERTS = "Alertas";
export const MODULE_RISKS_MANAGEMENT = "Gestión de riesgos";
export const MODULE_COVENANTS = "Covenants";
export const MODULE_AEC = "AEC";
export const MODULE_CUSTOMER_STORY = "Historial cliente";
export const MODULE_QUALITATIVE_VARIABLES = "Variables Cualitativas";
export const MODULE_TRANSACTIONAL = "Transaccional";
export const MODULE_RISK_GROUP = "Grupos de riesgo";
export const MODULE_LINKING_REQUESTS = "Solicitudes de vinculación";

export const TAB_INFO = 1;
export const TAB_CONTACTS = 2;
export const TAB_SHAREHOLDER = 3;
export const TAB_PREVISITS = 5;
export const TAB_VISITS = 4;
export const TAB_PENDING_TASK = 6;
export const TAB_PIPELINE = 7;
export const TAB_BUSINESS_PLAN = 8;
export const TAB_RISKS_MANAGEMENT = 9;
export const TAB_CUSTOMER_STORY = 10;

let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://localhost:8084/Centricity";
}

export const APP_URL = API_URL;

export const INIT_INPUT_EVENTS = 'ias-ayax/input/init-events-observer';
export const STOP_INPUT_EVENTS = 'ias-ayax/input/stop-events-observer';
export const UPDATE_INPUT_EVENT = 'ias-ayax/input/update-event-observer';
export const SEND_INPUT_EVENT = 'ias-ayax/input/send-event-observer';
export const CLEAN_INPUT_EVENT = 'ias-ayax/input/clean-event-observer';
export const REDIRECT_TO_LOGIN = 'ias-ayax/input/redirect-to-url';

//Mensajes de error
export const TITLE_ERROR_SWEET_ALERT = "Error ejecutando transacción";
export const MESSAGE_ERROR_SWEET_ALERT = "Señor usuario ocurrió un error, por favor comuníquese  con el administrador.";

export const STYLE_BUTTONS_ACTIONS = { paddingRight: '7px', paddingLeft: '7px' };
export const STYLE_CONTAINER_BUTTONS = {
    position: "fixed",
    border: "1px solid #C2C2C2",
    bottom: "0px",
    width: "100%",
    marginBottom: "0px",
    backgroundColor: "#F8F8F8",
    height: "50px",
    background: "rgba(255,255,255,0.75)"
};

//Data para los select de respuesta "Aprobar" - "Rechazar"
export const VALUES_APROVE = [
    { 'id': '', 'value': "Seleccione..." },
    { 'id': true, 'value': "Aprobar" },
    { 'id': false, 'value': "Rechazar" }
];

export const STYLE_BUTTON_BOTTOM = {
    marginLeft: '-35px',
    position: 'fixed',
    border: '1px solid rgb(194, 194, 194)',
    bottom: '0px',
    width: '100%',
    marginBottom: '0px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.74902)'
}
export const ORDER_ASC = 0;
export const ORDER_DESC = 1;
export const STR_YES = "Si";

export const valuesYesNo = [
    { 'id': true, 'value': "Si" },
    { 'id': false, 'value': "No" }
];

/**
 * INICIO REGEX XSS
 */
export const REGEX_GENERAL_XSS = /(?![',.-])[#-.]|[[-^]|[?|{}]|(<meta|<?[\s\S]iframe|<?[\s\S]link|<?[\s\S]script|cmd|scriptlet|error=|http-equiv|@import)/g;
export const REGEX_FUNCTIONS_XSS = /onstart|onabort|onbeforeunload|onerror|onhashchange|onload|onpageshow|onpagehide|onresize|onscroll|onunload|onmouseover/g; 
export const REGEX_SIMPLE_XSS = /(?![',.-])[#-.]|[[-^]|[?|{}]|<.*?>/g;
// export const REGEX_SIMPLE_XSS_STRING = "/(?![',.-])[#-.]|[[-^]|[?|{}]|<.*?>/g";
export const REGEX_SIMPLE_XSS_STRING = "/<.*?>|cmd|&#|onabort|onbeforeunload|onerror|onhashchange|onload|onpageshow|onpagehide|onresize|onscroll|onunload|javascript|onmouseover/g";
export const REGEX_SIMPLE_XSS_MESAGE_SHORT = "La información ingresada contiene caracteres invalidos.";
export const REGEX_SIMPLE_XSS_MESAGE = "Señor usuario, la informacion ingresada contiene caracteres peligrosos para la aplicación.";

/**
 * FIN REGEX XSS
 */