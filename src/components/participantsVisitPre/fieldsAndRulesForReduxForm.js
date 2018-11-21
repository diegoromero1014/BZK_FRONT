import _ from 'lodash';
import {
    processRules, checkMaxLength, checkNameOtherParticipant, checkPositionOtherParticipant, checkCompanyOtherParticipant
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    nombrePersona: { rules: [checkNameOtherParticipant] },
    cargoPersona: { rules: [checkPositionOtherParticipant, checkMaxLength(1000)] },
    empresaPersona: { rules: [checkCompanyOtherParticipant] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}