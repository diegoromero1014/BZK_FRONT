import React from 'react';
import Immutable from 'immutable';
import { ListClientsContact } from '../../../../../src/components/filterContact/detailsClientsContact/listClientsContact';
import { shallow } from 'enzyme';

let defaultProps;
let changeValueOpenModal;
let setEditRelationship;
let setArrayDeleteClientContact;
let changeStateSaveData;
let getContactDetails;
let deleteRelationshipServer;
let modifyClientRelationship;

describe('ListClientsContact Test', () => {

    beforeEach(() => {
        changeValueOpenModal = sinon.fake();
        setEditRelationship = sinon.fake();
        setArrayDeleteClientContact = sinon.fake();
        changeStateSaveData = sinon.fake();
        getContactDetails = sinon.stub();
        getContactDetails.resolves({
            payload: { }
        });
        deleteRelationshipServer = sinon.stub();
        deleteRelationshipServer.resolves({
            payload: { }
        });
        modifyClientRelationship = sinon.fake();
        defaultProps = {
            contactDetail: Immutable.Map({ listDeleteClientContact: [], listClientcontacts: [] }),
            filterContactsReducer: Immutable.Map({ clientsCreaterRelationship: [] }),
            changeValueOpenModal,
            setEditRelationship,
            setArrayDeleteClientContact,
            changeStateSaveData,
            getContactDetails,
            deleteRelationshipServer,
            modifyClientRelationship
        }
    });

    it('Should render ListClientsContact', () => {
        itRenders(<ListClientsContact {...defaultProps}/>)
    })

    it('When openModalCreateRelationship is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().openModalCreateRelationship();
        sinon.assert.calledOnce(changeValueOpenModal);
    })

    it('When viewRelationshipClientContact is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().viewRelationshipClientContact ();
        sinon.assert.calledOnce(changeValueOpenModal);
        sinon.assert.calledOnce(setEditRelationship);
    })

    it('When mapValuesClientsContact is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().mapValuesClientsContact({ listLineOfBusiness: []});
    })

    it('When selectCheckbox is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: [1]});
        wrapper.instance().selectCheckbox(1);
        sinon.assert.calledOnce(setArrayDeleteClientContact);
    })

    it('When selectCheckbox is instanced and idClientContact is null', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: [1]});
        wrapper.instance().selectCheckbox();
        sinon.assert.calledOnce(setArrayDeleteClientContact);
    })

    it('When closeDeleteRelationship is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().closeDeleteRelationship();
        sinon.assert.called(changeStateSaveData);
        sinon.assert.calledOnce(getContactDetails);
    })

    it('When deleteRelastionship is instanced', async () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        await wrapper.instance().deleteRelastionship();
        sinon.assert.calledTwice(changeStateSaveData);
        sinon.assert.notCalled(getContactDetails);
    })

    it('When deleteRelastionship is instanced and payload.status is 200', async () => {
        defaultProps.deleteRelationshipServer.resolves({ payload: { status: 200 } });
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        await wrapper.instance().deleteRelastionship();
        sinon.assert.calledTwice(changeStateSaveData);
        sinon.assert.calledOnce(getContactDetails);
    })

    it('When validateDelete is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().validateDelete ();
        expect(wrapper.state().errorDeleteRelationship).to.equal(true);
    })

    it('When validateDelete is instanced', () => {
        defaultProps.contactDetail = Immutable.Map({ listDeleteClientContact: [1], listClientcontacts: [1] });
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().validateDelete ();
        expect(wrapper.state().showConfirmDelete).to.equal(true);
    })

    it('When closeModal is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().closeModal();
        sinon.assert.called(modifyClientRelationship);
        sinon.assert.calledOnce(changeValueOpenModal);
    })

    it('When selectedAllItems is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().selectedAllItems();
        sinon.assert.calledOnce(setArrayDeleteClientContact);
    })

    it('When selectedAllItems is instanced and listRelationshipClients is different to contactDetail.listClientcontacts', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: 3})
        wrapper.instance().selectedAllItems();
        sinon.assert.calledOnce(setArrayDeleteClientContact);
    })
})