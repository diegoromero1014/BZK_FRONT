import Immutable from 'immutable';
import {
    CHANGE_PAG_FINISHED,
    CHANGE_PAG_PENDING,
    CLEAN_FINALIZED_TASKS,
    CLEAN_PAG_SET_ORDER_FINALIZED,
    CLEAN_PAG_SET_ORDER_PENDING,
    CLEAN_PENDING_TASKS,
    GET_ASSISTANTS_USER,
    GET_FINALIZED_TASKS,
    GET_PENDING_TASKS,
    SET_FILTERS
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
        case SET_FILTERS:
            let initialFilters = {
                users: action.rolFilter.users,
                rol: action.rolFilter.rol,
                initialDate: action.rolFilter.initialDate,
                finalDate: action.rolFilter.finalDate
            };
            return state.withMutations(map => {
                map.set("initialFilter", initialFilters);
            });

        default:
            return state;
    }
};
