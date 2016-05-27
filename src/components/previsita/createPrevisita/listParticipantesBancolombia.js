import React, {Component,PropTypes} from 'react';
import GridComponent from '../../grid/component';

let v1 = "";
let v2 = "";


class ListParticipantesBancolombia extends Component {

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
      v2 = nextProps.value2;
      const {clearShareholderOrder} = this.props;
    }
  }


  _orderColumn(orderShareholder,columnShareholder){
    if(orderShareholder === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
  }

  _renderHeaders(){
    return [
      {
        title: "Nombre",
        key:"name"
      },
      {
        title: "Cargo",
        key:"cargo"
      },
      {
        title: "",
        key:"delete"
      },
    ]
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el participante ";
    return _.forOwn(data, function(value, key) {
              var json1 = {
                "messageHeader": {
                  "sessionToken": window.localStorage.getItem('sessionToken'),
                      "timestamp": new Date().getTime(),
                      "username":"lmejias",
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
                "entity":"SHAREHOLDER",
                "id":value.id
                }
              }
            _.set(value, 'actions',  {
              actionView: true,
              id: value.id,
              urlServer: "./component",
              component : "VIEW_SHAREHOLDER"
            });
            _.set(value,'percentageS', value.percentage + "%");
            _.set(value, 'delete',  {
              actionDelete: true,
              urlServer: "/deleteEntity",
              typeDelete : 'DELETE_TYPE_SHAREHOLDER',
              mensaje: mensaje + value.name + "?",
              json: json1
            });
      });
  }

  render() {
    const modalTitle = 'Accionista Detalle';
    const {shareholdersReducer} = this.props;
    const data =
    [
      {
        name: "Maria Fernanda",
        cargo: "Analista"
      },
      {
        name: "Wilfer Salazar",
        cargo: "Directo"
      },
      {
        name: "Tatiana Montoya",
        cargo: "Vicepresidente"
      }
    ]
    return (
      <div className = "horizontal-scroll-wrapper" style={{overflow: 'scroll'}}>
        <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle}/>
      </div>
    );
  }
}

export default ListParticipantesBancolombia;
