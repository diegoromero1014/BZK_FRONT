import { TASK_BOARD_VALUES } from './constants';

export const getTaskBoardValues = payload => ({
    type: TASK_BOARD_VALUES,
    payload
})
