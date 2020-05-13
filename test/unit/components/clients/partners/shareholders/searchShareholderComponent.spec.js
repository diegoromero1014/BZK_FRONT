import React from 'react';
import SearchShareholderComponentRedux from '../../../../../../src/components/clients/partners/shareholder/searchShareholderComponent';
import { SearchShareholderComponent } from '../../../../../../src/components/clients/partners/shareholder/searchShareholderComponent';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchShareholdersByClientFindServer;
let dispatchChangeKeywordShareholder;
let dispatchClearShareholderPaginator;
let dispatchClearShareholderOrder;
let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test SearchShareholderComponent ', () => {
    
    beforeEach(() => {
        store = mockStore({});
        dispatchShareholdersByClientFindServer = sinon.fake();
        dispatchChangeKeywordShareholder = sinon.fake();
        dispatchClearShareholderPaginator = sinon.fake();
        dispatchClearShareholderOrder = sinon.fake();

        defaultProps = {
            dispatchShareholdersByClientFindServer,
            dispatchChangeKeywordShareholder,
            dispatchClearShareholderPaginator,
            dispatchClearShareholderOrder
        }

    })

    describe('Rendering component', () => {
        
        it('Rendering SearchShareholderComponent component', () => {
            itRenders(<SearchShareholderComponent {...defaultProps}/>)
        })
        
        it('Rendering SearchShareholderComponent component with redux', () => {
            itRenders(<SearchShareholderComponentRedux store={store}/>)
        })

        it('Rendering handleChangeKeyword instance', () => {
            const e = {
                keyCode : 13,
                which : 13
            }
            const wrapper = shallow(<SearchShareholderComponent {...defaultProps}/>)
            wrapper.instance().handleChangeKeyword(e)
        })

        it('Rendering handleChangeKeyword instance e with void values', () => {
            const e = {
                keyCode : "",
                which : "",
                target : {
                    value : "test"
                }
            }
            const wrapper = shallow(<SearchShareholderComponent {...defaultProps}/>)
            wrapper.instance().handleChangeKeyword(e)
            expect(wrapper.state().keywordShareholder).to.equal("test");
            sinon.assert.calledOnce(dispatchChangeKeywordShareholder);
        })

        it('Rendering handleShareholderByClientsFind instance', () => {
            const wrapper = shallow(<SearchShareholderComponent {...defaultProps}/>)
            wrapper.instance().handleShareholderByClientsFind();
            sinon.assert.calledOnce(dispatchClearShareholderPaginator);
            sinon.assert.calledOnce(dispatchClearShareholderOrder);
            sinon.assert.calledOnce(dispatchShareholdersByClientFindServer);
        })
    })
    
})
