import React, { Component } from "react";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import { Col, Row } from "react-flexbox-grid";
import moment from "moment";
import _ from "lodash";
import $ from "jquery";
import numeral from "numeral";
import { fields, validations as validate, fieldsWithRules } from './filesAndRules';

import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import SweetAlert from "../../sweetalertFocus";
import HeaderPipeline from "../headerPipeline";
import { addBusiness, clearBusiness, editBusiness } from "../business/ducks";
import Business from "../business/business";
import RichText from '../../richText/richTextComponent';
import ToolTip from '../../toolTip/toolTipComponent';
import ComponentDisbursementPlan from '../disbursementPlan/ComponentDisbursementPlan';
import { setGlobalCondition } from './../../../validationsFields/rulesField';

import { redirectUrl } from "../../globalComponents/actions";
import { showLoading } from '../../loading/actions';
import { swtShowMessage } from '../../sweetAlertMessages/actions';
import { changeStateSaveData } from "../../dashboard/actions";
import { filterUsersBanco } from "../../participantsVisitPre/actions";
import {
    getClientNeeds, getMasterDataFields, getPipelineCurrencies, consultListWithParameterUbication,
    consultDataSelect
} from "../../selectsComponent/actions";
import {
    createEditPipeline, getPipelineById, pdfDescarga, updateDisbursementPlans
} from "../actions";
import {
    consultParameterServer, formValidateKeyEnter, handleBlurValueNumber, handleFocusValueNumber,
    nonValidateEnter, validateResponse
} from "../../../actionsGlobal";

import {
    BUSINESS_CATEGORY, FILTER_COUNTRY, LINE_OF_BUSINESS, PIPELINE_BUSINESS, PRODUCT_FAMILY,
    MELLOWING_PERIOD, PIPELINE_INDEXING, PIPELINE_PRIORITY, PIPELINE_STATUS, PROBABILITY,
    PRODUCTS, FILTER_MONEY_DISTRIBITION_MARKET, FILTER_ACTIVE, TERM_IN_MONTHS_VALUES, PRODUCTS_MASK
} from "../../selectsComponent/constants";
import {
    EDITAR, MESSAGE_SAVE_DATA, ONLY_POSITIVE_INTEGER, OPTION_REQUIRED, REVIEWED_DATE_FORMAT, SAVE_DRAFT,
    SAVE_PUBLISHED, VALUE_REQUIERED, ALLOWS_NEGATIVE_INTEGER, MESSAGE_ERROR, MESSAGE_ERROR_SWEET_ALERT,
    TITLE_ERROR_SWEET_ALERT, VALUE_XSS_INVALID, REGEX_SIMPLE_XSS_TITLE, REGEX_SIMPLE_XSS_MESAGE
} from "../../../constantsGlobal";
import {
    ORIGIN_PIPELIN_BUSINESS, BUSINESS_STATUS_COMPROMETIDO, BUSINESS_STATUS_COTIZACION, PRODUCT_FAMILY_LEASING,
    HELP_PROBABILITY
} from "../constants";

/*const fields = ["id", "nameUsuario", "idUsuario", "value", "commission", "roe", "termInMonths", "businessStatus",
    "businessCategory", "currency", "indexing", "need", "observations", "product",
    "client", "documentStatus", "reviewedDate", "createdBy", "updatedBy", "createdTimestamp",
    "updatedTimestamp", "createdByName", "updatedByName", "positionCreatedBy", "positionUpdatedBy",
    "probability", "amountDisbursed", "estimatedDisburDate", "pendingDisbursementAmount",
    "opportunityName", "productFamily", "mellowingPeriod", "moneyDistribitionMarket",
    "areaAssets", "areaAssetsValue", "termInMonthsValues"]; */

var thisForm;
let typeButtonClick = null;
let errorBusinessCategory = false;
var nameDisbursementPlansInReducer = "disbursementPlans";
var isChildren = false;

