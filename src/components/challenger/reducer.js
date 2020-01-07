import { GET_ALL_QUESTIONS, ADD_ANSWER, CLEAR_ANSWER } from "./constants"

const initialState = {
    questions: [],
    answers: []
}

export default ({ type, payload }, state = initialState) => {
    switch (type) {
        case GET_ALL_QUESTIONS:
            return Object.assign({}, state, { questions: payload.data.data });
        case ADD_ANSWER:
            let answers = state.answers;

            if(payload.oldAnswer) {
                answers = answers.filter(answer =>  answer.id !== payload.oldAnswer.id);    
            }
                
            answers.push(payload.newAnswer);
            
            return Object.assign({}, state, { answers: Object.assign([], answers) } );
        case CLEAR_ANSWER:
            return Object.assign({}, state, { answers: [] });
        default:
            return state;
    }
}
