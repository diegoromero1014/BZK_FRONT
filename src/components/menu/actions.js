import * as actions from './constants';

export function showButtonCloseMenu(value){
    return {
        type: actions.SHOW_CLOSE_MENU,
        value: value
    }
}