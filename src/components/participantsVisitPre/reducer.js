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
                uuid: participant.uuid,
                order: getNextValue(state, participant.tipoParticipante)
            });
            return state.push(newParticipant);
        case contants.DELETE_PARTICIPANT:
            const orderDelete = state.get(action.index).order;
            const stateOrdered = state.delete(action.index);
            
            state.map(item => {
                if (item.order > orderDelete && item.tipoParticipante == action.tab) {
                    return _.set(item, 'order', item.order - 1);
                }
            });

            return stateOrdered;
        case contants.CLEAR_PARTICIPANTS:
            return state.clear();
        case contants.FILTER_USER_BANCO:
            return state;
        case contants.ADD_LIST_PARTICIPANT:
            return Immutable.List(action.listParticipant);
        default:
            return state;
    }
}


function getNextValue(listParticipants, participantType) {
    let nextOrderParticipant = 1;
    const arrayListParticipants = listParticipants.toArray();
    if (listParticipants.size > 0) {
        const list = _.filter(arrayListParticipants, (item) => {
            return _.isEqual(item.tipoParticipante, participantType)
        });
        if (_.size(list) > 0) {
            const participantLast = _.chain(list)
                .orderBy('order', 'asc')
                .last()
                .value();
            nextOrderParticipant = _.isNull(participantLast) || _.isUndefined(participantLast) ? 0 : participantLast.order + 1;
        }
    }
    return nextOrderParticipant;
}