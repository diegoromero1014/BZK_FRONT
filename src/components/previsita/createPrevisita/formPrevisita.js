import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import {PREVISIT_TYPE} from '../../selectsComponent/constants';
import {consultDataSelect, consultList, getMasterDataFields} from '../../selectsComponent/actions';
import ParticipantesCliente from '../../participantsVisitPre/participantesCliente';
import ParticipantesBancolombia from '../../participantsVisitPre/participantesBancolombia';
import ParticipantesOtros from '../../participantsVisitPre/participantesOtros';
import {SAVE_DRAFT, SAVE_PUBLISHED, TITLE_CONCLUSIONS_VISIT, TITLE_OTHERS_PARTICIPANTS,
  TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS, MESSAGE_SAVE_DATA} from '../../../constantsGlobal';
import {consultParameterServer, formValidateKeyEnter, nonValidateEnter} from '../../../actionsGlobal';
import {PROPUEST_OF_BUSINESS, LAST_PREVISIT_REVIEW} from '../constants';
import {createPrevisit} from '../actions';
import Challenger from '../../methodologyChallenger/component';
import {changeStateSaveData} from '../../dashboard/actions';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import $ from 'jquery';

const fields = [];
var datePrevisitLastReview;
var titleMethodologyChallenger = "Enseñanza (Oportunidades – Retos): Diligencie de manera resumida los siguientes " +
      "campos. Recuerde que lo importante es la necesidad del cliente, por lo cual no debe hablar de Bancolombia hasta cuando se expone la solución a la situación del cliente.\n" +
      "No es necesario haber asistido previamente a la formación Challenger, el formato entrega las herramientas necesarias para su construcción.";

var titleMessagePendient = "En este campo se deberá registrar los pendientes quejas o reclamos que tenga el cliente y que podrán ser motivo de conversación en la reunión.";

var titleMessageTarget = "En este campo deberá registrar de manera clara cual es propósito de la reunión.\n\n" +
      "Si el tipo de visita es “propuesta comercial”, antes de responder deberá hacerse  las siguientes preguntas y/o reflexiones:\n\n" +
      "1. ¿Cuál es el insight (enseñanza) que desea llevarle al cliente?\n" +
      "a. ¿Por qué esta enseñanza hará pensar de manera distinta al cliente?\n" +
      "b. ¿Cómo crees que esta enseñanza llevará al cliente a la acción?\n" +
      "c. ¿Cómo esta enseñanza conduce hacia una solución que tiene el Grupo Bancolombia?\n\n" +
      "2. ¿Cuáles son los resultados esperados y en cuánto tiempo se verán materializados?";

var titleMessageTypePrevisit = "En este campo se deberá indicar la razón de la visita si es: seguimiento (mantenimiento de la relación con el cliente) o propuesta comercial (cuando lleva un insight o enseñanza al cliente).\n" +
            "Si el tipo de visita es propuesta comercial, se deberá responder la sección Metodología Challenger.";

var dateVisitLastReview;
var showMessageCreatePreVisit= false;
var typeMessage = "success";
var titleMessage = "";
var message = "";
var typeButtonClick;
var valueTypePrevisit = null;
var idTypeVisitAux = null;
var idTypeVisitAuxTwo = null;
var contollerErrorChangeType = false;

const validate = values => {
    const errors = {};
    return errors;
};

class FormPrevisita extends Component{

