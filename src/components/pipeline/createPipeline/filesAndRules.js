import _ from "lodash";

import {
    checkRequired, processRules, checkRequiredWithGlobalCondition, checkOnlyAlphabetical, 
    checkDecimalNumbers, checkPipeLineOpportunityName, checkFirstCharacter
} from '../../../validationsFields/rulesField';

export const fieldsWithRules = {
    nameUsuario: { rules: [checkRequired, checkOnlyAlphabetical] }, 
    idUsuario: { rules: [checkRequired] }, 
    value: { rules: [checkRequired] }, 
    commission: { rules: [checkDecimalNumbers] }, 
    roe: { rules: [checkDecimalNumbers] }, 
    termInMonths: { rules: [checkRequired] }, 
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
    areaAssetsValue: { rules: [checkDecimalNumbers] }, 
    termInMonthsValues: { rules: [checkRequired, checkDecimalNumbers] },
    pendingDisbursementAmount: { rules: [] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};