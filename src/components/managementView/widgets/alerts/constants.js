export const PORTFOLIO_EXPIRATION_TAB = "Vencimiento de cartera";
export const COVENANTS_TAB = "Covenants";
export const DEACTIVATED_CONTACTS_TABS = "Contáctos desactualizados";
export const CONTROL_LISTS_TAB = "Listas de control";
export const MAX_ROWS = 5;

export const COLUMNS_VENCIMIENTO_CARTERA = [
    {
        header : 'Número documento',
        prop : 'idNumberClient',
    },
    {
        header : 'Nombre / Razón social',
        prop : 'clientName',
    },
    {
        header : 'Saldo vencido',
        prop : 'balanceOverdue',
    },
    {
        header : 'Días mora proyectados',
        prop : 'daysOverdue',
    },
    {
        header : 'Línea de negocio',
        prop : 'entity',
    },
]

export const COLUMNS_BLACK_LIST_ALERTS = [
    {
        header: 'Número de documento del cliente',
        prop: 'documentClient'
    },

    {
        header: 'Nombre / Razón social',
        prop: 'nameClient'
    },

    {
        header: 'Tipo identificación',
        prop: 'documentTypeEntity'
    },

    {
        header: 'Número de documento',
        prop: 'documentEntity'
    },

    {
        header: 'Nombre',
        prop: 'nameEntity'
    },

    {
        header: 'Tipo de entidad',
        prop: 'typeEntity'
    },

    {
        header: 'Nivel',
        prop: 'levelBlackList'
    },
]