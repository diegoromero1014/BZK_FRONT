import { CREATE_LIST, ADD_LIST, DELETE_LIST, CLEAN_LIST } from "./constants";

const initialState = {}
const defaultProps = {
    elements: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case CREATE_LIST:
            return Object.assign({}, state, { [payload]: Object.assign({}, defaultProps) });

        case ADD_LIST:
            let { data, name, old } = payload;

            const element = state[name];

            if(old) {
                element.elements = element.elements.filter(element => element !== old);
                data = Object.assign({}, payload.old, payload.data);
            }
            
            element.elements.push(data);

            return Object.assign({}, state, { [name]: Object.assign({}, element) });
        case DELETE_LIST:
            const list = state[payload.name];
            list.elements = list.elements.filter(element => element !== payload.data);

            return Object.assign({}, state, { [payload.name]: Object.assign({}, list) });
        case CLEAN_LIST:
            let newState = Object.assign({}, state);
            
            if(newState[payload]) {
                newState[payload].elements = [];
                defaultProps.elements = [];
            }
            
            return newState;
        default:
            return state
    }
}
