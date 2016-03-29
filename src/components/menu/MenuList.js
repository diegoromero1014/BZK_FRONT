import React, {Component} from 'react';
import MenuListItem from './MenuListItem';

const menuItems = [
    {
        text: "Mi Portafolio",
        icon: "icon-suitcase",
        link: "/dashboard/portafolio"
    },
    {
        text: "Mis Clientes",
        icon: "icon-office",
        link: "/dashboard/clients"
    }
];

class MenuList extends Component {

    _mapMenuItems(item, idx) {
        return <MenuListItem
            key={idx}
            iconClassName={item.icon}
            labelText={item.text}
            linkUrl={item.link}
        />
    }

    render() {
        return (
            <div className="page-sidebar-wrapper scrollbar-dynamic" id="main-menu-wrapper">
                <ul>
                    {menuItems.map(this._mapMenuItems)}
                </ul>
            </div>
        )
    }
}

export default MenuList;