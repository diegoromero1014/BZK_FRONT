import {shorterStringValue, mapDateValueFromTask} from '../../../actionsGlobal';
import {DELETE_TYPE_PREVISIT} from '../../previsita/constants';
import {DELETE_TYPE_VISIT} from '../../visit/constants';
import {DELETE_TYPE_PIPELINE} from '../../pipeline/constants';
import {DELETE_TYPE_BUSINESS_PLAN} from '../../businessPlan/constants';
import {STATUS_DRAFT_DOCUMENT, PREVISITA, VISITA, PIPELINE} from './constants';

export function validateDocumentLink(typeDocument){
  if( typeDocument === PREVISITA ){
    return "VIEW_PREVISIT";
  } else if( typeDocument === VISITA ){
    return "VIEW_VISIT";
  } else if( typeDocument === PIPELINE ){
    return "VIEW_PIPELINE";
  } else {
    return "VIEW_BUSINESS_PLAN";
  }
}

export function validateTypeDelete(typeDocument){
  if( typeDocument === PREVISITA ){
    return DELETE_TYPE_PREVISIT;
  } else if( typeDocument === VISITA ){
    return DELETE_TYPE_VISIT;
  } else if( typeDocument === PIPELINE ){
    return DELETE_TYPE_PIPELINE;
  } else {
    return DELETE_TYPE_BUSINESS_PLAN;
  }
}

export function validateTypeDeleteJson(typeDocument){
  if( typeDocument === PREVISITA ){
    return 'PRE_VISIT';
  } else if( typeDocument === VISITA ){
    return 'VISIT';
  } else if( typeDocument === PIPELINE ){
    return 'PIPELINE';
  } else {
    return 'BUSINESS_PLAN';
  }
}

export function validateUrlRedirect(typeDocument){
  if( typeDocument === PREVISITA ){
    return '/dashboard/previsita';
  } else if( typeDocument === VISITA ){
    return '/dashboard/visitaEditar';
  } else if( typeDocument === PIPELINE ){
    return '/dashboard/pipelineEdit';
  } else {
    return '/dashboard/businessPlanEdit';
  }
}

export function validateTypeClickDetails(typeDocument){
  if( typeDocument === PREVISITA ){
    return 'previsita';
  } else if( typeDocument === VISITA ){
    return 'visita';
  } else if( typeDocument === PIPELINE ){
    return 'pipeline';
  } else {
    return 'businessPlan';
  }
}

export function validatePermissionView(typeDocument, viewPrevisit, viewVisit, viewPipeline, viewBusinessPlan){
  if( typeDocument === PREVISITA ){
    return viewPrevisit;
  } else if( typeDocument === VISITA ){
    return viewVisit;
  } else if( typeDocument === PIPELINE ){
    return viewPipeline;
  } else {
    return viewBusinessPlan;
  }
}

export function validatePermissionDelete(typeDocument, deletePrevisit, deleteVisit, deletePipeline, deleteBusinessPlan){
  if( typeDocument === PREVISITA ){
    return deletePrevisit;
  } else if( typeDocument === VISITA ){
    return deleteVisit;
  } else if( typeDocument === PIPELINE ){
    return deletePipeline;
  } else {
    return deleteBusinessPlan;
  }
}

export const mapDataGrid = (data = [], viewPrevisit, viewVisit, viewPipeline, viewBusinessPlan,
  deletePrevisit, deleteVisit, deletePipeline, deleteBusinessPlan) => {
    return data.map(item=> ({
      actionsRedirect: {
        actionView: true,
        id: item.id,
        idClient: item.idClient,
        typeClickDetail: validateTypeClickDetails(item.typeDocument),
        ownerDraft: STATUS_DRAFT_DOCUMENT,
        urlRedirect: validateUrlRedirect(item.typeDocument),
        component: validateDocumentLink(item.typeDocument),
        urlServer: "./component",
        permissionsView: validatePermissionView(item.typeDocument, viewPrevisit, viewVisit, viewPipeline, viewBusinessPlan)
      },
      typeDocument: item.typeDocument,
      idTypeClient: item.idTypeClient,
      idNumberClient  : item.idNumberClient,
      clientName: shorterStringValue(item.clientName),
      title: item.clientName,
      status: item.status,
      createDate: mapDateValueFromTask(item.createDate),
      updateDate: item.updateDate === null ? "" : mapDateValueFromTask(item.updateDate),
      'delete': {
        actionDelete: true,
        urlServer: '/deleteEntity',
        typeDelete: validateTypeDelete(item.typeDocument),
        permissionsDelete: validatePermissionDelete(item.typeDocument, deletePrevisit, deleteVisit, deletePipeline, deleteBusinessPlan),
        mensaje: "Señor usuario ¿está seguro que desea eliminar el informe?",
        json: {
  				'messageHeader': {
  					'sessionToken': window.localStorage.getItem('sessionTokenFront'),
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
