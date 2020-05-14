import { FILTER_BY_CLIENTS, FILTER_BY_RELATION } from './constants';

export const filterByClient = (filterCriteria, id) => ({
    type : FILTER_BY_CLIENTS,
    payload : {
        filterCriteria,
        id
    }
})

export const filterByRealtion = (filterCriteria, id) => ({
    type : FILTER_BY_RELATION,
    payload : {
        filterCriteria,
        id
    }
})


