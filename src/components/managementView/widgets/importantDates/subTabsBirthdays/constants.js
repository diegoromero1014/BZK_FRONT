import ViewDetailClient from './viewDetailClient';
import MailTo from './mailto';
export const TITLE_STRATEGIC_CONTACTS = "Estratégicos";
export const TITLE_TACTIC_CONTACTS = "Tácticos";
export const TITLE_OPERATIVE_CONTACTS = "Operativos";

export const STRATEGIC_CONTACTS = "Estratégico";
export const TACTIC_CONTACTS = "Táctico";
export const OPERATIVE_CONTACTS = "Operativo";

export const ACTION_STRATEGIC_CONTACTS = "ACTION_STRATEGIC_CONTACTS";
export const ACTION_TACTIC_CONTACTS = "ACTION_TACTIC_CONTACTS";
export const ACTION_OPERATIVE_CONTACTS = "ACTION_OPERATIVE_CONTACTS";
export const NAME = "NAME";
export const LAST_NAME = "LAST_NAME";

export const MAX_ROWS = 5;

export const COLUMNS_CLIENTS = [
    {
        header: 'Razón social',
        prop: 'name'
    }
]

export const COLUMNS_CONTACTS = [
    {
        header: 'Primer nombre',
        component: {
            Component: MailTo,
            propsComponent: {
                type: NAME
            }
        },
    },

    {
        header: 'Primer apellido',
        component: {
            Component: MailTo,
            propsComponent: {
                type: LAST_NAME
            }
        },
    },

    {
        header: 'Fecha',
        prop: 'contactBirth'
    },

    {
        header: 'Cargo',
        prop: 'contactPosition',
        width: 3
    },

    {
        header: 'Número de contacto',
        prop: 'contactPhone'
    },

    {
        header: 'Clientes',
        prop: 'clientImportantDatesDTO',
        component: {
            Component: ViewDetailClient
        },
        width: 2
    },

]