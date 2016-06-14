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
      this._addParticipantBanc = this._addParticipantBanc.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
      this._submitValores = this._submitValores.bind(this);
  }

  _addParticipantBanc() {
    const {fields: { idUsuario, objetoUsuario, nameUsuario, cargoUsuario, empresaUsuario }, participants, addParticipant} = this.props;
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
          cargo: cargoUsuario.value === null || cargoUsuario.value === undefined || cargoUsuario.value === '' ?
                  '' : ' - ' + cargoUsuario.value,
          empresa: empresaUsuario.value === null || empresaUsuario.value === undefined || empresaUsuario.value === '' ?
                  '' : ' - ' + empresaUsuario.value,
          estiloSocial: '',
          actitudBanco: '',
          fecha: Date.now(),
          uuid,
        }
        addParticipant(clientParticipant);
        idUsuario.onChange('');
        nameUsuario.onChange('');
        cargoUsuario.onChange('');
        empresaUsuario.onChange('');
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
    var userSelected;
    _.map(contactClient, contact => {
      if( contact.id.toString() === value ){
        userSelected = contact;
        return contact;
      }
    });
    if( userSelected !== null && userSelected !== undefined ){
      idUsuario.onChange(userSelected.id);
      nameUsuario.onChange(userSelected.nameComplet);
      cargoUsuario.onChange(userSelected.contactPosition);
      empresaUsuario.onChange(userSelected.company);
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
    const {fields: {objetoUsuario, nameUsuario, idUsuario, cargoUsuario, empresaUsuario}, filterUsersBanco} = this.props;
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
                  empresaUsuario.onChange(event.empresa);
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
      idUsuario, nameUsuario, cargoUsuario, empresaUsuario
    }, error, handleSubmit, participants, contactsByClient, addParticipant, disabled} = this.props;
    var numColumnList = 6;
    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
    .filter(participant => _.isEqual(participant.tipoParticipante, 'banco'))
    .value();

    if( data.length === 10 ){
      disabledButtonCreate = 'disabled';
    } else {
      disabledButtonCreate = '';
    }
    if(disabled === "disabled"){
      numColumnList = 12;
    }
    return(
      <div>
        <Row style={{padding: "0px 10px 0px 20px"}}>
        { disabled === '' || disabled === undefined ?
          <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
            <Col xs={12} md={12} lg={12}>
              <dt><span>Nombre (<span style={{color: "red"}}>*</span>)</span></dt>
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
            <Row style={{padding: "5px 10px 0px 10px"}}>
              <Col xs={12} md={6} lg={6} style={{paddingTop: "5px"}}>
                <dt><span>Cargo</span></dt>
                <dt>
                  <Input
                    name="txtCargo"
                    {...cargoUsuario}
                    type="text"
                    disabled='disabled'
                  />
                </dt>
              </Col>
              <Col xs={12} md={6} lg={6} style={{paddingTop: "5px"}}>
                <dt><span>Empresa</span></dt>
                <dt>
                  <Input
                    name="txtEmpresa"
                    {...empresaUsuario}
                    type="text"
                    disabled='disabled'
                  />
                </dt>
              </Col>
            </Row>
          <Row style={{paddingLeft: "10px"}}>
            <Col xs={12} md={5} lg={5}>
              <button className="btn btn-primary" onClick={this._addParticipantBanc} disabled={disabledButtonCreate}
              type="button" title="Adicionar participante, máximo 10" style={{marginTop: "20px"}}>
                Agregar participante
              </button>
            </Col>
          </Row>
        </Col>
        : ''}
        {data.length > 0 ?
          <Col xs={12} md={numColumnList} lg={numColumnList} style={{paddingLeft: "5px", paddingTop: "10px"}}>
            <ListParticipantesBancolombia disabled={disabled}/>
          </Col> :
          <Col xs={12} md={numColumnList} lg={numColumnList}>
            <div style={{textAlign:"center", marginTop:"20px", marginBottom:"20px"}}>
              <span className="form-item">Aún no se han adicionado participantes</span>
            </div>
          </Col>
        }
      </Row>
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
  fields: ["idUsuario", "nameUsuario", "objetoUsuario", "cargoUsuario", "empresaUsuario"],
  validate
}, mapStateToProps, mapDispatchToProps)(ParticipantesBancolombia);
