import { GET_ALL_QUESTIONS, ADD_ANSWER } from "./constants"

const initialState = {
    questions: [],
    answers: {}
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_ALL_QUESTIONS:
            return Object.assign(state, { questions: payload.data.data });
        case ADD_ANSWER:
            return Object.assign({}, state, { answers: Object.assign({}, state.answers, payload) });
        default:
            return state;
    }
}
