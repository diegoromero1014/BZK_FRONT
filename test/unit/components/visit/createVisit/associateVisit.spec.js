import React from 'react';
import Immutable from 'immutable';
import ButtonAssociateComponent from '../../../../../src/components/visit/createVisit/associateVisit';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'
import Modal from 'react-modal';
import ToolTipComponent from '../../../../../src/components/toolTip/toolTipComponent';
import PaginationAssociateVisit from '../../../../../src/components/visit/createVisit/paginationAssociateVisit';

const middleWares = [thunk];
const mockStore = configureStore(middleWares);

const rowCountValue = 10;
const listVisit = [{
    "id": 5842757,
    "datePrevisit": "2019-04-20 08:21:06",
    "dateCreate": null,
    "createBy": null,
    "createdByPosition": null,
    "dateUpdate": null,
    "updateBy": null,
    "updatedByPosition": null,
    "objetive": "<p>ag</p>",
    "typePrevisit": "Seguimiento",
    "keyTypePrevisit": null,
    "statusDocument": "Guardado como definitivo",
    "idStatusDocument": 1,
    "description": null,
    "location": null,
    "dateReview": null,
    "listPrevisitContacts": null,
    "listPrevisitEmployees": null,
    "listPrevisitOtherParticipants": null,
    "clientTeach": null,
    "adaptMessage": null,
    "controlConversation": null,
    "constructiveTension": null,
    "commercialReport": null
}, {
    "id": 5842769,
    "datePrevisit": "2019-04-10 08:49:06",
    "dateCreate": null,
    "createBy": null,
    "createdByPosition": null,
    "dateUpdate": null,
    "updateBy": null,
    "updatedByPosition": null,
    "objetive": "<p>asdf</p>",
    "typePrevisit": "Seguimiento",
    "keyTypePrevisit": null,
    "statusDocument": "Guardado como definitivo",
    "idStatusDocument": 1,
    "description": null,
    "location": null,
    "dateReview": null,
    "listPrevisitContacts": null,
    "listPrevisitEmployees": null,
    "listPrevisitOtherParticipants": null,
    "clientTeach": null,
    "adaptMessage": null,
    "controlConversation": null,
    "constructiveTension": null,
    "commercialReport": {
        "id": 5842767,
        "isConfidential": true,
        "usersWithPermission": [{
            "id": 5842768,
            "commercialReport": 5842767,
            "user": {
                "id": 123,
                "username": "cmaya",
                "name": "Maya"
            }
        }],
        "status": 0
    }
}, {
    "id": 5842794,
    "datePrevisit": "2019-04-10 11:15:20",
    "dateCreate": null,
    "createBy": null,
    "createdByPosition": null,
    "dateUpdate": null,
    "updateBy": null,
    "updatedByPosition": null,
    "objetive": "<p>xvxfg</p>",
    "typePrevisit": "Seguimiento",
    "keyTypePrevisit": null,
    "statusDocument": "Guardado como definitivo",
    "idStatusDocument": 1,
    "description": null,
    "location": null,
    "dateReview": null,
    "listPrevisitContacts": null,
    "listPrevisitEmployees": null,
    "listPrevisitOtherParticipants": null,
    "clientTeach": null,
    "adaptMessage": null,
    "controlConversation": null,
    "constructiveTension": null,
    "commercialReport": {
        "id": 5842793,
        "isConfidential": false,
        "usersWithPermission": [],
        "status": 0
    }
}]
const page = 5;



describe('Test CreateVisit/AsociatePreVisit', () => {

    let store;
    beforeEach(() => {
        const previsitReducer = Immutable.Map({ rowCount: rowCountValue, previsitList: listVisit });
        const visitReducer = Immutable.Map({ pageAssociateVisit: page })
        store = mockStore({ previsitReducer, visitReducer });
    });


    it('should associateVisit list', () => {
        itRenders(<ButtonAssociateComponent store={store} />);
    })

    it('should render modal', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />).dive();
        expect(wrapper.find(Modal)).to.have.length(1);
    })

    it('should render PaginationAssociateVisit', () => {
        const wrapper = shallow(<ButtonAssociateComponent store={store} />).dive();
        expect(wrapper.find(PaginationAssociateVisit)).to.have.length(1);
    })

})