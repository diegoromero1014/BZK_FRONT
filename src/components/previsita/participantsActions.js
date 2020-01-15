import _ from 'lodash';
import { KEY_PARTICIPANT_CLIENT, KEY_PARTICIPANT_BANCO, KEY_PARTICIPANT_OTHER } from '../participantsVisitPre/constants';

export function participantIsClient(participant){
    return participant.tipoParticipante === KEY_PARTICIPANT_CLIENT;
}

export function participantIsBank(participant){
    return participant.tipoParticipante === KEY_PARTICIPANT_BANCO;
}

export function participantIsOther(participant){
    return participant.tipoParticipante === KEY_PARTICIPANT_OTHER;
}

export function changeParticipantClientDataStructure(participant){
    return {
        "id": null,
        "contact": participant.idParticipante,
        "order": participant.order,
        "interlocutorObjs": participant.interlocutorObjs
    };
}

export function changeParticipantOtherDataStructure(participant){
    return {
        "id": null,
        "name": participant.nombreParticipante.replace('-', '').trim(),
        "position": participant.cargo.replace('-', '').trim(),
        "company": participant.empresa.replace('-', '').trim(),
        "order": participant.order
    };
}

export function changeParticipantBankDataStructure(participant){
    return {
        "id": null,
        "employee": participant.idParticipante,
        "order": participant.order
    };
}

export function fillParticipants(participants){
    return participants.map(participant => {
        const uuid = _.uniqueId('participant');
        let participantData = {
            tipoParticipante: participant.tipoParticipante,
            uuid,
            order: _.isNull(participant.order) ? 0 : participant.order,
            fecha: Date.now(),
            estiloSocial: participant.socialStyleName === null || participant.socialStyleName === undefined || participant.socialStyleName === '' ? ''
                : ' - ' + participant.socialStyleName,
            actitudBanco: participant.attitudeOverGroupName === null || participant.attitudeOverGroupName === undefined || participant.attitudeOverGroupName === '' ? ''
                : ' - ' + participant.attitudeOverGroupName
        };

        switch (participant.tipoParticipante) {            
            case KEY_PARTICIPANT_CLIENT:                
                participantData.idParticipante = participant.contact;
                participantData.nombreParticipante = participant.contactName;
                participantData.cargo = participant.contactPositionName === null || participant.contactPositionName === undefined || participant.contactPositionName === '' ? ''
                    : ' - ' + participant.contactPositionName;
                participantData.empresa = '';
                participantData.interlocutorObjs = participant.interlocutorObjs;
                participantData.nameComplet = participant.contactName; 
                participantData.contactPosition = participant.contactPositionName;
                participantData.contactSocialStyle = participant.socialStyleName;
                participantData.contactActitudeCompany = participant.attitudeOverGroupName;

                return participantData;
            case KEY_PARTICIPANT_BANCO:                
                participantData.idParticipante = participant.employee;
                participantData.nombreParticipante = participant.employeeName;
                participantData.cargo = participant.positionName === null || participant.positionName === undefined || participant.positionName === '' ? ''
                    : ' - ' + participant.positionName;
                participantData.empresa = participant.lineBusinessName === null || participant.lineBusinessName === undefined || participant.lineBusinessName === '' ? ''
                    : ' - ' + participant.lineBusinessName;
                return participantData;
            case KEY_PARTICIPANT_OTHER:
                participantData.idParticipante = participant.id;
                participantData.nombreParticipante = participant.name;
                participantData.cargo = participant.position === null || participant.position === undefined || participant.position === '' ? ''
                    : ' - ' + participant.position;
                participantData.empresa = participant.company === null || participant.company === undefined || participant.company === '' ? ''
                    : ' - ' + participant.company;  
                return participantData;
            default:
                break;
        }
    });
}