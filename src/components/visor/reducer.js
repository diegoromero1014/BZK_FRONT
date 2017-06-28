import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map({
  "content_visor_url": ""
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.CONTENT_VISOR_URL:
      const response = action.payload.data;
      let routeVisor = "";

      if (response.parameter) {
        let _response = JSON.parse(response.parameter);
        routeVisor = _response.value ? _response.value : "";
      }

      return state.set("content_visor_url", routeVisor);
    default:
      return state;
  }
}
