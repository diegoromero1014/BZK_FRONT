import { merge } from 'lodash';
import { TASK_BOARD_VALUES } from "./constants"

const initialState = {
    assignedTasks: {
        finished: 20,
        pending: 40,
        total: 60
    },
    myTask: {
        finished: 80,
        pending: 40,
        total: 120
    }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case TASK_BOARD_VALUES:
            return state;
        default:
            return state;
    }
}
