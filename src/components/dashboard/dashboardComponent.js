import React, {Component} from 'react';
import MenuComponent from '../menu/component';
import {changeStateSaveData} from './actions';
import NavBarComponent from '../navBar/navBarComponent';
import {redirectUrl} from '../globalComponents/actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingComponent from '../loading/loadingComponent';
import {toggleMenu} from '../menu/actions';
import {updateTitleNavBar} from '../navBar/actions';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            widthComponent: '0px',
            widthComponentDiv: '96%'
        };
        this._onClickDashboard = this._onClickDashboard.bind(this);
    }

    componentWillMount(){
      if( window.localStorage.getItem('sessionToken') === "" ){
        redirectUrl("/login");
      } else {
          const {updateTitleNavBar} = this.props;
          updateTitleNavBar("Inicio");
      }
    }

    _onClickDashboard(){
        const {navBar, toggleMenu} = this.props;
        if(navBar.get('status') === "opened"){
            toggleMenu();
        }
    }

    render() {
        const {navBar, dashboardReducer} = this.props;
        var widthComponent = '0px';
        if(navBar.get('status') === "closed"){
          widthComponent= '0px';
        } else {
          widthComponent = '96%';
        }

        return (
            <div style={{width: "100%", height: "100%", position: "absolute", overflow: "hidden"}}>
                <div style={{float: "left", width: widthComponent, height: "100%", position: "absolute", transition: 'all 0.3s', zIndex: '10000'}} >
                    <MenuComponent />
                </div>
                <div className="header" style={{marginLeft: widthComponent, height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s'}}>
                    <NavBarComponent paddingLeftValue={widthComponent} />
                    <div
                      id="dashboardComponentScroll"
                      onClick={this._onClickDashboard}
                      style={{backgroundColor: "#ECECEC", width: "100%", height: "91%", float: "left", top: "60px", overflowY: "auto", overflowX: "hidden", marginTop: "3px"}}>
                      {this.props.children}
                        <LoadingComponent />
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
    changeStateSaveData,
    toggleMenu,
    updateTitleNavBar
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
