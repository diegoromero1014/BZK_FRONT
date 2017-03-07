import {createEpicMiddleware, combineEpics } from 'redux-observable';
import {inputEventsEpic} from '../components/timeout/timeoutDucks';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

const epics = combineEpics(inputEventsEpic);
const epicMiddleware = createEpicMiddleware(epics);

function configureStore(initialState) {
    const finalCreateStore = applyMiddleware(thunk, promise, epicMiddleware)(createStore);
    return finalCreateStore(rootReducer, initialState);
}

export default configureStore;
