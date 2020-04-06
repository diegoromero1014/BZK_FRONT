import configureStore from '../store/store';

import { RANGO_PASO_PRODUCCION } from '../constantsParameters'
import { redirectUrl } from '../components/globalComponents/actions';
import { consultParameterServer } from '../actionsGlobal';
import { validateUpgrateProductionActive } from '../components/main/actions';


let interval;
let intervalStartRequest;

let initialDate;
let finalDate;

const store = configureStore();
const timeInterval = 10000;

/**
 *  make the request 
 *  for the start date of 
 *  [site under construction]
 */
function requestStartSiteUnderConstruction() {
    intervalStartRequest = setInterval(() => {
        const token = window.localStorage.getItem('sessionTokenFront');

        if (token) {
            clearInterval(intervalStartRequest);

            store.dispatch(consultParameterServer(RANGO_PASO_PRODUCCION)).then(resolve => {
                if (resolve && resolve.payload && resolve.payload.data) {
                    initializeRanges(resolve.payload.data);

                    if (new Date() <= finalDate && new Date() >= initialDate) {
                        startBlocking(new Date(initialDate.getTime() - timeInterval));
                        endBlocking(finalDate);
                    }
                }
            })
        }
    }, 10000);
}

/**
 * starts blocking depending
 * on the parameter
 * 
 * @param { date } moment 
 */
function startBlocking(moment) {
    const time = (moment.getTime() - ((new Date()).getTime()));

    setTimeout(startInterval, time);
}

/**
 * Blocking is completed 
 * according to the parameter.
 * 
 * @param { date } moment 
 */
function endBlocking(moment) {
    const time = (moment.getTime() - ((new Date()).getTime()));

    setTimeout(ending, time);
}

/**
 * Defines the interval in 
 * which requests are made.
 **/
function startInterval() {
    interval = setInterval(request, timeInterval);
}

/**
 * make the requests 
 * 
 */
function request() {
    store.dispatch(validateUpgrateProductionActive()).then(resolve => {
        if (resolve && resolve.payload && resolve.payload.data && resolve.payload.data.data) {
            const { data } = resolve.payload.data;

            if (data) {
                redirectUrl('/pageUnderConstruction')
            } else {
                ending();
            }
        }
    })
}

/**
 * initialize the dates
 *  
 * @param { Object } data 
 */
function initializeRanges(data) {
    if (data.data !== null && data.data !== "" && data.data !== undefined) {
        let value = data.data.value.split(" | ");

        initialDate = new Date(value[0]);
        finalDate = new Date(value[1]);
    }
}

/**
 * ends the interval 
 * and redirects
 */
function ending() {
    if (interval) {
        clearInterval(interval);
        redirectUrl('/login')
        location.reload();
    }
}

requestStartSiteUnderConstruction();

/**
 * the method that receives 
 * and broadcasts the message.
 */
const Worker = () => {
    self.addEventListener('message', event => {
        console.log(event.data);
    }, false)
}

export default Worker;


