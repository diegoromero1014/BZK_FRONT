import _ from "lodash";
import {
    checkRequired, processRules, checkRequiredWhenVarIsTrue, checkRequiredWhenVarIsFalse, 
    checkClientName, checkNumberInRange, checkNumberDocument, checkOnlyAlphabetical, checkMinLength, 
    checkMaxLength, checkObservations, checkFirstCharacter, checkClientNeighborhood, checkOnlyNumbers, checkDecimalNumbers
} from '../../../../../validationsFields/rulesField';

export const fieldsWithRules = {
    tipoDocumento: { rules: [checkRequired] },
    numeroDocumento: { rules: [checkRequired, checkFirstCharacter, checkNumberDocument, checkMinLength(1), checkMaxLength(30)] },
    tipoPersona: { rules: [checkRequired] },
    tipoAccionista: { rules: [checkRequired] },
    paisResidencia: { rules: [] },
    primerNombre: { rules: [checkRequiredWhenVarIsTrue('isNaturePerson'), checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    segundoNombre: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    primerApellido: { rules: [checkRequiredWhenVarIsTrue('isNaturePerson'), checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    segundoApellido: { rules: [checkFirstCharacter, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(10)] },
    genero: { rules: [] },
    razonSocial: { rules: [checkRequiredWhenVarIsFalse('isNaturePerson'), checkFirstCharacter, checkClientName, checkMaxLength(50)] },
    direccion: { rules: [checkFirstCharacter, checkClientNeighborhood, checkMaxLength(60)] },
    porcentajePart: { rules: [checkFirstCharacter, checkDecimalNumbers, checkRequired, checkNumberInRange(0, 100)] },
    pais: { rules: [] },
    departamento: { rules: [] },
    ciudad: { rules: [] },
    numeroIdTributaria: { rules: [checkFirstCharacter, checkOnlyNumbers, checkMinLength(1), checkMaxLength(20)] },
    observaciones: { rules: [checkFirstCharacter, checkObservations] },
    isNaturePerson: { rules: [] }
}

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};