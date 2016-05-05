import Immutable from 'immutable';
import * as constants from './constants';

const initialState = Immutable.Map({
  statusDeleteContact : 0,
  status : ''
});


export default (state = initialState, action) => {
  switch (action.type) {
        case constants.DELETE_TYPE_CONTACT:
            const response = action.payload.data;
          return state.withMutations( map => {
            map
              .set('response',  JSON.parse(response.response))
              .set('status', response.status);
            });
      
        default:
            return state;
  }
}
