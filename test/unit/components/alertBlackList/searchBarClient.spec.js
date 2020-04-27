import React from 'react';
import SearchBarClientRedux from '../../../../src/components/alertBlackList/searchBarClient';
import { SearchBarClient } from '../../../../src/components/alertBlackList/searchBarClient';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchBlackListFindServer;
let dispatchChangePage;
let dispatchChangeKeywordClient;
let dispatchUpdateTabSeleted;
let dispatchShowLoading;
let dispatchGetAlertsByUser;
let redirectUrl;
let defaultProps;
let alertBlackList;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test SearchBarClient component', () => {

    beforeEach(() => {
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
        dispatchChangeKeywordClient = sinon.fake();
        dispatchUpdateTabSeleted = sinon.fake();
        dispatchShowLoading = sinon.fake();
        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchBlackListFindServer,
            dispatchChangePage,
            dispatchChangeKeywordClient,
            dispatchUpdateTabSeleted,
            dispatchShowLoading,
            dispatchGetAlertsByUser,
            alertBlackList : Immutable.Map({ keyWordNameNit: '', keywordNameNitClient : 'black_list_alert'})
        }
        store = mockStore({});
    })

    afterEach(() => {
        redirectUrl.restore();
    })


    describe('Test rendering', () => {

        it('rendering component SearchBarClient', () => {
            itRenders(<SearchBarClient {...defaultProps} />)
        })
        
        it('rendering component with redux', () => {
            itRenders(<SearchBarClientRedux store={store} />)
        })

        it('When closeError is instanced', () => {
            const wrapper = shallow(<SearchBarClient {...defaultProps} />);
            wrapper.instance().closeError();
            expect(wrapper.state().showEr).to.equal(false);
        })

        it('When handleChangeKeywordClient is instanced', () => {
            const wrapper = shallow(<SearchBarClient {...defaultProps} />);
            wrapper.instance().handleChangeKeywordClient({ target: { value: null }});
            sinon.assert.calledOnce(dispatchChangeKeywordClient);
        })

        it('When handleChangeKeywordClient is instanced and keyCode is 13', () => {
            const wrapper = shallow(<SearchBarClient {...defaultProps} />);
            wrapper.instance().handleChangeKeywordClient({ target: { value: null }, keyCode: 13 });
            sinon.assert.calledOnce(dispatchChangeKeywordClient);
        })

        
        it('When handleClientsFind is instanced', () => {
            defaultProps.alertBlackList = Immutable.Map({
                keywordNameNitClient: "",
            })
            const wrapper = shallow(<SearchBarClient {...defaultProps} />);
            wrapper.instance().handleClientsFind();
            expect(wrapper.state().showEr).to.equal(true);
        })

        it('When handleChangeKeywordClient is instanced and keyCode is 13 and dispatchBlackListFindServer.resolves is empty', () => {
            defaultProps.dispatchBlackListFindServer = sinon.stub().resolves({});
            const wrapper = shallow(<SearchBarClient {...defaultProps} />);
            wrapper.instance().handleChangeKeywordClient({ target: { value: null }, keyCode: 13 });
            sinon.assert.calledOnce(dispatchChangeKeywordClient);
        })
    })
})
