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
