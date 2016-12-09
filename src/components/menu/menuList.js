import React, {Component} from 'react';
import MenuListItem from './menuListItem';
import {connect} from 'react-redux';
import {MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS, MODULE_ALERTS} from '../../constantsGlobal';
import ButtonComponentMyPending from '../myPendings/buttonComponentMyPendings';
import ButtonComponentDraftDocument from '../draftDocuments/buttonComponentDraftDocument';
import {Row} from 'react-flexbox-grid';
import {COLOR_ITEMS_MENU, COLOR_ITEMS_MENU_BLACK} from './constants';
import ViewAlerts from '../alerts/alertsComponent';
import _ from 'lodash';

var menuItems = [];
var menuItemsCloseSession = [];

const itemManagerialView = {
    text: "Vista gerencial",
    icon: "bar chart icon",
    link: "/dashboard/viewManagement",
    marginTop: "30px",
    colorItem: COLOR_ITEMS_MENU
};
const itemClients = {
    text: "Mis clientes",
    icon: "building icon",
    link: "/dashboard/clients",
    marginTop: "30px",
    colorItem: COLOR_ITEMS_MENU
};

const menuItemCerrarSesion = {
    text: "Cerrar sesión",
    icon: "big power icon",
    link: "/login",
    marginTop: "20px",
    colorItem: COLOR_ITEMS_MENU_BLACK
};

class MenuList extends Component {

    constructor(props){
        super(props);
        this.setState({
            loadPermisions: false
        });
    }

    _mapMenuItems(item, idx) {
        return <MenuListItem
            key={idx}
            iconClassName={item.icon}
            labelText={item.text}
            linkUrl={item.link}
            marginTop={item.marginTop}
            colorItem={item.colorItem}
        />
    }

    componentWillMount(){
      menuItems = [];
      menuItemsCloseSession= [];
      menuItemsCloseSession.push(menuItemCerrarSesion);
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
        return (
            <div style={{overflowX: "auto", height: "100%"}}>
              <Row className="page-sidebar-wrapper" style={{width: "100%", overflowX: "auto", overflowY: 'hidden', paddingLeft: '10px'}}>
                  {menuItems.map(this._mapMenuItems)}
                  { _.get(navBar.get('mapModulesAccess'), MODULE_ALERTS) &&
                    <ViewAlerts/>
                  }
                  <ButtonComponentMyPending />
                  <ButtonComponentDraftDocument />
                  {menuItemsCloseSession.map(this._mapMenuItems)}
              </Row>
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
