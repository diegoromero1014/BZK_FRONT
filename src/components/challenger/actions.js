import axios from 'axios';
import { APP_URL } from '../../constantsGlobal';
import { GET_ALL_QUESTIONS, ADD_ANSWER, CLEAR_ANSWER } from './constants';

export const getAllQuestions = () => {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
        },
        "messageBody": ""
    };

    return { type: GET_ALL_QUESTIONS, payload: axios.post(APP_URL + "/questions/getAll", json) }
}

export const addAnswer = (oldAnswer, newAnswer) => ({ type: ADD_ANSWER , payload: { oldAnswer, newAnswer } });

export const getAnswerQuestionRelationship = (answers, questions) => {         
    return Object.keys(answers).map(key => ({
        id: questions.filter(question => question.field === key)[0].id,
        answer: answers[key]
    }))
}

export const clearAnswer = () => ({ type: CLEAR_ANSWER })
