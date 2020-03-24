export const PORTFOLIO_EXPIRATION_TAB = "Vencimiento de cartera";
export const COVENANTS_TAB = "Covenants";
export const DEACTIVATED_CONTACTS_TABS = "Contactos desactualizados";
export const CONTROL_LISTS_TAB = "Listas de control";

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