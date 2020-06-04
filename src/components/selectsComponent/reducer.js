import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

function defaultData(action, path) {
    return _.get(action, path, []);
}

const initialState = Immutable.Map({
    dataTypeDocument: [],
    dataTypeFunction: [],
    dataTypeContact: [],
    dataTypeLBO: [],
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
    dataTypeShareholdersKind: [],
    dataTypeShareholdersType: [],
    dataTypeTeams: [],
    dataTypeCertificationStatus: [],
    dataTypeTaskType: [],
    dataPipelineStatus: [],
    pipelineClientNeeds: [],
    region: [],
    zone: [],
    validCovenant: [],
    fullfillmentCovenant: [],
    segment: [],
    subSegment: [],
    reasonConformation: [],
    products: [],
    allProducts: [],
    managementsOfsectorStrategy: [],
    dataTypeProvinceClient: [],
    dataTypeCityClient: [],
    childCatalogs: []
});

export default (state = initialState, action) => {
    switch (action.type) {
        case constants.CLIENT_ID_TYPE:
            return state.set("dataTypeDocument", defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_FUNCTION_ID:
            return state.set("dataTypeFunction", defaultData(action, constants.PAY_LOAD_DATA));
        case constants.PIPELINE_STATUS:
            return state.set("dataPipelineStatus", defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_TYPE_CONTACT_ID:
            return state.set("dataTypeContact", defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_TYPE_LBO_ID:
            return state.set("dataTypeLBO", defaultData(action, constants.PAY_LOAD_DATA));
        case constants.CIIU:
            return state.set("dataCIIU", defaultData(action, 'payload.data.data.ciiuValueObjects'));
        case constants.SUB_CIIU:
            return state.set("dataSubCIIU", defaultData(action, 'payload.data.data.subCiiuValueObjects'));
        case constants.FILTER_GENDER:
            return state.set('dataTypeGender', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_TITLE:
            return state.set('dataTypeTitle', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_DEPENDENCY:
            return state.set('dataTypeDependency', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_CONTACT_POSITION:
            return state.set('dataTypeContactPosition', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_SOCIAL_STYLE:
            return state.set('dataTypeSocialStyle', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_COUNTRY:
            return state.set('dataTypeCountry', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_PROVINCE:
            return state.set('dataTypeProvince', defaultData(action, 'payload.data.data'));
        case constants.FILTER_CITY:
            return state.set('dataTypeCity', defaultData(action, 'payload.data.data'));
        case constants.FILTER_PROVINCE_CLIENT:
            return state.set('dataTypeProvinceClient', defaultData(action, 'payload.data.data'));
        case constants.FILTER_CITY_CLIENT:
            return state.set('dataTypeCityClient', defaultData(action, 'payload.data.data'));
        case constants.FILTER_HOBBIES:
            return state.set('dataTypeHobbies', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_SPORTS:
            return state.set('dataTypeSports', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.FILTER_ATTITUDE_OVER_GROUP:
            return state.set('dataTypeAttitudeOverGroup', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.TEAM_FOR_EMPLOYEE:
            return state.set('teamValueObjects', defaultData(action, 'payload.data.data'));
        case constants.TEAM_FOR_EMPLOYEE_REGION_ZONE:
            return state.set('teamValueObjects', defaultData(action, 'payload.data.data.teamValueObjects'));
        case constants.TEAM_FOR_REGION_EMPLOYEE:
            return state.set('teamValueObjects', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.TYPE_NOTES:
            return state.set('dataTypeNotes', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.ECONOMIC_GROUPS:
            return state.set('dataEconomicGroup', defaultData(action, 'payload.data.data'));
        case constants.SHAREHOLDER_KIND:
            return state.set('dataTypeShareholdersKind', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.SHAREHOLDER_TYPE:
            return state.set('dataTypeShareholdersType', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.CLIENT_TYPE:
            return state.set('dataTypeClientType', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.CERTIFICATION_STATUS:
            return state.set('dataTypeCertificationStatus', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.TASK_STATUS:
            return state.set('dataTypeTaskType', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.CLEAR_VALUES_COUNTRY:
            return state.withMutations(map => {
                map
                    .set('dataTypeProvince', [])
                    .set('dataTypeCity', [])
                    .set('dataEconomicGroup', [])
            });
        case constants.CLEAR_VALUES_COUNTRY_KEY:
            return state.withMutations(map => {
                map
                    .set(constants.FILTER_COUNTRY, null)
                    .set('dataTypeProvince', null)
                    .set('dataTypeCity', null)
            });
        case constants.FILTER_MULTISELECT_FIELDS: /* Consulta de varias listas en un mismo servicio */        
            const masterDataDetailEntries = action.payload.data.data === undefined || action.payload.data.data === null ? [] : action.payload.data.data.masterDataDetailEntries;
            const lists = _.groupBy(masterDataDetailEntries, 'field');
            const keys = _.keys(lists);            
            return state.withMutations(map => {
                _.map(keys, key => {
                    const values = _.get(lists, key);
                    map.set(key, values);
                });
            });
        case constants.BUSINESS_CATEGORY:
            return state.set('businessCategory', defaultData(action, 'payload.data.data'));
        case constants.PIPELINE_CLIENT_NEEDS:
            const clientNeeds = action.payload.data.data.clientNeedValueObjects;            
            return state.set('pipelineClientNeeds', clientNeeds);
        case constants.PIPELINE_JUSTIFICATION:                             
            return state.set('pipelineJustification', defaultData(action, 'payload.data.data'));            
        case constants.LIST_REGIONS:
            return state.set('region', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.LIST_REGIONS_BY_EMPLOYEE:
            return state.set('region', defaultData(action, 'payload.data.data'));
        case constants.LIST_ZONES:
            return state.set('zone', defaultData(action, 'payload.data.data'));
        case constants.FULLFILLMENT_COVENANT:
            return state.set('fullfillmentCovenant', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.CUSTOMER_TYPOLOGY:
            return state.set('customerTypology', defaultData(action, 'payload.data.data'));
        case constants.SEGMENTS:
            return state.set('segment', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.SUBSEGMENTS:
            return state.set('subSegment', defaultData(action, 'payload.data.data'));
        case constants.REASON_CONFORMATION:
            return state.set('reasonConformation', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.PRODUCTS:            
            return state.set('products', defaultData(action, 'payload.data.data'));
        case constants.PRODUCTS_MASK:
            return state.set('allProducts', defaultData(action, 'payload.data.data'));
        case constants.ALL_BUSINESS_CATEGORIES:
            return state.set(constants.ALL_BUSINESS_CATEGORIES, defaultData(action, 'payload.data.data'));
        case constants.ALL_PRODUCT_FAMILIES:
            return state.set(constants.ALL_PRODUCT_FAMILIES, defaultData(action, 'payload.data.data'));
        case constants.CLEAR_LISTS:
            const clearLists = action.lists;
            return state.withMutations(map => {
                _.map(clearLists, (item) => {
                    map.set(item, []);
                });
            });
        case constants.MANAGEMENTS_OF_SECTOR_STRATEGY:
            return state.set('managementsOfsectorStrategy', defaultData(action, constants.PAY_LOAD_DATA));
        case constants.DISPATCH_CHILD_CATALOGS:
            return state.withMutations(
                p => p.set("childCatalogs", action.payload.data.data)
            );
        default:
            return state;
    }
}
