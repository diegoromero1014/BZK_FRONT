import React from 'react';
import ReactDom from 'react-dom';
import Root from './components/root/root';
import configureStore from './store/store';
import Routes from './routes';
import Router from './historyRouter';
import { syncHistoryWithStore } from 'react-router-redux';
import { setAuthorizationHeader, setInterceptors } from './api';

export const store = configureStore();

const reduxRouterMiddleware = syncHistoryWithStore(Router, store);

require("../styles/index");
require('jquery');
require('semantic-ui/dist/semantic');

setAuthorizationHeader(localStorage.getItem('sessionTokenFront'));
setInterceptors();


ReactDom.render(
    <Root
        store={store}
        browserHistory={reduxRouterMiddleware}
        routes={Routes}
    />,
    document.querySelector(".rootContainer")
);
