import Immutable from 'immutable';
import {
    GET_SURVEY_QUALITATIVE, SAVE_ANSWER, CLEAR_SURVEY, FIELDS_EDITABLES, CAHNGE_VALUE_MODAL,
    GET_ALLOW_SURVEY_QUALITATIVE, GET_EXIST_PDF_VC
} from './constants';
import { get, sortBy, clone } from 'lodash';
import { validateValueExist } from '../../../actionsGlobal';

const initialState = Immutable.Map({
    survey: [],
    listQuestionsCommercial: [],
    listQuestionsAnalyst: [],
    fieldsEditable: false,
    isOpenModalSimulation: false
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
            return state.withMutations(map => {
                map
                    .set('survey', response)
                    .set('listQuestionsCommercial', listQuestionsCommercial)
                    .set('listQuestionsAnalyst', listQuestionsAnalyst);
            });
        case SAVE_ANSWER:
            return state.set(action.nameList, action.listQuestions);
        case FIELDS_EDITABLES:
            return state.set('fieldsEditable', action.value);
        case CAHNGE_VALUE_MODAL:
            return state.set('isOpenModalSimulation', action.value);
        case CLEAR_SURVEY:
            return state.withMutations(map => {
                map
                    .set('survey', [])
                    .set('listQuestions', [])
                    .set('fieldsEditable', false);
            });
        case GET_ALLOW_SURVEY_QUALITATIVE:
            const response_allow = get(action.payload.data, 'data', false);
            return state.set('allowSurveyQualitative', (response_allow == true));
        case GET_EXIST_PDF_VC:
            const responsePDFVC = get(action.payload.data, 'data', "");
            return state.withMutations(map => {
                map
                    .set("responsePDFVC", responsePDFVC);
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
                return question.orderQuestion;
            });
            return variable.orderVariable;
        });
        return factor.orderFactor;
    });
}