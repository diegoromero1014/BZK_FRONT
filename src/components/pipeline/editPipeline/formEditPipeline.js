import React, {Component} from "react";
import {reduxForm} from "redux-form";
import {bindActionCreators} from "redux";
import {Col, Row} from "react-flexbox-grid";
import moment from "moment";
import _ from "lodash";
import $ from "jquery";
import numeral from "numeral";
import {fields, fieldsWithRules, validations as validate} from './filesAndRules';

import Input from "../../../ui/input/inputComponent";
import ComboBox from "../../../ui/comboBox/comboBoxComponent";
import ComboBoxFilter from "../../../ui/comboBoxFilter/comboBoxFilter";
import SweetAlert from "../../sweetalertFocus";
import {addBusiness, clearBusiness, editBusiness} from "../business/ducks";
import Business from "../business/business";
import RichText from '../../richText/richTextComponent';
import ToolTip from '../../toolTip/toolTipComponent';
import ComponentDisbursementPlan from '../disbursementPlan/componentDisbursementPlan';
import {setGlobalCondition} from './../../../validationsFields/rulesField';

import {redirectUrl} from "../../globalComponents/actions";
import {showLoading} from '../../loading/actions';
import {swtShowMessage} from '../../sweetAlertMessages/actions';
import {changeStateSaveData} from "../../main/actions";
import {filterUsersBanco} from "../../participantsVisitPre/actions";
import {
    consultDataSelect,
    consultListByCatalogType,
    consultListWithParameterUbication,
    getClientNeeds,
    getMasterDataFields,
    dispatchChildCatalogs
} from "../../selectsComponent/actions";
import {createEditPipeline, getPipelineById, pdfDescarga, updateDisbursementPlans} from "../actions";
import {
    consultParameterServer,
    formValidateKeyEnter,
    handleBlurValueNumber,
    handleFocusValueNumber,
    nonValidateEnter,
    validateResponse
} from "../../../actionsGlobal";

import {
    ALL_BUSINESS_CATEGORIES,
    ALL_PRODUCT_FAMILIES,
    BUSINESS_CATEGORY,
    CLIENT_NEED,
    COMMERCIAL_OPORTUNITY,
    CURRENCY,
    FILTER_ACTIVE,
    FILTER_COUNTRY,
    FILTER_MONEY_DISTRIBITION_MARKET,
    FILTER_MULTISELECT_FIELDS,
    FILTER_TYPE_POLICY,
    LINE_OF_BUSINESS,
    MELLOWING_PERIOD,
    PIPELINE_BUSINESS,
    PIPELINE_INDEXING,
    PIPELINE_JUSTIFICATION,
    PIPELINE_PRIORITY,
    PIPELINE_STATUS,
    PIPELINE_TYPE,
    PROBABILITY,
    PRODUCT_FAMILY,
    PRODUCTS_MASK,
    TERM_IN_MONTHS_VALUES
} from "../../selectsComponent/constants";
import {
    ALLOWS_NEGATIVE_INTEGER,
    EDITAR,
    MESSAGE_ERROR,
    MESSAGE_ERROR_SWEET_ALERT,
    MESSAGE_SAVE_DATA,
    ONLY_POSITIVE_INTEGER,
    REGEX_SIMPLE_XSS_MESAGE,
    REGEX_SIMPLE_XSS_TITLE,
    REVIEWED_DATE_FORMAT,
    SAVE_DRAFT,
    SAVE_PUBLISHED,
    TITLE_ERROR_SWEET_ALERT
} from "../../../constantsGlobal";
import {
    BUSINESS_STATUS_COMPROMETIDO,
    BUSINESS_STATUS_COTIZACION,
    BUSINESS_STATUS_NO_CONTACTADO,
    BUSINESS_STATUS_PERDIDO,
    CATCHMENTS,
    CURRENCY_MESSAGE,
    FACTORING,
    FACTORING_BANCOLOMBIA_CONFIRMING,
    FACTORING_PLUS,
    FINANCIAL_LEASING,
    HELP_PROBABILITY,
    HELP_SVA,
    IMPORTATION_LEASING,
    LEASING,
    NEED_FINANCING,
    NUEVO_NEGOCIO,
    OPERATING_LEASE,
    OPORTUNITIES_MANAGEMENT,
    ORIGIN_PIPELIN_BUSINESS,
    PIPELINE_DISBURSEMENT_PLAN_MESSAGE,
    PIPELINE_INDEXING_FIELD,
    PIPELINE_NEED_CLIENT,
    PIPELINE_PENDING_DISBURSEMENT_AMOUNT,
    PIPELINE_TERM_IN_MONTHS_AND_VALUES,
    PLACEMENTS,
    PRODUCT_FAMILY_LEASING
} from "../constants";
import {addUsers, setConfidential} from "../../commercialReport/actions";
import {buildJsoncommercialReport, fillUsersPermissions} from "../../commercialReport/functionsGenerics";
import PermissionUserReports from "../../commercialReport/permissionsUserReports";

import Classification from '../sections/classification';
import '../pipeline.style.scss';
import TextareaComponent from "../../../ui/textarea/textareaComponent";
import ReportsHeader from "../../globalComponents/reportsHeader/component";
import GetChildCatalogs from './../pipelineUtilities/GetChildCatalogs';

let thisForm;
let typeButtonClick = null;
let nameDisbursementPlansInReducer = "disbursementPlans";

