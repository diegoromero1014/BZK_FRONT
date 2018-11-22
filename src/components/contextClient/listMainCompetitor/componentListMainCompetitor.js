import { reduxForm } from 'redux-form';
import _ from "lodash";

import {mapDispatchToProps, mapStateToProps} from './component';
import Wrapper from './wrapper';
import {
    checkRequired, processRules, checkClientDescription,
    checkNumberInRange, checkMaxLength, checkFirstCharacter
} from '../../../validationsFields/rulesField';

const fieldsWithRules = {
    nameCompetitor: { rules: [checkRequired, checkClientDescription, checkMaxLength(50), checkFirstCharacter] },
    participation: { rules: [checkRequired, checkNumberInRange(0, 100)] },
    observations: { rules: [checkClientDescription, checkFirstCharacter] }
}

const fields = _.keys(fieldsWithRules);

const validate = (formFields, props) => {
    return processRules(formFields, fieldsWithRules, props)
};

export default reduxForm({
    form: 'formMainCompetitors',
    fields,
    validate
}, mapStateToProps, mapDispatchToProps)(Wrapper);