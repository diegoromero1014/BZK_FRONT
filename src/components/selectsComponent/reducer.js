import Immutable from 'immutable';
import { CLIENT_ID_TYPE } from './constants';


const initialState = Immutable.Map({
  dataTypeDocument: {},
});

export default (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_ID_TYPE:
    const {redirecUrl, sessionToken} = action.payload.data;
    return state.set("dataTypeDocument", action.payload.data);
    default:
        return state;
  }
}
