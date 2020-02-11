import React from 'react';
import Immutable from 'immutable';
import { ModalEditRelationship as OnlyComponent} from '../../../../../src/components/filterContact/detailsClientsContact/modalEditRelationship';
import ModalEditRelationship from '../../../../../src/components/filterContact/detailsClientsContact/modalEditRelationship';

let defaultProps;
let dispatchCleanList;
let dispatchCreateList;
let handleSubmit;
let dispatchAddToList;
let dispatchChangeStateSaveData;
let functionClose;

describe('ModalEditRelationship Test only component', () => {

    beforeEach(() => {
        dispatchCleanList = sinon.fake();
        dispatchCreateList = sinon.fake();
        dispatchAddToList = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        functionClose = sinon.fake();
        handleSubmit = sinon.fake();
        defaultProps = {
            filterContactsReducer: Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: []}}),
            selectsReducer: Immutable.Map({ typeOfContact: {} }),
            elementsReducer: Immutable.Map({ 
                objectives: { 
                    elements: [{ text: 'any text' }] 
                } 
            }),
            dispatchCleanList,
            dispatchCreateList,
            dispatchAddToList,
            dispatchChangeStateSaveData,
            handleSubmit,
            functionClose,
            fields: { 
                contactTypeOfContact: { value: 'any value' },
                contactFunctions: [{ value: 'any value' }],
                contactLineOfBusiness: [{ value: 'any value' }],
            }
        };
    })

    it('Should render ModalEditRelationship', () => {
        itRenders(<OnlyComponent {...defaultProps} />);
    })

    it('When interlocutorObjsDTOS is empty', () => {
        defaultProps.filterContactsReducer = Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: [{ text: 'any text'}] }});
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        // pendiente el expect
    })

    it('When handleSubmitRelationship is instanced', () => {
        defaultProps.filterContactsReducer = Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: [{ text: 'any text'}] }});
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        // pendiente el expect
    })

    it('When closeAlertInformation  is instanced', () => {
        defaultProps.filterContactsReducer = Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: [{ text: 'any text'}] }});
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().closeAlertInformation ();
        // pendiente el expect
    })
})

describe('ModalEditRelationship Test with redux form', () => {

    it('Should render ModalEditRelationship', () => {
        itRenders(<ModalEditRelationship />);
    })
})