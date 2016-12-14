import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {MENU_CLOSED, MENU_OPENED} from './constants';
import {toggleMenu, updateTitleNavBar, consultModulesAccess, viewAlertClient} from './actions';
import BellAlert from '../alerts/bellClientAlertComponent';

const styles = {
  divNavBarTitleOpened: {
      paddingLeft: '5px !important',
      zIndex: 10,
      backgroundColor: 'white',
      maxHeight: '60px',
      position: 'relative'
  },
  divNavBarTitleClosed: {
      paddingLeft: '5px !important',
      maxHeight: '60px',
      position: 'relative'
  }
};

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
      const {consultModulesAccess, toggleMenu, navBar} = this.props;
      if( navBar.get('status') === MENU_CLOSED ){
          toggleMenu();
      }
      consultModulesAccess();
    }

    render() {
      const {navBar, paddingLeftValue} = this.props;
      const titleNavBar = navBar.get('titleNavBar');
      const viewAlertClient = navBar.get('viewAlertClient');
      const status = navBar.get('status');
      const displayAlert = (viewAlertClient && status === MENU_CLOSED) ? "block" : "none";
        return (
          <div className="header-quick-nav" style={{height: "60px", paddingLeft: paddingLeftValue, transition: 'all 0.3s'}}>
              <div className="pull-left" style={status === MENU_CLOSED ? styles.divNavBarTitleClosed : styles.divNavBarTitleOpened}>
                  <ul className="nav" style={{paddingLeft: "0px"}}>
                      <li style={{cursor: "pointer"}} title="Abrir menú">
                          <a onClick={this.handleLayoutToggle}>
                            <i className="big sidebar icon"></i>
                          </a>
                      </li>
                      { status !== MENU_OPENED &&
                          <li style={{fontSize: "30px"}}>
                              {titleNavBar}
                          </li>
                      }
                  </ul>
              </div>
              <div className="pull-right" style={{fontSize:"30px", maxHeight: '26px', display: displayAlert}}>
                   <BellAlert />
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
