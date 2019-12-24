import _ from 'lodash';
import {
        processRules, checkFirstCharacter, checkObservations, checkRequired
} from './../../validationsFields/rulesField';

/**
 * Validaciones de listas blancas para el campo de Observaciones de modalObservation
 */
const fieldsWithRules = {
    observations: { rules: [checkRequired,checkFirstCharacter,checkObservations] },
    expectations: { rules: [checkRequired]}
};

export const fields =_.keys(fieldsWithRules);
 
export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};