export default function createFormPipeline(name, origin, pipelineBusiness, functionCloseModal, disabled) {
    let nameMellowingPeriod = _.uniqueId('mellowingPeriod_');
    let nameProductFamily = _.uniqueId('productFamily_');
    let nameProduct = _.uniqueId('product_');
    let nameIndexing = _.uniqueId('indexing_');
    let nameNeed = _.uniqueId('need_');
    let nameBusinessStatus = _.uniqueId('businessStatus_');
    let nameMoneyDistribitionMarket = _.uniqueId('moneyDistribitionMarket_');
    let nameAreaAssets = _.uniqueId('areaAssets_');
    let nameTermInMonthsValues = _.uniqueId('termInMonthsValues_');
    let nameBusinessCategory = _.uniqueId('businessCategory_');
    let nameBusinessCategory2 = _.uniqueId('businessCategory2_');
    let nameProbability = _.uniqueId('probability_');
    let nameCurrency = _.uniqueId('currency_');
    let participantBanc = _.uniqueId('participantBanc_');
    let inputParticipantBanc = _.uniqueId('inputParticipantBanc_');
    let pipelineTypeName = _.uniqueId('pipelineType');
    let commercialOportunityName = _.uniqueId("commercialOportunity");
    let nameJustificationPipeline = _.uniqueId('justificationPipeline_');
    let nameTypePolicy = _.uniqueId('nameTypePolicy');
    let typeMessage = "success";
    let titleMessage = "";
    let message = "";
    let idCurrencyAux = null;
    let contollerErrorChangeType = false;
    let keyBusinessCategory = "";
    let keyBusinessCategory2 = "";

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
                products: [],
                productsFamily: [],
                showAlertCurrency: false,
                showJustificationField: false,
                showProbabilityField: true,
                showMellowingPeriodField: true,
                pipelineStatus: [],
                messageTooltipNominalValue:null,
                showInteresSpread: false,
                showConfirmChangeNeed: false,
                showAlertFinancingAndPlan: false,
                showtermInMonthsField: false,
                showindexingField: false,
                showpendingDisbursementAmountField: false,
                showComponentDisbursementPlan: false,
                isFinancingNeed: false,
                businessCategories: null,
                businessCategories2: null,
                showPolicyType: false,
                showBusinessCategory2: false,
            };

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
            this._changeProduct = this._changeProduct.bind(this);
            this.showFormDisbursementPlan = this.showFormDisbursementPlan.bind(this);
            this._changeValue = this._changeValue.bind(this);
            this.showAlertDisabledCurrency = this.showAlertDisabledCurrency.bind(this);
            this._onChangeBusinessCategory=this._onChangeBusinessCategory.bind(this);
            this._pipelineTypeAndBusinessOnChange = this._pipelineTypeAndBusinessOnChange.bind(this);
            this._changeAreaAssetsEnabledValue = this._changeAreaAssetsEnabledValue.bind(this);
            this.setPipelineStatusValues = this.setPipelineStatusValues.bind(this);
            this.renderNominalValue = this.renderNominalValue.bind(this);
            this._showAlertFinancingAndPlan = this._showAlertFinancingAndPlan.bind(this);
            this._changeNeedsClient = this._changeNeedsClient.bind(this);
            this.showMessageChangeClientNeed = this.showMessageChangeClientNeed.bind(this);
            this._cleanFieldsOfClientNeed = this._cleanFieldsOfClientNeed.bind(this);
            this._closeCancelConfirmChanNeed = this._closeCancelConfirmChanNeed.bind(this);
            this._closeConfirmChangeNeed = this._closeConfirmChangeNeed.bind(this);
            this._getNeedById = this._getNeedById.bind(this);
            this._validateShowFinancingNeedFields = this._validateShowFinancingNeedFields.bind(this);
            this._nameDisbursementPlansInReducer = this._nameDisbursementPlansInReducer.bind(this);
            this._handleBlurValueNumber = this._handleBlurValueNumber.bind(this);
            this._showBusinessCategory2 = this._showBusinessCategory2.bind(this);
            this._onChangeBusinessCategory2 = this._onChangeBusinessCategory2.bind(this);
            this._showLoadBusinessCategory2 = this._showLoadBusinessCategory2.bind(this);
        }

        showFormDisbursementPlan(isOpen) {
            this.setState({
                showFormAddDisbursementPlan: isOpen,
                disbursementPlanRequired: false
            });
        }

        showAlertDisabledCurrency(isEditableValue) {
            this.setState({ showAlertCurrency: !isEditableValue });
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
            const { pdfDescarga, params: { id }, changeStateSaveData } = this.props;
            pdfDescarga(changeStateSaveData, id);
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

            let lugarSelector = $('.valueMillions');
            let input = lugarSelector.find("input");
            input.focus();
        }

        _handleTermInMonths(valuReduxForm, val) {
            //Elimino los caracteres no validos
            for (let i = 0, output = '', validos = "0123456789"; i < (val + "").length; i++) {
                if (validos.indexOf(val.toString().charAt(i)) !== -1) {
                    output += val.toString().charAt(i)
                }
            }

            valuReduxForm.onChange(output);
        }


        _handleBlurValueNumber(valuReduxForm, val) {
            //Elimino los caracteres no validos
            if (val !== null && val !== '' && val !== undefined) {
                for (var i = 0, output = '', validos = "0123456789."; i < val.length; i++) {
                    if (validos.indexOf(val.charAt(i)) !== -1) {
                        output += val.charAt(i)
                    }
                }
                val = output;
                valuReduxForm.onChange(val);
            }
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
            const { selectsReducer, fields: { probability, pipelineType } } = this.props;
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

            this._pipelineTypeAndBusinessOnChange(pipelineType.value);
        }

        setValueToState = (args) => {
            this.setState(args);
        }
        _changeProductFamily(currencyValue) {
            const { fields: { areaAssets, productFamily, product, businessCategory }, pipelineReducer, dispatchChildren } = this.props;   
            GetChildCatalogs(currencyValue, dispatchChildren, this.setValueToState);
            
            if (!this.state.flagInitLoadAssests) {
                areaAssets.onChange('');
            }             
            
            if (!_.isEqual(pipelineReducer.get('detailPipeline').productFamily, productFamily.value)) {
                product.onChange('');
            }
            
            if (!_.isEqual(pipelineReducer.get('detailPipeline').productFamily, productFamily.value)) {
                businessCategory.onChange('');
            }
            this.showTypePolicy(currencyValue);
        }

        _changeAreaAssetsEnabledValue(value){
            this.setState({
                areaAssetsEnabled: value
              });
        }

        _changeProduct(value){                         
            const { fields: { productFamily }, selectsReducer, dispatchChildren } = this.props;
            GetChildCatalogs(value, dispatchChildren, this.setValueToState);
            let productFamilySelected = selectsReducer.get(ALL_PRODUCT_FAMILIES).find((family) => family.id == productFamily.value);
            let products = selectsReducer.get(PRODUCTS_MASK);
            let productSelected = products.find((product) => product.id == value);            
            if(productFamilySelected && productSelected){
              let productFamilySelectedKey = productFamilySelected.key ? productFamilySelected.key.toLowerCase() 
                : (productFamilySelected.value ? productFamilySelected.value.toLowerCase() : '');
              let productSelectedKey = productSelected.key ? productSelected.key.toLowerCase() 
                : (productSelected.value ? productSelected.value.toLowerCase() : '');
              if(productFamilySelectedKey === LEASING){
                switch (productSelectedKey) {
                  case FINANCIAL_LEASING:
                  case OPERATING_LEASE:
                  case IMPORTATION_LEASING:
                    this._changeAreaAssetsEnabledValue(true);
                    break;        
                  default:
                    this._changeAreaAssetsEnabledValue(false);
                    break;
                }
              }
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

        _onChangeBusinessCategory(val) {
            this.showInteresSpreadField(val);                                   
          }

        _onChangeBusinessCategory2(val){
            const { fields: { commission }, selectsReducer } = this.props;
            const businessCategories2 = selectsReducer.get(ALL_BUSINESS_CATEGORIES);
            const selectedBusinessCategory2 = businessCategories2.find((businessCategory2) => businessCategory2.id == val);
             keyBusinessCategory2 = selectedBusinessCategory2 ? selectedBusinessCategory2.key.toLowerCase() : '';
            if((keyBusinessCategory2 === PLACEMENTS || keyBusinessCategory2 === CATCHMENTS) || (keyBusinessCategory === PLACEMENTS || keyBusinessCategory === CATCHMENTS)){
                this.setState({
                    showInteresSpread: true
                });
            }else{
                this.setState({
                    showInteresSpread: false
                });
                commission.onChange("");
            }

            this.setState({
                messageTooltipNominalValue: _.get(_.find(businessCategories2, ['id', parseInt(val)]), 'description')
            });
        }

        showTypePolicy(val) {
            const { fields: { typePolicy, margen }, selectsReducer } = this.props;
            let productFamilySelected = selectsReducer.get(ALL_PRODUCT_FAMILIES).find((family) => family.id == val);
            const keyProductFamily = productFamilySelected ? productFamilySelected.key.toLowerCase() : '';
            if(keyProductFamily === PRODUCT_FAMILY_LEASING.toLowerCase()){
                this.setState({
                    showPolicyType: true
                });
            }else{
                this.setState({
                    showPolicyType: false
                });
                typePolicy.onChange("");
                margen.onChange("");

            }
        }

        showInteresSpreadField(businessCategoryValue){
            const { fields: { commission }, selectsReducer } = this.props; 
            const businessCategories = selectsReducer.get(ALL_BUSINESS_CATEGORIES);
            const selectedBusinessCategory = businessCategories.find((businessCategory) => businessCategory.id == businessCategoryValue);
            keyBusinessCategory = selectedBusinessCategory ? selectedBusinessCategory.key.toLowerCase() : '';
            if((keyBusinessCategory === PLACEMENTS || keyBusinessCategory === CATCHMENTS) || (keyBusinessCategory2 === PLACEMENTS || keyBusinessCategory2 === CATCHMENTS)){
                this.setState({
                    showInteresSpread: true
                });
            }else{
                this.setState({
                    showInteresSpread: false
                });
                commission.onChange("");
            }

            this.setState({
                messageTooltipNominalValue: _.get(_.find(businessCategories, ['id', parseInt(businessCategoryValue)]), 'description')                
            });
        }

        _pipelineTypeAndBusinessOnChange(value) {        
            const { fields: { businessStatus }, selectsReducer } = this.props;
            let businessStatusSelectedKey = null;
            let businessStatusSelected = null;
            let pipelineTypeSelectedKey = null;
            const pipelineTypes = selectsReducer.get(PIPELINE_TYPE);
            const pipelineTypeSelected = pipelineTypes.find((pipelineType) => pipelineType.id == value);            

            if (pipelineTypeSelected) {
                pipelineTypeSelectedKey = pipelineTypeSelected.key ? pipelineTypeSelected.key.toLowerCase() : '';
            }

            if (businessStatus.value) {
                businessStatusSelected = this._getBusinessStatusById(businessStatus.value);
                businessStatusSelectedKey = businessStatusSelected ? businessStatusSelected.key.toLowerCase() : '';
            }

            this._validateShowJustificationProbabilityAndMellowingPeriodFields(pipelineTypeSelectedKey, businessStatusSelectedKey);
            this.setPipelineStatusValues(pipelineTypeSelectedKey);
        }

        setPipelineStatusValues(pipelineTypeSelectedKey) {

            const { selectsReducer } = this.props; 
      
            if (pipelineTypeSelectedKey == NUEVO_NEGOCIO) {
              this.setState({ pipelineStatus : selectsReducer.get(PIPELINE_STATUS).filter(value => value.key.toLowerCase() != BUSINESS_STATUS_NO_CONTACTADO ) })
            } else {
              this.setState({ pipelineStatus: selectsReducer.get(PIPELINE_STATUS) })
            }
      
          }

        _getBusinessStatusById(id){
            const {selectsReducer} = this.props;
            const businessStatusList = selectsReducer.get(PIPELINE_STATUS);
            return businessStatusList.find((status) => status.id == id);
          }

        _validateShowJustificationProbabilityAndMellowingPeriodFields(pipelineTypeSelectedKey, businessStatusSelectedKey) {
            const { fields: {justification, justificationDetail} } = this.props;
            if(pipelineTypeSelectedKey === OPORTUNITIES_MANAGEMENT && (businessStatusSelectedKey === BUSINESS_STATUS_NO_CONTACTADO || businessStatusSelectedKey === BUSINESS_STATUS_PERDIDO)){
                this.setState({
                    showMellowingPeriodField: false,
                    showProbabilityField: false,
                    showJustificationField: true
                });
            } else {
                this.setState({
                    showMellowingPeriodField: true,
                    showProbabilityField: true,
                    showJustificationField: false
                });
                justification.onChange("");
                justificationDetail.onChange("");
            }
        }

        _showAlertFinancingAndPlan(isEditableValue) {
            this.setState({ showAlertFinancingAndPlan: isEditableValue });
        }

        _changeNeedsClient() {
            const { pipelineReducer, fields: { need }, selectsReducer, dispatchChildren } = this.props;
            let needSelectedKey = null;
            let needSelected = null;
            if(need.value != ''){
                needSelected = this._getNeedById(need.value);
                needSelectedKey = needSelected ? needSelected.key : '';
            }

            let newValueIsFinancing = needSelectedKey === NEED_FINANCING;

            if (!newValueIsFinancing && this.state.isFinancingNeed) {
                if(pipelineReducer.get(this._nameDisbursementPlansInReducer()).length > 0) {
                    this._showAlertFinancingAndPlan(true);
                    need.onChange(_.get(_.filter(selectsReducer.get(CLIENT_NEED), ['key', NEED_FINANCING]), '[0].id', ""));
                } else {
                    this.showMessageChangeClientNeed();
                }
            }

            if((newValueIsFinancing && !this.state.isFinancingNeed) || (!newValueIsFinancing && !this.state.isFinancingNeed)) {
                GetChildCatalogs(need.value, dispatchChildren, this.setValueToState);
                this.validateDetailPipeline();
            }

            if (newValueIsFinancing) {
                this.setState({isFinancingNeed: true});
                this._validateShowFinancingNeedFields(true);
            }
        }

        validateDetailPipeline = () => {
            const { fields: { need, productFamily }, pipelineReducer } = this.props;
              if (!_.isEqual(pipelineReducer.get('detailPipeline').need, need.value)) {
                productFamily.onChange('');
              }
        }

        showMessageChangeClientNeed() {
            titleMessage = "Necesidad "+NEED_FINANCING;

            message = `Señor usuario, si cambia la ${PIPELINE_NEED_CLIENT}, la información diligenciada en los campos ${PIPELINE_INDEXING_FIELD}, ${PIPELINE_PENDING_DISBURSEMENT_AMOUNT},
            y ${PIPELINE_TERM_IN_MONTHS_AND_VALUES} se borrarán\n\n¿Está seguro que desea cambiar la ${PIPELINE_NEED_CLIENT}?`

            this.setState({
                showConfirmChangeNeed: true
            });
        }

        _cleanFieldsOfClientNeed() {
            const { fields: { termInMonths, termInMonthsValues, indexing, pendingDisbursementAmount } } = this.props;
            termInMonths.onChange('');
            termInMonthsValues.onChange('');
            indexing.onChange('');
            pendingDisbursementAmount.onChange('');
        }

        _closeCancelConfirmChanNeed() {
            const {selectsReducer, fields: {need}} = this.props;
            need.onChange(_.get(_.filter(selectsReducer.get(CLIENT_NEED), ['key', NEED_FINANCING]), '[0].id', ""));
            this.setState({
                showConfirmChangeNeed: false
            });
        }

        _closeConfirmChangeNeed() {
            const {fields: { need }, dispatchChildren} = this.props;
            GetChildCatalogs(need.value, dispatchChildren, this.setValueToState);
            this._validateShowFinancingNeedFields(false);
            this.setState({
                showConfirmChangeNeed: false,
                isFinancingNeed: false
            });
            this.validateDetailPipeline();
            this._cleanFieldsOfClientNeed();
        }

        _getNeedById(id){
            const {selectsReducer} = this.props;
            const needList = selectsReducer.get(CLIENT_NEED);
            return needList.find((need) => need.id == id);
        }

        _validateShowFinancingNeedFields(isFinancingNeed){
            this.setState({
                showtermInMonthsField: isFinancingNeed,
                showindexingField: isFinancingNeed,
                showpendingDisbursementAmountField: isFinancingNeed,
                showComponentDisbursementPlan: isFinancingNeed
            });
        }

        _submitEditPipeline() {
            const { fields: {
                idUsuario, value, commission, roe, sva, termInMonths, businessStatus, businessCategory, currency, indexing, need, observations, product,
                moneyDistribitionMarket, nameUsuario, probability, opportunityName, productFamily, mellowingPeriod, areaAssets,
                termInMonthsValues, pendingDisbursementAmount, pipelineType, commercialOportunity, justification,  typePolicy, margen, justificationDetail,
                businessCategory2, nominalValue2
            }, createEditPipeline, changeStateSaveData, swtShowMessage, pipelineBusinessReducer, pipelineReducer, usersPermission, confidentialReducer
            } = this.props;

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
                            "roe": roe.value === undefined || roe.value === null || roe.value === '' ? '' : numeral(roe.value).format('0.00'),
                            "sva": sva.value === undefined || sva.value === null || sva.value === '' ? '' : numeral(sva.value).format('0.00'),
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
                            "disbursementPlans": listDisburmentPlans,
                            "commercialReport": buildJsoncommercialReport(this.state.commercialReport, usersPermission.toArray(), confidentialReducer.get('confidential'), typeButtonClick),
                            "pipelineType": pipelineType.value,
                            "commercialOportunity": commercialOportunity.value,
                            "justification": justification.value,
                            "margin": margen.value === undefined || margen.value === null || margen.value === '' ? '' : numeral(margen.value).format('0.00'),
                            "policyType": typePolicy.value ? typePolicy.value : "",
                            "justificationDetail": justificationDetail.value ? justificationDetail.value : "",
                            "businessCategory2": businessCategory2.value,
                            "nominalValue2": nominalValue2.value === undefined || nominalValue2.value === null || nominalValue2.value === '' ? '' : numeral(nominalValue2.value).format('0.00'),

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
                                        errorResponse.forEach(function (element) {
                                            if (element.fieldName == "observations") {
                                                observations.error = element.message;
                                                let oValue = observations.value;
                                                observations.onChange(oValue);
                                                message = "Señor usuario, los datos enviados contienen caracteres invalidos que deben ser corregidos.";
                                            } 
                                        });

                                        this.setState({ showMessageEditPipeline: true });
                                    }
                                }
                            }, () => {
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

        _editPipeline() {
            this.setState({
                isEditable: !this.state.isEditable
            });
        }

        _consultInfoPipeline(data) {
            const {
                fields: { businessStatus, commission, currency, idUsuario, nameUsuario, indexing, need, observations, product, roe, sva, moneyDistribitionMarket,
                    termInMonths, value, client, documentStatus, createdBy, updatedBy, createdTimestamp, updatedTimestamp, createdByName, updatedByName, positionCreatedBy,
                    positionUpdatedBy, reviewedDate, probability, businessCategory, opportunityName, productFamily, mellowingPeriod, areaAssets,
                    termInMonthsValues, pendingDisbursementAmount, pipelineType, commercialOportunity, justification, typePolicy, margen, justificationDetail
                }, updateDisbursementPlans
            } = this.props;                        
            updateDisbursementPlans(data.disbursementPlans, origin);
            this.setState({ flagInitLoadAssests: true, commercialReport: data.commercialReport });                                                                                                 
            pipelineType.onChange(data.pipelineType);  
            commercialOportunity.onChange(data.commercialOportunity);   
            opportunityName.onChange(data.opportunityName);
            need.onChange(data.need);   
            productFamily.onChange(data.productFamily);                     
            commission.onChange(fomatInitialStateNumber(data.commission));            
            businessStatus.onChange(data.businessStatus); 
            justification.onChange(data.justification);                           
            idUsuario.onChange(data.employeeResponsible);
            nameUsuario.onChange(data.employeeResponsibleName);
            mellowingPeriod.onChange(data.mellowingPeriod);
            moneyDistribitionMarket.onChange(data.moneyDistribitionMarket);
            probability.onChange(data.probability);        
            indexing.onChange(data.indexing);                                 
            roe.onChange(fomatInitialStateNumber(data.roe));
            currency.onChange(data.currency);
            value.onChange(fomatInitialStateNumber(data.value));
            pendingDisbursementAmount.onChange(fomatInitialStateNumber(data.pendingDisbursementAmount));            
            termInMonths.onChange(data.termInMonths);
            termInMonthsValues.onChange(data.termInMonthsValues);            
            areaAssets.onChange(data.areaAssets);
            observations.onChange(data.observations === null ? '' : data.observations);                                    
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
            businessCategory.onChange(data.businessCategory);      
            product.onChange(data.product);
            margen.onChange(fomatInitialStateNumber(data.margin));
            sva.onChange(data.sva);
            typePolicy.onChange(data.policyType);
            justificationDetail.onChange(data.justificationDetail);
            this._showLoadBusinessCategory2(data.businessCategory2, data.nominalValue2);
        }


        _showLoadBusinessCategory2(businessCategory2Value, nominalValue2Value){
            const {fields:{ businessCategory2, nominalValue2 }} = this.props;
            if(businessCategory2Value !== null){
                this.setState({
                    showBusinessCategory2: true
                });
                businessCategory2.onChange(businessCategory2Value);
                nominalValue2.onChange(fomatInitialStateNumber(nominalValue2Value));
            }
        }

        componentWillMount() {
            const {
                clientInformacion, getMasterDataFields, getClientNeeds, getPipelineById, nonValidateEnter, addBusiness, clearBusiness,
                showLoading, swtShowMessage, consultDataSelect, setConfidential, addUsers
            } = this.props;

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
            getClientNeeds();
            if (_.isEmpty(infoClient)) {
                redirectUrl("/dashboard/clientInformation");
            } else {
                showLoading(true, 'Cargando...');   
                
                Promise.all([consultDataSelect(PRODUCT_FAMILY, ALL_PRODUCT_FAMILIES), consultDataSelect(BUSINESS_CATEGORY, ALL_BUSINESS_CATEGORIES),
                    getMasterDataFields([PIPELINE_STATUS, PIPELINE_INDEXING, PIPELINE_PRIORITY, FILTER_COUNTRY, PIPELINE_BUSINESS,
                        PROBABILITY, LINE_OF_BUSINESS, MELLOWING_PERIOD,
                        FILTER_MONEY_DISTRIBITION_MARKET, FILTER_ACTIVE, TERM_IN_MONTHS_VALUES, CURRENCY, PIPELINE_TYPE, COMMERCIAL_OPORTUNITY,
                        PIPELINE_JUSTIFICATION, CLIENT_NEED, FILTER_TYPE_POLICY])]).then(() => {
                            if (origin !== ORIGIN_PIPELIN_BUSINESS) {                            
                                const { params: { id } } = this.props;
                                getPipelineById(id).then((result) => {
                                    if (!validateResponse(result)) {
                                        swtShowMessage(MESSAGE_ERROR, TITLE_ERROR_SWEET_ALERT, MESSAGE_ERROR_SWEET_ALERT);
                                    } else {
                                        let data = result.payload.data.data;
                                        _.forIn(data.listPipelines, function (pipeline) {
                                            const uuid = _.uniqueId('pipelineBusiness_');
                                            pipeline.uuid = uuid;
                                            addBusiness(pipeline);
                                        });
                                        if (data.commercialReport) {
                                            setConfidential(data.commercialReport.isConfidential);
                                            fillUsersPermissions(data.commercialReport.usersWithPermission, addUsers);
                                        }                                    
                                        this._consultInfoPipeline(data);                                    
                                    }
                                    showLoading(false, null);         
                                });
                            } else {
                                showLoading(false, null);
                            }
                        });
            }
        }

        componentDidMount() {                                
            if (pipelineBusiness !== null && pipelineBusiness !== undefined && pipelineBusiness !== '') {
                this._consultInfoPipeline(pipelineBusiness);
            }
        }

        componentDidUpdate() {
            if (origin === ORIGIN_PIPELIN_BUSINESS && this.state.firstTimeCharging === false) {
                this.modalScrollArea.scrollTop = 0;
                this.setState({
                    firstTimeCharging: true
                });
            }
        }

        _showBusinessCategory2(value){
            const {fields:{businessCategory2, nominalValue2}} = this.props;
            if(value){
                this.setState({
                    showBusinessCategory2: true
                })
            }else {
                this.setState({
                    showBusinessCategory2: false
                });
                this._onChangeBusinessCategory2("");
                businessCategory2.onChange("");
                nominalValue2.onChange("");
            }
        }

        renderNominalValue() {
            const { pipelineReducer } = this.props;
            const isEditableValue = _.size(pipelineReducer.get(this._nameDisbursementPlansInReducer())) > 0 || this.state.showFormAddDisbursementPlan ? false : true;
        }

        _nameDisbursementPlansInReducer() {
            return (origin === ORIGIN_PIPELIN_BUSINESS) ? 'childBusinessDisbursementPlans': 'disbursementPlans';
        }

        render() {
            const {
                fields: { nameUsuario, idUsuario, value, commission, roe, sva, termInMonths, businessStatus, businessCategory, currency, indexing, need, observations, product,
                    moneyDistribitionMarket, pendingDisbursementAmount, updatedBy, createdTimestamp, updatedTimestamp, createdByName, updatedByName, reviewedDate, positionCreatedBy,
                    positionUpdatedBy, probability, amountDisbursed, estimatedDisburDate, opportunityName, productFamily, mellowingPeriod, areaAssets, 
                    termInMonthsValues, pipelineType, commercialOportunity, justification,  typePolicy, margen, justificationDetail, businessCategory2, nominalValue2
                }, selectsReducer, handleSubmit, pipelineReducer, reducerGlobal
            } = this.props;            
            const ownerDraft = pipelineReducer.get('ownerDraft');
            const isEditableValue = _.size(pipelineReducer.get(this._nameDisbursementPlansInReducer())) > 0 || this.state.showFormAddDisbursementPlan ? false : true;
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
                    {origin !== ORIGIN_PIPELIN_BUSINESS && <ReportsHeader/>}
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
                            {origin !== ORIGIN_PIPELIN_BUSINESS && <Row style={{ padding: "5px 10px 20px 20px" }}>
                                <Col xs={12} md={12} lg={12}>
                                    <PermissionUserReports disabled={this.state.isEditable ? '' : 'disabled'} />
                                </Col>
                            </Row>}
                            
                                <Classification
                                    pipelineType={pipelineType}
                                    commercialOportunity={commercialOportunity}
                                    isChildren={origin === ORIGIN_PIPELIN_BUSINESS}
                                    disabled={!this.state.isEditable}
                                    pipelineTypeName={pipelineTypeName}
                                    commercialOportunityName={commercialOportunityName}
                                    pipelineTypeOnChange={this._pipelineTypeAndBusinessOnChange}
                                />
                            
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
                                        <span style={{ fontSize: "20px" }}> Pipeline</span>
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
                                            id="nameNeed"
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...need}
                                            name={nameNeed}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(CLIENT_NEED) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onChange={this._changeNeedsClient}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            data={this.state.productsFamily}
                                            onChange={val => this._changeProductFamily(val)}
                                            filterData={true}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                        <span>Producto</span> (<span style={{ color: "red" }}>*</span>)
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
                                            onChange={val => this._changeProduct(val)}
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
                                            data={this.state.businessCategories || selectsReducer.get(ALL_BUSINESS_CATEGORIES)}
                                            onChange={key => this._onChangeBusinessCategory(key)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            filterData={true}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Moneda (</span><span style={{ color: "red" }}>*</span>)
                                        </dt>
                                        <div onClick={() => this.showAlertDisabledCurrency(isEditableValue)} >
                                            <ComboBox
                                                labelInput="Seleccione..."
                                                valueProp={'id'}
                                                textProp={'value'}
                                                {...currency}
                                                name={nameCurrency}
                                                parentId="dashboardComponentScroll"
                                                data={selectsReducer.get(CURRENCY) || []}
                                                disabled={this.state.isEditable && isEditableValue ? '' : 'disabled'}
                                                onChange={val => this._changeCurrency(val)}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Valor nominal (</span>
                                            <span style={{ color: "red" }}>*</span>)
                                        </dt>
                                        <ToolTip text={this.state.messageTooltipNominalValue} rendertooltip={this.state.messageTooltipNominalValue}>
                                            <div onClick={ () => this.showAlertDisabledCurrency(isEditableValue) } >
                                                <Input
                                                    {...value}
                                                    name="valueMillions"
                                                    type="text"
                                                    placeholder="Miles ' , ' y decimales ' . '"
                                                    parentId="dashboardComponentScroll"
                                                    onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, value, val, true, 2)}
                                                    onFocus={val => handleFocusValueNumber(value, value.value)}
                                                    disabled={this.state.isEditable && isEditableValue ? '' : 'disabled'}
                                                    onChange={val => this._changeValue(val)
                                                    }
                                                />
                                            </div>
                                        </ToolTip>
                                    </div>
                                </Col>
                                <Col xs={6} md={3} lg={3}>
                                    <ToolTip text='Agregar categoría del negocio 2 / Valor nominal 2' rendertooltip='Agregar categoría del negocio 2 / Valor nominal 2'>
                                        <button className="btn btn-primary" type="button"  id="addCategory" style={{ marginTop: '18px' }} onClick={() => this._showBusinessCategory2(true)}
                                                disabled={this.state.isEditable ? '' : 'disabled'}>
                                            <i className="plus icon"/> Categoría del negocio
                                        </button>
                                    </ToolTip>
                                </Col>
                            </Row>
                            {this.state.showBusinessCategory2 ?
                                <Row style={{padding: "0px 10px 20px 20px"}}>
                                    <Col xs={6} md={3} lg={3}>
                                        <div style={{ paddingRight: "15px" }}>
                                            <dt>
                                                <span>Categoría del negocio 2 </span>
                                            </dt>
                                            <ComboBox
                                                labelInput="Seleccione..."
                                                valueProp={'id'}
                                                textProp={'value'}
                                                {...businessCategory2}
                                                name={nameBusinessCategory2}
                                                parentId="dashboardComponentScroll"
                                                data={this.state.businessCategories2 || selectsReducer.get(ALL_BUSINESS_CATEGORIES)}
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                                onChange={key => this._onChangeBusinessCategory2(key)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={6} md={3} lg={3}>
                                        <div style={{ paddingRight: "15px" }}>
                                            <dt>
                                                <span>Valor nominal 2 </span>
                                            </dt>
                                            <ToolTip text={this.state.messageTooltipNominalValue} rendertooltip={this.state.messageTooltipNominalValue}>
                                                <div onClick={ () => this.showAlertDisabledCurrency(isEditableValue) } >
                                                    <Input
                                                        {...nominalValue2}
                                                        name="valueMillions"
                                                        type="text"
                                                        placeholder="Miles ' , ' y decimales ' . '"
                                                        parentId="dashboardComponentScroll"
                                                        onBlur={val => handleBlurValueNumber(ONLY_POSITIVE_INTEGER, nominalValue2, val, true, 2)}
                                                        onFocus={val => handleFocusValueNumber(nominalValue2, nominalValue2.value)}
                                                        disabled={this.state.isEditable && isEditableValue ? '' : 'disabled'}
                                                    />
                                                </div>
                                            </ToolTip>
                                        </div>
                                    </Col>
                                    <Col xs={6} md={3} lg={3}>
                                        <ToolTip text='Eliminar categoría del negocio 2 / Valor nominal 2' rendertooltip='Eliminar categoría del negocio 2 / Valor nominal 2'>
                                            <button className="btn btn-secondary" type="button" style={{ marginTop: '18px' , backgroundColor: "rgb(193, 193, 193)" , padding: "4x"  }}
                                                    onClick={() => this._showBusinessCategory2(false)}
                                                    disabled={this.state.isEditable ? '' : 'disabled'}>
                                                <i className="delete icon"/>
                                            </button>
                                        </ToolTip>
                                    </Col>
                                </Row>
                                : null }
                            {this.state.showJustificationField ?
                                <Row style={{padding: "0px 10px 20px 20px"}}>
                                    <Col xs={12} md={6} lg={6}>
                                        <div style={{paddingRight: "15px"}}>
                                            <dt>
                                                <span>Justificación (</span><span style={{color: "red"}}>*</span>)
                                            </dt>
                                            <ComboBox
                                                labelInput="Seleccione..."
                                                valueProp={'id'}
                                                textProp={'value'}
                                                {...justification}
                                                name={nameJustificationPipeline}
                                                parentId="dashboardComponentScroll"
                                                data={selectsReducer.get(PIPELINE_JUSTIFICATION) || []}
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                : null}
                            {this.state.showJustificationField ?
                                <Row style={{padding: "0px 10px 20px 20px"}}>
                                    <Col xs={12} md={6} lg={6}>
                                        <div style={{paddingRight: "15px"}}>
                                            <dt>
                                                <span>Detalle justificación </span>
                                            </dt>
                                            <TextareaComponent
                                                name="txtJustificationDetail"
                                                type="text"
                                                {...justificationDetail}
                                                parentId="dashboardComponentScroll"
                                                rows={4}
                                                style={{ width: '100%', height: '100%' }}
                                                disabled={this.state.isEditable ? '' : 'disabled'}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                : null}
                            <Row style={{ padding: "0px 10px 20px 20px" }}>
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Estado del negocio (</span><span style={{color: "red"}}>*</span>)
                                        </dt>
                                        <ComboBox
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...businessStatus}
                                            name={nameBusinessStatus}
                                            parentId="dashboardComponentScroll"
                                            data={this.state.pipelineStatus || selectsReducer.get(PIPELINE_STATUS) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onChange={val => this._changeBusinessStatus(val)}
                                            filterData={true}
                                        />
                                    </div>
                                </Col>
                            {this.state.showMellowingPeriodField ?
                                    <Col xs={12} md={6} lg={6}>
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
                                    : null}
                            </Row>
                                {this.state.showProbabilityField ?
                            <Row style={{ padding: "0px 10px 20px 20px" }}>
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
                                    : null}
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
                                {this.state.showindexingField ?
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
                                : null}
                                {this.state.showInteresSpread ?
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Interés/Spread</span>
                                        </dt>
                                        <Input
                                            name="commission"
                                            type="text"
                                            {...commission}
                                            parentId="dashboardComponentScroll"
                                            placeholder="Miles ' , ' y decimales ' . '"
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                            onBlur={val => handleBlurValueNumber(2, commission, val, true)}
                                            onFocus={val => handleFocusValueNumber(commission, commission.value)}
                                        />
                                    </div>
                                </Col>
                                :null}
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
                                            max="6"
                                            placeholder="Ingresa el valor sin el %. Ejm ROE 30"
                                            onBlur={val => this._handleBlurValueNumber(roe, val)}
                                            onFocus={val => handleFocusValueNumber(roe, roe.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                {this.state.showPolicyType &&
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>Margen</span>
                                        </dt>
                                        <Input
                                            name="margen"
                                            type="text"
                                            {...margen}
                                            parentId="dashboardComponentScroll"
                                            max="6"
                                            placeholder="Ingresa el valor sin el %."
                                            onBlur={val =>  this._handleBlurValueNumber(margen, val)}
                                            onFocus={val => handleFocusValueNumber(margen, margen.value)}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                }
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{ paddingRight: "15px" }}>
                                        <dt>
                                            <span>SVA</span>
                                        </dt>
                                        <ToolTip text={HELP_SVA}>
                                            <div>
                                                <Input
                                                  {...sva}
                                                  name="sva"
                                                  type="text"
                                                  placeholder="Miles ' , ' y decimales ' . '"
                                                  parentId="dashboardComponentScroll"
                                                  onBlur={val => handleBlurValueNumber(ALLOWS_NEGATIVE_INTEGER, sva, val, true, 2)}
                                                  onFocus={val => handleFocusValueNumber(sva, sva.value)}
                                                  disabled={this.state.isEditable ? '' : 'disabled'}/>
                                            </div>
                                        </ToolTip>
                                    </div>
                                </Col>
                                </Row>
                            <Row style={{ padding: "0px 10px 20px 20px" }}>
                                {this.state.showpendingDisbursementAmountField ?
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
                                : null}
                                {this.state.showtermInMonthsField ?
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
                                : null}
                                {this.state.areaAssetsEnabled ?
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
                                                disabled={this.state.isEditable ? '' : 'disabled'}                                         
                                            />
                                        </div>
                                    </Col>
                                : null}
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
                                            disabled={this.state.isEditable ? '' : 'disabled'}
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
                                {this.state.showPolicyType &&
                                <Col xs={6} md={3} lg={3}>
                                    <div style={{paddingRight: "15px"}}>
                                        <dt>
                                            <span>Tipo de póliza</span>
                                        </dt>
                                        <ComboBox
                                            id={"typePolicy"}
                                            labelInput="Seleccione..."
                                            valueProp={'id'}
                                            textProp={'value'}
                                            {...typePolicy}
                                            name={nameTypePolicy}
                                            parentId="dashboardComponentScroll"
                                            data={selectsReducer.get(FILTER_TYPE_POLICY) || []}
                                            disabled={this.state.isEditable ? '' : 'disabled'}
                                        />
                                    </div>
                                </Col>
                                }
                            </Row>
                            {this.state.showComponentDisbursementPlan ?
                            <ComponentDisbursementPlan
                                disbursementAmount={amountDisbursed} estimatedDisburDate={estimatedDisburDate}
                                fnShowForm={this.showFormDisbursementPlan} registrationRequired={this.state.disbursementPlanRequired}
                                showFormDisbursementPlan={this.state.showFormAddDisbursementPlan} nominalValue={value}
                                isEditable={this.state.isEditable} pendingDisbursementAmount={pendingDisbursementAmount}
                                origin={origin} />
                            : null}
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
                            background: "rgba(255,255,255,0.75)",
                            zIndex: 999
                        } : { display: "none" }}>
                            <div style={{ width: "580px", height: "100%", position: "fixed", right: "0px" }}>
                                <button className="btn" type="submit" onClick={() => { setGlobalCondition(null); typeButtonClick = SAVE_DRAFT; }}
                                    style={this.state.isEditable === true && ownerDraft === 0 ? {
                                        float: "right",
                                        margin: "8px 0px 0px -120px",
                                        position: "fixed",
                                        backgroundColor: "#00B5AD"
                                    } : { display: "none" }}>
                                    <span style={{ color: "#FFFFFF", padding: "10px" }}>Guardar como borrador</span>
                                </button>
                                <button className="btn" type="submit" onClick={() => { setGlobalCondition(SAVE_PUBLISHED); typeButtonClick = SAVE_PUBLISHED; }}
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
                          type="warning"
                          show={this.state.showConfirmChangeNeed}
                          title={titleMessage}
                          text={message}
                          confirmButtonColor='#DD6B55'
                          confirmButtonText='Sí, estoy seguro!'
                          cancelButtonText="Cancelar"
                          showCancelButton={true}
                          onCancel={this._closeCancelConfirmChanNeed}
                          onConfirm={this._closeConfirmChangeNeed}
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
                        <SweetAlert
                          type="warning"
                          show={this.state.showAlertFinancingAndPlan}
                          title='Advertencia'
                          text={PIPELINE_DISBURSEMENT_PLAN_MESSAGE}
                          onConfirm={() => this.setState({ showAlertFinancingAndPlan: false })}
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
            consultListByCatalogType,
            consultDataSelect,
            addUsers,
            setConfidential,
            dispatchChildren: dispatchChildCatalogs
        }, dispatch);
    }

    function mapStateToProps({ clientInformacion, selectsReducer, contactsByClient, pipelineReducer, reducerGlobal, navBar, pipelineBusinessReducer, usersPermission, confidentialReducer }, pathParameter) {
        return {
            clientInformacion,
            selectsReducer,
            contactsByClient,
            pipelineReducer,
            pdfDescarga,
            consultParameterServer,
            reducerGlobal,
            navBar,
            pipelineBusinessReducer,
            usersPermission,
            confidentialReducer
        };
    }

    function fomatInitialStateNumber(val, numDecimals) {
        let decimal = '';
        if (val !== undefined && val !== null && val !== '') {
            val = val.toString();
            if (val.includes(".")) {
                let vectorVal = val.split(".");
                val = vectorVal[0] + '.';
                if (vectorVal.length > 1) {
                    let numDec = (numDecimals == undefined || numDecimals == null) ? 4 : numDecimals;
                    decimal = vectorVal[1].substring(0, numDec);
                }
            }
            let pattern = /(-?\d+)(\d{3})/;
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
        overwriteOnInitialValuesChange: false
    }, mapStateToProps, mapDispatchToProps)(FormEditPipeline);
}