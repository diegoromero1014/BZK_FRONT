import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import { Grid } from "react-flexbox-grid";
import LoginComponent from "./components/login/component";
import DashboardComponent from "./components/dashboard/dashboardComponent";
import ClientsFind from "./components/clients/clientsFind";
import ShareholderComponent from "./components/clients/partners/shareholder/component";
import ComponentClientInformation from "./components/clientInformation/componentClientInformation";
import CreatePropspect from "./components/propspect/createPropspect";
import ClientEdit from "./components/clientEdit/clientEdit";
import ClientCertify from "./components/clientCertify/clientCertifyComponent";
import Visit from "./components/visit/createVisit/createVisit";
import VisitEdit from "./components/visit/editVisit/editVisit";
import ViewManagement from "./components/viewManagement/viewManagement";
import BusinessPlan from "./components/businessPlan/createBusinessPlan/createBusinessPlan";
import EditBusinessPlan from "./components/businessPlan/editBusinessPlan/editBusinessPlan";
import AdminAlertClientsPendingUpdate from "./components/alertPendingUpdateClient/pendingUpdateClientComponent";
import AdminAlertClientsPortfolioExpiration from "./components/alertPortfolioExpirtation/portfolioExpirationAlertComponent";
import ModalComponentPending from "./components/myPendings/myTasks/modalComponentPending";
import ModalDraftDocuments from "./components/myPendings/draftDocuments/modalDraftDocuments";
import ViewAlerts from "./components/alerts/alertsComponent";
import AlertCovenants from "./components/alertCovenants/alertCovenantComponent";
import AlertBlackList from "./components/alertBlackList/alertBlackListComponent";
import createFormPipeline from "./components/pipeline/createPipeline/formPipeline";
import editFormPipeline from "./components/pipeline/editPipeline/formEditPipeline";
import FindContacts from "./components/filterContact/findContacts";
import ClientsContactsDetails from "./components/filterContact/detailsClientsContact/clientsContactsDetails";
import ContactByFunctionOrTypeComponent from "./components/contactByFunctionOrType/ContactByFunctionOrTypeComponent";
import AEC from "./components/myPendings/AEC/componentAEC";
import FavoritesGroup from "./components/contact/favoritesGroup/createEdit/favoritesGroupComponent";
import Assigned from "./components/myPendings/assigned/componentAssigned";
import StudyCredit from "./components/clients/creditStudy/componentCreditStudy";
import Transactional from "./components/transactional/transactionalComponent";
import WalletShare from "./components/transactional/walletShareComponent";
import ControlDashboard from "./components/transactional/controlDashComponent";
import LinkingRequests from "./components/myPendings/linkingRequests/componentLinkingRequests";
import Sheduler from "./components/sheduler/shedulerComponent";
import pageUnderConstructor from "./components/pageUnderConstruction/pageUnderConstruction";
import PageNotFound from "./components/notFoundPage/PageNotFound";
import PrevisitPage from "./components/previsita/previsitPage";

import makeAssociateList from './components/fieldList/makeAssociateList';

