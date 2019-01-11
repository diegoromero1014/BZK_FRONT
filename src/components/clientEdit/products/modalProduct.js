import React, { Component } from 'react';
import { Row, Grid, Col } from 'react-flexbox-grid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import { OrderedMap } from 'immutable';
import numeral from 'numeral';

import SweetAlert from '../../sweetalertFocus';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import ComboBox from '../../../ui/comboBox/comboBoxComponent';
import Input from '../../../ui/input/inputComponent';
import SecurityMessageComponent from './../../globalComponents/securityMessageComponent';

import { getMasterDataFields } from '../../selectsComponent/actions';
import { addProduct, updateProduct } from './actions';

import { CLIENT_TYPE_PRODUCT, FILTER_COUNTRY } from '../../selectsComponent/constants';
import * as constants from '../../../constantsGlobal';

class ModalProduct extends Component {

  constructor(props) {
    super(props);
    this._close = this._close.bind(this);
    this._closeCreate = this._closeCreate.bind(this);
    this._handleProduct = this._handleProduct.bind(this);
    this._changeName = this._changeName.bind(this);
    this._changeType = this._changeType.bind(this);
    this._changeNumber = this._changeNumber.bind(this);
    this._changeAverageMontlyAmount = this._changeAverageMontlyAmount.bind(this);
    this._changeCoin = this._changeCoin.bind(this);
    this._changeCountry = this._changeCountry.bind(this);
    this._changeCity = this._changeCity.bind(this);
    this.state = {
      showMessage: false,
      typeMessage: '',
      titleMessage: '',
      textMessage: '',
      name: '',
      nameError: null,
      type: '',
      typeError: null,
      number: '',
      numberError: null,
      averageMontlyAmount: '',
      averageMontlyAmountError: null,
      coin: '',
      coinError: null,
      countryProduct: '',
      countryError: null,
      cityProduct: '',
      cityError: null
    };

    momentLocalizer(moment);
  }

  _handleBlurValueNumber(typeValidation, val) {
    var pattern;
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789"; i < (val + "").length; i++) {
      if (validos.indexOf(val.toString().charAt(i)) !== -1) {
        output += val.toString().charAt(i)
      }
    }
    val = output;

