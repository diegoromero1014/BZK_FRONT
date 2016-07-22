import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

function defaultData (action, path) {
  return _.get(action, path, []);
}

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
  dataTypeShareholdersKind : [],
  dataTypeShareholdersType:[],
  dataTypeTeams:[],
  dataTypeCertificationStatus:[],
  dataTypeTaskType:[],
  dataPipelineStatus:[],
  pipelineProducts: [],
  pipelineCurrencies: [],
  pipelineClientNeeds: []
});


export default (state = initialState, action) => {
  switch (action.type) {
        case constants.CLIENT_ID_TYPE:
          return state.set("dataTypeDocument", defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_FUNCTION_ID:
          return state.set("dataTypeFunction", defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.PIPELINE_STATUS:
          return state.set("dataPipelineStatus", defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_TYPE_CONTACT_ID:
          return state.set("dataTypeContact", defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_TYPE_LBO_ID:
          return state.set("dataTypeLBO", defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.CIIU:
          return state.set("dataCIIU", defaultData(action, 'payload.data.messageBody.ciiuValueObjects'));
        case constants.SUB_CIIU:
          return state.set("dataSubCIIU", defaultData(action, 'payload.data.messageBody.subCiiuValueObjects'));
        case constants.FILTER_GENDER:
          return state.set('dataTypeGender', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_TITLE:
          return state.set('dataTypeTitle', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_DEPENDENCY:
          return state.set('dataTypeDependency', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_CONTACT_POSITION:
          return state.set('dataTypeContactPosition', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_SOCIAL_STYLE:
          return state.set('dataTypeSocialStyle', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_COUNTRY:
          return state.set('dataTypeCountry', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_PROVINCE:
          return state.set('dataTypeProvince', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_CITY:
          return state.set('dataTypeCity', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_HOBBIES:
          return state.set('dataTypeHobbies', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_SPORTS:
          return state.set('dataTypeSports', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.FILTER_ATTITUDE_OVER_GROUP:
          return state.set('dataTypeAttitudeOverGroup', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.TEAM_FOR_EMPLOYEE:
          return state.set('teamValueObjects', defaultData(action, 'payload.data.teamValueObjects'));
        case constants.TYPE_NOTES:
          return state.set('dataTypeNotes',  defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.ECONOMIC_GROUPS:
          return state.set('dataEconomicGroup',  defaultData(action, 'payload.data.messageBody.economicGroupValueObjects'));
        case constants.SHAREHOLDER_KIND:
          return state.set('dataTypeShareholdersKind', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.SHAREHOLDER_TYPE:
          return state.set('dataTypeShareholdersType', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.CERTIFICATION_STATUS:
          return state.set('dataTypeCertificationStatus', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
        case constants.TASK_STATUS:
          return state.set('dataTypeTaskType', defaultData(action, 'payload.data.messageBody.masterDataDetailEntries'));
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
        case constants.PIPELINE_PRODUCTS:
          const products = action.payload.data.messageBody.productValueObjects;
          return state.set('pipelineProducts', products);
        case constants.PIPELINE_CURRENCIES:
          const currencies = action.payload.data.messageBody.currencyList;
          return state.set('pipelineCurrencies', currencies);
        case constants.PIPELINE_CLIENT_NEEDS:
          const clientNeeds = action.payload.data.messageBody.clientNeedValueObjects;
          return state.set('pipelineClientNeeds', clientNeeds);
        default:
          return state;
  }
}
