import _ from "lodash";

import numeral from "numeral";

import { htmlToText } from './../actionsGlobal';
import {
    OTHER, EXCLIENT, RESPONSE_INFO, MARK_GEREN, BUTTON_EDIT,
    PERMISSIONSCLIENTS,
    INFO_CREDIT_STUDY,
    CLIENT_OPERATION_FOREIGN_CURRENCY,
    OTHERS_OPERATIONS,
    DATA_CIUU, CLIENT_ORIGIN_RESOURCES,
    CLIENT_ORIGIN_GOODS
} from './../constantsGlobal';
import {
    patternOfOnlyAlphabetical, patternOfNumberDocument, patternOfObservation, patternOfAddress, patternOfNeighborhood,
    patternOfPostalCode, patternOfPhone, patternOfOnlyNumbers, patternOfContactRelevantFeatures,
    patternOfStructureEmail, patternOfHistory, patternOfClientName, patternOfDescription, patternOfEmail,
    patternOfClientAddress, patternOfClientNeighborhood, patternOfObservationLinkClient, regexNumbers,
    patternOfForbiddenCharacter, patternOfOpportunityName, patternOfNameOtherParticipant, patternOfPositionOtherParticipant,
    patternOfCompanyOtherParticipant, patternDecimalNumbers, patternOfPlaceOfPrevisit, patternOtherReason, patternOfContextClient,
    patternOfInventoryPolice, patternOfControlLinkedPayments, patternOfNameEntity, patternOfNoOperatingInCome,
    patternOfOnlyAlphabeticalAndSlash, patternOfRiskGroupName, patternOfObservationRiskGroup, patternOfJustificationsRiskGroup,
    patternOfRiskExternalClientName, patternOfExternalClientNumberDocument, patternOfTaskObservation, patternOfOriginCityResources, regexHtmlInjection
} from './patternsToValidateField';

import {
    MESSAGE_REQUIRED_VALUE,
    MESSAGE_WARNING_ONLY_ALPHABETICAL,
    MESSAGE_WARNING_MIN_LENGTH,
    MESSAGE_WARNING_MAX_LENGTH,
    MESSAGE_WARNING_OBSERVATIONS,
    MESSAGE_WARNING_HISTORY,
    MESSAGE_WARNING_NUMBER_DOCUMENT,
    MESSAGE_WARNING_NEIGHBORHOOD,
    MESSAGE_WARNING_POSTAL_CODE,
    MESSAGE_WARNING_PHONE,
    MESSAGE_WARNING_ONLY_NUMBERS,
    MESSAGE_WARNING_INVALID_EMAIL,
    MESSAGE_WARNING_RELEVANT_FEATURES,
    MESSAGE_WARNING_ADDRESS,
    MESSAGE_WARNING_OPPORTUNITY_NAME,
    MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT,
    MESSAGE_WARNING_CLIENT_NAME,
    MESSAGE_WARNING_NAME_OTHER_PARTICIPANT,
    MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT,
    MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT,
    MESSAGE_WARNING_PLACE_OF_PREVISIT,
    MESSAGE_WARNING_RANGE,
    MESSAGE_WARNING_FORBIDDEN_CHARACTER,
    MESSAGE_WARNING_NUMBER_LENGTH,
    MESSAGE_WARNING_OTHER_REASON,
    MESSAGE_WARNING_NAME_ENTITY,
    MESSAGE_WARNING_NO_OPERATING_IN_COME,
    MESSAGE_WARNING_ONLY_ALPHABETICAL_AND_SLASH,
    MESSAGE_WARNING_GROUP_NAME,
    MESSAGE_WARNING_OBSERVATIONS_RISK_GROUP,
    MESSAGE_WARNING_JUSTIFICATIONS_RISK_GROUP,
    MESSAGE_WARNING_EXTERNAL_CLIENT_NAME,
    MESSAGE_WARNING_EXTERNAL_NUMBER_DOCUMENT,
    MESSAGE_REQUIRED_EMPLOYEE,
    MESSAGE_WARNING_TASK_OBSERVATIONS,
    MESSAGE_WARNING_ORIGIN_CITY_RESOURCES,
    MESSAGE_ERROR_INJECTION_HTML

} from './validationsMessages';

