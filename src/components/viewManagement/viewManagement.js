import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';
import ItemChart from './ItemChart';
import { changeTabSeletedChartView, changeErrorYearSeleted } from './actions';
import ViewChartPrevisit from './chartPrevisit/viewChartPrevisit';
import ViewChartVisit from './chartVisit/viewChartVisit';
import ViewChartBusinessPlan from './chartBusinessPlan/viewChartBusinessPlan';
import { TAB_PREVISIT, TAB_VISIT, TAB_PIPELINE, TAB_BUSINESS } from './constants';
import { validatePermissionsByModule } from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import AlertErrorYearNoSeleted from '../globalComponents/alertErrorYearNoSeleted';
import { MODULE_MANAGERIAL_VIEW, BLUE_COLOR, GREEN_COLOR, ORANGE_COLOR, RED_COLOR } from '../../constantsGlobal';
import SweetAlert from 'sweetalert-react';
import _ from 'lodash';

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
      openMessagePermissions: false
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionToken') === "") {
      redirectUrl("/login");
    } else {
      const {changeTabSeletedChartView, updateTitleNavBar, validatePermissionsByModule} = this.props;
      changeTabSeletedChartView(0);
      updateTitleNavBar("Vista gerencial");
      validatePermissionsByModule(MODULE_MANAGERIAL_VIEW).then((data) => {
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({ openMessagePermissions: true });
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
    const {viewManagementReducer, reducerGlobal} = this.props;
    const tabSeletedReducer = viewManagementReducer.get('tabSeleted');
    const isLoadChart = viewManagementReducer.get('loadChart');
    return (
      <div className="ui segment" style={{ marginTop: '-2px' }}>
        <div style={{ backgroundColor: "white" }}>
          <Row xs={12} md={12} lg={12} style={{ padding: '15px 20px 10px 20px' }}>
            {itemsChart.map(this._mapChartItems)}
          </Row>
        </div>
        {tabSeletedReducer === TAB_PIPELINE && <div />}
        {tabSeletedReducer === TAB_PREVISIT && <ViewChartPrevisit />}
        {tabSeletedReducer === TAB_VISIT && <ViewChartVisit />}
        {tabSeletedReducer === TAB_BUSINESS && <ViewChartBusinessPlan />}
        {isLoadChart && tabSeletedReducer !== 0 &&
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Cargando gráfica</div>
          </div>
        }
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
