import { ViewDetailClient } from './viewDetailClient';
export const TITLE_STRATEGIC_CONTACTS = "Estratégicos";
export const TITLE_TACTIC_CONTACTS = "Tácticos";
export const TITLE_OPERATIVE_CONTACTS = "Operativos";

export const STRATEGIC_CONTACTS = "Estratégico";
export const TACTIC_CONTACTS = "Táctico";
export const OPERATIVE_CONTACTS = "Operativo";

export const ACTION_STRATEGIC_CONTACTS = "ACTION_STRATEGIC_CONTACTS"; 
export const ACTION_TACTIC_CONTACTS = "ACTION_TACTIC_CONTACTS"; 
export const ACTION_OPERATIVE_CONTACTS = "ACTION_OPERATIVE_CONTACTS"; 

export const MAX_ROWS = 5;

export const COLUMNS_CONTACTS = [
    {
        header: 'Primer nombre',
        prop: 'contactName'
    },

    {
        header: 'Primer apellido',
        prop: 'contactLastName'
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
        prop: 'clients',
        component: {
            Component: ViewDetailClient
        }
    },

]