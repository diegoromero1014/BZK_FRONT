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
        prop: 'documentClient',
        width: 1
    },

    {
        header: 'Nombre / Razón social',
        prop: 'nameClient',
        width: 3
    },

    {
        header: 'Tipo identificación',
        prop: 'documentTypeEntity',
        width: 1
    },

    {
        header: 'Número de documento',
        prop: 'documentEntity',
        width: 1
    },

    {
        header: 'Nombre',
        prop: 'nameEntity',
        width: 3
    },

    {
        header: 'Tipo de entidad',
        prop: 'typeEntity',
        width: 1
    },

    {
        header: 'Nivel',
        prop: 'levelBlackList',
        width: 1
    },
]

export const COLUMNS_COVENANTS_ALERTS = [
    {
        header: 'Id covenant',
        prop: 'idCovenant',
        width: 1
    },

    {
        header: 'Número documento',
        prop: 'documentClient',
        width: 1
    },

    {
        header: 'Razón social',
        prop: 'nameClient',
        width: 3
    },

    {
        header: 'Acta o contrato',
        prop: 'agreement',
        width: 1
    },

    {
        header: 'Línea de negocio',
        prop: 'lineOfBusiness',
        width: 1
    },

    {
        header: 'Fecha Proximo seguimiento',
        prop: 'nextExpirationTimestamp',
        width: 1
    },
]