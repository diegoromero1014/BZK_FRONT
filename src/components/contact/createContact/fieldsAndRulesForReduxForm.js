import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkMinLengthThirty, checkOnlyAlphabetical, checkMinLengthTow,
    checkMaxLengthSixty, checkAddress, checkNeighborhood, checkPostalCode, checkPhone, checkOnlyNumbers,
    checkContactRelevantFeatures, checkEmail, checkMinLengthFive, processRules
} from './../../../ui/input/rulesField';

const fieldsWithRules = {
    id: { rules: [] },
    tipoDocumento: { rules: [] },
    numeroDocumento: { rules: [checkRequired, checkNumberDocument, checkMinLengthThirty] },
    tipoTratamiendo: { rules: [checkRequired] },
    tipoGenero: { rules: [checkRequired] },
    primerNombre: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    segundoNombre: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    primerApellido: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    segundoApellido: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    tipoCargo: { rules: [checkRequired] },
    tipoDependencia: { rules: [checkRequired] },
    fechaNacimiento: { rules: [] },
    tipoEstiloSocial: { rules: [] },
    tipoActitud: { rules: [] },
    pais: { rules: [checkRequired] },
    departamento: { rules: [checkRequired] },
    ciudad: { rules: [checkRequired] },
    direccion: { rules: [checkRequired, checkMinLengthFive, checkAddress] },
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