import { executeFunctionIf } from './browserValidation';

export function executePromiseIf(condition, asyncFunction, doable, onError) {

    let executeCondition;
    let executeDoable;

    if (typeof condition === 'function' ) {
        executeCondition = condition;
    } else if (typeof condition === 'boolean') {
        executeCondition = () => condition
    } else {
        return;
    }

    if (typeof doable === 'function') {
        executeDoable = doable;
    } else {
        executeDoable = () => {};
    }

    executeFunctionIf(executeCondition, () => asyncFunction().then((...args) => executeDoable(...args)), onError);
}