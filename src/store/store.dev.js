import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import ReduxPromise from 'redux-promise';
import DevTools from '../components/DevTools/component';

const finalCreateStore = compose(
  applyMiddleware(ReduxPromise),
  DevTools.instrument()
)(createStore);

export default function configureStore(state) {
    const store = finalCreateStore(rootReducer, state);
    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers'))
        );
    }
    return store;
}
