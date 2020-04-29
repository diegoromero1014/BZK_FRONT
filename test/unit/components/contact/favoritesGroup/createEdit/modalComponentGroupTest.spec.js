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
let dispatchGetValidateExistGroup;
let dispatchSaveNameGroup;
let dispatchContactsFindServer;
let dispatchSearchContactForGroup;

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
        dispatchGetValidateExistGroup = sinon.stub().resolves({});
        dispatchSearchContactForGroup = sinon.stub();
        dispatchContactsFindServer = sinon.stub().resolves({
            payload: {
                data: {
                    data: {
                        listContact: ""
                    }
                }
            }
        });
        dispatchSaveNameGroup = sinon.fake();
        defaultProps = {
            fields: {
                searchGroup: { value: 'hola', onChange: sinon.fake() },
                contact: { value: null }
            },
            resetForm,
            dispatchResetModal,
            dispatchClearContactName,
            groupsFavoriteContacts: Immutable.Map({
                group: Immutable.Map({
                    listContact: [],
                    name: null
                })
            }),
            groupId: null,
            dispatchShowLoading,
            dispatchGetGroupForId,
            dispatchGetListContactGroupForId,
            dispatchSwtShowMessage,
            dispatchGetValidateExistGroup,
            dispatchSaveNameGroup,
            dispatchContactsFindServer
        };
        store = mockStore({});
    })

    it('Should render component', () => {
        itRenders(<ModalComponentGroup {...defaultProps} />);
    })

    it('Should render component with redux', () => {
        itRenders(<ModalComponentGroupRedux {...defaultProps} store={store} />);
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
        wrapper.instance().handleKeyValidateExistGroup({ keyCode: 13, preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchShowLoading);
        sinon.assert.calledOnce(dispatchSwtShowMessage);
        wrapper.instance().handleKeyValidateExistGroup({ keyCode: 13, preventDefault: sinon.fake(), consultclick: true });
    })

    it('When handleValidateExistGroup is instanced', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(dispatchShowLoading);
        sinon.assert.calledOnce(dispatchSwtShowMessage);
    })

    it('When handleValidateExistGroup is instanced and searchGroup has value', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroup is instanced and dispatchGetValidateExistGroup is resolved', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: 'any'
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    //mateo 

    it('onClickLimpiarNameGroup instance', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().onClickLimpiarNameGroup();
        sinon.assert.calledThrice(resetForm);
        sinon.assert.calledThrice(dispatchResetModal);
        expect(wrapper.state().disableName).to.equal('');
        expect(wrapper.state().disabled).to.equal('disabled');
    })

    it('onClickLimpiar  instance', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().onClickLimpiar();
        sinon.assert.calledOn(resetForm);
        sinon.assert.calledTwice(dispatchClearContactName);
    })

    it('openModal instance', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().openModal();
        sinon.assert.calledTwice(resetForm);
        sinon.assert.calledOnce(dispatchClearContactName);
    })

    it('closeModal instance', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().closeModal();
        expect(wrapper.state().modalIsOpen).to.equal(false);
    })

    it('updateKeyValueContact instance', () => {
        defaultProps.fields = {
            searchGroup: { value: 'hola', onChange: sinon.fake() },
            contact: {
                value: "test"
            },
            tipoDocumento: "",
            numeroDocumento: ""
        }
        const e = {
            keyCode: 13,
            which: 13,
            preventDefault: sinon.fake()
        }
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().updateKeyValueContact(e);
    })

    it('updateKeyValueContact instance keycode diferent to 13', () => {
        defaultProps.fields = {
            searchGroup: { value: 'hola', onChange: sinon.fake() },
            contact: {
                value: "test"
            },
            tipoDocumento: "",
            numeroDocumento: ""
        }
        const e = {
            keyCode: 0,
            which: 0,
            preventDefault: sinon.fake()
        }
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().updateKeyValueContact(e);
    })

    it('updateKeyValueContact instance with vale null', () => {
        defaultProps.fields = {
            searchGroup: { value: 'hola', onChange: sinon.fake() },
            contact: {
                value: null
            },
            tipoDocumento: "",
            numeroDocumento: ""
        }
        const e = {
            keyCode: 13,
            which: 13,
            preventDefault: sinon.fake()
        }
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().updateKeyValueContact(e);
        sinon.assert.calledOnce(dispatchSwtShowMessage)
    })
    //mateo 

})