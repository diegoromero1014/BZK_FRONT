import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { redirectUrl } from '../globalComponents/actions';
import { Row, Grid, Col } from 'react-flexbox-grid';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import { NUMBER_RECORDS, FILTER_STATUS_VISIT_ID } from './constants';
import { visitByClientFindServer, clearVisit } from './actions';
import ListVisitComponent from './listVisitComponent';
import PaginationVisitComponent from './paginationVisitComponent';
import { updateTitleNavBar } from '../navBar/actions';
import ButtonCreateDownloadVisitModal from './downloadVisits/buttonCreateDownloadVisitModal';
import { MODULE_VISITS, CREAR, DESCARGAR } from '../../constantsGlobal';
import { validatePermissionsByModule } from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import { clearIdPrevisit } from './actions';
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _VISIT } from '../../constantsAnalytics';
import _ from 'lodash';

export class VisitComponent extends Component {

  constructor(props) {
    super(props);
    this._createVisit = this._createVisit.bind(this);
    this.state = {
      openMessagePermissions: false,
      value1: ""
    };
  }

  componentWillMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _VISIT,
      'pagina':_VISIT

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { visitByClientFindServer, clearVisit, validatePermissionsByModule } = this.props;
      clearVisit();
      visitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "vd.visitTime", 1, "");
      validatePermissionsByModule(MODULE_VISITS).then((data) => {
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

  _createVisit() {
    const { updateTitleNavBar, clearIdPrevisit } = this.props;
    clearIdPrevisit();
    updateTitleNavBar("Informe de visita/reunión");
    redirectUrl("/dashboard/visita");
  }

  render() {
    const { visitReducer, reducerGlobal } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    let visibleDownload = 'none';
    if (visitReducer.get('rowCount') !== 0) {
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
                  idTypeFilter={FILTER_STATUS_VISIT_ID} />
              </Col>
              <Col xs>
                {_.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), CREAR), false) &&
                  <button className="btn btn-primary" type="button" title="Crear reunión" style={{ marginTop: '18px' }} onClick={this._createVisit}>
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
              <ListVisitComponent
                value1={this.state.value1} />
              <PaginationVisitComponent
                value1={this.state.value1} />
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span></Col>
          </Row>
        </Grid>
        {_.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), DESCARGAR), false) &&
          <ButtonCreateDownloadVisitModal visibleDownload={visibleDownload} />
        }
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    visitByClientFindServer,
    clearVisit,
    updateTitleNavBar,
    clearIdPrevisit,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ visitReducer, navBar, reducerGlobal }, ownerProps) {
  return {
    visitReducer,
    navBar,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitComponent);