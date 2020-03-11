import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateTitleNavBar, consultModulesAccess, viewAlertClient } from './actions';
import { backButtonFilter } from '../clients/actions';
import BellAlert from '../alerts/bellClientAlertComponent';
import { redirectUrl } from '../globalComponents/actions';
import ConfidentialBrandComponent from '../commercialReport/ConfidentialBrandComponent';
import MenuListFatherComponent from '../menu/menuListFatherComponent';
import { getUsername } from '../managementView/actions';


const menuItemLogOut = [
    {
        text: "Cerrar sesión",
        icon: "sign out",
        link: "/logout",
        style: {
            backgroundColor: "black"
        }
    }
];

class NavBarComponent extends Component {
    constructor(props) {
        super(props);
        this._clickReturnClients = this._clickReturnClients.bind(this);
        this.state = {
            urlClientInfo: "clientInformation"
        }
    }
    _clickReturnClients() {
        const { backButtonFilter } = this.props;
        let varBackButtonFilter = true;
        backButtonFilter(varBackButtonFilter);
        redirectUrl("/dashboard/clients");
    }

    componentWillMount() {
        const { consultModulesAccess, navBar } = this.props;
        
        if (window.localStorage.getItem('sessionTokenFront')) {

            
                consultModulesAccess()
            

        }

    }

    render() {
        const { navBar } = this.props;
        const titleNavBar = navBar.get('titleNavBar');
        const viewAlertClient = navBar.get('viewAlertClient');
        const confidential = navBar.get('confidential');
        const btnLogoutStyle = {width: '100%' };
        const userNameLogged =  "Teo debe organizar esto aquí :D"; //getUsername().toLowerCase();

        return (
            <div className="header-quick-nav" style={{ padding: 0,  height: "60px", width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div style={{ paddingLeft: "5px !important" }}>
                    <ul className="nav" style={{ paddingLeft: "0px", paddingTop: '10pt' }}>
                        <li style={{ fontSize: "30px" }}>
                            {titleNavBar}
                            {confidential &&
                                <ConfidentialBrandComponent />
                            }
                        </li>
                    </ul>
                </div>
                <div style={{width: "50%", display: "flex" , alignItems: "center", justifyContent: "flex-end" , marginRight: "30px"}}>
                    {_.includes(window.location.pathname, this.state.urlClientInfo) ?
                        <div  style={{ fontSize: "18px", cursor: "pointer" }}>
                            <a onClick={this._clickReturnClients}>
                                <i className="reply all icon"></i>
                            </a>
                        </div>
                        :
                        ""
                    }
                    <div  style={{ fontSize: "18px", marginTop: "18px" , marginLeft: "15px"}}>
                        {viewAlertClient && <BellAlert />}
                    </div>
                    <div style={{ fontSize: "22px", marginRight: "10px" ,marginLeft: "30px"}}>
                        <MenuListFatherComponent
                            key={_.uniqueId("MenuListFatherComponent_")}
                            iconClassName='user outline'
                            labelText={userNameLogged}
                            style={btnLogoutStyle}
                            children={menuItemLogOut}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ navBar }, ownerProps) {
    return {
        navBar
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateTitleNavBar,
        consultModulesAccess,
        viewAlertClient,
        backButtonFilter
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent);