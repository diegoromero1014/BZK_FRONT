import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer,clearContactDelete,orderColumnContact} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_CONTACT} from './constants';

let v1 = "";
let v2 = "";
let v3 = "";
class ListContactComponent extends Component {

  constructor(props){
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

  componentWillReceiveProps(nextProps){
      const {
          value1,
          value2,
          value3
      } = nextProps;
      if ((v1 !== nextProps.value1)  ||  (v2 !== nextProps.value2)  ||
          (v3 !== nextProps.value3)) {
      v1 = nextProps.value1;
      v2 = nextProps.value2;
      v3 = nextProps.value3;
      this._orderColumn(0,"");
    }
  }

  _orderColumn(order,column){
    if(order === 1){
      this.setState({orderA :'none',orderD:'inline-block'});
    }else{
      this.setState({orderA :'inline-block',orderD :'none'});
    }
    const {contactsByClientFindServer, selectsReducer,contactsByClient, value1, value2, value3,clearContactDelete,orderColumnContact} = this.props;
    clearContactDelete();
    orderColumnContact(order,column);
    contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,column,order,contactsByClient.get('keywordContact'),
    v1,
    v2,
    v3);
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el contacto ";
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
                "clientId":window.localStorage.getItem('idClientSelected'),
                "contactId":value.id,
                "clientContactId": value.idClientContact
              }
              }
            _.set(value, 'actions',  {
              actionView: true,
              id: value.id,
              urlServer: "./component",
              component : "VIEW_CONTACT"
            });
            _.set(value, 'delete',  {
              actionDelete: true,
              urlServer: "/deleteContactForClient",
              typeDelete : DELETE_TYPE_CONTACT,
              mensaje: mensaje + value.nameComplet + "?",
              json: json1
            });
      });
  }

  _renderHeaders(){
    return [
      {
        title: "",
        key:"actions"
      },
      {
        title: "Tratamiento",
        key:"title"
      },
      {
          title:"Nombre",
          orderColumn:<span><i className="caret down icon" style={{cursor: 'pointer',display:this.state.orderD}} onClick={() => this._orderColumn(0,"firstName")}></i><i className="caret up icon" style={{cursor: 'pointer',display:this.state.orderA}} onClick={() =>  this._orderColumn(1,"firstName")}></i></span>,
          key: "nameComplet"
      },
      {
        title: "Teléfono",
        key:"telephoneNumber"
      },
      {
        title: "Celular",
        key:"mobileNumber"
      },
      {
        title: "Correo",
        key:"emailAddress"
      },
      {
        title: "Ciudad",
        key:"city"
      },
      {
        title: "Tipo de contacto",
        key:"typeOfContact"
      },
      {
        title: "Cargo",
        key:"contactPosition"
      },
      {
        title: "",
        key:"delete"
      },
    ]
  }

  render() {
    const {contactsByClient} = this.props;
    const modalTitle = 'Contacto Detalle';
    const data = contactsByClient.get('contacts');
    return ( <div className = "horizontal-scroll-wrapper" >
      <GridComponent headers={this._renderHeaders} data={this._renderCellView(data)} modalTitle={modalTitle}/>
    </div>
    );
  }
}


function mapDispatchToProps(dispatch){
  return bindActionCreators({
    contactsByClientFindServer,clearContactDelete,orderColumnContact
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
    return {
        contactsByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContactComponent);
