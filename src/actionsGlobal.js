import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

import { redirectUrl } from './components/globalComponents/actions';
import * as constants from './constantsGlobal';

import {catchAction} from './utils/catchRequest';

export function consultParameterServer(tagConsult) {
    const messageBody = {
        "name": tagConsult
    };

    return catchAction(messageBody, '/getParameterByName', constants.CONSULT_PARAMETER_NAME, tagConsult);
    
}

export function setSecurityMessage(message) {
    return {
        type: constants.MESSAGE_SECURITY_FORM,
        message: message
    }
}

export function changeValueActiveLog(value) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
        "messageBody": value
    }

    var request = axios.post(constants.APP_URL + "/changeValueLog", json);
    return {
        type: constants.CHANGE_VALUE_LOGS,
        payload: request
    }
}

export function consultValueActiveLog() {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
            "timestamp": new Date().getTime(),
            "service": "",
            "status": "0",
            "language": "es",
            "displayErrorMessage": "",
            "technicalErrorMessage": "",
            "applicationVersion": "",
            "debug": true,
            "isSuccessful": true
        }
    }

    var request = axios.post(constants.APP_URL + "/consultValueLog", json);
    return {
        type: constants.CONSULT_VALUE_LOGS,
        payload: request
    }
}

export function nonValidateEnter(value) {
    return {
        type: constants.NON_VALIDATE_ENTER,
        payload: value
    }
}

export function formValidateKeyEnter(e, validate) {
    if ((e.keyCode === 13 || e.which === 13) && validate) {
        e.preventDefault();
    }
}

export function validatePermissionsByModule(module) {
    const json = {
            "module": module,
            "typeApp": constants.FRONT_APP
    };

    return catchAction(json, '/validatePermissionsModule', module, module);

}

export function shorterStringValue(element, minLength) {
    const lengthDafault = _.isUndefined(minLength) ? 50 : minLength;
    return element === null || element === undefined || element == '' ? '' : element.length > lengthDafault ? element.substring(0, lengthDafault) + "..." : element;
}

export function formatNumeral(number, format) {
    if (_.isNull(number)) {
        return '';
    } else {
        let numberNumeral = numeral(number);
        return numberNumeral.format(format);
    }
}

export function mapDateValueFromTask(date) {
    if (_.isNull(date)) {
        return "";
    } else {
        if (moment(date, [constants.REVIEWED_DATE_FORMAT], 'es', true).isValid()) {
            return date;
        } else {
            return moment(date).locale('es').format(constants.REVIEWED_DATE_FORMAT);
        }
    }

}

export function joinName(firstName, middleName, firstLastName, secondLastName) {
    var nameEntity = firstName;
    if (!_.isEmpty(middleName) && !_.isNull(middleName) && !_.isUndefined(middleName)) {
        nameEntity = nameEntity + " " + middleName;
    }
    nameEntity = nameEntity + " " + firstLastName;
    if (!_.isEmpty(secondLastName) && !_.isNull(secondLastName) && !_.isUndefined(secondLastName)) {
        nameEntity = nameEntity + " " + secondLastName;
    }
    return nameEntity;
}

export function mapDateValueFromTaskByFormat(date, format) {
    const defaultDate = _.isEmpty(format) ? constants.REVIEWED_DATE_FORMAT : format;
    if (moment(date, [defaultDate], 'es', true).isValid()) {
        return date;
    } else {
        return moment(date).locale('es').format(defaultDate);
    }
}

export function formatDateFromDDMMYYY(date, format) {
    const defaultDate = _.isEmpty(format) ? constants.REVIEWED_DATE_FORMAT : format;
    if (moment(date, [defaultDate], 'es', true).isValid()) {
        return date;
    } else {
        return moment(date, 'DD/MM/YYYY').locale('es').format(defaultDate);
    }
}

