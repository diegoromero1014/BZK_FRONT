import * as constants from './constants';
import {PREPARE_TASKS_NOTES} from "./constants";

export function deleteTask(index){
  return {
      type: constants.DELETE_TASK,
      index
    };
}

export function addTask(task){
  return {
      type: constants.ADD_TASK,
      data : task
    };
}

export function editTask(task){
  return {
      type: constants.EDIT_TASK,
      data : task
    };
}

export function clearTasks(){
  return {
      type: constants.CLEAR_TASKS
    };
}

export function prepareTasksNotes(){
    return {
        type: PREPARE_TASKS_NOTES,
    }
}

