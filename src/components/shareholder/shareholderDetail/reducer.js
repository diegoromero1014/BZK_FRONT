import * as actions from './constants';
import Immutable from 'immutable';

const initialState = Immutable.Map({
    modalState: false,
    status: false,
    validateLogin: true,
    clientEdit: {}
});

export default function(state = initialState, action){
    switch(action.type){
    case actions.SHARE_HOLDER_DETAIL:
      return state.set('shareHolderEdit', action.payload.data.data);

    case actions.CLEAR_SEARCH_SHAREHOLDER:
        return state.withMutations( map => {
          map
            .set('clientEdit', {});
        });
    default:
        return state;
    }
}
