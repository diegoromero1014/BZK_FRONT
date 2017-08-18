import * as actions from './constants';

export function initalMenuPermissions(menu) {
    return {
        type: actions.INITIAL_MENU,
        menu
    }
}