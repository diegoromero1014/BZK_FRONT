import NameCapitalize from "./economicGroupsToBeVisited/nameCapitalize";

export const ECONOMIC_GROUPS_TO_BE_VISITED = "Grupos económicos que no se han visitado en más de tres meses";
export const ACTION_ECONOMIC_GROUPS_TO_BE_VISITED = "ACTION_ECONOMIC_GROUPS_TO_BE_VISITED";
export const MAX_ROWS = 5;

export const COLUMNS_ECONOMIC_GROUPS_TO_BE_VISITED = [
    {
        header: 'Nombre/Razón social',
        prop: 'principalClientName'
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
    }
]