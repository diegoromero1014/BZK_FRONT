export const PORTFOLIO_EXPIRATION_TAB = "Vencimiento de cartera";
export const COVENANTS_TAB = "Covenants";
export const DEACTIVATED_CONTACTS_TABS = "Contáctos desactualizados";
export const CONTROL_LISTS_TAB = "Listas de control";

export const COLUMNS_VENCIMIENTO_CARTERA = [
    {
        header : 'Número documento',
        prop : 'idNumberClient',
        width: 4
    },
    {
        header : 'Nombre / Razón social',
        prop : 'clientName',
        width: 4
    },
    {
        header : 'Saldo vencido',
        prop : 'balanceOverdue',
        width: 4
    },
    {
        header : 'Días mora proyectado',
        prop : 'daysOverdue',
        width: 4
    },
    {
        header : 'Línea de negocio',
        prop : 'entity',
        width: 4
    },
    {
        header : 'Opciones',
        width: 1
    },
]