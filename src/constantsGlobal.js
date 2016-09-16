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
export const ERROR_MESSAGE_REQUEST = 'Lo sentimos, ocurrió un error ejecutando la acción.';
export const MESSAGE_USER_WITHOUT_PERMISSIONS = 'Lo sentimos, usted no tiene permisos para ejecutar la acción.';
export const ACTIVE_LOGS = "db6d27e0-9a1d-4286-805b-6732d4cacc6d";
export const SESSION_EXPIRED = "-2";

export const TITLE_CONCLUSIONS_VISIT = "En este campo se podrán ingresar los aspectos más relevantes, los acuerdos " +
    " y compromisos que se dieron en la reunión. Además, registrar los comentarios del estado de servicio.\n\n" +
    "Si en la visita se presentó una propuesta de negocio al cliente, se deberá indicar ¿qué tan real es el " +
    " interés del cliente en nuestra propuesta? Para dar respuesta a esta pregunta tenga en cuenta las " +
    " dimensiones del “Mapa de Proceso de Compra del Cliente”, utilícelo como una herramienta de chequeo " +
    " (ver pdf).";
export const TITLE_OTHERS_PARTICIPANTS ="En esta sección se podrán ingresar los otros participantes que asistieron a la " +
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
export const TITLE_OPPORTUNITY_BUSINESS ="Piense en: Medio Ambiente de la Industria, Medio ambiente económico, Mercado, Competencia, Medio Ambiente Político, Legislación, Tendencias Sociales.";
export const OPTION_REQUIRED = "Debe seleccionar una opción";
export const VALUE_REQUIERED = "Debe ingresar un valor";
export const DATE_REQUIERED = "Debe seleccionar un día";
export const DATE_START_AFTER = "La fecha inicial es superior a la final";
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATETIME_FORMAT = "DD/MM/YYYY hh:mm a";
export const REVIEWED_DATE_FORMAT = "DD MMM YYYY";
export const ONLY_POSITIVE_INTEGER = 1;
export const ALLOWS_NEGATIVE_INTEGER = 2;
export const MESSAGE_ERROR = "error";
export const MESSAGE_WARNING = "warning";
export const MESSAGE_SUCCESS = "success";

let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://localhost:8084/Centricity";
}

export const APP_URL = API_URL;
