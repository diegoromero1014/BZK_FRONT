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
            const newEntity = _.assign({}, {
                traderCode: null,
                entity: '',
                uid: action.uid,
                entityText: ''
            });
            return state.push(newEntity);
        case DELETE_ENTITY:
            const index = state.findIndex(item => item.uid === action.index);
            return state.delete(index);
        case SET_ENTITIES:
            const entities = action.entitiesLinkedClient;
            return state.withMutations(list => {
                entities.map(item => {
                    const uid = _.uniqueId('entity_');
                    list.push({
                        uid,
                        traderCode: item.traderCode,
                        entity: String(item.entity),
                        entityText: String(item.entityText)
                    })
                });
            });
        case CLEAR_ENTITIES:
            return state.clear();
        default:
            return state;
    }
}
