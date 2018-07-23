import Immutable from 'immutable';
import { SAVE_DATA_LOADING, PRODUCTION_UPGRADE_REQUEST, PRODUCTION_UPGRADE_NOTIFIED } from './constants';

const initialState = Immutable.Map({
  showSaveData: false,
  messageData: '',
  productionUpgradeNotified: false,
  productionUpgradeMessage: ""
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DATA_LOADING:
      return state.withMutations(map => {
        map
          .set('showSaveData', action.value)
          .set('messageData', action.message)
      });
    case PRODUCTION_UPGRADE_REQUEST:
      const { messageNotification } = action.payload.data.data;
      console.log("messageNotification", messageNotification);
      return state.set("productionUpgradeMessage", messageNotification);
    case PRODUCTION_UPGRADE_NOTIFIED:
      return state.set("productionUpgradeNotified", true);
    default:
      return state;
  }
}
