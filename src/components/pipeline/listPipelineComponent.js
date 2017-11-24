import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {pipelineByClientFindServer,orderColumnPipeline,clearPipelineOrder,clearPipelinePaginator} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_PIPELINE} from './constants';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {ELIMINAR} from '../../constantsGlobal';
import { MODULE_PIPELINE } from '../grid/constants';

let v1 = "";
let v2= "";

class ListPipelineComponent extends Component {

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
      if ((v1 !== nextProps.value1) || (v2 !== nextProps.value2)){
      v1 = nextProps.value1;
      v2 =nextProps.value2;
      const {clearPipelineOrder} = this.props;
      clearPipelineOrder();
    }
  }

  _orderColumn(orderPipeline,columnPipeline){
    if(orderPipeline === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {pipelineByClientFindServer,orderColumnPipeline,clearPipelinePaginator} = this.props;
    clearPipelinePaginator();
    orderColumnPipeline(orderPipeline,columnPipeline);
    pipelineByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,columnPipeline,orderPipeline,v1,v2);
}
  _renderHeaders(){
    return [
      {
        title: "",
        key:"actionsRedirect"
      },
      {
        title: "Nombre de la oportunidad",
        key:"opportunityName"
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
        title: "",
        key:"delete"
      },
    ]
  }


  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el informe de pipeline?";
    const {reducerGlobal} = this.props;
    var permissionsPipeline = reducerGlobal.get('permissionsPipeline');
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
              typeClickDetail: MODULE_PIPELINE,
              ownerDraft: value.idStatusDocument,
              urlRedirect: "/dashboard/pipelineEdit",
              component: "VIEW_PIPELINE"
            });
        
            if( _.get(permissionsPipeline, _.indexOf(permissionsPipeline, ELIMINAR), false) ){
              if(value.idStatusDocument === 0){
                _.set(value, 'delete',  {
                  actionDelete: true,
                  urlServer: "/deleteEntity",
                  typeDelete : DELETE_TYPE_PIPELINE,
                  mensaje: mensaje,
                  json: json1
                });
              }
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
    pipelineByClientFindServer,orderColumnPipeline,clearPipelineOrder,clearPipelinePaginator
  }, dispatch);
}

function mapStateToProps({pipelineReducer, reducerGlobal}, ownerProps){
    return {
        pipelineReducer,
        reducerGlobal
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPipelineComponent);
