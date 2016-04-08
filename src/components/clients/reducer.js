import Immutable from 'immutable';
import {CLIENTS_FIND} from './constants';

const initialState = Immutable.Map({
    status: "processed",
    responseClients: []
});

export default (state = initialState, action) => {
  console.log("antes switch: " + action.type);
  switch (action.type) {
    case CLIENTS_FIND:
      console.log("antes");
      const clients = action.payload.data;
        console.log("clients", clients);
        return state.withMutations(map => {
            map
            .set('status', 'processed')
            .set('responseClients', clients);
        })
      break;
    default:
    return state;
  }
}
