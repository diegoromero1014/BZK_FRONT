import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';

export function deleteServer(urlServer,json,typeDelete){
  console.log(urlServer);
  console.log(json);
  console.log(typeDelete);
  var request = axios.post(APP_URL + urlServer , json);
  return{
    type: typeDelete,
    payload: request
  }
}