    if (typeValidation === constants.ALLOWS_NEGATIVE_INTEGER) {
      pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(val)) {
        val = val.replace(pattern, "$1,$2");
      }
      this.setState({
        averageMontlyAmount: val,
        averageMontlyAmountError: null
      });

    } else {
      var value = numeral(val).format('0');
      if (value >= 0) {
        pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)) {
          val = val.replace(pattern, "$1,$2");
        }
        this.setState({
          averageMontlyAmount: val,
          averageMontlyAmountError: null
        });
      } else {
        this.setState({
          averageMontlyAmount: "",
          averageMontlyAmountError: null
        });
      }
    }
  }

  _close() {
    this.setState({ showMessage: false });
  }

  _closeCreate() {
    const { isOpen } = this.props;
    this.setState({ showMessage: false });
    isOpen();
  }

  _changeName(value) {
    this.setState({
      name: value,
      nameError: null
    });
  }

  _changeType(value) {
    this.setState({
      type: value,
      typeError: null
    });
  }

  _changeNumber(value) {
    this.setState({
      number: value,
      numberError: null
    });
  }

  _changeAverageMontlyAmount(value) {
    this.setState({
      averageMontlyAmount: value,
      averageMontlyAmountError: null
    });
  }

  _changeCoin(value) {
    this.setState({
      coin: value,
      coinError: null
    });
  }

  _changeCountry(value) {
    this.setState({
      countryProduct: value,
      countryError: null
    });
  }

  _changeCity(value) {
    this.setState({
      cityProduct: value,
      cityError: null
    });
  }

  _handleProduct(e) {
    e.preventDefault();
    const { clientProductReducer, addProduct, updateProduct, productDetail } = this.props;
    var uid, titleMessage, textMessage;
    if (productDetail !== null) {
      uid = productDetail.uid;
    } else {
      uid = _.uniqueId('product_');
    }
    var errorInForm = false;
    if (this.state.name === null || this.state.name === undefined || this.state.name === "") {
      errorInForm = true;
      this.setState({
        nameError: constants.VALUE_REQUIERED
      });
    } else if (eval(constants.REGEX_SIMPLE_XSS_STRING).test(this.state.name)) {
      errorInForm = true;
      this.setState({
        nameError: constants.VALUE_XSS_INVALID
      });
    }

    if (this.state.type === null || this.state.type === undefined || this.state.type === "") {
      errorInForm = true;
      this.setState({
        typeError: constants.OPTION_REQUIRED
      });
    }

    if (this.state.number === null || this.state.number === undefined || this.state.number === "") {
      errorInForm = true;
      this.setState({
        numberError: constants.VALUE_REQUIERED
      });
    } else if (eval(constants.REGEX_SIMPLE_XSS_STRING).test(this.state.number)) {
      errorInForm = true;
      this.setState({
        numberError: constants.VALUE_XSS_INVALID
      });
    }

    if (this.state.averageMontlyAmount === null || this.state.averageMontlyAmount === undefined || this.state.averageMontlyAmount === "") {
      errorInForm = true;
      this.setState({
        averageMontlyAmountError: constants.VALUE_REQUIERED
      });
    } else if (eval(constants.REGEX_SIMPLE_XSS_STRING).test(this.state.averageMontlyAmount)) {
      errorInForm = true;
      this.setState({
        averageMontlyAmountError: constants.VALUE_XSS_INVALID
      });
    }


    if (this.state.coin === null || this.state.coin === undefined || this.state.coin === "") {
      errorInForm = true;
      this.setState({
        coinError: constants.VALUE_REQUIERED
      });
    } else if (eval(constants.REGEX_SIMPLE_XSS_STRING).test(this.state.coin)) {
      errorInForm = true;
      this.setState({
        coinError: constants.VALUE_XSS_INVALID
      });
    }

    if (this.state.countryProduct === null || this.state.countryProduct === undefined || this.state.countryProduct === "") {
      errorInForm = true;
      this.setState({
        countryError: constants.OPTION_REQUIRED
      });
    }

    if (this.state.cityProduct === null || this.state.cityProduct === undefined || this.state.cityProduct === "") {
      errorInForm = true;
      this.setState({
        cityError: constants.VALUE_REQUIERED
      });
    } else if (eval(constants.REGEX_SIMPLE_XSS_STRING).test(this.state.cityProduct)) {
      errorInForm = true;
      this.setState({
        cityError: constants.VALUE_XSS_INVALID
      });
    }

    if (!errorInForm) {
      var product = {
        uid,
        name: this.state.name,
        type: this.state.type,
        number: this.state.number,
        averageMontlyAmount: numeral(this.state.averageMontlyAmount).format('0'),
        coin: this.state.coin,
        country: this.state.countryProduct,
        city: this.state.cityProduct
      };
      if (productDetail !== null) {
        updateProduct(product);
        titleMessage = "Producto actualizado";
        textMessage = "Señor usuario, el producto se actualizó correctamente.";
      } else {
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
  }

  componentWillMount() {
    const { getMasterDataFields, productDetail } = this.props;
    getMasterDataFields([CLIENT_TYPE_PRODUCT, FILTER_COUNTRY]);

    if (productDetail !== null) {
      this.setState({
        name: productDetail.name,
        nameError: null,
        type: productDetail.type,
        typeError: null,
        number: productDetail.number,
        numberError: null,
        averageMontlyAmount: productDetail.averageMontlyAmount === 0 ? '0' : fomatInitialStateNumber(productDetail.averageMontlyAmount),
        averageMontlyAmountError: null,
        coin: productDetail.coin,
        coinError: null,
        countryProduct: productDetail.country,
        countryError: null,
        cityProduct: productDetail.city,
        cityError: null
      });
    }
  }

  render() {
    const { modalStatus, selectsReducer, productDetail } = this.props;

    return (
      <form onSubmit={this._handleProduct.bind(this)}>
        <SecurityMessageComponent />
        <div className="modalBt4-body modal-body business-content editable-form-content clearfix" id="modalComponentScroll">
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <Row>
              <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                <dt>
                  <span>Nombre de la entidad (</span><span style={{ color: "red" }}>*</span>)
                </dt>
                <Input
                  name="txtName"
                  type="text"
                  max="200"
                  touched={true}
                  value={this.state.name}
                  error={this.state.nameError}
                  onChange={val => this._changeName(val)}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>Tipo de producto (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="type"
                  labelInput="Seleccione el tipo..."
                  touched={true}
                  value={this.state.type}
                  error={this.state.typeError}
                  valueProp={'id'}
                  textProp={'value'}
                  parentId="dashboardComponentScroll"
                  onChange={val => this._changeType(val)}
                  data={selectsReducer.get(CLIENT_TYPE_PRODUCT) || []}
                  onBlur={() => ''}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                <dt>
                  <span>Número de producto (</span><span style={{ color: "red" }}>*</span>)
                </dt>
                <Input
                  name="txtNumber"
                  type="text"
                  max="200"
                  touched={true}
                  value={this.state.number}
                  error={this.state.numberError}
                  onChange={val => this._changeNumber(val)}
                  onBlur={() => ''}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>Monto mensual (</span><span style={{ color: "red" }}>*</span>)</dt>
                <Input
                  name="txtMontly"
                  style={{ width: "100%", textAlign: "right" }}
                  type="text"
                  min={0}
                  max="16"
                  touched={true}
                  value={this.state.averageMontlyAmount}
                  error={this.state.averageMontlyAmountError}
                  onChange={val => this._changeAverageMontlyAmount(val)}
                  onBlur={val => this._handleBlurValueNumber(constants.ONLY_POSITIVE_INTEGER, val)}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                <dt><span>Moneda (</span><span style={{ color: "red" }}>*</span>)</dt>
                <Input
                  name="txtCoin"
                  type="text"
                  max="100"
                  touched={true}
                  value={this.state.coin}
                  error={this.state.coinError}
                  onChange={val => this._changeCoin(val)}
                />
              </Col>
              <Col xs={12} md={6} lg={6} >
                <dt><span>País (</span><span style={{ color: "red" }}>*</span>)</dt>
                <ComboBox
                  name="countryProduct"
                  labelInput="Seleccione el tipo..."
                  touched={true}
                  value={this.state.countryProduct}
                  error={this.state.countryError}
                  valueProp={'id'}
                  textProp={'value'}
                  parentId="dashboardComponentScroll"
                  onChange={val => this._changeCountry(val)}
                  data={selectsReducer.get(FILTER_COUNTRY) || []}
                  onBlur={() => ''}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} style={{ paddingRight: "20px" }}>
                <dt>
                  <span>Ciudad (</span><span style={{ color: "red" }}>*</span>)
                </dt>
                <Input
                  name="txtCityProduct"
                  type="text"
                  max="150"
                  touched={true}
                  value={this.state.cityProduct}
                  error={this.state.cityError}
                  onChange={val => this._changeCity(val)}
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

function fomatInitialStateNumber(val) {
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(val + "")) {
    val = val.toString().replace(pattern, "$1,$2");
  }
  return val;
}

function mapStateToProps({ selectsReducer, clientProductReducer }, { fields, productDetail }) {
  return {
    selectsReducer,
    clientProductReducer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getMasterDataFields,
    addProduct,
    updateProduct
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalProduct);
