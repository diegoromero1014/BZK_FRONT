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
import NeedBusiness from '../need/needBusiness';
import AreaBusiness from '../area/areaBusiness';
import {TITLE_OPPORTUNITY_BUSINESS,SAVE_DRAFT,SAVE_PUBLISHED, MESSAGE_SAVE_DATA} from '../../../constantsGlobal';
import SweetAlert from 'sweetalert-react';
import {OBJECTIVE_BUSINESS,LAST_BUSINESS_REVIEW} from '../constants';
import {consultParameterServer, formValidateKeyEnter} from '../../../actionsGlobal';
import {changeStateSaveData} from '../../dashboard/actions';
import {createBusiness} from '../actions';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';
import numeral from 'numeral';


const fields = ["dateBusiness","objectiveBusiness","opportunities"];
var dateBusinessLastReview;
var showMessageCreateBusiness= false;
var typeMessage = "success";
var titleMessage = "";
var message = "";
var typeButtonClick;
const validate = values => {
  var errors = {};
    return errors;
};
class FormBusinessPlan extends Component {

  constructor(props) {
    super(props);
    this._changeDateBusiness = this._changeDateBusiness.bind(this);
    this._changeDateBusinessOnBlur = this._changeDateBusinessOnBlur.bind(this);
    this._changeObjective = this._changeObjective.bind(this);
    this._closeConfirmClose = this._closeConfirmClose.bind(this);
    this._onCloseButton = this._onCloseButton.bind(this);
    this._closeMessageCreateBusiness = this._closeMessageCreateBusiness.bind(this);
    this._submitCreateBusiness = this._submitCreateBusiness.bind(this);
    this.state = {
      showErrorSaveBusiness : null,
      showConfirm: false,
      dateBusiness: new Date(),
      dateBusinessError: null,
      objectiveBusiness: "",
      objectiveBusinessError : null,
      opportunities :"",
      opportunitiesError: null
    }
  }

  _closeMessageCreateBusiness(){
    if( typeMessage === "success" ){
      this.setState({
        showMessageCreateBusiness: false,
        dateVisit: ""
      });
      redirectUrl("/dashboard/clientInformation");
    } else {
      this.setState({
        showMessageCreateBusiness: false
      });
    }
  }



  _submitCreateBusiness(){
    const {needs, areas, createBusiness, changeStateSaveData} = this.props;
    var errorInForm = false;
    if(typeButtonClick === SAVE_DRAFT){
      if(this.state.dateBusiness === null || this.state.dateBusiness === undefined || this.state.dateBusiness === "" ){
        errorInForm = true;
        this.setState({
          dateBusinessError: "Debe seleccionar una fecha"
        });
      }
    }else if(typeButtonClick === SAVE_PUBLISHED){
      var needsBusiness =[];
        if(this.state.dateBusiness === null || this.state.dateBusiness === undefined || this.state.dateBusiness === "" ){
          errorInForm = true;
          this.setState({
            dateBusinessError: "Debe seleccionar una fecha"
          });
        }
        if(this.state.objectiveBusiness === null || this.state.objectiveBusiness === undefined || this.state.objectiveBusiness === "" ){
          errorInForm = true;
          this.setState({
            objectiveBusinessError: "Debe seleccionar una opción"
          });
        }
        if(this.state.opportunities === null || this.state.opportunities === undefined || this.state.opportunities === "" ){
          errorInForm = true;
          this.setState({
            opportunitiesError: "Debe ingresar un valor"
        });
      }
      needsBusiness = needs.toArray();
      if(needsBusiness.length === 0){
         errorInForm = true;
         this.setState({showErrorSaveBusiness: true});
     }
    }

    if(!errorInForm){
      var needsbB = [];
      _.map(needs.toArray(),
        function(need){
            var data = {
              "id": null,
              "clientNeed": need.needIdType,
              "clientNeedDescription" : need.descriptionNeed,
              "product": need.needIdProduct,
              "implementationTimeline": need.needIdImplementation,
              "task": need.needTask ,
              "expected_benefits":need.needBenefits,
              "employeeResponsible":need.needIdResponsable,
              "needFulfillmentStatus":need.statusIdNeed,
              "estimatedClosingDate":moment(need.needDate, "DD/MM/YYYY").format('x')
            }
            needsbB.push(data);
        }
      );
      var areasB = [];
      _.map(areas.toArray(),
        function(area){
            var data = {
              "id": null,
              "relatedInternalParty": area.areaDes,
              "actionNeeded" : area.actionArea,
              "employeeResponsible": area.areaResponsable,
              "employeeResponsibleId": area.areaIdResponsable,
              "needFulfillmentStatus": area.statusIdArea ,
              "actionStatus":area.needBenefits,
              "estimatedClosingDate":moment(area.areaDate, "DD/MM/YYYY").format('x')
            }
            areasB.push(data);
        }
      );
      var businessJson = {
        "id": null,
        "client": window.localStorage.getItem('idClientSelected'),
        "businessDate": moment(this.state.dateBusiness).format('x'),
        "opportunitiesAndThreats": this.state.opportunities,
        "objective": this.state.objectiveBusiness,
        "documentStatus": typeButtonClick,
        "clientNeedFulfillmentPlan" : needsbB,
        "relatedInternalParties":areasB
      }
      changeStateSaveData(true, MESSAGE_SAVE_DATA);
      createBusiness(businessJson).then((data)=> {
        changeStateSaveData(false, "");
        if((_.get(data, 'payload.data.validateLogin') === 'false')){
          redirectUrl("/login");
        } else {
          if( (_.get(data, 'payload.data.status') === 200) ){
            typeMessage = "success";
            titleMessage = "Creación plan de negocio";
            message = "Señor usuario, el plan de negocio se creó de forma exitosa.";
            this.setState({showMessageCreateBusiness :true});
          } else {
            typeMessage = "error";
            titleMessage = "Creación plan de negocio";
            message = "Señor usuario, ocurrió un error creando el plan de negocio.";
            this.setState({showMessageCreateBusiness :true});
          }
        }
      }, (reason) =>{
        changeStateSaveData(false, "");
        typeMessage = "error";
        titleMessage = "Creación plan de negocio";
        message = "Señor usuario, ocurrió un error creando el plan de negocio.";
        this.setState({showMessageCreateBusiness :true});
      });
    }

  }

