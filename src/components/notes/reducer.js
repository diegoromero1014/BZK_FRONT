import Immutable from 'immutable';
import {UPDATE_NOTE, CREATE_NOTE} from './constants';

const initialState = Immutable.List();

export default (state = initialState, action) => {
  switch(action.type){
     case UPDATE_NOTE:
       const note = state.get(action.index);
       const newNote = note.withMutations(map => {
         map.set(action.prop, action.value);
       });
       return state.set(action.index, newNote);
     case CREATE_NOTE:
     console.log("Add note", state);
       return state.push(Immutable.Map({body: '', combo: {}}));
     default:
       return state;
   }
}
