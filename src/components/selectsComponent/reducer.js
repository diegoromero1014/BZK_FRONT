import Immutable from 'immutable';
import { CLIENT_ID_TYPE } from './constants';


const initialState = Immutable.Map({
  dataTypeDocument: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_ID_TYPE:
    const {masterDataDetailEntries} = action.payload.data.messageBody;
    console.log("masterDataDetailEntries", masterDataDetailEntries);
    return state.set("dataTypeDocument", masterDataDetailEntries);
    default:
        return state;
  }
}
