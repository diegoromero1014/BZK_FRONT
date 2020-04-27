
import moment from 'moment';

export const mapData = (data = []) => {

    return data.map((contact) => {

        const newData = Object.assign({}, contact);

        var newDate = moment(newData.contactBirth).locale('es');
        newData.contactBirth = newDate.format("DD") + " " + newDate.format("MMM");

        newData.contactName = newData.contactName.toUpperCase();
        newData.contactLastName = newData.contactLastName.toUpperCase();
        
        return newData;
    });
};


