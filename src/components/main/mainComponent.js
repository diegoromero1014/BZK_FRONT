import React, { Component } from 'react';
import _ from "lodash";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MenuComponent from '../menu/component';
import NavBarComponent from '../navBar/navBarComponent';
import LoadingComponent from '../loading/loadingComponent';
import SweetAlert from "../sweetalertFocus";
import Worker from '../../worker/Worker';
import WorkerSetup from '../../worker/WorkerSetup';

import { notifiedProductionUpgrade, validateUpgrateProductionActive, changeStatusMenuAct, changeStatusMenuDes } from './actions';
import { redirectUrl } from '../globalComponents/actions';
import { loadObservablesLeftTimer } from '../login/actions';
import { consultParameterServer } from '../../actionsGlobal';

import { RANGO_PASO_PRODUCCION } from '../../constantsParameters';

export class MainComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMessageNotification: false,
      messageTitle: "",
      messageNotification: "",
      initialDate: null,
      finalDate: null,
      enabledMenu: true
    }
  }
  stateMenu  = () => {
    this.setState({
      enabledMenu: !this.state.enabledMenu
    });
  }
  workerConfig = () => {
    /**
     * configuration of the method 
     * that receives and broadcasts 
     * the message.
     */
    this.worker = new WorkerSetup(Worker);

    /** message sent. **/
    this.worker.postMessage('start web worker');
  }

  startBlocking = () => {
    const { dispatchConsultParameterServer } = this.props;

    dispatchConsultParameterServer(RANGO_PASO_PRODUCCION).then(resolve => {
      if (resolve && resolve.payload && resolve.payload.data) {
        this.initializeRanges(resolve.payload.data);

        if (new Date() <= this.state.finalDate && new Date() >= this.state.initialDate) {
          this.setState({
            showMessageNotification: false
          });

          redirectUrl('/pageUnderConstruction');
        }
      }
    });
  }

  /**
   * initialize the dates
   *  
   * @param { Object } data 
   */
  initializeRanges = (data) => {
    if (data.data !== null && data.data !== "" && data.data !== undefined) {
      let value = data.data.value.split(" | ");

      this.setState({
        initialDate: new Date(value[0]),
        finalDate: new Date(value[1])
      });
    }
  }
  changesStatusMenuAct = ()=>{
    console.log("Testing")
    
    const {dispatchDesactiveMenu,mainReducer } = this.props;
    dispatchDesactiveMenu();
    console.log(mainReducer.get('enableMenu'))
    //const { mainReducer } = this.props;
    //mainReducer.set('enableMenu',true);
  }
  changesStatusMenuDes = ()=>{
    console.log("Testing2")
    const {  dispatchChangeActiveMenu, mainReducer } = this.props;
    dispatchChangeActiveMenu();
    
    console.log(mainReducer.get('enableMenu'))
    //const { mainReducer } = this.props;
    //mainReducer.set('enableMenu',false);
  }
  componentWillMount() {
    const { dispatchNotifiedProductionUpgrade, dispatchValidateUpgrateProductionActive } = this.props;

    let token = window.localStorage.getItem('sessionTokenFront');

    if (token == null || token === "") {
      window.localStorage.setItem('sessionTokenFront', '');
      redirectUrl("/login");
    } else {
      const { dispatchLoadObservablesLeftTimer, mainReducer } = this.props;

      dispatchLoadObservablesLeftTimer();

      let productionUpgradeNotified = mainReducer.get('productionUpgradeNotified');

      if (!productionUpgradeNotified) {
        dispatchNotifiedProductionUpgrade();

        dispatchValidateUpgrateProductionActive().then(resolve => {
          const { data } = resolve.payload.data;

          if (data) {
            this.setState({ showMessageNotification: true, messageNotification: data });

            /** configuration method. **/
            this.workerConfig();

            /** valid initial block**/
            this.startBlocking();
          }
        });
      }
    }
  }

  componentDidUpdate() {

    const { mainReducer } = this.props;

    const validToken = mainReducer.get("validToken");

    if(!validToken) {
      redirectUrl('/login');
    }

  }
  
  render() {
    const { mainReducer } = this.props;
    const styleMenu ={
      backgroundColor: '#00448c', 
      float: "left", 
      width: '190px', 
      height: "100%", 
      position: "absolute", 
      transition: 'all 0.3s' 
    }
    const styleMenuContract ={
      backgroundColor: '#00448c', 
      float: "left", 
      width: '80px', 
      height: "100%", 
      position: "absolute", 
      transition: 'all 0.3s' 
    }
    const styleBar = {
       paddingLeft: '190px', height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s' 
    }
    const styleBarContract = {
      paddingLeft: '80px', height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s' 
   }
    const enableMenu = this.state.enabledMenu;
    let enabledMenus = mainReducer.get('enableMenu');
    
    console.log(enabledMenus)
    return (
      <div style={{ width: "100%", height: "100%", position: "absolute", overflow: "hidden" }}>
        <div style={enabledMenus?styleMenu:styleMenuContract} >
          <MenuComponent stateMenu={enabledMenus} activeMenu={enabledMenus?this.changesStatusMenuAct:this.changesStatusMenuDes}/>
        </div>
        <div className="header" style={enabledMenus?styleBar:styleBarContract}>
          <NavBarComponent />
          <div
            id="dashboardComponentScroll"
            style={{ backgroundColor: "#ECECEC", width: "100%", height: "94%", float: "left", top: "60px", overflowY: "auto", overflowX: "hidden" }}>
            {this.props.children}
            <LoadingComponent />
            {mainReducer.get('showSaveData') &&
              <div className="ui active inverted dimmer">
                <div className="ui text loader">{mainReducer.get('messageData')}</div>
              </div>
            }
          </div>
        </div>

        <SweetAlert
          type="warning"
          show={this.state.showMessageNotification}
          title={this.state.messageTitle}
          text={this.state.messageNotification}
          confirmButtonColor='#DD6B55'
          confirmButtonText='Continuar'
          onConfirm={() => this.setState({ showMessageNotification: false })} />
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    dispatchLoadObservablesLeftTimer: loadObservablesLeftTimer,
    dispatchNotifiedProductionUpgrade: notifiedProductionUpgrade,
    dispatchValidateUpgrateProductionActive: validateUpgrateProductionActive,
    dispatchConsultParameterServer: consultParameterServer,
    dispatchChangeActiveMenu: changeStatusMenuAct,
    dispatchDesactiveMenu: changeStatusMenuDes
  }, dispatch);
}

const mapStateToProps = ({ login, mainReducer, reducerGlobal }) => {
  return {
    login,
    mainReducer,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
