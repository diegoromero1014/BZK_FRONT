import React from 'react';
import {shallow} from 'enzyme';
import Immutable from "immutable";

import {MyTaskPage} from "../../../../../src/components/myTasks/myTaskPage";
import * as actions from "../../../../../src/components/myTasks/actions";
import {ASSIGNED, FINISHED, PENDING} from "../../../../../src/components/myTasks/constants";
import * as globalActions from "../../../../../src/components/globalComponents/actions";
import * as myTasksActions from "../../../../../src/components/myTasks/actions";

const myTasks = Immutable.Map({
    tabPending: {order: 0, rowCount: 0, data: {}, page: 0},
    tabFinished: {order: 0, rowCount: 0, data: {}, page: 0},
    initialFilter: {rol: ""},
    textToSearch: "",
    recentSearches: {
        data: []
    }
});
let selectsReducer = Immutable.Map({
   region: [
       {
           id: 1,
           value: 'Antioquia'
       }
   ],
   zone: [
       {
           id: 2,
           value: 'Zona 2'
       }
   ],
   teamValueObjects: [
       {
           id: 12,
           description: '012'
       }
   ]
});
let dispatchFinalizedTasks = spy(sinon.fake());
let dispatchPendingTasks = spy(sinon.fake());
let dispatchGetMasterDataFields = spy(sinon.stub());
let dispatchUpdateTitleNavBar = spy(sinon.stub());
let dispatchSetRolToSearch = spy(sinon.fake());
let dispatchRequestSaveRecentSearch = sinon.stub(myTasksActions, 'requestSaveRecentSearch');
let dispatchDeleteRecentSearch = sinon.stub(myTasksActions, 'deleteRecentSearch');
let dispatchRemoveRecentSearch = spy(sinon.fake());
let dispatchAddRecentSearch = sinon.fake();
let dispatchUseRecentSearch = sinon.fake();
let dispatchGetMyRecentSearch = sinon.stub();
let dispatchCleanPendingTasks = sinon.fake();
let dispatchCleanFinalizedTasks = sinon.fake();
let getPendingTaskPromise;
let getFinalizedTaskPromise;
let redirectUrl;
let defaultProps;
const dispatchValidatePermissionsByModule = sinon
    .stub()
    .resolves({
        payload: {
            data: {
                validateLogin: true
            }
        }
    });

