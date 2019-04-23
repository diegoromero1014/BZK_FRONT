import Immutable from 'immutable';
import * as contants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
        case contants.ADD_USER:
            const user = action.data;

            const newUser = _.assign({}, {
                id: user.id,
                commercialReport: user.commercialReport,
                user: {
                    id: user.user.id,
                    username: user.user.username,
                    name: user.user.name
                }
            });
            return state.push(newUser);
        case contants.DELETE_USER:
            const orderDelete = state.get(action.index).order;
            const stateOrdered = state.delete(action.index);
            state.map(item => {
                if (item.order > orderDelete && item.tipoParticipante == action.tab) {
                    return _.set(item, 'order', item.order - 1);
                }
            });

            return stateOrdered;
        case contants.CLEAR_USER:
            return state.clear();
        case contants.FILTER_USER:
            return state;
        case contants.ADD_LIST_USER:
            return Immutable.List(action.listParticipant);
        default:
            return state;
    }
}