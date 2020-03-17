import React, {Component} from 'react';
import {Col, Grid, Row} from 'react-flexbox-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {clearUserTask, tasksByClientFindServer} from './actions';
import {NUMBER_RECORDS, TASK_STATUS} from './constants';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import {CREAR, MODULE_TASKS} from '../../constantsGlobal';
import {validatePermissionsByModule} from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import {redirectUrl} from '../globalComponents/actions';
import {_TASK, BIZTRACK_MY_CLIENTS, nombreflujoAnalytics} from '../../constantsAnalytics';
import { updateTitleNavBar } from '../navBar/actions';

class UserTaskComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      value1: ""
    };
    this.createTask = this.createTask.bind(this);
  }

  componentWillMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _TASK,
      'pagina':_TASK

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { dispatchTasksByClientFindServer, dispatchClearUserTask, dispatchValidatePermissionsByModule } = this.props;
      dispatchClearUserTask();
      dispatchTasksByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, "finalDate", 0, "");
      dispatchValidatePermissionsByModule(MODULE_TASKS).then((data) => {
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

  createTask() {
    const { dispatchUpdateTitleNavBar } = this.props;
    dispatchUpdateTitleNavBar("Tareas");
    redirectUrl("/dashboard/task");
  }

  render() {
    const { tasksByClient, reducerGlobal } = this.props;
    let visibleTable = 'none';
    let visibleMessage = 'block';
    if (tasksByClient.get('rowCount') !== 0) {
      visibleTable = 'block';
      visibleMessage = 'none';
    }
    return (
      <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Estado de la tarea:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.setState({ value1: value.id })
                }}
                  idTypeFilter={TASK_STATUS} />
              </Col>
              <Col xs>
                {_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), CREAR), false) &&
                  <button className="btn btn-primary" type="button" title="Crear Tarea"
                          style={{marginTop: "18px"}} onClick={this.createTask}>
                    <i className="plus icon" style={{color: "white", margin: 'em', fontSize: '1.2em'}}/>
                    Crear
                  </button>
                }
              </Col>
            </Row>
          </Grid>
        </div>
        <Grid style={{ display: visibleTable, width: "100%" }}>
          <Row>
            <Col xs>
              <ListPendingTaskComponent value1={this.state.value1} />
              <PaginationPendingTaskComponent value1={this.state.value1} />
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
        <AlertWithoutPermissions openMessagePermissions={this.state.openMessagePermissions} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatchTasksByClientFindServer: tasksByClientFindServer,
    dispatchClearUserTask: clearUserTask,
    dispatchValidatePermissionsByModule: validatePermissionsByModule,
    dispatchUpdateTitleNavBar: updateTitleNavBar
  }, dispatch);
}

function mapStateToProps({ tasksByClient, reducerGlobal }) {
  return {
    tasksByClient,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTaskComponent);