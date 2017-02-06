import moment from 'moment';
import {COLOR_RED, COLOR_ORANGE, COLOR_GREEN} from '../clientInformation/constants';
import {REVIEWED_DATE_FORMAT} from '../../constantsGlobal';
import get from 'lodash/get';
import flow from 'lodash/flow';
import {shorterStringValue, mapDateValueFromTask} from '../../actionsGlobal';

export function getColor(date){
  const expirationDate = moment(date, 'DD MMM YYYY', 'es');
  const currentDate = moment().startOf('day');
  const beforeThreeDays = moment().startOf('day').add(3, 'days');
  if(currentDate.isAfter(expirationDate)){
    return COLOR_RED;
  } else if(beforeThreeDays.isBefore(expirationDate) || beforeThreeDays.isSame(expirationDate)){
    return COLOR_GREEN;
  } else {
    return COLOR_ORANGE;
  }
}

export const mapDateColor = (date) => {
  const func = flow(mapDateValueFromTask, getColor);
  return func(date);
}

export const mapDataGrid = (data = [], permissionsEdit) => {
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
      idStatus: item.idStatus,
      statusPending: item.statusPending,
      permissionEdit: permissionsEdit
    },
    closeDate: mapDateValueFromTask(item.closeDate),
    trafficLight: {
      color: mapDateColor(item.closeDate),
      title: "",
      key:"trafficLight"
    }
  }));
};
