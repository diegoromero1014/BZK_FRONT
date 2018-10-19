import { xssValidation } from "../../../../../actionsGlobal";

import {
    MESSAGE_WARNING_OBSERVATIONS,
    MESSAGE_WARNING_NUMBER_DOCUMENT,
    MESSAGE_WARNING_ONLY_ALPHABETICAL
} from './../constants';
import {
    OPTION_REQUIRED,
    VALUE_REQUIERED,
    VALUE_XSS_INVALID,
} from "../../../../../constantsGlobal";


export const fields = [
    "idBoardMember", "typeOfDocument", "numberDocument", "firstName", "middleName",
    "firstLastName", "secondLastName", "observations"
];

const errors = {};
export const validations = (values) => {
    const patternOfOnlyAlphabetical = /[^a-zA-Z\sÁÉÍÓÚáéíóúÑñÜü]/g;

    if (!values.typeOfDocument) {
        errors.typeOfDocument = OPTION_REQUIRED;
    } else {
        errors.typeOfDocument = null;
    }

    const patternOfNumberDocument = /[^a-zA-Z0-9\-ÁÉÍÓÚáéíóúÑñÜü]/g;
    if (!values.numberDocument) {
        errors.numberDocument = VALUE_REQUIERED;
    } else if (xssValidation(values.numberDocument)) {
        errors.numberDocument = VALUE_XSS_INVALID;
    } else if (values.numberDocument && patternOfNumberDocument.test(values.numberDocument)) {
        errors.numberDocument = MESSAGE_WARNING_NUMBER_DOCUMENT;
    } else {
        errors.numberDocument = null;
    }

    if (!values.firstName) {
        errors.firstName = VALUE_REQUIERED;
    } else if (xssValidation(values.firstName)) {
        errors.firstName = VALUE_XSS_INVALID;
    } else if (values.firstName && patternOfOnlyAlphabetical.test(values.firstName)) {
        errors.firstName = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    } else {
        errors.firstName = null;
    }

    if (!values.firstLastName) {
        errors.firstLastName = VALUE_REQUIERED;
    } else if (xssValidation(values.firstLastName)) {
        errors.firstLastName = VALUE_XSS_INVALID;
    } else if (values.firstLastName && patternOfOnlyAlphabetical.test(values.firstLastName)) {
        errors.firstLastName = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    } else {
        errors.firstLastName = null;
    }

    if (xssValidation(values.middleName)) {
        errors.middleName = VALUE_XSS_INVALID;
    } else if (values.middleName && patternOfOnlyAlphabetical.test(values.middleName)) {
        errors.middleName = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    } else {
        errors.middleName = null;
    }

    if (xssValidation(values.secondLastName)) {
        errors.secondLastName = VALUE_XSS_INVALID;
    } else if (values.secondLastName && patternOfOnlyAlphabetical.test(values.secondLastName)) {
        errors.secondLastName = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    } else {
        errors.secondLastName = null;
    }

    const patternOfObservation = /[^a-zA-Z0-9\s()\[\];,."!¡$%&\/¿?°#=':´+_\-ÁÉÍÓÚáéíóúÑñÜü]/g;
    if (xssValidation(values.observations)) {
        errors.observations = VALUE_XSS_INVALID;
    } else if (values.observations && patternOfObservation.test(values.observations)) {
        errors.observations = MESSAGE_WARNING_OBSERVATIONS;
    } else {
        errors.observations = null;
    }

    return errors;
};