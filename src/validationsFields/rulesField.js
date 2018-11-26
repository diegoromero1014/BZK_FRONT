import _ from "lodash";

import { htmlToText } from './../actionsGlobal';
import {
    patternOfOnlyAlphabetical, patternOfNumberDocument, patternOfObservation, patternOfAddress, patternOfNeighborhood,
    patternOfPostalCode, patternOfPhone, patternOfOnlyNumbers, patternOfContactRelevantFeatures,
    patternOfStructureEmail, patternOfEmail, patternOfHistory, patternOfClientName, patternOfDescription,
    patternOfClientAddress, patternOfClientNeighborhood, patternOfObservationLinkClient, regexNumbers,
    patternOfForbiddenCharacter,
    patternOfNameOtherParticipant, patternOfPositionOtherParticipant, patternOfCompanyOtherParticipant,
    patternDecimalNumbers, patternOfPlaceOfPrevisit
} from './patternsToValidateField';

import {
    MESSAGE_REQUIRED_VALUE, MESSAGE_WARNING_ONLY_ALPHABETICAL, MESSAGE_WARNING_MIN_LENGTH,
    MESSAGE_WARNING_MAX_LENGTH, MESSAGE_WARNING_OBSERVATIONS, MESSAGE_WARNING_HISTORY, MESSAGE_WARNING_NUMBER_DOCUMENT,
    MESSAGE_WARNING_NEIGHBORHOOD, MESSAGE_WARNING_POSTAL_CODE, MESSAGE_WARNING_PHONE, MESSAGE_WARNING_ONLY_NUMBERS,
    MESSAGE_WARNING_INVALID_EMAIL, MESSAGE_WARNING_RELEVANT_FEATURES, MESSAGE_WARNING_ADDRESS,
    MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT, MESSAGE_WARNING_CLIENT_NAME, MESSAGE_WARNING_NAME_OTHER_PARTICIPANT,
    MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT, MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT,
    MESSAGE_WARNING_PLACE_OF_PREVISIT, MESSAGE_WARNING_RANGE, MESSAGE_WARNING_FORBIDDEN_CHARACTER

} from './validationsMessages';

import {
    SEGMENTS
} from '../components/selectsComponent/constants';

import {
    CONSTRUCT_PYME
} from '../components/clientEdit/constants';

let globalCondition = false;
export const setGlobalCondition = value => {
    globalCondition = value;
};

export const processRules = (formFields, fieldsWithRules, props) => {
    const errors = {};
    _.mapKeys(formFields, function (value, field) {
        if (!_.isEmpty(fieldsWithRules[field].rules)) {
            _.forEach(fieldsWithRules[field].rules, function (rule) {
                const message = rule(value, formFields, props);
                if (!_.isEmpty(message)) {
                    errors[field] = message;
                    return false;
                } else {
                    errors[field] = null;
                }
            });
        }
    });
    return errors;
}

export const checkRequired = value => (_.isNull(value) || _.toString(value).length < 1) ? MESSAGE_REQUIRED_VALUE : null;
export const checkRequiredWithGlobalCondition = value => globalCondition ? checkRequired(value) : null;

export const checkOnlyAlphabetical = (value) => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfOnlyAlphabetical).test(value)) {
        message = MESSAGE_WARNING_ONLY_ALPHABETICAL;
    }

    return message;
}

export const checkForValueSubSegment = (value, fields, props) => {
    let message = null;
    let segmentValue = _.get(_.find(props.selectsReducer.get(SEGMENTS), ['id', parseInt(fields.segment)]), 'value');

    if (_.isEqual(CONSTRUCT_PYME, segmentValue)) {
        if (_.isNull(value) || _.isEmpty(value)) {
            message = MESSAGE_REQUIRED_VALUE;
        }
    }

    return message;
}

export const checkMinLength = minLength => value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && value.length > 0 && value.length < minLength) {
        message = MESSAGE_WARNING_MIN_LENGTH(minLength);
    }

    return message;
}

export const checkMaxLength = maxLength => value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && value.length > maxLength) {

        message = MESSAGE_WARNING_MAX_LENGTH(maxLength);
    }
    return message;
}

