import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {visitByClientFindServer,orderColumnVisit,clearVisitOrder,clearVisitPaginator} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_VISIT} from './constants';

let v1 = "";


class ListVisitComponent extends Component {

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
          value1
      } = nextProps;
      if ((v1 !== nextProps.value1)){
      v1 = nextProps.value1;
      const {clearVisitOrder} = this.props;
      clearVisitOrder();
      this._orderColumn(1,"vd.visitTime");
    }
  }


  _orderColumn(orderVisit,columnVisit){
    if(orderVisit === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {visitByClientFindServer,orderColumnVisit,clearVisitPaginator} = this.props;
    clearVisitPaginator();
    orderColumnVisit(orderVisit,columnVisit);
    visitByClientFindServer(window.localStorage.getItem('idClientSelected'),0,NUMBER_RECORDS,columnVisit,orderVisit,v1);
}
  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tipo de reunión",
        key:"typeVisit"
      },
      {
        title: "Fecha de reunión",
        key:"dateVisit",
        orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"vd.visitTime")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"vd.visitTime")}></i></span>
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
    const mensaje = "Señor usuario ¿está seguro que desea eliminar la visita ?";
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
                "entity":"VISIT",
                "id":value.id
                }
              }
            _.set(value, 'actions',  {
              actionView: true,
              id: value.nombre,
              urlServer: "./component",
              component : "VIEW_SHAREHOLDER"
            });

            if(value.idStatusDocument === 0){
              _.set(value, 'delete',  {
                actionDelete: true,
                urlServer: "/deleteEntity",
                typeDelete : DELETE_TYPE_VISIT,
                mensaje: mensaje,
                json: json1
              });
          }
      });
  }

  render() {
    const modalTitle = 'Visita Detalle';
    const {visitReducer} = this.props;
    const data = visitReducer.get('visitList');
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle}/>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    visitByClientFindServer,orderColumnVisit,clearVisitOrder,clearVisitPaginator
  }, dispatch);
}

function mapStateToProps({visitReducer}, ownerProps){
    return {
        visitReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListVisitComponent);
