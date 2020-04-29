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
                    name: null,
                    id: null
                })
            }),
            groupId: null,
            dispatchShowLoading,
            dispatchGetGroupForId,
            dispatchGetListContactGroupForId,
            dispatchSwtShowMessage,
            dispatchGetValidateExistGroup,
            dispatchSaveNameGroup
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
                    data: ""
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroup is instanced and dispatchGetValidateExistGroup is resolved and groupSearch is not null', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: { id: 1 }
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })
    
    it('When handleValidateExistGroup is instanced and dispatchGetValidateExistGroup is resolved and groupSearch is empty', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: { id: 2 }
                }
            }
        });
        defaultProps.groupsFavoriteContacts = Immutable.Map({
            group: Immutable.Map({
                listContact: [],
                id: ''
            })
        });
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroup();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced data is not null', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: {},
                    status: 200
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced data is null', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: null,
                    status: 200
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and status is not 200', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: null,
                    status: 500
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and status is 422', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: null,
                    status: 422
                }
            }
        })
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and data is null and groupsFavoriteContacts.group.id is not empty', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: null,
                    status: 200
                }
            }
        });
        defaultProps.groupsFavoriteContacts = Immutable.Map({
            group: Immutable.Map({
                listContact: [],
                id: ''
            })
        });
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and status is not 200, groupsFavoriteContacts.group.id is empty', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: { 
                        id: 2
                    },
                    status: 200
                }
            }
        });
        defaultProps.groupsFavoriteContacts = Immutable.Map({
            group: Immutable.Map({
                listContact: [],
                id: ''
            })
        });
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and status is not 200, groupsFavoriteContacts.group.id is 1', () => {
        defaultProps.dispatchGetValidateExistGroup = sinon.stub().resolves({
            payload: {
                data: {
                    data: { 
                        id: 2
                    },
                    status: 200
                }
            }
        });
        defaultProps.groupsFavoriteContacts = Immutable.Map({
            group: Immutable.Map({
                listContact: [],
                id: 1
            })
        });
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'any';
        wrapper.instance().handleValidateExistGroupSearch();
        sinon.assert.calledOnce(wrapper.instance().props.dispatchGetValidateExistGroup);
    })

    it('When handleValidateExistGroupSearch is instanced and searchGroup.value has xssValidation false', () => {
        const wrapper = shallow(<ModalComponentGroup {...defaultProps} />);
        wrapper.instance().props.fields.searchGroup.value = 'onload';
        wrapper.instance().handleValidateExistGroupSearch();
    })
})