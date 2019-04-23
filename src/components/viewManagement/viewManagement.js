import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import ItemChart from './itemChart';
import { changeTabSeletedChartView, changeErrorYearSeleted } from './actions';

import { TAB_PREVISIT, TAB_VISIT, TAB_PIPELINE, TAB_BUSINESS, TAB_TASKS } from './constants';
import { validatePermissionsByModule } from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import { MODULE_MANAGERIAL_VIEW, BLUE_COLOR, GREEN_COLOR, ORANGE_COLOR, RED_COLOR, DOWNLOAD_TASK } from '../../constantsGlobal';
import SweetAlert from '../sweetalertFocus';
import _ from 'lodash';
import SecurityMessageComponent from '../globalComponents/securityMessageComponent';

const itemsChart = [
  {
    text: "Previsitas",
    icon: "bar chart icon",
    styleColor: BLUE_COLOR,
    tab: TAB_PREVISIT
  },
  {
    text: "Visitas",
    icon: "bar chart icon",
    styleColor: GREEN_COLOR,
    tab: TAB_VISIT
  },
  {
    text: "Pipeline",
    icon: "bar chart icon",
    styleColor: ORANGE_COLOR,
    tab: TAB_PIPELINE
  },
  {
    text: "Negocios",
    icon: "bar chart icon",
    styleColor: RED_COLOR,
    tab: TAB_BUSINESS
  }

];

class ViewManagement extends Component {
  constructor(props) {
    super(props);
    this._closeModalErrorYear = this._closeModalErrorYear.bind(this);
    this.state = {
      openMessagePermissions: false,
      showButtonTask: false
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const {changeTabSeletedChartView, updateTitleNavBar, validatePermissionsByModule, reducerGlobal} = this.props;
      changeTabSeletedChartView(0);
      updateTitleNavBar("Vista gerencial");
      validatePermissionsByModule(MODULE_MANAGERIAL_VIEW).then((data) => {        
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({ openMessagePermissions: true });
          }
          const permissionList = _.get(data, 'payload.data.data.permissions');
          let hasDownloadTaskPermission = false;
          for (let index = 0; index < permissionList.length; index++) {
            if (permissionList[index] == DOWNLOAD_TASK) {
              hasDownloadTaskPermission = true;
              break;
            }  
          }
          if (hasDownloadTaskPermission) {                                    
            this.setState({ showButtonTask: true });
          }
        }
      });
    }
  }

  _closeModalErrorYear() {
    const {changeErrorYearSeleted} = this.props;
    changeErrorYearSeleted(false);
  }

  _mapChartItems(item, idx) {
    return <ItemChart
      key={idx}
      textValue={item.text}
      iconValue={item.icon}
      styleColor={item.styleColor}
      itemSeleted={item.tab}
      />
  }

  render() {
    const {viewManagementReducer} = this.props;
    return (      
      <div className="ui segment" style={{ marginTop: '-2px' }}>   
        <SecurityMessageComponent/>
        <div style={{ backgroundColor: "white" }}>          
          <Row xs={12} md={12} lg={12} style={{ padding: '15px 20px 10px 20px' }}>
            {itemsChart.map(this._mapChartItems)}
          </Row>
          {this.state.showButtonTask && <Row xs={12} md={12} lg={12} style={{ padding: '15px 20px 10px 20px' }}>
            <ItemChart
              key={1}
              textValue={'Tareas'}
              iconValue={'bar chart icon'}
              styleColor={"#696969"}
              itemSeleted={TAB_TASKS}
            />
          </Row>}
        </div>

        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
        <SweetAlert
          type="error"
          show={viewManagementReducer.get('errorYearSeleted')}
          title="Información faltante"
          text="Señor usuario, para descargar la información debe seleccionar el año."
          onConfirm={this._closeModalErrorYear}
          />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateTitleNavBar,
    changeTabSeletedChartView,
    validatePermissionsByModule,
    changeErrorYearSeleted
  }, dispatch);
}

function mapStateToProps({viewManagementReducer, navBar, reducerGlobal}, ownerProps) {
  return {
    viewManagementReducer,
    navBar,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewManagement);
