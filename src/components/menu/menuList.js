import React, {Component} from 'react';
import MenuListItem from './menuListItem';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {MODULE_MANAGERIAL_VIEW, MODULE_CLIENTS, MODULE_ALERTS} from '../../constantsGlobal';
import ButtonComponentMyPending from '../myPendings/buttonComponentMyPendings';
import ButtonComponentDraftDocument from '../draftDocuments/buttonComponentDraftDocument';
import {Row, Col} from 'react-flexbox-grid';
import {COLOR_ITEMS_MENU, COLOR_ITEMS_MENU_BLACK} from './constants';
import ViewAlerts from '../alerts/alertsComponent';
import {toggleMenu} from '../navBar/actions';
import {showButtonCloseMenu} from '../menu/actions';
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

    constructor(props) {
        super(props);
        this.handleLayoutToggle = this.handleLayoutToggle.bind(this);
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

    handleLayoutToggle(e) {
        e.preventDefault();
        const {toggleMenu} = this.props;
        toggleMenu();
    }

    componentWillMount() {
        menuItems = [];
        menuItemsCloseSession = [];
        menuItemsCloseSession.push(menuItemCerrarSesion);
    }

    componentWillReceiveProps(nextProps) {
        menuItems = [];
        const {navBar} = nextProps;
        if (_.get(navBar.get('mapModulesAccess'), MODULE_MANAGERIAL_VIEW)) {
            menuItems.push(itemManagerialView);
        }
        if (_.get(navBar.get('mapModulesAccess'), MODULE_CLIENTS)) {
            menuItems.push(itemClients);
        }
    }

    render() {
        const {navBar, menuReducer} = this.props;
        return (
            <div style={{overflowX: "auto", height: "100%"}}>
                <Row className="page-sidebar-wrapper"
                     style={{width: "100%", paddingLeft: '10px'}}>
                    { menuReducer.get('showCloseMenu') &&
                    <Col xs={1} md={1} lg={1} style={{marginTop: '13px', marginLeft: '5px', maxWidth: '60px'}}>
                        <i className="big sidebar icon"
                           onClick={this.handleLayoutToggle}
                           style={{cursor: "pointer", color: '#4c5360 !important'}}
                           title="Cerrar menú"></i>
                    </Col>
                    }
                    <Col xs={11} md={11} lg={11} style={ menuReducer.get('showCloseMenu')  ? {marginTop: '15px'} : {marginTop: '15px', marginLeft: '10px'}}>
                        <span style={{fontSize: '30px', color: 'black'}}>Biztrack - Menú</span>
                    </Col>
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
function mapStateToProps({navBar, menuReducer}, ownerProps) {
    return {
        navBar,
        menuReducer
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleMenu,
        showButtonCloseMenu
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);
