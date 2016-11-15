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
import {PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, PIPELINE_PRODUCTS, FILTER_COUNTRY, PIPELINE_BUSINESS} from '../../selectsComponent/constants';
import {getMasterDataFields, getPipelineProducts, getPipelineCurrencies, getClientNeeds} from '../../selectsComponent/actions';
import {LAST_PIPELINE_REVIEW} from '../constants';
import {createEditPipeline} from '../actions';
import {SAVE_DRAFT, SAVE_PUBLISHED, OPTION_REQUIRED, VALUE_REQUIERED, DATE_FORMAT, REVIEWED_DATE_FORMAT, DATE_START_AFTER, MESSAGE_SAVE_DATA} from '../../../constantsGlobal';
import {consultParameterServer, formValidateKeyEnter, nonValidateEnter} from '../../../actionsGlobal';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import {changeStateSaveData} from '../../dashboard/actions';
import _ from 'lodash';
import $ from 'jquery';
import numeral from 'numeral';

const fields = ["nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths", "businessStatus",
    "businessWeek", "currency", "indexing", "endDate", "need", "observations", "business", "product", "reviewedDate",
    "priority", "registeredCountry", "startDate", "client", "documentStatus", "probability"];

let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick = null;
let datePipelineLastReview;
let idCurrencyAux = null;
let contollerErrorChangeType = false;

const validate = values => {
    const errors = {};
    if (!values.businessStatus) {
      errors.businessStatus = OPTION_REQUIRED;
    } else {
      errors.businessStatus = null;
    }
    if (!values.value) {
      errors.value = VALUE_REQUIERED;
    } else {
      errors.value = null;
    }
    if (!values.currency) {
      errors.currency = OPTION_REQUIRED;
    } else {
      errors.currency = null;
    }
    if (!values.need) {
      errors.need = OPTION_REQUIRED;
    } else {
      errors.need = null;
    }
    if (!values.startDate) {
      errors.startDate = VALUE_REQUIERED;
    } else {
      errors.startDate = null;
    }
    if (!values.endDate) {
      errors.endDate = VALUE_REQUIERED;
    } else {
      errors.endDate = null;
    }
    if(values.endDate && values.startDate) {
      var startDate = parseInt(moment(values.startDate, DATE_FORMAT).format('x'));
  		var endDate = parseInt(moment(values.endDate, DATE_FORMAT).format('x'));
      if( startDate > endDate){
        errors.startDate = DATE_START_AFTER;
      } else {
        errors.startDate = null;
      }
    }
    return errors;
};

class FormPipeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessageCreatePipeline: false,
      showConfirm: false,
      employeeResponsible: false,
      showConfirmChangeCurrency: false,
      errorBusinessPipeline: null
    };

    this._submitCreatePipeline = this._submitCreatePipeline.bind(this);
    this._closeMessageCreatePipeline = this._closeMessageCreatePipeline.bind(this);
    this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
    this._updateValue = this._updateValue.bind(this);
    this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
    this._handleFocusValueNumber = this._handleFocusValueNumber.bind(this);
    this._onCloseButton = this._onCloseButton.bind(this);
    this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
    this._changeCurrency = this._changeCurrency.bind(this);
    this._handleTermInMonths = this._handleTermInMonths.bind(this);
    this._closeConfirmChangeCurrency = this._closeConfirmChangeCurrency.bind(this);
    this._cleanForm = this._cleanForm.bind(this);
    this._closeCancelConfirmChanCurrency = this._closeCancelConfirmChanCurrency.bind(this);
  }

  // TODO: Revisar la asignación del state
  // Colcar aquí el limpiar el formulario
  _closeMessageCreatePipeline() {
    this.setState({
      showMessageCreatePipeline: false
    });
    if( typeMessage === "success" ) {
      this._cleanForm();
      redirectUrl("/dashboard/clientInformation");
    }
  }

  _cleanForm() {
    const {initialValues, fields: {nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
    businessWeek, currency, indexing, endDate, need, observations, product, reviewedDate,
    priority, registeredCountry, startDate, client, documentStatus}} = this.props;

    nameUsuario.onChange('');
    idUsuario.onChange('');
    value.onChange('');
    commission.onChange('');
    roe.onChange('');
    termInMonths.onChange('');
    businessStatus.onChange('');
    businessWeek.onChange('');
    currency.onChange('');
    indexing.onChange('');
    endDate.onChange('');
    need.onChange('');
    observations.onChange('');
    product.onChange('');
    reviewedDate.onChange('');
    priority.onChange('');
    registeredCountry.onChange('');
    startDate.onChange('');
    client.onChange('');
    documentStatus.onChange('');
    contollerErrorChangeType = false;
    idCurrencyAux = null;
  }

  _changeCurrency(currencyValue) {
    const {fields: {value}} = this.props;
    if (idCurrencyAux == null) {
        idCurrencyAux = parseInt(currencyValue);
    }

    if (currencyValue !== undefined && currencyValue !== '' && currencyValue !== null && parseInt(currencyValue) !== parseInt(idCurrencyAux) && !contollerErrorChangeType) {
      contollerErrorChangeType = true;

      if (idCurrencyAux !== null && value.value !== '') {
        titleMessage = "Tipo de moneda";
        message = "Señor usuario, sí cambia la “Moneda” la información diligenciada en el “Valor” se borrará. ¿Está seguro que desea cambiar la Moneda?";
        this.setState({
          showConfirmChangeCurrency: true
        });
      } else {
        idCurrencyAux = parseInt(currencyValue);
        contollerErrorChangeType = false;
        this.setState({
          showConfirmChangeCurrency: false
        });
      }
    } else {
      idCurrencyAux = parseInt(currencyValue);
      contollerErrorChangeType = false;
      this.setState({
          showConfirmChangeCurrency: false
      });
    }
    var lugarSelector = $('.valueMillions');
    var input = lugarSelector.find("input");
    input.focus();
  }

  _handleBlurValueNumber(typeValidation, valuReduxForm, val, allowsDecimal) {
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) !== -1){
        output += val.toString().charAt(i)
      }
    }
    val = output;

    /* Si typeValidation = 2 es por que el valor puede ser negativo
       Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
    */
    var decimal = '';
    if(val.includes(".")){
      var vectorVal = val.split(".");
      if(allowsDecimal){
        val = vectorVal[0] + '.';
        if(vectorVal.length > 1){
          decimal = vectorVal[1].substring(0, 4);
        }
      }else{
        val = vectorVal[0];
      }
    }

    if( typeValidation === 2 ) { //Realizo simplemente el formateo
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(val)){
        val = val.replace(pattern, "$1,$2");
      }
      valuReduxForm.onChange(val + decimal);
    } else { //Valido si el valor es negativo o positivo
      var value = numeral(valuReduxForm.value).format('0');
      if( value >= 0 ){
        pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)){
          val = val.replace(pattern, "$1,$2");
        }
        valuReduxForm.onChange(val + decimal);
      } else {
        valuReduxForm.onChange("");
      }
    }
  }

  _handleFocusValueNumber(valuReduxForm, val){
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) !== -1){
        output += val.toString().charAt(i)
      }
    }
    valuReduxForm.onChange(output);
  }

  _handleTermInMonths(valuReduxForm, val){
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "0123456789"; i < (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) !== -1){
        output += val.toString().charAt(i)
      }
    }
    valuReduxForm.onChange(output);
  }

  _onCloseButton() {
    message = "¿Está seguro que desea salir de la pantalla de creación de pipeline?";
    titleMessage = "Confirmación salida";
    this.setState({showConfirm :true});
  }

  _closeConfirmClosePipeline() {
    this.setState({showConfirm: false });
    redirectUrl("/dashboard/clientInformation");
  }

  _closeCancelConfirmChanCurrency() {
    this.setState({
      showConfirmChangeCurrency: false
    });
    contollerErrorChangeType = false;
    const {fields: {currency}} = this.props;
    if (idCurrencyAux !== null) {
      currency.onChange(idCurrencyAux);
    }

  }

  _closeConfirmChangeCurrency() {
    this.setState({
      showConfirmChangeCurrency: false
    });
    contollerErrorChangeType = false;
    const {fields: {value, currency}} = this.props;
    if (idCurrencyAux !== null) {
      value.onChange('');
    }
    idCurrencyAux = currency.value;
  }

  _submitCreatePipeline() {
    const {fields: {idUsuario, value, commission, roe, termInMonths, businessStatus,
      businessWeek, currency, indexing, endDate, need, observations, business, product,
      priority, registeredCountry, startDate, client, documentStatus, probability, nameUsuario
    }, createEditPipeline, changeStateSaveData} = this.props;

    if((nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null) && (idUsuario.value === null || idUsuario.value === '' || idUsuario.value === undefined)){
      this.setState({
        employeeResponsible: true
      });
    } else {
      if( (business.value !== "" && business.value !== null && business.value !== undefined) || typeButtonClick === SAVE_DRAFT ){
        let pipelineJson = {
          "id": null,
          "client": window.localStorage.getItem('idClientSelected'),
          "documentStatus": typeButtonClick,
          "product": product.value,
          "businessStatus": businessStatus.value,
          "employeeResponsible": nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null ? idUsuario.value : null,
          "currency": currency.value,
          "indexing": indexing.value,
          "commission": commission.value === undefined || commission.value === null || commission.value === '' ? '' : numeral(commission.value).format('0.0000'),
          "businessWeek": businessWeek.value,
          "need": need.value,
          "priority": priority.value,
          "roe": roe.value === undefined || roe.value === null || roe.value === '' ? '' : numeral(roe.value).format('0.0000'),
          "registeredCountry": registeredCountry.value,
          "observations": observations.value,
          "termInMonths": termInMonths.value,
          "pipelineBusiness": JSON.parse('[' + ((business.value) ? business.value : "") + ']'),
          "value": value.value === undefined ? null : numeral(value.value).format('0'),
          "startDate": parseInt(moment(startDate.value, DATE_FORMAT).format('x')),
          "endDate": parseInt(moment(endDate.value, DATE_FORMAT).format('x')),
        };
        changeStateSaveData(true, MESSAGE_SAVE_DATA);
        createEditPipeline(pipelineJson).then((data)=> {
          changeStateSaveData(false, "");
          if( !_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false' ){
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
          changeStateSaveData(false, "");
          typeMessage = "error";
          titleMessage = "Creación pipeline";
          message = "Señor usuario, ocurrió un error creando del pipeline.";
          this.setState({showMessageCreatePipeline :true});
        });
      }
    }
  }

  updateKeyValueUsersBanco(e) {
    const {fields: {nameUsuario, idUsuario}, filterUsersBanco} = this.props;
    var self = this;
    idUsuario.onChange('');
    if(e.keyCode === 13 || e.which === 13){
      e.preventDefault();
      if( nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined ){
        $('.ui.search.participantBanc').toggleClass('loading');
        filterUsersBanco(nameUsuario.value).then((data) => {
          let usersBanco = _.get(data, 'payload.data.data');
          $('.ui.search.participantBanc')
            .search({
              cache: false,
              source: usersBanco,
              maxResults : 1500,
              height: '250px',
              searchFields: [
                'title',
                'description',
                'idUsuario',
                'cargo'
              ],
              onSelect : function(event) {
                  nameUsuario.onChange(event.title);
                  idUsuario.onChange(event.idUsuario);
                  self.setState({
                    employeeResponsible: false
                  });
                  return 'default';
              }
            });
            $('.ui.search.participantBanc').toggleClass('loading');
            $('#inputParticipantBanc').focus();
          }
        );
      }
    }
  }

  _updateValue(value) {
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
    }
  }

  componentWillReceiveProps(nextProps){
    const {fields: {business}} = this.props;
    if(typeButtonClick === SAVE_PUBLISHED){
      if ( (business.value === null || business.value === undefined || business.value === "") && typeButtonClick !== null) {
        this.setState({
          errorBusinessPipeline: OPTION_REQUIRED
        });
      } else {
        this.setState({
          errorBusinessPipeline: null
        });
      }
    } else {
      this.setState({
        errorBusinessPipeline: null
      });
    }
  }

  componentWillMount() {
    const {nonValidateEnter, clientInformacion, getMasterDataFields, getPipelineProducts, getPipelineCurrencies, getClientNeeds, consultParameterServer} = this.props;
    nonValidateEnter(true);
    const infoClient = clientInformacion.get('responseClientInfo');
    getPipelineProducts();
    getPipelineCurrencies();
    getClientNeeds();
    typeButtonClick = null;
    this.setState({
      errorBusinessPipeline: null
    });
    if(_.isEmpty(infoClient)) {
        redirectUrl("/dashboard/clientInformation");
    } else {
      getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY, PIPELINE_BUSINESS]);
      consultParameterServer(LAST_PIPELINE_REVIEW).then((data)=> {
        if( data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
          data.payload.data.parameter !== undefined ){
          datePipelineLastReview = JSON.parse(data.payload.data.parameter).value;
          datePipelineLastReview = moment(datePipelineLastReview, "YYYY/DD/MM").locale('es').format("DD MMM YYYY");
        }
      });
    }
  }

  render() {
    const { fields: {nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
              businessWeek, currency, indexing, endDate, need, observations, business, product,
              priority, registeredCountry, startDate, client, documentStatus, probability},
          clientInformacion, selectsReducer, handleSubmit, reducerGlobal} = this.props;

    return(
      <form onSubmit={handleSubmit(this._submitCreatePipeline)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))} className="my-custom-tab"
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
          <Col xs={12} md={36} lg={6}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Negocio (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <MultipleSelect
                name="business"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                {...business}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_BUSINESS) || []}
              />
              {this.state.errorBusinessPipeline &&
                <div>
                  <div className="ui pointing red basic label">
                    {this.state.errorBusinessPipeline}
                  </div>
                </div>
              }
            </div>
          </Col>
          <Col xs={12} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Producto</span>
              </dt>
              <ComboBox
                name="product"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'product'}
                {...product}
                parentId="dashboardComponentScroll"
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
                {...businessStatus}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_STATUS) || []}
              />
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
                {...indexing}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_INDEXING) || []}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Interés / Comisión</span>
              </dt>
              <Input
                name="commission"
                type="text"
                {...commission}
                max="10"
                parentId="dashboardComponentScroll"
                onBlur={val => this._handleBlurValueNumber(2, commission, commission.value, true)}
                onFocus={val => this._handleFocusValueNumber(commission, commission.value)}
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
                max="10"
                parentId="dashboardComponentScroll"
                onBlur={val => this._handleBlurValueNumber(1, roe, roe.value, true)}
                onFocus={val => this._handleFocusValueNumber(roe, roe.value)}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Empleado responsable</span>
              </dt>
              <dt>
                <div className="ui dropdown search participantBanc fluid" style={{border :"0", zIndex : "1", padding : "0"}}>
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
                  <div className="menu results"></div>
                </div>
                {
                  this.state.employeeResponsible &&
                  <div>
                      <div className="ui pointing red basic label">
                          Debe seleccionar un empleado del banco
                      </div>
                  </div>
                }
              </dt>
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
                {...need}
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
                {...priority}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(PIPELINE_PRIORITY) || []}
              />
            </div>
          </Col>
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
                {...registeredCountry}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get(FILTER_COUNTRY) || []}
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Negocio de la semana</span>
              </dt>
              <ComboBox
                name="businessWeek"
                labelInput="Seleccione..."
                valueProp={'id'}
                textProp={'value'}
                {...businessWeek}
                parentId="dashboardComponentScroll"
                data={[{id: true, value: 'Si'}, {id:false, value: 'No'}]}
              />
            </div>
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
                {...currency}
                parentId="dashboardComponentScroll"
                data={selectsReducer.get('pipelineCurrencies') || []}
                onChange={val => this._changeCurrency(val)}
              />
            </div>
          </Col>
          <Col xs={6} md={3} lg={3}>
            <div style={{paddingRight: "15px"}}>
              <dt>
                <span>Valor en millones (</span><span style={{color: "red"}}>*</span>)
              </dt>
              <Input
                {...value}
                name="valueMillions"
                type="text"
                max="28"
                parentId="dashboardComponentScroll"
                onBlur={val => this._handleBlurValueNumber(1, value, value.value, false)}
                onFocus={val => this._handleFocusValueNumber(value, value.value)}
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
                max="4"
                parentId="dashboardComponentScroll"
                onBlur={val => this._handleTermInMonths(termInMonths, termInMonths.value)}
              />
            </div>
          </Col>
        </Row>
        <Row style={{padding: "0px 10px 20px 20px"}}>
          <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de inicio - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                culture='es'
                format={DATE_FORMAT}
                time={false}
                {...startDate}
              />
            </dt>
          </Col>
          <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
            <dt>
              <span>Fecha de finalización - DD/MM/YYYY (</span><span style={{color: "red"}}>*</span>)
            </dt>
            <dt>
              <DateTimePickerUi
                {...endDate}
                culture='es'
                format={DATE_FORMAT}
                time={false}
              />
            </dt>
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
              {...observations}
              title="La longitud máxima de caracteres es de 3500"
              style={{width: '100%', height: '178px'}}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div style={{textAlign:"left", marginTop:"0px", marginBottom:"20px", marginLeft:"20px"}}>
            <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato pipeline: </span><span style={{marginLeft: "0px", color: "#818282"}}>{datePipelineLastReview}</span>
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
          onConfirm={this._closeConfirmClosePipeline}
        />
        <SweetAlert
          type="warning"
          show={this.state.showConfirmChangeCurrency}
          title={titleMessage}
          text={message}
          confirmButtonColor= '#DD6B55'
          confirmButtonText= 'Sí, estoy seguro!'
          cancelButtonText = "Cancelar"
          showCancelButton= {true}
          onCancel= {this._closeCancelConfirmChanCurrency}
          onConfirm={this._closeConfirmChangeCurrency}
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
    filterUsersBanco,
    consultParameterServer,
    changeStateSaveData,
    nonValidateEnter
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, contactsByClient, reducerGlobal}, ownerProps) {
    return {
      clientInformacion,
      selectsReducer,
      contactsByClient,
      reducerGlobal
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormPipeline);
