import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import { browserHistory } from 'react-router';
import {syncHistory} from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

const reduxRouterMiddleware = syncHistory(browserHistory);

function configureStore(initialState) {
    const finalCreateStore = applyMiddleware(thunk, promise, reduxRouterMiddleware)(createStore);
    const store = finalCreateStore(rootReducer, initialState);
    return store;
}

export default configureStore;
