import _ from 'lodash';
import {processRules, checkMaxLength, checkObservationsLinkClient} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    observationTrader: {rules:[checkMaxLength(1000), checkObservationsLinkClient]}
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields)=>{
    return processRules(formFields,fieldsWithRules);
}