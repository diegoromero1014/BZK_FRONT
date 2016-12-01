import _ from 'lodash';
import Router from '../../historyRouter';
const productionUse =  process.env.NODE_ENV === 'production';
export function redirectUrl(url) {
    const urlToPush = _.startsWith(url, '/') && productionUse ? url.substr(1) : url;
    Router.push(urlToPush);
    return {
        sessionToken: url
    }
}

export function goBack() {
    Router.goBack();
}

export function shorterStringValue(element){
  return element.length > 50 ? element.substring(0, 50) + "..." : element;
}

export function mapDateValueFromTask(date){
  if( moment(date, [REVIEWED_DATE_FORMAT], 'es', true).isValid() ){
    return date;
  } else {
    return moment(date).locale('es').format(REVIEWED_DATE_FORMAT);
  }
}
