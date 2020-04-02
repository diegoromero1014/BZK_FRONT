import axios from 'axios';
import { TASK_BOARD_VALUES } from './constants';
import { APP_URL } from '../../../../constantsGlobal';

const getBody = () => ({
    "messageHeader": {
        "sessionToken": window.localStorage.getItem('sessionTokenFront')
    },
    "messageBody": {
        "filter": {
            "users": [
                1
            ],
            "createDateFrom": 1577985328040,
            "createDateTo": 1585847728188
        }
    }
});

export const getTaskBoardValues = () => ({
    type: TASK_BOARD_VALUES,
    payload: axios.post(APP_URL + "/taskBoardValues", getBody())
});


