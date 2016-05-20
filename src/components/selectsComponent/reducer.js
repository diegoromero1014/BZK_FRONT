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
  dataTypeAttitudeOverGroup: [],
  dataEconomicGroup: [],
  dataTypeNotes: [],
  dataEconomicGroup: [],
  dataTypeShareholdersKind : [],
  dataTypeShareholdersType:[]
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
        case constants.FILTER_TITLE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeTitle', masterDataDetailEntries);
        case constants.FILTER_DEPENDENCY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeDependency', masterDataDetailEntries);
        case constants.FILTER_CONTACT_POSITION:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeContactPosition', masterDataDetailEntries);
        case constants.FILTER_SOCIAL_STYLE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeSocialStyle', masterDataDetailEntries);
        case constants.FILTER_COUNTRY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeCountry', masterDataDetailEntries);
        case constants.FILTER_PROVINCE:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeProvince', masterDataDetailEntries);
        case constants.FILTER_CITY:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeCity', masterDataDetailEntries);
        case constants.FILTER_HOBBIES:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeHobbies', masterDataDetailEntries);
        case constants.FILTER_SPORTS:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeSports', masterDataDetailEntries);
        case constants.FILTER_ATTITUDE_OVER_GROUP:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeAttitudeOverGroup', masterDataDetailEntries);
        case constants.TEAM_FOR_EMPLOYEE:
          var teamValueObjects = action.payload.data.teamValueObjects;
          return state.set('teamValueObjects', teamValueObjects);
        case constants.TYPE_NOTES:
          var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          return state.set('dataTypeNotes', masterDataDetailEntries);
        case constants.ECONOMIC_GROUPS:
          var masterDataEconomicGroups = action.payload.data.messageBody.economicGroupValueObjects;
          return state.set('dataEconomicGroup', masterDataEconomicGroups);
        case constants.SHAREHOLDER_KIND:
            var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
            return state.set('dataTypeShareholdersKind', masterDataDetailEntries);
        case constants.SHAREHOLDER_TYPE:
            var masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
            return state.set('dataTypeShareholdersType', masterDataDetailEntries);
        case constants.CLEAR_VALUES_COUNTRY:
          return state.withMutations( map => {
            map
              .set('dataTypeProvince', [])
              .set('dataTypeCity', [])
              .set('dataEconomicGroup', [])
          });
        case constants.CLEAR_VALUES_COUNTRY_KEY:
          return state.withMutations( map => {
            map
              .set(constants.FILTER_COUNTRY, null)
              .set('dataTypeProvince', null)
              .set('dataTypeCity', null)
          });
        case constants.FILTER_MULTISELECT_FIELDS: /* Consulta de varias listas en un mismo servicio */
          const masterDataDetailEntries = action.payload.data.messageBody.masterDataDetailEntries;
          const lists = _.groupBy(masterDataDetailEntries, 'field');
          const keys = _.keys(lists);
          return state.withMutations(map => {
            _.map(keys, key => {
              const values = _.get(lists, key);
              map.set(key, values);
            });
          });
        default:
          return state;
  }
}
