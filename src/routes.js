import React, {Component} from 'react';
import {Route, Redirect} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';
import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/component';
import DashboardComponent from './components/dashboard/dashboardComponent';
import ClientsFind from './components/clients/clientsFind';
import ContactComponent from './components/contact/component';
import modalComponent from './components/modal/modalComponent';
import ShareholderComponent from './components/shareholder/component';
import ComponentClientInformation from './components/clientInformation/componentClientInformation';
import CreatePropspect from './components/propspect/createPropspect';
import ClientEdit from './components/clientEdit/clientEdit';
import Previsita from './components/previsita/createPrevisita/createPrevisita';
import EditPrevisita from './components/previsita/editPrevisit/editPrevisit';
import Visit from './components/visit/createVisit/createVisit';
import VisitEdit from './components/visit/editVisit/editVisit';
import uiTester from './ui/uiTester';
import ViewManagement from './components/viewManagement/viewManagement';
import Pipeline from './components/pipeline/createPipeline/createPipeline';
import EditPipeline from './components/pipeline/editPipeline/editPipeline';
import BusinessPlan from './components/businessPlan/createBusinessPlan/createBusinessPlan';
import EditBusinessPlan from './components/businessPlan/editBusinessPlan/editBusinessPlan';
import AdminAlertClientsPendingUpdate from './components/alertPendingUpdateClient/pendingUpdateClientComponent';

class App extends Component {
    render() {
        return (
            <div style={{width: "100%"}}>
                {this.props.children}
            </div>
        );
    }
}

export default (
    <Grid>
        <Redirect from="/" to="/login"/>
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="dashboard" component={DashboardComponent}>
                <Route path="clients" component={ClientsFind}></Route>
                <Route path="viewManagement" component={ViewManagement}></Route>
                <Route path="shareholder" component={ShareholderComponent}></Route>
                <Route path="clientInformation" component={ComponentClientInformation}></Route>
                <Route path="createPropspect" component={CreatePropspect}></Route>
                <Route path="clientEdit" component={ClientEdit}></Route>
                <Route path="previsita" component={Previsita}></Route>
                <Route path="previsitaEditar/:id" component={EditPrevisita}></Route>
                <Route path="visita" component={Visit}></Route>
                <Route path="visitaEditar/:id" component={VisitEdit}></Route>
                <Route path="pipeline" component={Pipeline}></Route>
                <Route path="pipelineEdit/:id" component={EditPipeline}></Route>
                <Route path="businessPlan" component={BusinessPlan}></Route>
                <Route path="businessPlanEdit/:id" component={EditBusinessPlan}></Route>
                <Route path="alertClientPendingUpdate" component={AdminAlertClientsPendingUpdate}></Route>
            </Route>
            <Route path="ui" component={uiTester}></Route>
        </Route>
    </Grid>
);
