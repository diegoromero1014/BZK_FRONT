import React from 'react';
import Immutable from 'immutable';
import ButtonAssociateComponent from '../../../../../src/components/visit/createVisit/associateVisit';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import Modal from 'react-modal';
import ToolTipComponent from '../../../../../src/components/toolTip/toolTipComponent';
import PaginationAssociateVisit from '../../../../../src/components/visit/createVisit/paginationAssociateVisit';

const middleWares = [thunk];
const mockStore = configureStore(middleWares);

const initialState = Immutable.Map({
    status: "processed",
    visitList: [],
    rowCount: 0,
    limInf: 0,
    idPrevisit: 0,
    page: 1,
    columnVisit: 'vd.visitTime',
    orderVisit: 1,
    detailVisit: {},
    ownerDraft: 0,
    pageAssociateVisit: 1
  });


describe('Test CreateVisit/AsociatePreVisit', () => {

    let store;
    let stubVisitByClientFindServer;
    beforeEach(() => {
        const previsitReducer = Immutable.Map({ rowCount: 10 });
        store = mockStore({ previsitReducer });
        const success = { payload: { data: { parameter: JSON.stringify({ value: rowCount }) } } };
        stubVisitByClientFindServer = sinon.stub(actions, 'stubVisitByClientFindServer').returns(()=>{
            return new Promise(
                (resolve, reject) => resolve(success)
            )
        });
    });

    afterEach(function () {
        // runs after each test in this block
        stubVisitByClientFindServer.restore();
    });

    it('should associateVisit list', () => {
        itRenders(<ButtonAssociateComponent store={store} />);
    })

    it('should render modal', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />).dive();
        expect(wrapper.find(Modal)).to.have.length(1);
    })

    it('should render PaginationAssociateVisit', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />);
        expect(wrapper.find(PaginationAssociateVisit)).to.have.length(1);
    })
})