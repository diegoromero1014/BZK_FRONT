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
    this.state = {
      orderA: 'inline-block',
      orderD: 'none'
    }
  }

  _orderColumn(orderTask, columnTask) {
    const { orderColumn } = this.props;
    if (orderTask === 1) {
      this.setState({ orderA: 'none', orderD: 'inline-block' });
    } else {
      this.setState({ orderA: 'inline-block', orderD: 'none' });
    }
    orderColumn(orderTask, columnTask);
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