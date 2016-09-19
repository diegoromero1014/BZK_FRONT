import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {Combobox, DateTimePicker, Multiselect} from 'react-widgets';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import {consultDataSelect, getMasterDataFields,  consultListWithParameterUbication} from '../../selectsComponent/actions';
import Input from '../../../ui/input/inputComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import moment from 'moment';
import SweetAlert from 'sweetalert-react';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {downloadFilePDF} from '../actions';
import {formValidateKeyEnter} from '../../../actionsGlobal';
import Textarea from '../../../ui/textarea/textareaComponent';
import {changeStateSaveData} from '../../dashboard/actions';
import {CONTACT_ID_TYPE, FILTER_FUNCTION_ID, FILTER_TYPE_LBO_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LOB_ID, FILTER_GENDER, FILTER_TITLE, FILTER_ATTITUDE_OVER_GROUP, FILTER_DEPENDENCY, FILTER_CONTACT_POSITION, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE} from '../../selectsComponent/constants';
import {getContactDetails, saveContact, clearClienEdit} from './actions';
import {contactsByClientFindServer,clearContactOrder,clearContactCreate} from '../actions';
import {FILE_OPTION_SOCIAL_STYLE_CONTACT} from '../../../constantsGlobal';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NUMBER_RECORDS} from '../constants';

const fields = ["contactId", "contactType", "contactTitle", "contactGender", "contactTypeOfContact", "contactPosition", "contactDependency", "contactAddress",
              "contactCountry", "contactProvince", "contactCity", "contactNeighborhood", "contactPostalCode", "contactTelephoneNumber", "contactExtension",
              "contactMobileNumber", "contactEmailAddress", "contactIdentityNumber", "contactFirstName", "contactMiddleName", "contactFirstLastName", "contactSecondLastName",
              "contactLineOfBusiness", "contactFunctions", "contactHobbies", "contactSports", "contactSocialStyle", "contactAttitudeOverGroup", "contactDateOfBirth"];

const validate = values => {
    const errors = {};
    if(!values.contactPosition){
      errors.contactPosition = "Debe seleccionar una opción";
    }else{
      errors.contactPosition = null;
    }
    if(!values.contactDependency){
      errors.contactDependency = "Debe seleccionar una opción";
    }else{
      errors.contactDependency = null;
    }
    if (!values.contactType) {
      errors.contactType = "Debe seleccionar una opción";
    } else {
      errors.contactType = null;
    }
    if (!values.contactTitle) {
      errors.contactTitle = "Debe seleccionar una opción";
    } else {
      errors.contactTitle = null;
    }
    if (!values.contactGender) {
      errors.contactGender = "Debe seleccionar una opción";
    } else {
      errors.contactGender = null;
    }
    if (!values.contactTypeOfContact) {
      errors.contactTypeOfContact = "Debe seleccionar una opción";
    } else {
      errors.contactTypeOfContact = null;
    }
    if (!values.contactCountry) {
      errors.contactCountry = "Debe seleccionar una opción";
    } else {
      errors.contactCountry = null;
    }
    if (!values.contactProvince) {
      errors.contactProvince = "Debe seleccionar una opción";
    } else {
      errors.contactProvince = null;
    }
    if (!values.contactCity) {
      errors.contactCity = "Debe seleccionar una opción";
    } else {
      errors.contactCity = null;
    }
    if (!values.contactIdentityNumber) {
      errors.contactIdentityNumber = "Debe ingresar un valor";
    } else {
      errors.contactIdentityNumber = null;
    }
    if (!values.contactFirstName) {
      errors.contactFirstName = "Debe ingresar un valor";
    } else {
      errors.contactFirstName = null;
    }
    if (!values.contactFirstLastName) {
      errors.contactFirstLastName = "Debe ingresar un valor";
    } else {
      errors.contactFirstLastName = null;
    }
    if(!values.contactEmailAddress){
      errors.contactEmailAddress = "Debe ingresar un valor";
    }else{
      if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(values.contactEmailAddress))){
          errors.contactEmailAddress = "Debe ingresar un formato válido";
      }else{
        errors.contactEmailAddress = null;
      }
    }
    if (!values.contactTelephoneNumber) {
      errors.contactTelephoneNumber = "Debe ingresar un valor";
    } else {
      errors.contactTelephoneNumber = null;
    }
    if (!values.contactFunctions) {
      errors.contactFunctions = "Debe seleccionar una opción";
    } else {
      errors.contactFunctions = null;
    }
    if (!values.contactAddress || values.contactAddress === '') {
      errors.contactAddress = "Debe ingresar un valor";
    } else {
      errors.contactAddress = null;
    }
    return errors;
};

