import React, {Component} from 'react';
import MenuComponent from '../menu/component';
import {changeStateSaveData} from './actions';
import NavBarComponent from '../navBar/navBarComponent';
import {redirectUrl} from '../globalComponents/actions';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            widthComponent: '70px',
            widthComponentDiv: '95%'
        };
    }

    componentWillMount(){
      if( window.localStorage.getItem('sessionToken') === "" ){
        redirectUrl("/login");
      }
    }

    render() {
        const {navBar, dashboardReducer} = this.props;
        var widthComponent = '70px';
        if(navBar.get('status') === "closed"){
          widthComponent= '70px';
        } else {
          widthComponent = '205px';
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", overflow: "hidden"}}>
                <div style={{float: "left", width: widthComponent, height: "100%", position: "absolute", transition: 'all 0.3s'}} >
                    <MenuComponent />
                </div>
                <div className="header" style={{paddingLeft: widthComponent, height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s'}}>
                    <NavBarComponent />
                    <div
                      id="dashboardComponentScroll"
                      style={{backgroundColor: "#ECECEC", width: "100%", height: "91%", float: "left", top: "60px", overflowY: "auto", overflowX: "hidden", marginTop: "3px"}}>
                      {this.props.children}
                      {dashboardReducer.get('showSaveData') &&
                        <div className="ui active inverted dimmer">
                          <div className="ui text loader">{dashboardReducer.get('messageData')}</div>
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
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({login, navBar, dashboardReducer},ownerProps) {
  return {
    login,
    navBar,
    dashboardReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
