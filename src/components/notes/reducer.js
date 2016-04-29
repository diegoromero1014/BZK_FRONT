import Immutable from 'immutable';
import {UPDATE_NOTE, CREATE_NOTE, DELETE_NOTE} from './constants';
import _ from 'lodash';


const initialState = Immutable.OrderedMap();

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_NOTE:
        const note = state.get(action.index);
        _.set(note, action.prop, action.value);
        return state.set(action.index, note);
    case CREATE_NOTE:
        return state.set(action.uid, {body: '', combo: ''});
    case DELETE_NOTE:
        return state.delete(action.index);
    default:
        return state;
    }
}
