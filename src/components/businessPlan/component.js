import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import ListBusinessPlanComponent from './listBusinessPlanComponent';
import PaginationBusinessPlanComponent from './paginationBusinessPlanComponent';
import ButtonDownloadBusinessPlanComponent from './downloadBusinessPlan/buttonDownloadBusinessPlanComponent';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import { redirectUrl } from '../globalComponents/actions';
import { businessPlanByClientFindServer, clearBusinessPlan } from './actions';
import { updateTitleNavBar } from '../navBar/actions';
import { validatePermissionsByModule, onSessionExpire } from '../../actionsGlobal';
import { NUMBER_RECORDS, FILTER_STATUS_BUSINESS_PLAN_ID } from './constants';
import { MODULE_BUSSINESS_PLAN, CREAR, DESCARGAR } from '../../constantsGlobal';

class BusinessPlanComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      value1: ""
    };

    this._createBusinessPlan = this._createBusinessPlan.bind(this);
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { businessPlanByClientFindServer, clearBusinessPlan, validatePermissionsByModule } = this.props;
      clearBusinessPlan();
      businessPlanByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "BP.D31_INITIAL_VALIDITY_DATE", 1, "", "");

      validatePermissionsByModule(MODULE_BUSSINESS_PLAN).then((data) => {
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          onSessionExpire();
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({ openMessagePermissions: true });
          }
        }
      });
    }
  }

  _createBusinessPlan() {
    const { updateTitleNavBar } = this.props;
    updateTitleNavBar('Informe de plan de negocio');
    redirectUrl('/dashboard/businessPlan');
  }

  render() {
    const { businessPlanReducer, reducerGlobal, navBar } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    let visibleDownload = 'none';
    if (businessPlanReducer.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
      visibleDownload = 'block';
    }

    return (
      <div className="tab-pane quickZoomIn animated"
        style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Estado del documento:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value1: value.id })
                }}
                  idTypeFilter={FILTER_STATUS_BUSINESS_PLAN_ID} />
              </Col>
              <Col xs>
                {_.get(reducerGlobal.get('permissionsBussinessPlan'), _.indexOf(reducerGlobal.get('permissionsBussinessPlan'), CREAR), false) &&
                  <button className="btn btn-primary" onClick={this._createBusinessPlan} type="button" title="Crear plan de negocio" style={{ marginTop: '21px' }}>
                    <i className="plus icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i> Crear
                  </button>
                }
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style={{ display: visibleTable, width: "100%" }}>
          <Row>
            <Col xs>
              <ListBusinessPlanComponent
                value1={this.state.value1} />
              <PaginationBusinessPlanComponent
                value1={this.state.value1} />
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span></Col>
          </Row>
        </Grid>
        {_.get(reducerGlobal.get('permissionsBussinessPlan'), _.indexOf(reducerGlobal.get('permissionsBussinessPlan'), DESCARGAR), false) &&
          <ButtonDownloadBusinessPlanComponent visibleDownload={visibleDownload} />
        }
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    businessPlanByClientFindServer,
    clearBusinessPlan,
    updateTitleNavBar,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ businessPlanReducer, navBar, reducerGlobal }, ownerProps) {
  return {
    businessPlanReducer,
    navBar,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessPlanComponent);