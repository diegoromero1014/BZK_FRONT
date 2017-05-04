import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {draftsDocumentsByUser, clearDraftDocument, orderColumnDraftDocument, clearDraftDocumentPaginator, clearDraftDocumentOrder} from './actions';
import GridComponent from '../../grid/component';
import {redirectUrl} from '../../globalComponents/actions'
import {NUMBER_RECORDS} from './constants';
import {validatePermissionsByModule} from '../../../actionsGlobal';
import {MODULE_PREVISITS, MODULE_VISITS, MODULE_PIPELINE, MODULE_BUSSINESS_PLAN, VISUALIZAR, ELIMINAR} from '../../../constantsGlobal';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {mapDataGrid} from './draftDocumentsUtilities';

let keyWord = "";
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
    validatePermissionsByModule(MODULE_PREVISITS);
    validatePermissionsByModule(MODULE_VISITS);
    validatePermissionsByModule(MODULE_PIPELINE);
    validatePermissionsByModule(MODULE_BUSSINESS_PLAN);
    this.state = {
      orderA: 'none',
      orderD: 'inline-block'
    }
  }

componentWillReceiveProps(nextProps){
    if ((keyWord !== nextProps.keyWordParameter)){
    keyWord = nextProps.keyWordParameter;
  }
}

_orderColumn(orderDrafts, columnDrafts){
    if(orderDrafts === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {draftsDocumentsByUser, orderColumnDraftDocument, clearDraftDocumentPaginator} = this.props;
    clearDraftDocumentPaginator();
    orderColumnDraftDocument(orderDrafts, columnDrafts);
    draftsDocumentsByUser(0, NUMBER_RECORDS, keyWord, orderDrafts, columnDrafts);
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actionsRedirect",
        width: '20px'
      },
      {
        title: "Tipo documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.idTypeClient")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.idTypeClient")}></i></span>,
        key:"idTypeClient",
        width: '160px'
      },
      {
        title: "Número documento",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.idNumberClient")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.idNumberClient")}></i></span>,
        key:"idNumberClient",
        width: '170px'
      },
      {
        title: "Nombre/Razón social",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.clientName")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.clientName")}></i></span>,
        key:"clientName"
      },
      {
        title: "Informe",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.typeDocument")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.typeDocument")}></i></span>,
        key:"typeDocument",
        width: '50px'
      },
      {
        title: "Fecha creación",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.createDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.createDate")}></i></span>,
        key:"createDate",
        width: '140px'
      },
      {
        title: "Fecha modificación",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"results.updateDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"results.updateDate")}></i></span>,
        key:"updateDate",
        width: '165px'
      },
      {
  			title: "",
  			key:"delete",
        width: '20px'
  		}
    ]
  }

  _renderCellView(data){
    const {reducerGlobal} = this.props;
    //Permisos visualizar
    let viewPrevisit = _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), VISUALIZAR), false);
    let viewVisit = _.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), VISUALIZAR), false);
    let viewPipeline = _.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), VISUALIZAR), false);
    let viewBusinessPlan = _.get(reducerGlobal.get('permissionsBussinessPlan'), _.indexOf(reducerGlobal.get('permissionsBussinessPlan'), VISUALIZAR), false);
    //Permisos eliminar
    let deletePrevisit = _.get(reducerGlobal.get('permissionsPrevisits'), _.indexOf(reducerGlobal.get('permissionsPrevisits'), ELIMINAR), false);
    let deleteVisit = _.get(reducerGlobal.get('permissionsVisits'), _.indexOf(reducerGlobal.get('permissionsVisits'), ELIMINAR), false);
    let deletePipeline = _.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), ELIMINAR), false);
    let deleteBusinessPlan = _.get(reducerGlobal.get('permissionsBussinessPlan'), _.indexOf(reducerGlobal.get('permissionsBussinessPlan'), ELIMINAR), false);
    return mapDataGrid(data, viewPrevisit, viewVisit, viewPipeline, viewBusinessPlan, deletePrevisit, deleteVisit, deletePipeline, deleteBusinessPlan);
  }

  render() {
    const {draftDocumentsReducer} = this.props;
    const data = draftDocumentsReducer.get('draftDocumentsListByUser');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll', overflowX : 'hidden'}}>
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
