import {createEpicMiddleware, combineEpics } from 'redux-observable';
import {inputEventsEpic} from '../components/timeout/timeoutDucks';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { invalidTokenMiddleware } from './middleware';
import { from } from 'rxjs/observable/from';

const epics = combineEpics(inputEventsEpic);
const epicMiddleware = createEpicMiddleware(epics);

function configureStore(initialState) {
    const finalCreateStore = applyMiddleware(thunk, promise, epicMiddleware, invalidTokenMiddleware)(createStore);
    return finalCreateStore(rootReducer, initialState);
}

export default configureStore;
