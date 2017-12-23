import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../../ui/input/inputComponent';
import Textarea from '../../../../../ui/textarea/textareaComponent';
import { redirectUrl } from '../../../../globalComponents/actions';
import {
  PERSONA_NATURAL, PERSONA_JURIDICA, MESSAGE_SAVE_DATA,
  REGEX_SIMPLE_XSS,
  VALUE_XSS_INVALID,
  REGEX_SIMPLE_XSS_MESAGE,
  REGEX_SIMPLE_XSS_STRING
} from '../../../../../constantsGlobal';
import { toggleModalShareholder, clearSearchShareholder, searchShareholder, createShareholder } from './actions';
import { shareholdersByClientFindServer, clearShareholderOrder, clearShareholderCreate } from '../actions';
import { consultDataSelect, consultListWithParameterUbication, getMasterDataFields, clearValuesAdressess } from '../../../../selectsComponent/actions';
import {
  CONTACT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE,
  SHAREHOLDER_ID_TYPE, SHAREHOLDER_KIND, GENDER
} from '../../../../selectsComponent/constants';
import { NUMBER_RECORDS } from '../constants';
import { formValidateKeyEnter, nonValidateEnter } from '../../../../../actionsGlobal';
import * as constants from './constants';
import { changeStateSaveData } from '../../../../dashboard/actions';
import numeral from 'numeral';
import _ from 'lodash';

const fields = ["tipoDocumento", "numeroDocumento", "tipoPersona",
  "tipoAccionista", "paisResidencia", "primerNombre", "segundoNombre",
  "primerApellido", "segundoApellido", "genero", "razonSocial", "direccion", "porcentajePart",
  "pais", "departamento", "ciudad", "numeroIdTributaria", "observaciones"];
const errors = {};

var typeMessage = "error";
var titleMessage = "Campos obligatorios";
var message = "Señor usuario, debe seleccionar el tipo de documento e ingresar el documento del accionista.";

var valueTypeShareholder;

const validate = (values) => {


  if (!values.tipoDocumento) {
    errors.tipoDocumento = "Debe seleccionar una opción";
  } else {
    errors.tipoDocumento = null;
  }
  if (!values.tipoPersona) {
    errors.tipoPersona = "Debe seleccionar una opción";
  } else {
    errors.tipoPersona = null;
  }
  if (!values.tipoAccionista) {
    errors.tipoAccionista = "Debe seleccionar una opción";
  } else {
    errors.tipoAccionista = null;
  }

  if (!values.numeroDocumento) {
    errors.numeroDocumento = "Debe ingresar un valor";
  } else if (eval(REGEX_SIMPLE_XSS_STRING).test(values.numeroDocumento)) {
    errors.numeroDocumento = VALUE_XSS_INVALID;
  } else {
    errors.numeroDocumento = null;
  }
  if (!values.primerNombre && valueTypeShareholder === PERSONA_NATURAL) {
    errors.primerNombre = "Debe ingresar un valor";
  } else if (eval(REGEX_SIMPLE_XSS_STRING).test(values.primerNombre)) {
    errors.primerNombre = VALUE_XSS_INVALID;
  } else {
    errors.primerNombre = null;
  }

  if (!values.primerApellido && valueTypeShareholder === PERSONA_NATURAL) {
    errors.primerApellido = "Debe ingresar un valor";
  } else if (eval(REGEX_SIMPLE_XSS_STRING).test(values.primerApellido)) {
    errors.primerApellido = VALUE_XSS_INVALID;
  } else {
    errors.primerApellido = null;
  }
  if (!values.razonSocial && valueTypeShareholder === PERSONA_JURIDICA) {
    errors.razonSocial = "Debe ingresar un valor";
  } else if (eval(REGEX_SIMPLE_XSS_STRING).test(values.razonSocial)) {
    errors.razonSocial = VALUE_XSS_INVALID;
  } else {
    errors.razonSocial = null;
  }
  if (!values.porcentajePart) {
    errors.porcentajePart = "Debe ingresar un valor";
  } else if (eval(REGEX_SIMPLE_XSS_STRING).test(values.porcentajePart)) {
    errors.porcentajePart = VALUE_XSS_INVALID;
  } else {
    if (values.porcentajePart <= 0 || values.porcentajePart > 100) {
      errors.porcentajePart = "Debe ingresar un valor mayor a 0 y menor o igual a 100";
    } else {
      errors.porcentajePart = null;
    }
  }

  if (eval(REGEX_SIMPLE_XSS_STRING).test(values.segundoNombre)) {
    errors.segundoNombre = VALUE_XSS_INVALID;
  } else {
    errors.segundoNombre = null;
  }
  if (eval(REGEX_SIMPLE_XSS_STRING).test(values.segundoApellido)) {
    errors.segundoApellido = VALUE_XSS_INVALID;
  } else {
    errors.segundoApellido = null;
  }
  if (eval(REGEX_SIMPLE_XSS_STRING).test(values.direccion)) {
    errors.direccion = VALUE_XSS_INVALID;
  } else {
    errors.direccion = null;
  }
  if (eval(REGEX_SIMPLE_XSS_STRING).test(values.numeroIdTributaria)) {
    errors.numeroIdTributaria = VALUE_XSS_INVALID;
  } else {
    errors.numeroIdTributaria = null;
  }
  if (eval(REGEX_SIMPLE_XSS_STRING).test(values.observaciones)) {
    errors.observaciones = VALUE_XSS_INVALID;
  } else {
    errors.observaciones = null;
  }

  return errors;
};
class ModalComponentShareholder extends Component {
  constructor(props) {
    super(props);
    this._searchShareholder = this._searchShareholder.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._onClickLimpiar = this._onClickLimpiar.bind(this);
    this._onChangeTypeShareholder = this._onChangeTypeShareholder.bind(this);
    this._handleCreateShareholder = this._handleCreateShareholder.bind(this);
    this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
    this._selectTypeOfPerson = this._selectTypeOfPerson.bind(this);
    this.state = {
      showMessage: false,
      noExiste: 'hidden',
      disabled: '',
      botonBus: 'block',
      typeShareholder: [],
      disabledPer: 'disabled',
      valueTypeShareholder: "",
      showErrorXss: false,
    }
  }

