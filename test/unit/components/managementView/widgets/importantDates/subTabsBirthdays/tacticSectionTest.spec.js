import React from 'react';
import { TacticSection } from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/tacticSection';
import TacticSectionRedux from '../../../../../../../src/components/managementView/widgets/importantDates/subTabsBirthdays/tacticSection';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

let defaultProps;
let dispatchGetImportantDates;

let store ;
const middlewares = [thunk] ;
const mockStore = configureStore(middlewares) ;
describe('TacticSection Test', () => {

    beforeEach(() => {
        dispatchGetImportantDates = sinon.fake();
        defaultProps = {
            dispatchGetImportantDates,
        }
        store = mockStore({ 
            importantDates: { 
                tactics: { 
                    rowCount: null,
                    rows: []
                }
            }
        });
    })

    it('Should render component', () => {
        itRenders(<TacticSection {...defaultProps} />)
    })
    
    it('Should render component with Redux', () => {
        itRenders(<TacticSectionRedux {...defaultProps} store={store} />)
    })

    it('When handleOnPageChange is instanced', () => {
        const wrapper = shallow(<TacticSection {...defaultProps} />);
        wrapper.instance().handleOnPageChange();
        sinon.assert.called(dispatchGetImportantDates);
    })
})