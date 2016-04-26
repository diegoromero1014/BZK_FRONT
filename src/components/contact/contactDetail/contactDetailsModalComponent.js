import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {Combobox, DateTimePicker, Multiselect} from 'react-widgets';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import SelectFilterComponent from '../../selectsComponent/selectFilterContact/selectFilterComponent';
import MultiSelectComponent from '../../selectsComponent/multiSelectContact/multiSelectComponent';
import {consultDataSelect, consultList} from '../../selectsComponent/actions';
import Input from '../../../ui/input/inputComponent';
import {CLIENT_ID_TYPE, FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LOB_ID, FILTER_GENDER, FILTER_TITLE, FILTER_ATTITUDE_OVER_GROUP, FILTER_DEPENDENCY, FILTER_CONTACT_POSITION, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, FILTER_HOBBIES, FILTER_SPORTS} from '../../selectsComponent/constants';
import {getContactDetails} from './actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const validate = values => {
    const errors = {}
    if (!values.contactType) {
        errors.contactType = "Debe seleccionar un tipo de documento";
    } else {
      errors.contactType = null;
    }
    if (!values.title) {
      errors.title = "Debe seleccionar un tratamiento";
    } else {
      errors.title = null;
    }
    if (!values.gender) {
      errors.gender = "Debe seleccionar un genero";
    } else {
      errors.gender = null;
    }
    if (!values.typeOfContact) {
      errors.typeOfContact = "Debe seleccionar un tipo de contacto";
    } else {
      errors.typeOfContact = null;
    }
    if (!values.country) {
      errors.country = "Debe seleccionar el país";
    } else {
      errors.country = null;
    }
    if (!values.contactIdentityNumber) {
      errors.contactIdentityNumber = "Debe ingresar el número del documento";
    } else {
      errors.contactIdentityNumber = null;
    }
    if (!values.firstName) {
      errors.firstName = "Debe ingresar el primer nombre";
    } else {
      errors.firstName = null;
    }
    if (!values.firstLastName) {
      errors.firstLastName = "Debe ingresar el primer apellido";
    } else {
      errors.firstLastName = null;
    }
    if (!values.emailAddress) {
      errors.emailAddress = "Debe ingresar el correo electrónico";
    } else {
      errors.emailAddress = null;
    }
    if (!values.telephoneNumber) {
      errors.telephoneNumber = "Debe ingresar un número de telefono";
    } else {
      errors.telephoneNumber = null;
    }
    if (!values.lineOfBusiness) {
      errors.lineOfBusiness = "Debe seleccionar al menos una linea de negocio";
    } else {
      errors.lineOfBusiness = null;
    }
    return errors;
};

class ContactDetailsModalComponent extends Component {

  /* Constructor de la clase ContactDetailModalComponent */
  constructor(props) {
    super(props);
    this.state = {
      selectContactType: 0
    };
    this._handleCheckIfExist = this._handleCheckIfExist.bind(this);
    this._handleChangeOption = this._handleChangeOption.bind(this);
    this._handlerSubmitContact = this._handlerSubmitContact.bind(this);
    this._onchangeValue = this._onchangeValue.bind(this);
  }

  /* Carga la información del contacto */
  componentWillMount() {
    const {getContactDetails, contactId} = this.props;
    getContactDetails(contactId);

    const {consultDataSelect, consultList} = this.props;
    consultDataSelect(CLIENT_ID_TYPE);
    consultDataSelect(FILTER_TITLE);
    consultDataSelect(FILTER_GENDER);
    consultDataSelect(FILTER_TYPE_CONTACT_ID);
    consultDataSelect(FILTER_COUNTRY);
    consultDataSelect(FILTER_DEPENDENCY);
    consultDataSelect(FILTER_CONTACT_POSITION);
  }

  /* Cambio en los valores */
  _onchangeValue(type, val) {

    switch (type) {
      case "contactIdentityNumber":
        var {fields: {contactIdentityNumber}} = this.props;
        contactIdentityNumber.onChange(val);
        break;
      case "firstName":
        var {fields: {firstName}} = this.props;
        firstName.onChange(val);
        break;
      case "firstLastName":
        var {fields: {firstLastName}} = this.props;
        firstLastName.onChange(val);
        break;
      case "middleName":
        var {fields: {middleName}} = this.props;
        middleName.onChange(val);
        break;
      case "secondLastName":
        var {fields: {secondLastName}} = this.props;
        secondLastName.onChange(val);
        break;
      case "postalCode":
        var {fields: {postalCode}} = this.props;
        postalCode.onChange(val);
        break;
      case "telephoneNumber":
        var {fields: {telephoneNumber}} = this.props;
        telephoneNumber.onChange(val);
        break;
      case "extension":
        var {fields: {extension}} = this.props;
        extension.onChange(val);
        break;
      case "mobileNumber":
        var {fields: {mobileNumber}} = this.props;
        mobileNumber.onChange(val);
        break;
      case "emailAddress":
        var {fields: {emailAddress}} = this.props;
        emailAddress.onChange(val);
        break;
      case "address":
        var {fields: {address}} = this.props;
        address.onChange(val);
      default:
        break;
    }
    const {clearState} = this.props;
    clearState();
  }

