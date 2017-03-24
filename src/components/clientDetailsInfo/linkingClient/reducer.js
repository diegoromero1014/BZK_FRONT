/**
 * Created by Andres Hurtado on 23/03/2017.
 */
import Immutable from 'immutable';
import {CONSULT_BLACK_LIST_CLIENT} from './actions';
import _ from 'lodash';

const initialState = Immutable.Map({
    level: '',
    message: ''
});

export default (state = initialState, action) => {
    switch (action.type) {
        case CONSULT_BLACK_LIST_CLIENT:
            // const response = action.payload.data.data;
            console.log("response blacklist Client action", action);
            const levelTest = "Alerta";
            const messageTest = "Quiere la boca exhausta vid, kiwi, piña y fugaz jamón. Fabio me exige, sin tapujos";
            return state.withMutations(map => {
                map.set('level', levelTest)
                    .set('message', messageTest);
            });
        default:
            return state;
    }
}

