import { reduxForm } from 'redux-form';
import _ from "lodash";

import { mapDispatchToProps, mapStateToProps } from './componentListLineBusiness';
import Wrapper from './reduxFormWrapper';
import {
    processRules, checkClientDescription, checkMaxLength,
    checkValueClientInformacion, checkNumberInRange, checkFirstCharacter
} from '../../../validationsFields/rulesField';

import {
    noAppliedLineOfBusiness
} from '../../../constantsReducer';

const fieldsWithRules = {
    contextLineBusiness: { rules: [checkValueClientInformacion(noAppliedLineOfBusiness), checkClientDescription, checkMaxLength(50), checkFirstCharacter] },
    participation: { rules: [checkValueClientInformacion(noAppliedLineOfBusiness), checkNumberInRange(0,100)] },
    experience: { rules: [checkNumberInRange(0,9999)] },
    contribution: { rules: [checkNumberInRange(0,100)] }
}

const fields = _.keys(fieldsWithRules);

const validate = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};

export default reduxForm({
    form: 'formLineBusiness',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(Wrapper);