import { BIZTRACK_, CONTROLDASHBOARD, WALLETSHARE, TRANSACTIONAL, FAVORITESGROUP, 
    CONTACTBYFUNCTIONORTYPECOMPONENT, CLIENTSCONTACTSDETAILS, FINDCONTACTS, ALERTBLACKLIST, 
    LINKINGREQUESTS, MODALDRAFTDOCUMENTS, MODALCOMPONENTPENDING, ALERTCOVENANTS, 
    ADMINALERTCLIENTSPORTFOLIOEXPIRATION, EDITBUSINESSPLAN, BUSINESSPLAN, 
    EDITFORMPIPELINE, CREATEFORMPIPELINE, VISITEDIT, VISIT, EDITPREVISITA, 
    PREVISITA, CLIENTCERTIFY, CLIENTSFIND, CLIENTEDIT, CREATEPROPSPECT, STUDYCREDIT, 
    COMPONENTCLIENTINFORMATION, SHAREHOLDERCOMPONENT, VIEWMANAGEMENT, DASHBOARDCOMPONENT, 
    LOGINCOMPONENT,     
    LoginComponentURL,
    DashboardComponentURL,
    ViewManagementURL,
    ShareholderComponentURL,
    ComponentClientInformationURL,
    StudyCreditURL,
    CreatePropspectURL,
    ClientEditURL,
    ClientsFindURL,
    ClientCertifyURL,
    PrevisitaURL,
    EditPrevisitaURL,
    VisitEditURL,
    createFormPipelineURL,
    editFormPipelineURL,
    BusinessPlanURL,
    EditBusinessPlanURL,
    AdminAlertClientsPendingUpdateURL,
    AdminAlertClientsPortfolioExpirationURL,
    AlertCovenantsURL,
    ModalComponentPendingURL,
    ModalDraftDocumentsURL,
    AECURL,
    LinkingRequestsURL,
    AlertBlackListURL,
    FindContactsURL,
    ClientsContactsDetailsURL,
    ContactByFunctionOrTypeComponentURL,
    FavoritesGroupURL,
    TransactionalURL,
    WalletShareURL,
    ControlDashboardURL,
    ShedulerURL,
    nombreflujoAnalytics,
    AECACTIVE,
    ViewAlertsURL,
    VIEWALERT,
    ADMINALERTCLIENTSPENDINGUPDATE,
    SHEDULER,
    DEFAULT} from "./constantsAnalytics";



class App extends Component {
   
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
          this.onRouteChanged();
         


        }
      }

      onRouteChanged() {
          var routeActive =this.validateRouteActive();
          window.dataLayer.push({
            'nombreflujo': nombreflujoAnalytics,
            'event': BIZTRACK_+routeActive,
            'pagina':routeActive


          });
        
       
      }
      /*rutas del menu vertical deben parametrizarse el path segun el menu y el submenu de este*/
      validateRouteActive(){
          
        switch (this.props.location.pathname) {
            case LoginComponentURL:
                return LOGINCOMPONENT;
            case DashboardComponentURL:
                return DASHBOARDCOMPONENT;
            case ViewManagementURL:
                return VIEWMANAGEMENT;                                
            case ShareholderComponentURL:
                return SHAREHOLDERCOMPONENT;
            case ViewAlertsURL:
                return VIEWALERT;
            case ComponentClientInformationURL:
                return COMPONENTCLIENTINFORMATION;
            case StudyCreditURL:
                return STUDYCREDIT;
            case CreatePropspectURL:
                return CREATEPROPSPECT;
            case ClientEditURL:
                return CLIENTEDIT;
            case ClientsFindURL:
                return CLIENTSFIND;
            case ClientCertifyURL:
                return CLIENTCERTIFY;    
            case PrevisitaURL:
                return PREVISITA;
            case EditPrevisitaURL:
                return EDITPREVISITA;
            case VisitEditURL:
                return VISIT;                                
            case VisitEditURL:
                return VISITEDIT;
            case createFormPipelineURL:
                return CREATEFORMPIPELINE;
            case editFormPipelineURL:
                return EDITFORMPIPELINE;
            case BusinessPlanURL:
                return BUSINESSPLAN;
            case EditBusinessPlanURL:
                return EDITBUSINESSPLAN;
            case AdminAlertClientsPendingUpdateURL:
                return ADMINALERTCLIENTSPENDINGUPDATE;
            case AdminAlertClientsPortfolioExpirationURL:
                return ADMINALERTCLIENTSPORTFOLIOEXPIRATION;
            case AlertCovenantsURL:
                return ALERTCOVENANTS;
            case ModalComponentPendingURL:
                return MODALCOMPONENTPENDING;
            case ModalDraftDocumentsURL:
                return MODALDRAFTDOCUMENTS;
            case AECURL:
                return AECACTIVE;                                
            case LinkingRequestsURL:
                return LINKINGREQUESTS;
            case AlertBlackListURL:
                return ALERTBLACKLIST;
            case FindContactsURL:
                return FINDCONTACTS;
            case ClientsContactsDetailsURL:
                return CLIENTSCONTACTSDETAILS;
            case ContactByFunctionOrTypeComponentURL:
                return CONTACTBYFUNCTIONORTYPECOMPONENT;
            case FavoritesGroupURL:
                return FAVORITESGROUP;                                
            case TransactionalURL:
                return TRANSACTIONAL; 
            case WalletShareURL:
                return WALLETSHARE;
            case ControlDashboardURL:
                return CONTROLDASHBOARD;
            case ShedulerURL:
                return SHEDULER;
            default:
                return DEFAULT;
        }
      }
    
    render() {
        return (
            <div style={{ width: "100%" }}>
                {this.props.children}
            </div>
        );
    }
}

