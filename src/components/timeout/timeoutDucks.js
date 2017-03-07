import { APP_URL, INIT_INPUT_EVENTS, STOP_INPUT_EVENTS, UPDATE_INPUT_EVENT, SEND_INPUT_EVENT, CLEAN_INPUT_EVENT } from '../../constantsGlobal';
import {redirectUrl} from '../globalComponents/actions';
import get from 'lodash/get';
import moment from 'moment';
import * as Rx from 'rxjs';
import axios from 'axios';

const MINUTES_BEFORE = 7;

function getLastDateToken() {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionToken')
        },
        messageBody: ""
    }
    var request = axios.post(APP_URL + "/updateSessionLastDate", json);
    return request;
}

const initialState = {
    timeout: undefined,
    lastDateUpdate: null
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CLEAN_INPUT_EVENT:
        case SEND_INPUT_EVENT:
            const newState = Object.assign({}, state, { lastDateUpdate: action.lastDateUpdate, timeout: action.timeout });
            return newState;
        default:
            return state;
    }
}

function createTimeout(action, lastDateUpdate, time) {
    const timeout = setTimeout(action, time);
    return {
        type: SEND_INPUT_EVENT,
        timeout,
        lastDateUpdate
    };
}

function createClearTimeout(id) {
    return {
        type: CLEAN_INPUT_EVENT,
        timeout: clearTimeout(id)
    };
}

function getNext(data) {
    return moment(data).subtract(MINUTES_BEFORE, 'minutes').diff(moment());
}

export const inputEventsEpic = (action$, store) => action$
    .ofType(INIT_INPUT_EVENTS)
    .flatMap(action => {
        const key$ = Rx.Observable.fromEvent(document, 'keypress').mapTo("keypress");
        const mouse$ = Rx.Observable.fromEvent(document, 'mousemove').mapTo("mousemove");
        return Rx.Observable.merge(key$, mouse$)
            .debounce(() => Rx.Observable.interval(10000))
            .flatMap(event => {
                const timeoutVal = get(store.getState(), 'leftTimer.timeout');
                const promise = getLastDateToken();
                const functionShowAlert = () => {
                    alert("Señor usuario, el tiempo de sesión expirará en " + MINUTES_BEFORE + " minutos");
                    if( moment(get(store.getState(), 'leftTimer.lastDateUpdate')).isBefore(moment()) ){
                        redirectUrl("/login");
                    }
                };
                const observableToken = Rx.Observable.fromPromise(promise)
                    .map(response => response.data)
                    .map(token => createTimeout(functionShowAlert, token.data, getNext(token.data)))
                    .startWith(createClearTimeout(timeoutVal));
                return observableToken;
            })
            .takeUntil(action$.ofType(STOP_INPUT_EVENTS));
    });