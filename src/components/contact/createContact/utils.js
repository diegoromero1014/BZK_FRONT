import Immutable from 'immutable';
import _ from 'lodash';

export function createFieldsStatusSet(fields, order) {
    let setToReturn = Immutable.OrderedMap();
    _.map(order, key => {
        setToReturn = setToReturn.set(key, _.get(fields, key));
    });
    return setToReturn;
}

export function createErrorsPriority(orderedSet) {
    const itemKey = orderedSet.findKey(value => value.invalid);
    return orderedSet
        .map((item, key) => {
            return _.assign({}, item, {
                shouldHandleError: item.invalid && _.isEqual(itemKey, key)
            });
        });
}

export function shouldHandleError(mapSet, key) {
    return _.get(mapSet.get(key), 'shouldHandleError', false);
}