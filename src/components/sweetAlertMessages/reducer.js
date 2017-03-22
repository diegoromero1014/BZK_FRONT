/**
 * Created by Andres Hurtado on 21/03/2017.
 */
import Immutable from 'immutable';
import { SHOW_SWT_MESSAGE, CLOSE_SWT_MESSAGE} from './actions';

const initialState = Immutable.Map({
    typeMessage:'info',
    title:'',
    message: '',
    isShow: false
});

export default(state = initialState, action) => {
    switch (action.type) {
        case SHOW_SWT_MESSAGE:
            return state.withMutations(map => {
                map.set('typeMessage', action.typeMessage )
                    .set('title', action.title)
                    .set('message', action.message)
                    .set('isShow', true);
            });
        case CLOSE_SWT_MESSAGE:
            return state.set("isShow", false);
        default:
            return state;
    }
}
