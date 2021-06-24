import React from 'react';
import Immutable from "immutable";
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import EmbebedClientVisorComponent from '../../../../src/components/clientVisor/embebedVisorComponent';
let store;
let consultURLServer;
let defaultProps;
const reducerGlobal = Immutable.Map({'rowCount':{}});
const contactsByClient = Immutable.Map({});
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
describe('Test Embebed Visor', () => {
    
    beforeEach(() => {
        consultURLServer =  sinon.stub();
        consultURLServer.resolves({});
        defaultProps = {
            modalIsOpen: false,
            visor_url: "",
            consultURLServer,
        }

        store = mockStore({
            reducerGlobal,
            contactsByClient
        });
    });
    it('should render a embebed visor', () => {
        itRenders(<EmbebedClientVisorComponent {...defaultProps} store={store}/>);
        //expect(consultURLServer.called).to.equal(true);
    });

})
