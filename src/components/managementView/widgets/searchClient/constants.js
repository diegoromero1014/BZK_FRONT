import ProspectIcon from './prospectIcon';
import ButtonsFilter from './buttonsFilter';

export const FILTER_BY_CLIENTS = "FILTER_BY_CLIENTS";
export const FILTER_BY_RELATION = "FILTER_BY_RELATION";
export const TITLE_FILTER_BY_CLIENTS = "Cliente /";
export const TITLE_FILTER_BY_RELATION = "Relación /";
export const NAME_FILTER_CLIENTS = "CLIENTE";
export const NAME_FILTER_RELATION = "GRUPO_ECONOMICO";

export const TITLE_SEARCH_CLIENT = 'BUSCAR CLIENTES';
export const SEARCH_CLIENT = 'Buscar clientes';
export const CLOSE_BUSQUEDA = 'Limpiar búsqueda y filtro';
export const PLACEHOLDER_SEARCH_CLIENT = 'Buscar por nombre, NIT o grupo económico';
export const MESSAGE_TOOLTIP = 'Crear prospecto';
export const MESSAGE_NO_RESULTS = 'Señor usuario, no se encontraron clientes que cumplan el criterio de búsqueda.';
export const MESSAGE_NO_ACCESS = 'Señor usuario, usted no cuenta con los permisos para visualizar este cliente.';

export const STYLE_BUTTON_SEARCH = {
    backgroundColor: "transparent",
    color: "#00448C",
    borderRadius: "0px 1px 1px 0px",
    height: "37px",
    borderTop: "1px solid #e5e9ec",
    borderRight: "1px solid #e5e9ec",
    borderBottom: "1px solid #e5e9ec"
}

export const STYLE_BUTTON_SEARCH_FOCUS = {
    backgroundColor: "#F4F5F7",
    color: "#00448C",
    borderRadius: "0px 1px 1px 0px",
    height: "37px",
    borderTop: "1px solid #e5e9ec",
    borderRight: "1px solid #e5e9ec",
    borderBottom: "1px solid #e5e9ec"
}

export const STYLE_ICON_PROSPECT = {
    marginLeft: "10px",
    borderRadius: "13px",
    background: "#EB984F",
    fontSize: "15px",
    fontWeight: 'bold',
    color: "white",
    width: "22px",
    height: "22px",
    textAlign: "center",
}


export const STYLE_BUTTON_PROSPECT = {
    background: "#00448C",
    padding: "0px",
    fontSize: "15px",
    fontWeight: 'bold',
    color: "white",
    width: "36px",
    height: "36px",
}

export const STYLE_FILTER_ICON = {
    background: "#00448C",
    padding: "0px",
    fontSize: "15px",
    fontWeight: 'bold',
    color: "white",
    width: "90px",
    height: "36px",
}

export const COLUMNS_SEARCH_CLIENT = [
    {
        header: 'Prospecto',
        prop: 'prospect',
        component: {
            Component: ProspectIcon
        },
        width: 2
    },
    {
        header: 'Tipo documuento',
        prop: 'documentType',
        width: 2
    },
    {
        header: 'Número de documento',
        prop: 'document'
    },
    {
        header: 'Razón social',
        prop: 'name'
    },
    {
        header: 'Grupo económico',
        prop: 'economicGroup'
    },
    {
        header: 'Opciones',
        component: {
            Component: ButtonsFilter
        }
    }
]