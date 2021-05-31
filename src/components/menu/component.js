import React, { Component } from "react";
import MenuListComponent from "./menuListComponent";
import SwtAlertMessage from "../sweetAlertMessages/swtMessageComponent";
import {
    CODE_ALERT_PENDING_UPDATE_CLIENT,
    CODE_ALERT_PORTFOLIO_EXPIRATION,
    CODE_BLACK_LIST_ALERT,
    CODE_COVENANT_ALERT
} from "../alerts/constants";
import {
    MODULE_AEC,
    MODULE_ALERTS,
    MODULE_CLIENTS,
    MODULE_CONTACTS,
    MODULE_MANAGERIAL_VIEW,
    MODULE_TRANSACTIONAL,
    MODULE_LINKING_REQUESTS
} from "../../constantsGlobal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { consultModulesAccess } from "../navBar/actions";
import { initialMenuPermissions } from "../menu/actions";
import { Header, Image } from "semantic-ui-react";
import ImageBrand from '../../../img/svg/logo_bancolombia_blanco_biztrack.svg';
import _ from "lodash";
import { Icon } from "semantic-ui-react";

const itemDashboard = {
    text: "Vista gerencial",
    icon: "computer",
    link: "/dashboard/managementView"
};

const itemClients = {
    text: "Mis clientes",
    icon: "building",
    link: "/dashboard/clients",
};
const itemScheduler = {
    text: "Agenda",
    icon: "calendar",
    link: "/dashboard/sheduler",
};
const itemContacts = {
    text: "Contactos",
    icon: "users",
    link: "/dashboard/contacts",
    labelTextFather: 'Mis contactos'
};
const itemMyPendings = {
    text: "Mis pendientes",
    icon: "tasks",
    children: []
};

const itemTransactional = {
    text: MODULE_TRANSACTIONAL,
    icon: "area chart",
    link: "/dashboard/transactional"
};

const itemMyTasks = {
    text: "Tareas",
    icon: "clipboard",
    link: "/dashboard/myTask"
};

const childrenContactsGroupFavorito = { text: "Favoritos", link: "/dashboard/contact/favoriteGroup" };
const childrenMyPendingsAEC = { text: "AEC", link: "/dashboard/myPendings/AEC" };

const childrenMyPendingsLinkingRequests = { text: "Solicitudes de vinculación", link: "/dashboard/myPendings/linkingRequests" };
const childrenMyPendingsMyDraftDocuments = {
    text: "Documentos en borrador",
    link: "/dashboard/myPendings/draftDocuments"
};

const itemAlerts = {
    text: "Alertas",
    icon: "alarm",
    link: "/dashboard/alerts",
    labelTextFather: 'Mis alertas',
    children: []
};
const childrenAlertPendingUpdate = { text: "Pendiente por actualizar", link: "/dashboard/alertClientPendingUpdate" };
const childrenAlertPortExpiration = {
    text: "Vencimiento de cartera",
    link: "/dashboard/alertClientsPortfolioExpiration"
};
const childrenAlertCovenants = { text: "Covenants", link: "/dashboard/alertCovenants" };
const childrenAlertBlackList = { text: "Listas de control", link: "/dashboard/alertBlackList" };

export class MenuComponent extends Component {
    constructor(props) {
        super(props);
        this.getMenuListPermission = this.getMenuListPermission.bind(this);
        this.state = {
            enable: false
        };
    }

    stateMenu = () => {
        this.setState({ enable: !enable });
    }

    getMenuListPermission = () => {
        const { dispatchInitialMenuPermissions, navBar } = this.props;

        const permissions = navBar.get("mapModulesAccess");

        let menuItems = [];

        itemMyPendings.children = [];
        itemMyPendings.children.push(childrenMyPendingsMyDraftDocuments);

        if (_.get(permissions, MODULE_LINKING_REQUESTS)) {
            itemMyPendings.children.push(childrenMyPendingsLinkingRequests);
        }
        itemContacts.children = [];
        itemContacts.children.push(childrenContactsGroupFavorito);

        if (_.get(permissions, MODULE_MANAGERIAL_VIEW)) {
            menuItems.push(itemDashboard);
        }
        if (_.get(permissions, MODULE_CLIENTS)) {
            menuItems.push(itemClients);
        }
        if (_.get(permissions, MODULE_ALERTS)) {
            itemAlerts.children = [];
            if (_.get(permissions, CODE_ALERT_PENDING_UPDATE_CLIENT)) {
                itemAlerts.children.push(childrenAlertPendingUpdate);
            }
            if (_.get(permissions, CODE_ALERT_PORTFOLIO_EXPIRATION)) {
                itemAlerts.children.push(childrenAlertPortExpiration);
            }
            if (_.get(permissions, CODE_COVENANT_ALERT)) {
                itemAlerts.children.push(childrenAlertCovenants);
            }
            if (_.get(permissions, CODE_BLACK_LIST_ALERT)) {
                itemAlerts.children.push(childrenAlertBlackList);
            }
            menuItems.push(itemAlerts);
        }
        if (_.get(permissions, MODULE_CONTACTS)) {
            menuItems.push(itemContacts);
        }
        if (_.get(permissions, MODULE_TRANSACTIONAL)) {
            menuItems.push(itemTransactional);
        }

        menuItems.push(itemScheduler);
        if (_.get(permissions, MODULE_AEC)) {
            itemMyPendings.children.push(childrenMyPendingsAEC);
        }
        menuItems.push(itemMyTasks);
        menuItems.push(itemMyPendings);
        dispatchInitialMenuPermissions(menuItems);
    }

    componentWillMount() {
        const { dispatchConsultModulesAccess } = this.props;
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            return;
        }
        dispatchConsultModulesAccess().then((data) => {
            const permissions = _.get(data, 'payload.data.data');
            this.getMenuListPermission(permissions);
        });
    }

    render() {
        const { stateMenu, activeMenu } = this.props;
        const toggleIcon = stateMenu?'chevron circle left':'chevron circle right';
        return (
            <div style={{ backgroundColor: '#00448c !important', width: "100%", height: "100%" }}>
                <Header style={{ backgroundColor: '#00448c !important' }} textAlign='center'>
                    <Image src={ImageBrand} size='small' />
                </Header>
                <span onClick={activeMenu} >
                    <Icon name={toggleIcon} style={this.toggleIconStyle} />
                </span>
                <br/>
                <MenuListComponent stateMenu={stateMenu} />
                <SwtAlertMessage />
            </div>
        );
    }

     toggleIconStyle = {
        color: 'white',
        float: 'right',
        cursor: 'pointer',
        fontSize:"25px"
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        dispatchConsultModulesAccess: consultModulesAccess,
        dispatchInitialMenuPermissions: initialMenuPermissions
    }, dispatch);
}

const mapStateToProps = ({ menu, navBar }) => {
    return { menu, navBar };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuComponent);