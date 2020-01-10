import React, { Component } from 'react';
import MenuComponent from '../menu/component';
import { changeStateSaveData, notifiedProductionUpgrade, validateUpgrateProductionActive } from './actions';
import NavBarComponent from '../navBar/navBarComponent';
import { redirectUrl } from '../globalComponents/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadingComponent from '../loading/loadingComponent';
import { loadObservablesLeftTimer } from '../login/actions';
import SweetAlert from "../sweetalertFocus";
import Worker from '../../worker/Worker';
import WorkerSetup from '../../worker/WorkerSetup';
import { consultParameterServer } from '../../actionsGlobal';
import { RANGO_PASO_PRODUCCION } from '../../constantsParameters';

/* moment.tz.setDefault('America/Bogota'); */

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMessageNotification: false,
      messageTitle: "",
      messageNotification: "",
      initialDate: null,
      finalDate: null
    }
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
    const { consultParameterServer } = this.props;

    consultParameterServer(RANGO_PASO_PRODUCCION).then(resolve => {
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

  componentWillMount() {
    const { notifiedProductionUpgrade, validateUpgrateProductionActive } = this.props;

    let token = window.localStorage.getItem('sessionTokenFront');

    if (token == null || token === "" || document.cookie.indexOf('estadoconexion=') == -1) {
      window.localStorage.setItem('sessionTokenFront', '');
      document.cookie = 'estadoconexion=activa;path=/';
      redirectUrl("/login");
    } else {
      const { loadObservablesLeftTimer, dashboardReducer } = this.props;

      loadObservablesLeftTimer();

      let productionUpgradeNotified = dashboardReducer.get('productionUpgradeNotified');

      if (!productionUpgradeNotified) {
        notifiedProductionUpgrade();

        validateUpgrateProductionActive().then(resolve => {
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

    const { dashboardReducer } = this.props;

    const validToken = dashboardReducer.get("validToken");

    if(!validToken) {
      redirectUrl('/login');
    }

  }

  render() {
    const { dashboardReducer } = this.props;

    return (
      <div style={{ width: "100%", height: "100%", position: "absolute", overflow: "hidden" }}>
        <div style={{ backgroundColor: '#00448c', float: "left", width: '190px', height: "100%", position: "absolute", transition: 'all 0.3s' }} >
          <MenuComponent />
        </div>
        <div className="header" style={{ paddingLeft: '190px', height: "100%", float: "left", width: "100%", overflow: "hidden", transition: 'all 0.3s' }}>
          <NavBarComponent />
          <div
            id="dashboardComponentScroll"
            style={{ backgroundColor: "#ECECEC", width: "100%", height: "94%", float: "left", top: "60px", overflowY: "auto", overflowX: "hidden" }}>
            {this.props.children}
            <LoadingComponent />
            {dashboardReducer.get('showSaveData') &&
              <div className="ui active inverted dimmer">
                <div className="ui text loader">{dashboardReducer.get('messageData')}</div>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeStateSaveData,
    loadObservablesLeftTimer,
    notifiedProductionUpgrade,
    validateUpgrateProductionActive,
    consultParameterServer
  }, dispatch);
}

function mapStateToProps({ login, dashboardReducer }, ownerProps) {
  return {
    login,
    dashboardReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
