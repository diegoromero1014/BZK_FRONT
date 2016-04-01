import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import DevTools from '../components/DevTools/component';

const finalCreateStore = compose(
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