import Immutable from 'immutable';
import { GET_REGIONS, GET_SCHEDULER_PREVISIT, CLEAR_SCHEDULER_PREVISIT } from "./constants";
import { stringToDate } from "../../actionsGlobal";

const initialState = Immutable.Map({
    schedulerPrevisitList: [],
    regionsByEmployee: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHEDULER_PREVISIT:
            let lista = JSON.parse(action.payload.data.data);
           return state.set('schedulerPrevisitList', lista.map((item) => {
                item.title = item.clientName;
                item.start = stringToDate(item.initialDatePrevisit);
                item.end =  stringToDate(item.finalDatePrevisit);

                return item;
            }));
        case CLEAR_SCHEDULER_PREVISIT:            
            return state.set('schedulerPrevisitList', []);
        case GET_REGIONS:
            const regions = action.payload.data;
            return state.withMutations(map => {
                map.set('regiosnList', regions)
            });
        default:
            return state;
    }
};