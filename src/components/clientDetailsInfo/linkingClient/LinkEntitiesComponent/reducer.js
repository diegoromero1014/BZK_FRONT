/**
 * Created by Andres Hurtado on 16/03/2017.
 */
import Immutable from 'immutable';
import {UPDATE_ENTITY, CREATE_ENTITY, DELETE_ENTITY, SET_ENTITIES, CLEAR_ENTITIES} from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ENTITY:
            const entityToUpdate = state.find(item => item.uid === action.index);
            const indexEntityToUpdate = state.findIndex(item => item.uid === action.index);
            return state.set(indexEntityToUpdate, _.set(entityToUpdate, action.prop, action.value));
        case CREATE_ENTITY:
            const newNote = _.assign({}, {
                traderCode: '',
                entity: '',
                uid: action.uid
            });
            return state.push(newNote);
        case DELETE_ENTITY:
            const index = state.findIndex(item => item.uid === action.index);
            return state.delete(index);
        case SET_ENTITIES:
            const notes = action.notes;
            return state.withMutations(list => {
                notes.map(item => {
                    const uid = _.uniqueId('entity_');
                    list.push({
                        uid,
                        traderCode: item.traderCode,
                        entity: String(item.entity)
                    })
                });
            });
        case CLEAR_ENTITIES:
            return state.clear();
        default:
            return state;
    }
}