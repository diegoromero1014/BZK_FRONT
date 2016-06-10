import React, {Component} from 'react';
import ListParticipantesBancolombia from './listParticipantesBancolombia';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import {addParticipant, clearParticipants, filterUsersBanco} from './actions';
import SweetAlert from 'sweetalert-react';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import {contactsByClientFindServer} from '../contact/actions';
import {NUMBER_CONTACTS} from './constants';
import {APP_URL} from '../../constantsGlobal';
import _ from 'lodash';
import $ from 'jquery';

const validate = values => {
    const errors = {}
    return errors
};

var usersBanco = [];
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
      this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantClient() {
    const {fields: { idUsuario, objetoUsuario, nameUsuario, cargoUsuario }, participants, addParticipant} = this.props;
    if( nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined &&
        idUsuario.value !== "" && idUsuario.value !== null && idUsuario.value !== undefined){
      var particip = participants.find(function(item){
        if(item.tipoParticipante === "banco"){
          return item.idParticipante === objetoUsuario.value.idUsuario;
        }
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

  updateKeyValueUsersBanco(e){
    const {fields: {objetoUsuario, nameUsuario, idUsuario, cargoUsuario}, filterUsersBanco} = this.props;
    if(e.keyCode == 13 || e.which == 13){
      e.preventDefault();
      if( nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined ){
        $('.ui.search.participantBanc').toggleClass('loading');
        filterUsersBanco(nameUsuario.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          $('.ui.search.participantBanc')
            .search({
              cache: false,
              source: usersBanco,
              searchFields: [
                'title',
                'description',
                'idUsuario',
                'cargo'
              ],
              onSelect : function(event) {
                  objetoUsuario.onChange(event);
                  nameUsuario.onChange(event.title);
                  idUsuario.onChange(event.idUsuario);
                  cargoUsuario.onChange(event.cargo);
                  return 'default';
              }
            });
            $('.ui.search.participantBanc').toggleClass('loading');
            $('#inputParticipantBanc').focus();
          }, (reason) => {
        });
      }
    }
  }

  _submitValores(){

  }

  render(){
    const {fields: {
      idUsuario, nameUsuario, cargoUsuario
    }, error, handleSubmit, participants, contactsByClient, addParticipant, disabled} = this.props;
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
      { disabled === '' || disabled === undefined ?
        <Row style={{padding: "0px 10px 0px 20px"}}>
          <Col xs={12} md={5.5} lg={5.5} style={{paddingRight: "20px"}}>
            <dt>
              <span>Nombre</span>
            </dt>
            <dt>
            <div className="ui search participantBanc fluid">
              <div className="ui icon input" style={{width: "100%"}}>
                <input className="prompt" id="inputParticipantBanc"
                  style={{borderRadius: "3px"}}
                  autoComplete="off"
                  type="text"
                  value={nameUsuario.value}
                  onChange={nameUsuario.onChange}
                  placeholder="Ingrese un criterio de búsqueda..."
                  onKeyPress={this.updateKeyValueUsersBanco}
                  onSelect={val => this._updateValue(val)}
                />
                <i className="search icon"></i>
              </div>
              <div className="results"></div>
            </div>
            </dt>
          </Col>
          <Col xs={12} md={5.5} lg={5.5}>
            <dt><span>Cargo</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtCargo"
                {...cargoUsuario}
                type="text"
                disabled='disabled'
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
        : ''}
        {data.length > 0 ?
          <Row style={{padding: "0px 10px 20px 20px"}}>
            <Col xs>
              <ListParticipantesBancolombia disabled={disabled}/>
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
        contactsByClientFindServer,
        filterUsersBanco
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
  fields: ["idUsuario", "nameUsuario", "objetoUsuario", "cargoUsuario"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesBancolombia);
