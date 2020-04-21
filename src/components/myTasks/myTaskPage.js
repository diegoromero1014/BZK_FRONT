import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {Loader} from 'semantic-ui-react';
import {get, indexOf} from "lodash";
import {redirectUrl} from "../globalComponents/actions";
import {updateTitleNavBar} from "../navBar/actions";
import {
    DATES_HELP_MESSAGE_DOWNLOAD,
    FINALIZED_TASKS,
    FINISHED,
    MODAL_TITLE,
    NUMBER_RECORDS,
    PENDING,
    PENDING_TASKS,
    TOOLTIP_FINISHED,
    TOOLTIP_PENDING
} from "./constants";
import {validatePermissionsByModule} from '../../actionsGlobal';
import {DATE_FORMAT, EDITAR, MESSAGE_ERROR, MODULE_TASKS, REQUEST_SUCCESS} from "../../constantsGlobal";
import {TASK_STATUS} from "../selectsComponent/constants";
import {
    cleanFinalizedTasks,
    cleanPageAndSetOrderFinalized,
    cleanPageAndSetOrderPending,
    cleanPendingTasks,
    finalizedTasks,
    getFinalizedTaskPromise,
    getPendingTaskPromise, getXlsTask,
    pendingTasks,
    setPageFinalized,
    setPagePending,
    setRolToSearch
} from './actions';
import ProgressBarComponent from "../../ui/ProgressBar";
import TabComponent from '../../ui/Tab';
import PendingTasksHelp from './../pendingTask/pendingTasksHelp';
import PaginationPendingTaskComponent from './../pendingTask/paginationPendingTaskComponent';
import ListMyTasksComponent from './listMyTasksComponent';
import {getMasterDataFields} from '../selectsComponent/actions';
import HeaderFilters from "./headerFilters";
import SidebarComponent from "./SidebarComponent";
import SearchInputComponent from "../../ui/searchInput/SearchInputComponent";
import {Col, Row} from "react-flexbox-grid";
import moment from "moment";
import {swtShowMessage} from "../sweetAlertMessages/actions";

export class MyTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            textToSearch: "",
            searchByText: false,
            filters: {
                users: null,
                rol: null,
                initialDate: null,
                finalDate: null,
                closingDateTo: null,
                closingDateFrom: null,
                region: null,
                zone: null,
                cell: null
            }
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

    _onSearchText(value) {
        const {myTasks} = this.props;

        this.setState({
            searchByText: true,
            textToSearch: value
        });

        this.fetchAndDispatchPendingTasks(0, myTasks.get("tabPending").order, value === "" ? null : value, myTasks.get("initialFilter"));
        this.fetchAndDispatchFinalizedTasks(0, myTasks.get("tabPending").order, value === "" ? null : value, myTasks.get("initialFilter"));

    }

    handleFetchAndDispatchPendingTasks = (page, mode) => {
        const {myTasks} = this.props;
        switch (mode) {
            case PENDING:
                this.fetchAndDispatchPendingTasks(
                    page,
                    myTasks.get("tabPending").order,
                    this.state.textToSearch,
                    myTasks.get("initialFilter")
                );
                break;
            case FINISHED:
                this.fetchAndDispatchFinalizedTasks(
                    page,
                    myTasks.get("tabFinished").order,
                    this.state.textToSearch,
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

    dispatchFilters = async (filtersResponse) => {
        const {myTasks, dispatchSetRolToSearch} = this.props;
        let {filters} = this.state;

        this.setState({
            filters: Object.assign(filters, filtersResponse)
        });

        await this.fetchAndDispatchFinalizedTasks(
            0, myTasks.get("tabFinished").order, this.state.textToSearch, this.state.filters
        );
        await this.fetchAndDispatchPendingTasks(
            0, myTasks.get("tabPending").order, this.state.textToSearch, this.state.filters
        );

        dispatchSetRolToSearch(this.state.filters);
    };

    permissionToEditTask = () => {
        const {reducerGlobal} = this.props;
        let editPendings = get(reducerGlobal.get("permissionsTasks"), indexOf(reducerGlobal.get("permissionsTasks"), EDITAR), false);
        return (editPendings === EDITAR);
    };

    downloadTask = async () => {
        const {dispatchShowMessage, dispatchGetXlsTask} = this.props;
        let {filters} = this.state;
        let initialValue = moment(filters.initialDate);
        let finalValue = moment(filters.finalDate);
        if (moment(initialValue, DATE_FORMAT).diff(moment(finalValue, DATE_FORMAT), 'days') < -360) {
            dispatchShowMessage(MESSAGE_ERROR, 'Rango de fecha', DATES_HELP_MESSAGE_DOWNLOAD);
            return;
        }
        const response = await dispatchGetXlsTask(filters, this.state.textToSearch);
    };

    render() {
        const {params: {filtered}, myTasks} = this.props;
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
                    <HeaderFilters dispatchFilters={this.dispatchFilters} filter={filtered}/>
                    <ProgressBarComponent
                        pending={tabPending.rowCount}
                        finalized={tabFinished.rowCount}
                        role={myTasks.get("initialFilter").rol}
                        loading={loading == true}
                    />
                    <Row style={{padding: "40px 20px 0px 20px"}}>
                        <Col xs={12} sm={6} md={8} lg={8} >
                            <SearchInputComponent
                                onChangeSearch={text => this._onSearchText(text)}
                            />
                        </Col>
                        <Col xs={6} sm={3} md={2} lg={2}>
                            {myTasks.get("initialFilter").initialDate &&
                            <SidebarComponent
                                key={myTasks.get("initialFilter").initialDate}
                                defaultFilters={this.state.filters}
                                dispatchFilters={this.dispatchFilters}/>
                            }
                        </Col>
                        <Col xs={6} sm={3} md={2} lg={2}>
                            <button id="btnDownload"
                                    className="btn"
                                    title="descargar"
                                    type="button"
                                    style={{backgroundColor: "#00448c", width: '100%'}}
                                    onClick={() => this.downloadTask()}
                            >
                                <i className="download icon" style={{margin: '0em', fontSize: '1.2em'}}/>
                                &nbsp;Descargar
                            </button>
                        </Col>
                    </Row>
                </div>
                <div style={{backgroundColor: "white", width: "100%"}}>
                    <div style={{display: "flex"}}>
                        <PendingTasksHelp/>
                        <div style={{display: "flex"}}>
                            {loading === true && (
                                <div style={{padding: "10px"}}>
                                    <Loader active inline></Loader>
                                    <span style={{marginLeft: "10px"}}>Cargando...</span>
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
                                            expandRow={this.state.searchByText}
                                            textToHighlight={this.state.textToSearch}/>
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
                                            mode={FINISHED} expandRow={this.state.searchByText}
                                            textToHighlight={this.state.textToSearch}
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
        )
            ;
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
            dispatchShowMessage: swtShowMessage,
            dispatchGetXlsTask: getXlsTask
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