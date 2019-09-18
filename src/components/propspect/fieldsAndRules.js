import _ from "lodash";

import {
    checkRequired, checkClientName, checkFirstCharacter,
    checkMaxLength, processRules, checkForValueSubSegment, checkNumbers,
    checkClientDescription, checkClientAddress, checkClientNeighborhood, checkNumberLength
} from '../../validationsFields/rulesField';

const fieldsWithRules = {
    razonSocial: { rules: [checkRequired, checkFirstCharacter, checkClientName, checkMaxLength(50)] },
    descriptionCompany: { rules: [checkFirstCharacter, checkClientDescription, checkMaxLength(1000)] },
    reportVirtual: { rules: [] },
    extractsVirtual: { rules: [] },
    marcGeren: { rules: [] },
    necesitaLME: { rules: [] },
    idCIIU: { rules: [] },
    idSubCIIU: { rules: [] },
    address: { rules: [checkFirstCharacter, checkClientAddress] },
    country: { rules: [] },
    province: { rules: [] },
    city: { rules: [] },
    telephone: { rules: [checkNumbers] },
    district: { rules: [checkFirstCharacter, checkClientNeighborhood] },
    annualSales: { rules: [checkNumberLength(15)] },
    assets: { rules: [checkNumberLength(15)] },
    centroDecision: { rules: [] },
    idCelula: { rules: [checkRequired] },
    liabilities: { rules: [checkNumberLength(15)] },
    operatingIncome: { rules: [checkNumberLength(15)] },
    nonOperatingIncome: { rules: [checkNumberLength(15)] },
    expenses: { rules: [checkNumberLength(15)]  },
    dateSalesAnnuals: { rules: [] },
    segment: { rules: [checkRequired] },
    subSegment: { rules: [checkForValueSubSegment] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};