  _handleBlurValueNumber(valuReduxForm, val) {
    //Elimino los caracteres no validos
    if (val !== null && val !== '' && val !== undefined) {
      for (var i = 0, output = '', validos = "0123456789."; i < val.length; i++) {
        if (validos.indexOf(val.charAt(i)) !== -1) {
          output += val.charAt(i)
        }
      }
      val = output;
      valuReduxForm.onChange(val);
    }
  }

  _closeCreate() {
    if (typeMessage === "success") {
      const { clearSearchShareholder, clearShareholderOrder, clearShareholderCreate, isOpen } = this.props;
      clearSearchShareholder();
      this.props.resetForm();
      this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block', showMessage: false });
      isOpen();
      clearShareholderOrder();
      clearShareholderCreate();
    } else {
      this.setState({ showMessage: false });
    }
  }

  _onClickLimpiar() {
    const { fields: { direccion, observaciones }, clearSearchShareholder } = this.props;
    clearSearchShareholder();
    this.props.resetForm();
    direccion.onChange('');
    observaciones.onChange('');
    this.setState({ disabled: '', noExiste: 'hidden', botonBus: 'block', disabledPer: 'disabled' });
  }

  componentWillMount() {
    const { getMasterDataFields, clearValuesAdressess, consultDataSelect, nonValidateEnter } = this.props;
    nonValidateEnter(true);
    clearValuesAdressess();
    this.props.resetForm();
    getMasterDataFields([SHAREHOLDER_TYPE, CONTACT_ID_TYPE, SHAREHOLDER_ID_TYPE, SHAREHOLDER_KIND, FILTER_COUNTRY, GENDER]);
    consultDataSelect(SHAREHOLDER_TYPE);
  }

  _searchShareholder() {
    const { fields: { tipoDocumento, numeroDocumento },
      searchShareholder, clearSearchShareholder } = this.props;
    if (tipoDocumento.value && numeroDocumento.value) {

      if (eval(REGEX_SIMPLE_XSS_STRING).test(numeroDocumento.value)) {
        this.setState({ showErrorXss: true });
        return;
      }

      searchShareholder(tipoDocumento.value, numeroDocumento.value,
        window.localStorage.getItem('idClientSelected')).then((data) => {
          if ((_.get(data, 'payload.data.shareholderExist'))) { //Si el accionista existe
            typeMessage = "warning";
            titleMessage = "Advertencia";
            message = "Señor usuario, el cliente ya presenta una relación con el accionista buscado.";
            this.setState({ showMessage: true });
            this.props.resetForm();

          } else if (!(_.get(data, 'payload.data.shareholderExist'))) { //Si el accionista no existe
            this.setState({ disabled: 'disabled' });
            this.setState({ noExiste: 'visible' });
            this.setState({ botonBus: 'none' });
          }
        }, (reason) => {
          typeMessage = "error";
          titleMessage = "Error";
          message = "Señor usuario, se presento un error.";
          this.setState({ showMessage: true });
        });
    }
    else {
      typeMessage = "error";
      titleMessage = "Campos obligatorios";
      message = "Señor usuario, debe seleccionar el tipo de documento e ingresar el documento del accionista.";
      this.setState({ showMessage: true });
    }
  }

