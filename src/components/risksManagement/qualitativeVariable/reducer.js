import Immutable from 'immutable';
import { GET_SURVEY_QUALITATIVE, SAVE_ANSWER } from './constants';
import { get, sortBy, clone } from 'lodash';
import { validateValueExist } from '../../../actionsGlobal';

const initialState = Immutable.Map({
    survey: [],
    listQuestions: [],
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SURVEY_QUALITATIVE:
            const response = get(action.payload.data, 'data', []);
            const listQuestions = [];
            if (validateValueExist(response) && validateValueExist(response.listFactor)) {
                //Recorro la encuenta ordenando los factores, variables, preguntas y respuestas
                response.listFactor = sortBy(response.listFactor, (factor) => {
                    factor.listVariables = sortBy(factor.listVariables, (variable) => {
                        variable.listQuestion = sortBy(variable.listQuestion, (question) => {
                            listQuestions.push(clone(question));
                            return question.order;
                        });
                        return variable.order;
                    });
                    return factor.order;
                });
            }
            return state.withMutations(map => {
                map
                    .set('survey', response)
                    .set('listQuestions', listQuestions);
            });
        case SAVE_ANSWER:
            return state.set('listQuestions', action.listQuestions);
        default:
            return state;
    }
}