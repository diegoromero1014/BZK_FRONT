import { FILTER_BY_CLIENTS, FILTER_BY_RELATION } from './constants';

export const filterByClient = (filterCriteria, id, title) => ({
    type : FILTER_BY_CLIENTS,
    payload : {
        filterCriteria,
        id,
        title : `${title} ${filterCriteria}` 
    }
})

export const filterByRealtion = (filterCriteria, id, title) => ({
    type : FILTER_BY_RELATION,
    payload : {
        filterCriteria,
        id,
        title : `${title} ${filterCriteria}` 
    }
})


