import React from 'react';
import {StrategicSection } from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/strategicSection';
import StrategicSectionRedux from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/strategicSection';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchGetImportantDates;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;
describe('StrategicSection Test', () => {

    beforeEach(() => {
        dispatchGetImportantDates = sinon.fake();
        defaultProps = {
            dispatchGetImportantDates,
        }
        store = mockStore({ 
            importantDates: { 
                strategics: { 
                    rowCount: null,
                    rows: []
                }
            }
        });
    })

    it('Should render component', () => {
        itRenders(<StrategicSection {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<StrategicSectionRedux {...defaultProps} store={store} />)
    })

    it('When handleOnPageChange is instanced', () => {
        const wrapper = shallow(<StrategicSection {...defaultProps} />);
        wrapper.instance().handleOnPageChange();
        sinon.assert.called(dispatchGetImportantDates);
    })
})