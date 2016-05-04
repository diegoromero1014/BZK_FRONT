import React, {
  Component,
  PropTypes
} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {contactsByClientFindServer} from './actions';
import GridComponent from '../grid/component';
import {NUMBER_RECORDS,DELETE_TYPE_CONTACT} from './constants';

const headers = [
  {
    title: "",
    key:"actions"
  },
  {
    title: "Tratamiento",
    key:"title"
  },
  {
      title: "Nombre",
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
];

let v1 = "";
let v2 = "";
let v3 = "";
let limInf1 = 0;

class ListContactComponent extends Component {

  constructor(props){
      super(props);
      this._renderCellView = this._renderCellView.bind(this);
  }

  componentWillMount(){
      const {contactsByClientFindServer, selectsReducer,contactsByClient, value1, value2, value3} = this.props;
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
      "",
      "",
      "");
  }

  _renderCellView(data){
    const mensaje = "Señor usuario ¿está seguro que desea eliminar el contacto ";
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

  render() {
    const {contactsByClient} = this.props;
    const modalTitle = 'Contacto Detalle';
    const data = contactsByClient.get('contacts');
    return ( < div className = "horizontal-scroll-wrapper" >
      <GridComponent headers={headers} data={this._renderCellView(data)} modalTitle={modalTitle}/>
    </div>
    );
  }
}


function mapDispatchToProps(dispatch){
  return bindActionCreators({
    contactsByClientFindServer
  }, dispatch);
}

function mapStateToProps({contactsByClient}, ownerProps){
    return {
        contactsByClient
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListContactComponent);
