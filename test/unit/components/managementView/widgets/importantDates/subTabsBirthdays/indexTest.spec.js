import React from 'react';
import { SubTabsBirthdays } from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays';
import SubTabsBirthdaysRedux from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchGetImportantDates;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;
describe('SubTabsBirthdays Test', () => {

    beforeEach(() => {
        dispatchGetImportantDates = sinon.fake();
        defaultProps = {
            dispatchGetImportantDates,
        }
        store = mockStore({ 
            importantDates: { 
                strategics: { rowCount: null },
                tactics: { rowCount: null },
                operatives: { rowCount: null }
            }
        });
    })

    it('Should render component', () => {
        itRenders(<SubTabsBirthdays {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<SubTabsBirthdaysRedux {...defaultProps} store={store} />)
    })

    it('When handleStrategicContacts is instanced', () => {
        const wrapper = shallow(<SubTabsBirthdays {...defaultProps} />);
        wrapper.instance().handleStrategicContacts();
        sinon.assert.called(dispatchGetImportantDates);
    })

    it('When handleTacticContacts is instanced', () => {
        const wrapper = shallow(<SubTabsBirthdays {...defaultProps} />);
        wrapper.instance().handleTacticContacts();
        sinon.assert.called(dispatchGetImportantDates);
    })

    it('When handleOperativeContacts is instanced', () => {
        const wrapper = shallow(<SubTabsBirthdays {...defaultProps} />);
        wrapper.instance().handleOperativeContacts();
        sinon.assert.called(dispatchGetImportantDates);
    })
})