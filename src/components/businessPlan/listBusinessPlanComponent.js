
import React, {Component,PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {businessPlanByClientFindServer,orderColumnBusinessPlan,clearBusinessPlanOrder,clearBusinessPlanPaginator} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_BUSINESS_PLAN} from './constants';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';


let v1 = "";
let v2= "";

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
      const {
          value1,
          value2
      } = nextProps;
      if ((v1 !== nextProps.value1) || (v1 !== nextProps.value2)){
      v1 = nextProps.value1;
      v2 =nextProps.value2;
      const {clearBusinessPlanOrder} = this.props;
      clearBusinessPlanOrder();
      this._orderColumn(1,"bp.startDate");
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
    businessPlanByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,columnBusinessPlan,orderBusinessPlan,v1,v2);
}
  _renderHeaders(){
    return [
      {
        title: "",
        key:"actionsRedirect"
      },
      {
        title: "Estado del negocio",
        key:"businessStatus"
      },
      {
        title: "Necesidad",
        key:"need"
      },
      {
        title: "Fecha de inicio",
        key:"datePipelineStartFormat",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"bp.startDate")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"bp.startDate")}></i></span>
      },
      {
        title: "Fecha de finalización",
        key:"datePipelineEndFormat"
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
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el informe de pipeline?";

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
                "entity":"PIPELINE",
                "id":value.id
                }
              }
            _.set(value, 'actionsRedirect',  {
              actionView: true,
              id: value.id,
              typeClickDetail: "pipeline",
              ownerDraft: value.idStatusDocument,
              urlRedirect: "/dashboard/pipelineEdit",
              component: "VIEW_PIPELINE"
              //component : "VIEW_VISIT"
            });
            var datePipelineStartFormat = moment(value.startDate).locale('es');
            _.set(value, 'datePipelineStartFormat',datePipelineStartFormat.format("DD") + " " + datePipelineStartFormat.format("MMM") + " " + datePipelineStartFormat.format("YYYY")+ ", " + datePipelineStartFormat.format("hh:mm a"));
             var datePipelineEndFormat = moment(value.endDate).locale('es');
            _.set(value, 'datePipelineEndFormat',datePipelineEndFormat.format("DD") + " " + datePipelineEndFormat.format("MMM") + " " + datePipelineEndFormat.format("YYYY")+ ", " + datePipelineEndFormat.format("hh:mm a"));
            if(value.idStatusDocument === 0){
              _.set(value, 'delete',  {
                actionDelete: true,
                urlServer: "/deleteEntity",
                typeDelete : DELETE_TYPE_PIPELINE,
                mensaje: mensaje,
                json: json1
              });
          }
      });
  }

  render() {
    const modalTitle = 'Pipeline Detalle';
    const {pipelineReducer} = this.props;
    const data = pipelineReducer.get('pipelineList');
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

function mapStateToProps({businessPlanReducer}, ownerProps){
    return {
        businessPlanReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListBusinessPlanComponent);
