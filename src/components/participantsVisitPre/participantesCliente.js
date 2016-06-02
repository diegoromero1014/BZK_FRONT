import React, {Component} from 'react';
import ListParticipantesCliente from './listParticipantesCliente';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, deleteParticipant, clearParticipants} from './actions';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {contactsByClientFindServer} from '../contact/actions';
import {NUMBER_RECORDS} from '../contact/constants';
import _ from 'lodash';

const validate = values => {
    const errors = {}
    return errors
};

var disabledButtonCreate= '';
class ParticipantesCliente extends Component{

  constructor(props) {
      super(props);
      this.state = {
        showEmptyParticipant: false,
        showParticipantExist: false
      }
      this._addParticipantClient = this._addParticipantClient.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantClient() {
      const {fields: { idContacto, nameContacto, contactoCliente, cargoContacto, estiloSocial, actitudGrupo }, participants, addParticipant} = this.props;
      if( contactoCliente.value !== "" && contactoCliente.value !== null && contactoCliente.value !== undefined ){
        var particip = participants.find(function(item){
          return item.idParticipante === idContacto.value;
        });
        if( particip === undefined ){
          const uuid = _.uniqueId('participanClient_');
          var clientParticipant = {
            tipoParticipante: 'client',
            idParticipante: idContacto.value,
            nombreParticipante: nameContacto.value,
            cargo: cargoContacto.value,
            empresa: '',
            estiloSocial: estiloSocial.value,
            actitudBanco: actitudGrupo.value,
            fecha: Date.now(),
            uuid,
          }
          addParticipant(clientParticipant);
          idContacto.onChange('');
          nameContacto.onChange('');
          contactoCliente.onChange('');
          cargoContacto.onChange('');
          estiloSocial.onChange('');
          actitudGrupo.onChange('');
        } else {
          this.setState({
            showParticipantExist: true
          });
        }
      } else {
        this.setState({
          showEmptyParticipant: true
        });
      }
  }

  componentWillMount(){
    const{contactsByClient, contactsByClientFindServer, clearParticipants, participants} = this.props;
    clearParticipants();
    this.props.resetForm();
    const valuesContactsClient = contactsByClient.get('contacts');
    if( _.isEmpty(valuesContactsClient) || valuesContactsClient === null || valuesContactsClient === undefined ){
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"","","","");
    }
  }

  _updateValue(value){
    const{fields: {idContacto, nameContacto, contactoCliente, cargoContacto, estiloSocial, actitudGrupo}, contactsByClient} = this.props;
    var contactClient = contactsByClient.get('contacts');
    var contactSelected;
    _.map(contactClient, contact => {
      if( contact.id.toString() === value ){
        contactSelected = contact;
        return contact;
      }
    });
    if( contactSelected !== null && contactSelected !== undefined ){
      idContacto.onChange(contactSelected.id);
      nameContacto.onChange(contactSelected.nameComplet);
      cargoContacto.onChange(contactSelected.contactPosition);
      estiloSocial.onChange(contactSelected.contactSocialStyle);
      actitudGrupo.onChange(contactSelected.contactActitudeCompany);
    }
  }

  _submitValores(){

  }

  render(){
    const {fields: {
      contactoCliente, cargoContacto, estiloSocial, actitudGrupo
    }, error, handleSubmit, participants, contactsByClient, addParticipant} = this.props;
    if( participants.size === 10 ){
      disabledButtonCreate = 'disabled';
    }
    return(
      <form onSubmit={handleSubmit(this._submitValores)}>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
                <ComboBox
                    name="txtContactoCliente"
                    labelInput="Seleccione..."
                    {...contactoCliente}
                    onChange={val => this._updateValue(val)}
                    valueProp={'id'}
                    textProp={'nameComplet'}
                    data={contactsByClient.get('contacts')}
                />
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                {...cargoContacto}
                type="text"
                disabled='disabled'
                placeholder="Cargo de la persona"
              />
            </dt>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Estilo social</span></dt>
              <Input
                name="estiloSocial"
                {...estiloSocial}
                placeholder="Estilo social de la persona"
                disabled='disabled'
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={12} md={2.9} lg={2.9}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Actitud frente al grupo</span></dt>
              <Input
                name="actitudGrupo"
                {...actitudGrupo}
                placeholder="Actitud frente al grupo de la persona"
                disabled='disabled'
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={1} md={0.1} lg={0.1}>
            <button className="btn btn-primary" onClick={this._addParticipantClient} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante, máximo 10" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs>
            <ListParticipantesCliente />
          </Col>
        </Row>
        <SweetAlert
         type="error"
         show={this.state.showEmptyParticipant}
         title="Debe seleccionar un contacto"
         text="Señor usuario, para agregar un participante, debe seleccionar un contacto"
         onConfirm={() => this.setState({showEmptyParticipant:false})}
         />
         <SweetAlert
          type="error"
          show={this.state.showParticipantExist}
          title="Participante existente"
          text="Señor usuario, el participante que desea agregar ya se encuentra en la lista"
          onConfirm={() => this.setState({showParticipantExist:false})}
          />
      </form>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteParticipant,
        addParticipant,
        contactsByClientFindServer,
        clearParticipants
    }, dispatch);
}

function mapStateToProps({selectsReducer, participants, contactsByClient}) {
    return {
        participants,
        selectsReducer,
        contactsByClient
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields: ["idContacto", "nameContacto", "contactoCliente", "cargoContacto", "estiloSocial", "actitudGrupo"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesCliente);
