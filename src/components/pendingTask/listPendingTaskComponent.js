import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { tasksByClientFindServer, orderColumnUserTask, clearUserTaskOrder, clearUserTaskPaginator } from './actions';
import GridComponent from '../grid/component';
import { NUMBER_RECORDS } from './constants';
import moment from 'moment';

import {MODULE_TASKS} from "../../constantsGlobal";

let v1 = "";
class ListPendingTaskComponent extends Component {

  constructor(props) {
    super(props);
    this._renderCellView = this._renderCellView.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this.state = {
      column: "",
      order: "",
      orderA: 'inline-block',
      orderD: 'none'
    }
  }

  componentWillMount() {
    this.state = {
      orderA: 'inline-block',
      orderD: 'none'
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value1 } = nextProps;
    if ((v1 !== nextProps.value1)) {
      v1 = nextProps.value1;
      const { clearUserTaskOrder } = this.props;
      clearUserTaskOrder();
      this._orderColumn(0, "finalDate");
    }
  }


  _orderColumn(orderTask, columnTask) {
    if (orderTask === 1) {
      this.setState({ orderA: 'none', orderD: 'inline-block' });
    } else {
      this.setState({ orderA: 'inline-block', orderD: 'none' });
    }
    const { tasksByClientFindServer, orderColumnUserTask, clearUserTaskPaginator } = this.props;
    clearUserTaskPaginator();
    orderColumnUserTask(orderTask, columnTask);
    tasksByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_RECORDS, columnTask, orderTask, v1);
  }


  _renderCellView(data) {
    return _.forOwn(data, function (value, key) {
      _.set(value, 'actionsRedirect', {
        actionView: true,
        id: value.id,
        typeClickDetail: MODULE_TASKS,
        urlRedirect: '/dashboard/task',
        component: 'VIEW_TASK_ADMIN'
      });
      var dateTaskFormat = moment(value.finalDate).locale('es');
      _.set(value, 'dateTaskFormat', dateTaskFormat.format("DD") + " " + dateTaskFormat.format("MMM") + " " + dateTaskFormat.format("YYYY"));
    });
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key: "actionsRedirect"
      },
      {
        title: "Responsable",
        key: "responsable"
      },
      {
        title: "Asignado por",
        key: "assignedBy"
      },
      {
        title: "Fecha de cierre",
        key: "dateTaskFormat",
        orderColumn: <span><i className="caret down icon" style={{ cursor: 'pointer', display: this.state.orderD }} onClick={() => this._orderColumn(0, "finalDate")}></i><i className="caret up icon" style={{ cursor: 'pointer', display: this.state.orderA }} onClick={() => this._orderColumn(1, "finalDate")}></i></span>
      },
      {
        title: "Estado",
        key: "status"
      },
      {
        title: "",
        key: "commercialReport.isConfidential"
      }
    ]
  }

  render() {
    const { tasksByClient } = this.props;
    const modalTitle = 'Tarea';
    const data = tasksByClient.get('userTasksByClient');
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer, orderColumnUserTask, clearUserTaskOrder, clearUserTaskPaginator
  }, dispatch);
}

function mapStateToProps({ tasksByClient }, ownerProps) {
  return {
    tasksByClient
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPendingTaskComponent);