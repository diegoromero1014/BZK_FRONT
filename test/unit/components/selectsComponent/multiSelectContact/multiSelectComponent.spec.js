import React from 'react';
import MultiSelectComponentRedux from '../../../../../src/components/selectsComponent/multiSelectContact/multiSelectComponent';
import { MultiSelectComponent } from '../../../../../src/components/selectsComponent/multiSelectContact/multiSelectComponent';
import Immutable from 'immutable';

import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { FILTER_FUNCTION_ID, FILTER_TYPE_LBO_ID, FILTER_HOBBIES, FILTER_SPORTS } from '../../../../../src/components/selectsComponent/constants';

let dispatchConsultDataSelect;
let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test multiSelectComponent', () => {

    beforeEach(() => {
        store = mockStore({})
        dispatchConsultDataSelect = sinon.fake();

        defaultProps = {
            dispatchConsultDataSelect,
            idTypeFilter: '',

            selectsReducer : Immutable.Map({ 
                dataTypeFunction : "",
                dataTypeLBO : "",
                dataTypeHobbies : "",
                dataTypeSports : ""
             })
        }

    })

    describe('Rendering test', () => {

        it('Rendering SearchBarBlackList component', () => {
            itRenders(<MultiSelectComponent {...defaultProps} />)
        })

        it('Rendering SearchBarBlackList component with redux', () => {
            itRenders(<MultiSelectComponentRedux store={store} />)
        })

        it('test idTypeFilter equals FILTER_FUNCTION_ID', () => {
            defaultProps.idTypeFilter = FILTER_FUNCTION_ID;
            itRenders(<MultiSelectComponent {...defaultProps} />)
        })

        it('test idTypeFilter equals FILTER_TYPE_LBO_ID', () => {
            defaultProps.idTypeFilter = FILTER_TYPE_LBO_ID;
            itRenders(<MultiSelectComponent {...defaultProps} />)
        })

        it('test idTypeFilter equals FILTER_HOBBIES', () => {
            defaultProps.idTypeFilter = FILTER_HOBBIES;
            itRenders(<MultiSelectComponent {...defaultProps} />)
        })

        it('test idTypeFilter equals FILTER_SPORTS', () => {
            defaultProps.idTypeFilter = FILTER_SPORTS;
            itRenders(<MultiSelectComponent {...defaultProps} />)
        })
    })

})
