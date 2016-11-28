import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {tasksByUser, clearPendingTask, orderColumnMyPending, clearMyPendingPaginator, clearMyPendingsOrder} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import {NUMBER_RECORDS} from './constants';
import {MODULE_TASKS} from '../../constantsGlobal';
import {validatePermissionsByModule} from '../../actionsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './pendingTaskUtilities';

let v1 = "";

class ListMyPendingComponent extends Component {

  constructor(props){
      super(props);
      momentLocalizer(moment);
      this._renderCellView = this._renderCellView.bind(this);
      this._renderHeaders = this._renderHeaders.bind(this);
      this.state = {
        column : "",
        order : "",
        orderA: 'none',
        orderD: 'inline-block'
      }
  }

  componentWillMount(){
    const {validatePermissionsByModule} = this.props;
    validatePermissionsByModule(MODULE_TASKS).then((data) => {
      if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
      }
    });
    this.state = {
      orderA: 'none',
      orderD: 'inline-block'
    }
  }

componentWillReceiveProps(nextProps){
    const {value1} = nextProps;
    if ((v1 !== nextProps.value1)){
    v1 = nextProps.value1;
  }
}

_orderColumn(orderMyPending,columnMyPending){
    if(orderMyPending === 1){
      this.setState({orderD :'none',orderA:'inline-block'});
    }else{
      this.setState({orderD :'inline-block',orderA :'none'});
    }
    const {tasksByUser,orderColumnMyPending,clearMyPendingPaginator} = this.props;
    clearMyPendingPaginator();
    orderColumnMyPending(orderMyPending, columnMyPending);
    tasksByUser(0, NUMBER_RECORDS, v1, orderMyPending, columnMyPending);
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tipo de documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"MD_TC.D05_KEY")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"MD_TC.D05_KEY")}></i></span>,
        key:"idTypeClient"
      },
      {
        title: "Número de documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"CLI.D09_CLIENT_ID_NUMBER")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"CLI.D09_CLIENT_ID_NUMBER")}></i></span>,
        key:"idNumberClient"
      },
      {
        title: "Nombre/Razón social",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"CLI.D09_CLIENT_NAME")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"CLI.D09_CLIENT_NAME")}></i></span>,
        key:"clientName"
      },
      {
        title: "",
        key:"trafficLight"
      },
      {
        title: "Fecha de vencimiento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(1,"UT.D62_CLOSING_DATE")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(0,"UT.D62_CLOSING_DATE")}></i></span>,
        key:"closeDate"
      },
      {
        title: "Estado",
        key:"status"
      }
    ]
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar la tarea ";
    return mapDataGrid(data);
  }

  render() {
    const {myPendingsReducer} = this.props;
    const modalTitle = 'Tarea';
    const data = myPendingsReducer.get('pendingTaskListByUser');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    tasksByUser,
    clearPendingTask,
    orderColumnMyPending,
    clearMyPendingPaginator,
    clearMyPendingsOrder,
    validatePermissionsByModule,
    redirectUrl
  }, dispatch);
}

function mapStateToProps({myPendingsReducer, reducerGlobal}, ownerProps){
    return {
        myPendingsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMyPendingComponent);
