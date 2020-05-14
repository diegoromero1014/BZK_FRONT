import { FILTER_BY_CLIENTS, FILTER_BY_RELATION } from './constants';

const initialState = {
    filterMode: "",
    id: "",
    title: ""
}

export default (state = initialState, action = {}) => {

    switch (action.type) {

        case FILTER_BY_CLIENTS:
            {
                const { payload: { filterCriteria, id, title } } = action;
                const newState = Object.assign({}, state, { filterMode: filterCriteria, id, title })
                return newState
            }
        case FILTER_BY_RELATION:
            {
                const { payload: { filterCriteria, id, title } } = action;
                const newState = Object.assign({}, state, { filterMode: filterCriteria, id, title })
                return newState
            }
        default:
            return state

    }

}