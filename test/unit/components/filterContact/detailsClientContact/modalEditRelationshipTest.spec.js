import React from 'react';
import Immutable from 'immutable';
import { ModalEditRelationship as OnlyComponent} from '../../../../../src/components/filterContact/detailsClientsContact/modalEditRelationship';
import ModalEditRelationship from '../../../../../src/components/filterContact/detailsClientsContact/modalEditRelationship';
import * as globalActions from '../../../../../src/components/globalComponents/actions';

let redirectUrl;
let defaultProps;
let dispatchCleanList;
let dispatchCreateList;
let handleSubmit;       
let dispatchAddToList;
let dispatchChangeStateSaveData;
let functionClose;
let dispatchSwtShowMessage;
let dispatchUpdateRelationshipClientContact;
let dispatchGetContactDetails;

describe('ModalEditRelationship Test only component', () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl"); 
        dispatchCleanList = sinon.fake();
        dispatchCreateList = sinon.fake();
        dispatchAddToList = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        dispatchSwtShowMessage = sinon.fake();
        dispatchGetContactDetails = sinon.stub();
        dispatchGetContactDetails.resolves({
            payload: {}
        });
        functionClose = sinon.fake();
        handleSubmit = sinon.fake();
        dispatchUpdateRelationshipClientContact = sinon.stub();
        dispatchUpdateRelationshipClientContact.resolves({
            payload: {}
        })
        defaultProps = {
            filterContactsReducer: Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: []}}),
            selectsReducer: Immutable.Map({ typeOfContact: {} }),
            elementsReducer: { 
                objectives: { 
                    elements: [{ text: 'any text' }],
                    open: false
                } 
            },
            dispatchCleanList,
            dispatchCreateList,
            dispatchAddToList,
            dispatchChangeStateSaveData,
            dispatchSwtShowMessage,
            dispatchUpdateRelationshipClientContact,
            dispatchGetContactDetails,
            handleSubmit,
            functionClose,
            fields: { 
                contactTypeOfContact: { value: 'any value' },
                contactFunctions: [{ value: 'any value' }],
                contactLineOfBusiness: [{ value: 'any value' }],
            }
        };
    })

    afterEach(() => {
        redirectUrl.restore();               
    })

    it('Should render ModalEditRelationship', () => {
        itRenders(<OnlyComponent {...defaultProps} />);
    })

    it('When interlocutorObjsDTOS is empty', () => {
        defaultProps.filterContactsReducer = Immutable.Map({ entityClientContact: { interlocutorObjsDTOS: [{ text: 'any text'}] }});
        shallow(<OnlyComponent {...defaultProps}/>);
        sinon.assert.calledOnce(dispatchCleanList);
    })

    it('When handleSubmitRelationship is instanced', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.notCalled(dispatchSwtShowMessage);
    })

    it('When handleSubmitRelationship is instanced when contactTypeOfContact is not null and contactFunctions is not empty and contactLineOfBusiness is not empty', () => {
        defaultProps.contactTypeOfContact = 1;
        defaultProps.contactFunctions = [ 1, 2 ];
        defaultProps.contactLineOfBusiness = [ 1, 2 ];
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.notCalled(dispatchSwtShowMessage);
    })

    it('When handleSubmitRelationship is instanced when contactTypeOfContact is not null and contactFunctions is not empty and contactLineOfBusiness is not empty', () => {
        defaultProps.elementsReducer.objectives.open = true;
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.called(dispatchSwtShowMessage);
    })

    it('When saveData is instanced when payload.data.validateLogin is true', () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { validateLogin: true }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
    })

    it('When saveData is instanced payload.data.validateLogin is false', () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { validateLogin: false }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
    })

    it('When saveData is instanced payload.data.status is 200', async () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { status: 200, validateLogin: true }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        await wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
        sinon.assert.calledOnce(dispatchGetContactDetails);
    })

    it('When closeAlertInformation is instanced', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().closeAlertInformation();
        expect(wrapper.state().showErrorForm).to.equal(false);
        sinon.assert.calledOnce(functionClose);
    })

    it('When closeAlertInformation is instanced and typeView is false', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.setState({ typeView: false })
        wrapper.instance().closeAlertInformation();
        sinon.assert.notCalled(functionClose);
    })

    it('When on click btnClose', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.find("button[name='btnClose']").simulate('click');
        sinon.assert.called(functionClose);
    })
})

describe('ModalEditRelationship Test with redux form', () => {

    it('Should render ModalEditRelationship', () => {
        itRenders(<ModalEditRelationship />);
    })
})