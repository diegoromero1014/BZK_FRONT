import Immutable from 'immutable';
import * as actions from './constants';
import { get } from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    responseAEC: [],
    detailAEC: {}
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.GET_ASSETS_AEC:
            const response = get(action.payload, 'data', []);
            return state.withMutations(map => {
                map.set('status', 'processed')
                    .set('responseAEC', get(response, 'data', []));
            });
        case actions.DET_DETAIL_AEC:
        console.log('action', action);
            const responseDetailAEC = get(action.payload, 'data', []);
            return state.set('detailAEC', responseDetailAEC);
        case actions.CLEAR_AEC:
            return state.set('detailAEC', {});
        default:
            return state;
    }
}
