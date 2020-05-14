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
                const { payload: { filterCriteria, id } } = action;
                const newState = Object.assign({}, state, { filterMode: filterCriteria, id, title: "Filter cliente" })
                return newState
            }
        case FILTER_BY_RELATION:
            {
                const { payload: { filterCriteria, id } } = action;
                const newState = Object.assign({}, state, { filterMode: filterCriteria, id, title: "Filter Relation" })
                return newState
            }
        default:
            return state

    }

}