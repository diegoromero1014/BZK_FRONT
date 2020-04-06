import axios from 'axios';
import moment from "moment";
import { TASK_BOARD_VALUES } from './constants';
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


