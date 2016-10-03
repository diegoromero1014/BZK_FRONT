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
import {consultDataSelect, consultList, getMasterDataFields} from '../../selectsComponent/actions';
import {VISIT_TYPE} from '../../selectsComponent/constants';
import ParticipantesCliente from '../../participantsVisitPre/participantesCliente';
import ParticipantesBancolombia from '../../participantsVisitPre/participantesBancolombia';
import ParticipantesOtros from '../../participantsVisitPre/participantesOtros';
import TaskVisit from '../tasks/taskVisit';
import BotonCreateContactComponent from '../../contact/createContact/botonCreateContactComponent';
import RaitingInternal from '../../clientInformation/ratingInternal';
import {LAST_VISIT_REVIEW} from '../constants';
import {TITLE_CONCLUSIONS_VISIT, TITLE_OTHERS_PARTICIPANTS, TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS} from '../../../constantsGlobal';
import {FILE_OPTION_SHOPPING_MAP, SAVE_DRAFT, SAVE_PUBLISHED, MESSAGE_SAVE_DATA} from '../../../constantsGlobal';
import {createVisti, detailVisit, pdfDescarga} from '../actions';
import {addParticipant, filterUsersBanco} from '../../participantsVisitPre/actions';
import {downloadFilePdf} from '../../clientInformation/actions';
import {changeStateSaveData} from '../../dashboard/actions';
import {formValidateKeyEnter, nonValidateEnter} from '../../../actionsGlobal';
import {addTask} from '../tasks/actions';
import SweetAlert from 'sweetalert';
import moment from 'moment';
import _ from 'lodash';

const fields = ["tipoVisita","fechaVisita","desarrolloGeneral", "participantesCliente", "participantesBanco", "participantesOtros", "pendientes"];
var dateVisitLastReview;
var typeMessage = "success";
var titleMessage = "";
var message = "";
var typeButtonClick;

const validate = values => {
  var errors = {};
    return errors;
};

