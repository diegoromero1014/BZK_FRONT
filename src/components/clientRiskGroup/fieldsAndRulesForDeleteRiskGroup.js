import _ from 'lodash';
import {
    processRules, checkRequired, checkMaxLength, checkFirstCharacter, checkGroupName,
    checkJustificationsRiskGroup
} from './../../validationsFields/rulesField';

const fieldsWithRules = {
    justification: { rules: [checkRequired, checkMaxLength(1000), checkFirstCharacter, checkJustificationsRiskGroup] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formfields) => {
    return processRules(formfields, fieldsWithRules);
}