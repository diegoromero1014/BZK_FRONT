import React, { Component } from 'react';
import moment from 'moment';
import GridComponent from '../grid/component';
import { shorterStringValue } from '../../actionsGlobal';
import { MODAL_TITLE } from './constants';

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
    const mensaje = "Señor usuario ¿está seguro que desea eliminar la tarea ";
    return _.forOwn(data, function (value, key) {
      var json1 = {
        "messageHeader": {
          "sessionToken": window.localStorage.getItem('sessionTokenFront'),
          "timestamp": new Date().getTime(),
          "service": "",
          "status": "0",
          "language": "es",
          "displayErrorMessage": "",
          "technicalErrorMessage": "",
          "applicationVersion": "",
          "debug": true,
          "isSuccessful": true
        },
        "messageBody": {
          "clientId": window.sessionStorage.getItem('idClientSelected'),
          "contactId": value.id,
          "clientContactId": value.idClientContact
        }
      };
      _.set(value, 'taskText', shorterStringValue(value.taskText, 50));
      _.set(value, 'actions', {
        actionView: true,
        id: value,
        urlServer: "./component",
        component: "VIEW_TASK_ADMIN"
      });
      var dateTaskFormat = moment(value.finalDate).locale('es');
      _.set(value, 'dateTaskFormat', dateTaskFormat.format("DD") + " " + dateTaskFormat.format("MMM") + " " + dateTaskFormat.format("YYYY"));
      _.set(value, 'delete', {
        actionDelete: true,
        urlServer: "/deleteContactForClient",
        typeDelete: "",
        mensaje: mensaje + value.task + "?",
        json: json1
      });
    });
  }

  _renderHeaders = () => {
    return [
      {
        title: "",
        key: "actions"
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