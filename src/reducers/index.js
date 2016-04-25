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
import propspectReducer from '../components/propspect/reducer';
import selectsReducer from '../components/selectsComponent/reducer';
import {reducer as formReducer} from 'redux-form';
import notesReducer from '../components/notes/reducer';
import contactDetail from '../components/contact/contactDetail/reducer';
import deleteGridReducer from '../components/grid/reducer';

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
    propspectReducer: propspectReducer,
    selectsReducer: selectsReducer,
    form: formReducer,
    notes: notesReducer,
    contactDetail: contactDetail,
    deleteGridReducer:deleteGridReducer
});
