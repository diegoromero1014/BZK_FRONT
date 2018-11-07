import _ from "lodash";

import {
    checkRequired, checkClientName, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkObservations, processRules, checkForValueSubSegment
} from '../../validationsFields/rulesField';

const fieldsWithRules = {
    razonSocial: { rules: [checkRequired, checkClientName] },
    occupation: { rules: [] },      
    descriptionCompany: { rules: [] },
    reportVirtual: { rules: [] },
    extractsVirtual: { rules: [] },
    marcGeren: { rules: [] },
    necesitaLME: { rules: [] },
    idCIIU: { rules: [] },
    idSubCIIU: { rules: [] },
    address: { rules: [] },
    country: { rules: [] },
    province: { rules: [] },
    city: { rules: [] },
    telephone: { rules: [] },
    district: { rules: [] },
    annualSales: { rules: [] },
    assets: { rules: [] },
    centroDecision: { rules: [] },
    idCelula: { rules: [checkRequired] },
    liabilities: { rules: [] },
    operatingIncome: { rules: [] },
    nonOperatingIncome: { rules: [] },
    expenses: { rules: [] },
    dateSalesAnnuals: { rules: [] },
    segment: { rules: [checkRequired] },
    subSegment: { rules: [checkForValueSubSegment] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};