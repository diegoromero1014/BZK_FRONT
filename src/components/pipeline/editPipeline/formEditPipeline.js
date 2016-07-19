import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {redirectUrl} from '../../globalComponents/actions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Input from '../../../ui/input/inputComponent';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import ComboBoxFilter from '../../../ui/comboBoxFilter/comboBoxFilter';
import Textarea from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import {PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, PIPELINE_PRODUCTS, FILTER_COUNTRY} from '../../selectsComponent/constants';
import {consultDataSelect, consultList, getMasterDataFields, getPipelineProducts, getPipelineCurrencies, getClientNeeds} from '../../selectsComponent/actions';
import {SAVE_DRAFT, SAVE_PUBLISHED, OPTION_REQUIRED, VALUE_REQUIERED, DATE_FORMAT, DATETIME_FORMAT, REVIEWED_DATE_FORMAT, DATE_START_AFTER} from '../../../constantsGlobal';
import {PROPUEST_OF_BUSINESS, POSITIVE_INTEGER, INTEGER, REAL, LAST_PIPELINE_REVIEW} from '../constants';
import {createEditPipeline, getPipelineById, pdfDescarga} from '../actions';
import {consultParameterServer} from '../../../actionsGlobal';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import {filterUsersBanco} from '../../participantsVisitPre/actions';
import _ from 'lodash';
import $ from 'jquery';
import numeral from 'numeral';

const fields = ["id", "nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths", "businessStatus",
    "businessWeek", "currency", "indexing", "endDate", "need", "observations", "product",
    "priority", "registeredCountry", "startDate", "client", "documentStatus", "reviewedDate",
    "createdBy", "updatedBy", "createdTimestamp", "updatedTimestamp", "createdByName", "updatedByName"
    ];

let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick;
let datePipelineLastReview;

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
    if(values.endDate && values.startDate){
      if( moment(values.startDate, 'DD/MM/YYYY').isAfter(values.endDate) ){
        errors.startDate = DATE_START_AFTER;
      } else {
        errors.startDate = null;
      }
    }
    return errors;
};

