import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleMenu, updateTitleNavBar, consultModulesAccess,viewAlertClient} from './actions';
import BellAlert from '../alerts/bellClientAlertComponent';
import {redirectUrl} from '../globalComponents/actions';
import {MODULE_CLIENTS} from '../../constantsGlobal';


class NavBarComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLayoutToggle = this.handleLayoutToggle.bind(this);
    }

    handleLayoutToggle(e) {
        e.preventDefault();
        const {toggleMenu} = this.props;
        toggleMenu();
    }

    componentWillMount(){
      const {consultModulesAccess} = this.props;
      consultModulesAccess();
    }

    render() {
      const {navBar} = this.props;
      const titleNavBar = navBar.get('titleNavBar');
      const viewAlertClient = navBar.get('viewAlertClient');
      return (
          <div className="header-quick-nav" style={{height: "60px", width: "100%"}}>
              <div className="pull-left" style={{paddingLeft: "5px !important"}}>
                  <ul className="nav" style={{paddingLeft: "0px"}}>
                      <li style={{cursor: "pointer"}}>
                          <a onClick={this.handleLayoutToggle}>
                            <i className="big sidebar icon"></i>
                          </a>
                      </li>
                      <li style={{fontSize: "30px"}}>
                          {titleNavBar}
                      </li>
                  </ul>
              </div>
              <div className="pull-right" style={{marginTop: "0px", marginRight: "-22px", fontSize:"30px"}}>
                  {viewAlertClient && <BellAlert />}
              </div>
          </div>
      );
    }
}

function mapStateToProps({navBar}, ownerProps) {
  return {
    navBar
  };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleMenu,
        updateTitleNavBar,
        consultModulesAccess,
        viewAlertClient
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBarComponent);
