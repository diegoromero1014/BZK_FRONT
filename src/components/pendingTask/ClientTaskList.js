import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Loader } from 'semantic-ui-react';

import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import SearchInputComponent from "../../ui/searchInput/SearchInputComponent";
import PendingTasksHelp from "./pendingTasksHelp";
import TabComponent from './../../ui/Tab';

import {
  changePageFinalized,
  changePagePending,
  cleanPagAndOrderColumnFinalizedUserTask,
  cleanPagAndOrderColumnPendingUserTask,
  cleanTextToSearch,
  finalizedTasksByClientFindServer,
  finalizedTasksByClientPromise,
  pendingTasksByClientFindServer,
  pendingTasksByClientPromise,
  setTextToSearch
} from "./actions";
import { validatePermissionsByModule } from '../../actionsGlobal';
import { redirectUrl } from '../globalComponents/actions';
import { updateTitleNavBar } from '../navBar/actions';

import { FINALIZED_TASKS, FINISHED, NUMBER_RECORDS, PENDING, PENDING_TASKS } from './constants';
import { CREAR, MODULE_TASKS, REQUEST_SUCCESS } from "../../constantsGlobal";
import { _TASK, BIZTRACK_MY_CLIENTS, nombreflujoAnalytics } from '../../constantsAnalytics';

export class ClientTaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      loading: false,
      searchByText: false,
      textToSearch: ""
    };
  }

  dispatchPendingTasks = async (pageNum, order, textToSearch) => {
    const {dispatchPendingTasksByClientFindServer, dispatchSetTextToSearch} = this.props;
    this.setState({loading: true});

    const result = await pendingTasksByClientPromise(
      pageNum,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      order,
      textToSearch
    );
    if (REQUEST_SUCCESS === result.data.status) {
      const dataPending = result.data.data;
      dispatchPendingTasksByClientFindServer(dataPending, pageNum, order);
      dispatchSetTextToSearch(textToSearch);
    }
    this.setState({loading: false});
  }

  dispatchFinalizedTask = async (pageNum, order, textToSearch) => {
    const {dispatchFinalizedTasksByClientFindServer, dispatchSetTextToSearch} = this.props;
    this.setState({loading: true});
    const result = await finalizedTasksByClientPromise(
      pageNum,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      order,
      textToSearch
    );
    if (REQUEST_SUCCESS === result.data.status) {
      const data = result.data.data;
      dispatchFinalizedTasksByClientFindServer(data, pageNum, order);
      dispatchSetTextToSearch(textToSearch);
    }
    this.setState({loading: false});
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

      this.dispatchPendingTasks(0, 0, null);
      this.dispatchFinalizedTask(0, 0, null);

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

  componentWillUnmount() {
    const {dispatchCleanTextToSearch} = this.props;
    dispatchCleanTextToSearch();
  }

  orderColumn = (orderTask, mode) => {
    const {
      dispatchCleanPagAndOrderColumnPendingUserTask,
      dispatchCleanPagAndOrderColumnFinalizedUserTask,
      tasksByClient
    } = this.props;

    switch (mode) {
      case PENDING:
        dispatchCleanPagAndOrderColumnPendingUserTask(orderTask);
        this.dispatchPendingTasks(0, orderTask, tasksByClient.get("textToSearch"));
        break;
      case FINISHED:
        dispatchCleanPagAndOrderColumnFinalizedUserTask(orderTask);
        this.dispatchFinalizedTask(0, orderTask, tasksByClient.get("textToSearch"));
        break;
    }
  };


  _onChangeSearch(value) {
    const {tasksByClient} = this.props;

    this.setState({
      searchByText: true,
      textToSearch: value
    });

    this.dispatchPendingTasks(0, tasksByClient.get("tabPending").order, value === "" ? null : value);
    this.dispatchFinalizedTask(0, tasksByClient.get("tabFinished").order, value === "" ? null : value);
  }

  handleTaskByClientsFind = (limInf, mode) => {
    const {tasksByClient} = this.props;
    switch (mode) {
      case PENDING:
        this.dispatchPendingTasks(limInf, tasksByClient.get("tabPending").order, tasksByClient.get("textToSearch"));
        break;
      case FINISHED:
        this.dispatchFinalizedTask(limInf, tasksByClient.get("tabFinished").order, tasksByClient.get("textToSearch"));
        break;
    }

  };

  handlePaginar = (page, mode) => {
    const {dispatchChangePagePending, dispatchChangePageFinalized, tasksByClient} = this.props;
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

  clearUserTask = mode => {
    const {
      dispatchCleanPagAndOrderColumnPendingUserTask,
      dispatchCleanPagAndOrderColumnFinalizedUserTask,
      dispatchSetTextToSearch
    } = this.props;
    switch (mode) {
      case PENDING:
        dispatchCleanPagAndOrderColumnPendingUserTask(0);
        break;
      case FINISHED:
        dispatchCleanPagAndOrderColumnFinalizedUserTask(0);
        break;
    }
    dispatchSetTextToSearch(null);
  };

  createTask = () => {
    const {dispatchUpdateTitleNavBar} = this.props;
    dispatchUpdateTitleNavBar("Tareas");
    redirectUrl("/dashboard/task");
  };

  render() {
    const {tasksByClient, reducerGlobal} = this.props;
    const {loading} = this.state;
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
          <Grid style={{width: "100%"}}>
            <Row>
              <Col xs={12} sm={8} md={6} lg={6}>
                <SearchInputComponent
                  onChangeSearch={text => this._onChangeSearch(text)}
                />
              </Col>
            </Row>
          </Grid>
        </div>
        <Row>
          <Col xs={8} sm={8} md={10} lg={11}>
            <PendingTasksHelp></PendingTasksHelp>
          </Col>
        </Row>
        <div>
          <Grid style={{width: "100%"}}>
            <div style={{display: "flex"}}>
              {loading === true && (
                <div style={{padding: "10px"}}>
                  <Loader active inline></Loader>
                  <span style={{marginLeft: "10px"}}>Cargando...</span>
                </div>
              )}
            </div>
            <Row style={{position: "relative"}}>
              <Col
                style={{
                  position: "absolute",
                  width: "100%",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  padding: "10px",
                  margin: "12px 0",
                  boxShadow: "0px 0px 10px -7px rgba(0,0,0,0.75)"
                }}
              >
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
                            expandRow={this.state.searchByText}
                            textToHighlight={this.state.textToSearch}
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
                            expandRow={this.state.searchByText}
                            textToHighlight={this.state.textToSearch}
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
              <Col style={{position: "absolute", right: "15px", top: "5px"}}>
                {_.get(
                  reducerGlobal.get("permissionsTasks"),
                  _.indexOf(reducerGlobal.get("permissionsTasks"), CREAR),
                  false
                ) && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    title="Crear Tarea"
                    style={{marginTop: "18px"}}
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
      dispatchChangePageFinalized: changePageFinalized,
      dispatchSetTextToSearch: setTextToSearch,
      dispatchCleanTextToSearch: cleanTextToSearch,
      dispatchUpdateTitleNavBar: updateTitleNavBar
    },
    dispatch
  );
}

function mapStateToProps({tasksByClient, reducerGlobal}) {
  return {
    tasksByClient,
    reducerGlobal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientTaskList);