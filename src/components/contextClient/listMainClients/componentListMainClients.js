import { reduxForm } from 'redux-form';
import _ from "lodash";

import {mapDispatchToProps, mapStateToProps} from './component';
import Wrapper from './reduxFormWrapper';
import {
    checkRequired, processRules, checkClientDescription,
    checkNumberInRange, checkMaxLength
} from '../../../validationsFields/rulesField';

const fieldsWithRules = {
    nameClient: { rules: [checkRequired, checkClientDescription, checkMaxLength(50)] },
    participation: { rules: [checkRequired, checkNumberInRange(0, 100)] },
    term: { rules: [checkRequired, checkNumberInRange(0, 9999)] },
    relevantInformation: { rules: [checkClientDescription] }
}

const fields = _.keys(fieldsWithRules);

const validate = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};

export default reduxForm({
    form: 'formMainClients',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(Wrapper);