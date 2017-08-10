import Immutable from 'immutable';
import {
    FIRST_PAGE, GET_BOARD_MEMBERS, CHANGE_PAGE, LOWER_LIMIT, CLEAR_FILTERS,
    CHANGE_KEYWORD
} from './constants';

const initialState = Immutable.Map({
    boardMembers: [],
    keywordBoardMembers: "",
    lowerLimit: 0,
    page: 1,
    rowCount: 0
});

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_BOARD_MEMBERS:
            const response = action.payload.data;
            return state.withMutations(map => {
                map
                    .set('rowCount', response.data.rowCount)
                    .set('boardMembers', response.data.rows);
            });
        case CHANGE_PAGE:
            return state.set('page', action.currentPage);
        case LOWER_LIMIT:
            return state.set('lowerLimit', action.lowerLimit);
        case CLEAR_FILTERS:
            return state.withMutations(map => {
                map
                    .set('rowCount', 0)
                    .set('boardMembers', [])
                    .set('page', FIRST_PAGE)
                    .set('lowerLimit', 0);
            });
        case CHANGE_KEYWORD:
            return state.set('keywordBoardMembers', action.keyword);
        default:
            return state;
    }
}
