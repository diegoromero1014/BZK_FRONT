import { reduxForm } from 'redux-form';
import _ from "lodash";

import {mapDispatchToProps, mapStateToProps} from './component';
import Wrapper from './reduxFormWrapper';
import {
    checkRequired, processRules, checkClientDescription,
    checkNumberInRange, checkMaxLength
} from '../../../validationsFields/rulesField';

const fieldsWithRules = {
    typeOperation: { rules: [checkRequired] },
    participation: { rules: [checkRequired, checkNumberInRange(0, 100)] },
    descriptionCoverage: { rules: [checkClientDescription] },
    idCountry: { rules: [checkRequired] },
    participationCountry: { rules: [checkRequired, checkNumberInRange(0, 100)] }    
}

const fields = _.keys(fieldsWithRules);

const validate = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};

export default reduxForm({
    form: 'formListIntOperations',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(Wrapper);