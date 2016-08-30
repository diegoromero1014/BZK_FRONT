import Immutable from 'immutable';
import * as constants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case constants.ADD_TASK:
      const task = action.data;
      const newTask = _.assign({}, {
        uuid: task.uuid,
        tarea: task.tarea,
        idResponsable: task.idResponsable,
        responsable: task.responsable,
        fecha: task.fecha,
        fechaForm: task.fechaForm
      });
      return state.push(newTask);
    case constants.DELETE_TASK:
      return state.delete(action.index);
    case constants.CLEAR_TASKS:
      return state.clear();
    case constants.EDIT_TASK:
      const taskEdit = action.data;
      return state.update(
        state.findIndex(function(item) {
          return item.uuid === taskEdit.uuid;
        }), function(item) {
           item.tarea = taskEdit.tarea;
           item.idResponsable = taskEdit.idResponsable;
           item.responsable = taskEdit.responsable;
           item.fecha = taskEdit.fecha;
           item.fechaForm = taskEdit.fechaForm;
           return item;
        }
      );
    default:
      return state;
    }
}
