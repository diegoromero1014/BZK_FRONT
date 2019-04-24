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

const previsit = {
    objetive: "<p>ag</p>",
    statusDocument: "Guardado como definitivo",
    typePrevisit: "Seguimiento"
}


describe('Test CreateVisit/AsociatePreVisit', () => {

    let store;
    beforeEach(() => {
        const previsitReducer = Immutable.Map({ previsit });
        store = mockStore({ previsitReducer });
    })

    it('should associateVisit list', () => {
        itRenders(<ButtonAssociateComponent store={store} />);
    })

    it('should render modal', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />).dive();
        expect(wrapper.find(Modal)).to.have.length(1);
    })

    it('should render ToolTipComponent', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />).dive();
        expect(wrapper.find(PaginationAssociateVisit)).to.have.length(1);
    })
})