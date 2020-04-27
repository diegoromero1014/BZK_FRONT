import React from 'react';
import { OperativeSection } from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/operativeSection';
import OperativeSectionRedux from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/operativeSection';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchGetImportantDates;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;
describe('OperativeSection Test', () => {

    beforeEach(() => {
        dispatchGetImportantDates = sinon.fake();
        defaultProps = {
            dispatchGetImportantDates,
        }
        store = mockStore({ 
            importantDates: { 
                operatives: { 
                    rowCount: null,
                    rows: []
                }
            }
        });
    })

    it('Should render component', () => {
        itRenders(<OperativeSection {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<OperativeSectionRedux {...defaultProps} store={store} />)
    })

    it('When handleOnPageChange is instanced', () => {
        const wrapper = shallow(<OperativeSection {...defaultProps} />);
        wrapper.instance().handleOnPageChange();
        sinon.assert.called(dispatchGetImportantDates);
    })
})