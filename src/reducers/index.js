import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import MenuReducer from '../components/menu/reducer';
import LoginReducer from '../components/login/reducer';
import ClientReducer from '../components/clients/reducer';
import NavBarReducer from '../components/navBar/reducer';
import ClientInformationReducer from '../components/clientInformation/reducer';
import modalReducer from '../components/modal/reducer';
import ShareHolderReducer from '../components/shareHolder/reducer';
import contactsReducer from '../components/contact/reducer';
import selectsReducer from '../components/selectsComponent/reducer';

export default combineReducers({
    routing: routerReducer,
    menu: MenuReducer,
    login: LoginReducer,
    navBar: NavBarReducer,
    clientR: ClientReducer,
    clientInformacion: ClientInformationReducer,
    modal: modalReducer,
    shareHolders: ShareHolderReducer,
    contactsByClient: contactsReducer,
    selectsReducer: selectsReducer
});