class FormEdit extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showMessageCreateVisit: false,
      showErrorSaveVisit: false,
      showConfirm: false,
      idVisit: "",
      isEditable: false,
      activeItemTabBanc: '',
      activeItemTabClient: 'active',
      activeItemTabOther: '',
      conclusionsVisit: "",
      conclusionsVisitError: null,
    }
    this._submitCreateVisita = this._submitCreateVisita.bind(this);
    this._onClickButton = this._onClickButton.bind(this);
    this._editVisit = this._editVisit.bind(this);
    this._closeMessageCreateVisit = this._closeMessageCreateVisit.bind(this);
    this._onCloseButton = this._onCloseButton.bind(this);
    this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
    this._onClickPDF = this._onClickPDF.bind(this);
    this._changeTypeVisit = this._changeTypeVisit.bind(this);
    this._changeDateVisit = this._changeDateVisit.bind(this);
    this._changeDateVisitOnBlur = this._changeDateVisitOnBlur.bind(this);
    this._downloadFileShoppingMap = this._downloadFileShoppingMap.bind(this);
    this._changeConclusionsVisit = this._changeConclusionsVisit.bind(this);
  }

  _editVisit() {
    this.setState({
      showMessage: false,
      isEditable: !this.state.isEditable
    });
  }

  _downloadFileShoppingMap(){
    const {downloadFilePdf} = this.props;
    downloadFilePdf(FILE_OPTION_SHOPPING_MAP);
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

  _closeMessageCreateVisit(){
    if( typeMessage === "success" ){
      this.setState({
        showMessageCreateVisit: false
      });
      redirectUrl("/dashboard/clientInformation");
    } else {
      this.setState({
        showMessageCreateVisit: false
      });
    }
  }

  _onClickPDF(){
    const {pdfDescarga} = this.props;
    pdfDescarga(window.localStorage.getItem('idClientSelected'),this.state.idVisit);
  }

  _closeConfirmCloseVisit(){
    this.setState({showConfirm: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _submitCreateVisita(){
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral}, participants, visitReducer, tasks, changeStateSaveData} = this.props;
    const detailVisit = visitReducer.get('detailVisit');
    var errorInForm = false;

    if(this.state.typeVisit === null || this.state.typeVisit === undefined || this.state.typeVisit === "" ){
      errorInForm = true;
      this.setState({
        typeVisitError: "Debe seleccionar una opción"
      });
    }
    if(this.state.dateVisit === null || this.state.dateVisit === undefined || this.state.dateVisit === "" ){
      errorInForm = true;
      this.setState({
        dateVisitError: "Debe seleccionar una opción"
      });
    }

    if ( (this.state.conclusionsVisit === null || this.state.conclusionsVisit === undefined || this.state.conclusionsVisit === "") && typeButtonClick === SAVE_PUBLISHED) {
      errorInForm = true;
      this.setState({
        conclusionsVisitError: "Debe ingresar la conclusión de la visita"
      });
    }

    if(!errorInForm){
      var dataClient = [], dataBanco = [], dataOthers = [];

      _.forEach(participants.toArray(), function(value, key) {
        if(_.isEqual(value.tipoParticipante, 'client')){
          var contactParticipantCliente = null;
          if(value.idParticipante !== null && value.idParticipante !== '' && value.idParticipante !== undefined){
            contactParticipantCliente = _.filter(detailVisit.data.participatingContacts, ['id', value.idParticipante]);
          }
          dataClient.push({
            "id": contactParticipantCliente.length > 0 ? value.idParticipante : null,
            "contact": value.idParticipante
          });
        }else{
          if(_.isEqual(value.tipoParticipante, 'banco')){
            var contactParticipantBanco = null;
            if(value.idParticipante !== null && value.idParticipante !== '' && value.idParticipante !== undefined){
              contactParticipantBanco = _.filter(detailVisit.data.participatingEmployees, ['id', value.idParticipante]);
            }
            dataBanco.push({
              "id": contactParticipantBanco.length > 0 ? value.idParticipante : null,
              "employee": value.idParticipante
            });
          }else{
            if(_.isEqual(value.tipoParticipante, 'other')){
              dataOthers.push({
                "id": value.idParticipante,
                "name": value.nombreParticipante.replace('-', ''),
                "position": value.cargo.replace('-', ''),
                "company": value.empresa.replace('-', '')
              });
            }
          }
        }
      });

      if(dataBanco.length > 0 || typeButtonClick === SAVE_DRAFT){
        var tareas = [];
        _.map(tasks.toArray(),
          function(task){
              var data = {
                "id": null,
                "task": task.tarea,
                "employee": task.idResponsable,
                "employeeName": task.responsable,
                "closingDate": moment(task.fecha, "DD/MM/YYYY").format('x'),
              }
              tareas.push(data);
          }
        );
        var visitJson = {
          "id": detailVisit.data.id,
          "client": window.localStorage.getItem('idClientSelected'),
          "visitTime": moment(this.state.dateVisit).format('x'),
          "participatingContacts": dataClient.length === 0 ? null : dataClient,
          "participatingEmployees": dataBanco,
          "relatedEmployees": dataOthers.length === 0 ? null : dataOthers,
          "comments": this.state.conclusionsVisit,
          "visitType": this.state.typeVisit,
          "userTasks": tareas,
          "documentStatus": typeButtonClick
        }
        const {createVisti} = this.props;
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createVisti(visitJson).then((data)=> {
          changeStateSaveData(false, "");
          if(data.payload.data.validateLogin === 'false'){
            redirectUrl("/login");
          } else {
            if(data.payload.data.status === 200){
              typeMessage = "success";
              titleMessage = "Edición visita";
              message = "Señor usuario, la visita se editó de forma exitosa.";
              this.setState({showMessageCreateVisit :true});
            } else {
              typeMessage = "error";
              titleMessage = "Edición visita";
              message = "Señor usuario, ocurrió un error editando la visita.";
              this.setState({showMessageCreateVisit :true});
            }
          }
        }, (reason) =>{
          changeStateSaveData(false, "");
          typeMessage = "error";
          titleMessage = "Edición visita";
          message = "Señor usuario, ocurrió un error editando la visita.";
          this.setState({showMessageCreateVisit :true});
        });
      } else {
        this.setState({showErrorSaveVisit :true});
      }
    } else {
      typeMessage = "error";
      titleMessage = "Campos obligatorios";
      message = "Señor usuario, debe ingresar todos los campos obligatorios.";
      this.setState({showMessageCreateVisit :true});
    }
  }

  _onClickButton(buttonClick){
    typeButtonClick = buttonClick;
  }

  _onCloseButton(){
    message = "¿Está seguro que desea salir de la pantalla de edición de visita?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  _changeTypeVisit(value){
    this.setState({
      typeVisit: value,
      typeVisitError: null
    });
  }

  _changeDateVisit(value){
    this.setState({
      dateVisit: value,
      dateVisitError: null
    });
  }
  _changeDateVisitOnBlur(value){
    var date = value.target.value;
    if(date === '' || date === undefined || date === null){
      this.setState({
        dateVisitError: "Debe seleccionar una opción"
      });
    }
  }

  _changeConclusionsVisit(value){
    this.setState({
      conclusionsVisit: value.target.value,
      conclusionsVisitError: null
    });
  }

  componentWillMount(){
    const {nonValidateEnter, getMasterDataFields, visitReducer, id, detailVisit, filterUsersBanco, addTask} = this.props;
    nonValidateEnter(true);
    this.setState({idVisit : id});
    getMasterDataFields([VISIT_TYPE]);
    detailVisit(id).then((result) => {
      const {fields: {participantesCliente}, addParticipant, visitReducer, contactsByClient} = this.props;
      var part = result.payload.data.data;
      dateVisitLastReview = moment(part.reviewedDate, "x").locale('es').format("DD MMM YYYY");

      this.setState({
        typeVisit: part.visitType,
        dateVisit: new Date(moment(part.visitTime, "x")),
        conclusionsVisit: part.comments
      });

      //Adicionar participantes por parte del cliente
      _.forIn(part.participatingContacts, function(value, key) {
        const uuid = _.uniqueId('participanClient_');
        var clientParticipant = {
          tipoParticipante: 'client',
          idParticipante: value.id,
          nombreParticipante: value.contactName,
          cargo: value.contactPositionName === null || value.contactPositionName === undefined || value.contactPositionName === '' ? ''
          : ' - ' + value.contactPositionName,
          empresa: '',
          estiloSocial: value.socialStyleName === null || value.socialStyleName === undefined || value.socialStyleName === '' ? ''
          : ' - ' + value.socialStyleName,
          actitudBanco: value.attitudeOverGroupName === null || value.attitudeOverGroupName === undefined || value.attitudeOverGroupName === '' ? ''
          : ' - ' + value.attitudeOverGroupName,
          fecha: Date.now(),
          uuid,
        }
        addParticipant(clientParticipant);
      });

      //Adicionar participantes por parte de bancolombia
      _.forIn(part.participatingEmployees, function(value, key) {
        const uuid = _.uniqueId('participanBanco_');
        var clientParticipant = {
          tipoParticipante: 'banco',
          idParticipante: value.id,
          nombreParticipante: value.employeeName,
          cargo: value.positionName === null || value.positionName === undefined || value.positionName === '' ? ''
          : ' - ' + value.positionName,
          empresa: value.lineBusinessName === null || value.lineBusinessName === undefined || value.lineBusinessName === '' ? ''
          : ' - ' + value.lineBusinessName,
          estiloSocial: '',
          actitudBanco: '',
          fecha: Date.now(),
          uuid,
        }
        addParticipant(clientParticipant);
      });

      //Adicionar otros participantes
      _.forIn(part.relatedEmployees, function(value, key) {
        const uuid = _.uniqueId('participanOther_');
        var otherParticipant = {
          tipoParticipante: 'other',
          idParticipante: value.id,
          nombreParticipante: value.name,
          cargo: value.position === null || value.position === undefined || value.position === '' ? ''
          : ' - ' + value.position,
          empresa: value.company === null || value.company === undefined || value.company === '' ? ''
          : ' - ' + value.company,
          estiloSocial: '',
          actitudBanco: '',
          fecha: Date.now(),
          uuid,
        }
        addParticipant(otherParticipant);
      });

      //Adicionar tareas
      _.forIn(part.userTasks, function(value, key) {
        const uuid = _.uniqueId('task_');
        var task = {
          uuid,
          tarea: value.task,
          idResponsable: value.employee,
          responsable: value.employeeName,
          fecha: moment(value.closingDate).format('DD/MM/YYYY'),
          fechaForm: moment(value.closingDate).format('DD/MM/YYYY')
        }
        addTask(task);
      });
    });
  }

  render(){
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral, participantesCliente, participantesBanco, participantesOtros, pendientes},
    selectsReducer, handleSubmit, visitReducer, clientInformacion, reducerGlobal} = this.props;
    const ownerDraft = visitReducer.get('ownerDraft');
    const detailVisit = visitReducer.get('detailVisit');
    const infoClient = clientInformacion.get('responseClientInfo');
    const {aecStatus} = infoClient;
    var showAECNoAplica = false;
    var showAECNivel = true;
    if( aecStatus === undefined || aecStatus === null ){
      showAECNoAplica = true;
      showAECNivel = false;
    }
    var fechaModString = '';
    var fechaCreateString = '';
    var createdBy = '';
    var updatedBy = '';

    if(detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)){
      createdBy = detailVisit.data.createdByName;
      updatedBy = detailVisit.data.updatedByName;
      if(detailVisit.data.updatedTimestamp !== null){
        var fechaModDateMoment = moment(detailVisit.data.updatedTimestamp, "x").locale('es');
        fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
      }
      if(detailVisit.data.createdTimestamp !== null){
        var fechaCreateDateMoment = moment(detailVisit.data.createdTimestamp, "x").locale('es');
        fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
      }
    }
    return(
      <form onSubmit={handleSubmit(this._submitCreateVisita)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "0px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <header className="header-client-detail">
          <div className="company-detail" style={{marginLeft: "20px", marginRight: "20px"}}>
            <div>
              <h3 style={{wordBreak:'break-all'}} className="inline title-head">
                {infoClient.clientName}
              </h3>
              {infoClient.isProspect &&
                <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px"}}
                  className="label label-important bounceIn animated prospect" >Prospecto</span>
              }
              {showAECNivel &&
                <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#ec5f48"}}
                  className="label label-important bounceIn animated aec-status" >{aecStatus}</span>
              }
              {showAECNoAplica &&
                <span style={{borderRadius: "2px", fontSize: "15px", height: "30px", display: "inline !important", textTransform: "none !important", marginLeft: "10px", backgroundColor: "#3498db"}}
                  className="label label-important bounceIn animated aec-normal" >AEC: No aplica</span>
              }
              <div style={{width: "150px", display: "inline-flex"}}>
                <span style={{marginLeft: "10px"}}><RaitingInternal valueRaiting={infoClient.internalRatingKey}/></span>
              </div>
            </div>
          </div>
        </header>
        <Row style={{padding: "5px 10px 0px 20px"}}>
          <Col xs={10} sm={10} md={10} lg={10}>
            <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <button type="button" onClick={this._editVisit} className={'btn btn-primary modal-button-edit'} style={{marginRight:'15px', float:'right', marginTop:'-15px'}}>Editar <i className={'icon edit'}></i></button>
          </Col>
        </Row>
          <Row style={{padding: "10px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Datos de la reunión</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
          <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
            <dt>
              <span>Tipo de reunión (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <ComboBox
                name="tipoVisita"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                value={this.state.typeVisit}
                touched={true}
                error={this.state.typeVisitError}
                onChange={val => this._changeTypeVisit(val)}
                onBlur={() => ''}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(VISIT_TYPE) || []}
                disabled={this.state.isEditable ? '' : 'disabled'}
              />
            </dt>
          </Col>
          <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de reunión - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY hh:mm a"}
                time={true}
                value={this.state.dateVisit}
                touched={true}
                error={this.state.dateVisitError}
                onChange={val => this._changeDateVisit(val)}
                onBlur={val => this._changeDateVisitOnBlur(val)}
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
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_CLIENT_PARTICIPANTS}/>
              </a>
              <a className={`${this.state.activeItemTabBanc} item`} style={{width:"40%"}}
                data-tab="second" onClick={this._clickSeletedTab.bind(this, 2)}>Participantes en la reunión por parte del Grupo Bancolombia
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_BANC_PARTICIPANTS}/>
              </a>
              <a className={`${this.state.activeItemTabOther} item`} style={{width:"26%"}}
                data-tab="third" onClick={this._clickSeletedTab.bind(this, 3)}>Otros participantes en la reunión
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer", marginLeft: "5px"}} title={TITLE_OTHERS_PARTICIPANTS}/>
              </a>
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabClient} tab segment`} data-tab="first">
                <ParticipantesCliente disabled={this.state.isEditable ? '' : 'disabled'}/>
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabBanc} tab segment`} data-tab="second">
                <ParticipantesBancolombia disabled={this.state.isEditable ? '' : 'disabled'}/>
            </div>
            <div className={`ui bottom attached ${this.state.activeItemTabOther} tab segment`} data-tab="third">
                <ParticipantesOtros disabled={this.state.isEditable ? '' : 'disabled'}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Conclusiones de la reunión - acuerdos y compromisos de las partes (<span style={{color: "red"}}>*</span>)</span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={TITLE_CONCLUSIONS_VISIT}/>
              <i onClick={this._downloadFileShoppingMap}
                style={{marginLeft: "2px", cursor: "pointer", fontSize: "18px"}}
                title="Descargar pdf mapa de compras"
                className="red file pdf outline icon"></i>
            </div>
          </Col>
        </Row>
          <Row style={{padding: "0px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <Textarea
              name="desarrolloGeneral"
              type="text"
              max="3500"
              value={this.state.conclusionsVisit}
              touched={true}
              error={this.state.conclusionsVisitError}
              onChange={val => this._changeConclusionsVisit(val)}
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
              disabled={this.state.isEditable ? '' : 'disabled'}
            />
          </Col>
        </Row>
        <TaskVisit disabled={this.state.isEditable ? '' : 'disabled'}/>
        <Row style={{padding: "10px 10px 0px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <span style={{fontWeight: "bold", color: "#818282"}}>Creado por</span>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <span style={{fontWeight: "bold", color: "#818282"}}>Fecha de creación</span>
          </Col>
          <Col xs={6} md={3} lg={3}>
            {updatedBy !== null ?
              <span style={{fontWeight: "bold", color: "#818282"}}>Modificado por</span>
            : '' }
            </Col>
          <Col xs={6} md={3} lg={3}>
            {updatedBy !== null ?
              <span style={{fontWeight: "bold", color: "#818282"}}>Fecha de modificación</span>
            : '' }
          </Col>
        </Row>
        <Row style={{padding: "5px 10px 0px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <span style={{marginLeft: "0px", color: "#818282"}}>{createdBy}</span>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <span style={{marginLeft: "0px", color: "#818282"}}>{fechaCreateString}</span>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <span style={{marginLeft: "0px", color: "#818282"}}>{updatedBy}</span>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <span style={{marginLeft: "0px", color: "#818282"}}>{fechaModString}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div style={{textAlign:"left", marginTop:"20px", marginBottom:"20px", marginLeft:"20px", color: "#818282"}}>
            <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato visita: </span><span style={{marginLeft: "0px", color: "#818282"}}>{dateVisitLastReview}</span>
            </div>
          </Col>
        </Row>
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={this.state.isEditable === true && ownerDraft === 0 ?  {float:"right", margin:"8px 0px 0px -120px", position:"fixed", backgroundColor:"#00B5AD"} : {display: "none"}}>
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
         text="Señor usuario, para guardar una visita como mínimo debe agregar un participante por parte del Grupo Bancolombia."
         onConfirm={() => this.setState({showErrorSaveVisit:false})}
         />
        <SweetAlert
         type={typeMessage}
         show={this.state.showMessageCreateVisit}
         title={titleMessage}
         text={message}
         onConfirm={this._closeMessageCreateVisit}
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
    consultDataSelect,
    consultList,
    pdfDescarga,
    getMasterDataFields,
    createVisti,
    addParticipant,
    detailVisit,
    filterUsersBanco,
    addTask,
    downloadFilePdf,
    changeStateSaveData,
    nonValidateEnter
  }, dispatch);
}

function mapStateToProps({selectsReducer, visitReducer, participants, contactsByClient, tasks, clientInformacion, reducerGlobal}, ownerProps){
    const detailVisit = visitReducer.get('detailVisit');
    if(detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)){
      var visitTime = detailVisit.data.visitTime;
      return {
        initialValues:{
          tipoVisita: detailVisit.data.visitType,
          fechaVisita: visitTime !== '' && visitTime !== null && visitTime !== undefined ? moment(visitTime, "x").format('DD/MM/YYYY HH:mm') : null,
          desarrolloGeneral: detailVisit.data.comments,
          participantesBanco: _.toArray(detailVisit.data.participatingEmployees),
          participantesOtros: _.toArray(detailVisit.data.relatedEmployees),
          pendientes: detailVisit.data.userTasks
        },
        selectsReducer,
        visitReducer,
        contactsByClient,
        participants,
        tasks,
        clientInformacion,
        reducerGlobal
      };
    }else{
      return {
        initialValues:{
          tipoVisita: '',
          fechaVisita: '',
          desarrolloGeneral: '',
          participantesCliente: '',
          participantesBanco: '',
          participantesOtros: '',
          pendientes: ''
        },
        selectsReducer,
        visitReducer,
        contactsByClient,
        participants,
        tasks,
        clientInformacion,
        reducerGlobal
      };
    }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormEdit);