export function formatLongDateToDateWithNameMonth(date) {
    if (date !== null && date !== '' && date !== undefined) {
        var dateTaskFormat = moment(date).locale('es');
        return dateTaskFormat.format("DD") + " " + dateTaskFormat.format("MMM") + " " + dateTaskFormat.format("YYYY");
    } else {
        return date;
    }
}

export function formatLongDateToDateWithNameMonthAndHour(date) {
    if (date !== null && date !== '' && date !== undefined) {
        let dateTimestamp = moment(date, "x").locale('es');
        return dateTimestamp.format("DD") + " " + dateTimestamp.format("MMM") + " " + dateTimestamp.format("YYYY") + ", " + dateTimestamp.format("hh:mm a");
    } else {
        return '';
    }
}

export function stringToDate(dateString) {
    if (!dateString) return new Date();

    let arrFullDate = dateString.trim().split(" ");
    let arrDate = arrFullDate[0].split("-");
    let arrTime = arrFullDate[1].split(":");

    return new Date(
        parseInt(arrDate[0]), //year
        (parseInt(arrDate[1]) - 1), //mounth
        parseInt(arrDate[2]), //day
        parseInt(arrTime[0]), //hour
        parseInt(arrTime[1]), //minute
        parseInt(arrTime[2]) //seconds
    );
}
export function stringToDateEnd(dateString) {
    if (!dateString) return new Date();

    let arrFullDate = dateString.trim().split(" ");
    let arrDate = arrFullDate[0].split("-");
    let arrTime = arrFullDate[1].split(":");

    return new Date(
        parseInt(arrDate[0]), //year
        (parseInt(arrDate[1]) - 1), //mounth
        parseInt(arrDate[2]), //day
        parseInt(arrTime[0] + 1), //hour
        parseInt(arrTime[1]), //minute
        parseInt(arrTime[2]) //seconds
    );
}

export function handleFocusValueNumber(valuReduxForm, val) {
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
        if (validos.indexOf(val.toString().charAt(i)) !== -1) {
            output += val.toString().charAt(i)
        }
    }
    valuReduxForm.onChange(output);
}

export function handleBlurValueNumber(typeValidation, valuReduxForm, val, allowsDecimal, lengthDecimal) {
    //Elimino los caracteres no validos
    for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++) {
        if (validos.indexOf(val.toString().charAt(i)) !== -1) {
            output += val.toString().charAt(i)
        }
    }
    val = output;
    /* Si typeValidation = 2 es por que el valor puede ser negativo
     Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
     */
    var decimal = '';
    if (val.includes(".")) {
        var vectorVal = val.split(".");
        if (allowsDecimal) {
            val = vectorVal[0] + '.';
            if (vectorVal.length > 1) {
                decimal = vectorVal[1].substring(0, lengthDecimal);
            }
        } else {
            val = vectorVal[0];
        }
    }

    if (typeValidation === constants.ALLOWS_NEGATIVE_INTEGER) { //Realizo simplemente el formateo
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(val)) {
            val = val.replace(pattern, "$1,$2");
        }
        if (_.isNil(valuReduxForm)) {
            return (val + decimal);
        } else {
            valuReduxForm.onChange(val + decimal);
        }
    } else { //Valido si el valor es negativo o positivo
        
        var value = numeral(val).format('0');
        if (val !== '-' && value >= 0) {
            pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
            }
            if (_.isNil(valuReduxForm)) {
                return (val + decimal);
            } else {
                valuReduxForm.onChange(val + decimal);
            }
        } else {
            if (_.isNil(valuReduxForm)) {
                return "";
            } else {
                valuReduxForm.onChange("");
            }
        }
    }
}

export function formatCurrency(value, format) {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }
    var _format = validateValueExist(format) ? format : '0,000';
    return numeral(value).format(_format);
}

/**
 * Valida la respuesta de un servicio que utilice el DTO de MessageResponse
 * @param {*} response 
 */