class FormEditPipeline extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  showMessageCreatePipeline: false,
		  isEditable: false,
		  showConfirm: false
		}

		this._submitCreatePipeline = this._submitCreatePipeline.bind(this);
		this._closeMessageCreatePipeline = this._closeMessageCreatePipeline.bind(this);
		this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
		this._updateValue = this._updateValue.bind(this);
		this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
		this._onCloseButton = this._onCloseButton.bind(this);
		this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
		this._changeCurrency = this._changeCurrency.bind(this);
		this._editPipeline = this._editPipeline.bind(this);
		this._onClickPDF = this._onClickPDF.bind(this);
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

	_onClickPDF() {
	    const {pdfDescarga, fields: {id}} = this.props;
	    pdfDescarga(window.localStorage.getItem('idClientSelected'), id.value);
	 }

	_changeCurrency(value) {
		if (value !== null && value !== undefined && value !== '' && this.state.currency !== '') {
		  this.setState({currencyChanged: true});
		} else {
		  this.setState({currencyError: "debe seleccionar una opción"});
		}
		this.setState({currency: value});
	}

	_handleBlurValueNumber(typeValidation ,valuReduxForm, val) {
		//Elimino los caracteres no validos
		for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++){
		 if (validos.indexOf(val.toString().charAt(i)) != -1){
		    output += val.toString().charAt(i)
		  }
		}
		val = output;

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

	_onCloseButton() {
		message = "¿Está seguro que desea salir de la pantalla de creación de pipeline?";
		titleMessage = "Confirmación salida";
		this.setState({showConfirm :true});
	}

	_closeConfirmClosePipeline() {
		this.setState({showConfirm: false });
		redirectUrl("/dashboard/clientInformation");
	}

	_submitCreatePipeline() {
		const {initialValues, fields: {id, idUsuario, value, commission, roe, termInMonths, businessStatus,
		  businessWeek, currency, indexing, endDate, need, observations, product,
		  priority, registeredCountry, startDate, client, documentStatus
		}, createEditPipeline} = this.props;

		let pipelineJson = {
		"id": id.value,
		"client": window.localStorage.getItem('idClientSelected'),
		"documentStatus": typeButtonClick,
		"product": product.value,
		"businessStatus": businessStatus.value,
		"employeeResponsible": idUsuario.value,
		"currency": currency.value,
		"indexing": indexing.value,
		"commission": commission.value,
		"businessWeek": businessWeek.value,
		"need": need.value,
		"priority": priority.value,
		"roe": roe.value,
		"registeredCountry": registeredCountry.value,
		"observations": observations.value,
		"termInMonths": termInMonths.value,
		"value": numeral(value.value).format('0'),
		"startDate": parseInt(moment(startDate.value, DATE_FORMAT).format('x')),
		"endDate": parseInt(moment(endDate.value, DATE_FORMAT).format('x'))
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
		  //cargoUsuario.onChange(userSelected.contactPosition);
		  //empresaUsuario.onChange(userSelected.company);
		}
	}

	_editPipeline() {
    this.setState({
      isEditable: !this.state.isEditable
    });
  }

	componentWillMount() {
		const {clientInformacion, getMasterDataFields, getPipelineProducts, getPipelineCurrencies,
			getClientNeeds, getPipelineById, id,
			fields: {
				nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
    			businessWeek, currency, indexing, endDate, need, observations, product,
    			priority, registeredCountry, startDate, client, documentStatus
			}} = this.props;
		const infoClient = clientInformacion.get('responseClientInfo');
		getPipelineProducts();
		getPipelineCurrencies();
		getClientNeeds();
		if(_.isEmpty(infoClient)) {
		    redirectUrl("/dashboard/clientInformation");
		} else {
		  getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY]);
		}
		getPipelineById(id);
	}
	
	render() {
		const {initialValues, fields: {nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
              businessWeek, currency, indexing, endDate, need, observations, product,
              priority, registeredCountry, startDate, client, documentStatus,
          		updatedBy, createdTimestamp, updatedTimestamp, createdByName, updatedByName, reviewedDate},
          clientInformacion, selectsReducer, handleSubmit, pipelineReducer, consultParameterServer} = this.props;
			
		const pipeline = pipelineReducer.get('detailPipeline');
		const ownerDraft = pipelineReducer.get('ownerDraft');

        return(
			<form onSubmit={handleSubmit(this._submitCreatePipeline)} className="my-custom-tab"
				style={{backgroundColor: "#FFFFFF", paddingTop:"10px", width: "100%", paddingBottom: "50px"}}>

				{/* <span style={{marginLeft: "20px"}} >Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span> */}
				<Row style={{padding: "5px 10px 0px 20px"}}>
		          <Col xs={10} sm={10} md={10} lg={10}>
		            <span>Los campos marcados con asterisco (<span style={{color: "red"}}>*</span>) son obligatorios.</span>
		          </Col>
		          <Col xs={2} sm={2} md={2} lg={2}>
		            <button type="button" onClick={this._editPipeline} className={'btn btn-primary modal-button-edit'} style={{marginRight:'15px', float:'right', marginTop:'-15px'}}>Editar <i className={'icon edit'}></i></button>
		          </Col>
		        </Row>
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
				        {...product}
				        parentId="dashboardComponentScroll"
				        data={selectsReducer.get('pipelineProducts') || []}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				          {/* <div className="ui icon input"> */}
				            <ComboBoxFilter className="prompt" id="inputParticipantBanc"
				              style={{borderRadius: "3px"}}
				              autoComplete="off"
				              type="text"
				              {...nameUsuario}
				              value={nameUsuario.value}
				              onChange={nameUsuario.onChange}
				              placeholder="Ingrese un criterio de búsqueda..."
				              onKeyPress={this.updateKeyValueUsersBanco}
				              onSelect={val => this._updateValue(val)}
				              disabled={this.state.isEditable ? '' : 'disabled'}
				            />
				          {/* </div> */}
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
				        {...indexing}
				        parentId="dashboardComponentScroll"
				        data={selectsReducer.get(PIPELINE_INDEXING) || []}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        max="7"
				        parentId="dashboardComponentScroll"
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        parentId="dashboardComponentScroll"
				        onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, roe, val)}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        {...need}
				        parentId="dashboardComponentScroll"
				        data={selectsReducer.get('pipelineClientNeeds') || []}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        disabled={this.state.isEditable ? '' : 'disabled'}
				      />
				    </div>
				  </Col>
				  <Col xs={6} md={3} lg={3}>
				    <div style={{paddingRight: "15px"}}>
				      <dt>
				        <span>Valor en miles (</span><span style={{color: "red"}}>*</span>)
				      </dt>
				      <Input
				        name="value"
				        type="text"
				        {...value}
				        parentId="dashboardComponentScroll"
				        onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, value, val)}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        parentId="dashboardComponentScroll"
				        onChange={val => this._handleBlurValueNumber(POSITIVE_INTEGER, termInMonths, val)}
				        max="4"
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				        format={DATE_FORMAT}
				        time={false}
				        {...startDate}
				        disabled={this.state.isEditable ? '' : 'disabled'}
				      />
				    </dt>
				  </Col>
				  <Col xs={6} md={3} lg={3} style={{paddingRight: "20px"}}>
				    <dt>
				      <span>Fecha de finalización - DD/MM/YYY (</span><span style={{color: "red"}}>*</span>)
				    </dt>
				    <dt>
				      <DateTimePickerUi
				        {...endDate}
				        culture='es'
				        format={DATE_FORMAT}
				        time={false}
				        disabled={this.state.isEditable ? '' : 'disabled'}
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
				      disabled={this.state.isEditable ? '' : 'disabled'}
				    />
				  </Col>
				</Row>
				<Row>
		          <Col xs={12} md={12} lg={12}>
		            <div style={{textAlign:"left", marginTop:"0px", marginBottom:"20px", marginLeft:"20px"}}>
		            <span style={{fontWeight: "bold", color: "#818282"}}>Fecha última revisión formato previsita: </span><span style={{marginLeft: "0px", color: "#818282"}}>{reviewedDate.value}</span>
		            </div>
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
		        <Row style={{padding: "5px 10px 20px 20px"}}>
		          <Col xs={6} md={3} lg={3}>
		            <span style={{marginLeft: "0px", color: "#818282"}}>{createdByName.value}</span>
		          </Col>
		          <Col xs={6} md={3} lg={3}>
		            <span style={{marginLeft: "0px", color: "#818282"}}>{createdTimestamp.value}</span>
		          </Col>
		          <Col xs={6} md={3} lg={3}>
		            <span style={{marginLeft: "0px", color: "#818282"}}>{updatedByName.value}</span>
		          </Col>
		          <Col xs={6} md={3} lg={3}>
		            <span style={{marginLeft: "0px", color: "#818282"}}>{updatedTimestamp.value}</span>
		          </Col>
		        </Row>
				<div className="" style={{position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width:"100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height:"50px", background: "rgba(255,255,255,0.75)"}}>
				  <div style={{width: "580px", height: "100%", position: "fixed", right: "0px"}}>
				    <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={this.state.isEditable === true && ownerDraft === 0 ?  {float:"right", margin:"8px 0px 0px -120px", position:"fixed", backgroundColor:"#00B5AD"} : {display: "none"}}>
				      <span style={{color: "#FFFFFF", padding:"10px"}}>Guardar como borrador</span>
				    </button>
				    <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED}  style={this.state.isEditable === true ? {float:"right", margin:"8px 0px 0px 107px", position:"fixed"} : {display: "none"}}>
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
    getPipelineById
  }, dispatch);
}