import {
    SEGMENTS, REASON_TRANFER, MANAGEMENT_BRAND, SUBSEGMENTS, PIPELINE_TYPE, PRODUCTS, CLIENT_NEED
} from '../components/selectsComponent/constants';

import { PIPELINE_STATUS, OPORTUNITIES_MANAGEMENT, BUSINESS_STATUS_PERDIDO, BUSINESS_STATUS_NO_CONTACTADO,
    FACTORING_BANCOLOMBIA_CONFIRMING, FACTORING_PLUS, TRIANGULAR_LINE, NEED_FINANCING } from "../components/pipeline/constants";

let globalCondition = false;
export const setGlobalCondition = value => {
    globalCondition = value;
};

export const processRules = (formFields, fieldsWithRules, props) => {
    const errors = {};
    _.mapKeys(formFields, function (value, field) {
        if (!_.isEmpty(fieldsWithRules[field].rules)) {
            _.forEach(fieldsWithRules[field].rules, function (rule) {
                const message = rule(value, formFields, props);
                if (!_.isEmpty(message)) {
                    errors[field] = message;
                    return false;
                } else {
                    errors[field] = null;
                }
            });
        }
    });
    return errors;
}

export const checkRequired = value => (_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) ? MESSAGE_REQUIRED_VALUE : null;
export const checkRequiredWithGlobalCondition = value => globalCondition ? checkRequired(value) : null;

export const checkOnlyAlphabetical = (value) => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfOnlyAlphabetical.test(value)) {
        message = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    }

    return message;
}

export const checkRequiredResponsible = (value, fields) => {
    let message = null;
    let valueIdEmployee = fields.idEmployee;
    if(_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value) || _.toString(valueIdEmployee).length < 1) {
        message = MESSAGE_REQUIRED_VALUE;
    }
    return message;
}

const validSegments = {
    "constructor corporativo" : [ "grande" ],
    "constructor empresarial" : [ "mediana" ],
    "constructor pyme" : [ "pequeña", "mediana", "grande", "plus" ],
    "corporativo" : [ "pequeña", "mediana", "grande" ],
    "empresarial" : [ "pequeña", "mediana", "grande" ],
    "gobierno" : [ "grande" ],
    "instituciones financieras" : [ "grande" ]
}

function isSubsegmentValid(subsegmento, fields, props) {
    let segmentValue = _.get(_.find(props.selectsReducer.get(SEGMENTS), ['id', parseInt(fields.segment)]), 'value');
    
    if ( !segmentValue  || !subsegmento ) {
        return true;
    }

    const segments = validSegments[segmentValue.toLowerCase()];

    if (!segments) {
        return !subsegmento;
    }

    return segments.includes(subsegmento.toLowerCase());
}

export const checkForValidSubSegment = (value, fields, props) => {
    let message = null;
    let subsegmentoValue = _.get(_.find(props.selectsReducer.get(SUBSEGMENTS), ['id', parseInt(value)]), 'value');
    
    if (!isSubsegmentValid(subsegmentoValue, fields, props)) {
        message = "El subsegmento seleccionado no es válido para el segmento";
    }
    
    return message;
}

export const checkForValueIdSubCiiuEditClient = (value, fields, props) => {
    let message = null;
    let idCiiuValue = props.selectsReducer.get(DATA_CIUU);
    let isEditButton = props.idButton;
    if ((!_.isEmpty(idCiiuValue) || !_.isNull(idCiiuValue) || !_.isUndefined(idCiiuValue)) && isEditButton !== BUTTON_EDIT) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }

    return message;
}


