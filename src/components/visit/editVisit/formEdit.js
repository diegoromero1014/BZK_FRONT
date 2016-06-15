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
import {LAST_VISIT_REVIEW, SAVE_DRAFT, SAVE_PUBLISHED} from '../constants';
import {consultParameterServer, createVisti, detailVisit, pdfDescarga} from '../actions';
import {addParticipant, filterUsersBanco} from '../../participantsVisitPre/actions';
import {addTask} from '../tasks/actions';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import _ from 'lodash';

const fields = ["tipoVisita","fechaVisita","desarrolloGeneral", "participantesCliente", "participantesBanco", "participantesOtros", "pendientes"];
var dateVisitLastReview;
var showMessageCreateVisit= false;
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
      showErrorSaveVisit: false,
      showConfirm: false,
      idVisit: "",
      isEditable: false,
      activeItemTabBanc: '',
      activeItemTabClient: 'active',
      activeItemTabOther: ''
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
  }

  _editVisit() {
    this.setState({
      showMessage: false,
      isEditable: !this.state.isEditable
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
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral},
      participants, createVisti} = this.props;
    var dataBanco = _.map(participants.toArray(),
      function(participant){
        if(_.isEqual(participant.tipoParticipante, 'banco') ){
          return _.assign({}, {
            "id": null,
            "employee": participant.idParticipante
          });
        }
      }
    );
    if( dataBanco.length > 0 && dataBanco[0] === undefined ){
      dataBanco = [];
    }

    if( dataBanco.length > 0 ){
      var dataClient = _.map(participants.toArray(),
        function(participant){
          if(_.isEqual(participant.tipoParticipante, 'client')){
            return _.assign({}, {
              "id": null,
              "contact": participant.idParticipante
            });
          }
        }
      );
      if( dataClient.length > 0 && dataClient[0] === undefined ){
        dataClient = [];
      }
      var dataOthers = _.map(participants.toArray(),
        function(participant){
          if(_.isEqual(participant.tipoParticipante, 'other') ){
            return _.assign({}, {
              "id": null,
              "name": participant.nombreParticipante,
              "position": participant.cargo,
              "company": participant.empresa
            });
          }
        }
      );
      if( dataOthers.length > 0 && dataOthers[0] === undefined ){
        dataOthers = [];
      }
      var visitJson = {
        "id": null,
        "client": window.localStorage.getItem('idClientSelected'),
        "visitTime": moment(fechaVisita.value, "DD/MM/YYYY").format('x'),
        "participatingContacts": dataClient.length === 0 ? null : dataClient,
        "participatingEmployees": dataBanco,
        "relatedEmployees": dataOthers === 0 ? null : dataOthers,
        "comments": desarrolloGeneral.value,
        "visitType": tipoVisita.value,
        "documentStatus": typeButtonClick
      }
      createVisti(visitJson).then((data)=> {
        if((_.get(data, 'payload.validateLogin') === 'false')){
          redirectUrl("/login");
        } else {
          if( (_.get(data, 'payload.status') === 200) ){
            typeMessage = "success";
            titleMessage = "Creación visita";
            message = "Señor usuario, la visita se creó de forma exitosa.";
            this.setState({showMessageCreateVisit :true});
          } else {
            typeMessage = "error";
            titleMessage = "Creación visita";
            message = "Señor usuario, ocurrió un error creando la visita.";
            this.setState({showMessageCreateVisit :true});
          }
        }
      }, (reason) =>{
        typeMessage = "error";
        titleMessage = "Creación visita";
        message = "Señor usuario, ocurrió un error creando la visita.";
        this.setState({showMessageCreateVisit :true});
      });
    } else {
      this.setState({showErrorSaveVisit :true});
    }
  }

  _onClickButton(buttonClick){
    typeButtonClick = buttonClick;
  }

  _onCloseButton(){
    message = "¿Está seguro que desea salir de la pantalla de creación de visita?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  _changeTypeVisit(value){
    console.log("Type visit", value);
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

  componentWillMount(){
    const {getMasterDataFields, consultParameterServer, visitReducer, id, detailVisit, filterUsersBanco, addTask} = this.props;
    this.setState({idVisit : id});
    getMasterDataFields([VISIT_TYPE]);
    detailVisit(id).then((result) => {
      const {fields: {participantesCliente}, addParticipant, visitReducer, contactsByClient} = this.props;
      var part = result.payload.data.data;

      //Adicionar participantes por parte del cliente
      _.forIn(part.participatingContacts, function(value, key) {
        var contactClient = contactsByClient.get('contacts');
        const uuid = _.uniqueId('participanClient_');
        var contactSelected = _.get(_.filter(contactClient, ['id', parseInt(value.contact)]), '[0]');
        var clientParticipant = {
          tipoParticipante: 'client',
          idParticipante: value.id,
          nombreParticipante: value.contactName,
          cargo: value.contactPositionName,
          empresa: '',
          estiloSocial: value.socialStyle,
          actitudBanco: value.attitudeOverGroup,
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
          cargo: value.positionName,
          empresa: '',
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
          cargo: value.position,
          empresa: value.company,
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
          fecha: moment(value.closingDate).format('DD/MM/YYYY')
        }
        addTask(task);
      });
    });

    consultParameterServer(LAST_VISIT_REVIEW).then((data)=> {
      if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" && data.payload.data.parameter !== undefined ){
        var fechaVisitLastReview = moment(JSON.parse(data.payload.data.parameter).value, "YYYY/DD/MM").locale('es');
        dateVisitLastReview = moment(fechaVisitLastReview, "YYYY/DD/MM").locale('es').format("DD MMMM YYYY");
      }
    }, (reason) =>{
    });
  }

  componentDidMount(){
    const {visitReducer} = this.props;
    const detailVisit = visitReducer.get('detailVisit');
    var visitTime = detailVisit.data.visitTime;
    this.setState({
      typeVisit: detailVisit.data.visitType,
      dateVisit: moment(visitTime, "x").format('DD/MM/YYYY HH:mm')
    });
  }

  render(){
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral, participantesCliente, participantesBanco, participantesOtros, pendientes},
    selectsReducer, handleSubmit, visitReducer, clientInformacion} = this.props;
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
      <form onSubmit={handleSubmit(this._submitCreateVisita)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
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
            </div>
          </div>
        </header>
        <Row style={{padding: "10px 10px 0px 20px"}}>
          <Col xs={10} sm={10} md={10} lg={10}>
            <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <button type="button" onClick={this._editVisit} className={'btn btn-primary modal-button-edit'} style={{marginRight:'15px', float:'right', marginTop:'-10px'}}>Editar <i className={'icon edit'}></i></button>
          </Col>
        </Row>
        <Row style={{padding: "10px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Información general</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
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
                onBlur={() => console.log("")}
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
                onBlur={() => console.log("")}
                disabled={this.state.isEditable ? '' : 'disabled'}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 42px 0px 20px"}}>
          <Col xs>
            <div className="ui top attached tabular menu">
              <a className={`${this.state.activeItemTabClient} item`}
                data-tab="first" onClick={this._clickSeletedTab.bind(this, 1)}>Participantes en la reunión por parte del cliente
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              </a>
              <a className={`${this.state.activeItemTabBanc} item`}
                data-tab="second" onClick={this._clickSeletedTab.bind(this, 2)}>Participantes en la reunión por parte del Grupo Bancolombia
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              </a>
              <a className={`${this.state.activeItemTabOther} item`}
                data-tab="third" onClick={this._clickSeletedTab.bind(this, 3)}>Otros participantes en la reunión
                <i className="help circle icon blue"style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
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
        <TaskVisit disabled={this.state.isEditable ? '' : 'disabled'}/>
        <Row style={{padding: "30px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "22px"}}> Desarrollo general de la reunión  </span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <Textarea
              {...desarrolloGeneral}
              name="desarrolloGeneral"
              type="text"
              max="3500"
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '250px'}}
              disabled={this.state.isEditable ? '' : 'disabled'}
            />
          </Col>
        </Row>
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
            <h4 className="form-item" style={{color: "#818282"}}>Fecha última revisión formato visita: <span style={{color: "#818282"}}>{dateVisitLastReview}</span></h4>
            </div>
          </Col>
        </Row>
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" type="submit" onClick={this._onClickButton} style={this.state.isEditable === true ? {float:"right", margin:"8px 0px 0px -117px", position:"fixed"} : {display: "none"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar definitivo</span>
            </button>
            <button className="btn" type="submit" onClick={this._onClickButton} style={this.state.isEditable === true ?  {float:"right", margin:"8px 0px 0px 67px", position:"fixed", backgroundColor:"#00B5AD"} : {display: "none"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar como borrador</span>
            </button>
            <button className="btn" type="button" onClick={this._onClickPDF} style={{float:"right", margin:"8px 0px 0px 292px", position:"fixed", backgroundColor:"#eb984e"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Descargar pdf</span>
            </button>
            <button className="btn" type="button" onClick={this._onCloseButton} style={{float:"right", margin:"8px 0px 0px 450px", position:"fixed", backgroundColor:"red"}}>
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
    consultParameterServer,
    createVisti,
    addParticipant,
    detailVisit,
    filterUsersBanco,
    addTask
  }, dispatch);
}

function mapStateToProps({selectsReducer, visitReducer, participants, contactsByClient, tasks, clientInformacion}, ownerProps){
    const detailVisit = visitReducer.get('detailVisit');
    console.log("detailVisit", detailVisit);
    if(detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)){
      var visitTime = detailVisit.data.visitTime;
      var createdTimestamp = detailVisit.data.createdTimestamp;
      var updatedTimestamp = detailVisit.data.updatedTimestamp;
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
        clientInformacion
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
        clientInformacion
      };
    }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormEdit);
