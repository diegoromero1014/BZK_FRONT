import _ from 'lodash';

import { VALID_TOKEN } from '../components/main/constants';

export const invalidTokenMiddleware = store => next => action => {
    const status = _.get(action, "payload.data.status", 200);
    const validateLogin = _.get(action, "payload.data.validateLogin", true);
    const message = _.get(action, "payload.data.data", "");
    if ((status == 500 && !validateLogin) || message === "Token is not longer valid") {
        let newAction = {
            type: VALID_TOKEN,
            value: false
        }
        return next(newAction);
    }
    return next(action);
}