import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Menu } from "semantic-ui-react";
import MenuListFatherComponent from "./menuListFatherComponent";
import MenuItem from "./menuItem";
import { connect } from "react-redux";
import { getAlertsByUser } from "../alerts/actions";
import _ from "lodash";
import { initialMenuPermissions } from "./actions";


class MenuListComponent extends Component {

    constructor(props){
        super(props);
    }

    _mapMenuItems(item, idx, state) {
        console.log(item)
        const children = item.children;
        console.log("Childen Menu Items")
        console.log(children)
        console.log(state)
        if (_.isEqual(item.children, undefined) || _.isEqual(item.children, null)) {
            return <MenuItem
                key={_.uniqueId("MenuItem_")}
                labelText={item.text}
                linkUrl={item.link}
                iconClassName={item.icon}
                stateMenu= {state}
            />

        } else {
            return <MenuListFatherComponent
                key={_.uniqueId("MenuItem_") + idx}
                iconClassName={item.icon}
                labelText={item.text}
                labelTextFather={item.labelTextFather}
                linkUrlFather={item.link}
                style={item.style}
                children={children}
                stateMenu= {state}
            />
        }
    }

    render() {
        const { menu, stateMenu } = this.props;
        const menuListItem = _.isUndefined(menu.get('menuListItem')) ? [] : menu.get('menuListItem');
        console.log('Menu List Item Value');
        console.log(menuListItem);
        return (
            <Menu key={_.uniqueId("Menu_")} inverted vertical fluid attached="top" style={{ backgroundColor: '#00448c' }}>
                {menuListItem.map((item, index)=>this._mapMenuItems(item,index,stateMenu))}
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