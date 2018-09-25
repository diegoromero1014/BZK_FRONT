import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

import SecurityMessageComponent from '~/src/components/globalComponents/securityMessageComponent';

import * as actionsGlobal from "~/src/actionsGlobal";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const message = 'message';

describe('Test SecurityMessageComponent', () => {

    let store;
    let stubConsultParameterServer;

    beforeEach(() => {
        const reducerGlobal = Immutable.Map({ securityMessage: message });
        store = mockStore({ reducerGlobal, });
        const success = { payload: { data: { parameter: JSON.stringify({ value: message }) } } };
        stubConsultParameterServer = sinon.stub(actionsGlobal, 'consultParameterServer').returns(() => {
            return new Promise(
                (resolve, reject) => resolve(success)
            )
        });
    });

    afterEach(function () {
        // runs after each test in this block
        stubConsultParameterServer.restore();
    });

    it('Should render SecurityMessage', () => {
        itRenders(<SecurityMessageComponent store={store} />);
    });

    it('Should render div', () => {
        const wrapper = shallow(<SecurityMessageComponent store={store} />).dive();
        expect(wrapper.find('div')).to.have.length(1);
    });

    it('Should render span', () => {
        const wrapper = shallow(<SecurityMessageComponent store={store} />).dive();
        expect(wrapper.find('span')).to.have.length(1);
    });

    it('Should render message', () => {
        const wrapper = shallow(<SecurityMessageComponent store={store} />).dive();
        expect(wrapper.find('span').text()).to.equal(message);
    });

    it('Should ask for message parameter', () => {
        const reducerGlobal = Immutable.Map({ securityMessage: null });
        store = mockStore({ reducerGlobal });

        const wrapper = shallow(<SecurityMessageComponent store={store} />).dive();
        expect(wrapper.find('span')).to.have.length(1);
    });
});