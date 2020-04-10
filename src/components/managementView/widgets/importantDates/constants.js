export const TITLE_IMPORTANT_DATES = "FECHAS IMPORTANTES";
export const TITLE_TAB_DATES = "Cumpleaños";
export const TITLE_STRATEGIC_CONTACTS = "Estratégicos";
export const TITLE_TACTIC_CONTACTS = "Tácticos";
export const TITLE_OPERATIVE_CONTACTS = "Operativos";
export const IMPORTANT_DATES = "IMPORTANT_DATES";

export const STYLE_CONTAINER_TABS = {
    width: '100%',
    height: '100%',
    background: 'transparent',
    border: '1px solid #ececec',
    boxShadow: '10px 10px 5px -9px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    minWidth: '250px'
}

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
        prop: 'contactPosition'
    },

    {
        header: 'Número de contacto',
        prop: 'contactPhone'
    }

]