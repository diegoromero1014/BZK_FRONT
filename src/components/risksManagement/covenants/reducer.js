/**
 * Created by IAS-ASUS on 2/2/2017.
 */
import Immutable from 'immutable';
import * as actions from './constants';
import {get} from 'lodash';

const initialState = Immutable.Map({
    status: "withoutProcessing",
    keywordNameNit: "",
    idTeam: null,
    idRegion: null,
    idZone: null,
    pageNum: 1,
    order: 0,
    columnOrder: '',
    responseCovenant: [],
    totalClientsByFiltered: 0
});

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actions.CLIENTS_COVENANTS:
            const response = get(action.payload,'data',[]);
            return state.withMutations(map => {
                map
                    .set('status', 'processed')
                    .set('totalClientsByFiltered', get(response, 'rowCount',0))
                    .set('responseCovenant', get(response, 'rows',[]));
            });
        default:
            return state;
    }
}
