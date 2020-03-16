import React, { Component } from 'react';
import moment from 'moment';
import GridComponent from '../grid/component';
import { MODAL_TITLE } from './constants';
import {MODULE_TASKS} from "../../constantsGlobal";

class ListPendingTaskComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      column: "",
      order: "",
      orderA: "inline-block",
      orderD: "none",
    };
  }

  componentDidMount() {
    const { handleTaskByClientsFind, mode } = this.props;
    this.state = {
      orderA: 'inline-block',
      orderD: 'none'
    }
    handleTaskByClientsFind(0, mode);
  }

  _orderColumn(orderTask) {
    const { orderColumn, mode } = this.props;
    if (orderTask === 1) {
      this.setState({ orderA: 'none', orderD: 'inline-block' });
    } else {
      this.setState({ orderA: 'inline-block', orderD: 'none' });
    }
    orderColumn(orderTask, mode);
  }


  _renderCellView = (data) => {
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
      _.set(value, "responsable", value.responsible);
      _.set(value, "assignedBy", value.assignedBy);
      _.set(value, "status", value.statusTask);
      let isFinalized = value.statusTask === 'Cancelada' || value.statusTask === 'Cerrada';
      _.set(value, "trafficLightIndicator", {days:value.workDaysToClose, isFinalized:isFinalized});
    });
  }

  _renderHeaders = () => {
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
        key: "trafficLightIndicator"
      },
      {
        title: "",
        key: "commercialReport.isConfidential"
      }
    ]
  }

  render() {
    const { tasks } = this.props;
    return (
      <div className="horizontal-scroll-wrapper" style={{ overflow: 'scroll' }}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(tasks)} modalTitle={MODAL_TITLE} />
      </div>
    );
  }
}

export default ListPendingTaskComponent;