  /* funcion para identificar sí el contacto existe */
  _handleCheckIfExist(e) {
    /* Logica */
    const {contactDetail} = this.props;
    const contact = contactDetail.get('contactDetailList');

    // console.log('Valida sí existe');
    // console.log('Tipo -> ' + contact.contactType);
    // console.log('Numero -> ' + contact.contactIdentityNumber);
  }

  /* Se actualiza el object contact con la nueva opcion seleccionada */
  _handleChangeOption(optionType, optionValue) {
    // console.log('optionValue ->');
    // console.log(optionValue);
    const {contactDetail} = this.props;
    const contact = contactDetail.get('contactDetailList');
    if (optionType === CLIENT_ID_TYPE) {
      contact.contactType = optionValue;
    }
    contactDetail.set('contactDetailList ->', contact);
    // console.log('Se hizo cambio');
  }

  /* metodo para enviar el formulario */
  _handlerSubmitContact() {
    // console.log('Se envió la información');
  }

  render() {
    const { fields: { title, gender, contactType, contactIdentityNumber, firstName, middleName, firstLastName, secondLastName, contactPosition, contactDependency, address, country, neighborhood, postalCode, telephoneNumber, extension, mobileNumber, emailAddress, typeOfContact, lineOfBusiness}, error, handleSubmit, selectsReducer} = this.props;
    const {contactDetail} = this.props;
    const contact = contactDetail.get('contactDetailList');
    // const {} = contact;
    return (
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
          <form onSubmit={handleSubmit(this._handlerSubmitContact)}>
          <Row>
            <Col md={12} lg={12}>
              <dt className="business-title" style={{fontSize: '17px'}}>{'Información básica contacto'}</dt>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt><span>{'Tipo de documento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                {/* Tipo de documento */}
                <ComboBox
                  name="contactType"
                  labelInput="Seleccione el tipo de documento"
                  {...contactType}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeDocument')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Número de documento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="contactIdentityNumber"
                    type="text"
                    placeholder="Ingrese el número de documento del usuario"
                    onChange={val => this._onchangeValue("contactIdentityNumber", val)}
                    {...contactIdentityNumber}
                  />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dd className="rw-input">
                <button className="btn btn-primary" onClick={this._handleCheckIfExist}><span className="icon icon-search"></span></button>
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt><span>{'Tratamiento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                <ComboBox
                  name="title"
                  labelInput="Seleccione el tratamiento"
                  {...title}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeTitle')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt><span>{'Género ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                <ComboBox
                  name="gender"
                  labelInput="Seleccione el genero"
                  {...gender}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeGender')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Primer nombre ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="firstName"
                    type="text"
                    placeholder="Ingrese el primer nombre"
                    onChange={val => this._onchangeValue("firstName", val)}
                    {...firstName}
                  />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Segundo nombre'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="middleName"
                    type="text"
                    placeholder="Ingrese el segundo nombre"
                    onChange={val => this._onchangeValue("middleName", val)}
                    {...middleName}
                  />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Primer apellido ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="firstLastName"
                    type="text"
                    placeholder="Ingrese el primer apellido"
                    onChange={val => this._onchangeValue("firstLastName", val)}
                    {...firstLastName}
                  />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Segundo apellido'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="secondLastName"
                    type="text"
                    placeholder="Ingrese el segundo apellido"
                    onChange={val => this._onchangeValue("secondLastName", val)}
                    {...secondLastName}
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
                  {...contactPosition}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeContactPosition')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Area dependencia'}</span></dt>
              <dd>
                <ComboBox
                  name="contactDependency"
                  labelInput="Seleccione la dependencia"
                  {...contactDependency}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeDependency')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt>{'Fecha de nacimiento'}</dt>
              <dd className="rw-widget">
                <input type="text" className="rw-input form-control" id="form_socialStyle" name="form_socialStyle" maxLength="15" value={contact.dateOfBirth} />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt>{'Estilo social'}</dt>
              <dd>
                <Combobox />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={4} lg={4}>
              <dt>{'Actitud frente al Grupo'}</dt>
              <dd className="rw-widget">
                <SelectFilterComponent key={6} idTypeFilter={FILTER_ATTITUDE_OVER_GROUP} />
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
                  name="country"
                  labelInput="Seleccione el país"
                  {...country}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeCountry')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Departamento ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                {/* <SelectFilterComponent key={7} idTypeFilter={FILTER_PROVINCE} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Ciudad ('}</span><span style={{color: 'red'}}>*</span><span>{')'}</span></dt>
              <dd>
                {/* <SelectFilterComponent key={8} idTypeFilter={FILTER_CITY} /> */}
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <dt><span>{'Dirección ('}</span><span style={{color: 'red'}}>*</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <textarea className="form-control need-input"
                  name="address"
                  placeholder="Ingrese la dirección"
                  onChange={val => this._onchangeValue("address", val)}
                  {...address}
                />
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Barrio'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="neighborhood"
                    type="text"
                    placeholder="Ingrese el barrio"
                    onChange={val => this._onchangeValue("neighborhood", val)}
                    {...neighborhood}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.neighborhood} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Código postal'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="postalCode"
                    type="text"
                    placeholder="Ingrese el código postal"
                    onChange={val => this._onchangeValue("postalCode", val)}
                    {...postalCode}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.postalCode} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Teléfono ('}</span><span style={{color: 'red'}}>*</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="telephoneNumber"
                    type="text"
                    placeholder="Ingrese el número de telefono"
                    onChange={val => this._onchangeValue("telephoneNumber", val)}
                    {...telephoneNumber}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.telephoneNumber} /> */}
              </dd>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Extensión'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="extension"
                    type="text"
                    placeholder="Ingrese la extensión"
                    onChange={val => this._onchangeValue("extension", val)}
                    {...extension}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.extension} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Celular'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="mobileNumber"
                    type="text"
                    placeholder="Ingrese el celular"
                    onChange={val => this._onchangeValue("mobileNumber", val)}
                    {...mobileNumber}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.mobileNumber} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Correo electrónico ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd className="rw-widget">
                <Input
                    name="emailAddress"
                    type="text"
                    placeholder="Ingrese el correo electrónico"
                    onChange={val => this._onchangeValue("emailAddress", val)}
                    {...emailAddress}
                  />
                {/* <input type="text" className="rw-input form-control" id="form_city" name="form_city" maxLength="15" value={contact.emailAddress} /> */}
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
                  name="typeOfContact"
                  labelInput="Seleccione el tipo de contacto"
                  {...typeOfContact}
                  valueProp={'id'}
                  textProp={'value'}
                  data={selectsReducer.get('dataTypeContact')}
                />
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Entidad / Línea de negocio ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                {/* <MultiSelectComponent key={10} idTypeFilter={FILTER_TYPE_LOB_ID} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4}>
              <dt><span>{'Función ('}</span><span style={{color: 'red'}}>{'*'}</span><span>{')'}</span></dt>
              <dd>
                {/* <MultiSelectComponent key={11} idTypeFilter={FILTER_FUNCTION_ID} /> */}
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
                {/* <MultiSelectComponent key={12} idTypeFilter={FILTER_HOBBIES} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <dt><span>{'Deportes'}</span></dt>
              <dd>
                {/* <Multiselect /> */}
                {/* <MultiSelectComponent key={13} idTypeFilter={FILTER_SPORTS} /> */}
              </dd>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <button type="submit" className="btn btn-primary modal-button-edit">Guardar</button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

ContactDetailsModalComponent.PropTypes = {
  contactId: PropTypes.number
};

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    getContactDetails,
    consultDataSelect,
    consultList
  }, dispatch);
}

function mapStateToProps({contactDetail, selectsReducer}, ownerProps){
    return {
      contactDetail,
      selectsReducer
    };
}

export default reduxForm({
  form: 'submitValidation',
  fields: ["contactType", "title", "gender", "typeOfContact", "contactPosition", "contactDependency", "address", "country", "neighborhood", "postalCode", "telephoneNumber", "extension", "mobileNumber", "emailAddress", "contactIdentityNumber", "firstName", "middleName", "firstLastName", "secondLastName", "lineOfBusiness"],
  validate
}, mapStateToProps, mapDispatchToProps)(ContactDetailsModalComponent);
