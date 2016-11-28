import moment from 'moment';
import get from 'lodash/get';
import flow from 'lodash/flow';
import {REVIEWED_DATE_FORMAT} from '../../constantsGlobal';
import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';
import {DELETE_TYPE_PREVISIT} from '../previsita/constants';
import {DELETE_TYPE_VISIT} from '../visit/constants';
import {DELETE_TYPE_PIPELINE} from '../pipeline/constants';
import {DELETE_TYPE_BUSINESS_PLAN} from '../businessPlan/constants';

export function validateDocumentLink(typeDocument){
  if( typeDocument === "Previsita" ){
    return "VIEW_PREVISIT";
  } else if( typeDocument === "Visita" ){
    return "VIEW_VISIT";
  } else if( typeDocument === "Pipeline" ){
    return "VIEW_PIPELINE";
  } else {
    return "VIEW_BUSINESS_PLAN";
  }
}

export function validateTypeDelete(typeDocument){
  if( typeDocument === "Previsita" ){
    return DELETE_TYPE_PREVISIT;
  } else if( typeDocument === "Visita" ){
    return DELETE_TYPE_VISIT;
  } else if( typeDocument === "Pipeline" ){
    return DELETE_TYPE_PIPELINE;
  } else {
    return DELETE_TYPE_BUSINESS_PLAN;
  }
}

export function validateTypeDeleteJson(typeDocument){
  if( typeDocument === "Previsita" ){
    return 'PRE_VISIT';
  } else if( typeDocument === "Visita" ){
    return 'VISIT';
  } else if( typeDocument === "Pipeline" ){
    return 'PIPELINE';
  } else {
    return 'BUSINESS_PLAN';
  }
}

export const mapDataGrid = (data = []) => {
  return data.map(item => ({
    actions: {
      actionView: true,
      id: item.id,
      urlServer: "./component",
      ownerDraft: item.id,
      component : validateDocumentLink(item.typeDocument)
    },
    typeDocument: item.typeDocument,
    idTypeClient: item.idTypeClient,
    idNumberClient  : item.idNumberClient,
    clientName: shorterStringValue(item.clientName),
    status: item.status,
    createDate: mapDateValueFromTask(item.createDate),
    updateDate: item.updateDate === null ? "" : mapDateValueFromTask(item.updateDate),
    'delete': {
      actionDelete: true,
      urlServer: '/deleteEntity',
      typeDelete: validateTypeDelete(item.typeDocument),
      mensaje: "Señor usuario ¿está seguro que desea eliminar el informe?",
      json: {
				'messageHeader': {
					'sessionToken': window.localStorage.getItem('sessionToken'),
					'timestamp': new Date().getTime(),
					'service': '',
					'status': '0',
					'language': 'es',
					'displayErrorMessage': '',
					'technicalErrorMessage': '',
					'applicationVersion': '',
					'debug': true,
					'isSuccessful': true
				},
				'messageBody': {
					'entity': validateTypeDeleteJson(item.typeDocument),
					'id': item.id
				}
			}
    }
  }));
};
