import * as constants from './constantsGlobal';
import axios from 'axios';
import {REVIEWED_DATE_FORMAT} from './constantsGlobal';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

export function consultParameterServer(tagConsult){
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
   return{
     type: constants.CONSULT_PARAMETER_NAME,
     payload: request
   }
}

export function changeValueActiveLog(value){
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
   return{
     type: constants.CHANGE_VALUE_LOGS,
     payload: request
   }
}

export function consultValueActiveLog(){
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
   return{
     type: constants.CONSULT_VALUE_LOGS,
     payload: request
   }
}

export function nonValidateEnter(value){
  return {
    type: constants.NON_VALIDATE_ENTER,
    payload: value
  }
}

export function formValidateKeyEnter(e, validate){
  if( (e.keyCode === 13 || e.which === 13) && validate){
    e.preventDefault();
  }
}

export function validatePermissionsByModule(module){
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
   return{
     type: module,
     payload: request
   }
}

export function shorterStringValue(element){
  return element.length > 50 ? element.substring(0, 50) + "..." : element;
}

export function formatNumeral(number, format) {
     let numberNumeral = numeral(number);
    return numberNumeral.format(format);
}


export function mapDateValueFromTask(date){
  if( moment(date, [REVIEWED_DATE_FORMAT], 'es', true).isValid() ){
    return date;
  } else {
    return moment(date).locale('es').format(REVIEWED_DATE_FORMAT);
  }
}

export function getStrDateByDatFormat(date,format){
         const formatDefault =  _.isEmpty(format) ?'DD/MM/YYYY': format;
        return moment(date, formatDefault).locale('es').format(REVIEWED_DATE_FORMAT);
}

export function handleBlurValueNumber(typeValidation, valuReduxForm, val, allowsDecimal, lengthDecimal) {
  //Elimino los caracteres no validos
  for (var i = 0, output = '', validos = "-0123456789."; i < (val + "").length; i++){
   if (validos.indexOf(val.toString().charAt(i)) !== -1){
      output += val.toString().charAt(i)
    }
  }
  val = output;

  /* Si typeValidation = 2 es por que el valor puede ser negativo
     Si typeValidation = 1 es por que el valor solo pueder ser mayor o igual a cero
  */
  var decimal = '';
  if(val.includes(".")){
    var vectorVal = val.split(".");
    if(allowsDecimal){
      val = vectorVal[0] + '.';
      if(vectorVal.length > 1){
        decimal = vectorVal[1].substring(0, lengthDecimal);
      }
    }else{
      val = vectorVal[0];
    }
  }

  if( typeValidation === constants.ALLOWS_NEGATIVE_INTEGER ) { //Realizo simplemente el formateo
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(val)){
      val = val.replace(pattern, "$1,$2");
    }
    valuReduxForm.onChange(val + decimal);
  } else { //Valido si el valor es negativo o positivo
    var value = numeral(valuReduxForm.value).format('0');
    if( value >= 0 ){
      pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(val)){
        val = val.replace(pattern, "$1,$2");
      }
      valuReduxForm.onChange(val + decimal);
    } else {
      valuReduxForm.onChange("");
    }
  }
}
