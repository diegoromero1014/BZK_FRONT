import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {draftsDocumentsByUser, clearDraftDocument, orderColumnDraftDocument, clearDraftDocumentPaginator, clearDraftDocumentOrder} from './actions';
import GridComponent from '../grid/component';
import {redirectUrl} from '../globalComponents/actions'
import {NUMBER_RECORDS} from './constants';
import {validatePermissionsByModule} from '../../actionsGlobal';
import {MODULE_PREVISITS, MODULE_VISITS, MODULE_PIPELINE, MODULE_BUSSINESS_PLAN} from '../../constantsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './draftDocumentsUtilities';

let v1 = "";
class ListDraftDocuments extends Component {

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
    validatePermissionsByModule(MODULE_PREVISITS).then((data) => {
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

_orderColumn(orderDrafts, columnDrafts){
    if(orderDrafts === 1){
      this.setState({orderD :'none',orderA:'inline-block'});
    }else{
      this.setState({orderD :'inline-block',orderA :'none'});
    }
    const {draftsDocumentsByUser, orderColumnDraftDocument, clearDraftDocumentPaginator} = this.props;
    clearDraftDocumentPaginator();
    orderColumnDraftDocument(orderDrafts, columnDrafts);
    draftsDocumentsByUser(0, NUMBER_RECORDS, v1, orderDrafts, columnDrafts);
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tipo de documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.idTypeClient")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.idTypeClient")}></i></span>,
        key:"idTypeClient"
      },
      {
        title: "Número de documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.idNumberClient")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.idNumberClient")}></i></span>,
        key:"idNumberClient"
      },
      {
        title: "Nombre/Razón social",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.clientName")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.clientName")}></i></span>,
        key:"clientName"
      },
      {
        title: "Documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.typeDocument")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.typeDocument")}></i></span>,
        key:"typeDocument"
      },
      {
        title: "Fecha de creación",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(1,"results.createDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(0,"results.createDate")}></i></span>,
        key:"createDate"
      },
      {
        title: "Fecha de modificación",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(1,"results.updateDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(0,"results.updateDate")}></i></span>,
        key:"updateDate"
      },
      {
  			title: "",
  			key:"delete"
  		}
    ]
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar la documento ";
    return mapDataGrid(data);
  }

  render() {
    const {draftDocumentsReducer} = this.props;
    const data = draftDocumentsReducer.get('draftDocumentsListByUser');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    draftsDocumentsByUser,
    clearDraftDocument,
    orderColumnDraftDocument,
    clearDraftDocumentPaginator,
    clearDraftDocumentOrder,
    validatePermissionsByModule,
    redirectUrl
  }, dispatch);
}

function mapStateToProps({draftDocumentsReducer, reducerGlobal}, ownerProps){
    return {
        draftDocumentsReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListDraftDocuments);
