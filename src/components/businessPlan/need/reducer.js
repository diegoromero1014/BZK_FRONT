import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';


const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.ADD_NEED:
      const need = action.data;
      const newNeed = _.assign({}, {
        uuid: need.uuid,
        needType: need.needType,
        needIdType: need.needIdType,
        descriptionNeed: need.descriptionNeed,
        needProduct:need.needProduct,
        needIdProduct:need.needIdProduct,
        needImplementation: need.needImplementation,
        needIdImplementation:need.needIdImplementation,
        needTask: need.needTask,
        needBenefits: need.needBenefits,
        needIdResponsable: need.needIdResponsable,
        needResponsable:need.needResponsable,
        needDate:need.needDate,
        statusNeed: need.statusNeed,
        statusIdNeed: need.statusIdNeed
      });
      return state.push(newNeed);
    case constants.DELETE_NEED:
      return state.delete(action.index);
    case constants.CLEAR_NEED:
      return state.clear();
    case constants.EDIT_NEED:
      const needEdit = action.data;
      return state.update(
        state.findIndex(function(item) {
          return item.uuid === needEdit.uuid;
        }), function(item) {
           item.needType= needEdit.needType;
           item.needIdType= needEdit.needIdType;
           item.descriptionNeed= needEdit.descriptionNeed;
           item.needProduct=needEdit.needProduct;
           item.needIdProduct=needEdit.needIdProduct;
           item.needImplementation=needEdit.needImplementation;
           item.needIdImplementation=needEdit.needIdImplementation;
           item.needTask=needEdit.needTask;
           item.needBenefits= needEdit.needBenefits;
           item.needIdResponsable= needEdit.needIdResponsable;
           item.needResponsable=needEdit.needResponsable;
           item.needDate=needEdit.needDate;
           item.statusNeed= needEdit.statusNeed;
           item.statusIdNeed= needEdit.statusIdNeed;
           return item;
        }
      );
    default:
      return state;
    }
}
