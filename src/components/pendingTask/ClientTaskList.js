import React, { Component } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dimmer, Loader } from 'semantic-ui-react';
import {
  pendingTasksByClientPromise,
  pendingTasksByClientFindServer,
  finalizedTasksByClientPromise,
  finalizedTasksByClientFindServer,
  cleanPagAndOrderColumnPendingUserTask,
  cleanPagAndOrderColumnFinalizedUserTask,
  changePagePending,
  changePageFinalized
} from "./actions";
import { PENDING_TASKS, FINALIZED_TASKS, NUMBER_RECORDS, PENDING, FINISHED } from './constants';
import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import { MODULE_TASKS, CREAR, REQUEST_SUCCESS } from "../../constantsGlobal";
import { validatePermissionsByModule } from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import { redirectUrl } from '../globalComponents/actions';
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _TASK } from '../../constantsAnalytics';
import TabComponent from './../../ui/Tab';
import PendingTasksIndicatorHelp from './pendingTasksHelp';
import SearchInputComponent from "../../ui/searchInput/SearchInputComponent";
class ClientTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      loading: false    
    };
    this.createTask= this.createTask.bind(this);
    this._onChangeSearch = this._onChangeSearch.bind(this);
  }
  dispatchPendingTasks = async (pageNum, order) => {
    const {dispatchPendingTasksByClientFindServer} = this.props;
    this.setState({loading: true});
    const result = await pendingTasksByClientPromise(
      pageNum,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      order
    );
    if (REQUEST_SUCCESS === result.data.status) {
      const dataPending = result.data.data;
      dispatchPendingTasksByClientFindServer(dataPending, pageNum, order);
    }
    this.setState({ loading: false });
  }
  dispatchFinalizedTask = async (pageNum, order) => {
    const { dispatchFinalizedTasksByClientFindServer } = this.props;
    this.setState({ loading: true });
    const result = await finalizedTasksByClientPromise(
      pageNum,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      order
    );
    if (REQUEST_SUCCESS === result.data.status) {
      const data = result.data.data;
      dispatchFinalizedTasksByClientFindServer(data, pageNum, order);
    }
    this.setState({ loading: false });
  }
  componentDidMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _TASK,
      'pagina': _TASK

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const {
        dispatchValidatePermissionsByModule,
        dispatchCleanPagAndOrderColumnFinalizedUserTask,
        dispatchCleanPagAndOrderColumnPendingUserTask
      } = this.props;
      dispatchCleanPagAndOrderColumnPendingUserTask(0);
      dispatchCleanPagAndOrderColumnFinalizedUserTask(0);
      this.dispatchPendingTasks(0, 0);
      this.dispatchFinalizedTask(0, 0);
      dispatchValidatePermissionsByModule(MODULE_TASKS).then(data => {
        if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
          redirectUrl("/login");
        } else {
          if (!_.get(data, 'payload.data.data.showModule') || _.get(data, 'payload.data.data.showModule') === 'false') {
            this.setState({openMessagePermissions: true});
          }
        }
      });
    }
  }

  orderColumn = (orderTask, mode) => {
    const {
      dispatchCleanPagAndOrderColumnPendingUserTask,
      dispatchCleanPagAndOrderColumnFinalizedUserTask
    } = this.props;
    switch (mode) {
      case PENDING:
        dispatchCleanPagAndOrderColumnPendingUserTask(orderTask);
        this.dispatchPendingTasks(0, orderTask);
        break;
      case FINISHED:
        dispatchCleanPagAndOrderColumnFinalizedUserTask(orderTask);
        dispatchFinalizedTask(0, orderTask);
        break;
    }
  };

    _onChangeSearch(value){

    }

  handleTaskByClientsFind = (limInf, mode )=> {
    const { tasksByClient } = this.props;
    switch (mode) {
      case PENDING:   
        this.dispatchPendingTasks(limInf, tasksByClient.get("tabPending").order);
        break;
      case FINISHED:
        this.dispatchFinalizedTask(limInf, tasksByClient.get("tabFinished").order);
        break;
    }
    
  };

  handlePaginar = (page, mode) => {
    const { dispatchChangePagePending, dispatchChangePageFinalized, tasksByClient } = this.props;
    switch (mode) {
      case PENDING:
        dispatchChangePagePending(page, tasksByClient.get("tabPending").order);
        break;
      case FINISHED:
        dispatchChangePageFinalized(page, tasksByClient.get("tabFinished").order);
        break;
    }
    this.handleTaskByClientsFind(page, mode);
  };

  clearUserTask = mode =>{
    const {
      dispatchCleanPagAndOrderColumnPendingUserTask,
      dispatchCleanPagAndOrderColumnFinalizedUserTask
    } = this.props;
    switch (mode) {
      case PENDING:
        dispatchCleanPagAndOrderColumnPendingUserTask(0);
        break;
      case FINISHED:
        dispatchCleanPagAndOrderColumnFinalizedUserTask(0);
        break;
    }
  }
  createTask() {
    const { dispatchUpdateTitleNavBar } = this.props;
    dispatchUpdateTitleNavBar("Tareas");
    redirectUrl("/dashboard/task");
  }
  
  render() {
    const { tasksByClient, reducerGlobal } = this.props;
    let tabPending = tasksByClient.get("tabPending");
    let tabFinished = tasksByClient.get("tabFinished");
    return (
      <div
        className="tab-pane quickZoomIn animated"
        style={{
          width: "100%",
          marginTop: "10px",
          marginBottom: "70px",
          paddingTop: "20px"
        }}
      >
        <div
          className="tab-content break-word"
          style={{
            zIndex: 0,
            border: "1px solid #cecece",
            padding: "16px",
            borderRadius: "3px",
            overflow: "visible"
          }}
        >
          <Grid style={{ width: "100%" }}>
              <Row>
                  <Col xs={12} sm={8} md={6} lg={6}>
                      <SearchInputComponent onChangeSearch={(text)=> this._onChangeSearch(text)}/>
                  </Col>
              </Row>
            <Row>
              <PendingTasksIndicatorHelp></PendingTasksIndicatorHelp>
            </Row>
            <Row>
              <Col xs>
                {_.get(
                  reducerGlobal.get("permissionsTasks"),
                  _.indexOf(reducerGlobal.get("permissionsTasks"), CREAR),
                  false
                ) && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    title="Crear Tarea"
                    style={{ marginTop: "18px" }}
                    onClick={this.createTask}
                  >
                    <i
                      className="plus icon"
                      style={{
                        color: "white",
                        margin: "em",
                        fontSize: "1.2em"
                      }}
                    />
                    Crear
                  </button>
                )}
              </Col>
            </Row>
          </Grid>
        </div>
        <div>
          {this.state.loading === true ? "Cargando..." : ""}
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs>
                <TabComponent
                  tabs={[
                    {
                      name: PENDING_TASKS,
                      content: (
                        <div>
                          <ListPendingTaskComponent
                            orderColumn={this.orderColumn}
                            tasks={tabPending.data}
                            handleTaskByClientsFind={
                              this.handleTaskByClientsFind
                            }
                            mode={PENDING}
                          />
                          <PaginationPendingTaskComponent
                            tab={tabPending}
                            clearUserTask={this.clearUserTask}
                            handlePaginar={this.handlePaginar}
                            mode={PENDING}
                          />
                        </div>
                      ),
                      number: tabPending.rowCount
                    },
                    {
                      name: FINALIZED_TASKS,
                      content: (
                        <div>
                          <ListPendingTaskComponent
                            orderColumn={this.orderColumn}
                            tasks={tabFinished.data}
                            handleTaskByClientsFind={
                              this.handleTaskByClientsFind
                            }
                            mode={FINISHED}
                          />
                          <PaginationPendingTaskComponent
                            tab={tabFinished}
                            clearUserTask={this.clearUserTask}
                            handlePaginar={this.handlePaginar}
                            mode={FINISHED}
                          />
                        </div>
                      ),
                      number: tabFinished.rowCount
                    }
                  ]}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        <AlertWithoutPermissions
          openMessagePermissions={this.state.openMessagePermissions}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      dispatchValidatePermissionsByModule: validatePermissionsByModule,
      dispatchPendingTasksByClientFindServer: pendingTasksByClientFindServer,
      dispatchFinalizedTasksByClientFindServer: finalizedTasksByClientFindServer,
      dispatchCleanPagAndOrderColumnPendingUserTask: cleanPagAndOrderColumnPendingUserTask,
      dispatchCleanPagAndOrderColumnFinalizedUserTask: cleanPagAndOrderColumnFinalizedUserTask,
      dispatchChangePagePending: changePagePending,
      dispatchChangePageFinalized: changePageFinalized
    },
    dispatch
  );
}

function mapStateToProps({ tasksByClient, reducerGlobal }) {
  return {
    tasksByClient,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientTaskList);