import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByClientFindServer, clearUserTaskPaginator, orderColumnUserTask, clearUserTaskOrder} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS, DELETE_TYPE_CONTACT} from './constants';

let v1 = "";
let v2 = "";
let v3 = "";
class ListPendingTaskComponent extends Component {

  constructor(props) {
    super(props);
    this._renderCellView = this._renderCellView.bind(this);
    this._orderColumn = this._orderColumn.bind(this);
    this._renderHeaders = this._renderHeaders.bind(this);
    this.state = {
      column : "",
      order : "",
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
    const {value1, value2, value3} = nextProps;
    if ((v1 !== nextProps.value1)  ||  (v2 !== nextProps.value2)  || (v3 !== nextProps.value3)) {
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      v3 = nextProps.value3;
      const {clearUserTaskOrder} = this.props;
      clearUserTaskOrder();
      this._orderColumn(0, "");
    }
  }

  _orderColumn(order, column) {
    if(order === 1) {
      this.setState({orderA :'none', orderD:'inline-block'});
    } else {
      this.setState({orderA :'inline-block', orderD :'none'});
    }
    const {tasksByClientFindServer, selectsReducer, tasksByClient, value1, value2, value3, clearUserTaskPaginator, orderColumnUserTask} = this.props;
    clearUserTaskPaginator();
    orderColumnUserTask(order, column);
    tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, column, order, '');
  }

  _renderCellView(data) {
    const mensaje = "Señor usuario ¿está seguro que desea eliminar la tarea ";
    return _.forOwn(data, function(value, key) {
      var json1 = {
        "messageHeader": {
          "sessionToken": window.localStorage.getItem('sessionToken'),
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
          "clientId": window.localStorage.getItem('idClientSelected'),
          "contactId": value.id,
          "clientContactId": value.idClientContact
        }
      };
      _.set(value, 'actions',  {
        actionView: true,
        id: value.id,
        urlServer: "./component",
        component : "VIEW_CONTACT"
      });
      _.set(value, 'delete',  {
        actionDelete: true,
        urlServer: "/deleteContactForClient",
        typeDelete: DELETE_TYPE_CONTACT,
        mensaje: mensaje + value.nameComplet + "?",
        json: json1
      });
    });
  }

  _renderHeaders() {
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tarea",
        key:"task"
      },
      {
        title: "Responsable",
        key: "responsable"
      },
      {
        title: "Fecha cierre",
        key: "dueTime"
      },
      {
        title: "Estado",
        key: "status"
      },
      {
        Avance: "Avance",
        key: "advance"
      },
      {
        title: "",
        key:"delete"
      },
    ]
  }

  render() {
    const {tasksByClient} = this.props;
    const modalTitle = 'Tarea Detalle';
    const data = tasksByClient.get('pendingTaskList');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer, clearUserTaskPaginator, orderColumnUserTask, clearUserTaskOrder
  }, dispatch);
}

function mapStateToProps({tasksByClient}, ownerProps) {
    return {
        tasksByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPendingTaskComponent);
