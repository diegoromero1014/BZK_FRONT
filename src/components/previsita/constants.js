export const PROPUEST_OF_BUSINESS = "Propuesta";
export const TRACING = "Seguimiento";
export const CREATE_PREVISIT = "CREATE_PREVISIT";
export const NUMBER_RECORDS = 10;
export const GET_PREVISIT_LIST = 'GET_PREVISIT_LIST';
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const LIMITE_INF = 'LIMITE_INF';
export const CLEAR_PREVISIT_PAGINATOR = 'CLEAR_PREVISIT_PAGINATOR';
export const CLEAR_PREVISIT_ORDER = 'CLEAR_PREVISIT_ORDER';
export const ORDER_COLUMN_PREVISIT = 'ORDER_COLUMN_PREVISIT';
export const CLEAR_PREVISIT = 'CLEAR_PREVISIT';
export const DELETE_TYPE_PREVISIT= 'DELETE_TYPE_PREVISIT';
export const FILTER_STATUS_PREVISIT_ID = 'FILTER_STATUS_PREVISIT_ID';
export const GET_DETAIL_PREVISIT = "GET_DETAIL_PREVISIT";
export const OWNER_DRAFT = "OWNER_DRAFT";
export const GET_CSV_PREVISIT_BY_CLIENT = 'GET_CSV_PREVISIT_BY_CLIENT';
export const ASK_EDIT_PREVISITA = 'ASK_EDIT_PREVISITA';
export const DELETE_BLOCKED_PREVISITA = 'DELETE_BLOCKED_PREVISITA';
export const CLEAR_PREVISIT_DETAIL = 'CLEAR_PREVISIT_DETAIL';

export const TITLE_MESSAGE_TARGET = "En este campo deberá registrar de manera clara cual es propósito de la reunión.\n\n" +
"Si el tipo de visita es “propuesta comercial”, antes de responder deberá hacerse  las siguientes preguntas y/o reflexiones:\n\n" +
"1. ¿Cuál es el insight (enseñanza) que desea llevarle al cliente?\n" +
"a. ¿Por qué esta enseñanza hará pensar de manera distinta al cliente?\n" +
"b. ¿Cómo crees que esta enseñanza llevará al cliente a la acción?\n" +
"c. ¿Cómo esta enseñanza conduce hacia una solución que tiene el Grupo Bancolombia?\n\n" +
"2. ¿Cuáles son los resultados esperados y en cuánto tiempo se verán materializados?";

export const TITLE_MESSAGE_ALTERNATIVE_OBJECTIVE = "¿Cuáles son los beneficios cuantitativos y cualitativos que se le presentará al cliente? \n\n" +
"¿Qué arriesga al no tomar la solución? \n\n" +
"¿Cuáles son los diferenciadores del banco que movilizan al cliente hacia nuestra solución?";
   

export const TITLE_CHALLENGER = `Diligencie de manera resumida los siguientes campos. Recuerde que lo importante es la necesidad del cliente, 
    por lo cual no debe hablar de Bancolombia hasta cuando se expone la situación del cliente.`;

export const TITLE_MESSAGE_PENDIENT = "En este campo se deberá registrar los pendientes quejas o reclamos que tenga el cliente y que podrán ser motivo de conversación en la reunión.";

export const TITLE_EXIT_CONFIRMATION = 'Confirmación salida';
export const MESSAGE_EXIT_CONFIRMATION = '¿Está seguro que desea salir de la pantalla de creación de previsita?';

export const TITLE_ERROR_VALIDITY_DATES = 'Vigencia de fechas';

export const TITLE_ERROR_PARTICIPANTS = 'Error participantes';
export const MESSAGE_ERROR_PARTICIPANTS = "Señor usuario, para guardar una previsita como mínimo debe agregar un participante por parte del Grupo Bancolombia.";

export const TITLE_PREVISIT_CREATE = "Creación previsita";
export const TITLE_PREVISIT_EDIT = "Edición previsita";
export const TITLE_VISIT_TYPE = "Tipo de visita";
export const HELP_VISIT_TYPE = "En este campo se deberá indicar la razón de la visita si es: seguimiento (mantenimiento de la relación con el cliente) o propuesta comercial (cuando lleva un insight o enseñanza al cliente).\n" +
    "Si el tipo de visita es propuesta comercial, se deberá responder la sección Metodología Challenger.";
export const TITLE_ERROR_EDIT_PREVISIT = "Error al editar previsita";
export const MESSAGE_ERROR_EDIT_PREVISIT = userEditingPrevisita => `Señor usuario, en este momento la previsita esta siendo editada por ${userEditingPrevisita}. Por favor intentar mas tarde`;

export const MESSAGE_PREVISIT_CREATE_SUCCESS = "Señor usuario, la previsita se creó de forma exitosa.";
export const MESSAGE_PREVISIT_EDIT_SUCCESS = "Señor usuario, la previsita se editó de forma exitosa.";
export const MESSAGE_VISIT_TYPE_CHANGED = "Señor usuario, si cambia el “Tipo de visita” la información diligenciada en la sección Metodología Challenger se borrará. ¿Está seguro que desea cambiar el Tipo de visita?";

export const MESSAGE_PREVISIT_INVALID_INPUT = "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.";

export const MESSAGE_PREVISIT_CREATE_ERROR = "Señor usuario, ocurrió un error creando la previsita.";
export const MESSAGE_PREVISIT_EDIT_ERROR = "Señor usuario, ocurrió un error editando la previsita.";



