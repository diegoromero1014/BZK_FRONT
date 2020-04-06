import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
  shorterStringValue, stringValidate, mapDateValueFromTask,
  validateResponse
} from '../../../actionsGlobal';
import {
  ORDER_ASC, ORDER_DESC, TITLE_ERROR_SWEET_ALERT,
  MESSAGE_ERROR_SWEET_ALERT, MESSAGE_LOAD_DATA
} from '../../../constantsGlobal';
import GridComponent from '../../grid/component';
import { getAssigned, changeSortOrder, clearListOfAssigned } from './actions';
import { NUMBER_RECORDS } from './constants';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { mapDateColor } from '../myTasks/pendingTaskUtilities';
import { VIEW_TASK_ADMIN } from '../../modal/constants';
import { changeStateSaveData } from '../../main/actions';

class listAssignedComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actions: {},
      orderAsc: 'inline-block',
      orderDesc: 'none',
      limInf: 0
    };

    this._renderHeaders = this._renderHeaders.bind(this);
    this._renderCellView = this._renderCellView.bind(this);
    this._closeModalEditTask = this._closeModalEditTask.bind(this);
  }

  _orderColumn(sortOrder) {
    const { getAssigned, assignedReducer, changeSortOrder, swtShowMessage, changeStateSaveData } = this.props;
    changeSortOrder(sortOrder);
    var paginationAssigned = {
      statusOfTask: assignedReducer.get('statusOfTask'),
      clientNumberOrName: assignedReducer.get('clientNumberOrName'),
      homeworkTime: assignedReducer.get('homeworkTime'),
      sortOrder: sortOrder,
      pageNum: assignedReducer.get('limInf'),
      maxRows: NUMBER_RECORDS
    };
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    getAssigned(paginationAssigned).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      } else {
        if (sortOrder === ORDER_DESC) {
          this.setState({
            orderAsc: 'none',
            orderDesc: 'inline-block'
          });
        } else {
          this.setState({
            orderAsc: 'inline-block',
            orderDesc: 'none'
          });
        }
      }
    }, (reason) => {
      changeStateSaveData(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  _closeModalEditTask() {
    const { assignedReducer, clearListOfAssigned, getAssigned, changeStateSaveData } = this.props;
    clearListOfAssigned();
    var paginationAssigned = {
      statusOfTask: assignedReducer.get('statusOfTask'),
      clientNumberOrName: assignedReducer.get('clientNumberOrName'),
      sortOrder: assignedReducer.get('sortOrder'),
      homeworkTime: assignedReducer.get('homeworkTime'),
      pageNum: this.state.limInf,
      maxRows: NUMBER_RECORDS
    };
    changeStateSaveData(true, MESSAGE_LOAD_DATA);
    getAssigned(paginationAssigned).then((data) => {
      changeStateSaveData(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      }
    }, (reason) => {
      changeStateSaveData(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actions",
        width: '20px'
      },
      {
        title: "Número documento",
        key: "documentClient",
        width: '80px'
      },
      {
        title: "Nombre/Razón social",
        key: "nameClient",
        width: '80px'
      },
      {
        title: "Responsable",
        key: "responsibleName",
        width: '50px'
      },
      {
        title: "",
        key: "trafficLight",
        width: '40px'
      },
      {
        title: "Fecha de cierre",
        key: "closingDate",
        orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderDesc }} onClick={() => this._orderColumn(ORDER_ASC)}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderAsc }} onClick={() => this._orderColumn(ORDER_DESC)}></i></span>,
        width: '80px'
      },
      {
        title: "Estado",
        key: "state",
        width: '80px'
      }, 

      {
        title: "",
        key: "commercialReport.isConfidential",
        width: '80px'
      }
    ]
  }

  _renderCellView(data = []) {
    const { reducerGlobal } = this.props;
    return data.map(item => ({
      actions: {
        actionView: true,
        id: item.idTask,
        urlServer: "./component",
        idClient: item.idClient,
        object: item,
        functCloseModal: this._closeModalEditTask,
        component: VIEW_TASK_ADMIN
      },
      documentClient: item.documentClient,
      nameClient: item.nameClient,
      responsibleName: shorterStringValue(!stringValidate(item.responsibleEmployee) ? item.responsibleName : item.responsibleEmployee, 50),
      trafficLight: {
        color: mapDateColor(item.closingDate),
        title: "",
        key: "trafficLight"
      },
      closingDate: mapDateValueFromTask(item.closingDate),
      state: item.state,
      commercialReport: item.commercialReport
    }));
  }

  render() {
    const { listAssigned } = this.props;
    const modalTitle = 'Detalle pendiente';
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll', overflowX: 'hidden' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(listAssigned)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAssigned,
    changeSortOrder,
    swtShowMessage,
    clearListOfAssigned,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({ assignedReducer }, ownerProps) {
  return {
    assignedReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(listAssignedComponent);