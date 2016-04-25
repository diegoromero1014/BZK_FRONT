import React, {Component} from 'react';
import moment from 'moment';
import MenuListItem from './menuListItem';

const menuItems = [
    /*
    Se comenta porque la funcionalidad no esta activa, no hace nada
    {
        text: "Mi portafolio",
        icon: "icon-suitcase",
        link: "/dashboard/portafolio"
    },*/
    {
        text: "Mis clientes",
        icon: "building icon",
        link: "/dashboard/clients"
    }
];

const menuItemCerrarSesion = [
    {
        text: "Cerrar sesión segura",
        icon: "big power icon",
        link: "/login",
        style: {
          backgroundColor: "black"
        }
    }
];

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
        const currentDate = moment().locale('es');
        return (
            <div style={{overflow: "hidden", overflow: "hidden", height: "100%"}}>
              <div className="page-sidebar-wrapper" style={{width: "100%", height: "100%", overflow: "hidden"}}>
                <ul style={{width: "100%"}}>
                    <a id="news-menu-item" className="news-menu-item menu-item">
                        <div className="today">
                            <span className="today-month">{currentDate.format("MMM")}</span>
                            <span className="today-date">{currentDate.format("DD")}</span>
                        </div>
                        <span className="today-label" style={{marginLeft: "1px"}}>Hoy</span>
                    </a>
                    {menuItems.map(this._mapMenuItems)}
                </ul>
                <ul style={{width: "100%", bottom: "0px", position: "absolute"}}>
                    {menuItemCerrarSesion.map(this._mapMenuItems)}
                </ul>
              </div>
            </div>
        )
    }
}

export default MenuList;
