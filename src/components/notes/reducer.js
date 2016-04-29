import Immutable from 'immutable';
import {UPDATE_NOTE, CREATE_NOTE, DELETE_NOTE} from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
  switch(action.type){
     case UPDATE_NOTE:
       const note = state.get(action.index);
       _.set(note,action.prop, action.value);
       return state.set(action.index, note);

     case CREATE_NOTE:
       return state.push({body: '', combo: ''});

     case DELETE_NOTE:
       console.log("indexindexindexindexindex " + action.index);
       const note2 = state.get(action.index);
       console.log("Before state ", state);
       return state.delete(action.index);
       console.log("After state ", state);
     default:
       return state;
   }
}
