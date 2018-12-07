import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkAddress, checkNeighborhood, checkPostalCode, checkPhone, checkOnlyNumbers,
    checkContactRelevantFeatures, checkEmail, processRules, checkFirstCharacter
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    tipoDocumento: { rules: [] },
    numeroDocumento: { rules: [checkRequired, checkNumberDocument, checkFirstCharacter, checkMaxLength(30)] },
    tipoTratamiendo: { rules: [checkRequired] },
    tipoGenero: { rules: [checkRequired] },
    primerNombre: { rules: [checkRequired, checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    segundoNombre: { rules: [checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    primerApellido: { rules: [checkRequired, checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    segundoApellido: { rules: [checkOnlyAlphabetical, checkFirstCharacter, checkMinLength(2), checkMaxLength(60)] },
    tipoCargo: { rules: [checkRequired] },
    tipoDependencia: { rules: [checkRequired] },
    fechaNacimiento: { rules: [] },
    tipoEstiloSocial: { rules: [] },
    tipoActitud: { rules: [] },
    pais: { rules: [checkRequired] },
    departamento: { rules: [checkRequired] },
    ciudad: { rules: [checkRequired] },
    direccion: { rules: [checkRequired, checkFirstCharacter, checkMinLength(5), checkAddress, checkMaxLength(60)] },
    barrio: { rules: [checkNeighborhood, checkFirstCharacter, checkMaxLength(40)] },
    codigoPostal: { rules: [checkPostalCode, checkFirstCharacter, checkMaxLength(10)] },
    telefono: { rules: [checkRequired, checkFirstCharacter, checkMinLength(7), checkPhone, checkMaxLength(30)] },
    extension: { rules: [checkOnlyNumbers, checkFirstCharacter, checkMaxLength(14)] },
    celular: { rules: [checkPhone, checkFirstCharacter, checkMaxLength(30)] },
    correo: { rules: [checkRequired, checkFirstCharacter, checkEmail, checkMaxLength(50)] },
    tipoContacto: { rules: [checkRequired] },
    tipoEntidad: { rules: [] },
    tipoFuncion: { rules: [checkRequired] },
    tipoHobbie: { rules: [] },
    tipoDeporte: { rules: [] },
    contactRelevantFeatures: { rules: [checkContactRelevantFeatures, checkFirstCharacter] },
    listaFavoritos: { rules: [] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};