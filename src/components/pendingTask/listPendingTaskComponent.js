import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByClientFindServer,orderColumnUserTask,clearUserTaskOrder,clearUserTaskPaginator} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS} from './constants';

let v1= "";
class ListPendingTaskComponent extends Component {

  constructor(props){
      super(props);
      this._renderCellView = this._renderCellView.bind(this);
      this._renderHeaders = this._renderHeaders.bind(this);
      this.state = {
        column : "",
        order : "",
        orderA: 'inline-block',
        orderD: 'none'
      }
  }



  componentWillMount(){
    this.state = {
      orderA: 'inline-block',
      orderD: 'none'
    }
  }

  componentWillReceiveProps(nextProps){
      const {
          value1
      } = nextProps;
      if ((v1 !== nextProps.value1)){
      v1 = nextProps.value1;
      const {clearUserTaskOrder} = this.props;
      clearUserTaskOrder();
      this._orderColumn(0,"c.closingDate");
    }
  }


  _orderColumn(orderTask,columnTask){
    if(orderTask === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {tasksByClientFindServer,orderColumnUserTask,clearUserTaskPaginator} = this.props;
    clearUserTaskPaginator();
    orderColumnUserTask(orderTask,columnTask);
    tasksByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, columnTask, orderTask, v1);
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
        id: value.task,
        urlServer: "./component",
        component : "VIEW_CONTACT"
      });
      _.set(value, 'delete',  {
        actionDelete: true,
        urlServer: "/deleteContactForClient",
        typeDelete: "",
        mensaje: mensaje + value.task + "?",
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
        title: "Fecha de cierre",
        key: "finalDate",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"c.closingDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"c.closingDate")}></i></span>
      },
      {
        title: "Estado",
        key: "status"
      },
      {
        title: "Avance",
        key: "advance"
      }
      /*{
        title: "",
        key:"delete"
      },*/
    ]
  }

  render() {
    const {tasksByClient} = this.props;
    const modalTitle = 'Tarea Detalle';
    const data = tasksByClient.get('userTasksByClient');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    tasksByClientFindServer,orderColumnUserTask,clearUserTaskOrder,clearUserTaskPaginator
  }, dispatch);
}

function mapStateToProps({tasksByClient}, ownerProps) {
    return {
        tasksByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPendingTaskComponent);