class ContactDetailsModalComponent extends Component {

  /* Constructor de la clase ContactDetailModalComponent */
  constructor(props) {
    super(props);
    this._handlerSubmitContact = this._handlerSubmitContact.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);
    this._onChangeCountry = this._onChangeCountry.bind(this);
    this._onChangeProvince = this._onChangeProvince.bind(this);
    this._genero = this._genero.bind(this);
    this._uploadProvincesByCountryId = this._uploadProvincesByCountryId.bind(this);
    this._uploadCitiesByProvinceId = this._uploadCitiesByProvinceId.bind(this);
    this._editContact = this._editContact.bind(this);
    this._closeViewOrEditContact = this._closeViewOrEditContact.bind(this);
    this._downloadFileSocialStyle = this._downloadFileSocialStyle.bind(this);
    this.state = {
      contactEdited: false,
      isEditable: false,
      generoData:[],
      showEr:false,
    };
    momentLocalizer(moment);
  }

  /* Carga la información del contacto */
  componentWillMount() {
    const {getMasterDataFields, getContactDetails, contactId, _uploadProvinces,contactObject, _uploadCities} = this.props;
    const that = this;
    const {fields: {contactFunctions, contactHobbies, contactSports,contactLineOfBusiness}} = this.props;
    getMasterDataFields([CONTACT_ID_TYPE, FILTER_TITLE, FILTER_GENDER, FILTER_CONTACT_POSITION, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_TYPE_CONTACT_ID,
                        FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP]);
    getContactDetails(contactId, window.localStorage.getItem('idClientSelected'))
    .then(function(data) {
      const contact = JSON.parse(_.get(data, 'payload.data.contactDetail'));
      const {_uploadProvinces, _uploadCities} = that.props;
      if (contact.country !== undefined && contact.country !== null) {
        that._uploadProvincesByCountryId(contact.country);
      }
      if (contact.province !== undefined && contact.province !== null) {
        that._uploadCitiesByProvinceId(contact.province);
      }
      contactLineOfBusiness.onChange(JSON.parse('["'+_.join(contact.lineOfBusiness, '","')+'"]'));
      contactFunctions.onChange(JSON.parse('["'+_.join(contact.function, '","')+'"]'));
      contactHobbies.onChange(JSON.parse('["'+_.join(contact.hobbies, '","')+'"]'));
      contactSports.onChange(JSON.parse('["'+_.join(contact.sports, '","')+'"]'));
    });
  }

  _downloadFileSocialStyle(){
    const {downloadFilePDF} = this.props;
    downloadFilePDF(FILE_OPTION_SOCIAL_STYLE_CONTACT);
  }


  _genero(val){
    const {fields: {contactTitle,contactGender},selectsReducer} = this.props;
    var femenino = ['Señora','Señorita','Doctora'];
    var masculino = ['Señor','Doctor','Padre'];
    var genero;
    var tratamiento = _.get(_.filter(selectsReducer.get(FILTER_TITLE), ['id', parseInt(val)]), '[0].key');
    if(_.indexOf(femenino,tratamiento)  !== -1){
      genero = _.filter(selectsReducer.get(FILTER_GENDER), ['key', 'Femenino']);
    }else if(_.indexOf(masculino,tratamiento) !== -1){
      genero = _.filter(selectsReducer.get(FILTER_GENDER), ['key', 'Masculino']);
    }else{
      genero = selectsReducer.get(FILTER_GENDER);
    }
    contactGender.onChange('');
    this.setState({generoData : genero});
  }

  /* Cambio en los valores */
  _onchangeValue(type, val) {

    switch (type) {
      case "contactIdentityNumber":
        var {fields: {contactIdentityNumber}} = this.props;
        contactIdentityNumber.onChange(val);
        break;
      case "contactFirstName":
        var {fields: {contactFirstName}} = this.props;
        contactFirstName.onChange(val);
        break;
      case "contactFirstLastName":
        var {fields: {contactFirstLastName}} = this.props;
        contactFirstLastName.onChange(val);
        break;
      case "contactMiddleName":
        var {fields: {contactMiddleName}} = this.props;
        contactMiddleName.onChange(val);
        break;
      case "contactSecondLastName":
        var {fields: {contactSecondLastName}} = this.props;
        contactSecondLastName.onChange(val);
        break;
      case "contactPostalCode":
        var {fields: {contactPostalCode}} = this.props;
        contactPostalCode.onChange(val);
        break;
      case "contactTelephoneNumber":
        var {fields: {contactTelephoneNumber}} = this.props;
        contactTelephoneNumber.onChange(val);
        break;
      case "contactExtension":
        var {fields: {contactExtension}} = this.props;
        contactExtension.onChange(val);
        break;
      case "contactMobileNumber":
        var {fields: {contactMobileNumber}} = this.props;
        contactMobileNumber.onChange(val);
        break;
      case "contactEmailAddress":
        var {fields: {contactEmailAddress}} = this.props;
        contactEmailAddress.onChange(val);
        break;
      case "contactAddress":
        var {fields: {contactAddress}} = this.props;
        contactAddress.onChange(val);
        break;
      case "contactCountry":
        var {fields: {contactCountry}} = this.props;
        contactCountry.onChange(val);
        break;
      case "contactProvince":
        var {fields: {contactProvince}} = this.props;
        contactProvince.onChange(val);
        break;
      case "contactCity":
        var {fields: {contactCity}} = this.props;
        contactCity.onChange(val);
        break;
      case "contactDateOfBirth":
        const {fields: {contactDateOfBirth}} = this.props;
        contactDateOfBirth.onChange(val);
        break;
      default:
        break;
    }
    const {clearState} = this.props;
    clearState();
  }

  _onChangeCountry(val) {
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    if (val !== undefined && val !== null) {
      contactCountry.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(FILTER_PROVINCE, val);
    }
    contactProvince.onChange('');
    contactCity.onChange('');
  }

  _onChangeProvince(val) {
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    if (val !== undefined && val !== null) {
      contactProvince.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(FILTER_CITY, val);
    }
    contactCity.onChange('');
  }

  _uploadProvincesByCountryId(countryId) {
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    const {consultListWithParameterUbication} = this.props;
    if (countryId !== undefined && countryId !== null) {
      consultListWithParameterUbication(FILTER_PROVINCE, countryId);
    }
  }

  _uploadCitiesByProvinceId(provinceId) {
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    const {consultListWithParameterUbication} = this.props;
    if (provinceId !== undefined && provinceId !== null) {
      consultListWithParameterUbication(FILTER_CITY, provinceId);
    }
  }

  _editContact() {
    this.setState({
      isEditable: !this.state.isEditable
    });
  }

  _closeViewOrEditContact() {
    const {isOpen, clearClienEdit,clearContactOrder,clearContactCreate} = this.props;
    this.setState({contactEdited: false, isEditable: false});
    isOpen();
    this.props.resetForm();
    clearClienEdit();
    clearContactCreate();
    clearContactOrder();
  }

  /* metodo para enviar el formulario */
  _handlerSubmitContact() {
    const { fields: { contactId, contactTitle, contactGender, contactType, contactIdentityNumber, contactFirstName, contactMiddleName, contactFirstLastName,
      contactSecondLastName, contactPosition, contactDependency, contactAddress, contactCountry, contactProvince, contactCity, contactNeighborhood, contactPostalCode,
      contactTelephoneNumber, contactExtension, contactMobileNumber, contactEmailAddress, contactTypeOfContact, contactLineOfBusiness, contactFunctions, contactHobbies,
      contactSports, contactSocialStyle, contactAttitudeOverGroup, contactDateOfBirth
    }, error, handleSubmit, selectsReducer, isOpen, changeStateSaveData} = this.props;
    const {contactDetail,contactsByClientFindServer} = this.props;
    const contact = contactDetail.get('contactDetailList');
    const {saveContact} = this.props;
    const jsonUpdateContact = {
      "client": window.localStorage.getItem('idClientSelected'),
      "id": contact.id,
      "title": contactTitle.value !== undefined ? contactTitle.value : null,
      "gender": contactGender.value !== undefined ? contactGender.value : null,
      "contactType": contactType.value !== undefined ? contactType.value : null,
      "contactIdentityNumber": contactIdentityNumber.value !== undefined ? contactIdentityNumber.value : null,
      "firstName": contactFirstName.value !== undefined ? contactFirstName.value : null,
      "middleName": contactMiddleName.value !== undefined ? contactMiddleName.value : null,
      "firstLastName": contactFirstLastName.value !== undefined ? contactFirstLastName.value : null,
      "secondLastName": contactSecondLastName.value !== undefined ? contactSecondLastName.value : null,
      "contactPosition": contactPosition.value !== undefined ? contactPosition.value : null,
      "unit": contactDependency.value !== undefined ? contactDependency.value : null,
      "function" : JSON.parse('[' + ((contactFunctions.value)?contactFunctions.value:"") +']'),
      "dateOfBirth" : contactDateOfBirth.value !== '' && contactDateOfBirth.value !== null && contactDateOfBirth.value !== undefined ? moment(contactDateOfBirth.value, "DD/MM/YYYY").format('x'): null,
      "address": contactAddress.value !== undefined ? contactAddress.value : null,
      "country": contactCountry.value !== undefined ? contactCountry.value : null,
      "province": contactProvince.value !== undefined ? contactProvince.value : null,
      "city": contactCity.value !== undefined ? contactCity.value : null,
      "neighborhood": contactNeighborhood.value !== undefined ? contactNeighborhood.value : null,
      "postalCode": contactPostalCode.value !== undefined ? contactPostalCode.value : null,
      "typeOfAddress": null,
      "telephoneNumber": contactTelephoneNumber.value !== undefined ? contactTelephoneNumber.value : null,
      "extension": contactExtension.value !== undefined ? contactExtension.value : null,
      "mobileNumber": contactMobileNumber.value !== undefined ? contactMobileNumber.value : null,
      "emailAddress": contactEmailAddress.value !== undefined ? contactEmailAddress.value : null,
      "modeOfContact": null,
      "registryKey": null,
      "notes": null,
      "hobbies" : JSON.parse('[' + ((contactHobbies.value)?contactHobbies.value:"") +']'),
      "sports" : JSON.parse('[' + ((contactSports.value)?contactSports.value:"") +']'),
      "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
      "shippingInformation": null,
      "lineOfBusiness" : JSON.parse('[' + ((contactLineOfBusiness.value) ? contactLineOfBusiness.value:"") +']'),
      "socialStyle": contactSocialStyle.value !== undefined ? contactSocialStyle.value : null,
      "attitudeOverGroup": contactAttitudeOverGroup.value !== undefined ? contactAttitudeOverGroup.value : null
    }
    changeStateSaveData(true);
    saveContact(jsonUpdateContact).then((data) => {
      changeStateSaveData(false);
      if (_.get(data, 'payload.data.status') === 200) {
        this.setState({contactEdited: true});
        contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
              "",
              "",
              "");
          } else {
          this.setState({showEr: true});
          }
      }, (reason) => {
        changeStateSaveData(false);
        this.setState({showEr: true});
      });
  }

  render() {
    const { initialValues, fields: {
      contactId, contactTitle, contactGender, contactType, contactIdentityNumber, contactFirstName, contactMiddleName, contactFirstLastName,
      contactSecondLastName, contactPosition, contactDependency, contactAddress, contactCountry, contactProvince, contactCity, contactNeighborhood,
      contactPostalCode, contactTelephoneNumber, contactExtension, contactMobileNumber, contactEmailAddress, contactTypeOfContact, contactLineOfBusiness,
      contactFunctions, contactHobbies, contactSports, contactSocialStyle, contactAttitudeOverGroup, contactDateOfBirth
    }, error, handleSubmit, selectsReducer} = this.props;
    return (
      <form onSubmit={handleSubmit(this._handlerSubmitContact)} onKeyPress={val => formValidateKeyEnter(val)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalEditCotact">
          <dt className="business-title" style={{fontSize: '17px'}}>
            <span style={{paddingLeft: '20px'}}>Información básica contacto</span>
          </dt>
            <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
              <Row>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt><span>Tipo de documento</span></dt>
                  <dt>
                    <p style={{fontWeight: "normal"}}>
                      {(contactType.value !== "" && contactType.value !== null && contactType.value !== undefined && !_.isEmpty(selectsReducer.get(CONTACT_ID_TYPE))) ? _.get(_.filter(selectsReducer.get(CONTACT_ID_TYPE), ['id', parseInt(contactType.value)]), '[0].value') : ''}
                    </p>
                  </dt>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>Número de documento</span></dt>
                  <dt>
                    <p style={{fontWeight: "normal"}}>
                      {contactIdentityNumber.value}
                    </p>
                  </dt>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <button type="button" onClick={this._editContact} className={'btn btn-primary modal-button-edit'} style={{marginTop: '35px'}}>Editar <i className={'icon edit'}></i></button>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt><span>{'Tratamiento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactTitle"
                      labelInput="Seleccione"
                      {...contactTitle}
                      onChange={val => this._genero(val)}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_TITLE) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt><span>{'Género ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactGender"
                      labelInput="Seleccione"
                      {...contactGender}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={this.state.generoData ? this.state.generoData : selectsReducer.get(FILTER_GENDER)}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Primer nombre ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                      name="contactFirstName"
                      type="text"
                      max="60"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactFirstName}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Segundo nombre'}</span></dt>
                  <dd>
                    <Input
                        name="contactMiddleName"
                        type="text"
                        max="60"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        {...contactMiddleName}
                      />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Primer apellido ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                        name="contactFirstLastName"
                        type="text"
                        max="60"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        {...contactFirstLastName}
                      />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Segundo apellido'}</span></dt>
                  <dd>
                    <Input
                        name="contactSecondLastName"
                        type="text"
                        max="60"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        {...contactSecondLastName}
                      />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Cargo ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactPosition"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactPosition}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_CONTACT_POSITION) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Area dependencia ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactDependency"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactDependency}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_DEPENDENCY) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt>{'Fecha de nacimiento'}</dt>
                  <dd>
                    <DateTimePickerUi
                      name="contactDateOfBirth"
                      onChange={val => this._onchangeValue("contactDateOfBirth", val)}
                      culture='es'
                      format={"DD/MM/YYYY"}
                      time={false}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactDateOfBirth}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <dt>
                  {'Estilo social'}
                  <i onClick={this._downloadFileSocialStyle}
                    style={{marginLeft: "10px", cursor: "pointer"}}
                    title="Descargar archivo de estilo social"
                    className="red file pdf outline icon"></i>
                  </dt>
                  <dd>
                    <ComboBox
                      name="contactSocialStyle"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactSocialStyle}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_SOCIAL_STYLE) || []}
                    />
                  </dd>
                </Col>
                <Col xs>
                  <dt>{'Actitud frente al Grupo'}</dt>
                  <dd>
                    <ComboBox
                      name="contactAttitudeOverGroup"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactAttitudeOverGroup}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_ATTITUDE_OVER_GROUP) || []}
                    />
                  </dd>
                </Col>
              </Row>
            </div>
            <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información de ubicación y correspondencia</span></dt>
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>País (</span><span style={{color: 'red'}}>*</span><span>)</span></dt>
                  <dd>
                    <ComboBox
                      name="contactCountry"
                      labelInput="Seleccione"
                      {...contactCountry}
                      onChange={val => this._onChangeCountry(val)}
                      value={contactCountry.value}
                      onBlur={contactCountry.onBlur}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_COUNTRY) || []}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Departamento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactProvince"
                      labelInput="Seleccione"
                      {...contactProvince}
                      onChange={val => this._onChangeProvince(val)}
                      value={contactProvince.value}
                      onBlur={contactProvince.onBlur}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get('dataTypeProvince') || []}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Ciudad ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactCity"
                      labelInput="Seleccione"
                      {...contactCity}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get('dataTypeCity') || []}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <dt><span>{'Dirección ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Textarea className="form-control need-input"
                      {...contactAddress}
                      validateEnter={true}
                      name="contactAddress"
                      maxLength="250"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("address", val)}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Barrio'}</span></dt>
                  <dd>
                    <Input
                        name="contactNeighborhood"
                        type="text"
                        max="120"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        //onChange={val => this._onchangeValue("neighborhood", val)}
                        {...contactNeighborhood}
                      />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Código postal'}</span></dt>
                  <dd>
                    <Input
                        name="contactPostalCode"
                        type="text"
                        max="25"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        //onChange={val => this._onchangeValue("postalCode", val)}
                        {...contactPostalCode}
                      />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Teléfono ('}</span><span style={{color: 'red'}}>*</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                      name="contactTelephoneNumber"
                      type="text"
                      max="30"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("telephoneNumber", val)}
                      {...contactTelephoneNumber}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Extensión'}</span></dt>
                  <dd>
                    <Input
                        name="contactExtension"
                        type="text"
                        max="20"
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        //onChange={val => this._onchangeValue("extension", val)}
                        {...contactExtension}
                      />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Celular'}</span></dt>
                  <dd>
                    <Input
                      name="contactMobileNumber"
                      type="text"
                      max="30"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("mobileNumber", val)}
                      {...contactMobileNumber}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Correo electrónico ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                      name="contactEmailAddress"
                      type="text"
                      max="150"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("emailAddress", val)}
                      {...contactEmailAddress}
                    />
                  </dd>
                </Col>
              </Row>
            </div>
            <dt className="business-title"><span style={{paddingLeft: '20px'}}>Clasificación del contacto</span></dt>
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
              <Row>
                <Col xs>
                  <dt><span>{'Tipo de contacto ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactTypeOfContact"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactTypeOfContact}
                      valueProp={'id'}
                      textProp={'value'}
                      parentId="modalEditCotact"
                      data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs>
                  <dt><span>{'Entidad / Línea de negocio'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactLineOfBusiness"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactLineOfBusiness}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                    />
                  </dd>
                </Col>
                  </Row>
              <Row>
                <Col xs>
                  <dt><span>{'Función ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactFunctions"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactFunctions}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                    />
                  </dd>
                </Col>
              </Row>
            </div>
            <dt className="business-title"><span style={{paddingLeft: '20px'}}>Hobbies y deportes</span></dt>
            <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
              <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <dt><span>{'Hobbies'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactHobbies"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactHobbies}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_HOBBIES) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <dt><span>{'Deportes'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactSports"
                      labelInput="Seleccione"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactSports}
                      valueProp={'id'}
                      textProp = {'value'}
                      data={selectsReducer.get(FILTER_SPORTS) || []}
                    />
                  </dd>
                </Col>
              </Row>
            </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          <button
            type="submit"
            className="btn btn-primary modal-button-edit"
            disabled={this.state.isEditable ? '' : 'disabled'}
            >{'Guardar'}</button>
        </div>
        <SweetAlert
          type= "success"
          show={this.state.contactEdited}
          title="Edición de contacto"
          text="Señor usuario, el contacto se editó de forma exitosa."
          onConfirm={() => this._closeViewOrEditContact()}
        />
        <SweetAlert
         type= "error"
         show={this.state.showEr}
         title="Error editando contacto"
         text="Señor usuario, ocurrió un error editando el contacto."
         onConfirm={() => this.setState({showEr:false})}
         />
      </form>
    );
  }
}

