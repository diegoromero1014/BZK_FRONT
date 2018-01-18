import Immutable from 'immutable';
import { GET_SCHEDULER_PREVISIT, CLEAR_SCHEDULER_PREVISIT } from "./constants";

const initialState = Immutable.Map({
    schedulerPrevisitList: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHEDULER_PREVISIT:
            const response = action.payload.data;
            let lista = JSON.parse(response.schedulerListPreviist);
            return state.withMutations(map => {
                map.set('schedulerPrevisitList', lista.map((item) => {
                    item.title = item.clientName;
                    item.start = new Date(item.initialDatePrevisit);
                    item.end = new Date(item.finalDatePrevisit);
                    return item;
                }));
            });
        case CLEAR_SCHEDULER_PREVISIT:
            const response2 = action.payload.data;
            let lista2 = JSON.parse(response2.schedulerListPreviist);
            return state.withMutations(map => {
                map.set('schedulerPrevisitList', lista2.map((item) => {
                    item.title = null
                    item.start = null
                    item.end = null
                    return item;
                }));
            });
        default:
            return state;
    }
};