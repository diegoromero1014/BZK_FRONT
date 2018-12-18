import _ from 'lodash';
import {
    processRules, checkMaxLength, checkNameOtherParticipant, checkPositionOtherParticipant,
    checkCompanyOtherParticipant, checkFirstCharacter
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    nombrePersona: { rules: [checkFirstCharacter, checkNameOtherParticipant] },
    cargoPersona: { rules: [checkFirstCharacter, checkPositionOtherParticipant, checkMaxLength(1000)] },
    empresaPersona: { rules: [checkFirstCharacter, checkCompanyOtherParticipant] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}