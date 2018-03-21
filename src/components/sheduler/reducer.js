import Immutable from 'immutable';
import { GET_REGIONS, GET_SCHEDULER_PREVISIT, CLEAR_SCHEDULER_PREVISIT } from "./constants";
import { stringToDate, stringToDateEnd } from "../../actionsGlobal";

const initialState = Immutable.Map({
    schedulerPrevisitList: [],
    regionsByEmployee: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SCHEDULER_PREVISIT:
            const response = action.payload.data;
            let lista = JSON.parse(response.schedulerListPreviist);
           return state.set('schedulerPrevisitList', lista.map((item) => {
                item.title = item.clientName;
                item.start = stringToDate(item.initialDatePrevisit);// new Date();
                item.end =  stringToDateEnd(item.initialDatePrevisit);//new Date();

                console.log(JSON.stringify(item));
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