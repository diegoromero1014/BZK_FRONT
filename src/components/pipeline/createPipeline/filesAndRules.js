import _ from "lodash";

import {
    checkRequired, processRules, checkRequiredWithGlobalCondition,
    checkOnlyAlphabetical, checkPipeLineOpportunityName,
    checkFirstCharacter, checkNumberLength,
    checkRequiredPipelineJustification,
    checkRequiredComercialOportunity, checkRequiredTermInMonths,
    checkRequiredTermInMonthsValue, validateDecimal, checkJustificationDetails, checkRegexHtmlInjection,checkRequiredNegotiatedAmount
} from '../../../validationsFields/rulesField';

export const fieldsWithRules = {
    nameUsuario: { rules: [checkRequired, checkOnlyAlphabetical] }, 
    idUsuario: { rules: [checkRequired] }, 
    value: { rules: [checkRequired, checkNumberLength(15)] }, 
    commission: { rules: [checkNumberLength(10)] },
    sva: { rules: [checkNumberLength(15)] },
    roe: { rules: [validateDecimal] },
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
    justificationDetail: { rules: [checkJustificationDetails, checkFirstCharacter, checkRegexHtmlInjection, checkNumberLength(500)] },
    productFamily: { rules: [checkRequired] },
    mellowingPeriod: { rules: [] }, 
    moneyDistribitionMarket: { rules: [] }, 
    areaAssets: { rules: [] }, 
    termInMonthsValues: { rules: [checkRequiredTermInMonthsValue] },
    pendingDisbursementAmount: { rules: [checkNumberLength(15)] },
    pipelineType: { rules: [checkRequired] },
    commercialOportunity: { rules: [checkRequiredComercialOportunity] },
    justification: { rules: [checkRequiredPipelineJustification]},
    margen:{rules: [validateDecimal]},
    typePolicy: { rules: [] },
    businessCategory2: { rules: [] },
    nominalValue2:{ rules: [checkNumberLength(15)] },
    negotiatedAmount:{rules: [checkNumberLength(15)]  }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};