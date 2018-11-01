import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkMinLengthThirty, checkOnlyAlphabetical, checkMinLengthTow,
    checkMaxLengthTen, checkObservations
} from '../../../../../ui/input/rulesField';

const fieldsWithRules = {
    idBoardMember: { rules: [] },
    typeOfDocument: { rules: [checkRequired] },
    numberDocument: { rules: [checkRequired, checkNumberDocument, checkMinLengthThirty] },
    firstName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthTen] },
    firstLastName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthTen] },
    middleName: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthTen] },
    secondLastName: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthTen] },
    observations: { rules: [checkObservations] },
};

export const fields = _.keys(fieldsWithRules);

const errors = {};
export const validations = (values) => {
    _.mapKeys(values, function (value, field) {
        if (!_.isEmpty(fieldsWithRules[field].rules)) {
            _.forEach(fieldsWithRules[field].rules, function (rule) {
                const message = rule(value);
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
};