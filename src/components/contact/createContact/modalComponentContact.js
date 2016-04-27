import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {toggleModalContact} from './actions';
import {bindActionCreators} from 'redux';
import * as views from './constants';
import {DateTimePicker} from 'react-widgets';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {reduxForm} from 'redux-form';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import MultipleSelect from '../../../ui/multipleSelect/multipleSelectComponent';
import TextareaComponent from '../../../ui/textarea/textareaComponent';
import {consultDataSelect,consultList,consultListWithParameterUbication} from '../../selectsComponent/actions';
import * as constants from '../../selectsComponent/constants';

const fields =["tipoDocumento","tipoTratamiendo","tipoGenero","tipoDependencia","tipoEstiloSocial","tipoActitud", "tipoContacto",
"numeroDocumento","primerNombre","segundoNombre","primerApellido", "segundoApellido","fechaNacimiento","direccion","barrio",
"codigoPostal","telefono","extension","celular","correo","tipoEntidad", "tipoFuncion","tipoHobbie", "tipoDeporte", "pais", "departamento", "ciudad"];
const errors = {};
const validate = values => {
  if(!values.tipoDocumento){
    errors.tipoDocumento = "Seleccione un tipo de documento";
  }else{
    errors.tipoDocumento = null;
  }
  if(!values.tipoFuncion){
    errors.tipoFuncion = "Seleccione una función";
  }else{
    errors.tipoFuncion = null;
  }
  if(!values.numeroDocumento){
    errors.numeroDocumento = "Ingrese el número de documento";
  }else{
    errors.numeroDocumento = null;
  }
  if(!values.primerNombre){
    errors.primerNombre = "Ingrese el primer nombre";
  }else{
    errors.primerNombre = null;
  }
  if(!values.primerApellido){
    errors.primerApellido = "Ingrese el primer apellido";
  }else{
    errors.primerApellido = null;
  }
  if(!values.direccion){
    errors.direccion = "Ingrese la dirección";
  }else{
    errors.direccion = null;
  }
  if(!values.telefono){
    errors.telefono = "Ingrese el teléfono";
  }else{
    errors.telefono = null;
  }
  if(!values.correo){
    errors.correo = "Ingrese el correo electrónico";
  }else{
    errors.correo = null;
  }
  if(!values.tipoTratamiendo){
    errors.tipoTratamiendo = "Seleccione un tipo de tratamiendo";
  }else{
    errors.tipoTratamiendo = null;
  }
  if(!values.tipoGenero){
    errors.tipoGenero = "Seleccione un género";
  }else{
    errors.tipoGenero = null;
  }
  if(!values.tipoContacto){
    errors.tipoContacto = "Seleccione un tipo de contacto";
  }else{
    errors.tipoContacto = null;
  }
  if(!values.pais){
    errors.pais = "Seleccione un país";
  }else{
    errors.pais = null;
  }
  if(!values.departamento){
    errors.departamento = "Seleccione un departamento";
  }else{
    errors.departamento = null;
  }
  if(!values.ciudad){
    errors.ciudad = "Seleccione una ciudad";
  }else{
    errors.ciudad = null;
  }
  return errors;
};
class ModalComponentContact extends Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this._handleCreateContact = this._handleCreateContact.bind(this);
        this._onChangeCountry = this._onChangeCountry.bind(this);
        this._onChangeProvince = this._onChangeProvince.bind(this);
        momentLocalizer(moment);
    }

    componentWillMount(){
      const{consultDataSelect,consultList} = this.props;
      consultDataSelect(constants.CLIENT_ID_TYPE);
      consultDataSelect(constants.FILTER_TITLE);
      consultDataSelect(constants.FILTER_GENDER);
      consultDataSelect(constants.FILTER_DEPENDENCY);
      consultDataSelect(constants.FILTER_SOCIAL_STYLE);
      consultDataSelect(constants.FILTER_ATTITUDE_OVER_GROUP);
      consultDataSelect(constants.FILTER_COUNTRY);
      consultDataSelect(constants.FILTER_TYPE_CONTACT_ID);
      consultDataSelect(constants.FILTER_TYPE_LBO_ID);
      consultDataSelect(constants.FILTER_FUNCTION_ID);
      consultDataSelect(constants.FILTER_HOBBIES);
      consultDataSelect(constants.FILTER_SPORTS);
    }

    closeModal() {
        this.props.toggleModalContact();
    }

    _onChangeCountry(val){
      const {fields: {pais, departamento, ciudad}} = this.props;
      pais.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(constants.FILTER_PROVINCE, pais.value);
      departamento.onChange('');
      ciudad.onChange('');
    }

    _onChangeProvince(val){
      const {fields: {pais, departamento, ciudad}} = this.props;
      departamento.onChange(val);
      const {consultListWithParameterUbication} = this.props;
      consultListWithParameterUbication(constants.FILTER_CITY, departamento.value);
      ciudad.onChange('');
    }

    _handleCreateContact(){

    }

    render() {
        const {modalStatus,selectsReducer} = this.props;
        const {fields:{tipoDocumento,tipoTratamiendo,tipoGenero,tipoDependencia,tipoEstiloSocial,tipoActitud,tipoPais,tipoContacto,
        numeroDocumento,primerNombre,segundoNombre,primerApellido, segundoApellido,fechaNacimiento,direccion,barrio,
        codigoPostal,telefono,extension,celular,correo,tipoEntidad,tipoFuncion,tipoHobbie, tipoDeporte,pais,departamento,ciudad},handleSubmit,error}= this.props;
        const status = modalStatus ? "Verdadero" : "Falso";
        return (
          <Modal
              isOpen={modalStatus}
              onRequestClose={this.closeModal}
              className="modalBt4-fade modal fade contact-detail-modal in">
              <form onSubmit={handleSubmit(this._handleCreateContact)}>
              <div className="modalBt4-dialog modalBt4-lg">
                  <div className="modalBt4-content modal-content">
                      <div className="modalBt4-header modal-header">
                        <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Contacto</h4>
                      <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                        <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                        <span className="sr-only">Close</span>
                      </button>
                      </div>
                      <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
                      <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información básica contacto</span></dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                            <Row>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tipo de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                  {...tipoDocumento}
                                  valueProp={'id'}
                                  textProp = {'value'}
                                  data={selectsReducer.get('dataTypeDocument')}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Número de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><InputComponent
                                    name="numeroDocumento"
                                    type="text"
                                    {...numeroDocumento}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                <button className="btn btn-primary" style={{marginTop: '35px'}}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="search  icon" ></i></button>
                                </dl>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Tratamiento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><ComboBox name="tipoDocumento" labelInput="Seleccione"
                                  {...tipoTratamiendo}
                                  valueProp={'id'}
                                  textProp = {'value'}
                                  data={selectsReducer.get('dataTypeTitle')}
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
                                  data={selectsReducer.get('dataTypeGender')}
                                  /></dd>
                                </dl>
                                </Col>
                                <Col xs>
                                <dl style={{width: '100%'}}>
                                  <dt><span>Primer nombre (<span style={{color: 'red'}}>*</span>)</span></dt>
                                  <dd><InputComponent
                                    name="primerNombre"
                                    type="text"
                                    {...primerNombre}
                                  /></dd>
                                </dl>
                                </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo nombre</span></dt>
                                <dd><InputComponent
                                  name="segundoNombre"
                                  type="text"
                                  {...segundoNombre}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Primer apellido (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><InputComponent
                                  name="primerApellido"
                                  type="text"
                                  {...primerApellido}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Segundo apellido</span></dt>
                                <dd><InputComponent
                                  name="segundoApellido"
                                  type="text"
                                  {...segundoApellido}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Cargo</span></dt>
                                <dd><div className="ui input" style={{width: '100%'}}><input type="text"/></div></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Área dependencia</span></dt>
                                <dd><ComboBox name="tipoDependencia" labelInput="Seleccione"
                                {...tipoDependencia}
                                valueProp={'id'}
                                textProp = {'value'}
                                data={selectsReducer.get('dataTypeDependency')}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Fecha nacimiento</span></dt>
                                <dd><DateTimePicker time={false} culture='es' {...fechaNacimiento}/></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Estilo social</span></dt>
                                <dd><ComboBox name="tipoEstiloSocial" labelInput="Seleccione"
                                {...tipoEstiloSocial}
                                valueProp={'id'}
                                textProp = {'value'}
                                data={selectsReducer.get('dataTypeSocialStyle')}
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
                                data={selectsReducer.get('dataTypeAttitudeOverGroup')}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt className="col-md-12 business-title">Información de ubicación y correspondencia</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>País (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><ComboBox
                                  name="pais"
                                  labelInput="Pais"
                                  onChange={val => this._onChangeCountry(val)}
                                  value={pais.value}
                                  onBlur={pais.onBlur}
                                  valueProp={'id'}
                                  textProp={'value'}
                                  data={selectsReducer.get('dataTypeCountry')}
                                  /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Departamento (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><ComboBox
                                    name="departamento"
                                    labelInput="Departamento"
                                    onChange={val => this._onChangeProvince(val)}
                                    value={departamento.value}
                                    onBlur={departamento.onBlur}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeProvince')}
                                    /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Ciudad (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd> <ComboBox
                                    name="ciudad"
                                    labelInput="Ciudad"
                                    {...ciudad}
                                    valueProp={'id'}
                                    textProp={'value'}
                                    data={selectsReducer.get('dataTypeCity')}
                                    /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Dirección (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><TextareaComponent
                                  name="direccion"
                                  type="text"
                                  style={{width: '100%', height: '100%'}}
                                  {...direccion}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Barrio</span></dt>
                                <dd><InputComponent
                                  name="barrio"
                                  type="text"
                                  {...barrio}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Código postal</span></dt>
                                <dd><InputComponent
                                  name="codigoPostal"
                                  type="text"
                                  {...codigoPostal}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Teléfono (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><InputComponent
                                  name="telefono"
                                  type="text"
                                  {...telefono}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Extensión</span></dt>
                                <dd><InputComponent
                                  name="extension"
                                  type="text"
                                  {...extension}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Celular</span></dt>
                                <dd><InputComponent
                                  name="celular"
                                  type="text"
                                  {...celular}
                                /></dd>
                              </dl>
                              </Col>
                              <Col xs>
                              <dl style={{width: '100%'}}>
                                <dt><span>Correo electrónico (<span style={{color: 'red'}}>*</span>)</span></dt>
                                <dd><InputComponent
                                  name="correo"
                                  type="text"
                                  {...correo}
                                /></dd>
                              </dl>
                              </Col>
                            </Row>
                      </div>
                      <dt className="col-md-12 business-title">Clasificación de contacto</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Tipo de contacto (<span style={{color: 'red'}}>*</span>)</span></dt>
                            <dd><ComboBox name="tipoContacto" labelInput="Seleccione"
                            {...tipoContacto}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get('dataTypeContact')}
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
                            data={selectsReducer.get('dataTypeLBO')}
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
                            data={selectsReducer.get('dataTypeFunction')}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      <dt className="col-md-12 business-title">Hobbies y Deportes</dt>
                      <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                        <Row>
                          <Col xs>
                          <dl style={{width: '100%'}}>
                            <dt><span>Hobbie</span></dt>
                            <dd><MultipleSelect name="tipoHobbie" labelInput="Seleccione"
                            {...tipoHobbie}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get('dataTypeHobbies')}
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
                            data={selectsReducer.get('dataTypeSports')}
                            /></dd>
                          </dl>
                          </Col>
                        </Row>
                      </div>
                      </div>
                        <div className="modalBt4-footer modal-footer">
                        <button type="submit" className="btn btn-primary modal-button-edit">Guardar
                        </button>
                        </div>
                  </div>
              </div>
              </form>
          </Modal>
        );
    }
}

function mapStateToProps({createContactReducer,selectsReducer}) {
    return {
        modalStatus: createContactReducer.get('modalState'),
        selectsReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleModalContact,
        consultDataSelect,
        consultListWithParameterUbication,
        consultList
    }, dispatch);
}

export default reduxForm({form : 'submitValidation', fields, validate}, mapStateToProps,mapDispatchToProps)(ModalComponentContact);
