import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';
import { redirectUrl } from "../globalComponents/actions";
import {updateTitleNavBar} from "../navBar/actions";
import { NUMBER_RECORDS } from './constants';
import { REQUEST_SUCCESS } from "../../constantsGlobal";
import{
    getPendingTaskPromise,
    getFinalizedTaskPromise,
    pendingTasks,
    finalizedTasks,
    cleanPageAndSetOrderPending,
    cleanPageAndSetOrderFinalized
} from './actions';
import ProgressBarComponent from "../../ui/ProgressBar";

export class MyTaskPage extends Component {
         constructor(props) {
           super(props);
         }
         componentDidMount() {
            if (window.localStorage.getItem('sessionTokenFront') === "") {
                redirectUrl("/login");
            } else {
                const { dispatchUpdateTitleNavBar, dispatchCleanPageAndSetOrderPending, dispatchCleanPageAndSetOrderFinalized } = this.props;
                dispatchUpdateTitleNavBar("Tareas");
                dispatchCleanPageAndSetOrderPending(0);
                dispatchCleanPageAndSetOrderFinalized(0);
                this.fetchAndDispatchPendingTasks(0,0, null);
                this.fetchAndDispatchFinalizedTasks(0,0,null);
            }
         }
         fetchAndDispatchPendingTasks = async (page, order, textToSearch) => {
            const { dispatchPendingTasks } = this.props;
            let response = await getPendingTaskPromise(
              page,
              order,
              NUMBER_RECORDS,
              textToSearch
            );
            if(response.data.status == REQUEST_SUCCESS){
               dispatchPendingTasks(response.data.data, page, order);
            }
         };
         fetchAndDispatchFinalizedTasks = async (page, order, textToSearch) => {
            const { dispatchFinalizedTasks } = this.props;
            let response = await getFinalizedTaskPromise(
              page,
              order,
              NUMBER_RECORDS,
              textToSearch
            );
            if (response.data.status == REQUEST_SUCCESS) {
                dispatchFinalizedTasks(response.data.data, page, order);
            }
         };

         render() {
            const { myTasks } = this.props;
            let tabPending = myTasks.get("tabPending");
            let tabFinished = myTasks.get("tabFinished");
            return(  
            <div className="tab-pane quickZoomIn animated" style={{ width: "100%", marginTop: "10px", marginBottom: "20px" }}>
                <div style={{ padding: '10px', overflow: 'initial' }}>
                    <ProgressBarComponent pending={tabPending.rowCount} finalized={tabFinished.rowCount}/>
                </div>
            </div>);
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

function mapStateToProps({ reducerGlobal, navBar, myTasks }) {
  return {
    reducerGlobal,
    navBar,
    myTasks
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTaskPage);