import React from 'react';
import SectionSearchClientRedux from '../../../../../../src/components/managementView/widgets/searchClient';
import { SectionSearchClient } from '../../../../../../src/components/managementView/widgets/searchClient';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let defaultProps ;

let store; 
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test for SectionSearchClient Component', () => {
    
})