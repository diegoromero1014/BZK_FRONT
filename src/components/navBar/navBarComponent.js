import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateTitleNavBar, consultModulesAccess, viewAlertClient } from './actions';
import { backButtonFilter } from '../clients/actions';
import BellAlert from '../alerts/bellClientAlertComponent';
import { redirectUrl } from '../globalComponents/actions';
import ConfidentialBrandComponent from '../commercialReport/ConfidentialBrandComponent';

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

        return (
            <div className="header-quick-nav" style={{ height: "60px", width: "100%" }}>
                <div className="pull-left" style={{ paddingLeft: "5px !important" }}>
                    <ul className="nav" style={{ paddingLeft: "0px", paddingTop: '10pt' }}>
                        <li style={{ fontSize: "30px" }}>
                            {titleNavBar}
                            {confidential &&
                                <ConfidentialBrandComponent />
                            }
                        </li>
                    </ul>
                </div>
                {_.includes(window.location.pathname, this.state.urlClientInfo) ?
                    <div className="pull-right" style={{ marginTop: "17px", marginRight: "40px", fontSize: "35px", cursor: "pointer" }}>
                        <a onClick={this._clickReturnClients}>
                            <i className="reply all icon"></i>
                        </a>
                    </div>
                    :
                    ""
                }
                <div className="pull-right" style={{ marginTop: "0px", marginRight: "-22px", fontSize: "30px" }}>
                    {viewAlertClient && <BellAlert />}
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
