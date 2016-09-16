import React, {Component} from 'react';
import {Row, Grid, Col} from 'react-flexbox-grid';
import {bindActionCreators} from 'redux';
import SweetAlert from 'sweetalert-react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import {reduxForm} from 'redux-form';
import {OrderedMap} from 'immutable';
import {getMasterDataFields} from '../../selectsComponent/actions';
import {addProduct, updateProduct} from './actions';
import {CLIENT_TYPE_PRODUCT, FILTER_COUNTRY} from '../../selectsComponent/constants';
import * as constants from '../../../constantsGlobal';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import numeral from 'numeral';

const fields = ["name", "type", "number", "averageMontlyAmount", "coin", "country", "city"];

const errors = {};

const validate = (values) => {
  if(!values.name){
    errors.name = constants.VALUE_REQUIERED;
  }else{
    errors.name = null;
  }
  if(!values.type){
    errors.type = constants.OPTION_REQUIRED;
  }else{
    errors.type = null;
  }
  if(!values.number){
    errors.number = constants.VALUE_REQUIERED;
  }else{
    errors.number = null;
  }
  if(!values.averageMontlyAmount){
    errors.averageMontlyAmount = constants.VALUE_REQUIERED;
  }else{
    errors.averageMontlyAmount = null;
  }
  if(!values.coin){
    errors.coin = constants.VALUE_REQUIERED;
  }else{
    errors.coin = null;
  }
  if(!values.country){
    errors.country = constants.VALUE_REQUIERED;
  }else{
    errors.country = null;
  }
  if(!values.city){
    errors.city = constants.OPTION_REQUIRED;
  }else{
    errors.city = null;
  }
  return errors;
};

class ModalProduct extends Component {

  constructor(props) {
    super(props);
    this._close = this._close.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._handleProduct = this._handleProduct.bind(this);
    this.state = {
      showMessage: false,
      typeMessage: '',
      titleMessage: '',
      textMessage: ''
    };

    momentLocalizer(moment);
  }

