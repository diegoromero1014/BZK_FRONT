import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import MenuReducer from '../components/menu/reducer';
import LoginReducer from '../components/login/reducer';
import ClientReducer from '../components/clients/reducer';
import NavBarReducer from '../components/navBar/reducer';
import ClientInformationReducer from '../components/clientInformation/reducer';
import modalReducer from '../components/modal/reducer';
import ShareHolderReducer from '../components/shareholder/reducer';
import contactsReducer from '../components/contact/reducer';
import shareholdersReducer from '../components/shareholder/reducer';
import propspectReducer from '../components/propspect/reducer';
import selectsReducer from '../components/selectsComponent/reducer';
import {reducer as formReducer} from 'redux-form';
import notesReducer from '../components/notes/reducer';
import contactDetail from '../components/contact/contactDetail/reducer';
import deleteGridReducer from '../components/grid/reducer';
import createContactReducer from '../components/contact/createContact/reducer';
import createShareholderReducer from '../components/shareholder/createShareholder/reducer';
import editShareholderReducer from '../components/shareholder/shareholderDetail/reducer';
import previsitReducer from '../components/previsita/reducer';
import visitReducer from '../components/visit/reducer';
import pipelineReducer from '../components/pipeline/reducer';
import participantsReducer from '../components/participantsVisitPre/reducer';
import taskReducer from '../components/visit/tasks/reducer';
import needReducer from '../components/businessPlan/need/reducer';
import areaReducer from '../components/businessPlan/area/reducer';
import tasksByClientReducer from '../components/pendingTask/reducer';
import tabReducer from '../components/clientDetailsInfo/reducer';
import taskReducerCreate from '../components/pendingTask/createPendingTask/reducer';
import viewManagementReducer from '../components/viewManagement/reducer';
import teamParticipantsReducer from '../components/clientTeam/reducer';
import businessPlanReducer from '../components/businessPlan/reducer';
import clientEconomicGroupReducer from '../components/clientEconomicGroup/reducer';
import dashboardReducer from '../components/dashboard/reducer';

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
    shareholdersReducer: shareholdersReducer,
    propspectReducer: propspectReducer,
    selectsReducer: selectsReducer,
    form: formReducer,
    notes: notesReducer,
    contactDetail: contactDetail,
    deleteGridReducer:deleteGridReducer,
    createContactReducer:createContactReducer,
    createShareholder: createShareholderReducer,
    editShareholderReducer: editShareholderReducer,
    previsitReducer: previsitReducer,
    visitReducer: visitReducer,
    participants: participantsReducer,
    tasks: taskReducer,
    needs:needReducer,
    areas:areaReducer,
    tasksByClient: tasksByClientReducer,
    tabReducer: tabReducer,
    taskReducerCreate: taskReducerCreate,
    pipelineReducer:pipelineReducer,
    viewManagementReducer: viewManagementReducer,
    teamParticipantsReducer: teamParticipantsReducer,
    businessPlanReducer: businessPlanReducer,
    clientEconomicGroupReducer: clientEconomicGroupReducer,
    dashboardReducer: dashboardReducer
});
