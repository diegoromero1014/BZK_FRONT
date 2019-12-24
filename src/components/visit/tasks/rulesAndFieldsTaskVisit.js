import _ from 'lodash';
import {
    processRules, checkRequiredResponsible, checkRequired
} from './../../../validationsFields/rulesField';

const fieldsWithRules= {
    responsable:{rules:[checkRequiredResponsible]},
    tarea:{rules:[]},
    fecha:{rules:[checkRequired]},
    idEmployee:{rules:[]},
    id:{rules:[]}
}

export const fields =_.keys(fieldsWithRules);
 
export const validations = (formfields, props) => {
    return processRules(formfields, fieldsWithRules, props);
}