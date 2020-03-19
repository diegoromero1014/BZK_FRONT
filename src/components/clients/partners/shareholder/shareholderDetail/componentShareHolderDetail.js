import React, { Component, PropTypes } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { fields, validations as validate } from './filesAndRules';
import SweetAlert from '../../../../sweetalertFocus';
import ComboBox from '../../../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../../../ui/input/inputComponent';
import Textarea from '../../../../../ui/textarea/textareaComponent';
import AuditFiles from '../../../../globalComponents/auditFiles';
import { shareholdersByClientFindServer, clearShareholderCreate, clearShareholderOrder } from '../actions';
import { getDetailShareHolder, toggleModalShareholder } from './actions';
import { consultDataSelect, consultListWithParameterUbication, getMasterDataFields } from '../../../../selectsComponent/actions';
import { createShareholder } from '../createShareholder/actions';
import { changeStateSaveData } from '../../../../main/actions';
import { formValidateKeyEnter, nonValidateEnter, validateResponse } from '../../../../../actionsGlobal';
import { redirectUrl } from '../../../../globalComponents/actions';
import { showLoading } from '../../../../loading/actions';
import { swtShowMessage } from '../../../../sweetAlertMessages/actions';
import { NUMBER_RECORDS } from '../constants';
import {
  CONTACT_ID_TYPE, CLIENT_TYPE, CLIENT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE,
  SHAREHOLDER_KIND, SHAREHOLDER_ID_TYPE, GENDER
} from '../../../../selectsComponent/constants';
import {
  NATURAL_PERSON, JURIDICAL_PERSON, MESSAGE_SAVE_DATA, EDITAR, MESSAGE_LOAD_DATA, TITLE_ERROR_SWEET_ALERT,
  MESSAGE_ERROR_SWEET_ALERT
} from '../../../../../constantsGlobal';

var typeMessage = "error";
var titleMessage = "Campos obligatorios";
var message = "Señor usuario, debe ingresar los campos marcados con asterisco.";
var valueTypeShareholder;


