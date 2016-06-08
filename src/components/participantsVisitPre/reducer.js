import Immutable from 'immutable';
import * as contants from './constants';
import _ from 'lodash';

const initialState = Immutable.List();

export default (state = initialState, action) => {
    switch (action.type) {
    case contants.ADD_PARTICIPANT:
        const participant = action.data;
        const newParticipant = _.assign({}, {
            tipoParticipante: participant.tipoParticipante,
            idParticipante: participant.idParticipante,
            nombreParticipante: participant.nombreParticipante,
            cargo: participant.cargo,
            empresa: participant.empresa,
            estiloSocial: participant.estiloSocial,
            actitudBanco: participant.actitudBanco,
            fecha: participant.fecha,
            uuid: participant.uuid
        });
        return state.push(newParticipant);
    case contants.DELETE_PARTICIPANT:
        return state.delete(action.index);
    case contants.CLEAR_PARTICIPANTS:
        return state.clear();
    case contants.FILTER_USER_BANCO:
        return state;
    default:
        return state;
    }
}
