import React from 'react';
import ReactDom from 'react-dom';
import Root from './components/root/root';
import configureStore from './store/store';
import Routes from './routes';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
const store = configureStore();

const reduxRouterMiddleware = syncHistoryWithStore(browserHistory, store);

require("../styles/index");
require('jquery');
require('semantic-ui/dist/semantic');

ReactDom.render(
    <Root
        store={store}
        browserHistory={reduxRouterMiddleware}
        routes={Routes}
    />,
    document.querySelector(".rootContainer")
);
