import Immutable from 'immutable';
import { UPDATE_EVENT, CREATE_EVENT, DELETE_EVENT, SET_EVENTS, CLEAR_EVENTS } from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_EVENT:
            const eventToUpdate = state.find(item => item.uid === action.index);
            const indexEventToUpdate = state.findIndex(item => item.uid === action.index);
            return state.set(indexEventToUpdate, _.set(eventToUpdate, action.prop, action.value));
        case CREATE_EVENT:
            const newEvent = _.assign({}, {
                name: '',
                date: '',
                uid: action.uid
            });
            return state.push(newEvent);
        case DELETE_EVENT:
            const index = state.findIndex(item => item.uid === action.index);
            return state.delete(index);
        case SET_EVENTS:
            const events = action.events;
            return state.withMutations(list => {
                events.map(item => {
                    const uid = _.uniqueId('event_');
                    list.push({
                        uid,
                        name: item.name,
                        date: item.date
                    })
                });
            });
        case CLEAR_EVENTS:
            return state.clear();
        default:
            return state;
    }
}