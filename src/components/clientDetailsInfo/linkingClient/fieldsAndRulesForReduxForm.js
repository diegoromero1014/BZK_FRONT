import _ from 'lodash';
import {processRules, checkMaxLength, checkObservationsLinkClient, checkFirstCharacter} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    observationTrader: {rules:[checkMaxLength(1000), checkObservationsLinkClient, checkFirstCharacter]}
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields)=>{
    return processRules(formFields,fieldsWithRules);
}