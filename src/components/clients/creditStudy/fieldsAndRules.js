import _ from "lodash";

import {
    checkRequired, processRules, checkClientDescription,
    checkValueClientInformacion, checkFirstCharacter
} from '../../../validationsFields/rulesField';

import {
    noAppliedControlLinkedPayments
} from '../../../constantsReducer';

const fieldsWithRules = {
    contextClientField: { rules: [checkRequired, checkClientDescription, checkFirstCharacter] },
    customerTypology: { rules: [] },
    inventoryPolicy: { rules: [checkClientDescription, checkFirstCharacter] },
    participationDC: { rules: [] },
    participationMC: { rules: [] },
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
    controlLinkedPayments: { rules: [checkValueClientInformacion(noAppliedControlLinkedPayments), checkClientDescription, checkFirstCharacter] },
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};