import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {Menu} from "semantic-ui-react";
import MenuListFatherComponent from "./menuListFatherComponent";
import MenuItem from "./menuItem";
import {connect} from "react-redux";
import {getAlertsByUser} from "../alerts/actions";
import _ from "lodash";
import {initialMenuPermissions} from "./actions";


const menuItemLogOut = [
    {
        text: "Cerrar sesión",
        icon: "sign out",
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
                labelTextFather={item.labelTextFather}
                linkUrlFather={item.link}
                style={item.style}
                children={children}
            />
        }
    }

    render() {
        const {menu } = this.props;
        const menuListItem = _.isUndefined(menu.get('menuListItem')) ? [] : menu.get('menuListItem');
        const btnLogoutStyle = { position: 'absolute', bottom: '0px', width: '100%', backgroundColor: "black" };
        const userNameLogged = _.toLower(window.sessionStorage.getItem('userName'));
        return (
            <Menu inverted vertical secundary fluid attached="top" style={{ backgroundColor: '#00448c' }}>
                {menuListItem.map(this._mapMenuItems)}
                <MenuListFatherComponent
                    key={_.uniqueId()}
                    iconClassName='user circle'
                    labelText={userNameLogged}
                    style={btnLogoutStyle}
                    children={menuItemLogOut}
                />
            </Menu>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAlertsByUser,
        initialMenuPermissions
    }, dispatch);
}

function mapStateToProps({ menu }, ownerProps) {
    return {
        menu
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuListComponent);