import React from 'react';
import SearchBarBlackListRedux from '../../../../src/components/alertBlackList/searchBarEntityBlackList';
import { SearchBarBlackList } from '../../../../src/components/alertBlackList/searchBarEntityBlackList';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchChangeKeywordClient;
let dispatchBlackListFindServer;
let dispatchChangePage;
let dispatchChangeKeyword;
let dispatchUpdateTabSeleted;
let dispatchShowLoading;
let dispatchGetAlertsByUser;
let redirectUrl;
let defaultProps;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test for SearchBarBlackList component', () => {

    beforeEach(() => {
        dispatchChangeKeywordClient = sinon.fake();
        dispatchBlackListFindServer = sinon.stub();
        dispatchBlackListFindServer.resolves({
            payload: {
                data: {
                    data: null
                }
            }
        })
        dispatchGetAlertsByUser = sinon.stub();
        dispatchGetAlertsByUser.resolves({
            payload: {
                data: {
                    data: 'black_list_alert'
                }
            }
        })
        dispatchChangePage = sinon.fake();
        dispatchChangeKeyword = sinon.fake();
        dispatchUpdateTabSeleted = sinon.fake();
        dispatchShowLoading = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchBlackListFindServer,
            dispatchGetAlertsByUser,
            dispatchChangePage,
            dispatchChangeKeyword,
            dispatchUpdateTabSeleted,
            dispatchShowLoading,

            alertBlackList : Immutable.Map({ keyWordNameNit: '', keywordNameNitClient : 'black_list_alert'})
        }

        store = mockStore({})
    }) 

    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering test and functions', () => {
        
        it('Rendering SearchBarBlackList component', () => {
            itRenders(<SearchBarBlackList {...defaultProps}/>)
        })
        
        it('Rendering SearchBarBlackList component with redux', () => {
            itRenders(<SearchBarBlackListRedux store={store}/>)
        })

        it('When closeError is instanced', () => {
            const wrapper = shallow(<SearchBarBlackList {...defaultProps} />);
            wrapper.instance().closeError();
            expect(wrapper.state().showEr).to.equal(false);
        })

        it('When handleChangeKeywordEntity is instanced', () => {
            const wrapper = shallow(<SearchBarBlackList {...defaultProps} />);
            wrapper.instance().handleChangeKeywordEntity({ target: { value : null }});
            sinon.assert.calledOnce(dispatchChangeKeyword);
        })

        it('When handleEntityFind is instanced and keyCode is 13', () => {
            const wrapper = shallow(<SearchBarBlackList {...defaultProps} />);
            wrapper.instance().handleChangeKeywordEntity({ target: { value :null }, keyCode: 13});
            sinon.assert.calledOnce(dispatchChangeKeyword);
        })

        it('When handleClientsFind is instanced', () => {
            defaultProps.alertBlackList = Immutable.Map({
                keywordNameNit: "",
            })
            const wrapper = shallow(<SearchBarBlackList {...defaultProps} />);
            wrapper.instance().handleEntityFind();
            expect(wrapper.state().showEr).to.equal(true);
        })


        it('When handleClientsFind is instanced and keywordNameNit not void', () => {
            defaultProps.alertBlackList = Immutable.Map({
                keywordNameNit: "Test",
            })
            const wrapper = shallow(<SearchBarBlackList {...defaultProps} />);
            wrapper.instance().handleEntityFind();
            sinon.assert.calledOnce(dispatchShowLoading)
            sinon.assert.calledOnce(dispatchBlackListFindServer)
        })

    })
    
})
