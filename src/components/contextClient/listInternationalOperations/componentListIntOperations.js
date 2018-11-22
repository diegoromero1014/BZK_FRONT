import { reduxForm } from 'redux-form';
import _ from "lodash";

import {mapDispatchToProps, mapStateToProps} from './component';
import Wrapper from './wrapper';
import {
    checkRequired, processRules, checkClientDescription,
    checkNumberInRange, checkFirstCharacter
} from '../../../validationsFields/rulesField';

const fieldsWithRules = {
    typeOperation: { rules: [checkRequired] },
    participation: { rules: [checkRequired, checkNumberInRange(0, 100)] },
    descriptionCoverage: { rules: [checkClientDescription, checkFirstCharacter] },
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