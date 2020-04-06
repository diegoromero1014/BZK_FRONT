import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {Loader} from 'semantic-ui-react';
import { get, indexOf } from "lodash";
import {redirectUrl} from "../globalComponents/actions";
import {updateTitleNavBar} from "../navBar/actions";
import {FINALIZED_TASKS, FINISHED, MODAL_TITLE, NUMBER_RECORDS, PENDING, PENDING_TASKS, TOOLTIP_PENDING, TOOLTIP_FINISHED} from "./constants";
import {validatePermissionsByModule} from '../../actionsGlobal';
import { REQUEST_SUCCESS, EDITAR, MODULE_TASKS } from "../../constantsGlobal";
import {TASK_STATUS} from "../selectsComponent/constants";
import {
    cleanFinalizedTasks,
    cleanPageAndSetOrderFinalized,
    cleanPageAndSetOrderPending,
    cleanPendingTasks,
    finalizedTasks,
    getFinalizedTaskPromise,
    getPendingTaskPromise,
    pendingTasks,
    setPageFinalized,
    setPagePending, setRolToSearch
} from './actions';
import ProgressBarComponent from "../../ui/ProgressBar";
import TabComponent from '../../ui/Tab';
import PendingTasksHelp from './../pendingTask/pendingTasksHelp';
import PaginationPendingTaskComponent from './../pendingTask/paginationPendingTaskComponent';
import ListMyTasksComponent from './listMyTasksComponent';
import {getMasterDataFields} from '../selectsComponent/actions';
import HeaderFilters from "./headerFilters";
import SidebarComponent from "./SidebarComponent";