export const checkForValueReasonTransfer = (value, fields, props) => {
    let message = null;
    let reasonTransferValue = _.get(_.find(props.selectsReducer.get(REASON_TRANFER), ['id', parseInt(fields.reasonTranfer)]), 'value');
    if (_.isEqual(OTHER, reasonTransferValue)) {
        if (_.isNull(value) || _.isEmpty(value)) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueJustifyNoGeren = (value, fields, props) => {
    let message = null;
    let isExClientValue = props.clientInformacion.get(RESPONSE_INFO);
    let justifyNoGerenValue = _.get(_.find(props.selectsReducer.get(MANAGEMENT_BRAND), ['id', parseInt(fields.marcGeren)]), 'value');
    if (!_.isEqual(EXCLIENT, isExClientValue.relationshipStatusName) && _.isEqual(MARK_GEREN, justifyNoGerenValue)) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueJustifyNoGerenEditClient = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let justifyNoGerenValue = _.get(_.find(props.selectsReducer.get(MANAGEMENT_BRAND), ['id', parseInt(fields.marcGeren)]), 'value');
    if (isEditButton !== BUTTON_EDIT && _.isEqual(MARK_GEREN, justifyNoGerenValue)) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueJustifyNoLMEEditClient = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let justifyNoLMEValue = fields.necesitaLME;
    if (!(justifyNoLMEValue === "true") && isEditButton !== BUTTON_EDIT) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueJustifyNoLME = (value, fields, props) => {
    let message = null;
    let isExClientValue = props.clientInformacion.get(RESPONSE_INFO);
    let justifyNoLMEValue = fields.necesitaLME;
    if (!(justifyNoLMEValue === "true") && !_.isEqual(EXCLIENT, isExClientValue.relationshipStatusName)) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueOperationsForeigns = (value, fields, props) => {
    let message = null;
    let operationsForeigns = fields.operationsForeignCurrency;
    let isEditButton = props.idButton;
    if ((operationsForeigns === "true") && isEditButton !== BUTTON_EDIT) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkIsUpdateClient = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT) {
        message = MESSAGE_REQUIRED_VALUE;
    }

    return message;
}

export const checkEconomicGroup = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    if ((_.toString(fields.nitPrincipal).length < 1 || _.toString(fields.groupEconomic).length < 1 || _.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT) {
        message = MESSAGE_REQUIRED_VALUE;
    }

    return message;
}

export const checkOthersEnabledOriginResources = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let dataOriginResource = props.selectsReducer.get(CLIENT_ORIGIN_RESOURCES);
    let idOptionOther = _.get(_.filter(dataOriginResource, ['key', OTHERS_OPERATIONS]), '[0].id');
    let originField = _.split(fields.originResource, ',');
    if (_.includes(originField, String(idOptionOther))) {
        if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }

    return message;
}

export const checkOthersEnabledOriginGoods = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let dataOriginResource = props.selectsReducer.get(CLIENT_ORIGIN_GOODS);
    let idOptionOther = _.get(_.filter(dataOriginResource, ['key', OTHERS_OPERATIONS]), '[0].id');
    let originField = _.split(fields.originGoods, ',');
    if (_.includes(originField, String(idOptionOther))) {
        if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }

    return message;
}

export const checkOthersEnabledclientOperationsForeignCurrency = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let dataOriginResource = props.selectsReducer.get(CLIENT_OPERATION_FOREIGN_CURRENCY);
    let idOptionOther = _.get(_.filter(dataOriginResource, ['key', OTHERS_OPERATIONS]), '[0].id');
    let originField = _.split(fields.operationsForeigns, ',');
    if (_.includes(originField, String(idOptionOther))) {
        if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }

    return message;
}

export const checkdetailNonOperatingIncome = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;

    if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT && numeral(fields.nonOperatingIncome).format('0') > 0) {
        message = MESSAGE_REQUIRED_VALUE;
    }

    return message;
}

export const checkControlLinkedPaymentsRequired = (value, fields, props) => {
    let message = null;
    let isEditButton = props.idButton;
    let noApplied = props.clientInformacion.get('noAppliedControlLinkedPayments');
    let allowRiskGroupEdit = _.get(props.reducerGlobal.get(PERMISSIONSCLIENTS), _.indexOf(props.reducerGlobal.get(PERMISSIONSCLIENTS), INFO_CREDIT_STUDY), false);
    if ((_.isNull(value) || _.toString(value).length < 1 || _.isUndefined(value)) && isEditButton !== BUTTON_EDIT && allowRiskGroupEdit && !noApplied) {
        message = MESSAGE_REQUIRED_VALUE;
    }

    return message;
}



