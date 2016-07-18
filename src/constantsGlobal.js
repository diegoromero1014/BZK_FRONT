export const PERSONA_NATURAL = 451;
export const PERSONA_JURIDICA = 452;
export const FILE_OPTION_SOCIAL_STYLE_CONTACT = 1;
export const FILE_OPTION_REPORT_VISIT = 2;
export const FILE_OPTION_SHOPPING_MAP = 3;
export const FILE_OPTION_PRE_VISIT_GUIDE = 4;
export const CONSULT_PARAMETER_NAME = 'CONSULT_PARAMETER_NAME';
export const SAVE_DRAFT = 0;
export const SAVE_PUBLISHED = 1;

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
export const OPTION_REQUIRED = "Debe seleccionar una opción";
export const VALUE_REQUIERED = "Debe ingresar un valor";
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATETIME_FORMAT = "DD/MM/YYYY hh:mm a";

let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://localhost:9080/Centricity";
}

export const APP_URL = API_URL;