  constructor(props) {
    super(props);
    this.state = {
      showErrorSavePreVisit: false,
      typePreVisit: "",
      typePreVisitError: null,
      datePreVisit: new Date(),
      datePreVisitError: null,
      lugarPrevisit: "",
      lugarPrevisitError: false,
      showConfirm: false,
      showConfirmChangeTypeVisit: false,
      activeItemTabBanc: '',
      activeItemTabClient: 'active',
      activeItemTabOther: '',
      targetPrevisit: "",
      targetPrevisitError : null,
      pendingPrevisit: "",
      acondicionamiento: "",
      acondicionamientoTouch: false,
      acondicionamientoError: "",
      replanteamiento: "",
      replanteamientoTouch: false,
      replanteamientoError: "",
      ahogamiento: "",
      ahogamientoTouch: false,
      ahogamientoError: "",
      impacto: "",
      impactoTouch: false,
      impactoError: "",
      nuevoModo: "",
      nuevoModoTouch: false,
      nuevoModoError: "",
      nuestraSolucion: "",
      nuestraSolucionTouch: false,
      nuestraSolucionError: "",
    }
    this._submitCreatePrevisita = this._submitCreatePrevisita.bind(this);
    this._changeTypePreVisit = this._changeTypePreVisit.bind(this);
    this._changeDatePreVisit = this._changeDatePreVisit.bind(this);
    this._closeMessageCreatePreVisit = this._closeMessageCreatePreVisit.bind(this);
    this._onCloseButton = this._onCloseButton.bind(this);
    this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
    this._changeTargetPrevisit = this._changeTargetPrevisit.bind(this);
    this._changePendingPrevisit = this._changePendingPrevisit.bind(this);
    this._changeAcondicionamiento = this._changeAcondicionamiento.bind(this);
    this._changeAhogamiento = this._changeAhogamiento.bind(this);
    this._changeReplanteamiento = this._changeReplanteamiento.bind(this);
    this._changeImpacto = this._changeImpacto.bind(this);
    this._changeNuevoModo = this._changeNuevoModo.bind(this);
    this._changeNuestraSolucion = this._changeNuestraSolucion.bind(this);
    this._changeLugarPreVisit = this._changeLugarPreVisit.bind(this);
    this._closeConfirmChangeType = this._closeConfirmChangeType.bind(this);
    this._closeCancelConfirmChanType = this._closeCancelConfirmChanType.bind(this);
  }

  _closeMessageCreatePreVisit(){
    if( typeMessage === "success" ){
      this.setState({
        showMessageCreatePreVisit: false,
        dateVisit: ""
      });
      redirectUrl("/dashboard/clientInformation");
    } else {
      this.setState({
        showMessageCreatePreVisit: false
      });
    }
  }

  _changeTypePreVisit(value){
      if( value !== undefined && value !== "" && value !== null && value !== idTypeVisitAuxTwo && !contollerErrorChangeType ){
        if( idTypeVisitAux !== null && valueTypePrevisit !== null && valueTypePrevisit === PROPUEST_OF_BUSINESS ){
          contollerErrorChangeType = true;
          idTypeVisitAux = value;
          this.setState({
            showConfirmChangeTypeVisit: true
          });
        } else {
          contollerErrorChangeType = true;
          idTypeVisitAux = value;
          this._closeConfirmChangeType();
        }
      }
      var lugarSelector = $('.txtLugar');
      var input = lugarSelector.find("input");
      input.focus();
  }

  _closeCancelConfirmChanType(){
    contollerErrorChangeType = false;
    this.setState({showConfirmChangeTypeVisit: false });
  }

  _closeConfirmChangeType(){
    contollerErrorChangeType = false;
    const {selectsReducer} = this.props;
    idTypeVisitAuxTwo = idTypeVisitAux;
    const typeSeleted = _.filter(selectsReducer.get(PREVISIT_TYPE), ['id', parseInt(idTypeVisitAux)]);
    if(typeSeleted !== null && typeSeleted !== '' && typeSeleted !== undefined){
      valueTypePrevisit = typeSeleted[0].key;
    }
    this.setState({
      typePreVisit: parseInt(idTypeVisitAux),
      showConfirmChangeTypeVisit: false,
      typePreVisitError: null,
      acondicionamiento: "",
      acondicionamientoTouch: false,
      acondicionamientoError: "",
      replanteamiento: "",
      replanteamientoTouch: false,
      replanteamientoError: "",
      ahogamiento: "",
      ahogamientoTouch: false,
      ahogamientoError: "",
      impacto: "",
      impactoTouch: false,
      impactoError: "",
      nuevoModo: "",
      nuevoModoTouch: false,
      nuevoModoError: "",
      nuestraSolucion: "",
      nuestraSolucionTouch: false,
      nuestraSolucionError: "",
    });
  }

  _changeDatePreVisit(value){
    this.setState({
      datePreVisit: value,
      datePreVisitError: null
    });
  }

  _changeDatePreVisitOnBlur(value){
    var date = value.target.value;
    if(date === '' || date === undefined || date === null){
      this.setState({
        dateVisitError: "Debe seleccionar una opción"
      });
    }
  }

  _changeLugarPreVisit(value){
    this.setState({
      lugarPrevisit: value,
      lugarPrevisitError: null
    });
  }

  _changeTargetPrevisit(value){
    this.setState({
      targetPrevisit: value.target.value,
      targetPrevisitError: null
    });
  }

  _changePendingPrevisit(value){
    this.setState({
      pendingPrevisit: value.target.value
    });
  }

