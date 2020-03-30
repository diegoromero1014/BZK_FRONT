import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import {redirectUrl} from "../globalComponents/actions";
import {updateTitleNavBar} from "../navBar/actions";
import {NUMBER_RECORDS} from './constants';
import {REQUEST_SUCCESS} from "../../constantsGlobal";
import {
    getPendingTaskPromise,
    getFinalizedTaskPromise,
    pendingTasks,
    finalizedTasks,
    cleanPageAndSetOrderPending,
    cleanPageAndSetOrderFinalized
} from './actions';
import ProgressBarComponent from "../../ui/ProgressBar";
import HeaderFilters from "./headerFilters";

export class MyTaskPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        if (window.localStorage.getItem('sessionTokenFront') === "") {
            redirectUrl("/login");
        } else {
            const {dispatchUpdateTitleNavBar, dispatchCleanPageAndSetOrderPending, dispatchCleanPageAndSetOrderFinalized, myTasks} = this.props;
            dispatchUpdateTitleNavBar("Tareas");
            dispatchCleanPageAndSetOrderPending(0);
            dispatchCleanPageAndSetOrderFinalized(0);
            await this.dispatchFilters(myTasks.get("initialFilter"));
            /*let filters = myTasks.get("initialFilter");
            await this.fetchAndDispatchPendingTasks(0, 0, null, filters);
            await this.fetchAndDispatchFinalizedTasks(0, 0, null, filters);*/
        }
    }

    fetchAndDispatchPendingTasks = async (page, order, textToSearch, filters) => {
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
    };

    fetchAndDispatchFinalizedTasks = async (page, order, textToSearch, filters) => {
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
    };

    dispatchFilters = async (filters) => {
        const {myTasks} = this.props;
        await this.fetchAndDispatchPendingTasks(
            0, myTasks.get("tabPending").order, null, filters
        );
        await this.fetchAndDispatchFinalizedTasks(
            0, myTasks.get("tabFinished").order, null, filters
        );
    };

    render() {
        const {myTasks} = this.props;
        let tabPending = myTasks.get("tabPending");
        let tabFinished = myTasks.get("tabFinished");
        return (
            <div>
                <HeaderFilters dispatchFilters={this.dispatchFilters}/>
                <div className="tab-pane quickZoomIn animated"
                     style={{width: "100%", marginTop: "10px", marginBottom: "20px"}}>
                    <div style={{padding: '10px', overflow: 'initial'}}>
                        <ProgressBarComponent pending={tabPending.rowCount} finalized={tabFinished.rowCount}/>
                    </div>
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
            dispatchCleanPageAndSetOrderFinalized: cleanPageAndSetOrderFinalized
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