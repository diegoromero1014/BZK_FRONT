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
import {PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, PIPELINE_PRODUCTS, FILTER_COUNTRY} from '../../selectsComponent/constants';
import {consultDataSelect, consultList, getMasterDataFields, getPipelineProducts, getPipelineCurrencies, getClientNeeds} from '../../selectsComponent/actions';
import {SAVE_DRAFT, SAVE_PUBLISHED, TITLE_CONCLUSIONS_VISIT, TITLE_OTHERS_PARTICIPANTS,
  TITLE_BANC_PARTICIPANTS, TITLE_CLIENT_PARTICIPANTS} from '../../../constantsGlobal';
import {PROPUEST_OF_BUSINESS, POSITIVE_INTEGER, INTEGER, REAL} from '../constants';
import {createEditPipeline} from '../actions';
import Challenger from '../../methodologyChallenger/component';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import _ from 'lodash';
import $ from 'jquery';
import numeral from 'numeral';

const fields = ["nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths"];

var dateVisitLastReview;
let showMessageCreatePipeline= false;
var typeMessage = "success";
var titleMessage = "";
var message = "";
let typeButtonClick;
var valueTypePrevisit = null;
var idTypeVisitAux = null;
var idTypeVisitAuxTwo = null;
var contollerErrorChangeType = false;

const validate = values => {
    const errors = {};
    return errors;
};

class FormPipeline extends Component {

  constructor(props) {
    super(props);
    this.state = {

      businessStatus: "",
      businessWeek: "",
      currency: "",
      employeeResponsible: "",
      indexing: "",
      endDate: "",
      need: "",
      observations: "",
      product: "",
      priority: "",
      registeredCountry: "",
      startDate: "",
      client: "",
      documentStatus: "",
      probability: "",

      businessStatusError: false,
      currencyError: false,
      needError: false,
      valueError: false,
      startDateError: false,
      endDateError: false,
      productError: false,
      currencyChanged: false,

      showMessageCreatePipeline: false,
      //showErrorSavePipeline: false,
      showConfirm: false
    }
    
    this._submitCreatePipeline = this._submitCreatePipeline.bind(this);
    this._closeMessageCreatePipeline = this._closeMessageCreatePipeline.bind(this);
    this._changeProduct = this._changeProduct.bind(this);
    this._changeBusinessStatus = this._changeBusinessStatus.bind(this);
    this._changeValue = this._changeValue.bind(this);
    this._changeNeed = this._changeNeed.bind(this);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
    this._onBlurEvent = this._onBlurEvent.bind(this);
    this._onFocusEvent = this._onFocusEvent.bind(this);
    this._changeTargetObservations = this._changeTargetObservations.bind(this);
  }

  _closeMessageCreatePipeline() {
    if( typeMessage === "success" ) {
      this.setState({
        showMessageCreatePipeline: false,
        dateVisit: ""
      });
      redirectUrl("/dashboard/clientInformation");
    } else {
      this.setState({
        showMessageCreatePipeline: false
      });
    }
  }

  /**
   * @param value
   */
  _changeProduct(value) {
    this.setState({ product: value });
  }

  _changeCurrency(value) {
    if (value !== null && value !== undefined && value !== '' && this.state.currency !== '') {
      this.setState({currencyChanged: true});
    } else {
      this.setState({currencyError: "debe seleccionar una opción"});
    }
    this.setState({currency: value});
  }

  _changeValue(value) {
    this.setState({
      value: value,
      valueError: null
    });
  }

  _changeTargetObservations(value) {
    this.setState({observations: value});
  }

