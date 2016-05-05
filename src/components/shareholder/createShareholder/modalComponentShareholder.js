import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Row, Grid, Col} from 'react-flexbox-grid';
import Modal from 'react-modal';
import {reduxForm} from 'redux-form';
import SweetAlert from 'sweetalert-react';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import InputComponent from '../../../ui/input/inputComponent';
import {toggleModalShareholder, clearSearchShareholder, searchShareholder} from './actions';
import {consultDataSelect, consultListWithParameterUbication, getMasterDataFields, clearValuesAdressess} from '../../selectsComponent/actions';
import {CONTACT_ID_TYPE, FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY, SHAREHOLDER_TYPE} from '../../selectsComponent/constants';
import numeral from 'numeral';

const fields =["tipoDocumento", "numeroDocumento", "tipoPersona",
      "tipoAccionista", "paisResidencia", "primerNombre", "segundoNombre",
      "primerApellido","segundoApellido", "razonSocial", "direccion", "porcentajePart",
      "pais", "departamento", "ciudad", "numeroIdTributaria", "observaciones"];
const errors = {};
const validate = (values) => {
  return errors;
};
class ModalComponentShareholder extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this._searchShareholder = this._searchShareholder.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._onClickLimpiar = this._onClickLimpiar.bind(this);
    this.state = {
       showEx:false,
       showEr:false,
       showErrorYa: false,
       showErrorNo: false,
       noExiste : 'hidden',
       disabled : '',
       botonBus : 'block'
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
    getMasterDataFields([CONTACT_ID_TYPE, , FILTER_COUNTRY, FILTER_PROVINCE, FILTER_CITY]);
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

  _onChangeCountry(val){
    const {fields: {country, province, city}} = this.props;
    country.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_PROVINCE, country.value);
    province.onChange('');
    city.onChange('');
  }

  _onChangeProvince(val){
    const {fields: {country, province, city}} = this.props;
    province.onChange(val);
    const {consultListWithParameterUbication} = this.props;
    consultListWithParameterUbication(constants.FILTER_CITY, province.value);
    city.onChange('');
  }

  _handleCreateShareholder(){
    console.log("save information");
  }

  render(){
    const {fields:{ tipoDocumento, numeroDocumento, tipoPersona, tipoAccionista,
      paisResidencia, primerNombre, segundoNombre, primerApellido, segundoApellido,
      razonSocial, direccion, porcentajePart, pais, departamento, ciudad,
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
                      <dt><span>Tipo de persona(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="tipoPersona" labelInput="Seleccione"
                          {...tipoPersona}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get("dataTypeShareholders") || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Tipo de accionista(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="tipoAccionista" labelInput="Seleccione"
                          {...tipoAccionista}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>País de residencia fiscal(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="paisResidencia" labelInput="Seleccione"
                          {...paisResidencia}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Primer nombre(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="primerNombre"
                          placeholder="Ingrese el primer nombre del accionista"
                          type="text"
                          {...primerNombre}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Segundo nombre</span></dt>
                        <InputComponent
                          name="segundoNombre"
                          placeholder="Ingrese el segundo nombre del accionista"
                          type="text"
                          {...segundoNombre}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Primer apellido(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="primerApellido"
                          placeholder="Ingrese el primer apellido del accionista"
                          type="text"
                          {...primerApellido}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Segundo apellido(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="segundoApellido"
                          placeholder="Ingrese el segundo apellido del accionista"
                          type="text"
                          {...segundoApellido}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={8}>
                        <dt><span>Razón social(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="razonSocial"
                          placeholder="Ingrese la razón social del accionista"
                          type="text"
                          {...razonSocial}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={8}>
                        <dt><span>Dirección sede principal(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="direccion"
                          placeholder="Ingrese la dirección del accionista"
                          type="text"
                          {...direccion}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Porcentaje de participación(</span><span style={{color: "red"}}>*</span>)</dt>
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
                        <dt><span>País(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="pais" labelInput="Seleccione"
                          {...pais}
                          valueProp={'id'}
                          textProp = {'value'}
                          onChange={val => this._onChangeCountry(val)}
                          data={selectsReducer.get(FILTER_COUNTRY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Departamento(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="departamento" labelInput="Seleccione"
                          {...departamento}
                          valueProp={'id'}
                          textProp = {'value'}
                          onChange={val => this._onChangeProvince(val)}
                          data={selectsReducer.get(FILTER_PROVINCE) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Ciudad(</span><span style={{color: "red"}}>*</span>)</dt>
                        <ComboBox name="ciudad" labelInput="Seleccione"
                          {...ciudad}
                          valueProp={'id'}
                          textProp = {'value'}
                          data={selectsReducer.get(FILTER_CITY) || []}
                        />
                      </Col>
                      <Col xs={12} md={4} lg={4}>
                        <dt><span>Número de id tributaria(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="numeroIdTributaria"
                          style={{textAlign: "right"}}
                          placeholder="Ingrese el número de id tributaria"
                          type="number"
                          min={0}
                          {...numeroIdTributaria}
                        />
                      </Col>
                      <Col xs={12} md={8} lg={8}>
                        <dt><span>Observaciones(</span><span style={{color: "red"}}>*</span>)</dt>
                        <InputComponent
                          name="observaciones"
                          placeholder="Ingrese la observaciones"
                          type="text"
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
