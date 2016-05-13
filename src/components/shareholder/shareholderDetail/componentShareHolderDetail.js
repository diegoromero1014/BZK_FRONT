import React, {Component, PropTypes} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getDetailShareHolder} from './actions';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import {consultDataSelect, consultListWithParameterUbication, getMasterDataFields, clearValuesAdressess} from '../../selectsComponent/actions';
import {CONTACT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE, SHAREHOLDER_KIND, SHAREHOLDER_ID_TYPE} from '../../selectsComponent/constants';
import {PERSONA_NATURAL, PERSONA_JURIDICA} from '../../../constantsGlobal';
import _ from 'lodash';

const fields = ["id", "address", "cityId", "clientId", "comment", "countryId", "firstLastName", "firstName",
  "fiscalCountryId", "genderId", "middleName", "provinceId", "secondLastName", "shareHolderIdNumber",
  "shareHolderIdType", "shareHolderKindId", "shareHolderName", "shareHolderType", "sharePercentage",
  "tributaryNumber"];
const errors = {}

var valueTypeShareholder;

const validate = values => {
  if(!values.shareHolderType){
    errors.shareHolderType = "Debe seleccionar una opción";
  }else{
    errors.shareHolderType = null;
  }
  if(!values.shareHolderKindId){
    errors.shareHolderKindId = "Debe seleccionar una opción";
  }else{
    errors.shareHolderKindId = null;
  }
  if(!values.fiscalCountryId){
    errors.fiscalCountryId = "Debe seleccionar una opción";
  }else{
    errors.fiscalCountryId = null;
  }
  if(!values.firstName && valueTypeShareholder === PERSONA_NATURAL){
    errors.firstName = "Debe ingresar un valor";
  }else{
    errors.firstName = null;
  }
  if(!values.middleName && valueTypeShareholder === PERSONA_NATURAL){
    errors.middleName = "Debe ingresar un valor";
  }else{
    errors.middleName = null;
  }
  if(!values.firstLastName && valueTypeShareholder === PERSONA_NATURAL){
    errors.firstLastName = "Debe ingresar un valor";
  }else{
    errors.firstLastName = null;
  }
  if(!values.secondLastName && valueTypeShareholder === PERSONA_NATURAL){
    errors.secondLastName = "Debe ingresar un valor";
  }else{
    errors.secondLastName = null;
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
  if(!values.address){
    errors.address = "Debe ingresar un valor";
  }else{
    errors.address = null;
  }
  if(!values.sharePercentage){
    errors.sharePercentage = "Debe ingresar un valor";
  }else{
    errors.sharePercentage = null;
  }
  if(!values.countryId){
    errors.countryId = "Debe seleccionar un valor";
  }else{
    errors.countryId = null;
  }
  if(!values.provinceId){
    errors.provinceId = "Debe seleccionar un valor";
  }else{
    errors.provinceId = null;
  }
  if(!values.cityId){
    errors.cityId = "Debe seleccionar un valor";
  }else{
    errors.cityId = null;
  }
  if(!values.tributaryNumber){
    errors.tributaryNumber = "Debe ingresar un valor";
  }else{
    errors.tributaryNumber = null;
  }
  if(!values.comment){
    errors.comment = "Debe ingresar un valor";
  }else{
    errors.comment = null;
  }
  return errors;
};

class ComponentShareHolderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditable: false,
      valueTypeShareholder: ""
    };
    this._onChangeTypeShareholder = this._onChangeTypeShareholder.bind(this);
    this._editShareHolder = this._editShareHolder.bind(this);
  }

  componentWillMount(){
    const {shareHolderId, getDetailShareHolder, getMasterDataFields, clearValuesAdressess, consultDataSelect} = this.props;
    clearValuesAdressess();
    this.props.resetForm();
    if(shareHolderId !== undefined && shareHolderId !== null && shareHolderId !== ''){
      getDetailShareHolder(shareHolderId);
      getMasterDataFields([CONTACT_ID_TYPE, SHAREHOLDER_KIND, FILTER_COUNTRY, SHAREHOLDER_ID_TYPE]);
      consultDataSelect(SHAREHOLDER_TYPE);
    }
  }

  _onChangeTypeShareholder(val){
    const {fields: {shareHolderType}} = this.props;
    shareHolderType.onChange(val);
    valueTypeShareholder = parseInt(val);
    this.setState({valueTypeShareholder : parseInt(val)});
  }

  _onChangeCountry(val){
    const {fields: {countryId, provinceId, cityId}} = this.props;
    countryId.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_PROVINCE, countryId.value);
    provinceId.onChange('');
    cityId.onChange('');
  }

  _onChangeProvince(val){
    const {fields: {countryId, provinceId, cityId}} = this.props;
    provinceId.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_CITY, provinceId.value);
    cityId.onChange('');
  }

  _editShareHolder() {
    this.setState({
      isEditable: !this.state.isEditable
    });
  }

  _submitEditShareHolderDetail(){
  }

  render() {
    const {fields: {id, address, cityId, clientId, comment, countryId, firstLastName, firstName,
    fiscalCountryId, genderId, middleName, provinceId, secondLastName, shareHolderIdNumber,
    shareHolderIdType, shareHolderKindId, shareHolderName, shareHolderType, sharePercentage,
    tributaryNumber}, handleSubmit, editShareholderReducer, selectsReducer} = this.props;
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
              <Col xs={12} sm={12} md={6} lg={4}>
                <button type="button" onClick={this._editShareHolder} className={'btn btn-primary modal-button-edit'} style={{marginTop: '35px'}}>Editar <i className={'icon edit'}></i></button>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4}>
              <dt><span>Tipo de persona (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="tipoPersona" labelInput="Seleccione"
                  {...shareHolderType}
                  valueProp={'id'}
                  textProp = {'value'}
                  onChange={val => this._onChangeTypeShareholder(val)}
                  data={selectsReducer.get("dataTypeShareholders") || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Tipo de accionista (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="tipoAccionista" labelInput="Seleccione"
                  {...shareHolderKindId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={selectsReducer.get(SHAREHOLDER_KIND) || []}
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
                  max="100"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8} lg={8} style={this.state.valueTypeShareholder === PERSONA_JURIDICA ? { display: "block" }: {display: "none"}}>
                <dt><span>Razón social (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...shareHolderName}
                  name="razonSocial"
                  type="text"
                  max="110"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Primer nombre (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...firstName}
                  name="primerNombre"
                  type="text"
                  max="50"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Segundo nombre</span></dt>
                <InputComponent
                  {...middleName}
                  name="segundoNombre"
                  type="text"
                  max="50"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Primer apellido (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...firstLastName}
                  name="primerApellido"
                  type="text"
                  max="50"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Segundo apellido (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...secondLastName}
                  name="segundoApellido"
                  type="text"
                  max="50"
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                <dt><span>Género (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="genero" labelInput="Seleccione"
                  {...genderId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Número de id tributaria (</span><span style={{color: "red"}}>*</span>)</dt>
                <InputComponent
                  {...tributaryNumber}
                  name="numeroIdTributaria"
                  style={{textAlign: "right"}}
                  type="text"
                  min={0}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
          <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información de ubicación y correspondencia</span></dt>
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <Row>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="pais" labelInput="Seleccione"
                  {...countryId}
                  valueProp={'id'}
                  textProp = {'value'}
                  onChange={val => this._onChangeCountry(val)}
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Departamento (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="departamento" labelInput="Seleccione"
                  {...provinceId}
                  valueProp={'id'}
                  textProp = {'value'}
                  onChange={val => this._onChangeProvince(val)}
                  data={selectsReducer.get('dataTypeProvince') || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>Ciudad (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="ciudad" labelInput="Seleccione"
                  {...cityId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={selectsReducer.get('dataTypeCity') || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Dirección sede principal (</span><span style={{color: "red"}}>*</span>)</dt>
                <Textarea
                  {...address}
                  name="direccion"
                  type="text"
                  max="100"
                  style={{width: '100%', height: '100%'}}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
              <Col xs={12} md={4} lg={4}>
                <dt><span>País de residencia fiscal (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox name="paisResidencia" labelInput="Seleccione"
                  {...fiscalCountryId}
                  valueProp={'id'}
                  textProp = {'value'}
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                  disabled={this.state.isEditable ? '' : 'disabled'}
                />
              </Col>
            </Row>
          </div>
          <dt className="business-title"><span style={{paddingLeft: '20px'}}>Otros</span></dt>
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <Row>
              <Col xs={12} md={12} lg={12}>
                <dt><span>Observaciones (</span><span style={{color: "red"}}>*</span>)</dt>
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
        </div>
        <div className="modalBt4-footer modal-footer">
          <button
            type="submit"
            disabled={this.state.isEditable ? '' : 'disabled'}
            className="btn btn-primary modal-button-edit"
            >{'Guardar'}</button>
        </div>
      </form>
    );
  }
}

ComponentShareHolderDetail.PropTypes = {
  shareHolderId: PropTypes.number
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDetailShareHolder,
    getMasterDataFields,
    clearValuesAdressess,
    consultListWithParameterUbication,
    consultDataSelect,
  }, dispatch);
}

function mapStateToProps({editShareholderReducer, selectsReducer, notes},ownerProps) {
  const shareHolderEdit = editShareholderReducer.get('shareHolderEdit');
  if(shareHolderEdit !== undefined && shareHolderEdit !== null && shareHolderEdit !== ''){
    return {
      editShareholderReducer,
      selectsReducer,
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
