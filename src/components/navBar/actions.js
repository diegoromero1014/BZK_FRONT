import * as actions from './constants';

export function toggleMenu() {
    return {
        type: actions.TOGGLE_MENU
    }
}

export function updateTitleNavBar(title){
  return {
    type: actions.UPDATE_TITLE_NAV_BAR,
    newTitle: title
  }
}
