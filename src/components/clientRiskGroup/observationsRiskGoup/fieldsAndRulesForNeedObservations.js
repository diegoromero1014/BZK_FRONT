import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter,
    checkObservationsRiskGroup
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    observation: { rules: [checkRequired, checkMaxLength(1000), checkFirstCharacter, checkObservationsRiskGroup] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}