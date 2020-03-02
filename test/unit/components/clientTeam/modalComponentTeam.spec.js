import React from 'react';
import {ModalComponentTeam} from "../../../../src/components/clientTeam/modalComponentTeam";
import {Checkbox} from "semantic-ui-react";

describe('Test modalComponentTeam', ()=>{

    let defaultProps;
    let showLoadingDispatch;
    let getClientTeam;
    let filterUsersBancoDispatch;
    let saveSeniorBankerDispatch;


    beforeEach(() => {
        showLoadingDispatch = sinon.fake();
        const success = { payload: { data: { data: {  } } } };
        getClientTeam = sinon.stub();
        getClientTeam.resolves(success);
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves("");
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves("");

        defaultProps = {
            showLoadingDispatch,
            getClientTeam,
            filterUsersBancoDispatch,
            saveSeniorBankerDispatch,
        }
    });


    it('should render check senior banker', ()=>{
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.find(Checkbox).find({id:"checkbox-banquero"});
    });

});