describe("Test MyTasks component", () => {
    beforeEach(() => {
        getPendingTaskPromise = sinon
            .stub(actions, "getPendingTaskPromise")
            .resolves({data: {status: 200, data: {}}});
        getFinalizedTaskPromise = sinon
            .stub(actions, "getFinalizedTaskPromise")
            .resolves({data: {status: 200, data: {}}});

        dispatchRequestSaveRecentSearch.resolves({data: {status: 200, data: 12}});
        dispatchDeleteRecentSearch.resolves({data: {status: 200, data: {status: 200}}});
        dispatchGetMyRecentSearch.resolves({data: {data: { status: 200, data: []}}});
        redirectUrl = sinon.stub(globalActions, "redirectUrl");
        defaultProps = {
            params: {},
            dispatchGetMasterDataFields,
            dispatchUpdateTitleNavBar,
            myTasks,
            dispatchFinalizedTasks,
            dispatchPendingTasks,
            dispatchValidatePermissionsByModule,
            dispatchSetRolToSearch,
            dispatchRequestSaveRecentSearch,
            selectsReducer,
            dispatchAddRecentSearch,
            dispatchDeleteRecentSearch,
            dispatchRemoveRecentSearch,
            dispatchUseRecentSearch,
            dispatchGetMyRecentSearch,
            dispatchCleanPendingTasks,
            dispatchCleanFinalizedTasks,
            allRecentSearch: {
                data: []
            }
        };
    });

    afterEach(() => {
        getPendingTaskPromise.restore();
        getFinalizedTaskPromise.restore();
        redirectUrl.restore();
    });

    it("Should render MyTasks component", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps} />);
        expect(wrapper).to.have.length(1);
    });

    it("test fetchAndDispatchPendingTasks", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let filters = {users: [120], rol: {ASSIGNED}};
        await wrapper.instance().fetchAndDispatchPendingTasks(0, 0, null, filters);
        expect(dispatchPendingTasks).to.have.been.called.exactly(1);
        sinon.assert.called(getPendingTaskPromise);
    });

    it("test fetchAndDispatchFinalizedTasks", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let filters = {users: [120], rol: {ASSIGNED}};
        await wrapper.instance().fetchAndDispatchFinalizedTasks(0, 0, null, filters);
        expect(dispatchFinalizedTasks).to.have.been.called.exactly(1);
        sinon.assert.called(getFinalizedTaskPromise);
    });

    it("test updateBothTabs", async () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps} />);
        await wrapper.instance().updateBothTabs();

        sinon.assert.called(getPendingTaskPromise);
        sinon.assert.called(getFinalizedTaskPromise);
    });

    it("test handleFetchAndDispatchPendingTasks when mode is PENDING", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().handleFetchAndDispatchPendingTasks(0, PENDING);

        sinon.assert.called(getPendingTaskPromise);
    });

    it("test handleFetchAndDispatchPendingTasks when mode is FINISHED", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps} />);
        wrapper.instance().handleFetchAndDispatchPendingTasks(0, FINISHED);

        sinon.assert.called(getFinalizedTaskPromise);
    });

    it("test handlePaginar when mode is PENDING", () => {
        let dispatchSetPagePending = spy(sinon.stub());
        let dispatchSetPageFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchSetPagePending,
            dispatchSetPageFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps}/>);
        wrapper.instance().handlePaginar(0, PENDING);
        expect(dispatchSetPagePending).to.have.been.called.exactly(1);
    });

    it("test handlePaginar when mode is FINISHED", () => {
        let dispatchSetPagePending = spy(sinon.stub());
        let dispatchSetPageFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchSetPagePending,
            dispatchSetPageFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().handlePaginar(0, FINISHED);
        expect(dispatchSetPageFinalized).to.have.been.called.exactly(1);
    });

    it("test orderColumn when mode is PENDING", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let handleFetchAndDispatchPendingTasks = spy(sinon.stub());
        let otherProps = {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized
        }
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().handleFetchAndDispatchPendingTasks = handleFetchAndDispatchPendingTasks;
        wrapper.instance().orderColumn(0, PENDING);
        expect(dispatchCleanPageAndSetOrderPending).to.have.been.called.exactly(1);
    });

    it("test orderColumn when mode is FINISHED", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().orderColumn(0, FINISHED);
        expect(dispatchCleanPageAndSetOrderFinalized).to.have.been.called.exactly(1);
    });

    it("test clearUserTask when mode is PENDING", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().clearUserTask(PENDING);
        expect(dispatchCleanPageAndSetOrderPending).to.have.been.called.exactly(
            1
        );
    });

    it("test clearUserTask when mode is FINISHED", () => {
        let dispatchCleanPageAndSetOrderPending = spy(sinon.stub());
        let dispatchCleanPageAndSetOrderFinalized = spy(sinon.stub());
        let otherProps = {
            dispatchCleanPageAndSetOrderPending,
            dispatchCleanPageAndSetOrderFinalized
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps} {...otherProps} />);
        wrapper.instance().clearUserTask(FINISHED);
        expect(dispatchCleanPageAndSetOrderFinalized).to.have.been.called.exactly(
            1
        );
    });

    it("test _onChangeSearch when has value ", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let dispatchPendingTasks = spy(sinon.stub());
        let dispatchFinalizedTask = spy(sinon.stub());
        wrapper.instance().fetchAndDispatchPendingTasks = dispatchPendingTasks;
        wrapper.instance()._onSearchText('Test To Search');
        expect(dispatchPendingTasks).to.have.been.called.exactly(1);
        wrapper.instance().fetchAndDispatchFinalizedTasks = dispatchFinalizedTask;
        wrapper.instance()._onSearchText('Test To Search');
        expect(dispatchFinalizedTask).to.have.been.called.exactly(1);
    });

    it("test _onChangeSearch when has not value ", () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        let dispatchPendingTasks = spy(sinon.stub());
        let dispatchFinalizedTask = spy(sinon.stub());
        wrapper.instance().fetchAndDispatchPendingTasks = dispatchPendingTasks;
        wrapper.instance()._onSearchText('');
        expect(dispatchPendingTasks).to.have.been.called.exactly(1);
        wrapper.instance().fetchAndDispatchFinalizedTasks = dispatchFinalizedTask;
        wrapper.instance()._onSearchText('');
        expect(dispatchFinalizedTask).to.have.been.called.exactly(1);
    });

    it('dispatchFilters should call dispatchSetRolToSearch', () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().dispatchFilters({
            region: 'Antioquia',
            zone: 'Zona 2',
            cell: '201',
        });
        expect(dispatchSetRolToSearch).to.have.been.called.exactly(1);
    });

    it('permissionsToEditTask should return true', () => {
        defaultProps.reducerGlobal = Immutable.Map({
            permissionsTasks: [
                "Visualizar",
                "Crear",
                "Editar"
            ]
        });
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        const response = wrapper.instance().permissionToEditTask();
        expect(response).to.equal(true);
    });

    it('createRecentSearch should call dispatchRequestSaveRecentSearch', () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.setState({
           filters: {
               closingDateFrom: new Date(),
               closingDateTo: new Date(),
               region: 1,
               zone: 2,
               cell: 12,
           }
        });
        wrapper.instance().createRecentSearch();
        expect(dispatchRequestSaveRecentSearch.calledOnce).to.equal(true);
    });

    it('removeLastRecentSearch should call removeRecentSearch', () => {
        defaultProps.allRecentSearch = {
            data: [
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                },
                {
                    id: 4
                }
            ]
        };
        const removeRecentSearchFunction = spy(sinon.fake());
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().removeRecentSearch = removeRecentSearchFunction;
        wrapper.update();
        wrapper.instance().removeLastRecentSearch();
        expect(removeRecentSearchFunction).to.have.been.called.exactly(1);
    });

    it('removeRecentSearch should call dispatchDeleteRecentSearch', () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().removeRecentSearch(1);
        expect(dispatchDeleteRecentSearch.calledOnce).to.equal(true);
    });

    it('applyRecentSearch should call dispatchUseRecentSearch', () => {
        defaultProps.allRecentSearch = {
            data: [
                {
                    id: 1,
                    filter: {
                        closeDateTo: new Date(),
                        closeDateFrom: new Date(),
                        regionId: 1,
                        zoneId: 2,
                        teamId: 3
                    }
                },
                {
                    id: 2,
                    filter: {
                        closeDateTo: new Date(),
                        closeDateFrom: new Date(),
                        regionId: 1,
                        zoneId: 2,
                        teamId: 3
                    }
                }
            ]
        };
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().applyRecentSearch(1);
        expect(dispatchUseRecentSearch.calledOnce).to.equal(true);
    });

    it('should call dispatchCleanPendingTasks and dispatchCleanFinalizedTasks on componentWillUnmount', () => {
        let wrapper = shallow(<MyTaskPage {...defaultProps}/>);
        wrapper.instance().componentWillUnmount();
        expect(dispatchCleanPendingTasks.calledOnce).to.equal(true);
        expect(dispatchCleanFinalizedTasks.calledOnce).to.equal(true);
    });
});