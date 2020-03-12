import React, { Component } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { tasksByClientFindServer, clearUserTask, clearUserTaskOrder, limitiInf, changePage, orderColumnUserTask, clearUserTaskPaginator } from './actions';
import { TASK_STATUS, PENDING_TASKS, FINALIZED_TASKS, NUMBER_RECORDS, FINAL_DATE_FILTER_COLUMN_ORDER } from './constants';
import SelectFilterContact from '../selectsComponent/selectFilterContact/selectFilterComponent';
import PaginationPendingTaskComponent from './paginationPendingTaskComponent';
import ListPendingTaskComponent from './listPendingTaskComponent';
import ButtonCreatePendingTaskComponent from './createPendingTask/buttonCreatePendingTaskComponent';
import { MODULE_TASKS, CREAR } from '../../constantsGlobal';
import { validatePermissionsByModule } from '../../actionsGlobal';
import AlertWithoutPermissions from '../globalComponents/alertWithoutPermissions';
import { redirectUrl } from '../globalComponents/actions';
import { nombreflujoAnalytics, BIZTRACK_MY_CLIENTS, _TASK } from '../../constantsAnalytics';
import TabComponent from './../../ui/Tab';
class UserTaskComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMessagePermissions: false,
      filter: ""
    };
  }

  componentDidMount() {
    window.dataLayer.push({
      'nombreflujo': nombreflujoAnalytics,
      'event': BIZTRACK_MY_CLIENTS + _TASK,
      'pagina':_TASK

    });
    if (window.localStorage.getItem('sessionTokenFront') === "") {
      redirectUrl("/login");
    } else {
      const { dispatchValidatePermissionsByModule, dispatchClearUserTaskOrder, dispatchTasksByClientFindServer } = this.props;
      dispatchClearUserTaskOrder();
      dispatchTasksByClientFindServer(
        0,
        window.sessionStorage.getItem("idClientSelected"),
        NUMBER_RECORDS,
        FINAL_DATE_FILTER_COLUMN_ORDER,
        0,
        ""
      );
      dispatchValidatePermissionsByModule(MODULE_TASKS).then(data => {
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
  handleFilter = value => {
    const {
      dispatchClearUserTaskOrder,
      dispatchTasksByClientFindServer
    } = this.props;
    dispatchClearUserTaskOrder();
    dispatchTasksByClientFindServer(
      0,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      FINAL_DATE_FILTER_COLUMN_ORDER,
      0,
      value
    );
    this.setState({ filter: value });
  };

  orderColumn = (orderTask, columnTask) => {
    const {
      dispatchTasksByClientFindServer,
      dispatchOrderColumnUserTask,
      dispatchClearUserTaskPaginator
    } = this.props;
    const { filter } = this.state;
    dispatchClearUserTaskPaginator();
    dispatchOrderColumnUserTask(orderTask, columnTask);
    dispatchTasksByClientFindServer(
      0,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      columnTask,
      orderTask,
      filter
    );
  };

  handleTaskByClientsFind = limInf => {
    const { dispatchTasksByClientFindServer, tasksByClient } = this.props;
    const { filter } = this.state;
    dispatchTasksByClientFindServer(
      limInf,
      window.sessionStorage.getItem("idClientSelected"),
      NUMBER_RECORDS,
      tasksByClient.get("columnTask"),
      tasksByClient.get("orderTask"),
      filter
    );
  };

  handlePaginar = page => {
    const { dispatchLimitiInf, dispatchChangePage } = this.props;
    var limInf = page - 1;
    dispatchLimitiInf(limInf);
    this.handleTaskByClientsFind(limInf);
    dispatchChangePage(page);
  };

  clearUserTask = _ =>{
    const { dispatchClearUserTask }=this.props;
    dispatchClearUserTask();
  }

  render() {
    const { tasksByClient, reducerGlobal, actionEdit } = this.props;
    const page = tasksByClient.get("page");
    const data = tasksByClient.get("userTasksByClient");
    const rowCount = tasksByClient.get("rowCount");
    var visibleMessage = "block";
    if (tasksByClient.get("rowCount") !== 0) {
      visibleMessage = "none";
    }
    return (
      <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "70px", paddingTop: "20px" }}>
        <div className="tab-content break-word" style={{ zIndex: 0, border: '1px solid #cecece', padding: '16px', borderRadius: '3px', overflow: 'visible' }}>
          <Grid style={{ width: "100%" }}>
            <Row>
              <Col xs><span style={{ fontWeight: 'bold', color: '#4C5360' }}>Estado de la tarea:</span>
                <SelectFilterContact config={{
                  onChange: (value) => this.handleFilter( value.id )
                }}
                  idTypeFilter={TASK_STATUS} />
              </Col>
              <Col xs>
                {_.get(reducerGlobal.get('permissionsTasks'), _.indexOf(reducerGlobal.get('permissionsTasks'), CREAR), false) &&
                  <ButtonCreatePendingTaskComponent actionEdit={actionEdit} />
                }
              </Col>
            </Row>
          </Grid>
        </div>
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
                          tasks={data}
                        />
                        <PaginationPendingTaskComponent 
                          page={page}
                          rowCount={rowCount}
                          clearUserTask={this.clearUserTask}
                          handlePaginar={this.handlePaginar}
                          handleTaskByClientsFind={this.handleTaskByClientsFind} />
                      </div>
                    )
                  },
                  {
                    name: FINALIZED_TASKS,
                    content: (
                      <div>
                      </div>
                    )
                  }
                ]}
              />
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
  return bindActionCreators(
    {
      dispatchTasksByClientFindServer: tasksByClientFindServer,
      dispatchClearUserTask: clearUserTask,
      dispatchValidatePermissionsByModule: validatePermissionsByModule,
      dispatchClearUserTaskOrder: clearUserTaskOrder,
      dispatchLimitiInf: limitiInf,
      dispatchChangePage: changePage,
      dispatchOrderColumnUserTask: orderColumnUserTask,
      dispatchClearUserTaskPaginator: clearUserTaskPaginator
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

export default connect(mapStateToProps, mapDispatchToProps)(UserTaskComponent);