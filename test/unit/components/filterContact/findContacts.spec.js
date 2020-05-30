import React from 'react';
import SearchContactsRedux from '../../../../src/components/filterContact/findContacts';
import { SearchContacts } from '../../../../src/components/filterContact/findContacts';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchChangeKeyword;
let dispatchContactsFindServer;
let dispatchChangePage;
let dispatchClearContacts;
let dispatchUpdateTitleNavBar;
let dispatchChangeStateSaveData;
let dispatchChangeSearchAllIntoContacts;
let dispatchSwtShowMessage;
let redirectUrl;

let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test SearchContacts component', () => {

    beforeEach(() => {
        store = mockStore({})

        dispatchChangeKeyword = sinon.fake();
        dispatchContactsFindServer = sinon.stub();
        dispatchChangePage = sinon.fake();
        dispatchClearContacts = sinon.fake();
        dispatchUpdateTitleNavBar = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        dispatchChangeSearchAllIntoContacts = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();

        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchChangeKeyword,
            dispatchContactsFindServer,
            dispatchChangePage,
            dispatchClearContacts,
            dispatchUpdateTitleNavBar,
            dispatchChangeStateSaveData,
            dispatchChangeSearchAllIntoContacts,
            dispatchSwtShowMessage,


            filterContactsReducer : Immutable.Map({ keyword : "test", searchIntoAllContacts : "test", responseContacts : [] })
        }
    })


    afterEach(() => {
        redirectUrl.restore();
    })
    
    describe('Rendering components', () => {
        
        it('Rendering SearchContacts with redux', () => {
            itRenders(<SearchContactsRedux store={store}/>)
        })

        it('Rendering SearchContacts component', () => {
            itRenders(<SearchContacts {...defaultProps}/>)
        })

        it('componentWillMount instanced', () => {
            const wrapper = shallow(<SearchContacts {...defaultProps}/>);
            wrapper.instance().componentWillMount();
            sinon.assert.called(dispatchClearContacts);
            sinon.assert.called(dispatchUpdateTitleNavBar);
        })

        it('handleChangeKeyword instance', () => {
            const e = {
                target : {
                    value : ""
                },
                keyCode : 13,
                which : 13
            }
            const wrapper = shallow(<SearchContacts {...defaultProps}/>);
            wrapper.instance().handleChangeKeyword(e)
            expect(wrapper.state().showEr).to.equal(true);
        })

        it('handleChangeSearchAllIntoContacts instance data ""', () => {
            defaultProps.dispatchContactsFindServer.resolves({
                payload : {
                    data : {
                        data : ""
                    }
                }
            })
            const wrapper = shallow(<SearchContacts {...defaultProps}/>);
            wrapper.instance().handleChangeSearchAllIntoContacts();
            sinon.assert.calledOnce(dispatchChangeStateSaveData);
            sinon.assert.calledOnce(dispatchContactsFindServer);
        })
        
        it('handleContactsFind instanced', () => {
            defaultProps.dispatchContactsFindServer.resolves({
                payload : {
                    data : {
                        data : "test"
                    }
                }
            })
            const wrapper = shallow(<SearchContacts {...defaultProps}/>);
            wrapper.instance().handleContactsFind();
            sinon.assert.called(dispatchChangeStateSaveData);
        })

        it('cleanSearch instance', () => {
            const wrapper = shallow(<SearchContacts {...defaultProps}/>);
            wrapper.instance().cleanSearch();
            sinon.assert.called(dispatchClearContacts);
        })

    })

})
