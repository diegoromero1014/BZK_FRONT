import Immutable from 'immutable';
import * as constants from './constantsGlobal';

const initialState = Immutable.Map({
  validateEnter: true,
  permissionsPropsect: [],
  permissionsClients: [],
  permissionsContacts: [],
  permissionsShareholders: [],
  permissionsPrevisits: []
});

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.NON_VALIDATE_ENTER:
      return state.set('validateEnter', action.payload);
    case constants.MODULE_PROSPECT:
      const permissionsPropsect = action.payload.data.data.permissions;
      return state.set('permissionsPropsect', permissionsPropsect);
    case constants.MODULE_CLIENTS:
      const permissionsClients = action.payload.data.data.permissions;
      return state.set('permissionsClients', permissionsClients);
    case constants.MODULE_CONTACTS:
      const permissionsContacts = action.payload.data.data.permissions;
      return state.set('permissionsContacts', permissionsContacts);
    case constants.MODULE_SHAREHOLDERS:
      const permissionsShareholders = action.payload.data.data.permissions;
      return state.set('permissionsShareholders', permissionsShareholders);
    case constants.MODULE_PREVISITS:
      const permissionsPrevisits = action.payload.data.data.permissions;
      return state.set('permissionsPrevisits', permissionsPrevisits);
    default:
      return state;
  }
}