  _selectTypeOfPerson(val) {
    const { fields: { tipoDocumento, tipoPersona }, selectsReducer } = this.props;

    let pj_options = ['ID Extranjero PJ no residente en Colombia', 'NIT'];
    let pn_options = ['ID Extranjero PN no residente en Colombia', 'Carné diplomático', 'Cédula de ciudadanía', 'Cédula de extranjeria', 'Pasaporte', 'Registro civil', 'Tarjeta de identidad'];
    let typeOfPerson;
    let typeOfDocumentSelected = _.get(_.filter(selectsReducer.get(SHAREHOLDER_ID_TYPE), ['id', parseInt(val)]), '[0].key');
    if (_.indexOf(pj_options, typeOfDocumentSelected) !== -1) {
      typeOfPerson = _.filter(selectsReducer.get(SHAREHOLDER_TYPE), ['key', 'PJ']);
    } else if (_.indexOf(pn_options, typeOfDocumentSelected) !== -1) {
      typeOfPerson = _.filter(selectsReducer.get(SHAREHOLDER_TYPE), ['key', 'PN']);
    }
    tipoPersona.onChange('');
    this.setState({ disabledPer: '' });
    this.setState({ typeShareholder: typeOfPerson });
  }

  _onChangeTypeShareholder(val) {
    const { fields: { tipoPersona } } = this.props;
    tipoPersona.onChange(val);
    valueTypeShareholder = parseInt(val);
    this.setState({ valueTypeShareholder: parseInt(val) });
  }

  _onChangeCountry(val) {
    const { fields: { pais, departamento, ciudad } } = this.props;
    pais.onChange(val);
    const { consultListWithParameterUbication } = this.props;
    consultListWithParameterUbication(FILTER_PROVINCE, pais.value);
    departamento.onChange('');
    ciudad.onChange('');
  }

  _onChangeProvince(val) {
    const { fields: { pais, departamento, ciudad } } = this.props;
    departamento.onChange(val);
    const { consultListWithParameterUbication } = this.props;
    consultListWithParameterUbication(FILTER_CITY, departamento.value);
    ciudad.onChange('');
  }

