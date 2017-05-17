import Immutable from 'immutable';
import { UPDATE_EVENT_ERRORS, SAVE_STRUCTURED_DELIVERY, STRUCTURED_DELIVERY_DETAIL } from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
    eventErrors: null,
    structuredDeliveryDetail: null,
    responseSaveStructuredDelivery: null
});

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_EVENT_ERRORS:
            return state.set("eventErrors", action.payload);
        case SAVE_STRUCTURED_DELIVERY:
            return state.set('responseSaveStructuredDelivery', action.payload.data);
        case STRUCTURED_DELIVERY_DETAIL:
            return state.set('structuredDeliveryDetail', action.payload.data);
        default:
            return state;
    }
}
