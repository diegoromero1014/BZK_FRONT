import React from 'react';
import ClientsPendingUpdateRedux from '../../../../src/components/alertPendingUpdateClient/pendingUpdateClientComponent';
import { ClientsPendingUpdate } from '../../../../src/components/alertPendingUpdateClient/pendingUpdateClientComponent';
import * as globalActions from '../../../../src/components/globalComponents/actions';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import Immutable from 'immutable';

let dispatchClientsPendingUpdateFindServer; 
let dispatchClearFilter; 
let dispatchGetMasterDataFields; 
let dispatchChangePage;
let dispatchConsultList; 
let dispatchUpdateTitleNavBar;
let dispatchConsultListWithParameterUbication;
let dispatchConsultDataSelect;
let dispatchShowLoading;
let dispatchChangeTeam;
let dispatchChangeRegion;
let dispatchChangeZone;
let dispatchConsultTeamsByRegionByEmployee;

let redirectUrl;
let defaultProps;
let resetForm;

let store;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Unit test ClientsPendingUpdate component', () => {
    
    beforeEach(() => {
        store = mockStore({});

        dispatchClientsPendingUpdateFindServer = sinon.stub();
        dispatchClearFilter = sinon.stub();
        dispatchGetMasterDataFields = sinon.stub();
        dispatchConsultList = sinon.stub();

        dispatchChangePage = sinon.fake();
        dispatchUpdateTitleNavBar = sinon.fake();
        dispatchConsultListWithParameterUbication = sinon.fake();
        dispatchConsultDataSelect = sinon.fake();
        dispatchShowLoading = sinon.fake();
        dispatchChangeTeam = sinon.fake();
        dispatchChangeRegion = sinon.fake();
        dispatchChangeZone = sinon.fake();
        dispatchConsultTeamsByRegionByEmployee = sinon.fake();
        resetForm = sinon.fake();

        redirectUrl = sinon.stub(globalActions, "redirectUrl");

        defaultProps = {
            dispatchClientsPendingUpdateFindServer,
            dispatchClearFilter,
            dispatchGetMasterDataFields,
            dispatchConsultList,
            dispatchChangePage,
            dispatchUpdateTitleNavBar,
            dispatchConsultListWithParameterUbication,
            dispatchConsultDataSelect,
            dispatchShowLoading,
            dispatchChangeTeam,
            dispatchChangeRegion,
            dispatchChangeZone,
            dispatchConsultTeamsByRegionByEmployee,
            resetForm,

            fields : {
                team : {
                    onChange : sinon.fake()
                },
                region : {
                    onChange : sinon.fake()
                },
                zone : {
                    onChange : sinon.fake()
                }
            },
            
            selectsReducer : Immutable.Map({ teamValueObjects : "" }),
            alertPendingUpdateClient : Immutable.Map({ responseClients : "" })
        }

    })

    afterEach(() => {
        redirectUrl.restore();
    })

    describe('Rendering test', () => {
        
        it('Rendering component ', () => {
            itRenders(<ClientsPendingUpdate {...defaultProps}/>)
        })

        it('Rendering component with redux', () => {
            itRenders(<ClientsPendingUpdateRedux store={store} />)
        })

        it('cleanSearch  instance', () => {
            defaultProps.dispatchConsultList.resolves({
                payload : {
                    data : {
                        teamValueObjects : ""
                    }
                }
            })
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().cleanSearch();
            sinon.assert.calledOnce(dispatchShowLoading);
            sinon.assert.calledOnce(dispatchClearFilter);
            sinon.assert.calledOnce(dispatchConsultList);
        })

        it('onChangeTeam instance with event void', () => {
            defaultProps.dispatchClientsPendingUpdateFindServer.resolves({
                payload : {
                    data : {
                        data : ""
                    }
                }
            })
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().onChangeTeam();
            sinon.assert.calledOnce(dispatchChangeTeam);
        })

        it('onChangeTeam instance with values in the event', () => {
            defaultProps.dispatchClientsPendingUpdateFindServer.resolves({
                payload : {
                    data : {
                        data : ""
                    }
                }
            })
            const val = {
                target : {
                    value : "test"
                }
            }
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().onChangeTeam(val);
            sinon.assert.calledOnce(dispatchChangeTeam);
        })

        it('onChangeRegionStatus instance ', () => {
            defaultProps.dispatchClientsPendingUpdateFindServer.resolves({
                payload : {
                    data : {
                        data : ""
                    }
                }
            })
            const val = {
                target : {
                    value : "test"
                }
            }
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().onChangeRegionStatus(val);
            sinon.assert.calledOnce(dispatchChangeRegion);
            sinon.assert.calledOnce(dispatchConsultListWithParameterUbication);
            sinon.assert.calledOnce(dispatchConsultTeamsByRegionByEmployee);
            wrapper.instance().onChangeRegionStatus("");
        })

        it('onChangeZoneStatus instance with event void ', () => {
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().onChangeZoneStatus();
            sinon.assert.calledOnce(dispatchChangeZone)
        })

        it('onChangeZoneStatus instance, event with values ', () => {
            defaultProps.dispatchClientsPendingUpdateFindServer.resolves({
                payload : {
                    data : {
                        data : ""
                    }
                }
            })
            const val = {
                target : {
                    value : "test"
                }
            }
            const wrapper = shallow(<ClientsPendingUpdate {...defaultProps}/>)
            wrapper.instance().onChangeZoneStatus(val);
            sinon.assert.calledOnce(dispatchChangeZone)
        })

    })
    
})
