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
        store = mockStore({});
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
        keyword = alertBlackList.get('keywordNameNitClient')

        defaultProps = {
            dispatchBlackListFindServer,
            dispatchChangePage,
            dispatchChangeKeywordClient,
            dispatchUpdateTabSeleted,
            dispatchShowLoading,
            dispatchGetAlertsByUser,

            alertBlackList : Immutable.Map({ keyWordNameNit: '', keywordNameNitClient : 'black_list_alert'})
        }
    })

    afterEach(() => {
        redirectUrl.restore();
    })


    describe('Test rendering', () => {

        // it('rendering component with redux', () => {
        //     itRenders(<SearchBarClientRedux store={store} />)
        // })

        // it('rendering component SearchBarClient', () => {
        //     itRenders(<SearchBarClient {...defaultProps} />)
        // })

    })


})
