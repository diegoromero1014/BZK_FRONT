import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

import ModalComponentGroupRedux from '../../../../../../src/components/contact/favoritesGroup/createEdit/modalComponentGroup';
import { ModalComponentGroup } from '../../../../../../src/components/contact/favoritesGroup/createEdit/modalComponentGroup';

let defaultProps;
let resetForm;
let dispatchResetModal;
let dispatchClearContactName;
let dispatchShowLoading;
let dispatchGetGroupForId;
let dispatchGetListContactGroupForId;
let dispatchSwtShowMessage;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test ModalComponentGroup', () => {

    beforeEach(() => {
        resetForm = sinon.fake();
        dispatchResetModal = sinon.fake();
        dispatchClearContactName = sinon.fake();
        dispatchShowLoading = sinon.fake();
        dispatchGetGroupForId = sinon.fake();
        dispatchGetListContactGroupForId = sinon.stub().resolves({});
        dispatchSwtShowMessage = sinon.fake();
        defaultProps = {
            fields: {
                searchGroup: { value: null, onChange: sinon.fake() },
                contact: { value: null }
            },
            resetForm,
            dispatchResetModal,
            dispatchClearContactName,
            groupsFavoriteContacts: Immutable.Map({
                group: Immutable.Map({
                    listContact: []
                })
            }),
            groupId: null,
            dispatchShowLoading,
            dispatchGetGroupForId,
            dispatchGetListContactGroupForId,
            dispatchSwtShowMessage
        };
        store = mockStore({});
    })
    
    it('Should render component', () => {
        itRenders(<ModalComponentGroup {...defaultProps} />);
    })
    
    it('Should render component with redux', () => {
        itRenders(<ModalComponentGroupRedux {...defaultProps} store={store}/>);
    })

    it('When noop is instanced', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().noop();
    })

    it('Case groupId is not null', () => {
        defaultProps.groupId = 1;
        itRenders(<ModalComponentGroup {...defaultProps} />);
        sinon.assert.calledTwice(dispatchResetModal);
        sinon.assert.calledTwice(dispatchShowLoading);
    })

    it('Case groupId is not null and dispatchGetListContactGroupForId.resolves is 200', () => {
        defaultProps.groupId = 1;
        defaultProps.dispatchGetListContactGroupForId = sinon.stub().resolves({
            payload: {
                data: {
                    status: 200
                }
            }
        });
        itRenders(<ModalComponentGroup {...defaultProps} />);
        sinon.assert.calledTwice(dispatchResetModal);
        sinon.assert.calledTwice(dispatchShowLoading);
    })
    
    it('When handleKeyValidateExistGroup is instanced', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().handleKeyValidateExistGroup({ keyCode: null });
    })
    
    it('When handleKeyValidateExistGroup is instanced and keyCode is 13', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().handleKeyValidateExistGroup({ keyCode: 13, preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchShowLoading);
        sinon.assert.calledOnce(dispatchSwtShowMessage);
    })
})