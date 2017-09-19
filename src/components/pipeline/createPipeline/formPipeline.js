import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { redirectUrl } from "../../globalComponents/actions";
import { Col, Row } from "react-flexbox-grid";
import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import Textarea from "../../../ui/textarea/textareaComponent";
import DateTimePickerUi from "../../../ui/dateTimePicker/dateTimePickerComponent";
import {
  BUSINESS_CATEGORY,
  FILTER_COUNTRY,
  LINE_OF_BUSINESS,
  PIPELINE_BUSINESS,
  PRODUCT_FAMILY,
  MELLOWING_PERIOD,
  PIPELINE_INDEXING,
  PIPELINE_PRIORITY,
  PIPELINE_PRODUCTS,
  PIPELINE_STATUS,
  PROBABILITY,
  PRODUCTS,
  FILTER_MONEY_DISTRIBITION_MARKET,
  FILTER_AREA_ASSETS,
  TERM_IN_MONTHS_VALUES
} from "../../selectsComponent/constants";
import { getClientNeeds, getMasterDataFields, getPipelineCurrencies } from "../../selectsComponent/actions";
import {
  CURRENCY_COP,
  CURRENCY_LABEL_COP,
  CURRENCY_LABEL_OTHER_OPTION,
  LINE_OF_BUSINESS_LEASING,
  ORIGIN_PIPELIN_BUSINESS,
  COMPROMETIDO,
  COTIZACION_EN_FIRME,
  PRODUCT_FAMILY_LEASING,
  HELP_PROBABILITY
} from "../constants";
import { changeModalIsOpen, createEditPipeline } from "../actions";
import {
  DATE_FORMAT,
  DATE_START_AFTER,
  MESSAGE_SAVE_DATA,
  ONLY_POSITIVE_INTEGER,
  OPTION_REQUIRED,
  SAVE_DRAFT,
  SAVE_PUBLISHED,
  VALUE_REQUIERED
} from "../../../constantsGlobal";
import { LAST_PIPELINE_REVIEW } from "../../../constantsParameters";
import {
  consultParameterServer,
  formValidateKeyEnter,
  handleBlurValueNumber,
  nonValidateEnter
} from "../../../actionsGlobal";
import SweetAlert from "sweetalert-react";
import moment from "moment";
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import { changeStateSaveData } from "../../dashboard/actions";
import { MENU_CLOSED } from "../../navBar/constants";
import _ from "lodash";
import $ from "jquery";
import numeral from "numeral";
import Business from "../business/business";
import { addBusiness, clearBusiness } from "../business/ducks";
import HeaderPipeline from "../headerPipeline";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import RichText from '../../richText/richTextComponent';
import { showLoading } from '../../loading/actions';
import ToolTip from '../../toolTip/toolTipComponent';

const fields = ["nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths", "businessStatus",
  "businessCategory", "currency", "indexing", "need", "observations", "product", "reviewedDate"
  , "client", "documentStatus", "probability", "pendingDisburAmount", "amountDisbursed",
  "estimatedDisburDate", "opportunityName", "productFamily", "mellowingPeriod", "moneyDistribitionMarket",
  "areaAssets", "areaAssetsValue", "termInMonthsValues"];

let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick = null;
let datePipelineLastReview;
let idCurrencyAux = null;
let contollerErrorChangeType = false;
let errorBusinessCategory = false;
var thisForm;

var isChildren = false;

const validate = values => {
  const errors = {};

  if (!values.businessStatus) {
    errors.businessStatus = OPTION_REQUIRED;
  } else {
    errors.businessStatus = null;
  }
  if (!values.value) {
    errors.value = VALUE_REQUIERED;
  } else {
    errors.value = null;
  }
  if (!values.currency) {
    errors.currency = OPTION_REQUIRED;
  } else {
    errors.currency = null;
  }
  if (!values.need) {
    errors.need = OPTION_REQUIRED;
  } else {
    errors.need = null;
  }


  if (typeButtonClick === SAVE_PUBLISHED) {
    if (!values.businessCategory) {
      errorBusinessCategory = OPTION_REQUIRED;
      errors.businessCategory = OPTION_REQUIRED;
    } else {
      errorBusinessCategory = null;
      errors.businessCategory = null;
    }
  } else {
    errorBusinessCategory = null;
    errors.businessCategory = null;
  }

  if (!values.opportunityName && !isChildren) {
    errors.opportunityName = VALUE_REQUIERED;
  } else {
    errors.opportunityName = null;
  }

  if (!values.productFamily) {
    errors.productFamily = VALUE_REQUIERED;
  } else {
    errors.productFamily = null;
  }

  if (!values.nameUsuario) {
    errors.nameUsuario = VALUE_REQUIERED;
  } else {
    errors.nameUsuario = null;
  }

  if (!values.termInMonths) {
    errors.termInMonths = VALUE_REQUIERED;
  } else {
    errors.termInMonths = null;
  }

  if (!values.termInMonthsValues) {
    errors.termInMonthsValues = VALUE_REQUIERED;
  } else {
    errors.termInMonthsValues = null;
  }


  return errors;
};

export default function createFormPipeline(name, origin, functionCloseModal) {

  var nameMoneyDistribitionMarket = _.uniqueId('moneyDistribitionMarket_');
  var nameAreaAssets = _.uniqueId('areaAssets_');
  var nameProductFamily = _.uniqueId('productFamily_');
  var nameMellowingPeriod = _.uniqueId('mellowingPeriod_');
  var nameTermInMonthsValues = _.uniqueId('termInMonthsValues_');
  var nameBusinessStatus = _.uniqueId('businessStatus_');
  var nameProduct = _.uniqueId('product_');
  var nameIndexing = _.uniqueId('indexing_');
  var nameNeed = _.uniqueId('need_');
  var nameBusinessCategory = _.uniqueId('businessCategory_');
  var nameProbability = _.uniqueId('probability_');
  var nameCurrency = _.uniqueId('currency_');
  let participantBanc = _.uniqueId('participantBanc_');
  let inputParticipantBanc = _.uniqueId('inputParticipantBanc_');

  class FormPipeline extends Component {

    constructor(props) {
      super(props);
      thisForm = this;
      this.state = {
        showMessageCreatePipeline: false,
        showConfirm: false,
        employeeResponsible: false,
        showConfirmChangeCurrency: false,
        labelCurrency: CURRENCY_LABEL_OTHER_OPTION,
        errorValidate: false,
        pendingUpdate: false,
        updateValues: {},
        probabilityEnabled: false,
        areaAssetsEnabled: false
      };

      isChildren = origin === ORIGIN_PIPELIN_BUSINESS;

      this._submitCreatePipeline = this._submitCreatePipeline.bind(this);
      this._closeMessageCreatePipeline = this._closeMessageCreatePipeline.bind(this);
      this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
      this._handleFocusValueNumber = this._handleFocusValueNumber.bind(this);
      this._onCloseButton = this._onCloseButton.bind(this);
      this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
      this._changeCurrency = this._changeCurrency.bind(this);
      this._handleTermInMonths = this._handleTermInMonths.bind(this);
      this._closeConfirmChangeCurrency = this._closeConfirmChangeCurrency.bind(this);
      this._cleanForm = this._cleanForm.bind(this);
      this._closeCancelConfirmChanCurrency = this._closeCancelConfirmChanCurrency.bind(this);
      this._changeBusinessStatus = this._changeBusinessStatus.bind(this);
      this._changeProductFamily = this._changeProductFamily.bind(this);

    }

    // TODO: Revisar la asignación del state
    // Colcar aquí el limpiar el formulario
    _closeMessageCreatePipeline() {
      this.setState({
        showMessageCreatePipeline: false
      });
      if (origin !== ORIGIN_PIPELIN_BUSINESS && typeMessage === "success") {
        this._cleanForm();
        redirectUrl("/dashboard/clientInformation");
      } else {
        functionCloseModal();
      }

      if (this.state.pendingUpdate) {
        this.props.addBusiness(this.state.updateValues);
      }
    }

    _cleanForm() {
      const { initialValues, fields: { nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
        businessCategory, currency, indexing, need, observations, product, reviewedDate,
        client, documentStatus, probability, pendingDisburAmount, amountDisbursed,
        estimatedDisburDate, opportunityName, productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues } } = this.props;
      nameUsuario.onChange('');
      idUsuario.onChange('');
      value.onChange('');
      commission.onChange('');
      roe.onChange('');
      termInMonths.onChange('');
      termInMonthsValues.onChange('');
      businessStatus.onChange('');
      businessCategory.onChange('');
      currency.onChange('');
      indexing.onChange('');
      need.onChange('');
      observations.onChange('');
      product.onChange('');
      reviewedDate.onChange('');
      client.onChange('');
      documentStatus.onChange('');
      contollerErrorChangeType = false;
      idCurrencyAux = null;
      probability.onChange('');
      pendingDisburAmount.onChange('');
      amountDisbursed.onChange('');
      estimatedDisburDate.onChange('');
      opportunityName.onChange('');
      productFamily.onChange('');
      mellowingPeriod.onChange('');
      moneyDistribitionMarket.onChange('');
      areaAssets.onChange('');
      areaAssetsValue.onChange('');
    }

    _changeCurrency(currencyValue) {
      const { fields: { value }, selectsReducer } = this.props;
      var pipelineCurrencies = selectsReducer.get('pipelineCurrencies');
      var codeCurrency = _.get(_.filter(pipelineCurrencies, ['id', parseInt(currencyValue)]), '[0].code');
      if (codeCurrency === CURRENCY_COP) {
        this.setState({
          labelCurrency: CURRENCY_LABEL_COP
        });
      } else {
        this.setState({
          labelCurrency: CURRENCY_LABEL_OTHER_OPTION
        });
      }
      if (idCurrencyAux == null) {
        idCurrencyAux = parseInt(currencyValue);
      }
      if (currencyValue !== undefined && currencyValue !== '' && currencyValue !== null && parseInt(currencyValue) !== parseInt(idCurrencyAux) && !contollerErrorChangeType) {
        contollerErrorChangeType = true;
        if (idCurrencyAux !== null && value.value !== '') {
          titleMessage = "Tipo de moneda";
          message = "Señor usuario, sí cambia la “Moneda” la información diligenciada en el “Valor” se borrará. ¿Está seguro que desea cambiar la Moneda?";
          this.setState({
            showConfirmChangeCurrency: true
          });
        } else {
          idCurrencyAux = parseInt(currencyValue);
          contollerErrorChangeType = false;
          this.setState({
            showConfirmChangeCurrency: false
          });
        }
      } else {
        idCurrencyAux = parseInt(currencyValue);
        contollerErrorChangeType = false;
        this.setState({
          showConfirmChangeCurrency: false
        });
      }
      var lugarSelector = $('.valueMillions');
      var input = lugarSelector.find("input");
      input.focus();
    }


    _handleBlurValueNumber(typeValidation, valuReduxForm, val, allowsDecimal, numDecimals) {
      //Elimino los caracteres no validos
      for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
        if (validos.indexOf(val.toString().charAt(i)) !== -1) {
          output += val.toString().charAt(i)
        }
      }
      val = output;

      /* Si typeValidation = 2 es por que el valor puede ser negativo
         Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
      */
      var decimal = '';
      if (val.includes(".")) {
        var vectorVal = val.split(".");
        if (allowsDecimal) {
          val = vectorVal[0] + '.';
          if (vectorVal.length > 1) {

            var numDec = (numDecimals != undefined && numDecimals != null) ? numDecimals : 4;
            decimal = vectorVal[1].substring(0, numDec);

          }
        } else {
          val = vectorVal[0];
        }
      }

      if (typeValidation === 2) { //Realizo simplemente el formateo
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)) {
          val = val.replace(pattern, "$1,$2");
        }
        valuReduxForm.onChange(val + decimal);
      } else { //Valido si el valor es negativo o positivo
        var value = numeral(valuReduxForm.value).format('0');
        if (value >= 0) {
          pattern = /(-?\d+)(\d{3})/;
          while (pattern.test(val)) {
            val = val.replace(pattern, "$1,$2");
          }
          valuReduxForm.onChange(val + decimal);
        } else {
          valuReduxForm.onChange("");
        }
      }
    }

    _changeBusinessStatus(currencyValue) {
      const { selectsReducer, fields: { probability } } = this.props;

      let _pipeline_status = selectsReducer.get(PIPELINE_STATUS)

      probability.onChange('');

      this.setState({
        probabilityEnabled: _pipeline_status.filter(pStatus => {
          return (
            pStatus.id == currencyValue &&
            (pStatus.key == COMPROMETIDO || pStatus.key == COTIZACION_EN_FIRME)
          )
        }).length > 0
      });

    }


    _changeProductFamily(currencyValue) {
      const { selectsReducer, fields: { areaAssets, areaAssetsValue } } = this.props;

      let _product_family = selectsReducer.get(PRODUCT_FAMILY)

      areaAssets.onChange('');
      areaAssetsValue.onChange('');

      this.setState({
        areaAssetsEnabled: _product_family.filter(pFamily => {
          return (
            pFamily.id == currencyValue && pFamily.key == PRODUCT_FAMILY_LEASING
          )
        }).length > 0
      });

    }


    _handleFocusValueNumber(valuReduxForm, val) {
      //Elimino los caracteres no validos
      for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
        if (validos.indexOf(val.toString().charAt(i)) !== -1) {
          output += val.toString().charAt(i)
        }
      }
      valuReduxForm.onChange(output);
    }

    _handleTermInMonths(valuReduxForm, val) {
      //Elimino los caracteres no validos
      for (var i = 0, output = '', validos = "0123456789"; i < (val + "").length; i++) {
        if (validos.indexOf(val.toString().charAt(i)) !== -1) {
          output += val.toString().charAt(i)
        }
      }
      valuReduxForm.onChange(output);
    }

    _onCloseButton() {
      message = "¿Está seguro que desea salir de la pantalla de creación de pipeline?";
      titleMessage = "Confirmación salida";
      this.setState({ showConfirm: true });
    }

    _closeConfirmClosePipeline() {
      this.setState({ showConfirm: false });
      redirectUrl("/dashboard/clientInformation");
    }

    _closeCancelConfirmChanCurrency() {
      this.setState({
        showConfirmChangeCurrency: false
      });
      contollerErrorChangeType = false;
      const { fields: { currency } } = this.props;
      if (idCurrencyAux !== null) {
        currency.onChange(idCurrencyAux);
      }

    }

    _closeConfirmChangeCurrency() {
      this.setState({
        showConfirmChangeCurrency: false
      });
      contollerErrorChangeType = false;
      const { fields: { value, currency } } = this.props;
      if (idCurrencyAux !== null) {
        value.onChange('');
      }
      idCurrencyAux = currency.value;
    }

    _submitCreatePipeline() {
      if (errorBusinessCategory === null) {
        const { fields: { idUsuario, value, commission, roe, termInMonths, businessStatus,
          businessCategory, currency, indexing, need, observations, product,
          client, documentStatus, probability, nameUsuario,
          pendingDisburAmount, amountDisbursed, estimatedDisburDate, opportunityName,
          productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues }, createEditPipeline,
          changeStateSaveData, pipelineBusinessReducer } = this.props;

        if ((nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null) && (idUsuario.value === null || idUsuario.value === '' || idUsuario.value === undefined)) {
          this.setState({
            employeeResponsible: true
          });
        } else {
          if ((productFamily.value !== "" && productFamily.value !== null && productFamily.value !== undefined) || typeButtonClick === SAVE_DRAFT) {
            let pipelineJson = {
              "id": null,
              "client": window.localStorage.getItem('idClientSelected'),
              "documentStatus": typeButtonClick,
              "product": product.value,
              "businessStatus": businessStatus.value,
              "employeeResponsible": nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null ? idUsuario.value : null,
              "currency": currency.value,
              "indexing": indexing.value,
              "commission": commission.value === undefined || commission.value === null || commission.value === '' ? '' : numeral(commission.value).format('0.0000'),
              "need": need.value,
              "roe": roe.value === undefined || roe.value === null || roe.value === '' ? '' : numeral(roe.value).format('0.0000'),
              "observations": observations.value,
              "termInMonths": termInMonths.value,
              "termInMonthsValues": termInMonthsValues.value ? termInMonthsValues.value : "",
              "value": value.value === undefined ? null : numeral(value.value).format('0'),

              "probability": probability.value,
              "pendingDisburAmount": pendingDisburAmount.value === undefined || pendingDisburAmount.value === null || pendingDisburAmount.value === '' ? null : (pendingDisburAmount.value).replace(/,/g, ""),
              "amountDisbursed": amountDisbursed.value === undefined || amountDisbursed.value === null || amountDisbursed.value === '' ? null : (amountDisbursed.value).replace(/,/g, ""),
              "businessCategory": businessCategory.value,
              "estimatedDisburDate": parseInt(moment(estimatedDisburDate.value, DATE_FORMAT).format('x')),
              "opportunityName": opportunityName.value,
              "productFamily": productFamily.value ? productFamily.value : "",
              "mellowingPeriod": mellowingPeriod.value ? mellowingPeriod.value : "",
              "moneyDistribitionMarket": moneyDistribitionMarket.value ? moneyDistribitionMarket.value : "",
              "areaAssets": areaAssets.value ? areaAssets.value : "",
              "areaAssetsValue": areaAssetsValue.value === undefined || areaAssetsValue.value === null || areaAssetsValue.value === '' ? '' : numeral(areaAssetsValue.value).format('0.0000')
            };

            if (origin === ORIGIN_PIPELIN_BUSINESS) {
              const uuid = _.uniqueId('pipelineBusiness_');
              pipelineJson.uuid = uuid;
              typeMessage = "success";
              titleMessage = "Creación negocio";
              message = "Señor usuario, el negocio se adicionó exitosamente.";
              this.setState({
                showMessageCreatePipeline: true,
                pendingUpdate: true,
                updateValues: pipelineJson
              });
            } else {
              var resultPipelineBusines = [];
              _.map(pipelineBusinessReducer.toArray(),
                function (pipelineBusiness) {
                  resultPipelineBusines.push(_.omit(pipelineBusiness, ['uuid']));
                }
              );
              pipelineJson.listPipelines = resultPipelineBusines;
              changeStateSaveData(true, MESSAGE_SAVE_DATA);
              console.log(MESSAGE_SAVE_DATA);
              createEditPipeline(pipelineJson).then((data) => {
                changeStateSaveData(false, "");
                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                  redirectUrl("/login");
                } else {
                  if ((_.get(data, 'payload.data.status') === 200)) {
                    typeMessage = "success";
                    titleMessage = "Creación pipeline";
                    message = "Señor usuario, el pipeline se creó exitosamente.";
                    this.setState({ showMessageCreatePipeline: true });
                  } else {
                    typeMessage = "error";
                    titleMessage = "Creación pipeline";
                    message = "Señor usuario, ocurrió un error creando el informe de pipeline.";
                    this.setState({ showMessageCreatePipeline: true });
                  }
                }
              }, (reason) => {
                changeStateSaveData(false, "");
                typeMessage = "error";
                titleMessage = "Creación pipeline";
                message = "Señor usuario, ocurrió un error creando el informe de pipeline.";
                this.setState({ showMessageCreatePipeline: true });
              });
            }
          }
        }
      } else {
        thisForm.setState({
          errorValidate: true
        });
      }
    }

    updateKeyValueUsersBanco(e) {
      const { fields: { nameUsuario, idUsuario }, filterUsersBanco } = this.props;
      var self = this;
      idUsuario.onChange('');
      if (e.keyCode === 13 || e.which === 13) {
        e.consultclick ? "" : e.preventDefault();
        if (nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined) {
          $('.ui.search.' + participantBanc).toggleClass('loading');
          filterUsersBanco(nameUsuario.value).then((data) => {
            let usersBanco = _.get(data, 'payload.data.data');
            $('.ui.search.' + participantBanc)
              .search({
                cache: false,
                source: usersBanco,
                maxResults: 1500,
                height: '250px',
                searchFields: [
                  'title',
                  'description',
                  'idUsuario',
                  'cargo'
                ],
                onSelect: function (event) {
                  nameUsuario.onChange(event.title);
                  idUsuario.onChange(event.idUsuario);
                  self.setState({
                    employeeResponsible: false
                  });
                  return 'default';
                }
              });
            $('.ui.search.' + participantBanc).toggleClass('loading');
            $('.ui.search.' + participantBanc).search('search local', nameUsuario.value);
            setTimeout(function () {
              $('#' + inputParticipantBanc).focus();
            }, 150);
          });
        }
      }
    }

    _updateValue(value) {
      const { fields: { idUsuario, nameUsuario, cargoUsuario }, contactsByClient } = this.props;
      var contactClient = contactsByClient.get('contacts');
      var userSelected;
      _.map(contactClient, contact => {
        if (contact.id.toString() === value) {
          userSelected = contact;
          return contact;
        }
      });
      if (userSelected !== null && userSelected !== undefined) {
        idUsuario.onChange(userSelected.id);
        nameUsuario.onChange(userSelected.nameComplet);
      }
    }

    componentDidMount() {
      const self = this;
      $("#iconSearchUserPipeline").click(function () {
        var e = { keyCode: 13, consultclick: true };
        self.updateKeyValueUsersBanco(e);
      });
    }

    componentWillMount() {
      const { nonValidateEnter, clientInformacion, getMasterDataFields, getPipelineCurrencies, getClientNeeds,
        consultParameterServer, clearBusiness } = this.props;
      nonValidateEnter(true);
      if (origin !== ORIGIN_PIPELIN_BUSINESS) {
        clearBusiness();
      }
      const infoClient = clientInformacion.get('responseClientInfo');
      getPipelineCurrencies();
      getClientNeeds();
      typeButtonClick = null;
      if (_.isEmpty(infoClient)) {
        redirectUrl("/dashboard/clientInformation");
      } else {
        getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY,
          PIPELINE_BUSINESS, PROBABILITY, LINE_OF_BUSINESS, PRODUCTS, BUSINESS_CATEGORY, PRODUCT_FAMILY, MELLOWING_PERIOD,
          FILTER_MONEY_DISTRIBITION_MARKET, FILTER_AREA_ASSETS, TERM_IN_MONTHS_VALUES]);
        consultParameterServer(LAST_PIPELINE_REVIEW).then((data) => {
          if (data.payload.data.parameter !== null && data.payload.data.parameter !== "" &&
            data.payload.data.parameter !== undefined) {
            datePipelineLastReview = JSON.parse(data.payload.data.parameter).value;
            datePipelineLastReview = moment(datePipelineLastReview, "DD/MM/YYYY").locale('es').format("DD MMM YYYY");
          }
        });
      }
    }

    render() {
      const { fields: { nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
        businessCategory, currency, indexing, need, observations, product,
        client, documentStatus, probability,
        pendingDisburAmount, amountDisbursed, estimatedDisburDate, opportunityName,
        productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues },
        clientInformacion, selectsReducer, handleSubmit, reducerGlobal, navBar } = this.props;
      return (
        <div>
          {origin !== ORIGIN_PIPELIN_BUSINESS && <HeaderPipeline />}
          <form onSubmit={handleSubmit(this._submitCreatePipeline)} onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))} className="my-custom-tab"
            style={origin === ORIGIN_PIPELIN_BUSINESS ? {} : { backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>

            <div className={origin === ORIGIN_PIPELIN_BUSINESS ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ""} style={origin === ORIGIN_PIPELIN_BUSINESS ? { overflowX: "hidden", paddingBottom: "0px", marginTop: "10px" } : {}}>
              <span style={{ marginLeft: "20px" }} >Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>

              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "10px 10px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                    <i className="browser icon" style={{ fontSize: "20px" }} />
                    <span style={{ fontSize: "20px" }}> Oportunidad</span>
                  </div>
                </Col>
              </Row>
              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "0px 10px 20px 20px" }}>
                <Col md={12}>
                  <dt>
                    <span>Nombre de la oportunidad (</span><span style={{ color: "red" }}>*</span>)
                  </dt>
                  <Input
                    name="txtOpportunityName"
                    type="text"
                    {...opportunityName}
                    max="100"
                    parentId="dashboardComponentScroll"
                  />
                </Col>
              </Row>

              <Row style={{ padding: "10px 10px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                    <i className="browser icon" style={{ fontSize: "20px" }} />
                    <span style={{ fontSize: "20px" }}> Datos de pipeline</span>
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={12} md={6} lg={6}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Familia de productos (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...productFamily}
                      name={nameProductFamily}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(PRODUCT_FAMILY) || []}
                      onChange={val => this._changeProductFamily(val)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Necesidad del cliente (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'need'}
                      {...need}
                      name={nameNeed}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get('pipelineClientNeeds') || []}
                    />
                  </div>
                </Col>
                <Col xs={12} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Producto</span>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...product}
                      name={nameProduct}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(PRODUCTS) || []}
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Estado (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...businessStatus}
                      name={nameBusinessStatus}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(PIPELINE_STATUS) || []}
                      onChange={val => this._changeBusinessStatus(val)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Empleado responsable(</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <div className={`ui search ${participantBanc} fluid`}>
                      <ComboBoxFilter
                        className="prompt"
                        id={inputParticipantBanc}
                        style={{ borderRadius: "3px" }}
                        autoComplete="off"
                        type="text"
                        {...nameUsuario}
                        value={nameUsuario.value}
                        onChange={nameUsuario.onChange}
                        placeholder="Ingrese un criterio de búsqueda..."
                        onKeyPress={this.updateKeyValueUsersBanco}
                        onSelect={val => this._updateValue(val)}
                      />
                    </div>
                    {
                      this.state.employeeResponsible &&
                      <div>
                        <div className="ui pointing red basic label">
                          Debe seleccionar un empleado del banco
                          </div>
                      </div>
                    }
                  </div>
                </Col>


                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Periodo de maduración</span>
                      <ToolTip text={HELP_PROBABILITY}>
                        <i className="help circle icon blue"
                          style={{ fontSize: "15px", cursor: "pointer", marginLeft: "5px" }} />
                      </ToolTip>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...mellowingPeriod}
                      name={nameMellowingPeriod}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(MELLOWING_PERIOD) || []}
                    />
                  </div>
                </Col>


                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Libros</span>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...moneyDistribitionMarket}
                      name={nameMoneyDistribitionMarket}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(FILTER_MONEY_DISTRIBITION_MARKET) || []}
                    />
                  </div>
                </Col>
              </Row>

              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Categoría del negocio (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...businessCategory}
                      name={nameBusinessCategory}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(BUSINESS_CATEGORY) || []}
                      error={errorBusinessCategory}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Probabilidad</span>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...probability}
                      name={nameProbability}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(PROBABILITY) || []}
                      disabled={this.state.probabilityEnabled ? '' : 'disabled'}
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "20px 23px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                    <i className="book icon" style={{ fontSize: "18px" }} />
                    <span style={{ fontSize: "20px" }}>Detalle del negocio</span>
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Indexación</span>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...indexing}
                      name={nameIndexing}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(PIPELINE_INDEXING) || []}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Interés / Spread</span>
                    </dt>
                    <Input
                      name={_.uniqueId('commission_')}
                      type="text"
                      {...commission}
                      max="10"
                      parentId="dashboardComponentScroll"
                      onBlur={val => this._handleBlurValueNumber(2, commission, commission.value, true)}
                      onFocus={val => this._handleFocusValueNumber(commission, commission.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>ROE</span>
                    </dt>
                    <Input
                      name="roe"
                      type="text"
                      {...roe}
                      max="10"
                      parentId="dashboardComponentScroll"
                      onBlur={val => this._handleBlurValueNumber(1, roe, roe.value, true)}
                      onFocus={val => this._handleFocusValueNumber(roe, roe.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Moneda (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'code'}
                      {...currency}
                      name={nameCurrency}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get('pipelineCurrencies') || []}
                      onChange={val => this._changeCurrency(val)}
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>

                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>{this.state.labelCurrency} (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <Input
                      {...value}
                      name="valueMillions"
                      type="text"
                      max="28"
                      parentId="dashboardComponentScroll"
                      onBlur={val => this._handleBlurValueNumber(1, value, value.value, false)}
                      onFocus={val => this._handleFocusValueNumber(value, value.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Plazo de la operación (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <div style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}>
                      <div style={{ width: "30%" }}>
                        <Input
                          name="termInMonths"
                          type="text"
                          {...termInMonths}
                          max="3"
                          parentId="dashboardComponentScroll"
                          onBlur={val => this._handleTermInMonths(termInMonths, termInMonths.value)}
                        />
                      </div>
                      <div style={{ width: "65%" }}>
                        <ComboBox
                          labelInput="Seleccione..."
                          valueProp={'id'}
                          textProp={'value'}
                          {...termInMonthsValues}
                          name={nameTermInMonthsValues}
                          parentId="dashboardComponentScroll"
                          data={selectsReducer.get(TERM_IN_MONTHS_VALUES) || []}
                        />
                      </div>
                    </div>





                  </div>
                </Col>


                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Activo</span>
                    </dt>
                    <ComboBox
                      labelInput="Seleccione..."
                      valueProp={'id'}
                      textProp={'value'}
                      {...areaAssets}
                      name={nameAreaAssets}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(FILTER_AREA_ASSETS) || []}
                      disabled={this.state.areaAssetsEnabled ? '' : 'disabled'}
                    />
                  </div>
                </Col>

                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Valor del activo/Proyecto</span>
                    </dt>
                    <Input
                      name="areaAssetsValue"
                      type="text"
                      {...areaAssetsValue}
                      parentId="dashboardComponentScroll"
                      onBlur={val => this._handleBlurValueNumber(1, areaAssetsValue, areaAssetsValue.value, true, 2)}
                      onFocus={val => this._handleFocusValueNumber(areaAssetsValue, areaAssetsValue.value)}
                      disabled={this.state.areaAssetsEnabled ? '' : 'disabled'}
                    />
                  </div>
                </Col>


              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Monto pendiente por desembolsar</span>
                    </dt>
                    <Input
                      name="txtPendingDisburAmount"
                      type="text"
                      {...pendingDisburAmount}
                      max="28"
                      parentId="dashboardComponentScroll"
                      onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisburAmount, pendingDisburAmount.value, true, 2)}
                      onFocus={val => this._handleFocusValueNumber(pendingDisburAmount, pendingDisburAmount.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Monto desembolsado</span>
                    </dt>
                    <Input
                      name="txtAmountDisbursed"
                      type="text"
                      {...amountDisbursed}
                      max="28"
                      parentId="dashboardComponentScroll"
                      onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, amountDisbursed, amountDisbursed.value, true, 2)}
                      onFocus={val => this._handleFocusValueNumber(amountDisbursed, amountDisbursed.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={4} lg={4}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Fecha estimada de desembolso - DD/MM/YYYY</span>
                    </dt>
                    <DateTimePickerUi
                      {...estimatedDisburDate}
                      culture='es'
                      format={DATE_FORMAT}
                      time={false}
                    />
                  </div>
                </Col>
              </Row>
              <Business origin={origin} disabled={true} />
              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "10px 23px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "100%", marginBottom: "10px" }} />
                    <i className="book icon" style={{ fontSize: "18px" }} />
                    <span style={{ fontSize: "20px" }}> Observaciones </span>
                  </div>
                </Col>
              </Row>
              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "0px 23px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <RichText
                    name="observations"
                    {... (origin === ORIGIN_PIPELIN_BUSINESS ? observations : observations) }
                    placeholder="Ingrese una observación."
                    style={{ width: '100%', height: '178px' }}
                  />
                </Col>
              </Row>
              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : {}}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ textAlign: "left", marginTop: "10px", marginBottom: "20px", marginLeft: "20px" }}>
                    <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha última revisión formato pipeline: </span><span style={{ marginLeft: "0px", color: "#818282" }}>{datePipelineLastReview}</span>
                  </div>
                </Col>
              </Row>
            </div>
            <div style={origin !== ORIGIN_PIPELIN_BUSINESS ? { display: "block", position: "fixed", border: "1px solid #C2C2C2", bottom: "0px", width: "100%", marginBottom: "0px", backgroundColor: "#F8F8F8", height: "50px", background: "rgba(255,255,255,0.75)" } : { display: "none" }}>
              <div style={{ width: "580px", height: "100%", position: "fixed", right: "0px" }}>
                <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_DRAFT} style={{ float: "right", margin: "8px 0px 0px 8px", position: "fixed", backgroundColor: "#00B5AD" }}>
                  <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                </button>
                <button className="btn" type="submit" onClick={() => typeButtonClick = SAVE_PUBLISHED} style={{ float: "right", margin: "8px 0px 0px 250px", position: "fixed" }}>
                  <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
                </button>
                <button className="btn" type="button" onClick={this._onCloseButton} style={{ float: "right", margin: "8px 0px 0px 450px", position: "fixed", backgroundColor: "rgb(193, 193, 193)" }}>
                  <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                </button>
              </div>
            </div>
            <SweetAlert
              type={typeMessage}
              show={this.state.showMessageCreatePipeline}
              title={titleMessage}
              text={message}
              onConfirm={this._closeMessageCreatePipeline}
            />
            <SweetAlert
              type="warning"
              show={this.state.showConfirm}
              title={titleMessage}
              text={message}
              confirmButtonColor='#DD6B55'
              confirmButtonText='Sí, estoy seguro!'
              cancelButtonText="Cancelar"
              showCancelButton={true}
              onCancel={() => this.setState({ showConfirm: false })}
              onConfirm={this._closeConfirmClosePipeline}
            />
            <SweetAlert
              type="warning"
              show={this.state.showConfirmChangeCurrency}
              title={titleMessage}
              text={message}
              confirmButtonColor='#DD6B55'
              confirmButtonText='Sí, estoy seguro!'
              cancelButtonText="Cancelar"
              showCancelButton={true}
              onCancel={this._closeCancelConfirmChanCurrency}
              onConfirm={this._closeConfirmChangeCurrency}
            />
            <SweetAlert
              type="error"
              show={this.state.errorValidate}
              title='Campos obligatorios'
              text='Señor usuario, debe ingresar los campos marcados con asterisco.'
              onConfirm={() => this.setState({ errorValidate: false })}
            />
            <div style={origin === ORIGIN_PIPELIN_BUSINESS ? {} : { display: "none" }} className="modalBt4-footer modal-footer">
              <button type="submit" className="btn btn-primary modal-button-edit"
                onClick={() => typeButtonClick = SAVE_DRAFT}>
                Guardar
              </button>
            </div>
          </form>
        </div>
      );
    }
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      getMasterDataFields,
      getPipelineCurrencies,
      getClientNeeds,
      createEditPipeline,
      filterUsersBanco,
      consultParameterServer,
      changeStateSaveData,
      nonValidateEnter,
      addBusiness,
      changeModalIsOpen,
      clearBusiness
    }, dispatch);
  }

  function mapStateToProps({ pipelineReducer, clientInformacion, selectsReducer, contactsByClient, reducerGlobal, navBar, pipelineBusinessReducer }, ownerProps) {
    return {
      pipelineReducer,
      clientInformacion,
      selectsReducer,
      contactsByClient,
      reducerGlobal,
      navBar,
      pipelineBusinessReducer
    };
  }

  return reduxForm({
    fields,
    form: name || _.uniqueId('business_'),
    validate,
    onSubmitFail: errors => {
      thisForm.setState({
        errorValidate: true
      });
    }
  }, mapStateToProps, mapDispatchToProps)(FormPipeline);
}
