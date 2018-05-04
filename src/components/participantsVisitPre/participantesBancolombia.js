import React, { Component } from 'react';
import ListParticipantesBancolombia from './listParticipantesBancolombia';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Input from '../../ui/input/inputComponent';
import ComboBox from '../../ui/comboBox/comboBoxComponent';
import Textarea from '../../ui/textarea/textareaComponent';
import { addParticipant, clearParticipants, filterUsersBanco } from './actions';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { contactsByClientFindServer } from '../contact/actions';
import { NUMBER_CONTACTS, KEY_PARTICIPANT_BANCO } from './constants';
import { APP_URL, 
  VALUE_XSS_INVALID,
  REGEX_SIMPLE_XSS, REGEX_SIMPLE_XSS_STRING, REGEX_SIMPLE_XSS_MESAGE, REGEX_SIMPLE_XSS_MESAGE_SHORT } from '../../constantsGlobal';
import { validateValue, validateValueExist, validateIsNullOrUndefined, xssValidation } from '../../actionsGlobal';
import _ from 'lodash';
import $ from 'jquery';
import { swtShowMessage } from '../sweetAlertMessages/actions';

var self;
const validate = values => {
  const errors = {}
  return errors
};

var usersBanco = [];
var disabledButtonCreate = '';
class ParticipantesBancolombia extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showEmptyParticipantBanco: false,
      showParticipantExistBanco: false,
      validateConsultParticipants: false,
      showInvalidCharacter: false,
    }
    this._addParticipantBanc = this._addParticipantBanc.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
  }

  _addParticipantBanc() {
    const { fields: { idUsuario, objetoUsuario, nameUsuario, cargoUsuario, empresaUsuario }, participants, addParticipant, swtShowMessage } = this.props;
    if (validateValue(nameUsuario.value) && !(validateIsNullOrUndefined(idUsuario.value) || idUsuario.value <= 0)) {
      var particip = participants.find(function (item) {
        if (item.tipoParticipante === KEY_PARTICIPANT_BANCO) {
          return item.idParticipante === objetoUsuario.value.idUsuario;
        }
      });
      if (xssValidation(nameUsuario.value)) {
        swtShowMessage('error',"Error participante",REGEX_SIMPLE_XSS_MESAGE);
        return;
      }
      if (particip === undefined) {
        const uuid = _.uniqueId('participanBanco_');
        var clientParticipant = {
          tipoParticipante: KEY_PARTICIPANT_BANCO,
          idParticipante: idUsuario.value,
          nombreParticipante: nameUsuario.value,
          cargo: !validateValueExist(cargoUsuario.value) ? '' : ' - ' + cargoUsuario.value,
          empresa: !validateValueExist(empresaUsuario.value) ? '' : ' - ' + empresaUsuario.value,
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
        swtShowMessage('error',"Participante existente","Señor usuario, el participante que desea agregar ya se encuentra en la lista");

      }
    } else {
        swtShowMessage('error',"Error participante","Señor usuario, para agregar un participante debe seleccionar un usuario del banco");
    }
  }

  _updateValue(value) {

    const { fields: { idUsuario, nameUsuario, cargoUsuario }, contactsByClient } = this.props;
    var contactClient = contactsByClient.get('contacts');
    var userSelected;
    _.map(contactClient, contact => {
      if (contact.id.toString() === value) {
        userSelected = contact;
        return contact;
      }
    });
    if (validateValue(userSelected)) {
      idUsuario.onChange(userSelected.id);
      nameUsuario.onChange(userSelected.nameComplet);
      cargoUsuario.onChange(userSelected.contactPosition);
      empresaUsuario.onChange(userSelected.company);
    } else {

      if (idUsuario.value > 0 ) {
        idUsuario.onChange('');
      }

    }
  }

  componentWillMount() {
    const { clearParticipants, contactsByClient, contactsByClientFindServer } = this.props;
    clearParticipants();
    this.props.resetForm();
    const valuesContactsClient = contactsByClient.get('contacts');
    if (_.isEmpty(valuesContactsClient) || valuesContactsClient === null || valuesContactsClient === undefined) {
      contactsByClientFindServer(0, window.sessionStorage.getItem('idClientSelected'), NUMBER_CONTACTS, "", 0, "", "", "", "");
    }
  }

  componentDidMount() {
    self = this;
    $("#iconSearchParticipants").click(function () {
      var e = { keyCode: 13, consultclick: true };
      self.updateKeyValueUsersBanco(e);
    });
  }

  componentWillUpdate() {
    self = this;
    $("#iconSearchParticipants").click(function () {
      var e = { keyCode: 13, consultclick: true };
      self.updateKeyValueUsersBanco(e);
    });
  }

  updateKeyValueUsersBanco(e) {
    const { fields: { objetoUsuario, nameUsuario, idUsuario, cargoUsuario, empresaUsuario }, filterUsersBanco, swtShowMessage } = this.props;
    const selfThis = this;
    if (e.keyCode === 13 || e.which === 13) {
      e.consultclick ? "" : e.preventDefault();
      if (nameUsuario.value !== "" && nameUsuario.value.length >= 3 && nameUsuario.value !== null && nameUsuario.value !== undefined) {
        $('.ui.search.participantBanc').toggleClass('loading');
        filterUsersBanco(nameUsuario.value).then((data) => {
          usersBanco = _.get(data, 'payload.data.data');
          $('.ui.search.participantBanc')
            .search({
              cache: false,
              source: usersBanco,
              maxResults: 1500,
              searchFields: [
                'title',
                'description',
                'idUsuario',
                'cargo'
              ],
              onSelect: function (event) {
                objetoUsuario.onChange(event);
                nameUsuario.onChange(event.title);
                idUsuario.onChange(event.idUsuario);
                cargoUsuario.onChange(event.cargo);
                empresaUsuario.onChange(event.empresa);
                return 'default';
              }
            });
          $('.ui.search.participantBanc').toggleClass('loading');
          setTimeout(function () {
            $('#inputParticipantBanc').focus();
          }, 150);
        });
      } else {
        if (nameUsuario.value.length <=3) {
          swtShowMessage('error','Error','Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
        }
      }
    }
  }

  render() {
    const { fields: {
      idUsuario, nameUsuario, cargoUsuario, empresaUsuario
    }, error, handleSubmit, participants, contactsByClient, addParticipant, disabled } = this.props;
    var numColumnList = 6;
    var data = _.chain(participants.toArray()).map(participant => {
      return participant;
    })
      .filter(participant => _.isEqual(participant.tipoParticipante, KEY_PARTICIPANT_BANCO))
      .value();

    if (data.length === 10) {
      disabledButtonCreate = 'disabled';
    } else {
      disabledButtonCreate = '';
    }
    if (disabled === "disabled") {
      numColumnList = 12;
    }

    return (
      <div>
        <Row style={{ padding: "0px 10px 0px 20px" }}>
          {disabled === '' || disabled === undefined ?
            <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Nombre (<span style={{ color: "red" }}>*</span>)</span></dt>
                <dt>
                  <div className="ui dropdown search participantBanc fluid" style={{ border: "0px", zIndex: "1", padding: "0px" }}>
                    <div className="ui icon input" style={{ width: "100%", pointerEvents: 'auto !important' }}>
                      <input className="prompt" id="inputParticipantBanc"
                        style={{ borderRadius: "3px" }}
                        autoComplete="off"
                        type="text"
                        value={nameUsuario.value}
                        onChange={nameUsuario.onChange}
                        placeholder="Ingrese un criterio de búsqueda..."
                        onKeyPress={this.updateKeyValueUsersBanco}
                        onSelect={val => this._updateValue(val)}
                      />
                      <i className="search icon" id="iconSearchParticipants"></i>
                    </div>
                    <div className="menu results"></div>
                  </div>
                </dt>
              </Col>
              <Row style={{ padding: "5px 10px 0px 10px" }}>
                <Col xs={12} md={6} lg={6} style={{ paddingTop: "5px" }}>
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
                <Col xs={12} md={6} lg={6} style={{ paddingTop: "5px" }}>
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
              <Row style={{ paddingLeft: "10px" }}>
                <Col xs={12} md={5} lg={5}>
                  <button className="btn btn-primary" onClick={this._addParticipantBanc} disabled={disabledButtonCreate}
                    type="button" title="Adicionar participante, máximo 10" style={{ marginTop: "20px" }}>
                    <i className="white plus icon" /> Agregar participante
              </button>
                </Col>
              </Row>
            </Col>
            : ''}
          {data.length > 0 ?
            <Col xs={12} md={numColumnList} lg={numColumnList} style={{ paddingLeft: "5px", paddingTop: "10px" }}>
              <ListParticipantesBancolombia disabled={disabled} />
            </Col> :
            <Col xs={12} md={numColumnList} lg={numColumnList}>
              <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                <span className="form-item">Aún no se han adicionado participantes</span>
              </div>
            </Col>
          }
        </Row>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addParticipant,
    clearParticipants,
    contactsByClientFindServer,
    filterUsersBanco,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ selectsReducer, participants, contactsByClient }) {
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
