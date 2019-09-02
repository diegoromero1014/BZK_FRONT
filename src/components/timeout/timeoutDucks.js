import { APP_URL, INIT_INPUT_EVENTS, STOP_INPUT_EVENTS, UPDATE_INPUT_EVENT, SEND_INPUT_EVENT, CLEAN_INPUT_EVENT } from '../../constantsGlobal';
import {redirectUrl} from '../globalComponents/actions';
import get from 'lodash/get';
import moment from 'moment';
import * as Rx from 'rxjs';
import axios from 'axios';
import { last } from 'rxjs/operator/last';
import {onSessionExpire} from '../../actionsGlobal'

// Cuantos minutos antes de terminar sesion se desea enviar el mensaje de alerta
const MINUTES_BEFORE = 7;

function getLastDateToken() {
    const json = {
        messageHeader: {
            "timestamp": new Date().getTime(),
            "sessionToken": window.localStorage.getItem('sessionTokenFront')
        },
        messageBody: window.localStorage.getItem('sessionTokenFront')
    }
    var request = axios.post(APP_URL + "/updateSessionLastDate", json)
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

/**
 * Funcion que devuelve el tiempo en milisegundos para lanzar la alerta de que faltan MINUTES_BEFORE que se acabe la sesion
 * @param {Tiempo en milisegundos} data 
 */
function getNext(data) {
    return moment(data).subtract(MINUTES_BEFORE, 'minutes').diff(moment());
}

export const inputEventsEpic = (action$, store) => action$
    .ofType(INIT_INPUT_EVENTS)
    .flatMap(action => {
        const key$ = Rx.Observable.fromEvent(document, 'keypress').mapTo("keypress");
        const mouse$ = Rx.Observable.fromEvent(document, 'mousemove').mapTo("mousemove");
        //throttle porque limita el numero de peticiones a maximo 1 cada 6 minutos (360000 milisegundos)
        return Rx.Observable.merge(key$, mouse$)
            .throttle(() => Rx.Observable.interval(360000))
            .flatMap(event => {
                const timeoutVal = get(store.getState(), 'leftTimer.timeout');
                const promise = getLastDateToken().then((data) => {
                    if (!_.get(data.data, 'validateLogin', false)) {
                        createClearTimeout(timeoutVal);
                        onSessionExpire();
                        return {};
                    } else {
                        return data;
                    }
                });

                // Funcion que se ejecuta cuando falten MINUES_BEFORE antes que se acabe la sesion
                const functionShowAlert = () => {
                    alert("Señor usuario, el tiempo de sesión expirará en " + MINUTES_BEFORE + " minutos");
                    //Este if se ejecuta cuando el usuario da click en el boton aceptar de la alerta
                    if( moment(get(store.getState(), 'leftTimer.lastDateUpdate')).isBefore(moment()) ){
                        //Se vencio el tiempo de sesion
                        onSessionExpire();
                    }
                };

               
                //Crea el timeout que llamara la funcion cuando falten MINUTES_BEFORE para terminar la sesion
                const observableToken = Rx.Observable.fromPromise(promise)
                    .map(response => response.data)
                    .map(token => createTimeout(functionShowAlert, token.data, getNext(token.data)))
                    .startWith(createClearTimeout(timeoutVal));
                return observableToken;
            })
            .takeUntil(action$.ofType(STOP_INPUT_EVENTS));
    });