  _changeAcondicionamiento(value){
    this.setState({
      acondicionamiento: value.target.value,
      acondicionamientoTouch: true,
      acondicionamientoError: null
    });
  }

  _changeReplanteamiento(value){
    this.setState({
      replanteamiento: value.target.value,
      replanteamientoTouch: true,
      replanteamientoError: null
    });
  }

  _changeAhogamiento(value){
    this.setState({
      ahogamiento: value.target.value,
      ahogamientoTouch: true,
      ahogamientoError: null
    });
  }

  _changeImpacto(value){
    this.setState({
      impacto: value.target.value,
      impactoTouch: true,
      impactoError: null
    });
  }

  _changeNuevoModo(value){
    this.setState({
      nuevoModo: value.target.value,
      nuevoModoTouch: true,
      nuevoModoError: null
    });
  }

  _changeNuestraSolucion(value){
    this.setState({
      nuestraSolucion: value.target.value,
      nuestraSolucionTouch: true,
      nuestraSolucionError: null
    });
  }

  _clickSeletedTab(tab){
    if( tab === 1 ){
      this.setState({
        activeItemTabClient: 'active',
        activeItemTabBanc: '',
        activeItemTabOther: ''
      });
    } else if( tab === 2 ){
      this.setState({
        activeItemTabClient: '',
        activeItemTabBanc: 'active',
        activeItemTabOther: ''
      });
    } else {
      this.setState({
        activeItemTabBanc: '',
        activeItemTabClient: '',
        activeItemTabOther: 'active'
      });
    }
  }

  _onCloseButton(){
    message = "¿Está seguro que desea salir de la pantalla de creación de previsita?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  _closeConfirmCloseVisit(){
    this.setState({showConfirm: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _submitCreatePrevisita(){
    const {participants, createPrevisit, changeStateSaveData} = this.props;
    var errorInForm = false;
    if( this.state.typePreVisit === null || this.state.typePreVisit === undefined || this.state.typePreVisit === "" ){
      errorInForm = true;
      this.setState({
        typePreVisitError: "Debe seleccionar una opción"
      });
    }
    if( this.state.datePreVisit === null || this.state.datePreVisit === undefined || this.state.datePreVisit === "" ){
      errorInForm = true;
      this.setState({
        datePreVisitError: "Debe seleccionar una opción"
      });
    }
    if( this.state.lugarPrevisit === null || this.state.lugarPrevisit === undefined || this.state.lugarPrevisit === "" ){
      errorInForm = true;
      this.setState({
        lugarPrevisitError: "Debe ingresar un valor"
      });
    }

    if( typeButtonClick === SAVE_PUBLISHED ){
      if( this.state.targetPrevisit === null || this.state.targetPrevisit === undefined || this.state.targetPrevisit === "" ){
        errorInForm = true;
        this.setState({
          targetPrevisitError: "Debe ingresar un valor"
        });
      }
    }

    //Validaciones de la metodología challenger y si estoy guardando como definitivo
    if( valueTypePrevisit === PROPUEST_OF_BUSINESS && typeButtonClick === SAVE_PUBLISHED){
      if( this.state.acondicionamiento === null || this.state.acondicionamiento === undefined || this.state.acondicionamiento === "" ){
        errorInForm = true;
        this.setState({
          acondicionamientoError: "Debe ingresar un valor",
          acondicionamientoTouch: true
        });
      }
      if( this.state.replanteamiento === null || this.state.replanteamiento === undefined || this.state.replanteamiento === "" ){
        errorInForm = true;
        this.setState({
          replanteamientoError: "Debe ingresar un valor",
          replanteamientoTouch: true
        });
      }
      if( this.state.ahogamiento === null || this.state.ahogamiento === undefined || this.state.ahogamiento === "" ){
        errorInForm = true;
        this.setState({
          ahogamientoError: "Debe ingresar un valor",
          ahogamientoTouch: true
        });
      }
      if( this.state.impacto === null || this.state.impacto === undefined || this.state.impacto === "" ){
        errorInForm = true;
        this.setState({
          impactoError: "Debe ingresar un valor",
          impactoTouch: true
        });
      }
      if( this.state.nuevoModo === null || this.state.nuevoModo === undefined || this.state.nuevoModo === "" ){
        errorInForm = true;
        this.setState({
          nuevoModoError: "Debe ingresar un valor",
          nuevoModoTouch: true
        });
      }
      if( this.state.nuestraSolucion === null || this.state.nuestraSolucion === undefined || this.state.nuestraSolucion === "" ){
        errorInForm = true;
        this.setState({
          nuestraSolucionError: "Debe ingresar un valor",
          nuestraSolucionTouch: true
        });
      }
    } else {
      this.setState({
        acondicionamientoError: null,
        replanteamientoError: null,
        ahogamientoError: null,
        impactoError: null,
        nuevoModoError: null,
        nuestraSolucionError: null
      });
    }
    if( !errorInForm ){
      var dataBanco =[];
      _.map(participants.toArray(),
        function(participant){
          if( participant.tipoParticipante === "banco" ){
            var data = {
              "id": null,
              "employee": participant.idParticipante
            }
            dataBanco.push(data)
          }
        }
      );
      if( dataBanco.length > 0 && dataBanco[0] === undefined ){
        dataBanco = [];
      }
      var dataClient = [];
      _.map(participants.toArray(),
        function(participant){
          if(participant.tipoParticipante === "client"){
            var data = {
              "id": null,
              "contact": participant.idParticipante
            }
            dataClient.push(data);
          }
        }
      );
      if( dataClient.length > 0 && dataClient[0] === undefined ){
        dataClient = [];
      }
      //Valido que haya por los menos 1 usuairo por parte del banco o si
      //la previsita se está guardando como borrador
      if( (dataBanco.length > 0) || typeButtonClick === SAVE_DRAFT ){
        var dataOthers = [];
        _.map(participants.toArray(),
          function(participant){
            if(participant.tipoParticipante === "other" ){
              var data = {
                "id": null,
                "name": participant.nombreParticipante.replace('-', '').trim(),
                "position": participant.cargo.replace('-', '').trim(),
                "company": participant.empresa.replace('-', '').trim()
              }
              dataOthers.push(data);
            }
          }
        );
        if( dataOthers.length > 0 && dataOthers[0] === undefined ){
          dataOthers = [];
        }
        var previsitJson = {
          "id": null,
          "client": window.localStorage.getItem('idClientSelected'),
          "visitTime": parseInt(moment(this.state.datePreVisit).format('x')),
          "participatingContacts": dataClient.length === 0 ? null : dataClient,
          "participatingEmployees": dataBanco.length === 0 ? null : dataBanco,
          "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
          "principalObjective": this.state.targetPrevisit,
          "documentType": this.state.typePreVisit,
          "visitLocation": this.state.lugarPrevisit,
          "observations": this.state.pendingPrevisit,
          "conditioning": this.state.acondicionamiento,
          "rethinking": this.state.replanteamiento,
          "rationalDrowning": this.state.ahogamiento,
          "emotionalImpact": this.state.impacto,
          "newWay": this.state.nuevoModo,
          "ourSolution": this.state.nuestraSolucion,
          "documentStatus": typeButtonClick
        }
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createPrevisit(previsitJson).then((data)=> {
          changeStateSaveData(false, "");
          if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false' ){
            redirectUrl("/login");
          } else {
            if( (_.get(data, 'payload.data.status') === 200) ){
              typeMessage = "success";
              titleMessage = "Creación previsita";
              message = "Señor usuario, la previsita se creó de forma exitosa.";
              this.setState({showMessageCreatePreVisit :true});
            } else {
              typeMessage = "error";
              titleMessage = "Creación previsita";
              message = "Señor usuario, ocurrió un error creando la previsita.";
              this.setState({showMessageCreatePreVisit :true});
            }
          }
        }, (reason) =>{
          changeStateSaveData(false, "");
          typeMessage = "error";
          titleMessage = "Creación previsita";
          message = "Señor usuario, ocurrió un error creando la previsita.";
          this.setState({showMessageCreateVisit :true});
        });
      } else {
        this.setState({showErrorSavePreVisit :true});
      }
    } else {
      typeMessage = "error";
      titleMessage = "Campos obligatorios";
      message = "Señor usuario, debe ingresar todos los campos obligatorios.";
      this.setState({showMessageCreatePreVisit :true});
    }
  }

  componentWillMount(){
    valueTypePrevisit = null;
    idTypeVisitAux = null;
    idTypeVisitAuxTwo = null;
    contollerErrorChangeType = false;
    const {nonValidateEnter, clientInformacion, getMasterDataFields, consultParameterServer} = this.props;
    nonValidateEnter(true);
    const infoClient = clientInformacion.get('responseClientInfo');
    valueTypePrevisit = null;
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([PREVISIT_TYPE]);
      consultParameterServer(LAST_PREVISIT_REVIEW).then((data)=> {
        if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
          data.payload.data.parameter !== undefined ){
          datePrevisitLastReview = JSON.parse(data.payload.data.parameter).value;
          datePrevisitLastReview = moment(datePrevisitLastReview, "YYYY/DD/MM").locale('es').format("DD MMM YYYY");
        }
      });
    }
  }

