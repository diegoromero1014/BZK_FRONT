/**
 * Created by ahurtado on 11/29/2016.
 */
import Immutable from 'immutable';
import {get} from 'lodash';
export const SHOW_LOADING = "SHOW_LOADING";

const initialState = Immutable.Map({
    showLoading: false,
    textLoading: 'Cargando..',
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SHOW_LOADING:
            return state.withMutations(map => {
                const textLoading = get(action, 'textLoading', 'Cargando..');
                map
                    .set('showLoading', action.show)
                    .set('textLoading', textLoading)
            });
            break;
        default:
            return state;
    }
}
