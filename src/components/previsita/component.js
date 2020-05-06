import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';

import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import ListPrevisitComponent from './listPrevisitComponent';
import PaginationPreVisitComponent from './paginationPrevisitComponent';
import ButtonCreateDownloadPreVisitModal from './downloadPrevisits/buttonCreateDownloadPrevisitModal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';

import { redirectUrl } from '../globalComponents/actions';
import { previsitByClientFindServer, clearPrevisit } from './actions';
import { downloadFilePdf } from '../clientInformation/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';
import { updateTitleNavBar } from '../navBar/actions';

import { NUMBER_RECORDS, FILTER_STATUS_PREVISIT_ID } from './constants';
import { FILE_OPTION_PRE_VISIT_GUIDE, MODULE_PREVISITS, CREAR, DESCARGAR, NAME_FILE_PRE_VISIT_GUIDE } from '../../constantsGlobal';
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _PREVISIT } from '../../constantsAnalytics';
import _ from 'lodash';
import { changeStateSaveData } from '../main/actions';

export class PrevisitComponent extends Component {

  constructor(props) {
    super(props);
    this.createPrevisita = this.createPrevisita.bind(this);
    this.downloadFilePrevisitGuide = this.downloadFilePrevisitGuide.bind(this);
    this.state = {
      openMessagePermissions: false,
      value1: ""
    };
  }

  createPrevisita = () => {
    const { dispatchUpdateTitleNavBar } = this.props;
    dispatchUpdateTitleNavBar("Informe de previsita");
    redirectUrl("/dashboard/previsita");
  }

  componentWillMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _PREVISIT,
      'pagina': _PREVISIT

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { dispatchprevisitByClientFindServer, dispatchClearPrevisit, dispatchValidatePermissionsByModule } = this.props;
      dispatchClearPrevisit();
      dispatchprevisitByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "pvd.visitTime", 1, "");
      dispatchValidatePermissionsByModule(MODULE_PREVISITS).then((data) => {
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

  downloadFilePrevisitGuide = () => {
    const { dispatchDownloadFilePdf, dispatchChangeStateSaveData } = this.props;
    dispatchDownloadFilePdf(FILE_OPTION_PRE_VISIT_GUIDE, NAME_FILE_PRE_VISIT_GUIDE, dispatchChangeStateSaveData);
  }

  render() {
    let visibleTable = 'none';
    let visibleMessage = 'block';
    let visibleDownload = 'none';
    const { previsitReducer, reducerGlobal } = this.props;
    if (previsitReducer.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
      visibleDownload = 'block';
    }
    return (
      <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs>
                <span style={{ fontWeight: 'bold', color: '#4C5360' }}>Estado del documento:</span>
                <SelectFilterContact config={{ onChange: (value) => this.setState({ value1: value.id }) }} idTypeFilter={FILTER_STATUS_PREVISIT_ID} />
              </Col>
              <Col xs>
                {
                  _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), CREAR), false) &&
                  <button className="btn btn-primary" type="button" title="Crear previsita"
                    style={{ marginTop: "18px" }} onClick={this.createPrevisita}>
                    <i className="plus icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i> Crear
                  </button>
                }

                <button className="btn btn-primary" style={{ marginTop: '20px', marginLeft: '15px' }}
                  type="button" title="Caso práctico previsita" onClick={this.downloadFilePrevisitGuide}>
                  <span>{'Caso práctico'} </span>
                  <i title="Informe de previsita guía" className="file pdf outline icon"
                    style={{ cursor: "pointer", position: 'relative' }}></i>
                </button>
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style={{ display: visibleTable, width: "100%" }}>
          <Row>
            <Col xs>
              <ListPrevisitComponent value1={this.state.value1} />
              <PaginationPreVisitComponent value1={this.state.value1} />
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}>
              <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
            </Col>
          </Row>
        </Grid>
        {_.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), DESCARGAR), false) &&
          <ButtonCreateDownloadPreVisitModal visibleDownload={visibleDownload} />
        }
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  dispatchprevisitByClientFindServer: previsitByClientFindServer,
  dispatchClearPrevisit: clearPrevisit,
  dispatchUpdateTitleNavBar: updateTitleNavBar,
  dispatchValidatePermissionsByModule: validatePermissionsByModule,
  dispatchDownloadFilePdf: downloadFilePdf,
  dispatchChangeStateSaveData: changeStateSaveData
}, dispatch);

const mapStateToProps = ({ previsitReducer, reducerGlobal, navBar }) => ({
  previsitReducer,
  reducerGlobal,
  navBar
})

export default connect(mapStateToProps, mapDispatchToProps)(PrevisitComponent);