import Immutable from 'immutable';
import {
    GET_PENDING_TASKS,
    GET_FINALIZED_TASKS,
    CLEAN_PAG_SET_ORDER_PENDING,
    CLEAN_PAG_SET_ORDER_FINALIZED,
    CHANGE_PAG_PENDING,
    CHANGE_PAG_FINISHED,
    CLEAN_PENDING_TASKS,
    CLEAN_FINALIZED_TASKS, SET_ROL, GET_ASSISTANTS_USER
} from "./constants";

const initialState = Immutable.Map({
    tabPending: {
        page: 0,
        order: 0,
        rowCount: 0,
        data: []
    },
    tabFinished: {
        page: 0,
        order: 0,
        rowCount: 0,
        data: []
    },
    textToSearch: null,
    userAssistants: [],
    initialFilter: {
        users: [],
        rol: null,
        initialDate: null,
        finalDate: null
    }
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PENDING_TASKS:
            let statePending = {
                page: action.page,
                order: action.order,
                rowCount: action.data.rowCount,
                data: action.data.rows
            };
            return state.withMutations(map => {
                map.set("tabPending", statePending);
            });
        case GET_FINALIZED_TASKS:
            let stateFinalized = {
                page: action.page,
                order: action.order,
                rowCount: action.data.rowCount,
                data: action.data.rows
            };
            return state.withMutations(map => {
                map.set("tabFinished", stateFinalized);
            });
        case CLEAN_PAG_SET_ORDER_PENDING:
            let stateP = {
                page: 0,
                order: action.orderTask,
                rowCount: action.rowCount,
                data: []
            };
            return state.withMutations(item => {
                item.set("tabPending", stateP);
            });
        case CLEAN_PAG_SET_ORDER_FINALIZED:
            let stateCleaFinalized = {
                page: 0,
                order: action.orderTask,
                rowCount: action.rowCount,
                data: []
            };
            return state.withMutations(map => {
                map.set("tabFinished", stateCleaFinalized);
            });
        case CHANGE_PAG_PENDING:
            let changePagePending = {
                page: action.page,
                order: action.order,
                rowCount: action.rowCount,
                data: []
            };
            return state.withMutations(map => {
                map.set("tabPending", changePagePending);
            });
        case CHANGE_PAG_FINISHED:
            let changePageFinalized = {
                page: action.page,
                order: action.order,
                rowCount: action.rowCount,
                data: []
            };
            return state.withMutations(map => {
                map.set("tabFinished", changePageFinalized);
            });
        case CLEAN_PENDING_TASKS:
            let cleanedPendingTasks = {
                page: 0,
                order: 0,
                rowCount: 0,
                data: []
            };
            return state.withMutations(map => {
                map.set("tabPending", cleanedPendingTasks)
            });
        case CLEAN_FINALIZED_TASKS:
            let cleanedFinalizedTasks = {
                page: 0,
                order: 0,
                rowCount: 0,
                data: []
            };
            return state.withMutations(map => {
                map.set("tabFinished", cleanedFinalizedTasks)
            });
        case GET_ASSISTANTS_USER:
            const response = action.payload.data;
            return state.withMutations(map => {
                map.set('userAssistants', response)
            });
        case SET_ROL:
            let initialFilters = {
                users: action.users,
                rol: action.rol,
                initialDate: action.initialDate,
                finalDate: action.finalDate
            };
            return state.withMutations(map => {
                map.set("initialFilter", initialFilters);
            });

        default:
            return state;
    }
};
