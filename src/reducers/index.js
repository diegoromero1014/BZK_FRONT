import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import LoginReducer from '../components/login/reducer';
import ClientReducer from '../components/clients/reducer';
import NavBarReducer from '../components/navBar/reducer';
import ClientInformationReducer from '../components/clientInformation/reducer';
import modalReducer from '../components/modal/reducer';
import ShareHolderReducer from '../components/clients/partners/shareholder/reducer';
import contactsReducer from '../components/contact/reducer';
import shareholdersReducer from '../components/clients/partners/shareholder/reducer';
import propspectReducer from '../components/propspect/reducer';
import selectsReducer from '../components/selectsComponent/reducer';
import { reducer as formReducer } from 'redux-form';
import notesReducer from '../components/clientEdit/notes/reducer';
import contactDetail from '../components/contact/contactDetail/reducer';
import deleteGridReducer from '../components/grid/reducer';
import createContactReducer from '../components/contact/createContact/reducer';
import createShareholderReducer from '../components/clients/partners/shareholder/createShareholder/reducer';
import editShareholderReducer from '../components/clients/partners/shareholder/shareholderDetail/reducer';
import previsitReducer from '../components/previsita/reducer';
import visitReducer from '../components/visit/reducer';
import pipelineReducer from '../components/pipeline/reducer';
import participantsReducer from '../components/participantsVisitPre/reducer';
import usersGlobalReducer from '../components/commercialReport/reducer';
import confidentialReducer from '../components/commercialReport/confidentialReducer';
import taskReducer from '../components/visit/tasks/reducer';
import needReducer from '../components/businessPlan/need/reducer';
import areaReducer from '../components/businessPlan/area/reducer';
import tasksByClientReducer from '../components/pendingTask/reducer';
import tabReducer from '../components/clientDetailsInfo/reducer';
import taskReducerCreate from '../components/pendingTask/createPendingTask/reducer';
import viewManagementReducer from '../components/managementView/reducer';
import teamParticipantsReducer from '../components/clientTeam/reducer';
import businessPlanReducer from '../components/businessPlan/reducer';
import clientEconomicGroupReducer from '../components/clientEconomicGroup/reducer';
import mainReducer from '../components/main/reducer';
import clientProductReducer from '../components/clientEdit/products/reducer';
import myPendingsReducer from '../components/myPendings/myTasks/reducer';
import draftDocumentsReducer from '../components/myPendings/draftDocuments/reducer';
import reducerGlobal from '../reducerGlobal';
import alertsReducer from '../components/alerts/reducer';
import alertPendingUpdateClientReducer from '../components/alertPendingUpdateClient/reducer';
import alertPortfolioExpirationReducer from '../components/alertPortfolioExpirtation/reducer';
import loadingReducer from '../components/loading/reducer';
import covenant from '../components/risksManagement/covenants/reducer';
import alertCovenantReducer from '../components/alertCovenants/reducer';
import pipelineBusinessReducer from '../components/pipeline/business/ducks';
import alertBlackListReducer from '../components/alertBlackList/reducer';
import leftTimer from '../components/timeout/timeoutDucks';
import linkEntitiesClientReducer from '../components/clientDetailsInfo/linkingClient/LinkEntitiesComponent/reducer';
import swtAlertMessagesReducer from '../components/sweetAlertMessages/reducer';
import blackListClientReducer from '../components/clientDetailsInfo/linkingClient/reducer';
import filterContactsReducer from '../components/filterContact/reducer';
import AECClient from '../components/risksManagement/AEC/reducer';
import contactsByFunctionOrTypeReducer from '../components/contactByFunctionOrType/reducer';
import tabRisksManagment from '../components/risksManagement/reducer';
import AECMyPendings from '../components/myPendings/AEC/reducer';
import groupsFavoriteContactsReducer from '../components/contact/favoritesGroup/reducer';
import customerStory from '../components/customerStory/reducer';
import structuredDeliveryEvents from '../components/customerStory/structuredDelivery/events/reducer';
import structuredDelivery from '../components/customerStory/structuredDelivery/reducer';
import assignedReducer from '../components/myPendings/assigned/reducer'
import studyCreditReducer from '../components/clients/creditStudy/reducer';
import qualitativeVariableReducer from '../components/risksManagement/qualitativeVariable/reducer';
import boardMembersReducer from '../components/clients/partners/boardMembers/reducer';
import riskGroupReducer from '../components/clientRiskGroup/reducer';
import partnersReducer from '../components/clients/partners/reducer';
import menuReducer from '../components/menu/reducer';
import transactionalReducer from '../components/transactional/reducer';
import linkRequestsReducer from '../components/myPendings/linkingRequests/reducer';
import schedulerPrevisitReduser from '../components/sheduler/reducer';
import fieldListReducer from '../components/fieldList/reducer';
import questionsReducer from '../components/challenger/reducer';
import objectListReducer from "../components/listaObjetos/reducer";
import elementsReducer from "../components/elements/reducer";
import outdatedContacts from "../components/managementView/widgets/alerts/reducer";
import boardTaskReducer from "../components/managementView/widgets/tasks/reducer";

export default combineReducers({
    routing: routerReducer,
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
    deleteGridReducer: deleteGridReducer,
    createContactReducer: createContactReducer,
    createShareholder: createShareholderReducer,
    editShareholderReducer: editShareholderReducer,
    previsitReducer: previsitReducer,
    visitReducer: visitReducer,
    participants: participantsReducer,
    usersPermission: usersGlobalReducer,
    tasks: taskReducer,
    needs: needReducer,
    areas: areaReducer,
    tasksByClient: tasksByClientReducer,
    tabReducer: tabReducer,
    taskReducerCreate: taskReducerCreate,
    pipelineReducer: pipelineReducer,
    viewManagementReducer: viewManagementReducer,
    teamParticipantsReducer: teamParticipantsReducer,
    businessPlanReducer: businessPlanReducer,
    clientEconomicGroupReducer: clientEconomicGroupReducer,
    mainReducer: mainReducer,
    clientProductReducer: clientProductReducer,
    reducerGlobal: reducerGlobal,
    alerts: alertsReducer,
    alertPendingUpdateClient: alertPendingUpdateClientReducer,
    myPendingsReducer: myPendingsReducer,
    draftDocumentsReducer: draftDocumentsReducer,
    loading: loadingReducer,
    alertPortfolioExpiration: alertPortfolioExpirationReducer,
    covenant: covenant,
    alertCovenant: alertCovenantReducer,
    pipelineBusinessReducer: pipelineBusinessReducer,
    leftTimer,
    alertBlackList: alertBlackListReducer,
    linkEntitiesClient: linkEntitiesClientReducer,
    swtMessage: swtAlertMessagesReducer,
    blackListClient: blackListClientReducer,
    AECClient: AECClient,
    filterContactsReducer: filterContactsReducer,
    contactsByFunctionOrType: contactsByFunctionOrTypeReducer,
    tabRisksManagment: tabRisksManagment,
    AECMyPendings: AECMyPendings,
    groupsFavoriteContacts: groupsFavoriteContactsReducer,
    customerStory,
    structuredDeliveryEvents,
    structuredDelivery,
    assignedReducer,
    studyCreditReducer,
    qualitativeVariableReducer,
    boardMembersReducer,
    riskGroupReducer,
    tabPartners: partnersReducer,
    menu: menuReducer,
    transactional: transactionalReducer,
    linkRequestsReducer,
    schedulerPrevisitReduser,
    confidentialReducer,
    fieldListReducer,
    questionsReducer,
    objectListReducer,
    elementsReducer,
    outdatedContacts,
    boardTaskReducer
});
