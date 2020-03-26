import {GET_ASSISTANTS_USER} from "./constants";
import Immutable from "immutable";

const initialState = Immutable.Map({
    userAssistants: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSISTANTS_USER:
            const response = action.payload.data;
            console.log(response);
            return state.withMutations(map => {
                map.set('userAssistants', response)
            });
        default:
            return state;
    }
}