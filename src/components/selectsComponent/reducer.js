import Immutable from 'immutable';
import {CLIENT_ID_TYPE,FILTER_FUNCTION_ID, FILTER_TYPE_CONTACT_ID,FILTER_TYPE_LBO_ID} from './constants';


const initialState = Immutable.Map({
  dataTypeDocument: [],
  dataTypeFunction: [],
  dataTypeContact: [],
  dataTypeLBO:[]
});


export default (state = initialState, action) => {
  switch (action.type) {
        case CLIENT_ID_TYPE:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeDocument", masterDataDetailEntries);
        case FILTER_FUNCTION_ID:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeFunction", masterDataDetailEntries);
        case FILTER_TYPE_CONTACT_ID:
            var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
            return state.set("dataTypeContact", masterDataDetailEntries);
        case FILTER_TYPE_LBO_ID:
                var masterDataDetailEntries =  action.payload.data.messageBody.masterDataDetailEntries;
                return state.set("dataTypeLBO", masterDataDetailEntries);
        default:
            return state;
  }
}
