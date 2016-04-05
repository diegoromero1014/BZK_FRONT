import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'
import MenuReducer from '../components/menu/reducer';
import LoginReducer from '../components/login/reducer';

export default combineReducers({
    routing: routerReducer,
    menu: MenuReducer,
    login: LoginReducer
});
