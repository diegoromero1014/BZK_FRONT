import React, { Component } from 'react';
import MenuComponent from '../menu/component';
import { changeStateSaveData } from './actions';
import NavBarComponent from '../navBar/navBarComponent';
import { redirectUrl } from '../globalComponents/actions';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingComponent from '../loading/loadingComponent';
import { loadObservablesLeftTimer } from '../login/actions';
import { Dropdown, Menu } from 'semantic-ui-react';
import { getAlertsByUser } from '../alerts/actions';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionToken') === "") {
      redirectUrl("/login");
    } else {
      const { loadObservablesLeftTimer,getAlertsByUser } = this.props;
      loadObservablesLeftTimer();
      getAlertsByUser().then((data)=>{
        
        console.log("data",data);
      });
    }
  }

  render() {
    const { navBar, dashboardReducer } = this.props;
    return (
      <div style={{ width: "100%", height: "100%", position: "absolute", overflow: "hidden" }}>
        <div style={{ float: "left", width: '190px', height: "100%", position: "absolute", transition: 'all 0.3s' }} >
          <MenuComponent />
        </div>
        <div classNameName="header" style={{ paddingLeft: '190px', height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s' }}>
          <NavBarComponent />
          <div
            id="dashboardComponentScroll"
            style={{ backgroundColor: "#ECECEC", width: "100%", height: "91%", float: "left", top: "60px", overflowY: "auto", overflowX: "hidden" }}>
            {this.props.children}
            <LoadingComponent />
            {dashboardReducer.get('showSaveData') &&
              <div classNameName="ui active inverted dimmer">
                <div classNameName="ui text loader">{dashboardReducer.get('messageData')}</div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeStateSaveData,
    loadObservablesLeftTimer,    
    getAlertsByUser
  }, dispatch);
}

function mapStateToProps({ login, navBar, dashboardReducer }, ownerProps) {
  return {
    login,
    navBar,
    dashboardReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
