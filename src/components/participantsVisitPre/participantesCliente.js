import React, {Component} from 'react';
import ListParticipantesCliente from './listParticipantesCliente';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, clearParticipants} from './actions';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {contactsByClientFindServer} from '../contact/actions';
import {NUMBER_CONTACTS} from './constants';
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
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_CONTACTS,"",0,"","","","");
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

    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
    .filter(participant => _.isEqual(participant.tipoParticipante, 'client'))
    .value();
    if( data.length === 10 ){
      disabledButtonCreate = 'disabled';
    }
    return(
      <div>
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
                disabled="disabled"
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
                disabled="disabled"
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={12} md={2} lg={2}>
            <div style={{paddingRight: "15px"}}>
              <dt><span>Actitud frente al grupo</span></dt>
              <Input
                name="actitudGrupo"
                {...actitudGrupo}
                placeholder="Actitud frente al grupo de la persona"
                disabled="disabled"
                parentId="dashboardComponentScroll"
              />
            </div>
          </Col>
          <Col xs={1} md={1} lg={1}>
            <button className="btn btn-primary" onClick={this._addParticipantClient} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante, máximo 10" style={{marginLeft:"17px", marginTop: "20px"}}>
              <i className="add user icon" style={{color: "white",margin:'0em', fontSize : '1.2em'}}></i>
            </button>
          </Col>
        </Row>
        {data.length > 0 ?
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListParticipantesCliente />
            </Col>
          </Row> :
          <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h4 className="form-item">Señor usuario, no se han adicionado participantes por parte del cliente.</h4>
          </div>
        }
        <SweetAlert
         type="error"
         show={this.state.showEmptyParticipant}
         title="Error participante"
         text="Señor usuario, para agregar un participante debe seleccionar un contacto"
         onConfirm={() => this.setState({showEmptyParticipant:false})}
         />
         <SweetAlert
          type="error"
          show={this.state.showParticipantExist}
          title="Participante existente"
          text="Señor usuario, el participante que desea agregar ya se encuentra en la lista"
          onConfirm={() => this.setState({showParticipantExist:false})}
          />
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
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
