import moment from 'moment';
import {COLOR_TRAFFICT_RED, COLOR_TRAFFICT_ORANGE, COLOR_TRAFFICT_GREEN} from './constants';
import {REVIEWED_DATE_FORMAT} from '../../constantsGlobal';
import get from 'lodash/get';
import flow from 'lodash/flow';
import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';

export function getColor(date){
  const expirationDate = moment(date, 'DD MMM YYYY', 'es');
  const currentDate = moment().startOf('day');
  const beforeThreeDays = moment().startOf('day').subtract(2, 'days');
  const betweenDate = expirationDate.isBetween(beforeThreeDays, currentDate) || expirationDate.isSame(beforeThreeDays) || expirationDate.isSame(currentDate);
  if(currentDate.isAfter(expirationDate)){
    return COLOR_TRAFFICT_RED;
  } else if(betweenDate){
    return COLOR_TRAFFICT_ORANGE;
  } else {
    return COLOR_TRAFFICT_GREEN;
  }
}

export const mapDateColor = (date) => {
  const func = flow(mapDateValueFromTask, getColor);
  return func(date);
}

export const mapDataGrid = (data = []) => {
  return data.map(item => ({
    actions: {
      actionView: true,
      id: item.id,
      urlServer: "./component",
      component : "VIEW_TASK_ADMIN"
    },
    idTypeClient: item.idTypeClient,
    idNumberClient  : item.idNumberClient,
    clientName: item.clientName,
    title: item.resume,
    changeStateTask: {
      idTask: item.id,
      idStatus: item.idStatus
    },
    closeDate: mapDateValueFromTask(item.closeDate),
    trafficLight: {
      color: mapDateColor(item.closeDate),
      title: "",
      key:"trafficLight"
    }
  }));
};