export class ComponentShareHolderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessage: false,
      isEditable: false,
      isNaturePerson: false
    };
    this._closeCreate = this._closeCreate.bind(this);
    this._editShareHolder = this._editShareHolder.bind(this);
    this._onChangeTypeShareholder = this._onChangeTypeShareholder.bind(this);
    this._submitEditShareHolderDetail = this._submitEditShareHolderDetail.bind(this);
    this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
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

  _onChangeTypeShareholder(val) {
    const { fields: { shareHolderType } } = this.props;
    shareHolderType.onChange(val);
    valueTypeShareholder = parseInt(val);
    this.setState({ valueTypeShareholder: parseInt(val) });
  }

  _onChangeCountry(val) {
    const { fields: { countryId, provinceId, cityId }, editShareholderReducer } = this.props;
    countryId.onChange(val);
    const { consultListWithParameterUbication } = this.props;
    consultListWithParameterUbication(FILTER_PROVINCE, countryId.value);
    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    if (shareHolderEdit !== null && !_.isEqual(shareHolderEdit.countryId, countryId.value)) {
      provinceId.onChange('');
      cityId.onChange('');
    }
  }

  _onChangeProvince(val) {
    const { fields: { provinceId, cityId }, editShareholderReducer } = this.props;
    provinceId.onChange(val);
    const { consultListWithParameterUbication } = this.props;
    consultListWithParameterUbication(FILTER_CITY, provinceId.value);
    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    if (shareHolderEdit !== null && !_.isEqual(shareHolderEdit.provinceId, provinceId.value)) {
      cityId.onChange('');
    }
  }

  _editShareHolder() {
    const { fields: { isNaturePerson }, editShareholderReducer } = this.props;

    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    if (shareHolderEdit !== null && shareHolderEdit !== '' && shareHolderEdit !== undefined) {
      valueTypeShareholder = shareHolderEdit.shareHolderTypeStr;
    }

    let newValue;
    if (valueTypeShareholder != NATURAL_PERSON) { 
      newValue= false;
    }else{
      newValue= true;
    }
    
    isNaturePerson.onChange(newValue);

    this.setState({
      showMessage: false,
      isEditable: !this.state.isEditable, 
      isNaturePerson: newValue
    });
  }

  _submitEditShareHolderDetail() {
    const {
      fields: {
        address, cityId, clientId, comment, countryId, firstLastName, firstName, fiscalCountryId, genderId, middleName,
        provinceId, secondLastName, shareHolderIdNumber, shareHolderIdType, shareHolderKindId, shareHolderName,
        shareHolderType, sharePercentage, tributaryNumber
      }, shareHolderId, createShareholder, shareholdersByClientFindServer, changeStateSaveData
    } = this.props;

    var messageBody = {
      "clientId": clientId.value,
      "id": shareHolderId,
      "shareHolderIdType": shareHolderIdType.value,
      "shareHolderIdNumber": shareHolderIdNumber.value,
      "shareHolderType": shareHolderType.value,
      "shareHolderName": shareHolderName.value,
      "sharePercentage": sharePercentage.value,
      "firstName": firstName.value,
      "middleName": middleName.value,
      "firstLastName": firstLastName.value,
      "secondLastName": secondLastName.value,
      "genderId": genderId.value,
      "shareHolderKindId": shareHolderKindId.value,
      "countryId": countryId.value,
      "provinceId": provinceId.value,
      "cityId": cityId.value,
      "address": address.value,
      "fiscalCountryId": fiscalCountryId.value,
      "tributaryNumber": tributaryNumber.value,
      "comment": comment.value
    }
    changeStateSaveData(true, MESSAGE_SAVE_DATA);
    createShareholder(messageBody).then((data) => {
      changeStateSaveData(false, "");
      if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.validateLogin') === 'false') {
        redirectUrl("/login");
      } else {
        if ((_.get(data, 'payload.data.status') === 200)) {
          if (_.get(data, 'payload.data.data') !== undefined && _.get(data, 'payload.data.data') !== null) {
            typeMessage = "success";
            titleMessage = "Edición de accionista";
            message = "Señor usuario, el accionista se editó de forma exitosa.";
            shareholdersByClientFindServer(0, clientId.value, NUMBER_RECORDS, "sh.sharePercentage", 1, "", "");
          }
        } else if (_.get(data, 'payload.data.status') === 500){
          typeMessage = "error";
          titleMessage = "Error editando accionista";
          message = _.get(data, 'payload.data.data');
        }
      }
      this.setState({ showMessage: true });
    }, (reason) => {
      changeStateSaveData(false, "");
      typeMessage = "error";
      titleMessage = "Error editando accionista";
      message = "Señor usuario, ocurrió un error editando el accionista.";
      this.setState({ showMessage: true });
    });
  }

  _closeCreate() {
    if (typeMessage === "success") {
      const { isOpen, clearShareholderCreate, clearShareholderOrder } = this.props;
      this.props.resetForm();
      this.setState({ showMessage: false });
      isOpen();
      clearShareholderOrder();
      clearShareholderCreate();
    } else {
      this.setState({ showMessage: false });
    }
  }

  componentWillMount() {
    const {
      fields: {
        shareHolderIdType, shareHolderIdNumber
      },
      shareHolderId, getDetailShareHolder, getMasterDataFields, consultDataSelect, nonValidateEnter, showLoading,
      swtShowMessage
    } = this.props;

    showLoading(true, MESSAGE_LOAD_DATA);
    nonValidateEnter(true);
    this.props.resetForm();
    getMasterDataFields([CONTACT_ID_TYPE, CLIENT_ID_TYPE, CLIENT_TYPE, SHAREHOLDER_KIND, FILTER_COUNTRY, SHAREHOLDER_ID_TYPE, GENDER]);
    consultDataSelect(SHAREHOLDER_TYPE);
    getDetailShareHolder(shareHolderId).then((data) => {
      showLoading(false, "");
      if (!validateResponse(data)) {
        swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
      } else {
        const { editShareholderReducer, consultListWithParameterUbication } = this.props;
        const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');

        shareHolderIdType.onChange(shareHolderEdit.shareholderIdType);
        shareHolderIdNumber.onChange(shareHolderEdit.shareholderIdNumber);

        if (shareHolderEdit.countryId !== null && shareHolderEdit.countryId !== '' && shareHolderEdit.countryId !== undefined) {
          consultListWithParameterUbication(FILTER_PROVINCE, shareHolderEdit.countryId);
          if (shareHolderEdit.provinceId !== null && shareHolderEdit.provinceId !== '' && shareHolderEdit.provinceId !== undefined) {
            consultListWithParameterUbication(FILTER_CITY, shareHolderEdit.provinceId);
          }
        }
      }
    }, (reason) => {
      showLoading(false, "");
      swtShowMessage('error', TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
    });
  }

  render() {
    const {
      fields: {
        address, cityId, comment, countryId, firstLastName, firstName, fiscalCountryId, genderId, middleName, provinceId,
        secondLastName, shareHolderIdNumber, shareHolderIdType, shareHolderKindId, shareHolderName, shareHolderType,
        sharePercentage, tributaryNumber
      }, handleSubmit, editShareholderReducer, selectsReducer, reducerGlobal
    } = this.props;

    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');

    var typeClient;
    if (shareHolderEdit !== null && shareHolderEdit !== '' && shareHolderEdit !== undefined) {
      valueTypeShareholder = shareHolderEdit.shareHolderTypeStr;
      var valueSh = _.get(_.filter(selectsReducer.get(CLIENT_ID_TYPE), ['id', parseInt(shareHolderIdType.value)]), '[0].value');
      typeClient = CLIENT_ID_TYPE;
      if (valueSh === undefined) {
        valueSh = _.get(_.filter(selectsReducer.get(CONTACT_ID_TYPE), ['id', parseInt(shareHolderIdType.value)]), '[0].value');
        typeClient = CONTACT_ID_TYPE;
      }
    }

    return (
      <form onSubmit={handleSubmit(this._submitEditShareHolderDetail)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
          <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información básica accionista</span></dt>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Tipo de persona</span>
                </dt>
                <dt>
                  <p style={{ fontWeight: "normal" }}>
                    {(shareHolderType.value !== "" && shareHolderType.value !== null && shareHolderType.value !== undefined && !_.isEmpty(selectsReducer.get("clientType"))) ? _.get(_.filter(selectsReducer.get("clientType"), ['id', parseInt(shareHolderType.value)]), '[0].value') : ''}
                  </p>
                </dt>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de documento</span></dt>
                <dt>
                  <p style={{ fontWeight: "normal", wordBreak: 'keep-all' }}>
                    {(shareHolderIdType.value !== "" && shareHolderIdType.value !== null && shareHolderIdType.value !== undefined && !_.isEmpty(selectsReducer.get(typeClient))) ? valueSh : ''}
                  </p>
                </dt>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Número de documento</span>
                </dt>
                <dt>
                  <p style={{ fontWeight: "normal" }}>
                    {shareHolderIdNumber.value}
                  </p>
                </dt>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de accionista (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="tipoAccionista"
                  labelInput="Seleccione"   
                  valueProp={'id'}
                  textProp={'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(SHAREHOLDER_KIND)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                  {...shareHolderKindId}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Porcentaje de participación (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent        
                  name="porcentajePart"
                  style={{ textAlign: "right" }}
                  type="text"
                  max="5"
                  onBlur={val => this._handleBlurValueNumber(sharePercentage, val)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                  {...sharePercentage}
                />
              </Col>
              <Col xs={12} sm={12} md={6} lg={4}>
                {_.get(reducerGlobal.get('permissionsShareholders'), _.indexOf(reducerGlobal.get('permissionsShareholders'), EDITAR), false) &&
                  <button type="button" onClick={this._editShareHolder} className={'btn btn-primary modal-button-edit'} style={{ marginTop: '35px' }}>Editar <i className={'icon edit'}></i></button>
                }
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12} style={valueTypeShareholder === JURIDICAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Razón social (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  name="razonSocial"
                  type={valueTypeShareholder === JURIDICAL_PERSON ? 'text' : 'hidden' }
                  max="150"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                  {...shareHolderName}
                  value={valueTypeShareholder === JURIDICAL_PERSON ? shareHolderName.value : ''}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === NATURAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Primer nombre (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  {...firstName}
                  name="primerNombre"
                  type={valueTypeShareholder === NATURAL_PERSON ? 'text' : 'hidden' }
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === NATURAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Segundo nombre</span></dt>
                <InputComponent
                  {...middleName}
                  name="segundoNombre"
                  type={valueTypeShareholder === NATURAL_PERSON ? 'text' : 'hidden' }
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === NATURAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Primer apellido (</span><span style={{ color: "red" }}>*</span>)</dt>
                <InputComponent
                  {...firstLastName}
                  name="primerApellido"
                  type={valueTypeShareholder === NATURAL_PERSON ? 'text' : 'hidden' }
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === NATURAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Segundo apellido</span></dt>
                <InputComponent
                  {...secondLastName}
                  name="segundoApellido"
                  type={valueTypeShareholder === NATURAL_PERSON ? 'text' : 'hidden' }
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === NATURAL_PERSON ? { display: "block" } : { display: "none" }}>
                <dt><span>Género</span></dt>
                <ComboBox name="genero" labelInput="Seleccione"
                  {...genderId}
                  valueProp={'id'}
                  textProp={'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(GENDER)}
                  disabled={this.state.isEditable && valueTypeShareholder === NATURAL_PERSON ? '' : 'disabled'}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt>
                  <span title="La longitud máxima del campo es de 150 caracteres">Observaciones</span>
                  <i className="help circle icon blue"
                    title="Está observación corresponde a la experiencia o información relevante del accionista"
                    style={{ "font-size": "15px", "cursor": "pointer", "margin-left": "2px" }}></i>
                </dt>
                <Textarea
                  {...comment}
                  name="observaciones"
                  type="text"
                  max="1000"
                  title="La longitud máxima de caracteres es de 1,000"
                  style={{ width: '100%', height: '100%' }}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
          <dt className="business-title"><span style={{ paddingLeft: '20px' }}>Información de ubicación y tributaria</span></dt>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País</span></dt>
                <ComboBox
                  name="pais"
                  labelInput="Seleccione"
                  {...countryId}
                  valueProp={'id'}
                  textProp={'value'}
                  onChange={val => this._onChangeCountry(val)}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(FILTER_COUNTRY)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Departamento/Provincia</span></dt>
                <ComboBox
                  name="departamento"
                  labelInput="Seleccione"
                  {...provinceId}
                  valueProp={'id'}
                  textProp={'value'}
                  onChange={val => this._onChangeProvince(val)}
                  data={shareHolderEdit === null ? [] : selectsReducer.get('dataTypeProvince')}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Ciudad</span></dt>
                <ComboBox
                  name="ciudad"
                  labelInput="Seleccione"
                  {...cityId}
                  valueProp={'id'}
                  textProp={'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get('dataTypeCity')}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Dirección sede principal</span></dt>
                <Textarea
                  {...address}
                  name="direccion"
                  validateEnter={true}
                  type="text"
                  max="250"
                  style={{ width: '100%', height: '100%' }}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País de residencia fiscal</span></dt>
                <ComboBox name="paisResidencia" labelInput="Seleccione"
                  {...fiscalCountryId}
                  valueProp={'id'}
                  textProp={'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(FILTER_COUNTRY)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Número de id tributario</span></dt>
                <InputComponent
                  {...tributaryNumber}
                  name="numeroIdTributaria"
                  style={{ textAlign: "right" }}
                  type="text"
                  min={0}
                  max="30"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
          {shareHolderEdit !== null &&
            <AuditFiles
              visible={true}
              createdBy={shareHolderEdit.createdBy}
              createdTimestamp={shareHolderEdit.createdTimestamp}
              updatedBy={shareHolderEdit.updatedBy}
              updatedTimestamp={shareHolderEdit.updatedTimestamp} />
          }
        </div>
        <div className="modalBt4-footer modal-footer">
          <button
            type="submit"
            disabled={this.state.isEditable ? '' : 'disabled'}
            className="btn btn-primary modal-button-edit"
          >{'Guardar'}</button>
        </div>
        <SweetAlert
          type={typeMessage}
          show={this.state.showMessage}
          title={titleMessage}
          text={message}
          onConfirm={this._closeCreate}
        />
      </form>
    );
  }
}

ComponentShareHolderDetail.PropTypes = {
  shareHolderId: PropTypes.number
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleModalShareholder,
    getDetailShareHolder,
    clearShareholderCreate,
    clearShareholderOrder,
    getMasterDataFields,
    consultListWithParameterUbication,
    consultDataSelect,
    shareholdersByClientFindServer,
    createShareholder,
    changeStateSaveData,
    nonValidateEnter,
    showLoading,
    swtShowMessage
  }, dispatch);
}

function mapStateToProps({ editShareholderReducer, selectsReducer, createShareholder, reducerGlobal }, ownerProps) {
  const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
  if (shareHolderEdit !== undefined && shareHolderEdit !== null && shareHolderEdit !== '') {
    return {
      editShareholderReducer,
      selectsReducer,
      createShareholder,
      reducerGlobal,
      initialValues: {
        id: shareHolderEdit.id,
        address: shareHolderEdit.address,
        cityId: shareHolderEdit.cityId,
        clientId: shareHolderEdit.clientId,
        comment: shareHolderEdit.comment,
        countryId: shareHolderEdit.countryId,
        firstLastName: shareHolderEdit.firstLastName,
        firstName: shareHolderEdit.firstName,
        fiscalCountryId: shareHolderEdit.fiscalCountryId,
        genderId: shareHolderEdit.genderId,
        middleName: shareHolderEdit.middleName,
        provinceId: shareHolderEdit.provinceId,
        secondLastName: shareHolderEdit.secondLastName,
        shareHolderIdNumber: shareHolderEdit.shareHolderIdNumber,
        shareHolderIdType: shareHolderEdit.shareHolderIdType,
        shareHolderKindId: shareHolderEdit.shareHolderKindId,
        shareHolderName: shareHolderEdit.shareHolderName,
        shareHolderType: shareHolderEdit.shareHolderType,
        sharePercentage: String(shareHolderEdit.sharePercentage),
        tributaryNumber: shareHolderEdit.tributaryNumber
      }
    };
  } else {
    return {
      editShareholderReducer,
      selectsReducer,
      reducerGlobal,
      initialValues: {
        id: '',
        address: '',
        cityId: '',
        clientId: '',
        comment: '',
        countryId: '',
        firstLastName: '',
        firstName: '',
        fiscalCountryId: '',
        genderId: '',
        middleName: '',
        provinceId: '',
        secondLastName: '',
        shareHolderIdNumber: '',
        shareHolderIdType: '',
        shareHolderKindId: '',
        shareHolderName: '',
        shareHolderType: '',
        sharePercentage: '',
        tributaryNumber: ''
      }
    };
  }
}

export default reduxForm({
  form: 'submitValidationShareholderDetails',
  fields,
  destroyOnUnmount: true,
  validate
}, mapStateToProps, mapDispatchToProps)(ComponentShareHolderDetail);