ContactDetailsModalComponent.PropTypes = {
  contactId: PropTypes.number
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getContactDetails,
    saveContact,
    clearContactOrder,
    clearContactCreate,
    consultDataSelect,
    getMasterDataFields,
    consultListWithParameterUbication,
    contactsByClientFindServer,
    clearClienEdit,
    downloadFilePDF,
    changeStateSaveData
  }, dispatch);
}

function mapStateToProps({contactDetail, selectsReducer}, ownerProps) {
 const contact = contactDetail.get('contactDetailList');
 if(contact) {
   return {
     contactDetail,
     selectsReducer,
     initialValues: {
      id: contact.id,
      contactType:contact.contactType,
      contactIdentityNumber: contact.contactIdentityNumber,
      contactTitle:contact.title,
      contactGender:contact.gender,
      contactFirstName: contact.firstName,
      contactMiddleName:contact.middleName,
      contactFirstLastName:contact.firstLastName,
      contactSecondLastName:contact.secondLastName,
      contactPosition:contact.contactPosition,
      contactDependency:contact.unit,
      contactDateOfBirth: contact.dateOfBirth !== '' && contact.dateOfBirth !== null && contact.dateOfBirth !== undefined ? moment(contact.dateOfBirth).format('DD/MM/YYYY') : null,
      contactSocialStyle:contact.socialStyle,
      contactAttitudeOverGroup:contact.attitudeOverGroup,
      contactCountry:contact.country,
      contactProvince:contact.province,
      contactCity:contact.city,
      contactAddress:contact.address,
      contactNeighborhood:contact.neighborhood,
      contactPostalCode:contact.postalCode,
      contactTelephoneNumber:contact.telephoneNumber,
      contactExtension:contact.extension,
      contactMobileNumber:contact.mobileNumber,
      contactEmailAddress:contact.emailAddress,
      contactTypeOfContact:contact.typeOfContact,
      contactLineOfBusiness:'',
      contactFunctions:'',
      contactHobbies:'',
      contactSports:''
     }
   };
 } else {
  return {
    contactDetail,
    selectsReducer
  };
 }
}

export default reduxForm({
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ContactDetailsModalComponent);