export const checkForValueIsExClient = (value, fields, props) => {
    let message = null;
    let isExClientValue = props.clientInformacion.get(RESPONSE_INFO);
    if (!_.isEqual(EXCLIENT, isExClientValue.relationshipStatusName)) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkForValueIsNotExClient = (value, fields, props) => {
    let message = null;
    let isExClientValue = props.clientInformacion.get(RESPONSE_INFO);
    if (_.isEqual(EXCLIENT, isExClientValue.relationshipStatusName)) {
        if (_.isNull(value) || _.isEmpty(String(value))) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }
    return message;
}

export const checkMinLength = minLength => value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && value.length > 0 && value.length < minLength) {
        message = MESSAGE_WARNING_MIN_LENGTH(minLength);
    }

    return message;
}

export const checkMaxLength = maxLength => value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && value.length > maxLength) {

        message = MESSAGE_WARNING_MAX_LENGTH(maxLength);
    }
    return message;
}

export const checkNumberDocument = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNumberDocument.test(value)) {
        message = MESSAGE_WARNING_NUMBER_DOCUMENT;
    }

    return message;
}

export const checkObservations = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfObservation.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkTaskObservation = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfTaskObservation.test(value)) {
        message = MESSAGE_WARNING_TASK_OBSERVATIONS;
    }
    return message;
}

export const checkAddress = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfAddress.test(value)) {
        message = MESSAGE_WARNING_ADDRESS;
    }

    return message;
}

export const checkOriginCityResources = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfOriginCityResources.test(value)) {
        message = MESSAGE_WARNING_ORIGIN_CITY_RESOURCES;
    }

    return message;
}

export const checkNeighborhood = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNeighborhood.test(value)) {
        message = MESSAGE_WARNING_NEIGHBORHOOD;
    }

    return message;
}

export const checkPostalCode = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfPostalCode.test(value)) {
        message = MESSAGE_WARNING_POSTAL_CODE;
    }

    return message;
}

export const checkPhone = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfPhone.test(value)) {
        message = MESSAGE_WARNING_PHONE;
    }

    return message;
}

export const checkOnlyNumbers = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfOnlyNumbers.test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;
}

export const checkEmail = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) &&
        (!patternOfStructureEmail.test(value) || !patternOfEmail.test(value))) {
        message = MESSAGE_WARNING_INVALID_EMAIL;
    }

    return message;
}

export const checkContactRelevantFeatures = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfContactRelevantFeatures.test(value)) {
        message = MESSAGE_WARNING_RELEVANT_FEATURES;
    }

    return message;
}
export const checkRegexHtmlInjection = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && regexHtmlInjection.test(value)) {
        message = MESSAGE_ERROR_INJECTION_HTML;
    }

    return message;
}

export const checkPipeLineOpportunityName = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfOpportunityName.test(value)) {
        message = MESSAGE_WARNING_OPPORTUNITY_NAME;
    }

    return message;
}

export const checkRequiredPipelinePadre =  (value, fields, props) => {
    let isPipelineChild = props.pipelineReducer.get("isPipelineChildOpen");
    if (!isPipelineChild) {
        return checkRequired(value);
    }
    return null;
}

/**
 * 
 * @param {*} fieldValue -> Valor al que se le aplican las reglas de validación
 * @param {*} selectedValue -> Id del catalogo seleccionado
 * @param {*} catalogValues -> Valores del catalogo
 * @param {*} checkCondition -> Condición que debe cumplir la llave del catalogo seleccionado
 * @param {*} checkRules -> Reglas que debe cumplir fieldValue. El retorno de checkRules sera el retorno de toda la función
 * 
 * @Return {*} El retorno sera el retorno de la función checkRules
 * 
 */
export const checkReducerValue = (fieldValue, selectedValue, catalogValues, checkCondition, checkRules) => {

    if (!catalogValues) {
        return;
    }
        
    var selectedCatalog = catalogValues.find((catalog) => catalog.id == selectedValue );
    if (!selectedCatalog) {
        return;
    }
    
    if (checkCondition(selectedCatalog.key)) {
        return checkRules(fieldValue);
    }
}

