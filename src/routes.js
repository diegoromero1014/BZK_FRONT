import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import {Grid} from 'react-flexbox-grid';
import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/Component';
import DashboardComponent from './components/Dashboard/dashboardComponent';
import ClientsFind from './components/clients/ClientsFind';
import ComponentClientInformation from './components/clientInformation/ComponentClientInformation';

class App extends Component {
    render() {
        return (
            <div id="app" className="full-height">
                {this.props.children}
            </div>
        );
    }
}

export default (
    <div className="full-height">
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="dashboard" component={DashboardComponent}>
              <Route path="clients" component={ClientsFind}></Route>
              <Route path="clientInformation" component={ComponentClientInformation}></Route>
            </Route>
        </Route>
    </div>
);
