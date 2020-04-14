import moment from 'moment';
import { set } from 'lodash';

export const mapData = (data = []) => {

    return data.map((data, index) => {
        const newData = Object.assign({}, data);

        if (data.principalClientName) {
            set(newData, 'principalClientName', data.principalClientName.toUpperCase());
        }

        if (!data.lastVisitType && !data.lastVisitAuthor && !data.lastVisitTime) {
            set(newData, 'lastVisitType', 'No hay visitas registradas');
            set(newData, 'lastVisitAuthor', '');
            set(newData, 'lastVisitTime', '');
        }

        if(data.lastVisitAuthor) {
            set(newData, 'lastVisitAuthor', data.lastVisitAuthor.toLowerCase());
        }

        if (data.lastVisitTime) {
            let lastVisitTime = moment(data.lastVisitTime).locale('es');
            set(newData, 'lastVisitTime', lastVisitTime.format("DD") + " " + lastVisitTime.format("MMM") + " " + lastVisitTime.format("YYYY")+ ", " + lastVisitTime.format("hh:mm a"));
        }

        return {
            idPrincipalClient: newData.idPrincipalClient,
            principalClientName: newData.principalClientName,
            lastVisitType: newData.lastVisitType,
            lastVisitAuthor: newData.lastVisitAuthor,
            lastVisitTime: newData.lastVisitTime,
        }
    });
}
