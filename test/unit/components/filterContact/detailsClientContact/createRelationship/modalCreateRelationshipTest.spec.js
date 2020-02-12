import React from 'react';
import Immutable from 'immutable';
import { ModalCreateRelationship as OnlyComponent} from '../../../../../../src/components/filterContact/detailsClientsContact/cretaeRelationship/modalCreateRelationship';
import ModalCreateRelationship from '../../../../../../src/components/filterContact/detailsClientsContact/cretaeRelationship/modalCreateRelationship';
import * as globalActions from '../../../../../../src/components/globalComponents/actions';

let redirectUrl;
let defaultProps;
let dispatchCleanList;
let dispatchCreateList;
let handleSubmit;
let dispatchChangeStateSaveData;
let functionClose;
let dispatchSwtShowMessage;
let dispatchUpdateRelationshipClientContact;
let dispatchGetContactDetails;
let dispatchClientsFindServer;
let dispatchEconomicGroupsByKeyword;
let modifyClientRelationship;
let dispatchClientsByEconomicGroup;

describe('ModalCreateRelationship Test only component', () => {

    beforeEach(() => {
        redirectUrl = sinon.stub(globalActions, "redirectUrl"); 
        dispatchCleanList = sinon.fake();
        dispatchCreateList = sinon.fake();
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
        });
        dispatchClientsFindServer = sinon.stub();
        dispatchClientsFindServer.resolves({
            payload: {}
        });
        dispatchEconomicGroupsByKeyword = sinon.stub();
        dispatchEconomicGroupsByKeyword.resolves({
            payload: {}
        });
        modifyClientRelationship = sinon.fake();
        dispatchClientsByEconomicGroup = sinon.stub();
        dispatchClientsByEconomicGroup.resolves({
            payload: {}
        });
        defaultProps = {
            filterContactsReducer: Immutable.Map({ clientsCreaterRelationship: [] }),
            selectsReducer: Immutable.Map({ }),
            elementsReducer: { 
                objectives: { 
                    elements: [{ text: 'any text' }],
                    open: false
                } 
            },
            dispatchCleanList,
            dispatchCreateList,
            dispatchChangeStateSaveData,
            dispatchSwtShowMessage,
            dispatchUpdateRelationshipClientContact,
            dispatchGetContactDetails,
            handleSubmit,
            functionClose,
            dispatchClientsFindServer,
            dispatchEconomicGroupsByKeyword,
            modifyClientRelationship,
            dispatchClientsByEconomicGroup,
            fields: { 
                contactTypeOfContact: { value: 'any value' },
                contactFunctions: [{ value: 'any value' }],
                contactLineOfBusiness: [{ value: 'any value' }],
                idClient: { value: 'text' },
                nameClient: { value: 'any value'},
                groupEconomic: { value: 'any value', onChange: sinon.fake() },
                economicGroupName: { value: 'any value' }
            }
        };
    })

    afterEach(() => {
        redirectUrl.restore();               
    })

    it('Should render ModalEditRelationship', () => {
        itRenders(<OnlyComponent {...defaultProps} />);
    })

    it('When saveData is instanced when payload.data.validateLogin is true', async () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { validateLogin: true }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": null,
            "clients": [],
            "idContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        await wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
        sinon.assert.notCalled(redirectUrl);
    })

    it('When saveData is instanced when payload.data.validateLogin is false', async () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { validateLogin: false }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": null,
            "clients": [],
            "idContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        await wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
    })

    it('When saveData is instanced when payload.data.status is 200', async () => {
        defaultProps.dispatchUpdateRelationshipClientContact = dispatchUpdateRelationshipClientContact.resolves({
            payload: { data: { validateLogin: true, status: 200 }}
        });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        const json = {
            "idClientContact": null,
            "clients": [],
            "idContact": 1,
            "typeOfContact": null,
            "function": [],
            "lineOfBusiness": [],
            "interlocutorObjs": []
        };
        await wrapper.instance().saveData(json);
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchUpdateRelationshipClientContact);
        sinon.assert.notCalled(redirectUrl);
        sinon.assert.calledOnce(dispatchGetContactDetails);
    })
    
    it('When handleSubmitRelationship is instanced', () => {
        defaultProps.filterContactsReducer =  Immutable.Map({ clientsCreaterRelationship: [{ text: 'any text'}] });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.notCalled(dispatchSwtShowMessage);
    })

    it('When handleSubmitRelationship is instanced and clientsCreaterRelationship is empty', () => {
        defaultProps.filterContactsReducer =  Immutable.Map({ clientsCreaterRelationship: [] });
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.notCalled(dispatchSwtShowMessage);
    })

    it('When handleSubmitRelationship is instanced and objectives.open is true', () => {
        defaultProps.filterContactsReducer =  Immutable.Map({ clientsCreaterRelationship: [{ text: 'any text'}] });
        defaultProps.elementsReducer.objectives.open = true;
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().handleSubmitRelationship();
        sinon.assert.called(dispatchSwtShowMessage);
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

    it('When updateKeyValueClient is instanced and keyCode is null', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueClient({ keyCode: null });
        sinon.assert.notCalled(dispatchClientsFindServer);
    })
    
    it('When updateKeyValueClient is instanced and keyCode is 13', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueClient({ keyCode: 13, preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchClientsFindServer);
    })
    
    it('When updateKeyValueClient is instanced and consultclick is false', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueClient({ keyCode: 13, preventDefault: sinon.fake(), consultclick: false });
        sinon.assert.calledOnce(dispatchClientsFindServer);
    })
    
    it('When updateKeyValueClient is instanced and consultclick is true', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueClient({ keyCode: 13, preventDefault: sinon.fake(), consultclick: true });
        sinon.assert.calledOnce(dispatchClientsFindServer);
    })

    it('When updateKeyValueClient is instanced and fields.nameClient is null', () => {
        defaultProps.fields.nameClient = '';
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueClient({ keyCode: 13, preventDefault: sinon.fake(), consultclick: true });
        sinon.assert.notCalled(dispatchClientsFindServer);
    })

    it('When updateKeyValueEconomicGroup is instanced and keyCode is null', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueEconomicGroup({ keyCode: null });
        sinon.assert.notCalled(dispatchEconomicGroupsByKeyword);
    })

    it('When updateKeyValueEconomicGroup is instanced and keyCode is 13', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueEconomicGroup({ keyCode: 13, preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchEconomicGroupsByKeyword);
    })

    it('When updateKeyValueEconomicGroup is instanced and consultclick is false', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueEconomicGroup({ keyCode: 13, preventDefault: sinon.fake(), consultclick: false });
        sinon.assert.calledOnce(dispatchEconomicGroupsByKeyword);
    })
    
    it('When updateKeyValueEconomicGroup is instanced and consultclick is true', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueEconomicGroup({ keyCode: 13, preventDefault: sinon.fake(), consultclick: true });
        sinon.assert.calledOnce(dispatchEconomicGroupsByKeyword);
    })

    it('When updateKeyValueEconomicGroup is instanced and fields.economicGroupName is null', () => {
        defaultProps.fields.economicGroupName = '';
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().updateKeyValueEconomicGroup({ keyCode: 13, preventDefault: sinon.fake(), consultclick: true });
        sinon.assert.notCalled(dispatchClientsFindServer);
    })

    it('When addClientToRelationship is instanced', () => {
        defaultProps.fields.idClient.value = null;
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().addClientToRelationship({ keyCode: null });
        sinon.assert.notCalled(modifyClientRelationship);
    })

    it('When addClientToRelationship is instanced and idClient.value is not null', () => {
        defaultProps.fields.idClient.value = 'any value';
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().addClientToRelationship({ keyCode: null });
        sinon.assert.notCalled(modifyClientRelationship);
    })
    
    it('When addClientsEconomicToRelationship is instanced and groupEconomic.value is not null', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().addClientsEconomicToRelationship({ keyCode: null });
        sinon.assert.calledOnce(dispatchClientsByEconomicGroup);
    })

    it('When addClientsEconomicToRelationship is instanced and groupEconomic.value is null', () => {
        defaultProps.fields.groupEconomic.value = null;
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().addClientsEconomicToRelationship({ keyCode: null });
        sinon.assert.notCalled(dispatchClientsByEconomicGroup);
    })

    it('When addClientsEconomicToRelationship is instanced and payload.status is 100', () => {
        defaultProps.dispatchClientsByEconomicGroup = dispatchClientsByEconomicGroup.resolves({
            payload: { data: { status: 200, data: [] }}
        })
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.instance().addClientsEconomicToRelationship({ keyCode: null });
        sinon.assert.calledOnce(dispatchClientsByEconomicGroup);
    })


    it('When on click btnClose', () => {
        const wrapper = shallow(<OnlyComponent {...defaultProps}/>);
        wrapper.find("button[name='btnClose']").simulate('click');
        sinon.assert.called(functionClose);
    })
    
})

describe('ModalEditRelationship Test with redux form', () => {

    it('Should render ModalEditRelationship', () => {
        itRenders(<ModalCreateRelationship />);
    })
})