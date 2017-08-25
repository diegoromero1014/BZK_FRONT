import React, {Component} from "react";
import {Redirect, Route} from "react-router";
import {Grid} from "react-flexbox-grid";
import LoginComponent from "./components/login/component";
import DashboardComponent from "./components/dashboard/dashboardComponent";
import ClientsFind from "./components/clients/clientsFind";
import ShareholderComponent from "./components/clients/partners/shareholder/component";
import ComponentClientInformation from "./components/clientInformation/componentClientInformation";
import CreatePropspect from "./components/propspect/createPropspect";
import ClientEdit from "./components/clientEdit/clientEdit";
import Previsita from "./components/previsita/createPrevisita/createPrevisita";
import EditPrevisita from "./components/previsita/editPrevisit/editPrevisit";
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
import FavoritesGroup from "./components/contact/favoritesGroup/favoritesGroupComponent";
import Assigned from "./components/myPendings/assigned/componentAssigned";
import StudyCredit from "./components/clients/creditStudy/componentCreditStudy";
import Visor from "./components/visor/visor";

class App extends Component {
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
            <Route path="dashboard" component={DashboardComponent}>
                <Route path="clients" component={ClientsFind}></Route>
                <Route path="viewManagement" component={ViewManagement}></Route>
                <Route path="shareholder" component={ShareholderComponent}></Route>
                <Route path="clientInformation" component={ComponentClientInformation}></Route>
                <Route path="creditStudy" component={StudyCredit}></Route>
                <Route path="createPropspect" component={CreatePropspect}></Route>
                <Route path="clientEdit" component={ClientEdit}></Route>
                <Route path="previsita" component={Previsita}></Route>
                <Route path="previsitaEditar/:id" component={EditPrevisita}></Route>
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
                    <Route path="AEC" component={AEC}></Route>
                    <Route path="assigned" component={Assigned}></Route>
                </Route>
                <Route path="alerts" component={ViewAlerts}></Route>
                <Route path="alertBlackList" component={AlertBlackList}></Route>
                <Route path="contacts" component={FindContacts}></Route>
                <Route path="clientsContacts" component={ClientsContactsDetails}></Route>
                <Route path="searchContactsByFunctionOrType" component={ContactByFunctionOrTypeComponent}></Route>
                <Route path="contact/favoriteGroup" component={FavoritesGroup}></Route>
                <Route path="visor" component={Visor}></Route>
            </Route>
        </Route>
    </Grid>
);
