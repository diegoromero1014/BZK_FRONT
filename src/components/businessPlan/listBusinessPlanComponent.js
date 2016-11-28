
import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {businessPlanByClientFindServer,orderColumnBusinessPlan,clearBusinessPlanOrder,clearBusinessPlanPaginator} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_BUSINESS_PLAN} from './constants';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {ELIMINAR} from '../../constantsGlobal';

let v1 = "";

class ListBusinessPlanComponent extends Component {

  constructor(props){
      super(props);
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
    this.state = {
      orderA: 'none',
      orderD: 'inline-block'
    }
  }

  componentWillReceiveProps(nextProps){
      const {value1} = nextProps;
      if ( v1 !== nextProps.value1 ){
      v1 = nextProps.value1;
      const {clearBusinessPlanOrder} = this.props;
      clearBusinessPlanOrder();
      this._orderColumn(1,"bp.businessDate");
    }
  }


  _orderColumn(orderBusinessPlan,columnBusinessPlan){
    if(orderBusinessPlan === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {businessPlanByClientFindServer,orderColumnBusinessPlan,clearBusinessPlanPaginator} = this.props;
    clearBusinessPlanPaginator();
    orderColumnBusinessPlan(orderBusinessPlan,columnBusinessPlan);
    businessPlanByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,columnBusinessPlan,orderBusinessPlan,v1,"");
}
  _renderHeaders(){
    return [
      {
        title: "",
        key:"actionsRedirect"
      },
      {
        title: "Objetivo del plan",
        key:"objective"
      },
      {
        title: "Fecha",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"businessDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"businessDate")}></i></span>,
        key:"businessDate"
      },
      {
        title: "Estado del documento",
        key:"statusDocument"
      },
      {
        title: "",
        key:"delete"
      },
    ]
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el informe de plan de negocio?";
    const {reducerGlobal} = this.props;
    var permissionsBussinessPlan = reducerGlobal.get('permissionsBussinessPlan');
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
                "entity":"BUSINESS_PLAN",
                "id":value.id
                }
              }
            _.set(value, 'actionsRedirect',  {
              actionView: true,
              id: value.id,
              typeClickDetail: "businessPlan",
              ownerDraft: value.idStatusDocument,
              urlRedirect: "/dashboard/businessPlanEdit",
              component: "VIEW_BUSINESS_PLAN"
            });
            var dateBusinessPlanStartFormat = "";
            if( moment(value.businessDate, ['DD MMM YYYY, hh:mm a'], 'es', true).isValid() ){
              dateBusinessPlanStartFormat = value.businessDate;
            } else {
              dateBusinessPlanStartFormat = moment(value.businessDate).locale('es').format('DD MMM YYYY, hh:mm a');
            }
            _.set(value, 'businessDate', dateBusinessPlanStartFormat);

            if( _.get(permissionsBussinessPlan, _.indexOf(permissionsBussinessPlan, ELIMINAR), false) ){
              if(value.idStatusDocument === 0){
                _.set(value, 'delete',  {
                  actionDelete: true,
                  urlServer: "/deleteEntity",
                  typeDelete : DELETE_TYPE_BUSINESS_PLAN,
                  mensaje: mensaje,
                  json: json1
                });
              }
            }
      });
  }

  render() {
    const modalTitle = 'Plan de negocios Detalle';
    const {businessPlanReducer} = this.props;
    const data = businessPlanReducer.get('businessPlanList');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    businessPlanByClientFindServer,orderColumnBusinessPlan,clearBusinessPlanOrder,clearBusinessPlanPaginator
  }, dispatch);
}

function mapStateToProps({businessPlanReducer, reducerGlobal}, ownerProps){
    return {
        businessPlanReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusinessPlanComponent);