function mapStateToProps({clientInformacion, selectsReducer, contactsByClient, pipelineReducer}, ownerProps) {
	const pipeline = pipelineReducer.get('detailPipeline');
	if (pipeline) {
		return {
	      clientInformacion,
	      selectsReducer,
	      contactsByClient,
	      pipelineReducer,
	      pdfDescarga,
	      consultParameterServer,

	      initialValues: {
	      	id: pipeline.id,
	      	businessStatus: pipeline.businessStatus,
		    businessWeek: pipeline.businessWeek,
		    commission: pipeline.commission,
		    currency: pipeline.currency,
		    idUsuario: pipeline.employeeResponsible,
		    nameUsuario: pipeline.employeeResponsibleName,
		    endDate: moment(pipeline.endDate).format(DATE_FORMAT),
		    indexing: pipeline.indexing,
		    need: pipeline.need,
		    observations: pipeline.observations,
		    product: pipeline.product,
		    priority: pipeline.priority,
		    roe: pipeline.roe,
		    registeredCountry: pipeline.registeredCountry,
		    startDate: moment(pipeline.startDate).format(DATE_FORMAT),
		    pipelineStatus: pipeline.pipelineStatus,
		    termInMonths: pipeline.termInMonths,
		    value: pipeline.value,
		    client: pipeline.client,
		    documentStatus: pipeline.documentStatus,
		    createdBy: pipeline.createdBy,
		    updatedBy: pipeline.updatedBy,
		    createdTimestamp: moment(pipeline.createdTimestamp).format(DATETIME_FORMAT),
		    updatedTimestamp: moment(pipeline.updatedTimestamp).format(DATETIME_FORMAT),
		    createdByName: pipeline.createdByName,
		    updatedByName: pipeline.updatedByName,
		    reviewedDate: moment(pipeline.reviewedDate, "x").locale('es').format(REVIEWED_DATE_FORMAT)
	      }
	    };
	} else {
		return {
	      clientInformacion,
	      selectsReducer,
	      contactsByClient,
	      pipelineReducer,
	      pdfDescarga,
	      consultParameterServer
	  	};
	}
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(FormEditPipeline);
