import { merge, get } from 'lodash';
import { TASK_BOARD_VALUES } from "./constants"

const initialState = {
    assignedCounter: {
        finished: 0,
        pending: 0,
        total: 0,
    },

    myTaskCounter: {
        finished: 0,
        pending: 0,
        total: 0,
    }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case TASK_BOARD_VALUES:
            const status = get(payload, "data.status", 500);

            if (status !== 500) {
                return merge({}, state, get(payload, "data.data"));
            }

            return state;
        default:
            return state;
    }
}