export const checkRequiredComercialOportunity = (value, fields, props) => {    
    return checkReducerValue(value,
        fields.pipelineType,
        props.selectsReducer.get(PIPELINE_TYPE),
        (value) => value == "Gestión de oportunidades",
        checkRequired
    );
}

export const checkRequiredPipelineJustification = (value, fields, props) => {    
    const pipelineTypes = props.selectsReducer.get(PIPELINE_TYPE);
    const businessStatusList = props.selectsReducer.get(PIPELINE_STATUS);
    let pipelineTypeSelected = null;
    let pipelineTypeSelectedKey = null;
    let businessStatusSelected = null;
    let businessStatusSelectedKey = null;

    if(pipelineTypes){
        pipelineTypeSelected = pipelineTypes.find((pipelineType) => pipelineType.id == fields.pipelineType);      
        pipelineTypeSelectedKey = pipelineTypeSelected ? pipelineTypeSelected.key.toLowerCase() : '';
    }    

    if(businessStatusList){
        businessStatusSelected = businessStatusList.find((status) => status.id == fields.businessStatus);
        businessStatusSelectedKey = businessStatusSelected ? businessStatusSelected.key.toLowerCase() : '';
    }
        
    if(pipelineTypeSelectedKey == OPORTUNITIES_MANAGEMENT && (businessStatusSelectedKey === BUSINESS_STATUS_NO_CONTACTADO || businessStatusSelectedKey === BUSINESS_STATUS_PERDIDO)){                
        return checkRequired(value);
    }

    return null;
}

export const checkRequiredPivotNit = (value, fields, props) => {    
    return checkReducerValue(value,
        fields.product,
        props.selectsReducer.get(PRODUCTS),
        (value) => {
            const productKey = value ? value.toLowerCase() : '';            
            return (productKey == FACTORING_BANCOLOMBIA_CONFIRMING || productKey == FACTORING_PLUS || productKey == TRIANGULAR_LINE);
        },
        (value) => {
            return checkRequired(value) || checkNumberDocument(value) || checkFirstCharacter(value)
        });
}

export const checkRequiredTermInMonths = (value, fields, props) => {
    return checkReducerValue(value,
        fields.need,
        props.selectsReducer.get(CLIENT_NEED),
        (value) => {
            const productKey = value ? value : '';
            return (productKey == NEED_FINANCING);
        },
        (value) => {
            return checkRequired(value) || checkFirstCharacter(value)
        });
}

export const checkRequiredTermInMonthsValue = (value, fields, props) => {
    return checkReducerValue(value,
        fields.need,
        props.selectsReducer.get(CLIENT_NEED),
        (value) => {
            const productKey = value ? value : '';
            return (productKey == NEED_FINANCING);
        },
        (value) => {
            return checkRequired(value)
        });
}

export const checkObservationsLinkClient = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfObservationLinkClient.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT;
    }

    return message;
}

export const checkHistoryFields = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfHistory.test(value)) {
        message = MESSAGE_WARNING_HISTORY;
    }

    return message;
}

export const checkOtherReason = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOtherReason.test(value)) {
        message = MESSAGE_WARNING_OTHER_REASON;
    }
    return message;
}

export const checkClientName = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientName.test(value)) {
        message = MESSAGE_WARNING_CLIENT_NAME;
    }

    return message;
}

export const checkClientContext = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfContextClient.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkInventoryPolicy = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfInventoryPolice.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkControlLinkedPayments = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfControlLinkedPayments.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkClientDescription = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfDescription.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkClientAddress = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientAddress.test(value)) {
        message = MESSAGE_WARNING_ADDRESS;
    }

    return message;

}

export const checkNameEntityProduct = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNameEntity.test(value)) {
        message = MESSAGE_WARNING_NAME_ENTITY;
    }

    return message;
}

export const checkdetailNonOperatingIncomePrincipal = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNoOperatingInCome.test(value)) {
        message = MESSAGE_WARNING_NO_OPERATING_IN_COME;
    }

    return message;
}

