import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import MenuListItemFather from './menuListItemFather';
import { connect } from 'react-redux';
import { CODE_ALERT_PENDING_UPDATE_CLIENT, CODE_ALERT_PORTFOLIO_EXPIRATION } from '../alerts/constants';
import { MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS, MODULE_ALERTS } from '../../constantsGlobal';
import { redirectUrl } from '../globalComponents/actions';
import { getAlertsByUser } from '../alerts/actions';
import moment from 'moment';
import _ from 'lodash';

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
const itemMyPendings = {
    text: "Mis pendientes",
    icon: "tasks",
    link: "/dashboard/myPendings"
};
const itemDraftDocuments = {
    text: "Documentos en borrador",
    icon: "file archive outline",
    link: "/dashboard/draftDocuments"
};
const itemAlerts = {
    text: "Alertas",
    icon: "alarm",
    link: "/dashboard/alerts",
    children: []
};
const childrenAlertPendingUpdate = { text: "Pendiente por actualizar", link: "/dashboard/alertClientPendingUpdate" };
const childrenAlertPortExpiration = { text: "Vencimiento de cartera", link: "/dashboard/alertClientsPortfolioExpiration" };
var menuItems = [];

const menuItemCerrarSesion = [
    {
        text: "Cerrar sesión",
        icon: "power",
        link: "/login",
        style: {
            backgroundColor: "black"
        }
    }
];

class MenuList extends Component {

    _mapMenuItems(item, idx) {
        var children = item.children;
        if (_.isEqual(item.children, undefined) || _.isEqual(item.children, null)) {
            children = [];
        }
        return <MenuListItemFather
            key={idx}
            iconClassName={item.icon}
            labelText={item.text}
            linkUrl={item.link}
            style={item.style}
            children={children}
            classIem={item.classIem}
            />
    }

    componentWillMount() {
        menuItems = [];
        const {getAlertsByUser} = this.props;
        getAlertsByUser();
    }

    componentWillReceiveProps(nextProps) {
        menuItems = [];
        const {navBar, alerts} = nextProps;
        if (_.get(navBar.get('mapModulesAccess'), MODULE_MANAGERIAL_VIEW)) {
            menuItems.push(itemManagerialView);
        }
        if (_.get(navBar.get('mapModulesAccess'), MODULE_CLIENTS)) {
            menuItems.push(itemClients);
        }
        if (_.get(navBar.get('mapModulesAccess'), MODULE_ALERTS)) {
            menuItems.push(itemAlerts);
        }
        menuItems.push(itemMyPendings);
        menuItems.push(itemDraftDocuments);
        itemAlerts.children = [];
        var listAlerts = alerts.get('listAlertByUser');
        if (!_.isEqual(listAlerts, undefined) && !_.isEqual(listAlerts, null)) {
            listAlerts.map((item, idx) => {
                if (item.active) {
                    switch (item.codeAlert) {
                        case CODE_ALERT_PENDING_UPDATE_CLIENT:
                            itemAlerts.children.push(childrenAlertPendingUpdate);
                            break;
                        case CODE_ALERT_PORTFOLIO_EXPIRATION:
                            itemAlerts.children.push(childrenAlertPortExpiration);
                            break;
                        default:
                            return null;
                    }
                }
            });
        }
    }

    render() {
        const {navBar} = this.props;
        const currentDate = moment().locale('es');
        return (
            <div>
                <div style={{ overflow: "hidden", height: "100%" }}>
                    <div className="page-sidebar-wrapper" style={{ width: "100%", height: "100%", marginBottom: '40px' }}>
                        <ul style={{ width: "100%" }}>
                            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                <li>
                                    <div style={{ paddingTop: '10px', marginLeft: '-15px' }}>
                                        <span style={{ fontSize: '20px', color: 'white' }}>Hoy</span>
                                        <span style={{ marginLeft: "10px", fontSize: '20px', color: 'white' }}>{currentDate.format("MMMM")}</span>
                                        <span style={{ marginLeft: "5px", fontSize: '20px', color: 'white' }}>{currentDate.format("DD")}</span>
                                    </div>
                                </li>
                            </div>
                            {menuItems.map(this._mapMenuItems)}
                        </ul>
                    </div>
                </div>
                <div style={{ height: "54px", width: "100%", bottom: "0px", position: "absolute" }}>
                    <ul style={{ width: "100%", paddingLeft: '0px' }}>
                        {menuItemCerrarSesion.map(this._mapMenuItems)}
                    </ul>
                </div>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAlertsByUser
    }, dispatch);
}

function mapStateToProps({navBar, alerts}, ownerProps) {
    return {
        navBar,
        alerts
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);
