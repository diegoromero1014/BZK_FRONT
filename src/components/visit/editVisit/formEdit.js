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
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import _ from 'lodash';

const fields = ["tipoVisita","fechaVisita","desarrolloGeneral", "participantesCliente", "participantesBanco", "participantesOtros", "pendientes"];
var dateVisitLastReview;
var showMessageCreateVisit= false;
var typeMessage = "";
var titleMessage = "";
var message = "";
var typeButtonClick;

const validate = values => {
  var errors = {};
    if(!values.tipoVisita){
      errors.tipoVisita = "Debe seleccionar una opción";
    }else{
      errors.tipoVisita = null;
    }
    if(!values.fechaVisita){
      errors.fechaVisita = "Debe seleccionar una fecha";
    }else{
      errors.fechaVisita = null;
    }
    return errors;
};

class FormEdit extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showErrorSaveVisit: false,
      showConfirm: false,
      idVisit: ""
    }
    this._submitCreateVisita = this._submitCreateVisita.bind(this);
    this._onClickButton = this._onClickButton.bind(this);
    this._closeMessageCreateVisit = this._closeMessageCreateVisit.bind(this);
    this._onCloseButton = this._onCloseButton.bind(this);
    this._closeConfirmCloseVisit = this._closeConfirmCloseVisit.bind(this);
    this._onClickPDF = this._onClickPDF.bind(this);
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

  componentWillMount(){
    const {getMasterDataFields, consultParameterServer, visitReducer, id, detailVisit} = this.props;
    console.log("idParam", id);
    this.setState({idVisit : id});
    console.log("idParam1", this.state.idVisit);
    getMasterDataFields([VISIT_TYPE]);
    detailVisit(id).then(() => {
    });
    consultParameterServer(LAST_VISIT_REVIEW).then((data)=> {
      if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
        data.payload.data.parameter !== undefined ){
        dateVisitLastReview = JSON.parse(data.payload.data.parameter).value;
      }
    }, (reason) =>{
    });
  }

  render(){
    const {fields: {tipoVisita, fechaVisita, desarrolloGeneral, participantesCliente, participantesBanco, participantesOtros, pendientes},
    selectsReducer, handleSubmit} = this.props;
    return(
      <form onSubmit={handleSubmit(this._submitCreateVisita)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", marginTop: "2px", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
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
          <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
            <dt>
              <span>Tipo de reunión (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <ComboBox
                name="tipoVisita"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                {...tipoVisita}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(VISIT_TYPE) || []}
              />
            </dt>
          </Col>
          <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de reunión - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY"}
                time={false}
                {...fechaVisita}
                placeholder="Seleccione la fecha de reunión"
                max={new Date()}
              />
            </dt>
          </Col>
        </Row>
        <Row style={{padding: "10px 42px 0px 20px"}}>
          <Col xs={10} md={10} lg={10}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "15px", marginBottom: "0px"}}>
              <span className="section-title">Participantes en la reunión por parte del cliente </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
            </dl>
          </Col>
          <BotonCreateContactComponent typeButton={1} />
        </Row>
        <Row style={{padding: "0px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </div>
          </Col>
        </Row>
        <ParticipantesCliente />

        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
              <span className="section-title">Participantes en la reunión por parte del Grupo Bancolombia </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </dl>
          </Col>
        </Row>
        <ParticipantesBancolombia />

        <Row style={{padding: "20px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <dl style={{fontSize: "20px", color: "#505050", marginTop: "5px", marginBottom: "5px"}}>
              <span className="section-title">Otros participantes en la reunión </span>
              <i className="help circle icon blue"
              style={{fontSize: "18px", cursor: "pointer"}} title="Mensaje"/>
              <div className="tab-content-row" style={{borderTop: "1px solid #505050", width:"99%", marginTop: "5px"}}></div>
            </dl>
          </Col>
        </Row>
        <ParticipantesOtros />
        <TaskVisit />
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
          />
        </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div style={{textAlign:"left", marginTop:"20px", marginBottom:"20px", marginLeft:"20px"}}>
            <h4 className="form-item">Fecha última revisión formato visita (YYY/DD/MM): <span>{dateVisitLastReview}</span></h4>
            </div>
          </Col>
        </Row>
        <div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
          <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
            <button className="btn" type="submit" onClick={this._onClickButton} style={{float:"right", margin:"8px 0px 0px -117px", position:"fixed"}}>
              <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar definitivo</span>
            </button>
            <button className="btn" type="submit" onClick={this._onClickButton} style={{float:"right", margin:"8px 0px 0px 67px", position:"fixed", backgroundColor:"#00B5AD"}}>
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
    detailVisit
  }, dispatch);
}

function mapStateToProps({selectsReducer, visitReducer, participants}, ownerProps){
    const detailVisit = visitReducer.get('detailVisit');
    if(detailVisit !== undefined && detailVisit !== null && detailVisit !== '' && !_.isEmpty(detailVisit)){
      var visitTime = detailVisit.data.visitTime;
      return {
        initialValues:{
          tipoVisita: detailVisit.data.visitType,
          fechaVisita: visitTime !== '' && visitTime !== null && visitTime !== undefined ? moment(visitTime).format('DD/MM/YYYY') : null,
          desarrolloGeneral: detailVisit.data.comments,
          participantesCliente: detailVisit.data.participatingContacts,
          participantesBanco: detailVisit.data.participatingEmployees,
          participantesOtros: detailVisit.data.relatedEmployees,
          pendientes: detailVisit.data.userTasks
        },
        selectsReducer,
        visitReducer,
        participants
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
        participants
      };
    }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormEdit);