export const checkOttherOperationsForeign = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfOnlyAlphabeticalAndSlash.test(value)) {
        message = MESSAGE_WARNING_ONLY_ALPHABETICAL_AND_SLASH;
    }

    return message;
}

export const checkClientNeighborhood = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientNeighborhood.test(value)) {
        message = MESSAGE_WARNING_NEIGHBORHOOD;
    }

    return message;
}

export const checkNumbers = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !regexNumbers.test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;

}

export const checkValueClientInformacion = reducer => (value, fields, props) => {
    if (!props) {
        return null;
    }
    const applied = props.clientInformacion.get(reducer);
    let message = null;
    if (!applied) {
        message = checkRequired(value);
    }
    return message;
}

export const checkNameOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNameOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_NAME_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkPositionOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) &&
        !patternOfPositionOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkCompanyOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) &&
        !patternOfCompanyOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkDecimalNumbers = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternDecimalNumbers.test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;
}

export const checkPlaceOfPrevisit = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfPlaceOfPrevisit.test(value)) {
        message = MESSAGE_WARNING_PLACE_OF_PREVISIT;
    }

    return message;
}

export const checkRichTextRequired = value => {
    if (!_.isUndefined(value)) {
        return checkRequired(htmlToText(value));
    } else {
        return MESSAGE_REQUIRED_VALUE;
    }
}

export const checkNumberInRange = (min, max) => value => {
    let message = null;
    let number;
    if (_.isNil(value)) {
        return message;
    }
    if (typeof value == 'string') {
        number = parseFloat(value.replace(",", ""));
    } else {
        number = parseFloat(value);
    }
    if (number < min || number > max) {
        message = MESSAGE_WARNING_RANGE(min, max);
    }
    return message;
}

export const checkFirstCharacter = value => {
    let message = null;
    if (!_.isNil(value) && patternOfForbiddenCharacter.test(value)) {
        message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
    }
    return message;
}

export const checkNumberLength = length => value => {
    //Conventir a string
    let message = null;
    if (_.isNil(value)) {
        return message;

    }

    let number = value + "";
    let formatedNumber = number;
    formatedNumber = formatedNumber.replace(/,/g, "");
    formatedNumber = formatedNumber.replace(/\./g, "");
    formatedNumber = formatedNumber.replace(/\-/g, "");
    if (formatedNumber.length > length) {
        message = MESSAGE_WARNING_NUMBER_LENGTH(length);
    }
    return message;
}

export const checkRequiredWhenFieldIsTrue = field => (value, fields, _) => {
    if (fields[field]) {
        return checkRequired(value);
    }
    return null;
}



export const checkGroupName = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfRiskGroupName.test(value)) {
        message = MESSAGE_WARNING_GROUP_NAME;
    }

    return message;
}

export const checkObservationsRiskGroup = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfObservationRiskGroup.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS_RISK_GROUP;
    }

    return message;
}
export const checkJustificationsRiskGroup = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfJustificationsRiskGroup.test(value)) {
        message = MESSAGE_WARNING_JUSTIFICATIONS_RISK_GROUP;
    }

    return message;
}

export const checkGroupExternalClientName = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfRiskExternalClientName.test(value)) {
        message = MESSAGE_WARNING_EXTERNAL_CLIENT_NAME;
    }

    return message;
}
export const checkGroupExternalClientNumberDocument = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfExternalClientNumberDocument.test(value)) {
        message = MESSAGE_WARNING_EXTERNAL_NUMBER_DOCUMENT;
    }

    return message;
}
export const checkRequiredEmployee = value => {
    let message = null;
    if(_.isNull(value)||_.isUndefined(value)){ 
        return MESSAGE_REQUIRED_EMPLOYEE
    }
    return null;

}
export const checkRequiredWhenVarIsTrue = field => (value, fields, _) => {
    if (fields[field] === true) {
        return checkRequired(value);
    }
    return null;
}

export const checkRequiredWhenVarIsFalse = field => (value, fields, _) => {
    if (fields[field] === false) {
        return checkRequired(value);
    }
    return null;

}

