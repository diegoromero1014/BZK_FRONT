
import {
    checkRequired,
    checkRegexHtmlInjection,
    checkFirstCharacter,
    checkPatternClientObjective
} from '../../../validationsFields/rulesField';

let validations = {
    value: {rules: [checkRequired, checkFirstCharacter, checkRegexHtmlInjection, checkPatternClientObjective]}
}

export default validations;