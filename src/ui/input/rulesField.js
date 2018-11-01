import _ from "lodash";

import { patternOfOnlyAlphabetical, patternOfNumberDocument, patternOfObservation } from './patternsToValidateField';
import {
    MESSAGE_REQUIRED_VALUE, MESSAGE_WARNING_ONLY_ALPHABETICAL, MESSAGE_WARNING_MIN_LENGTH_TWO,
    MESSAGE_WARNING_MAX_LENGTH_TEN, MESSAGE_WARNING_MIN_LENGTH_THIRTY, MESSAGE_WARNING_OBSERVATIONS,
    MESSAGE_WARNING_NUMBER_DOCUMENT
} from './validationsMessages';


export const checkRequired = value => _.isNull(value) ? MESSAGE_REQUIRED_VALUE : null;

export const checkOnlyAlphabetical = (value) => {
    let message = null;
    if (!_.isNull(value) && eval(patternOfOnlyAlphabetical).test(value)) {
        message = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    }

    return message;
}

export const checkMinLengthTow = value => {
    let message = null;
    if (!_.isNull(value) && value.length < 2) {
        message = MESSAGE_WARNING_MIN_LENGTH_TWO;
    }

    return message;
}

export const checkMinLengthThirty = value => {
    let message = null;
    if (!_.isNull(value) && value.length > 30) {
        message = MESSAGE_WARNING_MIN_LENGTH_THIRTY;
    }

    return message;
}

export const checkMaxLengthTen = value => {
    let message = null;
    if (!_.isNull(value) && value.length > 10) {
        message = MESSAGE_WARNING_MAX_LENGTH_TEN;
    }

    return message;
}

export const checkNumberDocument = value => {
    let message = null;
    if (!_.isNull(value) && eval(patternOfNumberDocument).test(value)) {
        message = MESSAGE_WARNING_NUMBER_DOCUMENT;
    }

    return message;
}

export const checkObservations = value => {
    let message = null;
    if (!_.isNull(value) && eval(patternOfObservation).test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}