export function validateResponse(response) {
    if (!_.get(response, 'payload.data.validateLogin') || _.get(response, 'payload.data.validateLogin') === 'false') {
        window.localStorage.setItem('sessionTokenFront', '');
        redirectUrl("/login");
    } else {
        if ((_.get(response, 'payload.data.status') === constants.REQUEST_ERROR) ||
          (_.get(response, 'payload.data.status') === constants.REQUEST_ERROR_XSS)||
          !validateWhileListResponse(response)) {
            return false;
        }
    }
    return true;
}

export function validateWhileListResponse(response) {
    return _.get(response, 'payload.data.status') !==  constants.REQUEST_INVALID_INPUT;
}

/**
 * Valida que una cadena sea diferente de null, vacío e indefinido, 
 * retorna verdadero si es diferente de todos los valores.
 * @param {*} value 
 */
export function stringValidate(value) {
    if (value !== '' && value !== undefined && value !== null) {
        return true;
    } else {
        return false;
    }
}

export function validateValueExist(value) {
    return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) ? false : true;
}

export function validateValue(value) {
    return !_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value) ? true : false;
}

export function validateIsNullOrUndefined(value) {
    return _.isUndefined(value) || _.isNull(value) ? true : false;
}

// converts HTML to text using Javascript
export function htmlToText(html) {
    const tag = document.createElement('div');
    tag.innerHTML = html;
    return tag.innerText.trim();
}

export function htmlToTextRegex(html) {
    const regex = RegExp(/(<([^>]+)>)/ig);
    return html.replace(regex, "");
}

export function getUserBlockingReport(idEntity, reportType) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
            "client_id": window.sessionStorage.getItem('idClientSelected'),
            "username": window.localStorage.getItem('userNameFront'),
            "report_id": idEntity,
            "report_type": reportType
        }

    }

    let request = axios.post(constants.APP_URL + '/getUserBlockingReport', json);

    return {
        type: constants.BLOCK_REPORT_CONSTANT,
        payload: request
    };
}

export function stopBlockToReport(idEntity, reportType) {
    const json = {
        "messageHeader": {
            "sessionToken": window.localStorage.getItem('sessionTokenFront'),
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
            "client_id": window.sessionStorage.getItem('idClientSelected'),
            "username": window.localStorage.getItem('userNameFront'),
            "report_id": idEntity,
            "report_type": reportType
        }

    }

    let request = axios.post(constants.APP_URL + '/deleteBlockedReport', json);

    return {
        type: constants.STOP_BLOCK_REPORT,
        payload: request
    };

}

export function xssValidation(value, isFullValidation) {
    let hasXss = false;

    let _value = String(value ? value : "").toLowerCase();

    if (!isFullValidation) {
        hasXss = eval(constants.REGEX_SIMPLE_XSS_STRING_TAG).test(_value);
        hasXss = hasXss || eval(constants.REGEX_SIMPLE_XSS_STRING_R_W).test(_value);
    } else {
        hasXss = eval(constants.REGEX_SIMPLE_XSS_STRING_SPECIFIC).test(_value);
        hasXss = hasXss || eval(constants.REGEX_SIMPLE_XSS_STRING_R_W).test(_value);
    }

    return hasXss;
}

export function onSessionExpire() {
    window.localStorage.setItem('sessionTokenFront', '');
    redirectUrl("/login");
}

export function replaceCommaInNumber(value) {
    if (_.isNil(value)) {
        return value;
    }

    if (typeof value == 'string') {
        return value.replace(',','');
    }

    return value;
}

/**
 * Ejecuta las funciones que se pasan como parametro
 * @param {[function]} rules 
 */
export function checkRules(rules, value) {
    let result;
    let errorMessage = null;
    _.forEach(rules, (rule) => {
        result = rule(value);
        if (!_.isEmpty(result)) {
            errorMessage = result;
            return;
        }
    });

    return errorMessage;
}