export class MyTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    async componentDidMount() {
        if (window.localStorage.getItem("sessionTokenFront") === "") {
            redirectUrl("/login");
        } else {
            const {
                dispatchUpdateTitleNavBar,
                dispatchGetMasterDataFields,
                dispatchValidatePermissionsByModule
            } = this.props;
            dispatchValidatePermissionsByModule(MODULE_TASKS);
            dispatchGetMasterDataFields([TASK_STATUS]);
            dispatchUpdateTitleNavBar(MODAL_TITLE);
        }
    }

    componentWillUnmount() {
        const {
            dispatchCleanFinalizedTasks,
            dispatchCleanPendingTasks
        } = this.props;
        dispatchCleanPendingTasks();
        dispatchCleanFinalizedTasks();
    }

    fetchAndDispatchPendingTasks = async (page, order, textToSearch, filters) => {
        this.setState({loading: true});
        const {dispatchPendingTasks} = this.props;
        let response = await getPendingTaskPromise(
            page,
            order,
            NUMBER_RECORDS,
            textToSearch,
            filters
        );
        if (response.data.status == REQUEST_SUCCESS) {
            dispatchPendingTasks(response.data.data, page, order);
        }
        this.setState({loading: false});
    };

    fetchAndDispatchFinalizedTasks = async (page, order, textToSearch, filters) => {
        this.setState({loading: true});
        const {dispatchFinalizedTasks} = this.props;
        let response = await getFinalizedTaskPromise(
            page,
            order,
            NUMBER_RECORDS,
            textToSearch,
            filters
        );
        if (response.data.status == REQUEST_SUCCESS) {
            dispatchFinalizedTasks(response.data.data, page, order);
        }
        this.setState({loading: false});
    };

    updateBothTabs = async () => {
        const {myTasks} = this.props;
        const tabPending = myTasks.get("tabPending");
        const tabFinished = myTasks.get("tabFinished");
        const filters = myTasks.get("initialFilter");
        await this.fetchAndDispatchPendingTasks(
            tabPending.page,
            tabPending.order,
            null,
            filters
        );
        await this.fetchAndDispatchFinalizedTasks(
            tabFinished.page,
            tabFinished.order,
            null,
            filters
        );
    };

    handleFetchAndDispatchPendingTasks = (page, mode) => {
        const {myTasks} = this.props;
        switch (mode) {
            case PENDING:
                this.fetchAndDispatchPendingTasks(
                    page,
                    myTasks.get("tabPending").order,
                    null,
                    myTasks.get("initialFilter")
                );
                break;
            case FINISHED:
                this.fetchAndDispatchFinalizedTasks(
                    page,
                    myTasks.get("tabFinished").order,
                    null,
                    myTasks.get("initialFilter")
                );
                break;
        }
    };

    handlePaginar = async (page, mode) => {
        const {
            dispatchSetPagePending,
            dispatchSetPageFinalized,
            myTasks
        } = this.props;
        switch (mode) {
            case PENDING:
                await dispatchSetPagePending(page, myTasks.get("tabPending").order, myTasks.get("tabPending").rowCount || 0);
                break;
            case FINISHED:
                await dispatchSetPageFinalized(page, myTasks.get("tabFinished").order, myTasks.get("tabFinished").rowCount || 0);
                break;
        }
        this.handleFetchAndDispatchPendingTasks(page, mode);
    };

    orderColumn = async (order, mode) => {
        const {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized,
            myTasks
        } = this.props;
        switch (mode) {
            case PENDING:
                await dispatchCleanPageAndSetOrderPending(order, myTasks.get("tabPending").rowCount || 0);
                break;
            case FINISHED:
                await dispatchCleanPageAndSetOrderFinalized(order, myTasks.get("tabFinished").rowCount || 0);
                break;
        }
        this.handleFetchAndDispatchPendingTasks(0, mode);
    };

    clearUserTask = (mode) => {
        const {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized,
            myTasks
        } = this.props;

        switch (mode) {
            case PENDING:
                dispatchCleanPageAndSetOrderPending(0, myTasks.get("tabPending").rowCount || 0);
                break;
            case FINISHED:
                dispatchCleanPageAndSetOrderFinalized(0, myTasks.get("tabFinished").rowCount || 0);
                break;
        }
    };

    dispatchFilters = async (filters) => {
        const {myTasks} = this.props;
        await this.fetchAndDispatchFinalizedTasks(
            0, myTasks.get("tabFinished").order, null, filters
        );
        await this.fetchAndDispatchPendingTasks(
            0, myTasks.get("tabPending").order, null, filters
        );
    };

    permissionToEditTask = () => {
        const {reducerGlobal}= this.props;
        let editPendings = get(reducerGlobal.get("permissionsTasks"), indexOf(reducerGlobal.get("permissionsTasks"), EDITAR), false);
        return (editPendings === EDITAR);
    };

    render() {
        const {myTasks} = this.props;
        const {loading} = this.state;
        let tabPending = myTasks.get("tabPending");
        let tabFinished = myTasks.get("tabFinished");
        return (
          <div
            className="tab-pane quickZoomIn animated"
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "20px"
            }}
          >
            <div
              style={{
                padding: "10px",
                overflow: "initial",
                backgroundColor: "white",
                margin: "10px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px -7px rgba(0,0,0,0.75)"
              }}
            >
              <HeaderFilters dispatchFilters={this.dispatchFilters} />
              <ProgressBarComponent
                pending={tabPending.rowCount}
                finalized={tabFinished.rowCount}
                role={myTasks.get("initialFilter").rol}
                loading={loading==true}
              />
            <div>
                <SidebarComponent />
            </div>              
            </div>            
            <div style={{ backgroundColor: "white", width: "100%" }}>
              <div style={{ display: "flex" }}>
                <PendingTasksHelp />
                <div style={{ display: "flex" }}>
                  {loading === true && (
                    <div style={{ padding: "10px" }}>
                      <Loader active inline></Loader>
                      <span style={{ marginLeft: "10px" }}>Cargando...</span>
                    </div>
                  )}
                </div>
              </div>
              <TabComponent
                tabs={[
                  {
                    name: PENDING_TASKS,
                    number: tabPending.rowCount,
                    tooltip: TOOLTIP_PENDING,
                    content: (
                      <div>
                        <ListMyTasksComponent
                          orderColumn={this.orderColumn}
                          tasks={tabPending.data}
                          handleTaskByClientsFind={
                            this.handleFetchAndDispatchPendingTasks
                          }
                          permissionToEditTask={this.permissionToEditTask}
                          updateBothTabs={this.updateBothTabs}
                          actualPage={tabPending.page}
                          mode={PENDING}
                        />
                        <PaginationPendingTaskComponent
                          tab={tabPending}
                          clearUserTask={this.clearUserTask}
                          handlePaginar={this.handlePaginar}
                          mode={PENDING}
                        />
                      </div>
                    )
                  },
                  {
                    name: FINALIZED_TASKS,
                    number: tabFinished.rowCount,
                    tooltip: TOOLTIP_FINISHED,
                    content: (
                      <div>
                        <ListMyTasksComponent
                          orderColumn={this.orderColumn}
                          tasks={tabFinished.data}
                          handleTaskByClientsFind={
                            this.handleFetchAndDispatchPendingTasks
                          }
                          permissionToEditTask={this.permissionToEditTask}
                          updateBothTabs={this.updateBothTabs}
                          actualPage={tabPending.page}
                          mode={FINISHED}
                        />
                        <PaginationPendingTaskComponent
                          tab={tabFinished}
                          clearUserTask={this.clearUserTask}
                          handlePaginar={this.handlePaginar}
                          mode={FINISHED}
                        />
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            dispatchUpdateTitleNavBar: updateTitleNavBar,
            dispatchPendingTasks: pendingTasks,
            dispatchFinalizedTasks: finalizedTasks,
            dispatchCleanPageAndSetOrderPending: cleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized: cleanPageAndSetOrderFinalized,
            dispatchCleanFinalizedTasks: cleanFinalizedTasks,
            dispatchCleanPendingTasks: cleanPendingTasks,
            dispatchSetPagePending: setPagePending,
            dispatchSetPageFinalized: setPageFinalized,
            dispatchGetMasterDataFields: getMasterDataFields,
            dispatchSetRolToSearch: setRolToSearch,
            dispatchValidatePermissionsByModule: validatePermissionsByModule,
        },
        dispatch
    );
}

function mapStateToProps({reducerGlobal, navBar, myTasks}) {
    return {
        reducerGlobal,
        navBar,
        myTasks
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTaskPage);