import React, {Component} from "react";
import {reduxForm} from "redux-form";
import {bindActionCreators} from "redux";
import {Col, Row} from "react-flexbox-grid";

import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import SweetAlert from "../../sweetalertFocus";
import Business from "../business/business";
import {addBusiness, clearBusiness} from "../business/ducks";
import HeaderPipeline from "../headerPipeline";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import RichText from '../../richText/richTextComponent';
import ToolTip from '../../toolTip/toolTipComponent';
import ComponentDisbursementPlan from '../disbursementPlan/componentDisbursementPlan';
import {setGlobalCondition} from './../../../validationsFields/rulesField';

import {redirectUrl} from "../../globalComponents/actions";
import {changeModalIsOpen, createEditPipeline, updateDisbursementPlans} from "../actions";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {changeStateSaveData} from "../../dashboard/actions";
import {swtShowMessage} from '../../sweetAlertMessages/actions';
import {clearLists, consultDataSelect, consultListWithParameterUbication, getClientNeeds, getMasterDataFields} from "../../selectsComponent/actions";
import {consultParameterServer, formValidateKeyEnter, handleBlurValueNumber, handleFocusValueNumber, nonValidateEnter} from "../../../actionsGlobal";

import {
  BUSINESS_CATEGORY,
  FILTER_ACTIVE,
  FILTER_COUNTRY,
  FILTER_MONEY_DISTRIBITION_MARKET,
  LINE_OF_BUSINESS,
  MELLOWING_PERIOD,
  PIPELINE_BUSINESS,
  PIPELINE_INDEXING,
  PIPELINE_PRIORITY,
  PIPELINE_STATUS,
  PROBABILITY,
  PRODUCT_FAMILY,
  PRODUCTS,
  PRODUCTS_MASK,
  TERM_IN_MONTHS_VALUES,
  CURRENCY
} from "../../selectsComponent/constants";
import {BUSINESS_STATUS_COMPROMETIDO, BUSINESS_STATUS_COTIZACION, HELP_PROBABILITY, ORIGIN_PIPELIN_BUSINESS, PRODUCT_FAMILY_LEASING, CURRENCY_MESSAGE} from "../constants";
import {
  ALLOWS_NEGATIVE_INTEGER,
  MESSAGE_ERROR,
  REGEX_SIMPLE_XSS_TITLE,
  REGEX_SIMPLE_XSS_MESAGE,
  SAVE_DRAFT,
  SAVE_PUBLISHED,
  ONLY_POSITIVE_INTEGER,
  MESSAGE_SAVE_DATA
} from "../../../constantsGlobal";
import {LAST_PIPELINE_REVIEW} from "../../../constantsParameters";

import moment from "moment";
import _ from "lodash";
import $ from "jquery";
import numeral from "numeral";
import {fields, fieldsWithRules, validations as validate} from './filesAndRules';
import PermissionUserReports from "../../commercialReport/permissionsUserReports";
import {buildJsoncommercialReport} from "../../commercialReport/functionsGenerics";
import {setConfidential} from "../../commercialReport/actions";

let typeMessage = "success";
let titleMessage = "";
let message = "";
let typeButtonClick = null;
let datePipelineLastReview;
let idCurrencyAux = null;
let contollerErrorChangeType = false;
let thisForm;

let isChildren = false;
let nameDisbursementPlansInReducer = "disbursementPlans";

export default function createFormPipeline(name, origin, functionCloseModal) {

  let nameMoneyDistribitionMarket = _.uniqueId('moneyDistribitionMarket_');
  let nameAreaAssets = _.uniqueId('areaAssets_');
  let nameProductFamily = _.uniqueId('productFamily_');
  let nameMellowingPeriod = _.uniqueId('mellowingPeriod_');
  let nameTermInMonthsValues = _.uniqueId('termInMonthsValues_');
  let nameBusinessStatus = _.uniqueId('businessStatus_');
  let nameProduct = _.uniqueId('product_');
  let nameIndexing = _.uniqueId('indexing_');
  let nameNeed = _.uniqueId('need_');
  let nameBusinessCategory = _.uniqueId('businessCategory_');
  let nameProbability = _.uniqueId('probability_');
  let nameCurrency = _.uniqueId('currency_');
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
        errorValidate: false,
        errorValidateXss: false,
        pendingUpdate: false,
        updateValues: {},
        probabilityEnabled: false,
        areaAssetsEnabled: false,
        //Se utilizan para controlar el componente de planes de desembolso 
        showFormAddDisbursementPlan: false,
        disbursementPlanRequired: false,
        products: [],
        showAlertCurrency: false
      };

     
      if (origin === ORIGIN_PIPELIN_BUSINESS) {
        nameDisbursementPlansInReducer = "childBusinessDisbursementPlans";
        fieldsWithRules.opportunityName.rules = [];
      } else {
        nameDisbursementPlansInReducer = "disbursementPlans";
      }

      this._submitCreatePipeline = this._submitCreatePipeline.bind(this);
      this._closeMessageCreatePipeline = this._closeMessageCreatePipeline.bind(this);
      this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
      this._updateValue = this._updateValue.bind(this);
      this._onCloseButton = this._onCloseButton.bind(this);
      this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
      this._changeCurrency = this._changeCurrency.bind(this);
      this._handleTermInMonths = this._handleTermInMonths.bind(this);
      this._closeConfirmChangeCurrency = this._closeConfirmChangeCurrency.bind(this);
      this._cleanForm = this._cleanForm.bind(this);
      this._closeCancelConfirmChanCurrency = this._closeCancelConfirmChanCurrency.bind(this);
      this._changeBusinessStatus = this._changeBusinessStatus.bind(this);
      this._changeProductFamily = this._changeProductFamily.bind(this);
      this.showFormDisbursementPlan = this.showFormDisbursementPlan.bind(this);
      this._changeValue = this._changeValue.bind(this);
      this.showAlertDisabledCurrency = this.showAlertDisabledCurrency.bind(this);
    }

    showFormDisbursementPlan(isOpen) {
      this.setState({
        showFormAddDisbursementPlan: isOpen,
        disbursementPlanRequired: false
      });
    }

    showAlertDisabledCurrency(isEditableValue) {
      this.setState({showAlertCurrency: !isEditableValue});   
  }
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
      const {
        fields: {
          nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus, businessCategory, currency, indexing, need, observations, product, reviewedDate,
          client, documentStatus, probability, opportunityName, productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues
        }
      } = this.props;

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
      opportunityName.onChange('');
      productFamily.onChange('');
      mellowingPeriod.onChange('');
      moneyDistribitionMarket.onChange('');
      areaAssets.onChange('');
      areaAssetsValue.onChange('');
    }

    _changeCurrency(currencyValue) {
      const { fields: { value } } = this.props;
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

      let lugarSelector = $('.valueMillions');
      let input = lugarSelector.find("input");
      input.focus();
    }

    _changeBusinessStatus(currencyValue) {
      const { selectsReducer, fields: { probability } } = this.props;
      let _pipeline_status = selectsReducer.get(PIPELINE_STATUS);
      probability.onChange('');
      this.setState({
        probabilityEnabled: _pipeline_status.filter(pStatus => {
          return (
            pStatus.id == currencyValue &&
            (pStatus.key == BUSINESS_STATUS_COMPROMETIDO || pStatus.key == BUSINESS_STATUS_COTIZACION)
          )
        }).length > 0
      });
    }

    _changeValue(val) {
      const { fields: { pendingDisbursementAmount, value } } = this.props;
      handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisbursementAmount, (val).toString(), true, 2);
      if (_.isNil(val) || val === '') {
        this.showFormDisbursementPlan(false);
      }

      value.onChange(val);
    }

    _changeProductFamily(currencyValue) {
      const { selectsReducer, fields: { areaAssets, product }, consultListWithParameterUbication } = this.props;
      let _product_family = selectsReducer.get(PRODUCT_FAMILY)
      areaAssets.onChange('');
      this.setState({
        areaAssetsEnabled: _product_family.filter(pFamily => {
          return (
            pFamily.id == currencyValue && pFamily.key == PRODUCT_FAMILY_LEASING
          )
        }).length > 0
      });
      
      consultListWithParameterUbication("", currencyValue).then((data) => {
        this.setState({
          products: _.get(data, 'payload.data.messageBody.masterDataDetailEntries', [])
        });
      });
      product.onChange('');
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
      const {
        fields: {
          idUsuario, value, commission, roe, termInMonths, businessStatus, businessCategory, currency, indexing, need, observations, product, probability, nameUsuario,
          opportunityName, productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues, pendingDisbursementAmount
        }, createEditPipeline, swtShowMessage, changeStateSaveData, pipelineBusinessReducer, pipelineReducer, usersPermission, confidentialReducer
      } = this.props;

      if ((nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null) && (idUsuario.value === null || idUsuario.value === '' || idUsuario.value === undefined)) {
        this.setState({
          employeeResponsible: true
        });
      } else {
        if (this.state.showFormAddDisbursementPlan) {
          swtShowMessage(MESSAGE_ERROR, 'Creación de pipeline', 'Señor usuario, esta creando o editando un plan de desembolso, debe terminarlo o cancelarlo para poder guardar.');
        } else {
          if (origin === ORIGIN_PIPELIN_BUSINESS) {
            nameDisbursementPlansInReducer = "childBusinessDisbursementPlans";
          } else {
            nameDisbursementPlansInReducer = "disbursementPlans";
          }

          const listDisburmentPlans = pipelineReducer.get(nameDisbursementPlansInReducer);
          if ((productFamily.value !== "" && productFamily.value !== null && productFamily.value !== undefined) || typeButtonClick === SAVE_DRAFT) {
            let pipelineJson = {
              "id": null,
              "client": window.sessionStorage.getItem('idClientSelected'),
              "documentStatus": typeButtonClick,
              "product": product.value,
              "businessStatus": businessStatus.value,
              "employeeResponsible": nameUsuario.value !== '' && nameUsuario.value !== undefined && nameUsuario.value !== null ? idUsuario.value : null,
              "employeeResponsibleName": nameUsuario.value,
              "currency": currency.value,
              "indexing": indexing.value,
              "commission": commission.value === undefined || commission.value === null || commission.value === '' ? '' : numeral(commission.value).format('0.0000'),
              "need": need.value,
              "roe": roe.value === undefined || roe.value === null || roe.value === '' ? '' : numeral(roe.value).format('0.0000'),
              "observations": observations.value,
              "termInMonths": termInMonths.value,
              "termInMonthsValues": termInMonthsValues.value ? termInMonthsValues.value : "",
              "value": value.value === undefined ? null : numeral(value.value).format('0'),
              "pendingDisbursementAmount": pendingDisbursementAmount.value === undefined ? null : numeral(pendingDisbursementAmount.value).format('0'),
              "probability": probability.value,
              "businessCategory": businessCategory.value,
              "opportunityName": opportunityName.value,
              "productFamily": productFamily.value ? productFamily.value : "",
              "mellowingPeriod": mellowingPeriod.value ? mellowingPeriod.value : "",
              "moneyDistribitionMarket": moneyDistribitionMarket.value ? moneyDistribitionMarket.value : "",
              "areaAssets": areaAssets.value ? areaAssets.value : "",
              "areaAssetsValue": areaAssetsValue.value === undefined || areaAssetsValue.value === null || areaAssetsValue.value === '' ? '' : numeral(areaAssetsValue.value).format('0.00'),
              "disbursementPlans": listDisburmentPlans,
              "commercialReport": buildJsoncommercialReport(null, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick)
            };

            if (origin === ORIGIN_PIPELIN_BUSINESS) {
              pipelineJson.uuid = _.uniqueId('pipelineBusiness_');
              typeMessage = "success";
              titleMessage = "Creación negocio";
              message = "Señor usuario, el negocio se adicionó exitosamente.";
              this.setState({
                showMessageCreatePipeline: true,
                pendingUpdate: true,
                updateValues: pipelineJson
              });
            } else {
              pipelineJson.disbursementPlans = _.map(listDisburmentPlans, (item) => {
                if (item.id != null) {           
                  item.id = item.id.toString().includes('disburPlan_') ? null : item.id;
                }
                return item;
              });

              pipelineJson.listPipelines = _.map(pipelineBusinessReducer.toArray(), (pipelineBusiness) => {
                pipelineBusiness.disbursementPlans = _.map(pipelineBusiness.disbursementPlans, (item) => {
                  item.id = item.id === null || item.id.toString().includes('disburPlan_') ? null : item.id;
                  return item;
                });
                return _.omit(pipelineBusiness, ['uuid']);
              });

              changeStateSaveData(true, MESSAGE_SAVE_DATA);
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
                    
                    let errorResponse = _.get(data, 'payload.data.data');
                    errorResponse.forEach(function(element) {
                      if(element.fieldName == "observations"){
                        observations.error = element.message;
                        let oValue = observations.value;
                        observations.onChange(oValue);
                        message = "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.";
                      }
                    });

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
      }
    }

    updateKeyValueUsersBanco(e) {
      const { fields: { nameUsuario, idUsuario }, filterUsersBanco, swtShowMessage } = this.props;
      let self = this;

      if (e.keyCode === 13 || e.which === 13 || e.which === 1) {
        e.consultclick ? "" : e.preventDefault();
        if (nameUsuario.value !== "" && nameUsuario.value !== null && nameUsuario.value !== undefined) {
          if (nameUsuario.value.length < 3) {
            swtShowMessage('error', 'Error', 'Señor usuario, para realizar la búsqueda es necesario ingresar al menos 3 caracteres');
            return;
          }

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
      const { fields: { idUsuario, nameUsuario }, contactsByClient } = this.props;
      let contactClient = contactsByClient.get('contacts');
      let userSelected;
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
      const { nonValidateEnter, clientInformacion, getMasterDataFields, getClientNeeds,
        consultParameterServer, clearBusiness, updateDisbursementPlans, clearLists, consultDataSelect,setConfidential } = this.props;

     
      nonValidateEnter(true);
      updateDisbursementPlans([], origin);
      clearLists([PRODUCTS]);

      if (origin != ORIGIN_PIPELIN_BUSINESS) {
        clearBusiness();
        setConfidential(false);
      }

      const infoClient = clientInformacion.get('responseClientInfo');
      getClientNeeds();

      typeButtonClick = null;
      if (_.isEmpty(infoClient)) {
        redirectUrl("/dashboard/clientInformation");
      } else {
        getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY,
          PIPELINE_BUSINESS, PROBABILITY, LINE_OF_BUSINESS, BUSINESS_CATEGORY, PRODUCT_FAMILY, MELLOWING_PERIOD,
          FILTER_MONEY_DISTRIBITION_MARKET, FILTER_ACTIVE, TERM_IN_MONTHS_VALUES, CURRENCY]);

        consultDataSelect(PRODUCTS, PRODUCTS_MASK);

        consultParameterServer(LAST_PIPELINE_REVIEW).then((data) => {
          if (data.payload.data.data !== null && data.payload.data.data !== "" && data.payload.data.data !== undefined) {
            datePipelineLastReview = data.payload.data.data.value;
            datePipelineLastReview = moment(datePipelineLastReview, "DD/MM/YYYY").locale('es').format("DD MMM YYYY");
          }
        });
      }
    }

    render() {
      const { fields: { nameUsuario, idUsuario, value, commission, roe, termInMonths, businessStatus,
        businessCategory, currency, indexing, need, observations, product, pendingDisbursementAmount,
        probability, amountDisbursed, estimatedDisburDate, opportunityName,
        productFamily, mellowingPeriod, moneyDistribitionMarket, areaAssets, areaAssetsValue, termInMonthsValues },
        selectsReducer, handleSubmit, reducerGlobal, pipelineReducer } = this.props;

      const isEditableValue = _.size(pipelineReducer.get(nameDisbursementPlansInReducer)) > 0 || this.state.showFormAddDisbursementPlan ? false : true;

      return (
        <div>
          {origin !== ORIGIN_PIPELIN_BUSINESS && <HeaderPipeline />}
          <form onSubmit={handleSubmit(this._submitCreatePipeline)}
            onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
            className="my-custom-tab"
            style={origin === ORIGIN_PIPELIN_BUSINESS ? {} : { backgroundColor: "#FFFFFF", paddingTop: "10px", width: "100%", paddingBottom: "50px" }}>

            <div className={origin === ORIGIN_PIPELIN_BUSINESS ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ""}
              style={origin === ORIGIN_PIPELIN_BUSINESS ? { overflowX: "hidden", paddingBottom: "0px", marginTop: "10px" } : {}}>

              <span style={{ marginLeft: "20px" }} >
                Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.
              </span>              
              {origin !== ORIGIN_PIPELIN_BUSINESS && <Row  style={{ padding: "5px 10px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                    <PermissionUserReports />
                </Col>
              </Row>}
              <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "10px 10px 20px 20px" }}>
                <Col xs={12} md={12} lg={12}>
                  <div style={{ fontSize: "25px", color: "#CEA70B", marginTop: "5px", marginBottom: "5px" }}>
                    <div className="tab-content-row" style={{ borderTop: "1px dotted #cea70b", width: "99%", marginBottom: "10px" }} />
                    <i className="browser icon" style={{ fontSize: "20px" }} />
                    <span style={{ fontSize: "20px" }}>Oportunidad</span>
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
                      data={this.state.products}
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
                    />
                  </div>
                </Col>
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
                      <span>Empleado responsable (</span><span style={{ color: "red" }}>*</span>)
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
                        onChange={(val) => { if (idUsuario.value) { idUsuario.onChange(null) } nameUsuario.onChange(val) }}
                        placeholder="Ingrese un criterio de búsqueda..."
                        onKeyPress={val => this.updateKeyValueUsersBanco(val)}
                        onSelect={val => this._updateValue(val)}
                        error={nameUsuario.error || idUsuario.error}
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
                      <span>Período de maduración</span>
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
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
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
                      <span>Interés/Spread</span>
                    </dt>
                    <Input
                      name={_.uniqueId('commission_')}
                      type="text"
                      {...commission}
                      parentId="dashboardComponentScroll"
                      placeholder="Miles ' , ' y decimales ' . '"
                      onBlur={val => handleBlurValueNumber(2, commission, val, true)}
                      onFocus={val => handleFocusValueNumber(commission, commission.value)}
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
                      parentId="dashboardComponentScroll"
                      onBlur={val => handleBlurValueNumber(1, roe, val, true)}
                      onFocus={val => handleFocusValueNumber(roe, roe.value)}
                    />
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Moneda (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <div onClick={ () => this.showAlertDisabledCurrency(isEditableValue) } >
                      <ComboBox
                        labelInput="Seleccione..."
                        valueProp={'id'}
                        textProp={'value'}
                        {...currency}
                        name={nameCurrency}
                        parentId="dashboardComponentScroll"
                        data={selectsReducer.get(CURRENCY) || []}
                        onChange={val => this._changeCurrency(val)}
                        disabled={isEditableValue ? '' : 'disabled'}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Valor nominal (</span><span style={{ color: "red" }}>*</span>)
                    </dt>
                    <div onClick={ () => this.showAlertDisabledCurrency(isEditableValue) } >
                      <Input
                        {...value}
                        name="valueMillions"
                        type="text"
                        placeholder="Miles ' , ' y decimales ' . '"
                        parentId="dashboardComponentScroll"
                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, value, val, true, 2)}
                        onFocus={val => handleFocusValueNumber(value, value.value)}
                        disabled={isEditableValue ? '' : 'disabled'}
                        onChange={val => this._changeValue(val)}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3} lg={3}>
                  <div style={{ paddingRight: "15px" }}>
                    <dt>
                      <span>Pendiente por desembolsar </span>
                    </dt>
                    <Input
                      {...pendingDisbursementAmount}
                      name="pendingDisbursementAmount"
                      type="text"
                      parentId="dashboardComponentScroll"
                      onBlur={val => handleBlurValueNumber(1, pendingDisbursementAmount, val, false)}
                      onFocus={val => handleFocusValueNumber(pendingDisbursementAmount, pendingDisbursementAmount.value)}
                      disabled={'disabled'}
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
                          parentId="dashboardComponentScroll"
                          onBlur={val => this._handleTermInMonths(termInMonths, val)}
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
                      max="29"
                      {...areaAssets}
                      name={nameAreaAssets}
                      parentId="dashboardComponentScroll"
                      data={selectsReducer.get(FILTER_ACTIVE) || []}
                      disabled={this.state.areaAssetsEnabled ? '' : 'disabled'}
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ padding: "0px 10px 20px 20px" }}>
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
                      onBlur={val => handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, areaAssetsValue, val, true, 2)}
                      onFocus={val => handleFocusValueNumber(areaAssetsValue, areaAssetsValue.value)}
                    />
                  </div>
                </Col>
              </Row>

              <ComponentDisbursementPlan
                disbursementAmount={amountDisbursed}
                estimatedDisburDate={estimatedDisburDate}
                fnShowForm={this.showFormDisbursementPlan}
                registrationRequired={this.state.disbursementPlanRequired}
                showFormDisbursementPlan={this.state.showFormAddDisbursementPlan}
                nominalValue={value}
                pendingDisbursementAmount={pendingDisbursementAmount}
                origin={origin}
                isEditable={true}
              />

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
                    {...observations}
                    placeholder="Ingrese una observación."
                    touched={true}
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
                <button className="btn" type="submit" onClick={() => {setGlobalCondition(null);typeButtonClick = SAVE_DRAFT;}} style={{ float: "right", margin: "8px 0px 0px 8px", position: "fixed", backgroundColor: "#00B5AD" }}>
                  <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                </button>
                <button className="btn" type="submit" onClick={() => {setGlobalCondition(SAVE_PUBLISHED); typeButtonClick = SAVE_PUBLISHED;} } style={{ float: "right", margin: "8px 0px 0px 250px", position: "fixed" }}>
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
            <SweetAlert
              type="error"
              show={this.state.errorValidateXss}
              title={REGEX_SIMPLE_XSS_TITLE}
              text={REGEX_SIMPLE_XSS_MESAGE}
              onConfirm={() => this.setState({ errorValidateXss: false })}
            />
            <SweetAlert
              type="warning"
              show={this.state.showAlertCurrency}
              title='Advertencia'
              text={CURRENCY_MESSAGE}
              onConfirm={() => this.setState({ showAlertCurrency: false })}
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
      getClientNeeds,
      createEditPipeline,
      filterUsersBanco,
      consultParameterServer,
      changeStateSaveData,
      nonValidateEnter,
      addBusiness,
      changeModalIsOpen,
      clearBusiness,
      updateDisbursementPlans,
      swtShowMessage,
      consultListWithParameterUbication,
      clearLists,
      consultDataSelect,
      setConfidential
    }, dispatch);
  }

  function mapStateToProps({ pipelineReducer, clientInformacion, selectsReducer, contactsByClient,
    reducerGlobal, navBar, pipelineBusinessReducer, usersPermission, confidentialReducer }, ownerProps) {

    return {
      pipelineReducer,
      clientInformacion,
      selectsReducer,
      contactsByClient,
      reducerGlobal,
      navBar,
      pipelineBusinessReducer,      
      usersPermission,
      confidentialReducer
    };
  }

  return reduxForm({
    fields,
    form: name || _.uniqueId('business_'),
    validate,
    touchOnChange: true,
  }, mapStateToProps, mapDispatchToProps)(FormPipeline);
}