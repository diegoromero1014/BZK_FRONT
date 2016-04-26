import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.Map({
  dataTypeDocument: [],
  dataTypeFunction: [],
  dataTypeContact: [],
  dataTypeLBO:[],
  dataCIIU: [],
  dataSubCIIU: [],
  dataTypeGender: [],
  dataTypeTitle: [],
  dataTypeDependency: [],
  dataTypeSocialStyle: [],
  dataTypeCountry: [],
  dataTypeProvince: [],
  dataTypeCity: [],
  dataTypeHobbies: [],
  dataTypeSports: [],
  teamValueObjects: [],
  dataTypeContactPosition: [],
  dataTypeAttitudeOverGroup: []
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
        case constants.SUB_CIIU:
          var subCiiuValueObjects =  action.payload.data.messageBody.subCiiuValueObjects;
          return state.set("dataSubCIIU", subCiiuValueObjects);
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
        case constants.FILTER_CONTACT_POSITION:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeContactPosition', masterDataDetailEntries);
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
        case constants.FILTER_ATTITUDE_OVER_GROUP:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeAttitudeOverGroup', masterDataDetailEntries);
          break;
        case constants.TEAM_FOR_EMPLOYEE:
          var teamValueObjects = action.payload.data.teamValueObjects;
          return state.set('teamValueObjects', teamValueObjects);
        case constants.FILTER_MULTISELECT_FIELDS: /* Consulta de varias listas en un mismo servicio */
          const masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          const lineOfBussiness = [];
          const hobbies = [];
          const sports = [];
          const functions = [];
          _.map(masterDataDetailEntries, function(data, idx) {

            switch(data.field) {
              case constants.FIELTER_HOBBIES:
                hobbies.push(data);
                break;
              case constants.FILTER_SPORTS:
                sports.push(data);
              case constants.FILTER_TYPE_LBO_ID:
                lineOfBussiness.push(data);
              case constants.FILTER_FUNCTION_ID:
                functions.push(data);
              default:
                break;
            }
          });

          state.set('dataTypeSports', sports)
            .set('dataTypeHobbies', hobbies)
            .set('dataTypeFunction', functions)
            .set('dataTypeLBO', lineOfBussiness);

          return state;
          break;
        default:
            return state;
  }
}
