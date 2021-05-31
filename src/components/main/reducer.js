import Immutable from 'immutable';
import { SAVE_DATA_LOADING, PRODUCTION_UPGRADE_REQUEST,
  PRODUCTION_UPGRADE_NOTIFIED, VALID_TOKEN, CHANGE_MENU_DESACTIVE, CHANGE_MENU_ACTIVE } from './constants';

const initialState = Immutable.Map({
  showSaveData: false,
  messageData: '',
  productionUpgradeNotified: false,
  productionUpgradeMessage: "enabledMenus",
  validToken: true,
  enableMenu: true
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case VALID_TOKEN:
      return state.withMutations(map => {
        map.set("validToken", action.value)
      })
    case SAVE_DATA_LOADING:
      return state.withMutations(map => {
        map
          .set('showSaveData', action.value)
          .set('messageData', action.message)
      });
    case PRODUCTION_UPGRADE_REQUEST:
      const { messageNotification } = action.payload.data.data;
      return state.set("productionUpgradeMessage", messageNotification);
    case PRODUCTION_UPGRADE_NOTIFIED:
      return state.set("productionUpgradeNotified", true);
    case CHANGE_MENU_ACTIVE:
      return state.set("enableMenu",true);
    case CHANGE_MENU_DESACTIVE:
      return state.set("enableMenu",false);
    default:
      return state;
  }
}