export default function createFormPipeline(name, origin, pipelineBusiness, functionCloseModal, disabled) {
    var nameMellowingPeriod = _.uniqueId('mellowingPeriod_');
    var nameProductFamily = _.uniqueId('productFamily_');
    let nameProduct = _.uniqueId('product_');
    let nameIndexing = _.uniqueId('indexing_');
    let nameNeed = _.uniqueId('need_');
    let nameBusinessStatus = _.uniqueId('businessStatus_');
    let nameMoneyDistribitionMarket = _.uniqueId('moneyDistribitionMarket_');
    let nameAreaAssets = _.uniqueId('areaAssets_');
    let nameTermInMonthsValues = _.uniqueId('termInMonthsValues_');
    var nameBusinessCategory = _.uniqueId('businessCategory_');
    let nameProbability = _.uniqueId('probability_');
    let nameCurrency = _.uniqueId('currency_');
    let participantBanc = _.uniqueId('participantBanc_');
    let inputParticipantBanc = _.uniqueId('inputParticipantBanc_');
    let typeMessage = "success";
    let titleMessage = "";
    let message = "";
    let idCurrencyAux = null;
    let contollerErrorChangeType = false;

    class FormEditPipeline extends Component {
        constructor(props) {
            super(props);
            thisForm = this;
            this.state = {
                showMessageEditPipeline: false,
                isEditable: false,
                showConfirm: false,
                employeeResponsible: false,
                showConfirmChangeCurrency: false,
                pendingUpdate: false,
                updateValues: {},
                firstTimeCharging: false,
                errorValidate: false,
                errorValidateXss: false,
                probabilityEnabled: false,
                areaAssetsEnabled: false,
                flagInitLoadAssests: false,
                //Se utilizan para controlar el componente de planes de desembolso 
                showFormAddDisbursementPlan: false,
                disbursementPlanRequired: false,
                products: []
            };

            isChildren = origin === ORIGIN_PIPELIN_BUSINESS;
            if (origin === ORIGIN_PIPELIN_BUSINESS) {
                nameDisbursementPlansInReducer = "childBusinessDisbursementPlans";
                fieldsWithRules.opportunityName.rules = [];
            } else {
                nameDisbursementPlansInReducer = "disbursementPlans";
            }

            this._submitEditPipeline = this._submitEditPipeline.bind(this);
            this._closeMessageEditPipeline = this._closeMessageEditPipeline.bind(this);
            this.updateKeyValueUsersBanco = this.updateKeyValueUsersBanco.bind(this);
            this._updateValue = this._updateValue.bind(this);
            this._onCloseButton = this._onCloseButton.bind(this);
            this._closeConfirmClosePipeline = this._closeConfirmClosePipeline.bind(this);
            this._changeCurrency = this._changeCurrency.bind(this);
            this._editPipeline = this._editPipeline.bind(this);
            this._onClickPDF = this._onClickPDF.bind(this);
            this._handleTermInMonths = this._handleTermInMonths.bind(this);
            this._closeConfirmChangeCurrency = this._closeConfirmChangeCurrency.bind(this);
            this._closeCancelConfirmChanCurrency = this._closeCancelConfirmChanCurrency.bind(this);
            this._consultInfoPipeline = this._consultInfoPipeline.bind(this);
            this._changeBusinessStatus = this._changeBusinessStatus.bind(this);
            this._changeProductFamily = this._changeProductFamily.bind(this);
            this.showFormDisbursementPlan = this.showFormDisbursementPlan.bind(this);
            this._changeValue = this._changeValue.bind(this);
        }

        showFormDisbursementPlan(isOpen) {
            this.setState({
                showFormAddDisbursementPlan: isOpen,
                disbursementPlanRequired: false
            });
        }

        _closeMessageEditPipeline() {
            this.setState({
                showMessageEditPipeline: false
            });

            if (origin !== ORIGIN_PIPELIN_BUSINESS) {
                if (typeMessage === "success") {
                    redirectUrl("/dashboard/clientInformation");
                }
            } else {
                functionCloseModal();
            }

            if (this.state.pendingUpdate) {
                this.props.editBusiness(this.state.updateValues);
            }
        }

        _onClickPDF() {
            const { pdfDescarga, params: { id } } = this.props;
            pdfDescarga(window.sessionStorage.getItem('idClientSelected'), id);
        }

        _changeCurrency(currencyValue) {
            const { fields: { value } } = this.props;
            if (idCurrencyAux == null) {
                idCurrencyAux = parseInt(currencyValue);
            }

            if (this.state.isEditable && currencyValue !== undefined && currencyValue !== '' && currencyValue !== null && parseInt(currencyValue) !== parseInt(idCurrencyAux) && !contollerErrorChangeType) {
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
            message = "¿Está seguro que desea salir de la pantalla de edición de pipeline?";
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

        _changeBusinessStatus(currencyValue) {
            const { selectsReducer, fields: { probability } } = this.props;
            let _pipeline_status = selectsReducer.get(PIPELINE_STATUS)
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

        _changeProductFamily(currencyValue) {
            const { selectsReducer, fields: { areaAssets, productFamily, product }, consultListWithParameterUbication, pipelineReducer } = this.props;
            if (!this.state.flagInitLoadAssests) {
                areaAssets.onChange('');
            }

            let _product_family = selectsReducer.get(PRODUCT_FAMILY)
            this.setState({
                flagInitLoadAssests: false,
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

            if (!_.isEqual(pipelineReducer.get('detailPipeline').productFamily, productFamily.value)) {
                product.onChange('');
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

            idCurrencyAux = parseInt(currency.value);
        }

        _changeValue(val) {
            const { fields: { pendingDisbursementAmount, value } } = this.props;
            handleBlurValueNumber(ONLY_POSITIVE_INTEGER, pendingDisbursementAmount, (val).toString(), true, 2);
            value.onChange(val);
            if (_.isNil(val) || val === '') {
                this.showFormDisbursementPlan(false);
            }
        }

        _submitEditPipeline() {
            const { initialValues, fields: { idUsuario, value, commission, roe, termInMonths, businessStatus,
                businessCategory, currency, indexing, need, observations, product,
                moneyDistribitionMarket, client, documentStatus, nameUsuario, probability,
                opportunityName, productFamily, mellowingPeriod, areaAssets, areaAssetsValue,
                termInMonthsValues, pendingDisbursementAmount }, createEditPipeline,
                changeStateSaveData, swtShowMessage, pipelineBusinessReducer,
                pipelineReducer } = this.props;
            const idPipeline = origin === ORIGIN_PIPELIN_BUSINESS ? pipelineBusiness.id : this.props.params.id;
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
                            "id": idPipeline,
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
                            "moneyDistribitionMarket": moneyDistribitionMarket.value,
                            "observations": observations.value,
                            "termInMonths": termInMonths.value,
                            "termInMonthsValues": termInMonthsValues.value ? termInMonthsValues.value : "",
                            "value": value.value === undefined ? null : (value.value.toString()).replace(/,/g, ""),
                            "pendingDisbursementAmount": pendingDisbursementAmount.value === undefined ? null : numeral(pendingDisbursementAmount.value).format('0'),
                            "probability": probability.value,
                            "businessCategory": businessCategory.value,
                            "opportunityName": opportunityName.value,
                            "productFamily": productFamily.value ? productFamily.value : "",
                            "mellowingPeriod": mellowingPeriod.value ? mellowingPeriod.value : "",
                            "areaAssets": areaAssets.value ? areaAssets.value : "",
                            "areaAssetsValue": areaAssetsValue.value === undefined || areaAssetsValue.value === null || areaAssetsValue.value === '' ? '' : numeral(areaAssetsValue.value).format('0.00'),
                            "disbursementPlans": listDisburmentPlans
                        };
                        if (origin === ORIGIN_PIPELIN_BUSINESS) {
                            typeMessage = "success";
                            titleMessage = "Edición de negocio";
                            message = "Señor usuario, el negocio se editó exitosamente.";
                            this.setState({
                                showMessageEditPipeline: true,
                                pendingUpdate: true,
                                updateValues: Object.assign({}, pipelineJson, { uuid: pipelineBusiness.uuid })
                            });
                        } else {
                            pipelineJson.disbursementPlans = _.map(listDisburmentPlans, (item) => {
                                item.id = item.id.toString().includes('disburPlan_') ? null : item.id;
                                return item;
                            });
                            pipelineJson.listPipelines = _.map(pipelineBusinessReducer.toArray(), (pipelineBusiness) => {
                                pipelineBusiness.disbursementPlans = _.map(pipelineBusiness.disbursementPlans, (item) => {
                                    item.id = item.id === null || item.id.toString().includes('disburPlan_') ? null : item.id;
                                    return item;
                                });
                                return _.omit(pipelineBusiness, ['uuid']);
                            }
                            );
                            changeStateSaveData(true, MESSAGE_SAVE_DATA);
                            createEditPipeline(pipelineJson).then((data) => {
                                changeStateSaveData(false, "");
                                if (!_.get(data, 'payload.data.validateLogin') || _.get(data, 'payload.data.validateLogin') === 'false') {
                                    redirectUrl("/login");
                                } else {
                                    if ((_.get(data, 'payload.data.status') === 200)) {
                                        typeMessage = "success";
                                        titleMessage = "Edición pipeline";
                                        message = "Señor usuario, el pipeline se editó exitosamente.";
                                        this.setState({ showMessageEditPipeline: true });
                                    } else {
                                        typeMessage = "error";
                                        titleMessage = "Edición pipeline";
                                        message = "Señor usuario, ocurrió un error editando el informe de pipeline.";

                                        let errorResponse = _.get(data, 'payload.data.data');
                                        errorResponse.forEach(function(element) {
                                          if(element.fieldName == "observations"){
                                            observations.error = element.message;
                                            let oValue = observations.value;
                                            observations.onChange(oValue);
                                            message = "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.";
                                          }
                                        });

                                        this.setState({ showMessageEditPipeline: true });
                                    }
                                }
                            }, (reason) => {
                                changeStateSaveData(false, "");
                                typeMessage = "error";
                                titleMessage = "Edición pipeline";
                                message = "Señor usuario, ocurrió un error editando el informe de pipeline.";
                                this.setState({ showMessageEditPipeline: true });
                            });
                        }
                    }
                }
            }
        }

        updateKeyValueUsersBanco(e) {
            const { fields: { nameUsuario, idUsuario }, filterUsersBanco, swtShowMessage } = this.props;
            var self = this;
            // idUsuario.onChange('');
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
                    }
                    );
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

        _editPipeline() {
            this.setState({
                isEditable: !this.state.isEditable
            });
        }

        _consultInfoPipeline(data) {
            const { fields: { businessStatus, commission, currency, idUsuario, nameUsuario,
                indexing, need, observations, product, roe, moneyDistribitionMarket,
                termInMonths, value, client, documentStatus, createdBy, updatedBy, createdTimestamp,
                updatedTimestamp, createdByName, updatedByName, positionCreatedBy, positionUpdatedBy,
                reviewedDate, probability, businessCategory, opportunityName, productFamily,
                mellowingPeriod, areaAssets, areaAssetsValue, termInMonthsValues,
                pendingDisbursementAmount }, updateDisbursementPlans } = this.props;
            updateDisbursementPlans(data.disbursementPlans, origin);
            this.setState({ flagInitLoadAssests: true });
            productFamily.onChange(data.productFamily);
            opportunityName.onChange(data.opportunityName);
            businessStatus.onChange(data.businessStatus);
            commission.onChange(fomatInitialStateNumber(data.commission));
            currency.onChange(data.currency);
            idUsuario.onChange(data.employeeResponsible);
            nameUsuario.onChange(data.employeeResponsibleName);
            indexing.onChange(data.indexing);
            need.onChange(data.need);
            observations.onChange(data.observations === null ? '' : data.observations);
            product.onChange(data.product);
            roe.onChange(fomatInitialStateNumber(data.roe));
            moneyDistribitionMarket.onChange(data.moneyDistribitionMarket);
            termInMonths.onChange(data.termInMonths);
            termInMonthsValues.onChange(data.termInMonthsValues);
            value.onChange(fomatInitialStateNumber(data.value));
            pendingDisbursementAmount.onChange(fomatInitialStateNumber(data.pendingDisbursementAmount));
            client.onChange(data.client);
            documentStatus.onChange(data.documentStatus);
            createdBy.onChange(data.createdBy);
            updatedBy.onChange(data.updatedBy);
            createdTimestamp.onChange(data.createdTimestamp);
            updatedTimestamp.onChange(data.updatedTimestamp);
            createdByName.onChange(data.createdByName);
            updatedByName.onChange(data.updatedByName);
            positionCreatedBy.onChange(data.positionCreatedBy);
            positionUpdatedBy.onChange(data.positionUpdatedBy);
            reviewedDate.onChange(moment(data.reviewedDate, "x").locale('es').format(REVIEWED_DATE_FORMAT));
            probability.onChange(data.probability);
            businessCategory.onChange(data.businessCategory);
            mellowingPeriod.onChange(data.mellowingPeriod);
            areaAssets.onChange(data.areaAssets);
            areaAssetsValue.onChange(fomatInitialStateNumber(data.areaAssetsValue, 2));
        }

        componentWillMount() {
            const { clientInformacion, getMasterDataFields, getPipelineCurrencies, getClientNeeds,
                getPipelineById, nonValidateEnter, fields: { nameUsuario, idUsuario, value, commission, roe,
                    termInMonths, businessStatus, currency, indexing, need, observations,
                    business, product, moneyDistribitionMarket, client, documentStatus, areaAssets,
                    areaAssetsValue, termInMonthsValues }, addBusiness, clearBusiness,
                showLoading, swtShowMessage, consultDataSelect } = this.props;
            const infoClient = clientInformacion.get('responseClientInfo'); typeButtonClick = null;
            if (origin !== ORIGIN_PIPELIN_BUSINESS) {
                clearBusiness();
            } else {
                //como se utiliza el mismo formulario para crear el negocio, al modal se le heredan los permisos de edición
                //que tiene el pipeline padre
                this.setState({
                    isEditable: disabled
                });
            }
            nonValidateEnter(true);
            getPipelineCurrencies();
            getClientNeeds();
            if (_.isEmpty(infoClient)) {
                redirectUrl("/dashboard/clientInformation");
            } else {
                showLoading(true, 'Cargando...');

                consultDataSelect(PRODUCTS, PRODUCTS_MASK).then((data) => {                    
                    this.setState({
                        products: _.get(data, 'payload.data.messageBody.masterDataDetailEntries', [])
                    });
                });

                getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY, PIPELINE_BUSINESS,
                    PROBABILITY, LINE_OF_BUSINESS, BUSINESS_CATEGORY, PRODUCT_FAMILY, MELLOWING_PERIOD,
                    FILTER_MONEY_DISTRIBITION_MARKET, FILTER_ACTIVE, TERM_IN_MONTHS_VALUES]).then((result) => {
                        if (origin !== ORIGIN_PIPELIN_BUSINESS) {
                            const { params: { id } } = this.props;
                            getPipelineById(id).then((result) => {
                                showLoading(false, null);
                                if (!validateResponse(result)) {
                                    swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                                } else {
                                    var data = result.payload.data.data;
                                    _.forIn(data.listPipelines, function (pipeline, key) {
                                        const uuid = _.uniqueId('pipelineBusiness_');
                                        pipeline.uuid = uuid;
                                        addBusiness(pipeline);
                                    });
                                    this._consultInfoPipeline(data);
                                }
                            });
                        } else {
                            showLoading(false, null);
                        }
                    });
            }
        }

        componentDidMount() {
            const { clientInformacion, getMasterDataFields, getPipelineCurrencies, getClientNeeds,
                getPipelineById, nonValidateEnter, addBusiness, clearBusiness } = this.props;

            if (pipelineBusiness !== null && pipelineBusiness !== undefined && pipelineBusiness !== '') {
                this._consultInfoPipeline(pipelineBusiness);
            }
        }

        componentDidUpdate(prevProps, prevState) {
            if (origin === ORIGIN_PIPELIN_BUSINESS && this.state.firstTimeCharging === false) {
                this.modalScrollArea.scrollTop = 0;
                this.setState({
                    firstTimeCharging: true
                });
            }
        }

        render() {
            const {
                initialValues, fields: { nameUsuario, idUsuario, value,
                    commission, roe, termInMonths, businessStatus, businessCategory, currency,
                    indexing, need, observations, business, product, moneyDistribitionMarket, client,
                    documentStatus, pendingDisbursementAmount, updatedBy, createdTimestamp,
                    updatedTimestamp, createdByName, updatedByName, reviewedDate, positionCreatedBy,
                    positionUpdatedBy, probability, amountDisbursed, estimatedDisburDate,
                    opportunityName, productFamily, mellowingPeriod, areaAssets, areaAssetsValue, termInMonthsValues
                }, clientInformacion, selectsReducer, handleSubmit, pipelineReducer, consultParameterServer,
                reducerGlobal, navBar } = this.props;

            const ownerDraft = pipelineReducer.get('ownerDraft');
            const isEditableValue = _.size(pipelineReducer.get(nameDisbursementPlansInReducer)) > 0 || this.state.showFormAddDisbursementPlan ? false : true;
            let fechaModString = '';
            if (updatedTimestamp.value !== null) {
                let fechaModDateMoment = moment(updatedTimestamp.value, "x").locale('es');
                fechaModString = fechaModDateMoment.format("DD") + " " + fechaModDateMoment.format("MMM") + " " + fechaModDateMoment.format("YYYY") + ", " + fechaModDateMoment.format("hh:mm a");
            }

            let fechaCreateString = '';
            if (createdTimestamp.value !== null) {
                let fechaCreateDateMoment = moment(createdTimestamp.value, "x").locale('es');
                fechaCreateString = fechaCreateDateMoment.format("DD") + " " + fechaCreateDateMoment.format("MMM") + " " + fechaCreateDateMoment.format("YYYY") + ", " + fechaCreateDateMoment.format("hh:mm a");
            }

            return (
                <div>
                    {origin !== ORIGIN_PIPELIN_BUSINESS && <HeaderPipeline />}
                    <form onSubmit={handleSubmit(this._submitEditPipeline)}
                        onKeyPress={val => formValidateKeyEnter(val, reducerGlobal.get('validateEnter'))}
                        className="my-custom-tab"
                        style={origin === ORIGIN_PIPELIN_BUSINESS ? {} : {
                            backgroundColor: "#FFFFFF",
                            paddingTop: "10px",
                            width: "100%",
                            paddingBottom: "50px"
                        }}>
                        <div id={origin === ORIGIN_PIPELIN_BUSINESS ? "modalComponentFormEditPipeline" : "formModal"}
                            className={origin === ORIGIN_PIPELIN_BUSINESS ? "modalBt4-body modal-body business-content editable-form-content clearfix" : ""}
                            style={origin === ORIGIN_PIPELIN_BUSINESS ? {
                                overflowX: "hidden",
                                paddingBottom: "0px",
                                marginTop: "10px"
                            } : {}}
                            ref={divArea => this.modalScrollArea = divArea}>
                            <Row style={{ padding: "5px 10px 0px 20px" }}>
                                <Col xs={10} sm={10} md={10} lg={10}>
                                    <span>Los campos marcados con asterisco (<span style={{ color: "red" }}>*</span>) son obligatorios.</span>
                                </Col>
                                <Col xs={2} sm={2} md={2} lg={2} style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : {}}>
                                    {_.get(reducerGlobal.get('permissionsPipeline'), _.indexOf(reducerGlobal.get('permissionsPipeline'), EDITAR), false) &&
                                        <button type="button" onClick={this._editPipeline}
                                            className={'btn btn-primary modal-button-edit'}
                                            style={{ marginRight: '15px', float: 'right', marginTop: '-15px' }}>
                                            Editar
                                            <i className={'icon edit'} /></button>
                                    }
                                </Col>
                            </Row>
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
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ padding: "10px 10px 20px 20px" }}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <div className="tab-content-row" style={{
                                            borderTop: "1px dotted #cea70b",
                                            width: "99%",
                                            marginBottom: "10px"
                                        }} />
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Producto</span>
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            parentId="dashboardComponentScroll"
                                            data={this.state.products}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            {...product}
                                            name={nameProduct}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                                disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ padding: "0px 10px 20px 20px" }}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            {origin === ORIGIN_PIPELIN_BUSINESS ?
                                                <span>Categoría del negocio</span>
                                                :
                                                <span>Categoría del negocio (<span style={{ color: "red" }}>*</span>)</span>
                                            }
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...businessCategory}
                                            name={nameBusinessCategory}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(BUSINESS_CATEGORY) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            disabled={(this.state.probabilityEnabled && this.state.isEditable) ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ padding: "20px 23px 20px 20px" }}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <div className="tab-content-row" style={{
                                            borderTop: "1px dotted #cea70b",
                                            width: "100%",
                                            marginBottom: "10px"
                                        }} />
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Interés/Spread</span>
                                        </dt>
                                        <Input
                                            name="commission"
                                            type="text"
                                            {...commission}
                                            max="10"
                                            parentId="dashboardComponentScroll"
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onBlur={val => handleBlurValueNumber(1, commission, val, true)}
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
                                            max="10"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, roe, val, true)}
                                            onFocus={val => handleFocusValueNumber(roe, roe.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onChange={val => this._changeCurrency(val)}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{ padding: "0px 10px 20px 20px" }}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Valor nominal (</span>
                                            <span style={{ color: "red" }}>*</span>)
                                        </dt>
                                        <Input
                                            {...value}
                                            name="valueMillions"
                                            type="text"
                                            max="15"
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, value, val, true, 2)}
                                            onFocus={val => handleFocusValueNumber(value, value.value)}
                                            disabled={this.state.isEditable && isEditableValue ? '' : 'disabled'}
                                            onChange={val => this._changeValue(val)}
                                        />
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
                                            max="15"
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
                                                    max="4"
                                                    parentId="dashboardComponentScroll"
                                                    disabled={this.state.isEditable ? '' : 'disabled'}
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
                                                    disabled={this.state.isEditable ? '' : 'disabled'}
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
                                            data={selectsReducer.get(FILTER_ACTIVE) || []}
                                            disabled={(this.state.areaAssetsEnabled && this.state.isEditable) ? '' : 'disabled'}
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
                                            max="15"
                                            {...areaAssetsValue}
                                            parentId="dashboardComponentScroll"
                                            onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, areaAssetsValue, val, true, 2)}
                                            onFocus={val => handleFocusValueNumber(areaAssetsValue, areaAssetsValue.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <ComponentDisbursementPlan
                                disbursementAmount={amountDisbursed} estimatedDisburDate={estimatedDisburDate}
                                fnShowForm={this.showFormDisbursementPlan} registrationRequired={this.state.disbursementPlanRequired}
                                showFormDisbursementPlan={this.state.showFormAddDisbursementPlan} nominalValue={value}
                                isEditable={this.state.isEditable} pendingDisbursementAmount={pendingDisbursementAmount}
                                origin={origin} />
                            <Business origin={origin} disabled={this.state.isEditable} />
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "20px 23px 20px 20px" }}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        fontSize: "25px",
                                        color: "#CEA70B",
                                        marginTop: "5px",
                                        marginBottom: "5px"
                                    }}>
                                        <div className="tab-content-row" style={{
                                            borderTop: "1px dotted #cea70b",
                                            width: "100%",
                                            marginBottom: "10px"
                                        }} />
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
                                        touched={true}
                                        placeholder="Ingrese una observación."
                                        style={{ width: '100%', height: '178px' }}
                                        readOnly={!this.state.isEditable}
                                        disabled={this.state.isEditable ? '' : 'disabled'}
                                    />
                                </Col>
                            </Row>
                            <Row style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : {}}>
                                <Col xs={12} md={12} lg={12}>
                                    <div style={{
                                        textAlign: "left",
                                        marginTop: "10px",
                                        marginBottom: "20px",
                                        marginLeft: "20px"
                                    }}>
                                        <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha última revisión formato pipeline: </span><span
                                            style={{ marginLeft: "0px", color: "#818282" }}>{reviewedDate.value}</span>
                                    </div>
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "10px 10px 0px 20px" }}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ fontWeight: "bold", color: "#818282" }}>Creado por</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de creación</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null &&
                                        <span style={{ fontWeight: "bold", color: "#818282" }}>Modificado por</span>
                                    }
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null &&
                                        <span style={{ fontWeight: "bold", color: "#818282" }}>Fecha de modificación</span>
                                    }
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "5px 10px 0px 20px" }}>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ marginLeft: "0px", color: "#818282" }}>{createdByName.value}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaCreateString}</span>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null &&
                                        <span style={{ marginLeft: "0px", color: "#818282" }}>{updatedByName.value}</span>
                                    }
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    {updatedBy.value !== null &&
                                        <span style={{ marginLeft: "0px", color: "#818282" }}>{fechaModString}</span>
                                    }
                                </Col>
                            </Row>
                            <Row
                                style={origin === ORIGIN_PIPELIN_BUSINESS ? { display: "none" } : { padding: "0px 10px 20px 20px" }}>
                                <Col xs={6} md={6} lg={6}>
                                    <span style={{ marginLeft: "0px", color: "#A7ADAD" }}>{positionCreatedBy.value}</span>
                                </Col>
                                <Col xs={6} md={6} lg={6}>
                                    <span style={{ marginLeft: "0px", color: "#A7ADAD" }}>{positionUpdatedBy.value}</span>
                                </Col>
                            </Row>
                        </div>
                        <div style={origin !== ORIGIN_PIPELIN_BUSINESS ? {
                            position: "fixed",
                            border: "1px solid #C2C2C2",
                            bottom: "0px",
                            width: "100%",
                            marginBottom: "0px",
                            backgroundColor: "#F8F8F8",
                            height: "50px",
                            background: "rgba(255,255,255,0.75)"
                        } : { display: "none" }}>
                            <div style={{ width: "580px", height: "100%", position: "fixed", right: "0px" }}>
                                <button className="btn" type="submit" onClick={() => {setGlobalCondition(null);typeButtonClick = SAVE_DRAFT;}}
                                    style={this.state.isEditable === true && ownerDraft === 0 ? {
                                        float: "right",
                                        margin: "8px 0px 0px -120px",
                                        position: "fixed",
                                        backgroundColor: "#00B5AD"
                                    } : { display: "none" }}>
                                    <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                                </button>
                                <button className="btn" type="submit" onClick={() =>  {setGlobalCondition(SAVE_PUBLISHED); typeButtonClick = SAVE_PUBLISHED;}}
                                    style={this.state.isEditable === true ? {
                                        float: "right",
                                        margin: "8px 0px 0px 107px",
                                        position: "fixed"
                                    } : { display: "none" }}>
                                    <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar definitivo</span>
                                </button>
                                <button className="btn" type="button" onClick={this._onClickPDF} style={{
                                    float: "right",
                                    margin: "8px 0px 0px 292px",
                                    position: "fixed",
                                    backgroundColor: "#eb984e"
                                }}>
                                    <span style={{ color: "#FFFFFF", padding: "10px" }}>Descargar pdf</span>
                                </button>
                                <button className="btn" type="button" onClick={this._onCloseButton} style={{
                                    float: "right",
                                    margin: "8px 0px 0px 450px",
                                    position: "fixed",
                                    backgroundColor: "rgb(193, 193, 193)"
                                }}>
                                    <span style={{ color: "#FFFFFF", padding: "10px" }}>Cancelar</span>
                                </button>
                            </div>
                        </div>
                        <SweetAlert
                            type={typeMessage}
                            show={this.state.showMessageEditPipeline}
                            title={titleMessage}
                            text={message}
                            onConfirm={this._closeMessageEditPipeline}
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
                        <div className="modalBt4-footer modal-footer"
                            style={origin === ORIGIN_PIPELIN_BUSINESS ? { height: "76px" } : { display: "none" }}>
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
            getPipelineById,
            changeStateSaveData,
            nonValidateEnter,
            editBusiness,
            addBusiness,
            clearBusiness,
            showLoading,
            swtShowMessage,
            updateDisbursementPlans,
            consultListWithParameterUbication,
            consultDataSelect
        }, dispatch);
    }

    function mapStateToProps({ clientInformacion, selectsReducer, contactsByClient, pipelineReducer, reducerGlobal, navBar, pipelineBusinessReducer }, pathParameter) {
        return {
            clientInformacion,
            selectsReducer,
            contactsByClient,
            pipelineReducer,
            pdfDescarga,
            consultParameterServer,
            reducerGlobal,
            navBar,
            pipelineBusinessReducer
        };
    }

    function fomatInitialStateNumber(val, numDecimals) {
        var decimal = '';
        if (val !== undefined && val !== null && val !== '') {
            val = val.toString();
            if (val.includes(".")) {
                var vectorVal = val.split(".");
                val = vectorVal[0] + '.';
                if (vectorVal.length > 1) {
                    var numDec = (numDecimals == undefined || numDecimals == null) ? 4 : numDecimals;
                    decimal = vectorVal[1].substring(0, numDec);
                }
            }
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val + "")) {
                val = val.toString().replace(pattern, "$1,$2");
            }
            return val + decimal;
        }
        return '';
    }

    return reduxForm({
        form: name || _.uniqueId('business_'),
        fields,
        validate,
        touchOnChange: true,
        overwriteOnInitialValuesChange: false,
        onSubmitFail: errors => {

            let numXssValidation = Object.keys(errors).filter(item => errors[item] == VALUE_XSS_INVALID).length;
        }
    }, mapStateToProps, mapDispatchToProps)(FormEditPipeline);
}