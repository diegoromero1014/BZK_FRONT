import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.ADD_BUSINESS:
    console.log('reducer');
      const business = action.data;
      const newBusiness = _.assign({}, {
        uuid: business.uuid,
        id: business.id,
        client: business.client,
        documentStatus: business.documentStatus,
        product: business.product,
        businessStatus: business.businessStatus,
        employeeResponsible: business.employeeResponsible,
        currency: business.currency,
        indexing: business.indexing,
        commission: business.commission,
        businessWeek: business.businessWeek,
        need: business.need,
        priority: business.priority,
        roe: business.roe,
        registeredCountry: business.registeredCountry,
        observations: business.observations,
        termInMonths: business.termInMonths,
        pipelineBusiness: business.pipelineBusiness,
        value: business.value,
        startDate: business.startDate,
        endDate: business.endDate,
        probability: business.probability,
        pendingDisburAmount: business.pendingDisburAmount,
        amountDisbursed: business.amountDisbursed,
        entity: business.entity,
        contract: business.contract,
        estimatedDisburDate: business.estimatedDisburDate
      });
      return state.push(newBusiness);
    case constants.DELETE_BUSINESS:
      return state.delete(action.index);
    case constants.CLEAR_BUSINESS:
      return state.clear();
    case constants.EDIT_BUSINESS:
      const businessEdit = action.data;
      return state.update(
        state.findIndex(function(item) {
          return item.uuid === businessEdit.uuid;
        }), function(item) {
            item.client= business.client,
            item.documentStatus= business.documentStatus,
            item.product= business.product,
            item.businessStatus= business.businessStatus,
            item.employeeResponsible= business.employeeResponsible,
            item.currency= business.currency,
            item.indexing= business.indexing,
            item.commission= business.commission,
            item.businessWeek= business.businessWeek,
            item.need= business.need,
            item.priority= business.priority,
            item.roe= business.roe,
            item.registeredCountry= business.registeredCountry,
            item.observations= business.observations,
            item.termInMonths= business.termInMonths,
            item.pipelineBusiness= business.pipelineBusiness,
            item.value= business.value,
            item.startDate= business.startDate,
            item.endDate= business.endDate,
            item.probability= business.probability,
            item.pendingDisburAmount= business.pendingDisburAmount,
            item.amountDisbursed= business.amountDisbursed,
            item.entity= business.entity,
            item.contract= business.contract,
            item.estimatedDisburDate= business.estimatedDisburDate
           return item;
        }
      );
    default:
      return state;
    }
}
