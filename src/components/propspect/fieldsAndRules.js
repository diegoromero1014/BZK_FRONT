import _ from "lodash";

import {
    checkRequired, checkClientName, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, processRules, checkForValueSubSegment, checkNumbers,
    checkClientDescription, checkClientAddress, checkClientNeighborhood
} from '../../validationsFields/rulesField';

const fieldsWithRules = {
    razonSocial: { rules: [checkRequired, checkClientName, checkMaxLength(50)] },
    occupation: { rules: [] },      
    descriptionCompany: { rules: [checkClientDescription] },
    reportVirtual: { rules: [] },
    extractsVirtual: { rules: [] },
    marcGeren: { rules: [] },
    necesitaLME: { rules: [] },
    idCIIU: { rules: [] },
    idSubCIIU: { rules: [] },
    address: { rules: [checkClientAddress] },
    country: { rules: [] },
    province: { rules: [] },
    city: { rules: [] },
    telephone: { rules: [checkNumbers] },
    district: { rules: [checkClientNeighborhood] },
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