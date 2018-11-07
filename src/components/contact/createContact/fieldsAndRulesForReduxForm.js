import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkOnlyAlphabetical, checkMinLength,
    checkMaxLength, checkAddress, checkNeighborhood, checkPostalCode, checkPhone, checkOnlyNumbers,
    checkContactRelevantFeatures, checkEmail, processRules
} from './../../../validationsFields/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    tipoDocumento: { rules: [] },
    numeroDocumento: { rules: [checkRequired, checkNumberDocument, checkMaxLength(30)] },
    tipoTratamiendo: { rules: [checkRequired] },
    tipoGenero: { rules: [checkRequired] },
    primerNombre: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    segundoNombre: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    primerApellido: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    segundoApellido: { rules: [checkOnlyAlphabetical, checkMinLength(2), checkMaxLength(60)] },
    tipoCargo: { rules: [checkRequired] },
    tipoDependencia: { rules: [checkRequired] },
    fechaNacimiento: { rules: [] },
    tipoEstiloSocial: { rules: [] },
    tipoActitud: { rules: [] },
    pais: { rules: [checkRequired] },
    departamento: { rules: [checkRequired] },
    ciudad: { rules: [checkRequired] },
    direccion: { rules: [checkRequired, checkMinLength(5), checkAddress] },
    barrio: { rules: [checkNeighborhood] },
    codigoPostal: { rules: [checkPostalCode] },
    telefono: { rules: [checkRequired, checkPhone] },
    extension: { rules: [checkOnlyNumbers] },
    celular: { rules: [checkPhone] },
    correo: { rules: [checkRequired, checkEmail] },
    tipoContacto: { rules: [checkRequired] },
    tipoEntidad: { rules: [] },
    tipoFuncion: { rules: [checkRequired] },
    tipoHobbie: { rules: [] },
    tipoDeporte: { rules: [] },
    contactRelevantFeatures: { rules: [checkContactRelevantFeatures] },
    listaFavorito: { rules: [] }
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};