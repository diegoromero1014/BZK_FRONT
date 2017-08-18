import React, { Component, PropTypes } from 'react';
import MenuListComponent from './newMenu/menuListComponent';
import SwtAlertMessage from '../sweetAlertMessages/swtMessageComponent';
import { CODE_ALERT_PENDING_UPDATE_CLIENT, CODE_ALERT_PORTFOLIO_EXPIRATION, CODE_COVENANT_ALERT, CODE_BLACK_LIST_ALERT } from '../alerts/constants';
import { MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS, MODULE_ALERTS, MODULE_CONTACTS, MODULE_AEC, MODULE_VISOR } from '../../constantsGlobal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { consultModulesAccess } from '../navBar/actions'
import { showLoading } from '../loading/actions';
import { initalMenuPermissions } from '../menu/actions';


const itemManagerialView = {
    text: "Vista gerencial",
    icon: "bar chart",
    link: "/dashboard/viewManagement"
};

const itemClients = {
    text: "Mis clientes",
    icon: "building",
    link: "/dashboard/clients",
};
const itemContacts = {
    text: "Mis contactos",
    icon: "users",
    link: "/dashboard/contacts",
};
const itemMyPendings = {
    text: "Mis pendientes",
    icon: "tasks",
    children: []
};
const itemMyPendings2 = {
    text: "Mis pendientes",
    icon: "tasks",
    children: []
};
const itemMyPendings3 = {
    text: "Mis pendientes",
    icon: "tasks",
    children: []
};
const itemVisor = {
    text: "Transaccional",
    icon: "area chart",
    link: "/dashboard/visor"
};


const childrenContactsGroupFavorito = { text: "Favoritos", link: "/dashboard/contact/favoriteGroup" };
const childrenMyPendingsAEC = { text: "AEC", link: "/dashboard/myPendings/AEC" };
const childrenMyPendingsMyTaks = { text: "Mis tareas", link: "/dashboard/myPendings/myTasks" };
const childrenMyPendingsMyDraftDocuments = { text: "Documentos en borrador", link: "/dashboard/myPendings/draftDocuments" };
const childrenMyPendingsAssigned = { text: "Asignadas", link: "/dashboard/myPendings/assigned" };

const itemAlerts = {
    text: "Alertas",
    icon: "alarm",
    link: "/dashboard/alerts",
    children: []
};
const childrenAlertPendingUpdate = { text: "Pendiente por actualizar", link: "/dashboard/alertClientPendingUpdate" };
const childrenAlertPortExpiration = { text: "Vencimiento de cartera", link: "/dashboard/alertClientsPortfolioExpiration" };
const childrenAlertCovenants = { text: "Covenants", link: "/dashboard/alertCovenants" };
const childrenAlertBlackList = { text: "Listas de control", link: "/dashboard/alertBlackList" };
var menuItems = [];

class MenuComponent extends Component {
    constructor(props) {
        super(props);
    }


    getMenuListPermission(permissions) {
        const { alerts, initalMenuPermissions } = this.props;
        let menuItems = [];
        itemMyPendings.children = [];
        itemMyPendings.children.push(childrenMyPendingsMyTaks);
        itemMyPendings.children.push(childrenMyPendingsMyDraftDocuments);
        itemMyPendings.children.push(childrenMyPendingsAssigned);
        itemContacts.children = [];
        itemContacts.children.push(childrenContactsGroupFavorito);

        if (_.get(permissions, MODULE_MANAGERIAL_VIEW)) {
            menuItems.push(itemManagerialView);
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
        if (_.get(permissions, MODULE_VISOR)) {
            menuItems.push(itemVisor);
        }
        if (_.get(permissions, MODULE_AEC)) {
            itemMyPendings.children.push(childrenMyPendingsAEC);
        }
        menuItems.push(itemMyPendings);
        initalMenuPermissions(menuItems);
    }


    componentWillMount() {
        if (window.localStorage.getItem('sessionToken') === "") {
            redirectUrl("/login");
        } else {
            const { loadObservablesLeftTimer, consultModulesAccess, showLoading, initalMenuPermissions } = this.props;
            showLoading(true, 'cargando......');
            consultModulesAccess().then((data) => {
                showLoading(false, '');
                const permissions = _.get(data, 'payload.data.data');
                console.log("permissions", permissions);
                this.getMenuListPermission(permissions);
            });
        }
    }

    render() {
        return (
            <div className="main" style={{ width: "100%", height: "100%" }}>
                <MenuListComponent />
                <SwtAlertMessage />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        consultModulesAccess,
        showLoading,
        initalMenuPermissions
    }, dispatch);
}

function mapStateToProps({ menu, alerts }, ownerProps) {
    return { menu, alerts };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuComponent);