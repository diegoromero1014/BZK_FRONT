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
  TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS} from '../../../constantsGlobal';
import {PROPUEST_OF_BUSINESS} from '../constants';
import {pdfDescarga} from '../actions';
import Challenger from '../../methodologyChallenger/component';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';

const fields = [];
var titleMethodologyChallenger = "Enseñanza (Oportunidades – Retos): Diligencie de manera resumida los siguientes " +
      "campos. Recuerde que lo importante es la necesidad del cliente, por lo cual no debe hablar de Bancolombia hasta cuando se expone la solución a la situación del cliente.\n" +
      "No es necesario haber asistido previamente a la formación Challenger, el formato entrega las herramientas necesarias para su construcción."
var dateVisitLastReview;
var showMessageCreatePreVisit= false;
var typeMessage = "success";
var titleMessage = "";
var message = "";
var typeButtonClick;
var valueTypePrevisit = null;

const validate = values => {
    const errors = {};
    return errors;
};

class FormEditPrevisita extends Component{

  constructor(props) {
    super(props);
    this.state = {
      idPrevisit: "",
      isEditable: "",
      showErrorSavePreVisit: false,
      typePreVisit: "",
      typePreVisitError: null,
      datePreVisit: new Date(),
      datePreVisitError: null,
      showConfirm: false,
      activeItemTabBanc: '',
      activeItemTabClient: 'active',
      activeItemTabOther: '',
      targetPrevisit: "",
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
    this._editPreVisit = this._editPreVisit.bind(this);
    this._onClickPDF = this._onClickPDF.bind(this);
  }

  _editPreVisit() {
    this.setState({
      showMessage: false,
      isEditable: !this.state.isEditable
    });
  }

  _onClickPDF(){
    const {pdfDescarga} = this.props;
    pdfDescarga(window.localStorage.getItem('idClientSelected'),this.state.idVisit);
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
    const {selectsReducer} = this.props;
    const typeSeleted = _.filter(selectsReducer.get(PREVISIT_TYPE), ['id', parseInt(value)]);
    valueTypePrevisit = typeSeleted[0].id;
    this.setState({
      typePreVisit: parseInt(value),
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

  _changeTargetPrevisit(value){
    this.setState({
      targetPrevisit: value.target.value
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
    const { participants } = this.props;
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

    //Validaciones de la metodología challenger y si estoy guardando como definitivo
    if( parseInt(valueTypePrevisit) === PROPUEST_OF_BUSINESS && typeButtonClick === SAVE_PUBLISHED){
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

      //Valido que haya por los menos 1 usuairo por parte del banco y por parte del cliente o si
      //la previsita se está guardando como borrador
      if( (dataBanco.length > 0 && dataClient.length > 0) || typeButtonClick === SAVE_DRAFT ){
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
          "visitTime": moment(this.state.datePreVisit).format('x'),
          "participatingContacts": dataClient.length === 0 ? null : dataClient,
          "participatingEmployees": dataBanco.length === 0 ? null : dataBanco,
          "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
          "targetPrevisit": this.state.targetPrevisit,
          "visitType": this.state.typePreVisit,
          "pendingPrevisit": this.state.pendingPrevisit,
          "acondicionamiento": this.state.acondicionamiento,
          "replanteamiento": this.state.replanteamiento,
          "ahogamiento": this.state.ahogamiento,
          "impacto": this.state.impacto,
          "nuevoModo": this.state.nuevoModo,
          "nuestraSolucion": this.state.nuestraSolucion
        }
        console.log("previsitJson", previsitJson);
      } else {
        this.setState({showErrorSaveVisit :true});
      }
    } else {
      typeMessage = "error";
      titleMessage = "Campos obligatorios";
      message = "Señor usuario, debe ingresar todos los campos obligatorios.";
      this.setState({showMessageCreatePreVisit :true});
    }
  }

  componentWillMount(){
    const {clientInformacion, getMasterDataFields, id, detailPrevisit} = this.props;
    console.log("id previsita", id);
    this.setState({idPrevisit : id});
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([PREVISIT_TYPE]);
    }
  }

  render(){
    const { fields:{acondicionamiento, replanteamiento, ahogamiento, impacto, nuevoModo, nuestraSolucion},
      clientInformacion, selectsReducer, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitCreatePrevisita)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <Row style={{padding: "5px 10px 0px 20px"}}>
          <Col xs={10} sm={10} md={10} lg={10}>
            <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <button type="button" onClick={this._editPreVisit} className={'btn btn-primary modal-button-edit'} style={{marginRight:'15px', float:'right', marginTop:'-15px'}}>Editar <i className={'icon edit'}></i></button>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "20px"}}/>
              <span style={{fontSize: "20px"}}> Datos de la visita/reunión</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
        <Col xs={6} md={3} lg={3}>
          <div style={{paddingRight: "15px"}}>
            <dt><span>Tipo de la visita (</span><span style={{color: "red"}}>*</span>)</dt>
            <ComboBox
              name="tipoVisita"
              labelInput="Seleccione..."
              valueProp={'id'}
              textProp={'value'}
              value={this.state.typePreVisit}
              touched={true}
              error={this.state.typePreVisitError}
              onChange={val => this._changeTypePreVisit(val)}
              onBlur={() => console.log("")}
              parentId="dashboardComponentScroll"
              data={selectsReducer.get(PREVISIT_TYPE) || []}
              disabled={this.state.isEditable ? '' : 'disabled'}
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
                onBlur={val => this._changeDatePreVisitOnBlur(val)}
                disabled={this.state.isEditable ? '' : 'disabled'}
              />
            </dt>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <dt><span>Lugar</span></dt>
            <dt style={{marginRight:"17px"}}>
              <Input
                name="txtLugar"
                type="text"
                title="La longitud máxima de caracteres es de 150"
                max="150"
                disabled={this.state.isEditable ? '' : 'disabled'}
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
                <ParticipantesCliente disabled={this.state.isEditable ? '' : 'disabled'} />
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabBanc} tab segment`} data-tab="second">
                <ParticipantesBancolombia disabled={this.state.isEditable ? '' : 'disabled'} />
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabOther} tab segment`} data-tab="third">
                <ParticipantesOtros disabled={this.state.isEditable ? '' : 'disabled'} />
            </div>
          </Col>
        </Row>

        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Objetivo de la reunión </span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title="Mensaje"/>
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
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
              disabled={this.state.isEditable ? '' : 'disabled'}
            />
          </Col>
        </Row>

        {this.state.typePreVisit === PROPUEST_OF_BUSINESS &&
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
                  disabled={this.state.isEditable ? '' : 'disabled'}
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
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title="Mensaje"/>
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
              disabled={this.state.isEditable ? '' : 'disabled'}
            />
          </Col>
        </Row>

        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={this.state.isEditable === true ?  {float:"right", margin:"8px 0px 0px -120px", position:"fixed", backgroundColor:"#00B5AD"} : {display: "none"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar como borrador</span>
            </button>
            <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED} style={this.state.isEditable === true ? {float:"right", margin:"8px 0px 0px 107px", position:"fixed"} : {display: "none"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar definitivo</span>
            </button>
            <button className="btn" type="button" onClick={this._onClickPDF} style={{float:"right", margin:"8px 0px 0px 292px", position:"fixed", backgroundColor:"#eb984e"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Descargar pdf</span>
            </button>
            <button className="btn" type="button" onClick={this._onCloseButton} style={{float:"right", margin:"8px 0px 0px 450px", position:"fixed", backgroundColor:"rgb(193, 193, 193)"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Cancelar</span>
            </button>
          </div>
        </div>
        <SweetAlert
         type="error"
         show={this.state.showErrorSaveVisit}
         title="Error participantes"
         text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia y otro por parte del cliente."
         onConfirm={() => this.setState({showErrorSaveVisit:false})}
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
      </form>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getMasterDataFields,
    pdfDescarga
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, participants }, ownerProps){
    return {
      clientInformacion,
      selectsReducer,
      participants
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormEditPrevisita);
