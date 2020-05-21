import React from 'react';
import ButtonsFilterRedux from '../../../../../../src/components/managementView/widgets/searchClient/buttonsFilter';
import { ButtonsFilter } from '../../../../../../src/components/managementView/widgets/searchClient/buttonsFilter';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchFilterbyClients;
let dispatchFilterByRealtion;
let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test buttonsFilter component', () => {

    beforeEach(() => {
        store = mockStore({});
        dispatchFilterbyClients = sinon.fake();
        dispatchFilterByRealtion = sinon.fake();

        defaultProps = {
            dispatchFilterbyClients,
            dispatchFilterByRealtion,
            data: {
                name: "",
                economicGroup: "",
                access: "",
            },

            document : {
                getElementById : sinon.fake()
            }
        }
    })

    describe('Rendering test for buttonsFilter component', () => {

        it('Rendering buttonsFilter with redux', () => {
            itRenders(<ButtonsFilterRedux store={store} />)
        })

        it('Rendering buttonsFilter component', () => {
            itRenders(<ButtonsFilter {...defaultProps} />)
        })
        
    })

})
