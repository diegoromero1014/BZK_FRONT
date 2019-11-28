import _ from 'lodash';

import {
    checkRequiredEmployee, processRules, checkRequired, checkMinLength, checkOnlyAlphabetical, checkFirstCharacter, checkTaskObservation, checkRichTextRequired, checkRegexHtmlInjection
}from './../../../validationsFields/rulesField';


const fieldsWithRules = {
    id: { rules: [] },
    fecha: { rules: [checkRequired] },
    idEstado: { rules: [checkRequired] },
    responsable: { rules: [checkRequired, checkMinLength(2), checkOnlyAlphabetical] },
    tarea: { rules: [ checkRichTextRequired ]},
    advance: { rules: [checkFirstCharacter, checkTaskObservation, checkRegexHtmlInjection] },
    idEmployee: { rules: [checkRequiredEmployee] },
    visit: { rules: [] },
    dateEntity: { rules: [] }

};

export const fields =_.keys(fieldsWithRules);
 
export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};