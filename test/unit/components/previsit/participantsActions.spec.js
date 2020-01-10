import React from 'react';
import { participantIsClient, participantIsBank, participantIsOther, changeParticipantBankDataStructure,changeParticipantOtherDataStructure, changeParticipantClientDataStructure, fillParticipants } from '../../../../src/components/previsita/participantsActions';         
import { KEY_PARTICIPANT_CLIENT, KEY_PARTICIPANT_BANCO, KEY_PARTICIPANT_OTHER } from './../../../../src/components/participantsVisitPre/constants';

describe('Test previsita/participantsActions', () => {

    it('It should return True when Participant.tipoParticipante is equal to "client".', () => {
        const participant = { tipoParticipante: KEY_PARTICIPANT_CLIENT };
        expect(participantIsClient(participant)).to.equal(true);
    });

    it('It should return False when Participant.tipoParticipante is different to "client".', () => {
        const participant = { tipoParticipante: null };
        expect(participantIsClient(participant)).to.equal(false);
    });

    it('It should return True when Participant.tipoParticipante is equal to "banco".', () => {
        const participant = { tipoParticipante: KEY_PARTICIPANT_BANCO };
        expect(participantIsBank(participant)).to.equal(true);
    });

    it('It should return False when Participant.tipoParticipante is equal to "banco".', () => {
        const participant = { tipoParticipante: null };
        expect(participantIsBank(participant)).to.equal(false);
    });

    it('It should return True when Participant.tipoParticipante is equal to "other".', () => {
        const participant = { tipoParticipante: KEY_PARTICIPANT_OTHER };
        expect(participantIsOther(participant)).to.equal(true);
    });

    it('It should return False when Participant.tipoParticipante is equal to "other".', () => {
        const participant = { tipoParticipante: null };
        expect(participantIsOther(participant)).to.equal(false);
    });

    it('It should return a new structure in the object when is Client but with the same values of the Participant.', () => {
        const participant = { idParticipante: "Any ID", order: "Any Order" };
        const response = changeParticipantClientDataStructure(participant);
        expect(response.id).to.equal(null);
        expect(response.contact).to.equal(participant.idParticipante);
        expect(response.order).to.equal(participant.order);
    });

    it('It should return a new structure in the object when is Other but with the same values of the Participant.', () => {
        const participant = { nombreParticipante: "Any", cargo: "Any", empresa: "Any", order: "Any" };
        const response = changeParticipantOtherDataStructure(participant);
        expect(response.id).to.equal(null);
        expect(response.name).to.equal(participant.nombreParticipante);
        expect(response.position).to.equal(participant.cargo);
        expect(response.company).to.equal(participant.empresa);
        expect(response.order).to.equal(participant.order);
    });

    it('It should return a new structure in the object when is Bank but with the same values of the Participant.', () => {
        const participant = { idParticipante: "Any ID", order: "Any Order" };
        const response = changeParticipantBankDataStructure(participant);
        expect(response.id).to.equal(null);
        expect(response.employee).to.equal(participant.idParticipante);
        expect(response.order).to.equal(participant.order);
    });

    it('It should return -- when Participant.tipoParticipante is "client", "banco" or "client".', () => {
        const participants = [
            { 
                tipoParticipante: KEY_PARTICIPANT_CLIENT,
                contact: "Any", 
                contactName: "Any",
                contactPositionName: "Any",
                cargo: "Any",
                order: "Any" 
            },
            { 
                tipoParticipante: KEY_PARTICIPANT_BANCO,
                contact: "Any", 
                contactName: "Any",
                contactPositionName: "Any",
                cargo: "Any",
                order: "Any" 
            },
            { 
                tipoParticipante: KEY_PARTICIPANT_OTHER,
                contact: "Any", 
                contactName: "Any",
                contactPositionName: "Any",
                cargo: "Any",
                order: "Any" 
            },
        ];


        const response = fillParticipants(participants);
        expect(response).to.have.length(3);
    });
});