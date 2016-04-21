import Immutable from 'immutable';
import * as constants from './constants';

const initialState = Immutable.Map({
  dataTypeDocument: [],
  dataTypeFunction: [],
  dataTypeContact: [],
  dataTypeLBO:[],
  dataCIIU: [],
  dataTypeGender: [],
  dataTypeTitle: [],
  dataTypeDependency: [],
  dataTypeSocialStyle: [],
  dataTypeCountry: [],
  dataTypeProvince: [],
  dataTypeCity: [],
  dataTypeHobbies: [],
  dataTypeSports: []
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
        case constants.CIIU:
          var ciiuValueObjects =  action.payload.data.messageBody.ciiuValueObjects;
          return state.set("dataCIIU", ciiuValueObjects);
        case constants.FILTER_GENDER:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeGender', masterDataDetailEntries);
          break;
        case constants.FILTER_TITLE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeTitle', masterDataDetailEntries);
          break;
        case constants.FILTER_DEPENDENCY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeDependency', masterDataDetailEntries);
          break;
        case constants.FILTER_SOCIAL_STYLE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeSocialStyle', masterDataDetailEntries);
          break;
        case constants.FILTER_COUNTRY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeCountry', masterDataDetailEntries);
          break;
        case constants.FILTER_PROVINCE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeProvince', masterDataDetailEntries);
          break;
        case constants.FILTER_CITY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeCity', masterDataDetailEntries);
          break;
        case constants.FILTER_HOBBIES:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeHobbies', masterDataDetailEntries);
          break;
        case constants.FILTER_SPORTS:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeSports', masterDataDetailEntries);
          break;
        default:
            return state;
  }
}
