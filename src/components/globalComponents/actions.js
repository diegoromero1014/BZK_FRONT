import _ from 'lodash';
import Router from '../../historyRouter';

export function redirectUrl(url) {
    const urlToPush = _.startsWith(url, '/') ? url.substr(1) : url;
    Router.push(urlToPush);
    return {
        sessionToken: url
    }
}
