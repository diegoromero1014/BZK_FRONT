import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';
import MainMenuComponent from './components/menu/component';
import LoginComponent from './components/login/Component';
import DashboardComponent from './components/Dashboard/dashboardComponent';
import ClientsFind from './components/clients/ClientsFind';
import ContactComponent from './components/contact/component';
import modalComponent from './components/modal/modalComponent';
import ShareHolderComponent from './components/shareHolder/shareHolderComponent';
import ComponentClientInformation from './components/clientInformation/ComponentClientInformation';
import CreatePropspect from './components/propspect/CreatePropspect';

class App extends Component {
    render() {
        return (
          <div className="full-height" style={{width: "100%"}}>
              {this.props.children}
          </div>
        );
    }
}

export default (
  <Grid>
    <div className="full-height">
        <Route path="/" component={App}>
            <Route path="login" component={LoginComponent}></Route>
            <Route path="dashboard" component={DashboardComponent}>
              <Route path="clients" component={ClientsFind}></Route>
              <Route path="shareHolder" component={ShareHolderComponent}></Route>
              <Route path="clientInformation" component={ComponentClientInformation}></Route>
              <Route path="createPropspect" component={CreatePropspect}></Route>
            </Route>
        </Route>
    </div>
  </Grid>
);
