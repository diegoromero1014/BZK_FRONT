import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { redirectUrl } from '../../globalComponents/actions';
import { updateTitleNavBar } from '../../navBar/actions';
import { tasksByUser, clearMyPendingsOrder, clearMyPendingPaginator, clearPendingTask, clearOnlyListPendingTask, getDownloadPendingTask } from './actions';
import { NUMBER_RECORDS } from './constants';
import ListPendingTaskComponent from './listMyPendingComponent';
import PaginationPendingTask from './paginationPendingTask';
import { GREEN_COLOR, ORANGE_COLOR, RED_COLOR, APP_URL, MODULE_TASKS, DESCARGAR, MESSAGE_DOWNLOAD_DATA } from '../../../constantsGlobal';
import { validateResponse } from '../../../actionsGlobal';
import _ from 'lodash';
import Tooltip from "../../toolTip/toolTipComponent";
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from '../../dashboard/actions';

class ModalComponentPending extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keywordMyPending: '',
    }
    this.consultInfoMyPendingTask = this.consultInfoMyPendingTask.bind(this);
    this._handleMyPendingByClientsFind = this._handleMyPendingByClientsFind.bind(this);
    this._handleChangeKeyword = this._handleChangeKeyword.bind(this);
    this._cleanSearch = this._cleanSearch.bind(this);
    this._downloadPendingTask = this._downloadPendingTask.bind(this);
  }

  _handleChangeKeyword(e) {
    if (e.keyCode === 13 || e.which === 13) {
      this.consultInfoMyPendingTask();
    } else {
      this.setState({
        keywordMyPending: e.target.value
      });
    }
  }

  _downloadPendingTask() {
    const { getDownloadPendingTask, changeStateSaveData, swtShowMessage } = this.props;
    changeStateSaveData(true, MESSAGE_DOWNLOAD_DATA);
    getDownloadPendingTask(window.localStorage.getItem('idClientSelected')).then((data) => {
      changeStateSaveData(false, "");
      if (validateResponse(data)) {
        window.open(APP_URL + '/getExcelReport?filename=' + _.get(data, 'payload.data.data.filename', null) + '&id=' + _.get(data, 'payload.data.data.sessionToken', null), '_blank');
      } else {
        swtShowMessage('error', 'Erro descargando tareas', 'Señor usuario, ocurrió un error al tratar de descargar las tareas pendientes.');
      }
    });
  }

  componentWillMount() {
    const { clearPendingTask, updateTitleNavBar } = this.props;
    clearPendingTask();
    this.consultInfoMyPendingTask();
    updateTitleNavBar("Mis pendientes");
  }

  consultInfoMyPendingTask() {
    const { tasksByUser, clearMyPendingPaginator, clearOnlyListPendingTask } = this.props;
    clearOnlyListPendingTask();
    clearMyPendingPaginator();
    tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending).then((data) => {
      if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
      }
    });
  }

  _handleMyPendingByClientsFind() {
    const { tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder } = this.props;
    clearMyPendingPaginator();
    clearMyPendingsOrder();
    tasksByUser(0, NUMBER_RECORDS, this.state.keywordMyPending, null, "");
  }

  _cleanSearch() {
    this.setState({ keywordMyPending: "" });
    const { tasksByUser, clearMyPendingPaginator, clearMyPendingsOrder, clearOnlyListPendingTask } = this.props;
    clearOnlyListPendingTask();
    clearMyPendingPaginator();
    clearMyPendingsOrder();
    tasksByUser(0, NUMBER_RECORDS, "", null, "");
  }

  render() {
    const { myPendingsReducer, reducerGlobal } = this.props;
    var visibleTable = 'none';
    var visibleMessage = 'block';
    if (myPendingsReducer.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "20px", paddingTop: "20px" }}>
        <div style={{ padding: '10px', overflow: 'initial' }}>
          <Row style={{ borderBottom: "2px solid #D9DEDF" }}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <div className="InputAddOn">
                <input style={{ padding: '0px 11px !important' }} id="searchExpression" onKeyPress={this._handleChangeKeyword} type="text" placeholder="Búsqueda por tipo de documento, número de documento y nombre del cliente" value={this.state.keywordMyPending} onChange={this._handleChangeKeyword} className="input InputAddOn-field" />
                <button onClick={this._handleMyPendingByClientsFind} className="button InputAddOn-item">
                  <i className="search icon" />
                </button>
              </div>
            </Col>
            <Col xs={12} sm={12} md={2} lg={1} style={{ width: '100%' }}>
              <button className="btn btn-primary" type="button" onClick={this._cleanSearch}
                title="Limpiar búsqueda" style={{ marginLeft: "17px" }}>
                <i className="erase icon"
                  style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
              </button>
            </Col>
            {_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), DESCARGAR), false) &&

              <Col xs={12} sm={12} md={2} lg={1} style={{ width: '100%' }}>
                <Tooltip text="Descargar tareas Pendientes">
                  <button className="btn btn-primary" type="button" onClick={this._downloadPendingTask} style={{ marginLeft: '-15px' }}>
                    <i className="file excel outline icon" style={{ color: "white", margin: '0em', fontSize: '1.2em' }}></i>
                  </button>
                </Tooltip>
              </Col>
            }
            <Col xs={12} sm={12} md={2} lg={3}>
              <div style={{ height: '80px', marginLeft: '30px' }} >
                <Row>
                  <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: RED_COLOR }}></div>
                  <span style={{ marginLeft: '10px' }}> Tarea vencida</span>
                </Row>
                <Row style={{ marginTop: "5px" }}>
                  <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: ORANGE_COLOR }}></div>
                  <span style={{ marginLeft: '10px' }}> Tarea próxima a vencerse</span>
                </Row>
                <Row style={{ marginTop: "5px" }}>
                  <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: GREEN_COLOR }}></div>
                  <span style={{ marginLeft: '10px' }}> Tarea con tiempo</span>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <Grid style={{ display: visibleTable, width: "100%", marginBottom: '10px', marginTop: '20px' }}>
          <Row style={{ backgroundColor: 'white', marginLeft: '10px', marginRight: '10px' }}>
            <Col style={{ width: '100%' }}>
              <ListPendingTaskComponent keyWordParameter={this.state.keywordMyPending} />
              <div style={{ marginBottom: '10px' }}>
                <PaginationPendingTask keyWordParameter={this.state.keywordMyPending} />
              </div>
            </Col>
          </Row>
        </Grid>
        <Grid style={{ display: visibleMessage, width: "100%" }}>
          <Row center="xs">
            <Col xs={12} sm={8} md={12} lg={12} style={{ marginTop: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#4C5360' }}>No se han encontrado resultados para la búsqueda</span>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearOnlyListPendingTask,
    redirectUrl,
    clearPendingTask,
    tasksByUser,
    clearMyPendingPaginator,
    clearMyPendingsOrder,
    updateTitleNavBar,
    changeStateSaveData,
    getDownloadPendingTask,
    validateResponse,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ myPendingsReducer, reducerGlobal, navBar }, ownerProps) {
  return {
    myPendingsReducer,
    reducerGlobal,
    navBar
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalComponentPending);
