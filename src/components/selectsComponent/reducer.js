import Immutable from 'immutable';
import * as constants  from './constants';


const initialState = Immutable.Map({
  dataTypeDocument: [],
  dataTypeFunction: [],
  dataTypeContact: [],
  dataTypeLBO:[]
});


export default (state = initialState, action) => {
  switch (action.type) {
        case constants.CLIENT_ID_TYPE:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeDocument", masterDataDetailEntries);
        case constants.FILTER_FUNCTION_ID:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeFunction", masterDataDetailEntries);
        case constants.FILTER_TYPE_CONTACT_ID:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeContact", masterDataDetailEntries);
        case constants.FILTER_TYPE_LBO_ID:
                var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
                return state.set("dataTypeLBO", masterDataDetailEntries);
        default:
            return state;
  }
}