  render(){
    const { fields:{acondicionamiento, replanteamiento, ahogamiento, impacto, nuevoModo, nuestraSolucion},
      clientInformacion, selectsReducer, handleSubmit, reducerGlobal} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitCreatePrevisita)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "20px"}}/>
              <span style={{fontSize: "20px"}}> Datos de visita</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
        <Col xs={6} md={3} lg={3}>
          <div style={{paddingRight: "15px"}}>
            <dt>
              <span>Tipo de visita (</span><span style={{color: "red"}}>*</span>)
              <i className="help circle icon blue" style={{fontSize: "15px", cursor: "pointer", marginLeft: "5px"}} title={titleMessageTypePrevisit}/>
            </dt>
            <ComboBox
              name="tipoVisita"
              labelInput="Seleccione..."
              valueProp={'id'}
              textProp={'value'}
              value={this.state.typePreVisit}
              touched={true}
              error={this.state.typePreVisitError}
              onChange={val => this._changeTypePreVisit(val)}
              onBlur={() => ''}
              parentId="dashboardComponentScroll"
              data={selectsReducer.get(PREVISIT_TYPE) || []}
            />
          </div>
        </Col>
          <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY hh:mm a"}
                time={true}
                value={this.state.datePreVisit}
                touched={true}
                error={this.state.datePreVisitError}
                onChange={val => this._changeDatePreVisit(val)}
                onBlur={val => this._changeDatePreVisitOnBlur(val)}/>
            </dt>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <dt><span>Lugar (</span><span style={{color: "red"}}>*</span>)</dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                value={this.state.lugarPrevisit}
                touched={true}
                error={this.state.lugarPrevisitError}
                name="txtLugar"
                type="text"
                title="La longitud máxima de caracteres es de 150"
                max="150"
                onChange={val => this._changeLugarPreVisit(val)}
              />
            </dt>
          </Col>
        </Row>

        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs>
            <div className="ui top attached tabular menu" style={{width:"100%"}}>
              <a className={`${this.state.activeItemTabClient} item`} style={{width:"33%"}}
                data-tab="first" onClick={this._clickSeletedTab.bind(this, 1)}>Participantes en la reunión por parte del cliente
                <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_CLIENT_PARTICIPANTS}/>
              </a>
              <a className={`${this.state.activeItemTabBanc} item`} style={{width:"40%"}}
                data-tab="second" onClick={this._clickSeletedTab.bind(this, 2)}>Participantes en la reunión por parte del Grupo Bancolombia
                <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_BANC_PARTICIPANTS}/>
              </a>
              <a className={`${this.state.activeItemTabOther} item`} style={{width:"26%"}}
                data-tab="third" onClick={this._clickSeletedTab.bind(this, 3)}>Otros participantes en la reunión
                <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_OTHERS_PARTICIPANTS}/>
              </a>
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabClient} tab segment`} data-tab="first">
                <ParticipantesCliente />
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabBanc} tab segment`} data-tab="second">
                <ParticipantesBancolombia />
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabOther} tab segment`} data-tab="third">
                <ParticipantesOtros />
            </div>
          </Col>
        </Row>

        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Objetivo de la reunión (<span style={{color: "red"}}>*</span>)</span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={titleMessageTarget}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <Textarea
              name="targetPrevisit"
              type="text"
              max="3500"
              value={this.state.targetPrevisit}
              touched={true}
              onChange={val => this._changeTargetPrevisit(val)}
              error={this.state.targetPrevisitError}
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
            />
          </Col>
        </Row>

        {valueTypePrevisit === PROPUEST_OF_BUSINESS &&
          <div>
            <Row style={{padding: "10px 10px 20px 20px"}}>
              <Col xs={12} md={12} lg={12}>
                <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
                  <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
                  <i className="browser icon" style={{fontSize: "20px"}}/>
                  <span style={{fontSize: "20px"}}> Metodología Challenger </span>
                  <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={titleMethodologyChallenger}/>
                </div>
              </Col>
            </Row>
            <Row style={{padding: "0px 23px 20px 20px"}}>
              <Col xs={12} md={12} lg={12}>
                <Challenger
                  acondicionamiento={this.state.acondicionamiento}
                  acondicionamientoTouch={this.state.acondicionamientoTouch}
                  acondicionamientoError={this.state.acondicionamientoError}
                  onChangeAcondicionamiento={val => this._changeAcondicionamiento(val)}
                  replanteamiento={this.state.replanteamiento}
                  replanteamientoTouch={this.state.replanteamientoTouch}
                  replanteamientoError={this.state.replanteamientoError}
                  onChangeReplanteamiento={val => this._changeReplanteamiento(val)}
                  ahogamiento={this.state.ahogamiento}
                  ahogamientoTouch={this.state.ahogamientoTouch}
                  ahogamientoError={this.state.ahogamientoError}
                  onChangeAhogamiento={val => this._changeAhogamiento(val)}
                  impacto={this.state.impacto}
                  impactoTouch={this.state.impactoTouch}
                  impactoError={this.state.impactoError}
                  onChangeImpacto={val => this._changeImpacto(val)}
                  nuevoModo={this.state.nuevoModo}
                  nuevoModoTouch={this.state.nuevoModoTouch}
                  nuevoModoError={this.state.nuevoModoError}
                  onChangeNuevoModo={val => this._changeNuevoModo(val)}
                  nuestraSolucion={this.state.nuestraSolucion}
                  nuestraSolucionTouch={this.state.nuestraSolucionTouch}
                  nuestraSolucionError={this.state.nuestraSolucionError}
                  onChangeNuestraSolucion={val => this._changeNuestraSolucion(val)}
                />
              </Col>
            </Row>
          </div>
        }

        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Pendientes, quejas y reclamos </span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={titleMessagePendient}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <Textarea
              name="pendingPrevisit"
              type="text"
              max="3500"
              value={this.state.pendingPrevisit}
              touched={true}
              onChange={val => this._changePendingPrevisit(val)}
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div style={{textAlign:"left", marginTop:"0px", marginBottom:"20px", marginLeft:"20px"}}>
            <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato previsita: </span><span style={{marginLeft: "0px", color: "#818282"}}>{datePrevisitLastReview}</span>
            </div>
          </Col>
        </Row>
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={{float:"right", margin:"8px 0px 0px 8px", position:"fixed", backgroundColor:"#00B5AD"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar como borrador</span>
            </button>
            <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED} style={{float:"right", margin:"8px 0px 0px 250px", position:"fixed"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar definitivo</span>
            </button>
            <button className="btn" type="button" onClick={this._onCloseButton} style={{float:"right", margin:"8px 0px 0px 450px", position:"fixed", backgroundColor:"rgb(193, 193, 193)"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Cancelar</span>
            </button>
          </div>
        </div>
        <SweetAlert
         type="error"
         show={this.state.showErrorSavePreVisit}
         title="Error participantes"
         text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia."
         onConfirm={() => this.setState({showErrorSavePreVisit:false})}
         />
        <SweetAlert
         type={typeMessage}
         show={this.state.showMessageCreatePreVisit}
         title={titleMessage}
         text={message}
         onConfirm={this._closeMessageCreatePreVisit}
         />
         <SweetAlert
           type= "warning"
           show={this.state.showConfirm}
           title={titleMessage}
           text={message}
           confirmButtonColor= '#DD6B55'
           confirmButtonText= 'Sí, estoy seguro!'
           cancelButtonText = "Cancelar"
           showCancelButton= {true}
           onCancel= {() => this.setState({showConfirm: false })}
           onConfirm={this._closeConfirmCloseVisit}/>
         <SweetAlert
           type= "warning"
           show={this.state.showConfirmChangeTypeVisit}
           title="Tipo de visita"
           text="Señor usuario, si cambia el “Tipo de visita” la información diligenciada en la sección Metodología Challenger se borrará. ¿Está seguro que desea cambiar el Tipo de visita? "
           confirmButtonColor= '#DD6B55'
           confirmButtonText= 'Sí, estoy seguro!'
           cancelButtonText = "Cancelar"
           showCancelButton= {true}
           onCancel= {this._closeCancelConfirmChanType}
           onConfirm={this._closeConfirmChangeType}/>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getMasterDataFields,
    createPrevisit,
    consultParameterServer,
    changeStateSaveData,
    nonValidateEnter
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, participants, reducerGlobal }, ownerProps){
    return {
      clientInformacion,
      selectsReducer,
      participants,
      reducerGlobal
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormPrevisita);
