import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {toggleModalContact,createContactNew,searchContact,clearSearchContact} from './actions';
import {clearContactDelete} from '../actions';
import {contactsByClientFindServer} from '../actions';
import {NUMBER_RECORDS} from '../constants';
import {bindActionCreators} from 'redux';
import * as views from './constants';
import {DateTimePicker} from 'react-widgets';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {reduxForm} from 'redux-form';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import TextareaComponent from '../../../ui/textarea/textareaComponent';
import DateTimePickerUi from '../../../ui/dateTimePicker/dateTimePickerComponent';
import {consultDataSelect,consultList,consultListWithParameterUbication,getMasterDataFields} from '../../selectsComponent/actions';
import {FILTER_CITY,FILTER_PROVINCE,CONTACT_ID_TYPE, FILTER_CONTACT_POSITION, FILTER_TITLE, FILTER_GENDER, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP} from '../../selectsComponent/constants';

const fields =["id","tipoDocumento","tipoTratamiendo","tipoGenero","tipoDependencia","tipoEstiloSocial","tipoCargo","tipoActitud", "tipoContacto",
"numeroDocumento","primerNombre","segundoNombre","primerApellido", "segundoApellido","fechaNacimiento","direccion","barrio",
"codigoPostal","telefono","extension","celular","correo","tipoEntidad", "tipoFuncion","tipoHobbie", "tipoDeporte", "pais", "departamento", "ciudad"];
const errors = {};
const validate = (values) => {
  console.log("tipoFuncion = ", values.tipoFuncion);
    if(!values.tipoFuncion){
      errors.tipoFuncion = "Debe Seleccionar una función";
    }else{
      console.log("length = ", _.isEmpty(values.tipoFuncion));
      errors.tipoFuncion = null;
    }
    if(!values.primerNombre){
      errors.primerNombre = "Debe ingresar el primer nombre";
    }else{
      errors.primerNombre = null;
    }
    if(!values.primerApellido){
      errors.primerApellido = "Debe ingresar el primer apellido";
    }else{
      errors.primerApellido = null;
    }
    if(!values.direccion){
      errors.direccion = "Debe ingresar la dirección";
    }else{
      errors.direccion = null;
    }
    if(!values.telefono){
      errors.telefono = "Debe ingresar el teléfono";
    }else{
      errors.telefono = null;
    }
    if(!values.correo){
      errors.correo = "Debe ingresar el correo electrónico";
    }else{
      if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(values.correo))){
          errors.correo = "Debe ingresar un formato válido";
      }else{
        errors.correo = null;
      }
    }

    if(!values.tipoTratamiendo){
      errors.tipoTratamiendo = "Debe Seleccionar un tipo de tratamiendo";
    }else{
      errors.tipoTratamiendo = null;
    }
    if(!values.tipoGenero){
      errors.tipoGenero = "Debe Seleccionar un género";
    }else{
      errors.tipoGenero = null;
    }
    if(!values.tipoContacto){
      errors.tipoContacto = "Debe Seleccionar un tipo de contacto";
    }else{
      errors.tipoContacto = null;
    }
    if(!values.pais){
      errors.pais = "Debe Seleccionar un país";
    }else{
      errors.pais = null;
    }
    if(!values.departamento){
      errors.departamento = "Debe Seleccionar un departamento";
    }else{
      errors.departamento = null;
    }
    if(!values.ciudad){
      errors.ciudad = "Debe Seleccionar una ciudad";
    }else{
      errors.ciudad = null;
    }
  return errors;
};
class ModalComponentContact extends Component {

    constructor(props) {
        super(props);
        this._close = this._close.bind(this);
        this._closeCreate = this._closeCreate.bind(this);
        this._handleCreateContact = this._handleCreateContact.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        this._searchContact = this._searchContact.bind(this);
        this._onClickLimpiar = this._onClickLimpiar.bind(this);
        this.state = {
           showEx:false,
           showEr:false,
           showErrorYa: false,
           noExiste : 'hidden',
           disabled : '',
           botonBus : 'block',
           disabledDep : 'disabled',
           disabledCiu :'disabled'
         }
        momentLocalizer(moment);
    }

    componentWillMount(){
      const{getMasterDataFields,clearSearchContact} = this.props;
      clearSearchContact();
      this.props.resetForm();
      getMasterDataFields([CONTACT_ID_TYPE, FILTER_TITLE, FILTER_CONTACT_POSITION,FILTER_GENDER, FILTER_DEPENDENCY, FILTER_COUNTRY, FILTER_TYPE_CONTACT_ID, FILTER_TYPE_LBO_ID, FILTER_FUNCTION_ID, FILTER_HOBBIES, FILTER_SPORTS, FILTER_SOCIAL_STYLE, FILTER_ATTITUDE_OVER_GROUP]);
    }

    _close(){
      this.setState({disabled : '', noExiste: 'hidden', botonBus: 'block'});
      this.setState({showErrorYa:false});
    }

    _onChangeCountry(val){
      const {fields: {pais, departamento, ciudad}} = this.props;
      pais.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(FILTER_PROVINCE, pais.value);
      departamento.onChange('');
      ciudad.onChange('');
      this.setState({disabledDep : ''});
    }

    _onChangeProvince(val){
      const {fields: {pais, departamento, ciudad}} = this.props;
      departamento.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(FILTER_CITY, departamento.value);
      ciudad.onChange('');
      this.setState({disabledCiu : ''});
    }

    _closeCreate(){
      const{clearSearchContact,isOpen,clearContactDelete} = this.props;
      clearSearchContact();
      this.props.resetForm();
      this.setState({disabled : '', noExiste: 'hidden', botonBus: 'block'});
      this.setState({showEx: false});
      isOpen();
      clearContactDelete();
    }

    _onClickLimpiar(){
      const{clearSearchContact} = this.props;
      clearSearchContact();
      this.props.resetForm();
      this.setState({disabled : '', noExiste: 'hidden', botonBus: 'block'});
    }

    _searchContact(){
      const {fields:{id,tipoDocumento,tipoTratamiendo,tipoGenero,tipoCargo,tipoDependencia,tipoEstiloSocial,tipoActitud,tipoContacto,
      numeroDocumento,primerNombre,segundoNombre,primerApellido, segundoApellido,fechaNacimiento,direccion,barrio,
      codigoPostal,telefono,extension,celular,correo,tipoEntidad,tipoFuncion,tipoHobbie, tipoDeporte,pais,departamento,ciudad},handleSubmit,error}= this.props;
      const {searchContact,clearSearchContact} = this.props;
      if(tipoDocumento.value && numeroDocumento.value){
        searchContact(tipoDocumento.value,numeroDocumento.value,window.localStorage.getItem('idClientSelected')).then((data) => {
            if((_.get(data, 'payload.data.isClientContact'))){
                clearSearchContact();
                this.props.resetForm();
                this.setState({showErrorYa: true});
              }else if(!(_.get(data, 'payload.data.findContact'))){
                this.setState({disabled : 'disabled'});
                this.setState({noExiste : 'visible'});
                this.setState({botonBus : 'none'});
              } else if ((_.get(data, 'payload.data.findContact'))){
                this.setState({disabled : 'disabled'});
                this.setState({noExiste : 'visible'});
                this.setState({botonBus : 'none'});
              }
            }, (reason) => {
              this.setState({showEr: true});
          });
      }
    }


    _handleCreateContact(){
      const {createContactNew,contactsByClientFindServer,createContactReducer} = this.props;
      const {fields:{id,tipoDocumento,tipoTratamiendo,tipoGenero,tipoCargo,tipoDependencia,tipoEstiloSocial,tipoActitud,tipoContacto,
      numeroDocumento,primerNombre,segundoNombre,primerApellido, segundoApellido,fechaNacimiento,direccion,barrio,
      codigoPostal,telefono,extension,celular,correo,tipoEntidad,tipoFuncion,tipoHobbie, tipoDeporte,pais,departamento,ciudad},handleSubmit,error}= this.props;
      var messageBody = {
        "id" :id.value,
        "client": window.localStorage.getItem('idClientSelected'),
        "title": tipoTratamiendo.value,
        "gender" : tipoGenero.value ,
        "contactType" : tipoDocumento.value,
        "contactIdentityNumber": numeroDocumento.value,
        "firstName":primerNombre.value,
        "middleName" : segundoNombre.value,
        "firstLastName" : primerApellido.value,
        "secondLastName" : segundoApellido.value,
        "contactPosition" : tipoCargo.value,
        "unit" : tipoDependencia.value,
        "function" : JSON.parse('[' + ((tipoFuncion.value)?tipoFuncion.value:"") +']'),
        "dateOfBirth" : fechaNacimiento.value !== '' && fechaNacimiento.value !== null && fechaNacimiento.value !== undefined ? moment(fechaNacimiento.value, "DD/MM/YYYY").format('x'): null,
        "address" : direccion.value,
        "country" : pais.value,
        "province" : departamento.value,
        "city" : ciudad.value,
        "neighborhood" : barrio.value,
        "postalCode" : codigoPostal.value,
        "telephoneNumber" : telefono.value,
        "extension" : extension.value,
        "mobileNumber" : celular.value,
        "emailAddress" : correo.value,
        "hobbies" : JSON.parse('[' + ((tipoHobbie.value)?tipoHobbie.value:"") +']'),
        "sports" : JSON.parse('[' + ((tipoDeporte.value)?tipoDeporte.value:"") +']'),
        "typeOfContact" : tipoContacto.value,
        "lineOfBusiness" : JSON.parse('[' + ((tipoEntidad.value)?tipoEntidad.value:"") +']'),
        "socialStyle" : tipoEstiloSocial.value,
        "attitudeOverGroup" : tipoActitud.value
      }
      createContactNew(messageBody).then((data) => {
          if((_.get(data, 'payload.data.status') === 200)){
              this.setState({showEx: true});
              contactsByClientFindServer(0,window.localStorage.getItem('idClientSelected'),NUMBER_RECORDS,"",0,"",
              "",
              "",
              "");
            } else {
              this.setState({showEr: true});
          }
          }, (reason) => {
            this.setState({showEr: true});
        });
    }

    render() {
        const {modalStatus,selectsReducer,createContactReducer} = this.props;
        const {initialValues, fields:{id,tipoDocumento,numeroDocumento,tipoTratamiendo,tipoGenero,tipoCargo,tipoDependencia,tipoEstiloSocial,tipoActitud,tipoPais,tipoContacto,
        primerNombre,segundoNombre,primerApellido, segundoApellido,fechaNacimiento,direccion,barrio,
        codigoPostal,telefono,extension,celular,correo,tipoEntidad,tipoFuncion,tipoHobbie, tipoDeporte,pais,departamento,ciudad},handleSubmit,error}= this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
        return (<form onSubmit={handleSubmit(this._handleCreateContact)}>
                      <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
                      <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información básica contacto</span></dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                            <Row>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tipo de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                  {...tipoDocumento}
                                  disabled = {this.state.disabled}
                                  valueProp={'id'}
                                  textProp = {'value'}
                                  parentId="modalComponentScroll"
                                  data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Número de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><Input
                                    name="numeroDocumento"
                                    type="text"
                                    max="20"
                                    placeholder="Ingrese el número de documento"
                                    disabled = {this.state.disabled}
                                    {...numeroDocumento}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <button type="button" className="btn btn-primary" style={{marginTop: '35px',display: this.state.botonBus}} onClick={this._searchContact}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="search icon" ></i></button>
                                  <button type="button" className="btn btn-primary" style={{marginTop: '35px',visibility: this.state.noExiste}}  onClick={this._onClickLimpiar}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="erase icon" ></i></button>
                                </dl>
                                </Col>
                            </Row>
                            <Row style={{visibility: this.state.noExiste}}>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tratamiento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><ComboBox name="tipoTratamiendo" labelInput="Seleccione"
                                  {...tipoTratamiendo}
                                  valueProp={'id'}
                                  textProp = {'value'}
                                  parentId="modalComponentScroll"
                                  data={selectsReducer.get(FILTER_TITLE) || []}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Género (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                  {...tipoGenero}
                                  valueProp={'id'}
                                  textProp = {'value'}
                                  parentId="modalComponentScroll"
                                  data={selectsReducer.get(FILTER_GENDER) || []}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Primer nombre (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd>
                                  <Input
                                    name="primerNombre"
                                    type="text"
                                    max="60"
                                    {...primerNombre}
                                    /></dd>
                                </dl>
                                </Col>
                            </Row>
                            <Row style={{visibility: this.state.noExiste}}>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo nombre</span></dt>
                                <dd><Input
                                  name="segundoNombre"
                                  type="text"
                                  max="60"
                                  {...segundoNombre}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Primer apellido (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><Input
                                  name="primerApellido"
                                  type="text"
                                  max="60"
                                  {...primerApellido}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo apellido</span></dt>
                                <dd><Input
                                  name="segundoApellido"
                                  type="text"
                                  max="60"
                                  {...segundoApellido}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row style={{visibility: this.state.noExiste}}>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Cargo</span></dt>
                                <dd><ComboBox name="tipoCargo" labelInput="Seleccione"
                                {...tipoCargo}
                                valueProp={'id'}
                                textProp = {'value'}
                                parentId="modalComponentScroll"
                                data={selectsReducer.get(FILTER_CONTACT_POSITION) || []}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Área dependencia</span></dt>
                                <dd><ComboBox name="tipoDependencia" labelInput="Seleccione"
                                {...tipoDependencia}
                                valueProp={'id'}
                                textProp = {'value'}
                                parentId="modalComponentScroll"
                                data={selectsReducer.get(FILTER_DEPENDENCY) || []}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Fecha nacimiento - DD/MM/YYYY</span></dt>
                                <dd><DateTimePickerUi culture='es' format={"DD/MM/YYYY"} time={false} {...fechaNacimiento}/></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row style={{visibility: this.state.noExiste}}>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Estilo social</span></dt>
                                <dd><ComboBox name="tipoEstiloSocial" labelInput="Seleccione"
                                {...tipoEstiloSocial}
                                valueProp={'id'}
                                textProp = {'value'}
                                parentId="modalComponentScroll"
                                data={selectsReducer.get(FILTER_SOCIAL_STYLE) || []}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Actitud frente al Grupo</span></dt>
                                <dd><ComboBox name="tipoActitud" labelInput="Seleccione"
                                {...tipoActitud}
                                valueProp={'id'}
                                textProp = {'value'}
                                parentId="modalComponentScroll"
                                data={selectsReducer.get(FILTER_ATTITUDE_OVER_GROUP) || []}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt style={{visibility: this.state.noExiste}} className="col-md-12 business-title">Información de ubicación y correspondencia</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px',visibility: this.state.noExiste}}>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>País (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><ComboBox
                                  name="pais"
                                  labelInput="Seleccione"
                                      {...pais}
                                  onChange={val => this._onChangeCountry(val)}
                                  value={pais.value}
                                  onBlur={pais.onBlur}
                                  valueProp={'id'}
                                  textProp={'value'}
                                  parentId="modalComponentScroll"
                                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                                  /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Departamento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><ComboBox
                                    name="departamento"
                                    labelInput="Seleccione"
                                        {...departamento}
                                    disabled = {this.state.disabledDep}
                                    onChange={val => this._onChangeProvince(val)}
                                    value={departamento.value}
                                    onBlur={departamento.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    parentId="modalComponentScroll"
                                    data={selectsReducer.get('dataTypeProvince')}
                                    /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Ciudad (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd> <ComboBox
                                    name="ciudad"
                                    disabled = {this.state.disabledCiu}
                                    labelInput="Seleccione"
                                    {...ciudad}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    parentId="modalComponentScroll"
                                    data={selectsReducer.get('dataTypeCity')}
                                    /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Dirección (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd>
                                <TextareaComponent
                                  name="direccion"
                                  type="text"
                                  max="250"
                                  style={{width: '100%', height: '100%'}}
                                  onChange={val => this._onchangeValue("direccion", val)}
                                  rows={4}
                                  {...direccion}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Barrio</span></dt>
                                <dd><Input
                                  name="barrio"
                                  type="text"
                                  max="120"
                                  {...barrio}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Código postal</span></dt>
                                <dd><Input
                                  name="codigoPostal"
                                  type="text"
                                  max="25"
                                  {...codigoPostal}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Teléfono (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><Input
                                  name="telefono"
                                  type="text"
                                  max="30"
                                  {...telefono}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Extensión</span></dt>
                                <dd><Input
                                  name="extension"
                                  type="text"
                                  max="20"
                                  {...extension}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Celular</span></dt>
                                <dd><Input
                                  name="celular"
                                  type="text"
                                  max="30"
                                  {...celular}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Correo electrónico (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><Input
                                  name="correo"
                                  type="text"
                                  max="150"
                                  {...correo}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt style={{visibility: this.state.noExiste}} className="col-md-12 business-title">Clasificación de contacto</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px',visibility: this.state.noExiste}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Tipo de contacto (<span style={{color: 'red'}}>*</span>)</span></dt>
                            <dd><ComboBox name="tipoContacto" labelInput="Seleccione"
                            {...tipoContacto}
                            valueProp={'id'}
                            textProp = {'value'}
                            parentId="modalComponentScroll"
                            data={selectsReducer.get(FILTER_TYPE_CONTACT_ID) || []}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Entidad /línea de negocio</span></dt>
                            <dd><MultipleSelect name="tipoEntidad" labelInput="Seleccione"
                            {...tipoEntidad}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get(FILTER_TYPE_LBO_ID) || []}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Función (<span style={{color: 'red'}}>*</span>)</span></dt>
                            <dd><MultipleSelect name="tipoFuncion" labelInput="Seleccione"
                            {...tipoFuncion}
                            valueProp={'id'}
                            textProp = {'value'}
                            parentId="modalComponentScroll"
                            data={selectsReducer.get(FILTER_FUNCTION_ID) || []}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      <dt style={{visibility: this.state.noExiste}} className="col-md-12 business-title">Hobbies y Deportes</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px',visibility: this.state.noExiste}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Hobbie</span></dt>
                            <dd><MultipleSelect name="tipoHobbie" labelInput="Seleccione"
                            {...tipoHobbie}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get(FILTER_HOBBIES) || []}
                            /></dd>
                          </dl>
                          </Col>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Deporte</span></dt>
                            <dd><MultipleSelect name="tipoDeporte" labelInput="Seleccione"
                            {...tipoDeporte}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get(FILTER_SPORTS) || []}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      </div>
                        <div className="modalBt4-footer modal-footer">
                        <button type="submit" style={{visibility: this.state.noExiste}} className="btn btn-primary modal-button-edit">Guardar
                        </button>
                        </div>
                        <SweetAlert
                         type= "success"
                         show={this.state.showEx}
                         title="Contacto creado"
                         text="Señor usuario, el contacto se creó correctamente."
                         onConfirm={() => this._closeCreate()}
                         />
                         <SweetAlert
                          type= "warning"
                          title="Advertencia"
                          show={this.state.showErrorYa}
                          text="Señor usuario, el cliente ya presenta una relación con el contacto buscado"
                          onConfirm={() => this._close()}
                          />
                          <SweetAlert
                           type= "error"
                           show={this.state.showEr}
                           title="Error"
                           text="Señor usuario, se presento un error"
                           onConfirm={() => this.setState({showEr:false})}
                           />
                  </form>
        );
    }
}

function mapStateToProps({createContactReducer,selectsReducer}, {fields}) {
  const contactDetail = !createContactReducer.get('isClientContact') ? createContactReducer.get('responseSearchContactData') : false;
    if(contactDetail && contactDetail.contactIdentityNumber){
    console.log("contactDetail.function", contactDetail.function);
    return {
      selectsReducer,
      initialValues: {
        id: contactDetail.id,
        tipoDocumento:contactDetail.contactType,
        numeroDocumento: contactDetail.contactIdentityNumber,
        tipoTratamiendo:contactDetail.title,
        tipoGenero:contactDetail.gender,
        primerNombre: contactDetail.firstName,
        segundoNombre:contactDetail.middleName,
        primerApellido:contactDetail.firstLastName,
        segundoApellido:contactDetail.secondLastName,
        tipoCargo:contactDetail.contactPosition,
        tipoDependencia:contactDetail.unit,
        fechaNacimiento: contactDetail.dateOfBirth !== '' && contactDetail.dateOfBirth !== null && contactDetail.dateOfBirth !== undefined ? moment(contactDetail.dateOfBirth).format('DD/MM/YYYY') : null,
        tipoEstiloSocial:contactDetail.socialStyle,
        tipoActitud:contactDetail.attitudeOverGroup,
        pais:contactDetail.country,
        departamento:contactDetail.province,
        ciudad:contactDetail.city,
        direccion:contactDetail.address,
        barrio:contactDetail.neighborhood,
        codigoPostal:contactDetail.postalCode,
        telefono:contactDetail.telephoneNumber,
        extension:contactDetail.extension,
        celular:contactDetail.mobileNumber,
        correo:contactDetail.emailAddress,
        tipoHobbie: JSON.parse('["'+_.join(contactDetail.hobbies, '","')+'"]'),
        tipoContacto:contactDetail.typeOfContact,
        tipoEntidad:JSON.parse('["'+_.join(contactDetail.lineOfBusiness, '","')+'"]'),
        tipoFuncion: contactDetail.function === null || contactDetail.function === '' || contactDetail.function === undefined ? contactDetail.function : JSON.parse('["'+_.join(contactDetail.function, '","')+'"]'),
        tipoDeporte:JSON.parse('["'+_.join(contactDetail.sports, '","')+'"]'),
      }
    };
  }else{
    return {
      selectsReducer,
      initialValues: {
        tipoDocumento: '',
        numeroDocumento: ''
      }
    };
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModalContact,
        clearSearchContact,
        searchContact,
        createContactNew,
        consultDataSelect,
        consultListWithParameterUbication,
        getMasterDataFields,
        contactsByClientFindServer,
        clearContactDelete,
        consultList
    }, dispatch);
}

export default reduxForm({form : 'submitValidation', fields, validate}, mapStateToProps, mapDispatchToProps)(ModalComponentContact);
