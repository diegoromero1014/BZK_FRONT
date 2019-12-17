export function participantIsClient(participant){
    return participant.tipoParticipante === 'client';
}

export function participantIsBank(participant){
    return participant.tipoParticipante === 'banco';
}

export function participantIsOther(participant){
    return participant.tipoParticipante === 'other';
}

export function changeParticipantClientDataStructure(participant){
    return {
        "id": null,
        "contact": participant.idParticipante,
        "order": participant.order
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