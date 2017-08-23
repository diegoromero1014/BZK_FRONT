import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Dropdown, Menu } from 'semantic-ui-react';
import MenuListFatherComponent from './menuListFatherComponent';
import MenuItem from './menuItem';
import { connect } from 'react-redux';
import { CODE_ALERT_PENDING_UPDATE_CLIENT, CODE_ALERT_PORTFOLIO_EXPIRATION, CODE_COVENANT_ALERT, CODE_BLACK_LIST_ALERT } from '../../alerts/constants';
import { MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS, MODULE_ALERTS, MODULE_CONTACTS, MODULE_AEC, MODULE_VISOR } from '../../../constantsGlobal';
import { redirectUrl } from '../../globalComponents/actions';
import { getAlertsByUser } from '../../alerts/actions';
import moment from 'moment';
import _ from 'lodash';
import { initalMenuPermissions } from '../actions';


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

class MenuListComponent extends Component {

    _mapMenuItems(item, idx) {
        var children = item.children;
        if (_.isEqual(item.children, undefined) || _.isEqual(item.children, null)) {
            return <MenuItem
                labelText={item.text}
                linkUrl={item.link}
                iconClassName={item.icon}
            />

        } else {
            return <MenuListFatherComponent
                key={idx}
                iconClassName={item.icon}
                labelText={item.text}
                linkUrl={item.link}
                style={item.style}
                children={children}
            />
        }
    }

      render() {
        const { navBar, menu } = this.props;
        const menuListItem= _.isUndefined(menu.get('menuListItem')) ? [] : menu.get('menuListItem');
        const currentDate = moment().locale('es');
        return (
            <Menu inverted vertical secundary attached="top">
                {menuListItem.map(this._mapMenuItems)}
            </Menu>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAlertsByUser,
        initalMenuPermissions
    }, dispatch);
}

function mapStateToProps({ navBar, alerts, menu }, ownerProps) {
    return {
        navBar,
        alerts,
        menu
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListComponent);