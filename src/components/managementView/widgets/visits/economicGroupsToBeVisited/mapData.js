import moment from 'moment';
import { set } from 'lodash';

export const mapData = (data = []) => {

    return data.map((item) => {
        const newData = Object.assign({}, item);

        if (item.clientName) {
            set(newData, 'clientName', item.clientName.toUpperCase());
        }

        if (!item.lastVisitType && !item.lastVisitAuthor && !item.lastVisitTime) {
            set(newData, 'lastVisitType', 'No hay visitas registradas');
            set(newData, 'lastVisitAuthor', '');
            set(newData, 'lastVisitTime', '');
        }

        if(item.lastVisitAuthor) {
            set(newData, 'lastVisitAuthor', item.lastVisitAuthor.toLowerCase());
        }

        if (item.lastVisitTime) {
            let lastVisitTime = moment(item.lastVisitTime).locale('es');
            set(newData, 'lastVisitTime', lastVisitTime.format("DD") + " " + lastVisitTime.format("MMM") + " " + lastVisitTime.format("YYYY")+ ", " + lastVisitTime.format("hh:mm a"));
        }

        return {
            clientId: newData.clientId,
            clientName: newData.clientName,
            lastVisitType: newData.lastVisitType,
            lastVisitAuthor: newData.lastVisitAuthor,
            lastVisitTime: newData.lastVisitTime,
        }
    });
}
