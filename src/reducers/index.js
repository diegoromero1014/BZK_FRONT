import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import MenuReducer from '../components/navBar/reducers';

export default combineReducers({
    routing: routerReducer,
    menu: MenuReducer
});