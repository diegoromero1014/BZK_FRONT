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

const menuItemCerrarSesion = [
    {
        text: "Cerrar sesión segura",
        icon: "icon-log_out",
        link: "/login",
        style: {
          backgroundColor: "black"
        }
    }
];

const dateTimeComp = () => {
    const currentDate = moment().locale('es');
    return (
        <a id="news-menu-item" className="news-menu-item menu-item" href="#dashboard/news" data-ref="news">
            <div className="today">
                <span className="today-month">{currentDate.format("MMM")}</span>
                <span className="today-date">{currentDate.format("DD")}</span>
            </div>
            <span className="today-label">Hoy</span>
        </a>
    );
};

class MenuList extends Component {

    _mapMenuItems(item, idx) {
        return <MenuListItem
            key={idx}
            iconClassName={item.icon}
            labelText={item.text}
            linkUrl={item.link}
            style={item.style}
        />
    }

    render() {
        return (
            <div style={{overflow: "hidden", overflow: "hidden", height: "100%"}}>
              <div className="page-sidebar-wrapper" style={{width: "100%", height: "100%", overflow: "hidden"}}>
                <ul style={{width: "100%"}}>
                    {menuItems.map(this._mapMenuItems)}
                </ul>
                <ul style={{width: "100%", bottom: "0", position: "absolute"}}>
                    {menuItemCerrarSesion.map(this._mapMenuItems)}
                </ul>
              </div>
            </div>
        )
    }
}

export default MenuList;
