import Immutable from 'immutable';
import { GET_SURVEY_QUALITATIVE, SAVE_ANSWER, CLEAR_SURVEY, FIELDS_EDITABLES } from './constants';
import { get, sortBy, clone, remove } from 'lodash';
import { validateValueExist } from '../../../actionsGlobal';

const initialState = Immutable.Map({
    surveyCommercial: [],
    surveyAnalyst: [],
    listQuestionsCommercial: [],
    listQuestionsAnalyst: [],
    fieldsEditable: false
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_SURVEY_QUALITATIVE:
            const response = get(action.payload.data, 'data', []);
            const listQuestionsCommercial = [];
            const listQuestionsAnalyst = [];
            if (validateValueExist(response) && validateValueExist(response.listFactor)) {
                response.listFactor = sortSurvey(response.listFactor, false, listQuestionsCommercial, listQuestionsAnalyst);
            }
            const surveyAnalyst = clone(response);
            return state.withMutations(map => {
                map
                    .set('surveyCommercial', response)
                    .set('surveyAnalyst', surveyAnalyst)
                    .set('listQuestionsCommercial', listQuestionsCommercial)
                    .set('listQuestionsAnalyst', listQuestionsAnalyst);
            });
        case SAVE_ANSWER:
            return state.set(action.nameList, action.listQuestions);
        case FIELDS_EDITABLES:
            return state.set('fieldsEditable', action.value);
        case CLEAR_SURVEY:
            return state.withMutations(map => {
                map
                    .set('survey', [])
                    .set('listQuestions', [])
                    .set('fieldsEditable', false);
            });
        default:
            return state;
    }
}

function sortSurvey(listFactors, analyst, listQuestionsCommercial, listQuestionsAnalyst) {
    //Recorro la encuesta ordenando los factores, variables, preguntas y respuestas
    return sortBy(listFactors, (factor) => {
        factor.listVariables = sortBy(factor.listVariables, (variable) => {
            variable.listQuestion = sortBy(variable.listQuestion, (question) => {
                if (question.analyst) {
                    listQuestionsAnalyst.push(clone(question));
                } else {
                    listQuestionsCommercial.push(clone(question));
                }
                return question.order;
            });
            return variable.order;
        });
        return factor.order;
    });
}