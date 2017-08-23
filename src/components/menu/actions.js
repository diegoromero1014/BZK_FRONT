import * as actions from './constants';

export function initialMenuPermissions(menu) {
    return {
        type: actions.INITIAL_MENU,
        menu
    }
}

export function changeActiveItemMenu(activeItem) {
    return {
        type: actions.CHANGE_ITEM_ACTIVE_MENU,
        activeItem
    }
}