export const checkNumberDocument = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfNumberDocument).test(value)) {
        message = MESSAGE_WARNING_NUMBER_DOCUMENT;
    }

    return message;
}

export const checkObservations = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfObservation).test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkAddress = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfAddress).test(value)) {
        message = MESSAGE_WARNING_ADDRESS;
    }

    return message;
}

export const checkNeighborhood = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfNeighborhood).test(value)) {
        message = MESSAGE_WARNING_NEIGHBORHOOD;
    }

    return message;
}

export const checkPostalCode = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfPostalCode).test(value)) {
        message = MESSAGE_WARNING_POSTAL_CODE;
    }

    return message;
}

export const checkPhone = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfPhone).test(value)) {
        message = MESSAGE_WARNING_PHONE;
    }

    return message;
}

export const checkOnlyNumbers = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfOnlyNumbers).test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;
}

export const checkEmail = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) &&
        (!patternOfStructureEmail.test(value) || eval(patternOfEmail).test(value))) {
        message = MESSAGE_WARNING_INVALID_EMAIL;
    }

    return message;
}

export const checkContactRelevantFeatures = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfContactRelevantFeatures).test(value)) {
        message = MESSAGE_WARNING_RELEVANT_FEATURES;
    }

    return message;
}

export const checkObservationsLinkClient = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfObservationLinkClient).test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS_LINK_CLIENT;
    }

    return message;
}

export const checkHistoryFields = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && eval(patternOfHistory).test(value)) {
        message = MESSAGE_WARNING_HISTORY;
    }

    return message;
}

export const checkClientName = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientName.test(value)) {
        message = MESSAGE_WARNING_CLIENT_NAME;
    }

    return message;
}

export const checkClientDescription = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfDescription.test(value)) {
        message = MESSAGE_WARNING_OBSERVATIONS;
    }

    return message;
}

export const checkClientAddress = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientAddress.test(value)) {
        message = MESSAGE_WARNING_ADDRESS;
    }

    return message;

}

export const checkClientNeighborhood = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfClientNeighborhood.test(value)) {
        message = MESSAGE_WARNING_NEIGHBORHOOD;
    }

    return message;
}

export const checkNumbers = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !regexNumbers.test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;  

}

export const checkValueClientInformacion = reducer => (value, fields, props) => {
    if (!props) {
        return null;
    }
    const applied = props.clientInformacion.get(reducer);
    let message = null;
    if (! applied) {
        message = checkRequired(value);
    }
    return message;
}

export const checkNameOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfNameOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_NAME_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkPositionOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) &&
        !patternOfPositionOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_POSITION_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkCompanyOtherParticipant = value => {
    let message = null;
    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) &&
        !patternOfCompanyOtherParticipant.test(value)) {
        message = MESSAGE_WARNING_COMPANY_OTHER_PARTICIPANT;
    }

    return message;
}

export const checkDecimalNumbers = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternDecimalNumbers.test(value)) {
        message = MESSAGE_WARNING_ONLY_NUMBERS;
    }

    return message;
}

export const checkPlaceOfPrevisit = value => {
    let message = null;

    if (!_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) && !patternOfPlaceOfPrevisit.test(value)) {
        message = MESSAGE_WARNING_PLACE_OF_PREVISIT;
    }

    return message;
}

export const checkRichTextRequired = value => {
    if(!_.isUndefined(value)){
        return checkRequired(htmlToText(value));
    } else {
        return MESSAGE_REQUIRED_VALUE;
    }
}

export const checkNumberInRange = (min, max) => value => {
    let message = null;
    let number;
    if (_.isNil(value)) {
        return message;
    }
    if (typeof value == 'string') {
        number = parseFloat(value.replace(",",""));
    } else {
        number = parseFloat(value);
    }
    if (number < min || number > max) {
        message = MESSAGE_WARNING_RANGE(min, max);
    }
    return message;
}

export const checkFirstCharacter = value => {
    let message = null;
    if (!_.isNil(value) && patternOfForbiddenCharacter.test(value)) {
        message = MESSAGE_WARNING_FORBIDDEN_CHARACTER;
    }
    return message;
}