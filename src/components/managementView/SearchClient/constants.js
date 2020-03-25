export const TITLE_SEARCH_CLIENT = 'Buscar clientes';
export const PLACEHOLDER_SEARCH_CLIENT = 'Buscar por nombre, NIT o grupo económico';
export const MESSAGE_TOOLTIP = 'Crear prospecto';
export const MESSAGE_NO_RESULTS = 'Señor usuario, no se encontraron clientes que cumplan el criterio de búsqueda.';
export const MESSAGE_NO_ACCESS = 'Señor usuario, usted no cuenta con los permisos para visualizar este cliente.';
export const STYLE_NO_RESULTS = {
    width: "98%",
    padding: "10px",
    fontSize: "17px",
    textAlign: "center",
    background: "#ECECEC",
    borderRadius: "4px"
}
export const COLUMNS_SEARCH_CLIENT = [
    {
        header: 'Prospecto',
        prop: 'prospect'
    },
    {
        header: 'Tipo documuento',
        prop: 'documentType'
    },
    {
        header: 'Número de documento',
        prop: 'document'
    },
    {
        header: 'Razón social',
        prop: 'accountManager'
    },
    {
        header: 'Grupo economico',
        prop: 'economicGroup'
    }
]