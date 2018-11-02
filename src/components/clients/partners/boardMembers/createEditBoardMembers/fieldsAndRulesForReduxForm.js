import _ from "lodash";

import {
    checkRequired, checkNumberDocument, checkMinLengthThirty, checkOnlyAlphabetical, checkMinLengthTow,
    checkMaxLengthSixty, checkObservations, processRules
} from './../../../../../ui/input/rulesField';

const fieldsWithRules = {
    idBoardMember: { rules: [] },
    typeOfDocument: { rules: [checkRequired] },
    numberDocument: { rules: [checkRequired, checkNumberDocument, checkMinLengthThirty] },
    firstName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    firstLastName: { rules: [checkRequired, checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    middleName: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    secondLastName: { rules: [checkOnlyAlphabetical, checkMinLengthTow, checkMaxLengthSixty] },
    observations: { rules: [checkObservations] },
};

export const fields = _.keys(fieldsWithRules);

export const validations = (formFields) => {
    return processRules(formFields, fieldsWithRules)
};