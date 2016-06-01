import React, {Component} from 'react';
import ListParticipantesCliente from './listParticipantesCliente';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, deleteParticipant} from './actions';
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

class ParticipantesCliente extends Component{

  constructor(props) {
      super(props);
      this.state = {
        showEr: false
      }
      this._deleteParticipantClient = this._deleteParticipantClient.bind(this);
      this._addParticipantClient = this._addParticipantClient.bind(this);
      this._updateValue = this._updateValue.bind(this);
  }

  _addParticipantClient() {
      const {fields: { idContacto, contactoCliente, cargoContacto, estiloSocial, actitudGrupo }, addParticipant} = this.props;
      if( contactoCliente.value !== "" && contactoCliente.value !== null && contactoCliente.value !== undefined ){
        const uuid = _.uniqueId('participanClient_');
        var clientParticipant = {
          tipoParticipante: 'client',
          idParticipante: idContacto.value,
          nombreParticipante: contactoCliente.value,
          cargo: cargoContacto.value,
          empresa: '',
          estiloSocial: estiloSocial.value,
          actitudBanco: actitudGrupo.value,
          uuid,
        }
        addParticipant(clientParticipant);
        idContacto.onChange('');
        contactoCliente.onChange('');
        cargoContacto.onChange('');
        estiloSocial.onChange('');
        actitudGrupo.onChange('');
      } else {
        this.setState({
          showEr: true
        });
      }
  }

  componentWillMount(){
    const{contactsByClient, contactsByClientFindServer} = this.props;
    this.props.resetForm();
    const valuesContactsClient = contactsByClient.get('contacts');
    if( _.isEmpty(valuesContactsClient) || valuesContactsClient === null || valuesContactsClient === undefined ){
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"","","","");
    }
  }

  _updateValue(value){
    const{fields: {idContacto, contactoCliente, cargoContacto, estiloSocial, actitudGrupo}, contactsByClient} = this.props;
    var contactClient = contactsByClient.get('contacts');
    var contactSelected;
    _.map(contactClient, contact => {
      if( contact.id.toString() === value ){
        contactSelected = contact;
        return contact;
      }
    });
    idContacto.onChange(contactSelected.id);
    cargoContacto.onChange(contactSelected.contactPosition);
    estiloSocial.onChange(contactSelected.contactSocialStyle);
    actitudGrupo.onChange(contactSelected.contactActitudeCompany);
  }

  _deleteParticipantClient(index, e) {
      e.preventDefault();
      const {deleteParticipant} = this.props;
      deleteNote(index);
  }

  render(){
    const {fields: {
      contactoCliente, cargoContacto, estiloSocial, actitudGrupo
    }, error, handleSubmit, participants, contactsByClient, addParticipant} = this.props;
    return(
      <form onSubmit={handleSubmit(this._addParticipantClient)}>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
              <div className="InputAddOn">
                <ComboBox
                    name="txtContactoCliente"
                    {...contactoCliente}
                    onChange={val => this._updateValue(val)}
                    valueProp={'id'}
                    textProp={'nameComplet'}
                    data={contactsByClient.get('contacts')}
                />
              </div>
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
            <button className="btn btn-primary" onClick={this._addParticipantClient}
              type="button" title="Adicionar participante" style={{marginLeft:"17px", marginTop: "20px"}}>
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
         show={this.state.showEr}
         title="Debe seleccionar un contacto"
         text="Señor usuario para agregar un participante, debe seleccionar un contacto"
         onConfirm={() => this.setState({showEr:false})}
         />
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteParticipant,
        addParticipant,
        contactsByClientFindServer
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
  fields: ["idContacto", "contactoCliente", "cargoContacto", "estiloSocial", "actitudGrupo"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesCliente);
