import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { ModalComponentAgent } from '../../../../src/components/agent/modalComponent';
import ModalComponentAgentRedux from '../../../../src/components/agent/modalComponent';
import { shallow } from 'enzyme';

let defaultProps;
let dispatchConsultValueActiveLog;
let dispatchChangeValueActiveLog;

let store;
let middlewares = [thunk];
let mockStore = configureStore(middlewares);

describe('Test ModalComponentAgent', () => {

    beforeEach(() => {
        dispatchConsultValueActiveLog = sinon.stub().resolves({});
        dispatchChangeValueActiveLog = sinon.fake();
        defaultProps = {
            dispatchConsultValueActiveLog,
            dispatchChangeValueActiveLog
        }

        store = mockStore({})
    })

    it('Should render component', () => {
        itRenders(<ModalComponentAgent {...defaultProps} />)
    })

    it('Should render component with redux', () => {
        itRenders(<ModalComponentAgentRedux {...defaultProps} store={store}/>)
    })

    it('When changeValueActiveTrazas is instanced', () => {
        const wrapper = shallow(<ModalComponentAgent {...defaultProps}/>);
        wrapper.instance().changeValueActiveTrazas();
        sinon.assert.calledOnce(dispatchChangeValueActiveLog);
    })

    it('When clickButtonDownloadTraza is instanced', () => {
        const wrapper = shallow(<ModalComponentAgent {...defaultProps}/>);
        wrapper.instance().clickButtonDownloadTraza();
    })
})