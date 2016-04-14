import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

function configureStore(initialState) {
    const finalCreateStore = applyMiddleware(thunk, promise)(createStore);
    return finalCreateStore(rootReducer, initialState);
}

export default configureStore;
