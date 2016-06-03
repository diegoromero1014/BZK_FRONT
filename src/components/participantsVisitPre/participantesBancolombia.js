import React, {Component} from 'react';
import ListParticipantesBancolombia from './listParticipantesBancolombia';
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
class ParticipantesBancolombia extends Component{

  constructor(props) {
      super(props);
      this.state = {
        showEmptyParticipantBanco: false,
        showParticipantExistBanco: false
      }
      this._addParticipantClient = this._addParticipantClient.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantClient() {
    const {fields: { idUsuario, nameUsuario, cargoUsuario }, participants, addParticipant} = this.props;
    if( idUsuario.value !== "" && idUsuario.value !== null && idUsuario.value !== undefined ){
      var particip = participants.find(function(item){
        return item.idParticipante === idUsuario.value;
      });
      if( particip === undefined ){
        const uuid = _.uniqueId('participanBanco_');
        var clientParticipant = {
          tipoParticipante: 'banco',
          idParticipante: idUsuario.value,
          nombreParticipante: nameUsuario.value,
          cargo: cargoUsuario.value,
          empresa: '',
          estiloSocial: '',
          actitudBanco: '',
          fecha: Date.now(),
          uuid,
        }
        addParticipant(clientParticipant);
        idUsuario.onChange('');
        nameUsuario.onChange('');
        cargoUsuario.onChange('');
      } else {
        this.setState({
          showParticipantExistBanco: true
        });
      }
    } else {
      this.setState({
        showEmptyParticipantBanco: true
      });
    }
  }

  _updateValue(value){
    const{fields: {idUsuario, nameUsuario, cargoUsuario}, contactsByClient} = this.props;
    var contactClient = contactsByClient.get('contacts');
    var contactSelected;
    _.map(contactClient, contact => {
      if( contact.id.toString() === value ){
        contactSelected = contact;
        return contact;
      }
    });
    if( contactSelected !== null && contactSelected !== undefined ){
      idUsuario.onChange(contactSelected.id);
      nameUsuario.onChange(contactSelected.nameComplet);
      cargoUsuario.onChange(contactSelected.contactPosition);
    }
  }

  componentWillMount(){
    const{clearParticipants, contactsByClient, contactsByClientFindServer} = this.props;
    clearParticipants();
    this.props.resetForm();
    const valuesContactsClient = contactsByClient.get('contacts');
    if( _.isEmpty(valuesContactsClient) || valuesContactsClient === null || valuesContactsClient === undefined ){
      contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_CONTACTS,"",0,"","","","");
    }
  }

  _submitValores(){

  }

  render(){
    const {fields: {
      idUsuario, nameUsuario, cargoUsuario
    }, error, handleSubmit, participants, contactsByClient, addParticipant} = this.props;
    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
    .filter(participant => _.isEqual(participant.tipoParticipante, 'banco'))
    .value();

    if( data.length === 10 ){
      disabledButtonCreate = 'disabled';
    }
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={5.5} lg={5.5} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
              <ComboBox
                name="txtClienteBanco"
                labelInput="Seleccione..."
                {...idUsuario}
                onChange={val => this._updateValue(val)}
                valueProp={'id'}
                textProp={'nameComplet'}
                data={contactsByClient.get('contacts')}
            />
            </dt>
          </Col>
          <Col xs={12} md={5.5} lg={5.5}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                type="text"
                disabled='disabled'
                {...cargoUsuario}
                placeholder="Cargo de la persona"
              />
            </dt>
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
              <ListParticipantesBancolombia />
            </Col>
          </Row> :
          <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
            <h4 className="form-item">Señor usuario, no se han adicionado participantes por parte del Grupo Bancolombia.</h4>
          </div>
        }
        <SweetAlert
         type="error"
         show={this.state.showEmptyParticipantBanco}
         title="Error participante"
         text="Señor usuario, para agregar un participante debe seleccionar un usuario del banco"
         onConfirm={() => this.setState({showEmptyParticipantBanco:false})}
         />
         <SweetAlert
          type="error"
          show={this.state.showParticipantExistBanco}
          title="Participante existente"
          text="Señor usuario, el participante que desea agregar ya se encuentra en la lista"
          onConfirm={() => this.setState({showParticipantExistBanco:false})}
          />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addParticipant,
        clearParticipants,
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
  fields: ["idUsuario", "nameUsuario", "cargoUsuario"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesBancolombia);
