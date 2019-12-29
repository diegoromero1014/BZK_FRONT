import React from 'react';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import FormEditPrevisita from './../../../../src/components/previsita/editPrevisit/formEditPrevisita';

const middleWares = [thunk];
const mockStore = configureStore(middleWares);
const validateEnter = true;
const permissionsPrevisits = "Editar";
const ownerDraft = true;
const previsitType = "";
const detailPrevisit = {
    data:{
            createdByName:"",
            updatedByName:"",
            positionCreatedBy:"",
            positionUpdatedBy:"",
            updatedTimestamp:"",
            createdTimestamp:""

    }
}

describe('Test formEditPrevisita', () => {
    let store;
    beforeEach(() => {
        const selectsReducer = Immutable.Map({ previsitType });
        const handleSubmit = sinon.fake();
        const reducerGlobal = Immutable.Map({ validateEnter, permissionsPrevisits});
        const previsitReducer = Immutable.Map({ detailPrevisit , ownerDraft});
        const viewBottons = true;
        store = mockStore({ selectsReducer, handleSubmit, reducerGlobal, previsitReducer, viewBottons });
    });
    it('should render formEditPrevisita', () => {
        itRenders(<FormEditPrevisita store={store} />);
    })
})