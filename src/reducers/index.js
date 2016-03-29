import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import MenuReducer from '../components/menu/reducer';

export default combineReducers({
    routing: routerReducer,
    menu: MenuReducer
});