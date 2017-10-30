import moment from 'moment';
import {COLOR_RED, COLOR_ORANGE, COLOR_GREEN} from '../../clientInformation/constants';
import {REVIEWED_DATE_FORMAT} from '../../../constantsGlobal';
import get from 'lodash/get';
import flow from 'lodash/flow';
import {mapDateValueFromTask} from '../../../actionsGlobal';
import {VIEW_TASK_ADMIN} from '../../modal/constants';

export function getColor(date) {
    const expirationDate = moment(date, 'DD MMM YYYY', 'es');
    const currentDate = moment().startOf('day');
    const beforeThreeDays = moment().startOf('day').add(3, 'days');
    if (currentDate.isAfter(expirationDate)) {
        return COLOR_RED;
    } else if (beforeThreeDays.isBefore(expirationDate) || beforeThreeDays.isSame(expirationDate)) {
        return COLOR_GREEN;
    } else {
        return COLOR_ORANGE;
    }
}

export const mapDateColor = (date) => {
    const func = flow(mapDateValueFromTask, getColor);
    return func(date);
};

export const mapDataGrid = (data = [], permissionsEdit) => {
    return data.map(item => {
        const editStateTask = item.userName.toLowerCase() === sessionStorage.getItem('userName').toLowerCase();
        return {
            actions: {
                actionView: true,
                id: item.id,
                idClient: item.idClient,
                urlServer: "./component",
                component: VIEW_TASK_ADMIN,
                actionEdit: true
            },
            idTypeClient: item.idTypeClient,
            idNumberClient: item.idNumberClient,
            clientName: item.clientName,
            assignedBy: item.assignedBy,
            responsible: item.responsible,
            toolTip: item.resume,
            headerTooltip: 'Descripción de la tarea',
            changeStateTask: {
                idTask: item.id,
                idStatus: item.idStatus,
                statusPending: item.statusPending,
                permissionEdit: editStateTask ? permissionsEdit : false
            },
            closeDate: mapDateValueFromTask(item.closeDate),
            trafficLight: {
                color: mapDateColor(item.closeDate),
                title: "",
                key: "trafficLight"
            }
        };
    });
};
