import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { get, indexOf } from "lodash";
import { Col, Row } from "react-flexbox-grid";
import moment from "moment";
import _ from 'lodash';

import PendingTasksHelp from './../pendingTask/pendingTasksHelp';
import TabComponent from '../../ui/Tab';
import ProgressBarComponent from "../../ui/ProgressBar";
import HeaderFilters from "./headerFilters";
import ListMyTasksComponent from './listMyTasksComponent';
import PaginationPendingTaskComponent from './../pendingTask/paginationPendingTaskComponent';
import SidebarComponent from "./SidebarComponent";
import SearchInputComponent from "../../ui/searchInput/SearchInputComponent";
import RecentSearchBox from './RecentSearchBox'

import { redirectUrl } from "../globalComponents/actions";
import { getMasterDataFields } from '../selectsComponent/actions';
import { updateTitleNavBar } from "../navBar/actions";
import { validatePermissionsByModule } from '../../actionsGlobal';
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
    setPagePending,
    setRolToSearch,
    addRecentSearch,
    removeRecentSearch,
    useRecentSearch
} from './actions';

import { EDITAR, MODULE_TASKS, REQUEST_SUCCESS } from "../../constantsGlobal";
import { LIST_REGIONS, LIST_ZONES, TASK_STATUS, TEAM_VALUE_OBJECTS } from "../selectsComponent/constants";
import {
    FINALIZED_TASKS,
    FINISHED,
    MODAL_TITLE,
    NUMBER_RECORDS,
    PENDING,
    PENDING_TASKS,
    TOOLTIP_FINISHED,
    TOOLTIP_PENDING
} from "./constants";

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
            0, myTasks.get("tabFinished").order, null, this.state.filters
        );
        await this.fetchAndDispatchPendingTasks(
            0, myTasks.get("tabPending").order, null, this.state.filters
        );

        dispatchSetRolToSearch(this.state.filters);
    };

    permissionToEditTask = () => {
        const {reducerGlobal} = this.props;
        let editPendings = get(reducerGlobal.get("permissionsTasks"), indexOf(reducerGlobal.get("permissionsTasks"), EDITAR), false);
        return (editPendings === EDITAR);
    };

    createRecentSearch = () => {
        const {selectsReducer, dispatchAddRecentSearch} = this.props;

        this.removeLastRecentSearch();

        let nameRecentSearch = "".concat(moment(this.state.filters.closingDateFrom).format("DD/MM/YYYY"))
        nameRecentSearch = nameRecentSearch.concat(" - ")
            .concat(moment(this.state.filters.closingDateTo).format("DD/MM/YYYY"));

        const regions = selectsReducer.get(LIST_REGIONS) || [];
        regions.filter((region) => {
            if (this.state.filters.region && region.id == this.state.filters.region){
                nameRecentSearch = nameRecentSearch.concat(" - ".concat(region.value));
            }
        });

        const zones = selectsReducer.get(LIST_ZONES) || [];
        zones.filter((zone) => {
            if(this.state.filters.zone && zone.id == this.state.filters.zone){
                nameRecentSearch = nameRecentSearch.concat(" - ".concat(zone.value));
            }
        });

        const teams = selectsReducer.get(TEAM_VALUE_OBJECTS) || [];
        teams.filter((team) => {
            if(this.state.filters.cell && team.id == this.state.filters.cell){
                nameRecentSearch = nameRecentSearch.concat(" - ".concat(team.description));
            }
        });

        let recordRecentSearch = {
            id: Math.floor(Math.random() * 1000),
            name: nameRecentSearch,
            isSelected: true,
            filter: {
                closeDateFrom: this.state.filters.closingDateFrom,
                closeDateTo: this.state.filters.closingDateTo,
                regionId: this.state.filters.region,
                zoneId: this.state.filters.zone,
                teamId: this.state.filters.cell
            }
        }

        dispatchAddRecentSearch(recordRecentSearch);
    }

    removeLastRecentSearch = () => {
        const {allRecentSearch} = this.props
        if (allRecentSearch.data.length >= 4) {
            const recentSearchToDelete = _.head(allRecentSearch.data);
            this.removeRecentSearch(recentSearchToDelete.id);
        }
    }

    removeRecentSearch = idRecord => {
        const {dispatchRemoveRecentSearch} = this.props;
        dispatchRemoveRecentSearch(idRecord);
    }

    applyRecentSearch = idRecord => {
        debugger;
        const {allRecentSearch, dispatchUseRecentSearch} = this.props;

        const search = allRecentSearch.data.filter(record => {
            return record.id == idRecord;
        });

        const recentSearchToApply = _.head(search);
        const dataToApply = {
            closingDateTo: recentSearchToApply.filter.closeDateTo,
            closingDateFrom: recentSearchToApply.filter.closeDateFrom,
            region: recentSearchToApply.filter.regionId,
            zone: recentSearchToApply.filter.zoneId,
            cell: recentSearchToApply.filter.teamId
        }

        this.dispatchFilters(dataToApply);
        dispatchUseRecentSearch(idRecord)
    }

    render() {
        const {params: {filtered}, myTasks, allRecentSearch} = this.props;
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
                    <Row style={{padding: "40px 10px 0px 20px"}}>
                        <Col xs={12} sm={8} md={6} lg={6}>
                            <SearchInputComponent
                                onChangeSearch={text => this._onSearchText(text)}
                            />
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={6}>
                            {myTasks.get("initialFilter").initialDate &&
                            <SidebarComponent
                                key={myTasks.get("initialFilter").initialDate}
                                defaultFilters={this.state.filters}
                                dispatchFilters={this.dispatchFilters}
                                applyRecentSearch={this.createRecentSearch}
                            />
                            }
                        </Col>
                    </Row>
                    <Row xs={12} sm={12} md={12} lg={12} style={{padding: "40px 10px 0px 20px"}}>
                        <RecentSearchBox
                          recordsRecentSearch={allRecentSearch.data}
                          deleteSearch={(idRecentSearch) => this.removeRecentSearch(idRecentSearch)}
                          applyRecentSearch={(idCurrentRecentSearch) => this.applyRecentSearch(idCurrentRecentSearch)}
                        />
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
            dispatchAddRecentSearch: addRecentSearch,
            dispatchRemoveRecentSearch: removeRecentSearch,
            dispatchUseRecentSearch: useRecentSearch
        },
        dispatch
    );
}

function mapStateToProps({reducerGlobal, navBar, myTasks, selectsReducer}) {
    return {
        reducerGlobal,
        navBar,
        myTasks,
        selectsReducer,
        allRecentSearch: myTasks.get("recentSearches")
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTaskPage);