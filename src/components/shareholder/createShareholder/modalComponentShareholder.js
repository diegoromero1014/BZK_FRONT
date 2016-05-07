import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import Textarea from '../../../ui/textarea/textareaComponent';
import {toggleModalShareholder, clearSearchShareholder, searchShareholder} from './actions';
import {consultDataSelect, consultListWithParameterUbication, getMasterDataFields, clearValuesAdressess} from '../../selectsComponent/actions';
import {CONTACT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE} from '../../selectsComponent/constants';
import numeral from 'numeral';
import _ from 'lodash';

const fields =["tipoDocumento", "numeroDocumento", "tipoPersona",
      "tipoAccionista", "paisResidencia", "primerNombre", "segundoNombre",
      "primerApellido","segundoApellido", "genero", "razonSocial", "direccion", "porcentajePart",
      "pais", "departamento", "ciudad", "numeroIdTributaria", "observaciones"];
const errors = {};

const PERSONA_NATURAL = 451;
const PERSONA_JURIDICA = 452;

var valueTypeShareholder;

const validate = (values) => {
  if(!values.tipoPersona){
    errors.tipoPersona = "Debe seleccionar una opción";
  }else{
    errors.tipoPersona = null;
  }
  if(!values.tipoAccionista){
    errors.tipoAccionista = "Debe seleccionar una opción";
  }else{
    errors.tipoAccionista = null;
  }
  if(!values.paisResidencia){
    errors.paisResidencia = "Debe seleccionar una opción";
  }else{
    errors.paisResidencia = null;
  }
  if(!values.primerNombre && valueTypeShareholder === PERSONA_NATURAL){
    errors.primerNombre = "Debe ingresar un valor";
  }else{
    errors.primerNombre = null;
  }
  if(!values.segundoNombre && valueTypeShareholder === PERSONA_NATURAL){
    errors.segundoNombre = "Debe ingresar un valor";
  }else{
    errors.segundoNombre = null;
  }
  if(!values.primerApellido && valueTypeShareholder === PERSONA_NATURAL){
    errors.primerApellido = "Debe ingresar un valor";
  }else{
    errors.primerApellido = null;
  }
  if(!values.segundoApellido && valueTypeShareholder === PERSONA_NATURAL){
    errors.segundoApellido = "Debe ingresar un valor";
  }else{
    errors.segundoApellido = null;
  }
  if(!values.genero && valueTypeShareholder === PERSONA_NATURAL){
    errors.genero = "Debe seleccionar un valor";
  }else{
    errors.genero = null;
  }
  if(!values.razonSocial && valueTypeShareholder === PERSONA_JURIDICA){
    errors.razonSocial = "Debe ingresar un valor";
  }else{
    errors.razonSocial = null;
  }
  if(!values.direccion){
    errors.direccion = "Debe ingresar un valor";
  }else{
    errors.direccion = null;
  }
  if(!values.porcentajePart){
    errors.porcentajePart = "Debe ingresar un valor";
  }else{
    errors.porcentajePart = null;
  }
  if(!values.pais){
    errors.pais = "Debe seleccionar un valor";
  }else{
    errors.pais = null;
  }
  if(!values.departamento){
    errors.departamento = "Debe seleccionar un valor";
  }else{
    errors.departamento = null;
  }
  if(!values.ciudad){
    errors.ciudad = "Debe seleccionar un valor";
  }else{
    errors.ciudad = null;
  }
  if(!values.numeroIdTributaria){
    errors.numeroIdTributaria = "Debe ingresar un valor";
  }else{
    errors.numeroIdTributaria = null;
  }
  if(!values.observaciones){
    errors.observaciones = "Debe ingresar un valor";
  }else{
    errors.observaciones = null;
  }

  return errors;
};
class ModalComponentShareholder extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this._searchShareholder = this._searchShareholder.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._onClickLimpiar = this._onClickLimpiar.bind(this);
    this._onChangeTypeShareholder = this._onChangeTypeShareholder.bind(this);
    this.state = {
       showEx:false,
       showEr:false,
       showErrorYa: false,
       showErrorNo: false,
       noExiste : 'hidden',
       disabled : '',
       botonBus : 'block',
       valueTypeShareholder: ""
    }
  }

  _closeCreate(){
    this.setState({showEx:false, showEr: false,showErrorYa:false, showErrorNo:false});
  }

  _onClickLimpiar(){
    const{clearSearchShareholder} = this.props;
    clearSearchShareholder();
    this.props.resetForm();
    this.setState({disabled : '', noExiste: 'hidden', botonBus: 'block'});
  }

  componentWillMount(){
    const{getMasterDataFields, clearValuesAdressess, consultDataSelect} = this.props;
    clearValuesAdressess();
    getMasterDataFields([CONTACT_ID_TYPE, FILTER_COUNTRY]);
    consultDataSelect(SHAREHOLDER_TYPE);
  }

  closeModal() {
    const {createShareholder} = this.props;
    clearSearchShareholder();
    this.props.resetForm();
    this.props.toggleModalShareholder();
    this.setState({disabled : '', noExiste: 'hidden', botonBus: 'block'});
  }

  _searchShareholder(){
    const {fields:{tipoDocumento, numeroDocumento},
      searchShareholder, clearSearchShareholder}= this.props;
    /*if(tipoDocumento.value && numeroDocumento.value){
      searchShareholder(tipoDocumento.value, numeroDocumento.value,
        window.localStorage.getItem('idClientSelected')).then((data) => {
          if((_.get(data, 'payload.data.isShareholder'))){
              clearSearchShareholder();
              this.props.resetForm();
              this.setState({showErrorYa: true});
            }else if(!(_.get(data, 'payload.data.findShareholder'))){
              this.setState({showErrorNo: true});
              this.setState({disabled : 'disabled'});
              this.setState({noExiste : 'visible'});
              this.setState({botonBus : 'none'});
            } else if ((_.get(data, 'payload.data.findShareholder'))){
              this.setState({disabled : 'disabled'});
              this.setState({noExiste : 'visible'});
              this.setState({botonBus : 'none'});
            }
          }, (reason) => {
            this.setState({showEr: true});
        });
    }*/
    this.setState({disabled : 'disabled'});
    this.setState({noExiste : 'visible'});
    this.setState({botonBus : 'none'});
  }

  _onChangeTypeShareholder(val){
    const {fields: {tipoPersona}} = this.props;
    tipoPersona.onChange(val);
    valueTypeShareholder = parseInt(val);
    this.setState({valueTypeShareholder : parseInt(val)});
  }

  _onChangeCountry(val){
    const {fields: {pais, departamento, ciudad}} = this.props;
    pais.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_PROVINCE, pais.value);
    departamento.onChange('');
    ciudad.onChange('');
  }

  _onChangeProvince(val){
    const {fields: {pais, departamento, ciudad}} = this.props;
    departamento.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(FILTER_CITY, departamento.value);
    ciudad.onChange('');
  }

  _handleCreateShareholder(){
    console.log("save information");
  }

  render(){
    const {fields:{ tipoDocumento, numeroDocumento, tipoPersona, tipoAccionista,
      paisResidencia, primerNombre, segundoNombre, primerApellido, segundoApellido,
      genero, razonSocial, direccion, porcentajePart, pais, departamento, ciudad,
      numeroIdTributaria, observaciones },
      selectsReducer, createShareholder,handleSubmit, error} = this.props;
    const modalStatus = createShareholder.get('modalState');
    return (
      <div>
      <Modal
          isOpen={modalStatus}
          onRequestClose={this.closeModal}
          className="modalBt4-fade modal fade contact-detail-modal in">
          <form onSubmit={handleSubmit(this._handleCreateShareholder)}>
          <div className="modalBt4-dialog modalBt4-lg">
              <div className="modalBt4-content modal-content">
                  <div className="modalBt4-header modal-header">
                    <h4 className="modal-title" style={{float: 'left', marginBottom: '0px'}} id="myModalLabel">Accionista</h4>
                  <button type="button" onClick={this.closeModal} className="close" data-dismiss="modal" role="close">
                    <span className="modal-title" aria-hidden="true" role="close"><i className="remove icon modal-icon-close" role="close"></i></span>
                    <span className="sr-only">Close</span>
                  </button>
                  </div>
                  <div className="modalBt4-body modal-body business-content editable-form-content clearfix">
                  <dt className="business-title"><span style={{paddingLeft: '20px'}}>Información básica accionista</span></dt>
                  <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
                    <Row>
                        <Col xs>
                        <dl style={{width: '100%'}}>
                          <dt><span>Tipo de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                          <dd>
                          <ComboBox name="tipoDocumento" labelInput="Seleccione"
                            {...tipoDocumento}
                            disabled = {this.state.disabled}
                            valueProp={'id'}
                            textProp = {'value'}
                            data={selectsReducer.get(CONTACT_ID_TYPE) || []}
                          />
                          </dd>
                        </dl>
                        </Col>
                        <Col xs>
                        <dl style={{width: '100%'}}>
                          <dt><span>Número de documento (<span style={{color: 'red'}}>*</span>)</span></dt>
                          <dd><InputComponent
                            name="numeroDocumento"
                            max={15}
                            placeholder="Ingrese el documento del accionista"
                            type="text"
                            disabled = {this.state.disabled}
                            {...numeroDocumento}
                          /></dd>
                        </dl>
                        </Col>
                        <Col xs>
                        <dl style={{width: '100%'}}>
                          <button type="button" className="btn btn-primary" style={{marginTop: '35px',display: this.state.botonBus}} onClick={this._searchShareholder}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="search icon" ></i></button>
                          <button type="button" className="btn btn-primary" style={{marginTop: '35px',visibility: this.state.noExiste}}  onClick={this._onClickLimpiar}><i style={{color: "white",margin:'0em', fontSize : '1.2em'}} className="erase icon" ></i></button>
                        </dl>
                        </Col>
                    </Row>
                    <Row style={{visibility: this.state.noExiste}}>
                      <Col xs={12} md={4} lg={4}>
                      <dt><span>Tipo de persona (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="tipoPersona" labelInput="Seleccione"
                          {...tipoPersona}
                          valueProp={'id'}
                          textProp = {'value'}
                          onChange={val => this._onChangeTypeShareholder(val)}
                          data={selectsReducer.get("dataTypeShareholders") || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Tipo de accionista (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="tipoAccionista" labelInput="Seleccione"
                          {...tipoAccionista}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>País de residencia fiscal (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="paisResidencia" labelInput="Seleccione"
                          {...paisResidencia}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>

                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                        <dt><span>Primer nombre (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="primerNombre"
                          placeholder="Ingrese el primer nombre del accionista"
                          type="text"
                          max={50}
                          {...primerNombre}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                        <dt><span>Segundo nombre</span></dt>
                        <InputComponent
                          name="segundoNombre"
                          placeholder="Ingrese el segundo nombre del accionista"
                          type="text"
                          max={50}
                          {...segundoNombre}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                        <dt><span>Primer apellido (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="primerApellido"
                          placeholder="Ingrese el primer apellido del accionista"
                          type="text"
                          max={50}
                          {...primerApellido}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                        <dt><span>Segundo apellido (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="segundoApellido"
                          placeholder="Ingrese el segundo apellido del accionista"
                          type="text"
                          max={50}
                          {...segundoApellido}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_NATURAL ? { display: "block" }: {display: "none"}}>
                        <dt><span>Género (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="genero" labelInput="Seleccione"
                          {...genero}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4} style={this.state.valueTypeShareholder === PERSONA_JURIDICA ? { display: "block" }: {display: "none"}}>
                        <dt><span>Razón social (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="razonSocial"
                          placeholder="Ingrese la razón social del accionista"
                          type="text"
                          max={110}
                          {...razonSocial}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={8}>
                        <dt><span>Dirección sede principal (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="direccion"
                          placeholder="Ingrese la dirección del accionista"
                          type="text"
                          max={100}
                          {...direccion}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Porcentaje de participación (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="porcentajePart"
                          style={{textAlign: "right"}}
                          placeholder="Ingrese el procentaje de participación"
                          type="number"
                          min={0}
                          max={100}
                          {...porcentajePart}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>País (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="pais" labelInput="Seleccione"
                          {...pais}
                          valueProp={'id'}
                          textProp = {'value'}
                          onChange={val => this._onChangeCountry(val)}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Departamento (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="departamento" labelInput="Seleccione"
                          {...departamento}
                          valueProp={'id'}
                          textProp = {'value'}
                          onChange={val => this._onChangeProvince(val)}
                          data={selectsReducer.get('dataTypeProvince') || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Ciudad (</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="ciudad" labelInput="Seleccione"
                          {...ciudad}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get('dataTypeCity') || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Número de id tributaria (</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="numeroIdTributaria"
                          style={{textAlign: "right"}}
                          placeholder="Ingrese el número de id tributaria"
                          type="number"
                          min={0}
                          {...numeroIdTributaria}
                        />
                      </Col>
                      <Col xs={12} md={12} lg={12}>
                        <dt><span>Observaciones (</span><span style={{color: "red"}}>*</span>)</dt>
                        <Textarea
                          name="observaciones"
                          type="text"
                          max={250}
                          style={{width: '100%', height: '100%'}}
                          placeholder="Ingrese las observaciones"
                          {...observaciones}
                        />
                      </Col>
                    </Row>
                  </div>
                  </div>
                    <div className="modalBt4-footer modal-footer">
                      <button type="submit"
                        style={{visibility: this.state.noExiste}}
                        className="btn btn-primary modal-button-edit">Guardar
                    </button>
                    </div>
              </div>
          </div>
          </form>
      </Modal>
      <SweetAlert
       type= "warning"
       title="Advertencia"
       show={this.state.showErrorYa}
       text="El accionista ya se encuentra registrado en el cliente"
       onConfirm={() => this._closeCreate()}
       />
       <SweetAlert
        type= "error"
        show={this.state.showEr}
        title="Error"
        text="Se presento un error"
        onConfirm={() => this._closeCreate()}
        />
       <SweetAlert
        type= "warning"
        show={this.state.showErrorNo}
        title="Advertencia"
        text="El contacto no existe"
        onConfirm={() => this._closeCreate()}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      toggleModalShareholder,
      clearSearchShareholder,
      searchShareholder,
      getMasterDataFields,
      clearValuesAdressess,
      consultListWithParameterUbication,
      consultDataSelect
    }, dispatch);
}

function mapStateToProps({selectsReducer, createShareholder}, ownerProps) {
  return {
    selectsReducer,
    createShareholder
  };
}

export default reduxForm({
  form : 'submitValidation',
  fields,
  validate
}, mapStateToProps, mapDispatchToProps)(ModalComponentShareholder);