  _closeConfirmClose(){
    this.setState({showConfirm: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _changeDateBusiness(value){
    this.setState({
      dateBusiness: value,
      dateBusinessError: null
    });
  }

  _changeObjective(value){
    this.setState({
      objectiveBusiness: value,
      objectiveBusinessError: null
    });
  }

  _changeDateBusinessOnBlur(value){
    var date = value.target.value;
    if(date === '' || date === undefined || date === null){
      this.setState({
        dateBusinessError: "Debe seleccionar una fecha"
      });
    }
  }

  _changeOpportunities(value){
    this.setState({
      opportunities: value.target.value,
      opportunitiesError: null
    });
  }

  _onCloseButton(){
    message = "¿Está seguro que desea salir de la pantalla de creación de plan de negocio?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  componentWillMount(){
    const {clientInformacion, getMasterDataFields,consultParameterServer} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    if(_.isEmpty(infoClient)){
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([OBJECTIVE_BUSINESS]);
      consultParameterServer(LAST_BUSINESS_REVIEW).then((data)=> {
        if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
          data.payload.data.parameter !== undefined ){
          dateBusinessLastReview = JSON.parse(data.payload.data.parameter).value;
          dateBusinessLastReview = moment(dateBusinessLastReview, "YYYY/DD/MM").locale('es').format("DD MMM YYYY");
        }
      });
    }
  }

  render() {
    const {fields: {dateBusiness, objectiveBusiness, opportunities}, selectsReducer, handleSubmit, reducerGlobal} = this.props;
    return(
      <form onSubmit={handleSubmit(this._submitCreateBusiness)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <Row style={{padding: "10px 10px 10px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Datos del plan de negocio</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
        <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
          <dt>
            <span>Fecha - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
          </dt>
          <dt>
            <DateTimePickerUi
              culture='es'
              format={"DD/MM/YYYY hh:mm a"}
              time={true}
              touched={true}
              onChange={val => this._changeDateBusiness(val)}
              onBlur={val => this._changeDateBusinessOnBlur(val)}
              value={this.state.dateBusiness}
              error={this.state.dateBusinessError}
            />
          </dt>
        </Col>
        <Col xs={12} md={4} lg={4} style={{paddingRight: "20px"}}>
          <dt>
            <span>Objetivo del plan de negocios (</span><span style={{color: "red"}}>*</span>)
          </dt>
          <dt>
            <ComboBox
              name="objectiveBusiness"
              labelInput="Seleccione..."
              valueProp={'id'}
              textProp={'value'}
              value={this.state.objectiveBusiness}
              touched={true}
              error={this.state.objectiveBusinessError}
              onChange={val => this._changeObjective(val)}
              onBlur={() => ''}
              parentId="dashboardComponentScroll"
              data={selectsReducer.get(OBJECTIVE_BUSINESS) || []}
            />
          </dt>
        </Col>
        </Row>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Oportunidades y amenazas externas de la compañía (<span style={{color: "red"}}>*</span>)</span>
              <i className="help circle icon blue" style={{fontSize: "18px", cursor: "pointer", marginLeft: "0px"}} title={TITLE_OPPORTUNITY_BUSINESS}/>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
        <Col xs={12} md={12} lg={12}>
          <Textarea
            name="desarrolloGeneral"
            type="text"
            max="3500"
            touched={true}
            title="La longitud máxima de caracteres es de 3500"
            style={{width: '100%', height: '178px'}}
            value={this.state.opportunities}
            touched={true}
            error={this.state.opportunitiesError}
            onChange={val => this._changeOpportunities(val)}
          />
        </Col>
        </Row>
          <NeedBusiness/>
          <AreaBusiness/>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{textAlign:"left", marginTop:"20px", marginBottom:"20px", marginLeft:"20px", color: "#818282"}}>
              <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato plan de negocio:  </span><span style={{marginLeft: "0px", color: "#818282"}}>{dateBusinessLastReview}</span>
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
           show={this.state.showErrorSaveBusiness}
           title="Error necesidades"
           text="Señor usuario, para guardar un plan de negocio como definitivo debe agregar como mínimo una necesidad."
           onConfirm={() => this.setState({showErrorSaveBusiness:false})}
           />
          <SweetAlert
           type={typeMessage}
           show={this.state.showMessageCreateBusiness}
           title={titleMessage}
           text={message}
           onConfirm={this._closeMessageCreateBusiness}
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
            onConfirm={this._closeConfirmClose}/>
      </form>
    );
  }
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getMasterDataFields,
    consultParameterServer,
    createBusiness,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, reducerGlobal, needs, areas}, ownerProps){
    return {
      clientInformacion,
      selectsReducer,
      reducerGlobal,
      needs,
      areas
    };
}
export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormBusinessPlan);
