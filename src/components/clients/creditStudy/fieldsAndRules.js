import _ from "lodash";

import {
    checkRequired, processRules, checkClientDescription
} from '../../../validationsFields/rulesField';

const fieldsWithRules = {
    contextClientField: { rules: [checkRequired, checkClientDescription] },
    customerTypology: { rules: [] },
    inventoryPolicy: { rules: [checkClientDescription] },
    participationLB: { rules: [] },
    participationDC: { rules: [] },
    participationMC: { rules: [] },
    contextLineBusiness: { rules: [] },
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
    controlLinkedPayments: { rules: [checkRequired, checkClientDescription] },
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};