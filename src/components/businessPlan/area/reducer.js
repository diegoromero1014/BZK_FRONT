import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.ADD_AREA:
      const area = action.data;
      const newArea = _.assign({}, {
        uuid: area.uuid,
        areaDes: area.areaDes,
        actionArea: area.actionArea,
        areaResponsable: area.areaResponsable,
        areaIdResponsable:area.areaIdResponsable,
        areaDate: area.areaDate,
        statusIdArea: area.statusIdArea,
        statusArea: area.statusArea
      });
      return state.push(newArea);
    case constants.DELETE_AREA:
      return state.delete(action.index);
    case constants.CLEAR_AREA:
      return state.clear();
    case constants.EDIT_AREA:
      const areaEdit = action.data;
      return state.update(
        state.findIndex(function(item) {
          return item.uuid === areaEdit.uuid;
        }), function(item) {
          item.areaDes = areaEdit.areaDes;
          item.actionArea = areaEdit.actionArea;
          item.areaResponsable = areaEdit.areaResponsable;
          item.areaIdResponsable  = areaEdit.areaIdResponsable;
          item.areaDate = areaEdit.areaDate;
          item.statusIdArea = areaEdit.statusIdArea;
          item.statusArea = areaEdit.statusArea;
          return item;
        }
      );
    default:
      return state;
    }
}
