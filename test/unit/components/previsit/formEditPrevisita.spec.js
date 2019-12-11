import React from 'react';
import Immutable from 'immutable';
import {FormEditPrevisita} from './../../../../src/components/previsita/editPrevisit/formEditPrevisita';

describe('Test formEditPrevisita', () => {
    let createPrevisit;
    let defaultProps;
    let nonValidateEnter;
    let getMasterDataFields;
    let id = 0;
    let showLoading;
    let changeOwnerDraftPrevisit;
    let setConfidential;
    let addUsers;
    let responseClientInfo;
    let detailPrevisit;
    let selectsReducer;
    let handleSubmit;
    let reducerGlobal;
    let previsitReducer;
    let clientInformacion;
    let addListParticipant;
    let viewBottons = true;
    let validateEnter = true;
    let permissionsPrevisits = "Editar";
    let ownerDraft = true;
    let previsitType = "";
    let detailPrevisitResponse = {
        payload:{
            data:{
                data:{}
            }
        }, 
        data: {
            createdByName: "",
            updatedByName: "",
            positionCreatedBy: "",
            positionUpdatedBy: "",
            updatedTimestamp: "",
            createdTimestamp: ""
        }
    }
    beforeEach(() => {
        addListParticipant = sinon.fake();
        responseClientInfo = sinon.stub().resolves("");
        detailPrevisit =  sinon.stub().resolves(detailPrevisitResponse);
        selectsReducer = Immutable.Map({ previsitType });
        handleSubmit = sinon.fake();
        reducerGlobal = Immutable.Map({ validateEnter, permissionsPrevisits});
        previsitReducer = Immutable.Map({ detailPrevisit: detailPrevisitResponse , ownerDraft});
        clientInformacion = Immutable.Map({ responseClientInfo });
        nonValidateEnter = sinon.fake();
        getMasterDataFields = sinon.fake();
        showLoading = sinon.fake();
        changeOwnerDraftPrevisit = sinon.fake();
        setConfidential = sinon.fake();
        addUsers = sinon.fake();
        createPrevisit = sinon.stub().resolves("");
        defaultProps = {addListParticipant, createPrevisit, nonValidateEnter, getMasterDataFields, id, detailPrevisit, showLoading,
            changeOwnerDraftPrevisit, setConfidential, addUsers, previsitReducer, responseClientInfo, selectsReducer, handleSubmit, reducerGlobal, previsitReducer, viewBottons, clientInformacion}
    });
    it('should render formEditPrevisita', () => {
        itRenders(<FormEditPrevisita {...defaultProps}/>);
    })
    it('should submit previsit creation', () => {
        let response = {payload:{data:{data:{}}, status:200}}
        let swtShowMessage = sinon.fake();
        let participants = Immutable.List.of(
          { tipoParticipante: "banco", idParticipante: 123, order: 1 },
          { tipoParticipante: "client", idParticipante: 1234, order: 2 },
          { tipoParticipante: "other", nombreParticipante:"john doe",cargo:"abogado",empresa:"firma de abogados",idParticipante: 123345, order: 3 }
        )
        let confidentialReducer = Immutable.Map({ confidential :true});
        let usersPermission = Immutable.List.of({permiso:""});
        let validateDatePreVisit = sinon.stub().resolves(response);
        const wrapper = shallow(<FormEditPrevisita {...defaultProps} swtShowMessage={swtShowMessage} validateDatePreVisit={validateDatePreVisit} participants = {participants} usersPermission={usersPermission} confidentialReducer={confidentialReducer}/>);
        wrapper.setState({
            typePreVisit: "a",
            typePreVisitError: null,
            datePreVisit: "2019-12-09",
            datePreVisitError: null,
            lugarPrevisit: "a",
            lugarPrevisitError: false,
            durationPreVisit: 12,
            durationPreVisitError: null,
            targetPrevisit: "a",
            targetPrevisitError: null,
            clientTeach: "a",
            clientTeachTouch: false,
            adaptMessage: "a",
            adaptMessageTouch: false,
            clientTeachError: "a",
            adaptMessageError: null,
            controlConversation: "a",
            controlConversationTouch: false,
            controlConversationError: null,
            constructiveTension: "a",
            constructiveTensionTouch: false,
            constructiveTensionError: null
        })
        wrapper.instance()._submitCreatePrevisita();
        expect(validateDatePreVisit.callCount).to.equals(1);
    })
})