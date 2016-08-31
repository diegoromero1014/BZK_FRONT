import Immutable from 'immutable';
import _ from 'lodash';

export function createErrorsPriority(fields, order) {
    let errorMap = Immutable.OrderedMap();
    _.map(order, key => {
        errorMap = errorMap.set(key, _.get(fields, key));
    });
    const itemKey = errorMap.findKey(value => value.invalid);
    return errorMap
        .map((item, key) => {
            return _.assign({}, item, {
                shouldHandleError: item.invalid && _.isEqual(itemKey, key)
            });
        });
}

export function shouldHandleError(mapSet, key) {
    return _.get(mapSet.get(key), 'shouldHandleError', false);
}