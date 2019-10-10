import _ from "lodash";

import {
    checkRequired, processRules, checkRequiredWithGlobalCondition,
    checkOnlyAlphabetical, checkPipeLineOpportunityName, 
    checkFirstCharacter, checkNumberLength, checkNumberDocument
} from '../../../validationsFields/rulesField';

export const fieldsWithRules = {
    nameUsuario: { rules: [checkRequired, checkOnlyAlphabetical] }, 
    idUsuario: { rules: [checkRequired] }, 
    value: { rules: [checkRequired, checkNumberLength(15)] }, 
    commission: { rules: [checkNumberLength(10)] }, 
    roe: { rules: [checkNumberLength(10)] }, 
    termInMonths: { rules: [checkRequired, checkNumberLength(3)] }, 
    businessStatus: { rules: [checkRequired] }, 
    businessCategory: { rules: [checkRequiredWithGlobalCondition] }, 
    currency: { rules: [checkRequired] }, 
    indexing: { rules: [] }, 
    need: { rules: [checkRequired] }, 
    observations: { rules: [] }, 
    product: { rules: [] }, 
    reviewedDate: { rules: [] }, 
    client: { rules: [] }, 
    documentStatus: { rules: [] }, 
    probability: { rules: [] }, 
    amountDisbursed: { rules: [] }, 
    estimatedDisburDate: { rules: [] }, 
    opportunityName: { rules: [checkRequired, checkPipeLineOpportunityName, checkFirstCharacter] }, 
    productFamily: { rules: [checkRequired] }, 
    mellowingPeriod: { rules: [] }, 
    moneyDistribitionMarket: { rules: [] }, 
    areaAssets: { rules: [] }, 
    areaAssetsValue: { rules: [checkNumberLength(17)] }, 
    termInMonthsValues: { rules: [checkRequired] },
    pendingDisbursementAmount: { rules: [checkNumberLength(15)] },
    pivotNit: {rules: [checkRequired, checkNumberDocument, checkFirstCharacter]}
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};