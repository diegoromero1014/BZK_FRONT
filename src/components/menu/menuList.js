import React, {Component} from 'react';
import moment from 'moment';
import MenuListItem from './menuListItem';
import {connect} from 'react-redux';
import ViewAlerts from '../alerts/alertsComponent';
import {MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS,MODULE_ALERTS} from '../../constantsGlobal';
import {redirectUrl} from '../globalComponents/actions';
import {MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS} from '../../constantsGlobal';
import ButtonComponentMyPending from '../myPendings/buttonComponentMyPendings';
import ButtonComponentDraftDocument from '../draftDocuments/buttonComponentDraftDocument';

var itemManagerialView = {
    text: "Vista gerencial",
    icon: "bar chart icon",
    link: "/dashboard/viewManagement"
};
var itemClients = {
    text: "Mis clientes",
    icon: "building icon",
    link: "/dashboard/clients"
};
var menuItems = [];

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

    componentWillMount(){
      menuItems = [];
    }

    componentWillReceiveProps(nextProps){
      menuItems = [];
      const {navBar} = nextProps;
      if( _.get(navBar.get('mapModulesAccess'), MODULE_MANAGERIAL_VIEW) ){
        menuItems.push(itemManagerialView);
      }
      if( _.get(navBar.get('mapModulesAccess'), MODULE_CLIENTS)){
        menuItems.push(itemClients);
      }
    }

    render() {
        const {navBar} = this.props;
        const currentDate = moment().locale('es');
        return (
            <div style={{overflow: "hidden", height: "100%"}}>
              <div className="page-sidebar-wrapper" style={{width: "100%", height: "100%", overflow: "hidden"}}>
                <ul style={{width: "100%"}}>
                    <a id="news-menu-item" className="news-menu-item menu-item">
                        <div className="today" style={{width: "70px"}}>
                            <span className="today-month">{currentDate.format("MMM")}</span>
                            <span className="today-date">{currentDate.format("DD")}</span>
                        </div>
                        {navBar.get('status') !== 'closed' &&
                          <div className="today" style={{width: "10px"}}>
                            <span className="today-label" style={{marginLeft: "1px"}}>Hoy</span>
                          </div>
                        }
                    </a>
                    {menuItems.map(this._mapMenuItems)}
                    {_.get(navBar.get('mapModulesAccess'), MODULE_ALERTS) &&
                        <ViewAlerts/>
                    }
                    <ButtonComponentMyPending />
                    <ButtonComponentDraftDocument />
                </ul>
                <ul style={{width: "100%", bottom: "0px", position: "absolute"}}>
                    {menuItemCerrarSesion.map(this._mapMenuItems)}
                </ul>
              </div>
            </div>
        )
    }
}
function mapStateToProps({navBar},ownerProps) {
  return {
    navBar
  };
}

export default connect(mapStateToProps)(MenuList);
