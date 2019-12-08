import React from 'react';
import {ModalObservation}
    from "../../../../../../src/components/myPendings/linkingRequests/observations/modalObservation";
import Immutable from "immutable";

const linkRequestsReducer = Immutable.Map({observationsByLinkingRequests:[]});
describe("Test ModalObservationLinkRequest", ()=>{

    let defaultProps;
    let clearListObservations;
    let changeStateSaveData;
    let getListObservactionsByIdLink;

    beforeEach(() => {

        clearListObservations = sinon.fake();
        changeStateSaveData = sinon.fake();
        getListObservactionsByIdLink = sinon.stub();
        getListObservactionsByIdLink.resolves("");

        defaultProps = {
            clearListObservations,
            linkRequestsReducer,
            changeStateSaveData,
            getListObservactionsByIdLink,
            client:{
                typeOfDocument:"1",
                documentClient:"1",
                nameClient:"dj",
                statusLinkRequest:"1"
            }
        }
    });

    it('Should render ModalObservationLinkRequest', ()=>{
        itRenders(<ModalObservation {...defaultProps}/>);
    });

    it("Should execute _validatewhiteList", ()=>{
        const wrapper = shallow(
            <ModalObservation {...defaultProps}/>
        );

        wrapper.instance()._validatewhiteList();

    });
});