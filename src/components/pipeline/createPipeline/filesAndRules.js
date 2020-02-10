import _ from "lodash";

import {
    checkRequired, processRules, checkRequiredWithGlobalCondition,
    checkOnlyAlphabetical, checkPipeLineOpportunityName,
    checkFirstCharacter, checkNumberLength,
    checkRequiredPipelineJustification,
    checkRequiredComercialOportunity, checkRequiredPivotNit, checkRequiredTermInMonths,
    checkRequiredTermInMonthsValue, checkDecimalNumbers, checkNumberInRange, validateDecimal
} from '../../../validationsFields/rulesField';

export const fieldsWithRules = {
    nameUsuario: { rules: [checkRequired, checkOnlyAlphabetical] }, 
    idUsuario: { rules: [checkRequired] }, 
    value: { rules: [checkRequired, checkNumberLength(15)] }, 
    commission: { rules: [checkNumberLength(10)] }, 
    roe: { rules: [ validateDecimal ] },
    termInMonths: { rules: [checkRequiredTermInMonths, checkNumberLength(3)] },
    businessStatus: { rules: [checkRequired] }, 
    businessCategory: { rules: [checkRequiredWithGlobalCondition] }, 
    currency: { rules: [checkRequired] }, 
    indexing: { rules: [] }, 
    need: { rules: [checkRequired] }, 
    observations: { rules: [] }, 
    product: { rules: [checkRequired] }, 
    reviewedDate: { rules: [] }, 
    client: { rules: [] }, 
    documentStatus: { rules: [] }, 
    probability: { rules: [] }, 
    amountDisbursed: { rules: [] }, 
    estimatedDisburDate: { rules: [] }, 
    opportunityName: { rules: [checkPipeLineOpportunityName, checkFirstCharacter] }, 
    productFamily: { rules: [checkRequired] }, 
    mellowingPeriod: { rules: [] }, 
    moneyDistribitionMarket: { rules: [] }, 
    areaAssets: { rules: [] }, 
    areaAssetsValue: { rules: [checkNumberLength(17)] }, 
    termInMonthsValues: { rules: [checkRequiredTermInMonthsValue] },
    pendingDisbursementAmount: { rules: [checkNumberLength(15)] },
    pipelineType: { rules: [checkRequired] },
    commercialOportunity: { rules: [checkRequiredComercialOportunity] },
    justification: { rules: [checkRequiredPipelineJustification]},
    pivotNit: {rules: [checkRequiredPivotNit]}
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};