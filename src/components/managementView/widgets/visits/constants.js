import NameCapitalize from "./economicGroupsToBeVisited/nameCapitalize";
import ButtonCreatePrevisit from "./economicGroupsToBeVisited/buttonCreatePrevisit";

export const MESSAGE_NO_RESULTS = "No hay registros"
export const MESSAGE_NO_RESULTS_VISITS = "No hay visitas"
export const MESSAGE_SECTION_PENDING_VISITS = "Visitas pendientes en los proximos 30 días";
export const REQUEST_PENDING_VISITS = "REQUEST_PENDING_VISITS";
export const PENDING_VIEWS_TAB = 'Visitas pendientes de este mes';
export const ECONOMIC_GROUPS_TO_BE_VISITED = "Clientes que no se han visitado en más de tres meses.";
export const ACTION_ECONOMIC_GROUPS_TO_BE_VISITED = "ACTION_ECONOMIC_GROUPS_TO_BE_VISITED";
export const MAX_ROWS = 5;

export const COLUMNS_PENDING_VISITS = [
    {
        header: 'Nombre/Razón social',
        prop: 'previsitClientName',
        width: 5
    },
    {
        header: 'Tipo de reunión',
        prop: 'typeOfMeeting'
    },
    {
        header: 'Responsable',
        prop: 'managerMeeting'
    },
    {
        header: 'Hora',
        prop: 'visitTime'
    },
]

export const COLUMNS_ECONOMIC_GROUPS_TO_BE_VISITED = [
    {
        header: 'Nombre/Razón social',
        prop: 'clientName'
    },

    {
        header: 'Tipo de reunión',
        prop: 'lastVisitType'
    },

    {
        header: 'Creador',
        prop: 'lastVisitAuthor',
        component: {
            Component: NameCapitalize
        }
    },
    {
        header: 'Fecha/hora',
        prop: 'lastVisitTime'
    },
    
    {
        header: 'Crear previsita',
        prop: 'clientId',
        component: {
            Component: ButtonCreatePrevisit
        },
        width: 2
    }
]