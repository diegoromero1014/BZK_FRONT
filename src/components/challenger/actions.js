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

export const clearAnswer = () => ({ type: CLEAR_ANSWER })
