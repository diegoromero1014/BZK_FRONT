import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import SweetAlert from 'sweetalert-react';
import Modal from 'react-modal';
import _ from 'lodash';
import moment from 'moment';
import { shorterStringValue, stringValidate, mapDateValueFromTask, validateResponse } from '../../../actionsGlobal';
import { ORDER_ASC, ORDER_DESC, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT } from '../../../constantsGlobal';
import GridComponent from '../../grid/component';
import { VIEW_AEC_PENDING } from '../../modal/constants';
import { getAssigned, changeSortOrder } from './actions';
import { NUMBER_RECORDS } from './constants';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { mapDateColor } from '../myTasks/pendingTaskUtilities';

class listAssignedComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      actions: {},
      modalIsOpen: false,
      orderAsc: 'inline-block',
      orderDesc: 'none'
    };

    this.closeModal = this.closeModal.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this._renderCellView = this._renderCellView.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  _orderColumn(sortOrder) {
    const { getAssigned, assignedReducer, changeSortOrder, swtShowMessage } = this.props;
    changeSortOrder(sortOrder);
    var paginationAssigned = {
      statusOfTask: null,
      clientNumber: null,
      clientName: null,
      sortOrder: sortOrder,
      pageNum: assignedReducer.get('limInf'),
      maxRows: NUMBER_RECORDS
    };
    getAssigned(paginationAssigned).then((data) => {
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
      }
    ]
  }

  _renderCellView(data = []) {
    const { reducerGlobal } = this.props;
    return data.map(item => ({
      actions: {
        actionView: true,
        idTask: item.idTask,
        urlServer: "./component",
        component: VIEW_AEC_PENDING
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
      state: item.state
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
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ assignedReducer }, ownerProps) {
  return {
    assignedReducer
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(listAssignedComponent);