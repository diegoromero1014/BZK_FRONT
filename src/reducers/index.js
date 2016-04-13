import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import MenuReducer from '../components/menu/reducer';
import LoginReducer from '../components/login/reducer';
import ClientReducer from '../components/clients/reducer';
import NavBarReducer from '../components/navBar/reducer';
import modalReducer from '../components/modal/reducer';

export default combineReducers({
    routing: routerReducer,
    menu: MenuReducer,
    login: LoginReducer,
    navBar: NavBarReducer,
    clientR: ClientReducer,
    modal: modalReducer
});