  _handleBlurValueNumber(typeValidation, valuReduxForm, val){
    var pattern;
    //Elimino los caracteres no validos
    for (var i=0, output='', validos="-0123456789"; i< (val + "").length; i++){
     if (validos.indexOf(val.toString().charAt(i)) !== -1){
        output += val.toString().charAt(i)
      }
    }
    val = output;

    if( typeValidation === constants.ALLOWS_NEGATIVE_INTEGER ){
      pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(val)){
        val = val.replace(pattern, "$1,$2");
      }
      valuReduxForm.onChange(val);
    } else {
      var value = numeral(valuReduxForm.value).format('0');
      if( value >= 0 ){
        pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)){
          val = val.replace(pattern, "$1,$2");
        }
        valuReduxForm.onChange(val);
      } else {
        valuReduxForm.onChange("");
      }
    }
  }

  _close() {
    this.setState({showMessage: false});
  }

  _closeCreate() {
    const {isOpen} = this.props;
    this.props.resetForm();
    this.setState({showMessage: false});
    isOpen();
  }

  _handleProduct(){
    const {fields:{name, type, number, averageMontlyAmount, coin, country, city}, clientProductReducer, addProduct, updateProduct, productDetail} = this.props;
    var uid, titleMessage, textMessage;
    if(productDetail !== null){
      uid = productDetail.uid;
    } else{
      uid = _.uniqueId('product_');
    }
    var product = {
      uid,
      name: name.value,
      type: type.value,
      number: number.value,
      averageMontlyAmount: averageMontlyAmount.value,
      coin: coin.value,
      country: country.value,
      city: city.value
    };
    if(productDetail !== null){
      updateProduct(product);
      titleMessage = "Producto actualizado";
      textMessage = "Señor usuario, el producto se actualizó correctamente.";
    } else{
      addProduct(product);
      titleMessage = "Producto adicionado";
      textMessage = "Señor usuario, el producto se adicionó correctamente.";
    }

    this.setState({
      showMessage: true,
      typeMessage: constants.MESSAGE_SUCCESS,
      titleMessage: titleMessage,
      textMessage: textMessage
    });
  }

  componentWillMount() {
    const {getMasterDataFields} = this.props;
    getMasterDataFields([CLIENT_TYPE_PRODUCT, FILTER_COUNTRY]);
  }

  render() {
    const {fields:{name, type, number, averageMontlyAmount, coin, country, city}, handleSubmit, error, modalStatus, selectsReducer, productDetail} = this.props;
    return (
      <form onSubmit={handleSubmit(this._handleProduct)}>
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
          <div style={{paddingLeft:'20px',paddingRight:'20px'}}>
            <Row>
              <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
                <dt>
                  <span>Nombre de la entidad (</span><span style={{color: "red"}}>*</span>)
                </dt>
                <Input
                  name="txtName"
                  type="text"
                  max="200"
                  {...name}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>Tipo de producto (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="type"
                  labelInput="Seleccione el tipo..."
                  {...type}
                  value={type.value}
                  onBlur={type.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get(CLIENT_TYPE_PRODUCT) || []}
                  />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
                <dt>
                  <span>Número de producto (</span><span style={{color: "red"}}>*</span>)
                </dt>
                <Input
                  name="txtNumber"
                  type="text"
                  max="200"
                  {...number}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>Monto mensual (</span><span style={{color: "red"}}>*</span>)</dt>
                <Input
                  name="txtMontly"
                  style={{width: "100%", textAlign: "right"}}
                  type="text"
                  min={0}
                  max="16"
                  {...averageMontlyAmount}
                  onBlur={val => this._handleBlurValueNumber(constants.ONLY_POSITIVE_INTEGER, averageMontlyAmount, averageMontlyAmount.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} >
                <dt><span>Moneda (</span><span style={{color: "red"}}>*</span>)</dt>
                <Input
                  name="txtCoin"
                  type="text"
                  max="100"
                  {...coin}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>País (</span><span style={{color: "red"}}>*</span>)</dt>
                <ComboBox
                  name="type"
                  labelInput="Seleccione el tipo..."
                  {...country}
                  value={country.value}
                  onBlur={country.onBlur}
                  valueProp={'id'}
                  textProp={'value'}
                  parentId="dashboardComponentScroll"
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                  />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} style={{paddingRight: "20px"}}>
                <dt>
                  <span>Ciudad (</span><span style={{color: "red"}}>*</span>)
                </dt>
                <Input
                  name="txtcity"
                  type="text"
                  max="150"
                  {...city}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className="modalBt4-footer modal-footer">
          <button type="submit" className="btn btn-primary modal-button-edit">
            Guardar
          </button>
        </div>
        <SweetAlert
         type={this.state.typeMessage}
         show={this.state.showMessage}
         title={this.state.titleMessage}
         text={this.state.textMessage}
         onConfirm={() => this._closeCreate()}
         />
      </form>
    );
  }
}

function mapStateToProps({selectsReducer, clientProductReducer}, {fields, productDetail}) {
  if(productDetail !== null && productDetail !== undefined){
    return {
      selectsReducer,
      clientProductReducer,
      initialValues: {
        name: productDetail.name,
        type: productDetail.type,
        number: productDetail.number,
        averageMontlyAmount: productDetail.averageMontlyAmount,
        coin: productDetail.coin,
        country: productDetail.country,
        city: productDetail.city
      }
    };
  }else{
    return {
      selectsReducer,
      clientProductReducer,
      initialValues: {
        name: '',
        type: '',
        number: '',
        averageMontlyAmount: '',
        coin: '',
        country: '',
        city: ''
      }
    };
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      getMasterDataFields,
      addProduct,
      updateProduct
    }, dispatch);
}

export default reduxForm({
    form: 'submitValidation',
    destroyOnUnmount: false,
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(ModalProduct);