  _handleCreateShareholder() {
    const { fields: { tipoDocumento, numeroDocumento, tipoPersona, tipoAccionista,
      paisResidencia, primerNombre, segundoNombre, primerApellido, segundoApellido,
      genero, razonSocial, direccion, porcentajePart, pais, departamento, ciudad,
      numeroIdTributaria, observaciones }, shareholdersByClientFindServer, createShareholder, changeStateSaveData } = this.props;
    var messageBody = {
      "clientId": window.localStorage.getItem('idClientSelected'),
      "shareHolderIdType": tipoDocumento.value,
      "shareHolderIdNumber": numeroDocumento.value,
      "shareHolderType": tipoPersona.value,
      "shareHolderName": razonSocial.value,
      "sharePercentage": porcentajePart.value,
      "firstName": primerNombre.value,
      "middleName": segundoNombre.value,
      "firstLastName": primerApellido.value,
      "secondLastName": segundoApellido.value,
      "genderId": genero.value,
      "shareHolderKindId": tipoAccionista.value,
      "countryId": pais.value,
      "provinceId": departamento.value,
      "cityId": ciudad.value,
      "address": direccion.value,
      "fiscalCountryId": paisResidencia.value,
      "tributaryNumber": numeroIdTributaria.value,
      "comment": observaciones.value
    }

    changeStateSaveData(true, MESSAGE_SAVE_DATA);
    createShareholder(messageBody).then((data) => {
      changeStateSaveData(false, "");
      if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.validateLogin') === 'false') {
        redirectUrl("/login");
      } else {
        if ((_.get(data, 'payload.data.status') === 200)) {
          if (_.get(data, 'payload.data.data') !== null && _.get(data, 'payload.data.data') !== undefined) {
            var valoresResponse = (_.get(data, 'payload.data.data')).split("_");
            if (valoresResponse[0] === "exceedPorcentaje") {
              typeMessage = "error";
              titleMessage = "Porcentaje excedido";
              message = "Señor usuario, la suma de los accionistas directos excede el 100%. El valor máximo que puede ingresar es: " + valoresResponse[1] + "%";
            } else {
              typeMessage = "success";
              titleMessage = "Creación de accionista";
              message = "Señor usuario, el accionista se creó de forma exitosa.";
              shareholdersByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, "sh.sharePercentage", 1, "", "");
            }
          } else {
            typeMessage = "success";
            titleMessage = "Creación de accionista";
            message = "Señor usuario, el accionista se creó de forma exitosa.";
            shareholdersByClientFindServer(0, window.localStorage.getItem('idClientSelected'), NUMBER_RECORDS, "sh.sharePercentage", 1, "", "");
          }
        } else {
          typeMessage = "error";
          titleMessage = "Error creando accionista";
          message = "Señor usuario, ocurrió un error creando el accionista.";
        }
      }
      this.setState({ showMessage: true });
    }, (reason) => {
      changeStateSaveData(false, "");
      typeMessage = "error";
      titleMessage = "Error creando accionista";
      message = "Señor usuario, ocurrió un error creando el accionista.";
      this.setState({ showMessage: true });
    });
  }

  render() {
    const { fields: { tipoDocumento, numeroDocumento, tipoPersona, tipoAccionista,
      paisResidencia, primerNombre, segundoNombre, primerApellido, segundoApellido,
      genero, razonSocial, direccion, porcentajePart, pais, departamento, ciudad,
      numeroIdTributaria, observaciones },
      selectsReducer, createShareholder, handleSubmit, error, reducerGlobal } = this.props;
    return (
      <form onSubmit={handleSubmit(this._handleCreateShareholder)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
          <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información básica accionista</span></dt>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Row>
              <Col xs>
                <dl style={{ width: '100%' }}>
                  <dt><span>Tipo de documento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                  <dd>
                    <ComboBox name="tipoDocumento"
                      {...tipoDocumento}
                      disabled={this.state.disabled}
                      valueProp={'id'}
                      textProp={'value'}
                      labelInput="Seleccione"
                      data={selectsReducer.get(SHAREHOLDER_ID_TYPE) || []}
                      onChange={val => this._selectTypeOfPerson(val)}
                    />
                  </dd>
                </dl>
              </Col>
              <Col xs>
                <dl style={{ width: '100%' }}>
                  <dt><span>Número de documento (<span style={{ color: 'red' }}>*</span>)</span></dt>
                  <dd><InputComponent
                    name="numeroDocumento"
                    max="25"
                    type="text"
                    disabled={this.state.disabled}
                    {...numeroDocumento}
                  /></dd>
                </dl>
              </Col>
              <Col xs>
                <dl style={{ width: '100%' }}>
                  <button type="button" className="btn btn-primary" style={{ marginTop: '35px', display: this.state.botonBus }} onClick={this._searchShareholder}><i style={{ color: "white", margin: '0em', fontSize: '1.2em' }} className="search icon" ></i></button>
                  <button type="button" className="btn btn-primary" style={{ marginTop: '35px', visibility: this.state.noExiste }} onClick={this._onClickLimpiar}><i style={{ color: "white", margin: '0em', fontSize: '1.2em' }} className="erase icon" ></i></button>
                </dl>
              </Col>
            </Row>
            <Row style={{ visibility: this.state.noExiste }}>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de persona (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox name="tipoPersona"
                  {...tipoPersona}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  disabled={this.state.disabledPer}
                  onChange={val => this._onChangeTypeShareholder(val)}
                  data={this.state.typeShareholder}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de accionista (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox name="tipoAccionista"
                  {...tipoAccionista}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  data={selectsReducer.get(SHAREHOLDER_KIND) || []}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Porcentaje de participación (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  name="porcentajePart"
                  style={{ textAlign: "right" }}
                  type="text"
                  min={0}
                  max="5"
                  {...porcentajePart}
                  onBlur={val => this._handleBlurValueNumber(porcentajePart, porcentajePart.value)}
                />
              </Col>
              <Col xs={12} md={12} lg={12} style={this.state.valueTypeShareholder === PERSONA_JURIDICA ? { display: "block" } : { display: "none" }}>
                <dt><span>Razón social (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  name="razonSocial"
                  type="text"
                  max="150"
                  {...razonSocial}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" } : { display: "none" }}>
                <dt><span>Primer nombre (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  name="primerNombre"
                  type="text"
                  max="60"
                  {...primerNombre}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" } : { display: "none" }}>
                <dt><span>Segundo nombre</span></dt>
                <InputComponent
                  name="segundoNombre"
                  type="text"
                  max="60"
                  {...segundoNombre}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" } : { display: "none" }}>
                <dt><span>Primer apellido (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  name="primerApellido"
                  type="text"
                  max="60"
                  {...primerApellido}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" } : { display: "none" }}>
                <dt><span>Segundo apellido</span></dt>
                <InputComponent
                  name="segundoApellido"
                  type="text"
                  max="60"
                  {...segundoApellido}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" } : { display: "none" }}>
                <dt><span>Género</span></dt>
                <ComboBox name="genero"
                  {...genero}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  data={selectsReducer.get(GENDER) || []}
                />
              </Col>
              <Col xs={12} md={12} lg={12}>
                <dt>
                  <div style={{ width: "100%", float: "left" }}>
                    <span title="La longitud máxima del campo es de 1,000 caracteres">Observaciones</span>
                    <i className="help circle icon blue"
                      title="Está observación corresponde a la experiencia o información relevante del accionista"
                      style={{ "font-size": "15px", "cursor": "pointer", "margin-left": "2px" }}></i>
                  </div>
                </dt>
                <Textarea
                  name="observaciones"
                  type="text"
                  max="1000"
                  title="La longitud máxima de caracteres es de 1,000"
                  style={{ width: '100%', height: '100%' }}
                  {...observaciones}
                />
              </Col>
            </Row>
          </div>
          <dt style={{ visibility: this.state.noExiste }} className="business-title"><span style={{ paddingLeft: '20px' }}>Información de ubicación y tributaria</span></dt>
          <div style={{ paddingLeft: '20px', paddingRight: '20px', visibility: this.state.noExiste }}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País</span></dt>
                <ComboBox name="pais"
                  {...pais}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  onChange={val => this._onChangeCountry(val)}
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Departamento</span></dt>
                <ComboBox name="departamento"
                  {...departamento}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  onChange={val => this._onChangeProvince(val)}
                  data={selectsReducer.get('dataTypeProvince') || []}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Ciudad</span></dt>
                <ComboBox name="ciudad"
                  {...ciudad}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  data={selectsReducer.get('dataTypeCity') || []}
                />
              </Col>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Dirección sede principal</span></dt>
                <Textarea
                  name="direccion"
                  validateEnter={true}
                  type="text"
                  max="250"
                  style={{ width: '100%', height: '100%' }}
                  {...direccion}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País de residencia fiscal</span></dt>
                <ComboBox name="paisResidencia"
                  {...paisResidencia}
                  valueProp={'id'}
                  textProp={'value'}
                  labelInput="Seleccione"
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Número de id tributaria</span></dt>
                <InputComponent
                  name="numeroIdTributaria"
                  style={{ textAlign: "right" }}
                  type="text"
                  min={0}
                  max="30"
                  {...numeroIdTributaria}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          <button type="submit"
            style={{ visibility: this.state.noExiste }}
            className="btn btn-primary modal-button-edit">Guardar
            </button>
        </div>
        <SweetAlert
          type={typeMessage}
          show={this.state.showMessage}
          title={titleMessage}
          text={message}
          onConfirm={this._closeCreate}
        />
        <SweetAlert
          type="error"
          show={this.state.showErrorXss}
          title="Campos obligatorios"
          text={REGEX_SIMPLE_XSS_MESAGE}
          onConfirm={() => this.setState({ showErrorXss: false })}
        />
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleModalShareholder,
    clearSearchShareholder,
    searchShareholder,
    getMasterDataFields,
    clearShareholderOrder,
    clearShareholderCreate,
    clearValuesAdressess,
    consultListWithParameterUbication,
    consultDataSelect,
    createShareholder,
    shareholdersByClientFindServer,
    changeStateSaveData,
    nonValidateEnter
  }, dispatch);
}

function mapStateToProps({ selectsReducer, createShareholder, reducerGlobal }, ownerProps) {
  return {
    selectsReducer,
    createShareholder,
    reducerGlobal
  };
}

export default reduxForm({
  form: 'submitValidationShareholderCreate',
  fields,
  destroyOnUnmount: false,
  validate
}, mapStateToProps, mapDispatchToProps)(ModalComponentShareholder);
