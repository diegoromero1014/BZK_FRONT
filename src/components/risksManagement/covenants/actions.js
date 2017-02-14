/**
 * Created by IAS-ASUS on 2/2/2017.
 */

import {APP_URL} from '../../../constantsGlobal';
import {CLIENTS_COVENANTS} from './constants';
import axios from 'axios';

export function clientCovenants() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionToken'),
            "timestamp": new Date().getTime(),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        },
        "messageBody": {
            "keyWordNameNit": null,
            "idTeam": null,
            "idRegion": null,
            "idZone": null,
            "pageNum": 1,
            "maxRows": 10,
            "order" : 0,
            "columnOrder" : null
        }
    };

    // const request = axios.post(APP_URL + "/getClientsPendingUpdateAlert", json);
    const request = {"validateLogin":true,"status":200,"data":{"rowCount":2038,"rows":[{"idClient":4936677,"typeDocument":"NIT","idNumberClient":"900100246","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 47","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615676295},{"idClient":4937091,"typeDocument":"NIT","idNumberClient":"900100466","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 267","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615692176},{"idClient":4937120,"typeDocument":"NIT","idNumberClient":"900100491","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 292","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615694284},{"idClient":4937129,"typeDocument":"NIT","idNumberClient":"900100501","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 302","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615695697},{"idClient":4937289,"typeDocument":"NIT","idNumberClient":"900100596","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 397","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615705393},{"idClient":4937367,"typeDocument":"NIT","idNumberClient":"900100646","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 447","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615713293},{"idClient":4937377,"typeDocument":"NIT","idNumberClient":"900100651","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 452","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615713962},{"idClient":4937508,"typeDocument":"NIT","idNumberClient":"900100726","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 527","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615723145},{"idClient":4937531,"typeDocument":"NIT","idNumberClient":"900100736","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 537","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615724800},{"idClient":4937567,"typeDocument":"NIT","idNumberClient":"900100751","clientName":"CLIENTE PRUEBA AYAX EN DESARROLLO 552","team":"c2","region":"Antioquia","zone":"Zona 1","lastUpdateDate":1454615726942}]}};
    return {
        type: CLIENTS_COVENANTS,
        payload: request
    }
}