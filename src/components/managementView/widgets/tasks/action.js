import axios from 'axios';
import moment from "moment";
import { TASK_BOARD_VALUES, GET_INFORMATION_USER } from './constants';
import { APP_URL } from '../../../../constantsGlobal';

const getBody = () => ({
    messageHeader: {
        sessionToken: window.localStorage.getItem('sessionTokenFront')
    },
    messageBody: {
        filter: {
            createDateFrom: moment(moment().subtract(3, 'months'), "DD/MM/YYYY").toDate().getTime(),
            createDateTo: moment(moment(), "DD/MM/YYYY").toDate().getTime()
        }
    }
});

export const getTaskBoardValues = () => ({
    type: TASK_BOARD_VALUES,
    payload: axios.post(APP_URL + "/taskBoardValues", getBody())
});


export const getInformationUser = () => ({
    type: GET_INFORMATION_USER,
    payload: axios.post(APP_URL + "/getUserInSession", {
        messageHeader: {
            sessionToken: window.localStorage.getItem('sessionTokenFront')
        },
        messageBody: null
    })
});
