import React from 'react';
import { SectionImportantDates } from '../../../../../../src/components/managementView/widgets/importantDates';
import SectionImportantDatesRedux from '../../../../../../src/components/managementView/widgets/importantDates';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchGetImportantDates;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;
describe('SectionImportantDates Test', () => {

    beforeEach(() => {
        dispatchGetImportantDates = sinon.fake();
        defaultProps = {
            dispatchGetImportantDates,
        }
        store = mockStore({ importantDates: { allRecords: null }});
    })

    it('Should render component', () => {
        itRenders(<SectionImportantDates {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<SectionImportantDatesRedux {...defaultProps} store={store} />)
    })

    it('When handleImportantDates is instanced', () => {
        const wrapper = shallow(<SectionImportantDates {...defaultProps} />);
        wrapper.instance().handleImportantDates();
        sinon.assert.calledTwice(dispatchGetImportantDates);
    })
})