import _ from "lodash";

import {
    checkRequired, processRules, checkClientDescription, checkMaxLength,
    checkValueClientInformacion, checkNumberInRange
} from '../../../validationsFields/rulesField';

import {
    noAppliedControlLinkedPayments, noAppliedLineOfBusiness
} from '../../../constantsReducer';

const fieldsWithRules = {
    contextClientField: { rules: [checkRequired, checkClientDescription] },
    customerTypology: { rules: [] },
    inventoryPolicy: { rules: [checkClientDescription] },
    participationLB: { rules: [checkValueClientInformacion(noAppliedLineOfBusiness), checkNumberInRange(0,100)] },
    participationDC: { rules: [] },
    participationMC: { rules: [] },
    contextLineBusiness: { rules: [checkValueClientInformacion(noAppliedLineOfBusiness), checkClientDescription, checkMaxLength(50)] },
    experience: { rules: [] },
    distributionChannel: { rules: [] },
    nameMainClient: { rules: [] },
    tbermMainClient: { rules: [] },
    relevantInformationMainClient: { rules: [] },
    nameMainCompetitor: { rules: [] },
    participationMComp: { rules: [] },
    obsevationsCompetitor: { rules: [] },
    termMainClient: { rules: [] },
    typeOperationIntOpera: { rules: [] },
    participationIntOpe: { rules: [] },
    idCountryIntOpe: { rules: [] },
    participationIntOpeCountry: { rules: [] },
    customerCoverageIntOpe: { rules: [] },
    descriptionCoverageIntOpe: { rules: [] },
    nameMainSupplier: { rules: [] },
    participationMS: { rules: [] },
    termMainSupplier: { rules: [] },
    relevantInformationMainSupplier: { rules: [] },
    notApplyCreditContact: { rules: [] },
    contributionDC: { rules: [] },
    contributionLB: { rules: [] },
    controlLinkedPayments: { rules: [checkValueClientInformacion(noAppliedControlLinkedPayments), checkClientDescription] },
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};