import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import SweetAlert from 'sweetalert-react';
import {NUMBER_RECORDS} from '../constants';
import {shareholdersByClientFindServer} from '../actions';
import {getDetailShareHolder, toggleModalShareholder} from './actions';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import {consultDataSelect, consultListWithParameterUbication, getMasterDataFields} from '../../selectsComponent/actions';
import {createShareholder} from '../createShareholder/actions';
import {CONTACT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE, SHAREHOLDER_KIND, SHAREHOLDER_ID_TYPE, GENDER}
from '../../selectsComponent/constants';
import {PERSONA_NATURAL, PERSONA_JURIDICA} from '../../../constantsGlobal';
import _ from 'lodash';

const fields = ["id", "address", "cityId", "clientId", "comment", "countryId", "firstLastName", "firstName",
  "fiscalCountryId", "genderId", "middleName", "provinceId", "secondLastName", "shareHolderIdNumber",
  "shareHolderIdType", "shareHolderKindId", "shareHolderName", "shareHolderType", "sharePercentage",
  "tributaryNumber"];
const errors = {}

var typeMessage = "error";
var titleMessage = "Campos obligatorios";
var message = "Señor usuario, debe ingresar los campos marcados con asterisco.";
var valueTypeShareholder;

const validate = values => {
  if(!values.shareHolderKindId){
    errors.shareHolderKindId = "Debe seleccionar una opción";
  }else{
    errors.shareHolderKindId = null;
  }
  if(!values.firstName && valueTypeShareholder === PERSONA_NATURAL){
    errors.firstName = "Debe ingresar un valor";
  }else{
    errors.firstName = null;
  }
  if(!values.firstLastName && valueTypeShareholder === PERSONA_NATURAL){
    errors.firstLastName = "Debe ingresar un valor";
  }else{
    errors.firstLastName = null;
  }
  if(!values.genderId && valueTypeShareholder === PERSONA_NATURAL){
    errors.genderId = "Debe seleccionar un valor";
  }else{
    errors.genderId = null;
  }
  if(!values.shareHolderName && valueTypeShareholder === PERSONA_JURIDICA){
    errors.shareHolderName = "Debe ingresar un valor";
  }else{
    errors.shareHolderName = null;
  }
  if(!values.sharePercentage){
    errors.sharePercentage = "Debe ingresar un valor";
  }else{
    if(values.sharePercentage > 100){
      errors.sharePercentage = "Debe ingresar un valor entre 0 y 100";
    }else{
      errors.sharePercentage = null;
    }
  }
  return errors;
};

class ComponentShareHolderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMessage:false,
      isEditable: false
    };
    this._closeCreate = this._closeCreate.bind(this);
    this._editShareHolder = this._editShareHolder.bind(this);
    this._onChangeTypeShareholder = this._onChangeTypeShareholder.bind(this);
    this._submitEditShareHolderDetail = this._submitEditShareHolderDetail.bind(this);
    this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
  }

  _handleBlurValueNumber(valuReduxForm, val){
    //Elimino los caracteres no validos
    for (var i=0, output='', validos="0123456789"; i< val.length; i++){
     if (validos.indexOf(val.charAt(i)) != -1){
        output += val.charAt(i)
      }
    }
    val = output;
    valuReduxForm.onChange(val);
  }

  _onChangeTypeShareholder(val){
    const {fields: {shareHolderType}} = this.props;
    shareHolderType.onChange(val);
    valueTypeShareholder = parseInt(val);
    this.setState({valueTypeShareholder : parseInt(val)});
  }

  _onChangeCountry(val){
    const {fields: {countryId, provinceId, cityId}, editShareholderReducer} = this.props;
    countryId.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_PROVINCE, countryId.value);
    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    if(shareHolderEdit !== null && !_.isEqual(shareHolderEdit.countryId, countryId.value)){
      provinceId.onChange('');
      cityId.onChange('');
    }
  }

  _onChangeProvince(val){
    const {fields: {countryId, provinceId, cityId}, editShareholderReducer} = this.props;
    provinceId.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_CITY, provinceId.value);
    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    if(shareHolderEdit !== null && !_.isEqual(shareHolderEdit.provinceId, provinceId.value)){
      cityId.onChange('');
    }
  }

  _editShareHolder() {
    this.setState({
      showMessage:false,
      isEditable: !this.state.isEditable
    });
  }

  _submitEditShareHolderDetail(){
    const {fields: {id, address, cityId, clientId, comment, countryId, firstLastName, firstName,
    fiscalCountryId, genderId, middleName, provinceId, secondLastName, shareHolderIdNumber,
    shareHolderIdType, shareHolderKindId, shareHolderName, shareHolderType, sharePercentage,
    tributaryNumber}, shareHolderId, createShareholder, shareholdersByClientFindServer} = this.props;

    var messageBody = {
      "clientId": clientId.value,
      "id": shareHolderId,
      "shareHolderIdType": shareHolderIdType.value,
      "shareHolderIdNumber" : shareHolderIdNumber.value ,
      "shareHolderType" : shareHolderType.value,
      "shareHolderName": shareHolderName.value,
      "sharePercentage":sharePercentage.value,
      "firstName" : firstName.value,
      "middleName" : middleName.value,
      "firstLastName" : firstLastName.value,
      "secondLastName" : secondLastName.value,
      "genderId" : genderId.value,
      "shareHolderKindId" : shareHolderKindId.value,
      "countryId" : countryId.value,
      "provinceId" : provinceId.value,
      "cityId" : cityId.value,
      "address" : address.value,
      "fiscalCountryId" : fiscalCountryId.value,
      "tributaryNumber" : tributaryNumber.value,
      "comment" : comment.value
    }
    createShareholder(messageBody).then((data) => {
      if((_.get(data, 'payload.validateLogin') === 'false')){
        redirectUrl("/login");
      } else {
        if((_.get(data, 'payload.data.status') === 200)){
          if(_.get(data, 'payload.data.data') !== undefined && _.get(data, 'payload.data.data') !== null){
            var valoresResponse = (_.get(data, 'payload.data.data')).split(",");
            if(valoresResponse[0] === "exceedPorcentaje"){
              typeMessage="error";
              titleMessage="Procentaje excedido";
              message="Señor usuario, la suma de los accionistas directos excede el 100%. El valor máximo que puede ingresar es: " + valoresResponse[1] + "%";
            }
          } else {
            typeMessage="success";
            titleMessage="Edición de accionista";
            message="Señor usuario, el accionista se editó de forma exitosa.";
            shareholdersByClientFindServer(0, clientId.value, NUMBER_RECORDS, "", 0, "", "");
          }
        } else {
            typeMessage="error";
            titleMessage="Error editando accionista";
            message="Señor usuario, ocurrió un error editando el accionista.";
        }
      }
      this.setState({showMessage: true});
    }, (reason) => {
      typeMessage="error";
      titleMessage="Error editando accionista";
      message="Señor usuario, ocurrió un error editando el accionista.";
      this.setState({showMessage: true});
    });
  }

  _closeCreate(){
    if(typeMessage === "success"){
      const{isOpen} = this.props;
      this.props.resetForm();
      this.setState({showMessage: false});
      isOpen();
    } else {
      this.setState({showMessage: false});
    }
  }

  componentWillMount(){
    const {shareHolderId, getDetailShareHolder, getMasterDataFields,
      consultDataSelect} = this.props;
    this.props.resetForm();
    if(shareHolderId !== undefined && shareHolderId !== null && shareHolderId !== ''){
      getMasterDataFields([CONTACT_ID_TYPE, SHAREHOLDER_KIND, FILTER_COUNTRY, SHAREHOLDER_ID_TYPE, GENDER]);
      consultDataSelect(SHAREHOLDER_TYPE);

      getDetailShareHolder(shareHolderId).then((data) => {
        const {editShareholderReducer, consultListWithParameterUbication} = this.props;
        const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
        if(shareHolderEdit.countryId !== null && shareHolderEdit.countryId !== '' && shareHolderEdit.countryId !== undefined){
          consultListWithParameterUbication(FILTER_PROVINCE, shareHolderEdit.countryId);
          if(shareHolderEdit.provinceId !== null && shareHolderEdit.provinceId !== '' && shareHolderEdit.provinceId !== undefined){
            consultListWithParameterUbication(FILTER_CITY, shareHolderEdit.provinceId);
          }
        }
        }, (reason) => {
          this.setState({showEx: true});
      });
    }
  }

  render() {
    const {fields: {id, address, cityId, clientId, comment, countryId, firstLastName, firstName,
    fiscalCountryId, genderId, middleName, provinceId, secondLastName, shareHolderIdNumber,
    shareHolderIdType, shareHolderKindId, shareHolderName, shareHolderType, sharePercentage,
    tributaryNumber}, handleSubmit, editShareholderReducer, selectsReducer, shareHolderId} = this.props;
    const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
    console.log(shareHolderEdit);
    console.log("render = shareHolderId = ", shareHolderId);
    if(shareHolderEdit !== null && shareHolderEdit !== '' && shareHolderEdit !== undefined){
        valueTypeShareholder = shareHolderEdit.shareHolderType;
    }
    return (
      <form onSubmit={handleSubmit(this._submitEditShareHolderDetail)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
          <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información básica accionista</span></dt>
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de documento</span></dt>
                <dt>
                  <p style={{fontWeight: "normal", wordBreak:'break-all'}}>
                    {(shareHolderIdType.value !== "" && shareHolderIdType.value !== null && shareHolderIdType.value !== undefined && !_.isEmpty(selectsReducer.get(SHAREHOLDER_ID_TYPE))) ? _.get(_.filter(selectsReducer.get(SHAREHOLDER_ID_TYPE), ['id', parseInt(shareHolderIdType.value)]), '[0].value') : ''}
                  </p>
                </dt>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Número de documento</span>
                </dt>
                <dt>
                  <p style={{fontWeight: "normal"}}>
                    {shareHolderIdNumber.value}
                  </p>
                </dt>
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt>
                  <span>Tipo de persona</span>
                </dt>
                <dt>
                  <p style={{fontWeight: "normal"}}>
                    {(shareHolderType.value !== "" && shareHolderType.value !== null && shareHolderType.value !== undefined && !_.isEmpty(selectsReducer.get("dataTypeShareholdersType"))) ? _.get(_.filter(selectsReducer.get("dataTypeShareholdersType"), ['id', parseInt(shareHolderType.value)]), '[0].value') : ''}
                  </p>
                </dt>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de accionista (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="tipoAccionista"
                  labelInput="Seleccione"
                  {...shareHolderKindId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(SHAREHOLDER_KIND)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Porcentaje de participación (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...sharePercentage}
                  name="porcentajePart"
                  style={{textAlign: "right"}}
                  type="text"
                  min={0}
                  max="3"
                  onBlur={val => this._handleBlurValueNumber(sharePercentage, sharePercentage.value)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} sm={12} md={6} lg={4}>
                <button type="button" onClick={this._editShareHolder} className={'btn btn-primary modal-button-edit'} style={{marginTop: '35px'}}>Editar <i className={'icon edit'}></i></button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12} style={valueTypeShareholder === PERSONA_JURIDICA ? { display: "block" }: {display: "none"}}>
                <dt><span>Razón social (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...shareHolderName}
                  name="razonSocial"
                  type="text"
                  max="150"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Primer nombre (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...firstName}
                  name="primerNombre"
                  type="text"
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Segundo nombre</span></dt>
                <InputComponent
                  {...middleName}
                  name="segundoNombre"
                  type="text"
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Primer apellido (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...firstLastName}
                  name="primerApellido"
                  type="text"
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Segundo apellido</span></dt>
                <InputComponent
                  {...secondLastName}
                  name="segundoApellido"
                  type="text"
                  max="60"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Género (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="genero" labelInput="Seleccione"
                  {...genderId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(GENDER)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt>
                  <span>Observaciones</span>
                  <div className="ui icon"
                    title="La longitud máxima del campo es de 250 caracteres"
                    style={{marginLeft: "10px", marginBottom: "5px", cursor: "pointer", width: "50px", display: "inline-block"}}>
                    <i className="help icon"></i>
                  </div>
                </dt>
                <Textarea
                  {...comment}
                  name="observaciones"
                  type="text"
                  max="250"
                  style={{width: '100%', height: '100%'}}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
          <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información de ubicación y tributaria</span></dt>
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País</span></dt>
                <ComboBox
                  name="pais"
                  labelInput="Seleccione"
                  {...countryId}
                  valueProp={'id'}
                  textProp = {'value'}
                  onChange={val => this._onChangeCountry(val)}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(FILTER_COUNTRY)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Departamento</span></dt>
                <ComboBox
                  name="departamento"
                  labelInput="Seleccione"
                  {...provinceId}
                  valueProp={'id'}
                  textProp = {'value'}
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
                  textProp = {'value'}
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
                  type="text"
                  max="250"
                  style={{width: '100%', height: '100%'}}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País de residencia fiscal</span></dt>
                <ComboBox name="paisResidencia" labelInput="Seleccione"
                  {...fiscalCountryId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={shareHolderEdit === null ? [] : selectsReducer.get(FILTER_COUNTRY)}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Número de id tributario</span></dt>
                <InputComponent
                  {...tributaryNumber}
                  name="numeroIdTributaria"
                  style={{textAlign: "right"}}
                  type="text"
                  min={0}
                  max="50"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          <button
            type="submit"
            disabled={this.state.isEditable ? '' : 'disabled'}
            className="btn btn-primary modal-button-edit"
            >{'Guardar'}</button>
        </div>
        <SweetAlert
         type= {typeMessage}
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
    getMasterDataFields,
    consultListWithParameterUbication,
    consultDataSelect,
    shareholdersByClientFindServer,
    createShareholder
  }, dispatch);
}

function mapStateToProps({editShareholderReducer, selectsReducer, createShareholder},ownerProps) {
  const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
  if(shareHolderEdit !== undefined && shareHolderEdit !== null && shareHolderEdit !== ''){
    return {
      editShareholderReducer,
      selectsReducer,
      createShareholder,
      initialValues:{
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
        sharePercentage: shareHolderEdit.sharePercentage,
        tributaryNumber: shareHolderEdit.tributaryNumber
      }
    };
  }else{
    return {
      editShareholderReducer,
      selectsReducer,
      initialValues:{
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
  form: 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ComponentShareHolderDetail);
