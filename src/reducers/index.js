import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import NavBarReducer from '../components/navBar/reducer';
import LoginReducer from '../components/login/reducer';

export default combineReducers({
    routing: routerReducer,
    login: LoginReducer,
    navBar: NavBarReducer
});
