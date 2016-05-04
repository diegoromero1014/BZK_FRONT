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
import {CONTACT_ID_TYPE, FILTER_FUNCTION_ID, FILTER_TYPE_LBO_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LOB_ID, FILTER_GENDER, FILTER_TITLE, FILTER_ATTITUDE_OVER_GROUP, FILTER_DEPENDENCY, FILTER_CONTACT_POSITION, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE} from '../../selectsComponent/constants';
import {getContactDetails, saveContact} from './actions';
import {contactsByClientFindServer} from '../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {NUMBER_RECORDS} from '../constants';


const fields = ["contactId", "contactType", "contactTitle", "contactGender", "contactTypeOfContact", "contactPosition", "contactDependency", "contactAddress",
              "contactCountry", "contactProvince", "contactCity", "contactNeighborhood", "contactPostalCode", "contactTelephoneNumber", "contactExtension",
              "contactMobileNumber", "contactEmailAddress", "contactIdentityNumber", "contactFirstName", "contactMiddleName", "contactFirstLastName", "contactSecondLastName",
              "contactLineOfBusiness", "contactFunctions", "contactHobbies", "contactSports", "contactSocialStyle", "contactAttitudeOverGroup", "contactDateOfBirth"];

const validate = values => {
    const errors = {};
    if (!values.contactType) {
      errors.contactType = "Debe seleccionar el tipo de documento";
    } else {
      errors.contactType = null;
    }
    if (!values.contactTitle) {
      errors.contactTitle = "Debe seleccionar el tratamiento";
    } else {
      errors.contactTitle = null;
    }
    if (!values.contactGender) {
      errors.contactGender = "Debe seleccionar el genero";
    } else {
      errors.contactGender = null;
    }
    if (!values.contactTypeOfContact) {
      errors.contactTypeOfContact = "Debe seleccionar el tipo de contacto";
    } else {
      errors.contactTypeOfContact = null;
    }
    if (!values.contactCountry) {
      errors.contactCountry = "Debe seleccionar el país";
    } else {
      errors.contactCountry = null;
    }
    if (!values.contactIdentityNumber) {
      errors.contactIdentityNumber = "Debe ingresar el número del documento";
    } else {
      errors.contactIdentityNumber = null;
    }
    if (!values.contactFirstName) {
      errors.contactFirstName = "Debe ingresar el primer nombre";
    } else {
      errors.contactFirstName = null;
    }
    if (!values.contactFirstLastName) {
      errors.contactFirstLastName = "Debe ingresar el primer apellido";
    } else {
      errors.contactFirstLastName = null;
    }
    if (!values.contactEmailAddress) {
      errors.contactEmailAddress = "Debe ingresar el correo electrónico";
    } else {
      errors.contactEmailAddress = null;
    }
    if (!values.contactTelephoneNumber) {
      errors.contactTelephoneNumber = "Debe ingresar el número de telefono";
    } else {
      errors.contactTelephoneNumber = null;
    }
    if (!values.contactFunctions) {
      errors.contactFunctions = "Debe seleccionar al menos una función";
    } else {
      errors.contactFunctions = null;
    }
    if (!values.contactAddress) {
      errors.contactAddress = "Debe ingresar la dirección";
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
    this._uploadProvincesByCountryId = this._uploadProvincesByCountryId.bind(this);
    this._uploadCitiesByProvinceId = this._uploadCitiesByProvinceId.bind(this);
    this._editContact = this._editContact.bind(this);
    this._closeViewOrEditContact = this._closeViewOrEditContact.bind(this);
    this.state = {
      contactEdited: false,
      isEditable: false
    };
    momentLocalizer(moment);
  }

  /* Carga la información del contacto */
  componentWillMount() {
    const {getMasterDataFields, getContactDetails, contactId, _uploadProvinces, _uploadCities} = this.props;
    const that = this;
    getMasterDataFields([CONTACT_ID_TYPE, FILTER_TITLE, FILTER_GENDER, FILTER_CONTACT_POSITION, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_TYPE_CONTACT_ID,
                        FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP]);

    getContactDetails(contactId, window.localStorage.getItem('idClientSelected'))
    .then(function(data) {
      //console.log(_.get(data, 'payload.data.contactDetail'));
      const contact = JSON.parse(_.get(data, 'payload.data.contactDetail'));

      //console.log('Datos del contacto -> ', contact);
      //console.log('this ', that);

      const {_uploadProvinces, _uploadCities} = that.props;

      
      if (contact.country !== undefined && contact.country !== null) {
        that._uploadProvincesByCountryId(contact.country);
      }
      if (contact.province !== undefined && contact.province !== null) {
        that._uploadCitiesByProvinceId(contact.province);
      }
    });
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
      default:
        break;
    }
    const {clearState} = this.props;
    clearState();
  }

  _onChangeCountry(val) {
    //console.log('Entering on _onChangeCountry with val -> ', val);
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
    //console.log('Entering on _onChangeProvince with val ->, ', val);
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    if (val !== undefined && val !== null) {
      contactProvince.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(FILTER_CITY, val);
    }
    contactCity.onChange('');
  }

  _uploadProvincesByCountryId(countryId) {
    //console.log('Entering on _uploadProvinces with countryId -> ', countryId);
    const {fields: {contactCountry, contactProvince, contactCity}} = this.props;
    const {consultListWithParameterUbication} = this.props;
    if (countryId !== undefined && countryId !== null) {
      consultListWithParameterUbication(FILTER_PROVINCE, countryId);
    }
  }

  _uploadCitiesByProvinceId(provinceId) {
    //console.log('Entering on _uploadCities with provinceId -> ', provinceId);
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
    //console.log('Habilitar campos y botón para editar');
  }

  _closeViewOrEditContact() {
    const {isOpen} = this.props;
    this.setState({contactEdited: false, isEditable: false});
    isOpen();
    //console.log('Cerrar ventana modal de ver o editar contacto');
  }

  /* metodo para enviar el formulario */
  _handlerSubmitContact() {
    //console.log('Se envió la información');
    const { fields: { contactId, contactTitle, contactGender, contactType, contactIdentityNumber, contactFirstName, contactMiddleName, contactFirstLastName,
      contactSecondLastName, contactPosition, contactDependency, contactAddress, contactCountry, contactProvince, contactCity, contactNeighborhood, contactPostalCode,
      contactTelephoneNumber, contactExtension, contactMobileNumber, contactEmailAddress, contactTypeOfContact, contactLineOfBusiness, contactFunctions, contactHobbies,
      contactSports, contactSocialStyle, contactAttitudeOverGroup, contactDateOfBirth
    }, error, handleSubmit, selectsReducer} = this.props;
    
    const {contactDetail} = this.props;
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
      "function": contactFunctions.value !== undefined ? _.split(contactFunctions.value, ',') : null,
      "dateOfBirth": contactDateOfBirth.value !== undefined ? moment(contactDateOfBirth.value).format('x') : null,
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
      "hobbies": contactHobbies.value !== undefined ? _.split(contactHobbies.value, ',') : null,
      "sports": contactSports.value !== undefined ? _.split(contactSports.value, ',') : null,
      "modeOfContact": null,
      "registryKey": null,
      "notes": null,
      "typeOfContact": contactTypeOfContact.value !== undefined ? contactTypeOfContact.value : null,
      "shippingInformation": null,
      "lineOfBusiness": contactLineOfBusiness.value !== undefined ? _.split(contactLineOfBusiness.value, ',') : null,
      "socialStyle": contactSocialStyle.value !== undefined ? contactSocialStyle.value : null,
      "attitudeOverGroup": contactAttitudeOverGroup.value !== undefined ? contactAttitudeOverGroup.value : null
    }

    //console.log('El objecto a guardar -> ', jsonUpdateContact);
    saveContact(jsonUpdateContact).then((data) => {
      if (_.get(data, 'payload.status') === 200) {
        this.setState({contactEdited: true});
        contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
              "",
              "",
              "");
        this.closeModal();
        //console.log('Se guardó correctamente');
      } else {
        //console.log('Se produjo un error');
      }
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
      <form onSubmit={handleSubmit(this._handlerSubmitContact)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
            <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
              <Row>
                <Col md={12} lg={12}>
                  <dt className="business-title" style={{fontSize: '17px'}}>
                    <span style={{paddingLeft: '20px'}}>
                      {'Información básica contacto'}
                    </span>
                  </dt>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt><span>{'Tipo de documento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactType"
                      labelInput="Seleccione el tipo de documento"
                      {...contactType}
                      disabled={'disabled'}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Número de documento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                      name="contactIdentityNumber"
                      type="text"
                      disabled={'disabled'}
                      placeholder="Ingrese el número de documento del usuario"
                      onChange={val => this._onchangeValue("contactIdentityNumber", val)}
                      {...contactIdentityNumber}
                    />
                  </dd>
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
                      labelInput="Seleccione el tratamiento"
                      {...contactTitle}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_TITLE) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt><span>{'Género ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactGender"
                      labelInput="Seleccione el genero"
                      {...contactGender}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_GENDER) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Primer nombre ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <Input
                      name="contactFirstName"
                      type="text"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      placeholder="Ingrese el primer nombre"
                      //onChange={val => this._onchangeValue("firstName", val)}
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
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        placeholder="Ingrese el segundo nombre"
                        //onChange={val => this._onchangeValue("middleName", val)}
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
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        placeholder="Ingrese el primer apellido"
                        //onChange={val => this._onchangeValue("firstLastName", val)}
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
                        disabled={this.state.isEditable ? '' : 'disabled'}
                        placeholder="Ingrese el segundo apellido"
                        //onChange={val => this._onchangeValue("secondLastName", val)}
                        {...contactSecondLastName}
                      />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Cargo'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactPosition"
                      labelInput="Seleccione el cargo"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactPosition}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_CONTACT_POSITION) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Area dependencia'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactDependency"
                      labelInput="Seleccione la dependencia"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactDependency}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_DEPENDENCY) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt>{'Fecha de nacimiento'}</dt>
                  <dd>
                    <DateTimePickerUi
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
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt>{'Estilo social'}</dt>
                  <dd>
                    <ComboBox
                      name="contactSocialStyle"
                      labelInput="Seleccione el estilo social"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactSocialStyle}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_SOCIAL_STYLE) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={4} lg={4}>
                  <dt>{'Actitud frente al Grupo'}</dt>
                  <dd>
                    <ComboBox
                      name="contactAttitudeOverGroup"
                      labelInput="Seleccione la actitud frente al Grupo"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactAttitudeOverGroup}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_ATTITUDE_OVER_GROUP) || []}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <dt className="business-title" style={{fontSize: '17px'}}>{'Información de ubicación y correspondencia'}</dt>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'País ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactCountry"
                      labelInput="Seleccione el país"
                      onChange={val => this._onChangeCountry(val)}
                      value={contactCountry.value}
                      onBlur={contactCountry.onBlur}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactCountry}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_COUNTRY) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Departamento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactProvince"
                      labelInput="Seleccione el departamento"
                      onChange={val => this._onChangeProvince(val)}
                      value={contactProvince.value}
                      onBlur={contactProvince.onBlur}
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactProvince}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get('dataTypeProvince') || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Ciudad ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactCity"
                      labelInput="Seleccine la ciudad"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactCity}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get('dataTypeCity') || []}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <dt><span>{'Dirección ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <textarea className="form-control need-input"
                      name="contactAddress"
                      placeholder="Ingrese la dirección"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("address", val)}
                      {...contactAddress}
                    ></textarea>
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
                        placeholder="Ingrese el barrio"
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
                        placeholder="Ingrese el código postal"
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
                      placeholder="Ingrese el número de telefono"
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
                        placeholder="Ingrese la extensión"
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
                      placeholder="Ingrese el celular"
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
                      placeholder="Ingrese el correo electrónico"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      //onChange={val => this._onchangeValue("emailAddress", val)}
                      {...contactEmailAddress}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <dt className="business-title" style={{fontSize: '17px'}}>{'Clasificación del contacto'}</dt>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Tipo de contacto ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <ComboBox
                      name="contactTypeOfContact"
                      labelInput="Seleccione el tipo de contacto"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactTypeOfContact}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Entidad / Línea de negocio'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactLineOfBusiness"
                      labelInput="Seleccione al menos una línea de negocio"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactLineOfBusiness}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                    />
                  </dd>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <dt><span>{'Función ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactFunctions"
                      labelInput="Seleccione al menos una función"
                      disabled={this.state.isEditable ? '' : 'disabled'}
                      {...contactFunctions}
                      valueProp={'id'}
                      textProp={'value'}
                      data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                    />
                  </dd>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <dt className="business-title" style={{fontSize: '17px'}}>{'Hobbies y deportes'}</dt>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={6}>
                  <dt><span>{'Hobbies'}</span></dt>
                  <dd>
                    <MultipleSelect
                      name="contactHobbies"
                      labelInput="Seleccione al menos un hobby"
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
                      labelInput="Seleccione al menos un deporte"
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
          title="Contacto editado"
          text="El contacto se editó correctamente"
          onConfirm={() => this._closeViewOrEditContact()}
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
    consultDataSelect,
    getMasterDataFields,
    consultListWithParameterUbication,
    contactsByClientFindServer
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
       contactDateOfBirth:contact.dateOfBirth,
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
       contactNombileNumber:contact.mobileNumber,
       contactEmailAddress:contact.emailAddress,
       contactTypeOfContact:contact.typeOfContact,
       contactLineOfBusiness:_.join(contact.lineOfBusiness, ','),
       contactFunctions:_.join(contact.function, ','),
       contactHobbies:_.join(contact.hobbies, ','),
       contactSports:_.join(contact.sports, ',')
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