import React from 'react';
import SearchGroupRedux from '../../../../../src/components/contact/favoritesGroup/searchGroup';
import { SearchGroup } from '../../../../../src/components/contact/favoritesGroup/searchGroup';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchGroupFindServer;
let dispatchChangePage;
let dispatchChangeKeyword;
let dispatchShowLoading;

let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test for SearchGroup component', () => {
    
    beforeEach(() => {
        store = mockStore({});
        dispatchGroupFindServer = sinon.stub();
        dispatchGroupFindServer.resolves({
            payload : {
                data : {
                    date : null
                }
            }
        })
        dispatchChangePage = sinon.fake();
        dispatchChangeKeyword = sinon.fake();
        dispatchShowLoading = sinon.fake();

        defaultProps = {
            dispatchGroupFindServer,
            dispatchChangePage,
            dispatchChangeKeyword,
            dispatchShowLoading,

            groupsFavoriteContacts : Immutable.Map({ keywordName : "" })
        }
    })

    describe('Rendering component and functions', () => {
        
        it('Rendering component', () => {
            itRenders(<SearchGroup {...defaultProps}/>)
        })

        it('Rendering component with redux', () => {
            itRenders(<SearchGroupRedux store={store}/>)
        })

        it('handleChangeKeyword instance', () => {
            const e = {
                keyCode : 13,
                which : 13,
                target : {
                    value : ""
                }
            }
            const wrapper = shallow(<SearchGroup {...defaultProps}/>);
            wrapper.instance().handleChangeKeyword(e)
        })

        it('handleClientsFind  instance, with keywordName void', () => {
            const wrapper = shallow(<SearchGroup {...defaultProps}/>);
            wrapper.instance().handleClientsFind();
            expect(wrapper.state().showEr).to.equal(true);
        })

        it('handleClientsFind  instance, with keywordName void', () => {
            const wrapper = shallow(<SearchGroup {...defaultProps}/>);
            wrapper.instance().handleClientsFind();
            expect(wrapper.state().showEr).to.equal(true);
        })

        it('handleClientsFind  instance, with keywordName with value', () => {
            defaultProps.groupsFavoriteContacts = Immutable.Map({ keywordName : "Test" });
            const wrapper = shallow(<SearchGroup {...defaultProps}/>);
            wrapper.instance().handleClientsFind();
            sinon.assert.calledOnce(dispatchShowLoading);
            sinon.assert.calledOnce(dispatchGroupFindServer);
            sinon.assert.calledOnce(dispatchShowLoading);
        })
    })
})
