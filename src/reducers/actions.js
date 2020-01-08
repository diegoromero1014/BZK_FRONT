import * as actions from './constants';

export function toggleModalShareholder(){
    return {
        type: actions.TOGGLE_MODAL_SHAREHOLDER
    };
}

export function clearSearchShareholder(){
    return {
        type: actions.CLEAR_SEARCH_SHAREHOLDER
    };
}