  _handleBlurValueNumber(typeValidation ,valuReduxForm, val) {
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) != -1){
        output += val.toString().charAt(i)
      }
    }
    val = output;
    console.log('valuReduxForm -> ', valuReduxForm.value);
    console.log('val ->', val);

    if (val.length < 29) {

      /* Si typeValidation = 2 es por que el valor puede ser negativo
         Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
      */
      if( typeValidation === INTEGER ) { //Realizo simplemente el formateo
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)){
          val = val.replace(pattern, "$1,$2");
        }
        valuReduxForm.onChange(val);
      } else if (typeValidation === REAL) {

        if (val.length < 10) { // -0,000.0000

          //var value = numeral(valuReduxForm.value).format('0');
          val = numeral(val).format('0,0[.]0000');
          //var pattern = /(-?\d+)(\d{3})/;
          //while(pattern.test(val)) {
          //  val = val.replace(pattern, "$1,$2");
          //}
          valuReduxForm.onChange(val);

        }

      } else { //Valido si el valor es negativo o positivo
        var value = numeral(valuReduxForm.value).format('0');
        if( value >= 0 ){
          var pattern = /(-?\d+)(\d{3})/;
          while (pattern.test(val)){
            val = val.replace(pattern, "$1,$2");
          }
          valuReduxForm.onChange(val);
        } else {
          valuReduxForm.onChange("");
        }
      }
    }
  }

  _changeBusinessStatus(value) {
    if (value === '' || value === undefined || value === null) {
      this.setState({
        businessStatusError: "Debe seleccionar una opción"
      });
    }
  }

  _changeNeed(value) {
    if (value === '' || value === undefined || value === null) {
      this.setState({needError: 'Debe seleccionar una opción'});
    }
  }

  _closeCancelConfirmChanType() {
    contollerErrorChangeType = false;
    this.setState({showConfirmChangeTypeVisit: false });
  }

  _closeConfirmChangeType() {
    contollerErrorChangeType = false;
    const {selectsReducer} = this.props;
    idTypeVisitAuxTwo = idTypeVisitAux;
    /*const typeSeleted = _.filter(selectsReducer.get(PREVISIT_TYPE), ['id', parseInt(idTypeVisitAux)]);
    if(typeSeleted !== null && typeSeleted !== '' && typeSeleted !== undefined) {
      valueTypePrevisit = typeSeleted[0].key;
    }*/
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

  _changeDatePreVisit(value) {
    this.setState({
      datePreVisit: value,
      datePreVisitError: null
    });
  }

  _changeDatePreVisitOnBlur(value) {
    var date = value.target.value;
    if(date === '' || date === undefined || date === null) {
      this.setState({
        dateVisitError: "Debe seleccionar una opción"
      });
    }
  }

  _onCloseButton() {
    message = "¿Está seguro que desea salir de la pantalla de creación de pipeline?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  _closeConfirmCloseVisit() {
    this.setState({showConfirm: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _submitCreatePipeline() {
    const {fields: {idUsuario, commision, roe}, createEditPipeline} = this.props;
    var errorInForm = false;
    if( this.state.businessStatus === null || this.state.businessStatus === undefined || this.state.businessStatus === "" ) {
      errorInForm = true;
      this.setState({
        businessStatusError: "Debe seleccionar una opción"
      });
    }
    if( this.state.currency === null || this.state.currency === undefined || this.state.currency === "" ) {
      errorInForm = true;
      this.setState({
        currencyError: "Debe seleccionar una opción"
      });
    }
    if (this.state.startDate === null || this.state.startDate === undefined || this.state.startDate === "") {
      errorInForm = true;
      this.setState({
        startDateError: "Debe ingresar un valor"
      });
    }
    if (this.state.endDate === null || this.state.endDate === undefined || this.state.endDate === "") {
      errorInForm = true;
      this.setState({
        endDateError: "Debe ingresar un valor"
      });
    }

    if( !errorInForm ) {
      //if(typeButtonClick === SAVE_DRAFT ) {
        let pipelineJson = {
          "id": null,
          "client": window.localStorage.getItem('idClientSelected'),
          "documentStatus": typeButtonClick,
          "product": this.state.product,
          "businessStatus": this.state.businessStatus,
          "employeeResponsible": idUsuario.value,
          "currency": this.state.currency,
          "indexing": this.state.indexing,
          "commission": commision.value,
          "businessWeek": this.state.businessWeek,
          "need": this.state.need,
          "priority": this.state.priority,
          "roe": roe.value,
          "registeredCountry": this.state.registeredCountry,
          "observations": this.state.observations,
          "termInMonths": this.state.termInMonths,
          "value": this.state.value,
          "startDate": parseInt(moment(this.state.startDate).format('x')),
          "endDate": parseInt(moment(this.state.endDate).format('x'))
        };
        createEditPipeline(pipelineJson).then((data)=> {
          if((_.get(data, 'payload.data.validateLogin') === 'false')) {
            redirectUrl("/login");
          } else {
            if( (_.get(data, 'payload.data.status') === 200) ) {
              typeMessage = "success";
              titleMessage = "Creación pipeline";
              message = "Señor usuario, el pipeline se creó de forma exitosa.";
              this.setState({showMessageCreatePipeline :true});
            } else {
              typeMessage = "error";
              titleMessage = "Creación pipeline";
              message = "Señor usuario, ocurrió un error creando el pipeline.";
              this.setState({showMessageCreatePipeline :true});
            }
          }
        }, (reason) =>{
          typeMessage = "error";
          titleMessage = "Creación pipeline";
          message = "Señor usuario, ocurrió un error creando del pipeline.";
          this.setState({showMessageCreatePipeline :true});
        });
      //} else {
      //  this.setState({showErrorSavePipeline :true});
      //}
    } else {
      typeMessage = "error";
      titleMessage = "Campos obligatorios";
      message = "Señor usuario, debe ingresar todos los campos obligatorios.";
      this.setState({showMessageCreatePipeline :true});
    }
  }

  updateKeyValueUsersBanco(e) {
    const {fields: {nameUsuario, idUsuario}, filterUsersBanco} = this.props;
    if(e.keyCode == 13 || e.which == 13){
      e.preventDefault();
      if( nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined ){
        $('.ui.search.participantBanc').toggleClass('loading');
        filterUsersBanco(nameUsuario.value).then((data) => {
          let usersBanco = _.get(data, 'payload.data.data');
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
                  nameUsuario.onChange(event.title);
                  idUsuario.onChange(event.idUsuario);
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
      //cargoUsuario.onChange(userSelected.contactPosition);
      //empresaUsuario.onChange(userSelected.company);
    }
  }

  componentWillMount() {
    //valueTypePrevisit = null;
    idTypeVisitAux = null;
    idTypeVisitAuxTwo = null;
    contollerErrorChangeType = false;
    const {clientInformacion, getMasterDataFields, getPipelineProducts, getPipelineCurrencies, getClientNeeds} = this.props;
    const infoClient = clientInformacion.get('responseClientInfo');
    getPipelineProducts();
    getPipelineCurrencies();
    getClientNeeds();
    //valueTypePrevisit = null;
    if(_.isEmpty(infoClient)) {
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY]);
    }
  }

  _onBlurEvent(formData, value) {
    console.log('OnBlurEvent formData -> ', formData);
    console.log('OnBlurEvent value -> ', value);
    let cleanData = numeral(value).format('0,0[.0000]');
    formData.onChange(cleanData);
  }

  _onFocusEvent(formData, value) {
    console.log('OnFocusEvent formData -> ', formData);
    console.log('OnFocusEvent value -> ', value);
    let cleanData = numeral(value).format('0');
    formData.onChange(cleanData);
  }

  render() {
    const { fields:{nameUsuario, idUsuario, value, commission, roe, termInMonths}, clientInformacion, selectsReducer, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitCreatePipeline)} className="my-custom-tab"
        style={{backgroundColor: "#FFFFFF", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>
        
        <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
        <Row style={{padding: "10px 10px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"99%", marginBottom:"10px"}}/>
              <i className="browser icon" style={{fontSize: "20px"}}/>
              <span style={{fontSize: "20px"}}> Datos de pipeline</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Negocio / Producto</span>
              </dt>
              <ComboBox
                name="product"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'product'}
                value={this.state.product}
                touched={true}
                error={this.state.productError}
                onChange={val => this._changeProduct(val)}
                onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get('pipelineProducts') || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Estado (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <ComboBox
                name="businessStatus"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                value={this.state.businessStatus}
                touched={true}
                error={this.state.businessStatusError}
                onChange={val => this._changeBusinessStatus(val)}
                onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_STATUS) || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Empleado responsable</span>
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
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Indexación</span>
              </dt>
              <ComboBox
                name="indexing"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                value={this.state.indexing}
                touched={true}
                //error={this.state.typePreVisitError}
                //onChange={val => this._changeTypePreVisit(val)}
                //onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_INDEXING) || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Interés/Comisión</span>
              </dt>
              <Input
                name="commission"
                type="text"
                {...commission}
                //onChange={val => this._handleBlurValueNumber(REAL, commission, val)}
                onBlur={val => this._onBlurEvent(commission, val)}
                onFocus={val => this._onFocusEvent(commission, val)}
                max="7"
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Negocio de la semana</span>
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
                onBlur={() => console.log("")}
                parentId="dashboardComponentScroll"
                data={[{id: true, value: 'Si'}, {id:false, value: 'No'}]}
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Necesidad del cliente (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <ComboBox
                name="need"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'need'}
                value={this.state.need}
                touched={true}
                error={this.state.needError}
                onChange={val => this._changeNeed(val)}
                onBlur={() => console.log("")}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get('pipelineClientNeeds') || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Prioridad</span>
              </dt>
              <ComboBox
                name="priority"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                value={this.state.priority}
                touched={true}
                //error={this.state.typePreVisitError}
                //onChange={val => this._changeTypePreVisit(val)}
                //onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_PRIORITY) || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>ROE</span>
              </dt>
              <Input
                name="roe"
                type="text"
                {...roe}
                onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, roe, val)}
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>País libro</span>
              </dt>
              <ComboBox
                name="registeredCountry"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                value={this.state.registeredCountry}
                touched={true}
                //error={this.state.typePreVisitError}
                //onChange={val => this._changeTypePreVisit(val)}
                //onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get(FILTER_COUNTRY) || []}
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}> Observaciones </span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <Textarea
              name="observations"
              type="text"
              max="3500"
              value={this.state.observations}
              touched={true}
              onChange={val => this._changeTargetObservations(val)}
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
            />
          </Col>
        </Row>
        <Row style={{padding: "20px 23px 20px 20px"}}>
          <Col xs={12} md={12} lg={12}>
            <div style={{fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px"}}>
              <div className="tab-content-row" style={{borderTop: "1px dotted #cea70b", width:"100%", marginBottom:"10px"}}/>
              <i className="book icon" style={{fontSize: "18px"}}/>
              <span style={{fontSize: "20px"}}>Detalle de plazo y monto</span>
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Moneda (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <ComboBox
                name="currency"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'code'}
                value={this.state.currency}
                touched={true}
                error={this.state.currencyError}
                onChange={val => this._changeCurrency(val)}
                onBlur={() => console.log("")}
                //parentId="dashboardComponentScroll"
                data={selectsReducer.get('pipelineCurrencies') || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Valor (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <Input
                name="value"
                type="text"
                {...value}
                onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, value, val)}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Plazo en meses</span>
              </dt>
              <Input
                name="termInMonths"
                type="text"
                {...termInMonths}
                onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, termInMonths, val)}
                max="4"
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de inicio - DD/MM/YYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY hh:mm a"}
                time={true}
                value={this.state.startDate}
                touched={true}
                error={this.state.startDateError}
                onChange={val => this._changeDatePreVisit(val)}
                onBlur={val => this._changeDatePreVisitOnBlur(val)}
              />
            </dt>
          </Col>
          <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de finalización - DD/MM/YYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={"DD/MM/YYYY hh:mm a"}
                time={true}
                value={this.state.endDate}
                touched={true}
                error={this.state.endDateError}
                onChange={val => this._changeDatePreVisit(val)}
                onBlur={val => this._changeDatePreVisitOnBlur(val)}/>
            </dt>
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
        {/*
        <SweetAlert
          type="error"
          show={this.state.showErrorSavePipeline}
          title="Error participantes"
          text="Señor usuario, para guardar un pipeline como mínimo debe agregar un participante por parte del Grupo Bancolombia y otro por parte del cliente."
          onConfirm={() => this.setState({showErrorSavePipeline:false})}
        />
        */}
        <SweetAlert
          type={typeMessage}
          show={this.state.showMessageCreatePipeline}
          title={titleMessage}
          text={message}
          onConfirm={this._closeMessageCreatePipeline}
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
          onConfirm={this._closeConfirmCloseVisit}
        />
        <SweetAlert
          type= "warning"
          show={this.state.showConfirmChangeTypeVisit}
          title="Tipo de visita"
          text="Señor usuario, si cambia el “Tipo de visita” la información diligenciada en la sección Metodología Challenger se borrará. ¿Estás seguro que desea cambiar el Tipo de visita? "
          confirmButtonColor= '#DD6B55'
          confirmButtonText= 'Sí, estoy seguro!'
          cancelButtonText = "Cancelar"
          showCancelButton= {true}
          onCancel= {this._closeCancelConfirmChanType}
          onConfirm={this._closeConfirmChangeType}
        />
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    getPipelineProducts,
    getPipelineCurrencies,
    getClientNeeds,
    createEditPipeline,
    filterUsersBanco
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, contactsByClient}, ownerProps) {
    return {
      clientInformacion,
      selectsReducer,
      contactsByClient
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormPipeline);
