import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';

import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import ListPipelineComponent from './listPipelineComponent';
import PaginationPipelineComponent from './paginationPipelineComponent';
import ButtonDownloadPipelineComponent from './downloadPipeline/buttonDownloadPipelineComponent';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';

import { redirectUrl } from '../globalComponents/actions';
import { pipelineByClientFindServer, clearPipeline } from './actions';
import { updateTitleNavBar } from '../navBar/actions';
import { validatePermissionsByModule } from '../../actionsGlobal';

import { NUMBER_RECORDS, FILTER_STATUS_PIPELINE_ID, PIPELINE_STATUS } from './constants';
import { MODULE_PIPELINE, CREAR, DESCARGAR } from '../../constantsGlobal';
import _ from "lodash";

export class PipelineComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      value1: "",
      value2: ""
    };
    this._createPipeline = this._createPipeline.bind(this);
  }

  componentWillMount() {
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { pipelineByClientFindServer, clearPipeline, validatePermissionsByModule } = this.props;
      clearPipeline();
      pipelineByClientFindServer(window.sessionStorage.getItem('idClientSelected'), 0, NUMBER_RECORDS, "", 1, "", "");
      validatePermissionsByModule(MODULE_PIPELINE).then((data) => {
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

  _createPipeline() {
    const { updateTitleNavBar } = this.props;
    updateTitleNavBar('Informe pipeline');
    redirectUrl('/dashboard/pipeline');
  }

  render() {
    const { pipelineReducer, reducerGlobal } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    let visibleDownload = 'none';
    if (pipelineReducer.get('rowCount') !== 0) {
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
                  idTypeFilter={FILTER_STATUS_PIPELINE_ID} />
              </Col>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Estado del negocio:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value2: value.id })
                }}
                  idTypeFilter={PIPELINE_STATUS} />
              </Col>
              <Col xs>
                {_.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), CREAR), false) &&
                  <button className="btn btn-primary" onClick={this._createPipeline} type="button" title="Crear pipeline" style={{ marginTop: '18px' }}>
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
              <ListPipelineComponent value1={this.state.value1} value2={this.state.value2} />
              <PaginationPipelineComponent value1={this.state.value1} value2={this.state.value2} />
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12}><span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span></Col>
          </Row>
        </Grid>
        {_.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), DESCARGAR), false) &&
          <ButtonDownloadPipelineComponent visibleDownload={visibleDownload} />
        }
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    pipelineByClientFindServer,
    clearPipeline,
    updateTitleNavBar,
    validatePermissionsByModule
  }, dispatch);
}

function mapStateToProps({ pipelineReducer, navBar, reducerGlobal, clientInformacion }, ownerProps) {
  return {
    pipelineReducer,
    navBar,
    reducerGlobal,
    clientInformacion
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PipelineComponent);