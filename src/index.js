import React from 'react';
import ReactDom from 'react-dom';
import Root from './components/root/root';
import configureStore from './store/store';
import Routes from './routes';
import Router from './historyRouter';
import { syncHistoryWithStore } from 'react-router-redux';
import axios from 'axios';

export const store = configureStore();

const reduxRouterMiddleware = syncHistoryWithStore(Router, store);

require("../styles/index");
require('jquery');
require('semantic-ui/dist/semantic');

if (localStorage.getItem('sessionTokenFront')) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('sessionTokenFront')}` 
}


ReactDom.render(
    <Root
        store={store}
        browserHistory={reduxRouterMiddleware}
        routes={Routes}
    />,
    document.querySelector(".rootContainer")
);