export default (
    <Grid>
        <Redirect from="/" to="/login" />
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="logout" component={LoginComponent}></Route>
            <Route path="pageUnderConstruction" component={pageUnderConstructor} />
            <Route path="dashboard" component={DashboardComponent}>
                <Route path="clients" component={ClientsFind}></Route>
                <Route path="viewManagement" component={ViewManagement}></Route>
                <Route path="shareholder" component={ShareholderComponent}></Route>
                <Route path="clientInformation" component={ComponentClientInformation}></Route>
                <Route path="creditStudy" component={StudyCredit}></Route>
                <Route path="createPropspect" component={CreatePropspect}></Route>
                <Route path="clientEdit" component={ClientEdit}></Route>
                <Route path="certifyClient" component={ClientCertify}></Route>
                <Route path="previsita" component={PrevisitPage}>
                    <Route path=":id" component={PrevisitPage}></Route>                    
                </Route>                
                <Route path="visita" component={Visit}></Route>
                <Route path="visitaEditar/:id" component={VisitEdit}></Route>
                <Route path="pipeline" component={createFormPipeline('pipelineCreate')}></Route>
                <Route path="pipelineEdit/:id" component={editFormPipeline('pipelineEdit')}></Route>
                <Route path="businessPlan" component={BusinessPlan}></Route>
                <Route path="businessPlanEdit/:id" component={EditBusinessPlan}></Route>
                <Route path="alertClientPendingUpdate" component={AdminAlertClientsPendingUpdate}></Route>
                <Route path="alertClientsPortfolioExpiration" component={AdminAlertClientsPortfolioExpiration}></Route>
                <Route path="alertCovenants" component={AlertCovenants}></Route>
                <Route path="myPendings">
                    <Route path="myTasks" component={ModalComponentPending}></Route>
                    <Route path="draftDocuments" component={ModalDraftDocuments}></Route>
                    <Route path="AEC" component={AEC} key="AEC"></Route>
                    <Route path="assigned" component={Assigned}></Route>
                    <Route path="linkingRequests" component={LinkingRequests}></Route>
                </Route>
                <Route path="alerts" component={ViewAlerts}></Route>
                <Route path="alertBlackList" component={AlertBlackList}></Route>
                <Route path="contacts" component={FindContacts}></Route>
                <Route path="clientsContacts" component={ClientsContactsDetails}></Route>
                <Route path="searchContactsByFunctionOrType" component={ContactByFunctionOrTypeComponent}></Route>
                <Route path="contact/favoriteGroup" component={FavoritesGroup}></Route>
                <Route path="transactional" component={Transactional}></Route>
                <Route path="walletShare" component={WalletShare}></Route>
                <Route path="controlDashboard" component={ControlDashboard}></Route>
                <Route path="sheduler" component={Sheduler}></Route>
            </Route>
            
            <Route path="*" component={PageNotFound}/>
        </Route>
    </Grid>
);
