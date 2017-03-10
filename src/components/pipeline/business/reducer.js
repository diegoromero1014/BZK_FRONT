import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.ADD_BUSINESS:
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
            item.client= businessEdit.client,
            item.documentStatus= businessEdit.documentStatus,
            item.product= businessEdit.product,
            item.businessStatus= businessEdit.businessStatus,
            item.employeeResponsible= businessEdit.employeeResponsible,
            item.currency= businessEdit.currency,
            item.indexing= businessEdit.indexing,
            item.commission= businessEdit.commission,
            item.businessWeek= businessEdit.businessWeek,
            item.need= businessEdit.need,
            item.priority= businessEdit.priority,
            item.roe= businessEdit.roe,
            item.registeredCountry= businessEdit.registeredCountry,
            item.observations= businessEdit.observations,
            item.termInMonths= businessEdit.termInMonths,
            item.pipelineBusiness= businessEdit.pipelineBusiness,
            item.value= businessEdit.value,
            item.startDate= businessEdit.startDate,
            item.endDate= businessEdit.endDate,
            item.probability= businessEdit.probability,
            item.pendingDisburAmount= businessEdit.pendingDisburAmount,
            item.amountDisbursed= businessEdit.amountDisbursed,
            item.entity= businessEdit.entity,
            item.contract= businessEdit.contract,
            item.estimatedDisburDate= businessEdit.estimatedDisburDate
           return item;
        }
      );
    default:
      return state;
    }
}
