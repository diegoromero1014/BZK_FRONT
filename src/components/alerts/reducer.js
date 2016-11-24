/**
 * Created by user- on 11/22/2016.
 */
import Immutable from 'immutable';
import * as actions from './constants';

const initialState = Immutable.Map(
    {
        listAlertByUser: Immutable.List(
            [
                {
                codeAlert: "pending_update_client",
                nameAlert: "Clientes pendientes de actualización",
                countClientByAlert: 109,
                }
            ]
        )
});

export default (state = initialState, action) => {
    switch (action.type) {
        case actions.GET_ALERT_BY_USER:
            const response = action.payload.data;
            console.log("response",response);
            // return state.withMutations(map => {
            //     map
            //         .set('status', 'processed')
            //         .set('countClients', response.countClients)
            //         .set('responseClients', response.listClients === undefined ? [] : JSON.parse(response.listClients));
            // });
            return state;
        default:
            return state;
    }
}
