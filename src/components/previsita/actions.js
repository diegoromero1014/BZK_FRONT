import {APP_URL} from '../../constantsGlobal';
import axios from 'axios';

export function pdfDescarga(idclient, idVisit){
  window.open(APP_URL + "/pdfReportVisit?idClient="+idclient+"&idPreVisit="+idVisit+"&language=es");
}
