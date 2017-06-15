import * as constants from './constantsGlobal';
import axios from 'axios';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import { redirectUrl } from './components/globalComponents/actions';

export function consultParameterServer(tagConsult) {
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
            "name": tagConsult
        }
    }

    var request = axios.post(constants.APP_URL + "/getParameterByName", json);
    return {
        type: constants.CONSULT_PARAMETER_NAME,
        payload: request
    }
}

export function changeValueActiveLog(value) {
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
            "module": module,
            "typeApp": constants.FRONT_APP
        }
    };

    var request = axios.post(constants.APP_URL + "/validatePermissionsModule", json);
    return {
        type: module,
        payload: request
    }
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

export function getStrDateByDateFormat(date, format) {
    const formatDefault = _.isEmpty(format) ? constants.DATE_FORMAT : format;
    return moment(date, formatDefault).locale('es').format(constants.REVIEWED_DATE_FORMAT);
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
        valuReduxForm.onChange(val + decimal);
    } else { //Valido si el valor es negativo o positivo
        var value = numeral(valuReduxForm.value).format('0');
        if (value >= 0) {
            pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(val)) {
                val = val.replace(pattern, "$1,$2");
            }
            valuReduxForm.onChange(val + decimal);
        } else {
            valuReduxForm.onChange("");
        }
    }
}

export function formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }
    return numeral(value).format('0,000');
}

export function validateResponse(response) {
    if (!_.get(response, 'payload.data.validateLogin') || _.get(response, 'payload.data.validateLogin') === 'false') {
        redirectUrl("/login");
    } else {
        if ((_.get(response, 'payload.data.status') === constants.REQUEST_ERROR)) {
            return false;
        }
    }
    return true;
}

/**
 * Valida que una cadena sea diferente de null, vacío e indefinido.
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
    return _.isUndefined(value) || _.isNull(value) ? false : true;
}