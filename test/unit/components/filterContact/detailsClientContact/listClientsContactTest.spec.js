import React from 'react';
import Immutable from 'immutable';
import { ListClientsContact } from '../../../../../src/components/filterContact/detailsClientsContact/listClientsContact';
import { shallow } from 'enzyme';

let defaultProps;
let dispatchSetEditRelationship;
let dispatchSetArrayDeleteClientContact;
let dispatchChangeValueOpenModal;
let dispatchGetContactDetails;
let dispatchDeleteRelationshipServer;
let dispatchModifyClientRelationship;
let dispatchChangeStateSaveData;

describe('ListClientsContact Test', () => {

    beforeEach(() => {
        dispatchChangeValueOpenModal = sinon.fake();
        dispatchSetEditRelationship = sinon.fake();
        dispatchSetArrayDeleteClientContact = sinon.fake();
        dispatchChangeStateSaveData = sinon.fake();
        dispatchGetContactDetails = sinon.stub();
        dispatchGetContactDetails.resolves({
            payload: { }
        });
        dispatchDeleteRelationshipServer = sinon.stub();
        dispatchDeleteRelationshipServer.resolves({
            payload: { }
        });
        dispatchModifyClientRelationship = sinon.fake();
        defaultProps = {
            contactDetail: Immutable.Map({ listDeleteClientContact: [], listClientcontacts: [] }),
            filterContactsReducer: Immutable.Map({ clientsCreaterRelationship: [] }),
            dispatchChangeValueOpenModal,
            dispatchSetEditRelationship,
            dispatchSetArrayDeleteClientContact,
            dispatchChangeStateSaveData,
            dispatchGetContactDetails,
            dispatchDeleteRelationshipServer,
            dispatchModifyClientRelationship
        }
    });

    it('Should render ListClientsContact', () => {
        itRenders(<ListClientsContact {...defaultProps}/>)
    })

    it('When openModalCreateRelationship is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().openModalCreateRelationship();
        sinon.assert.calledOnce(dispatchChangeValueOpenModal);
    })

    it('When viewRelationshipClientContact is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().viewRelationshipClientContact ();
        sinon.assert.calledOnce(dispatchChangeValueOpenModal);
        sinon.assert.calledOnce(dispatchSetEditRelationship);
    })

    it('When mapValuesClientsContact is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().mapValuesClientsContact({ listLineOfBusiness: []});
    })

    it('When selectCheckbox is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: [1]});
        wrapper.instance().selectCheckbox(1);
        sinon.assert.calledOnce(dispatchSetArrayDeleteClientContact);
    })

    it('When selectCheckbox is instanced and idClientContact is null', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: [1]});
        wrapper.instance().selectCheckbox();
        sinon.assert.calledOnce(dispatchSetArrayDeleteClientContact);
    })

    it('When closeDeleteRelationship is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().closeDeleteRelationship();
        sinon.assert.called(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchGetContactDetails);
    })

    it('When deleteRelastionship is instanced', async () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        await wrapper.instance().deleteRelastionship();
        sinon.assert.calledTwice(dispatchChangeStateSaveData);
        sinon.assert.notCalled(dispatchGetContactDetails);
    })

    it('When deleteRelastionship is instanced and payload.status is 200', async () => {
        defaultProps.dispatchDeleteRelationshipServer.resolves({ payload: { status: 200 } });
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        await wrapper.instance().deleteRelastionship();
        sinon.assert.calledTwice(dispatchChangeStateSaveData);
        sinon.assert.calledOnce(dispatchGetContactDetails);
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
        sinon.assert.called(dispatchModifyClientRelationship);
        sinon.assert.calledOnce(dispatchChangeValueOpenModal);
    })

    it('When selectedAllItems is instanced', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.instance().selectedAllItems();
        sinon.assert.calledOnce(dispatchSetArrayDeleteClientContact);
    })

    it('When selectedAllItems is instanced and listRelationshipClients is different to contactDetail.listClientcontacts', () => {
        const wrapper = shallow(<ListClientsContact {...defaultProps}/>);
        wrapper.setState({ listRelationshipClients: 3})
        wrapper.instance().selectedAllItems();
        sinon.assert.calledOnce(dispatchSetArrayDeleteClientContact);
    })
})