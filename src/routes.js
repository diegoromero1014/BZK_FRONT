import React, {Component} from 'react';
import {Route, Redirect} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';
import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/component';
import DashboardComponent from './components/dashboard/dashboardComponent';
import ClientsFind from './components/clients/clientsFind';
import ContactComponent from './components/contact/component';
import modalComponent from './components/modal/modalComponent';
import ShareHolderComponent from './components/shareHolder/component';
import ComponentClientInformation from './components/clientInformation/componentClientInformation';
import CreatePropspect from './components/propspect/createPropspect';
import ClientEdit from './components/clientEdit/clientEdit';
import uiTester from './ui/uiTester';

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
                <Route path="shareHolder" component={ShareHolderComponent}></Route>
                <Route path="clientInformation" component={ComponentClientInformation}></Route>
                <Route path="createPropspect" component={CreatePropspect}></Route>
                <Route path="clientEdit" component={ClientEdit}></Route>
            </Route>
            <Route path="ui" component={uiTester}></Route>
        </Route>
    </Grid>
);
