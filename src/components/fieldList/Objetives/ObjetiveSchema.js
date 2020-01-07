
import {
    checkRequired,
    checkRegexHtmlInjection,
    checkFirstCharacter
} from '../../../validationsFields/rulesField';

let validations = {
    value: {rules: [checkRequired, checkFirstCharacter, checkRegexHtmlInjection]}
}

export default validations;