import React from 'react';
import {ModalComponentTeam} from "../../../../src/components/clientTeam/modalComponentTeam";
import {Checkbox} from "semantic-ui-react";

describe('Test modalComponentTeam', ()=>{

    let defaultProps;
    let showLoadingDispatch;
    let getClientTeam;
    let filterUsersBancoDispatch;
    let saveSeniorBankerDispatch;
    let user;


    beforeEach(() => {
        showLoadingDispatch = sinon.fake();
        const success = { payload: { data: { data: {  } } } };
        getClientTeam = sinon.stub();
        getClientTeam.resolves(success);
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves("");
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        user = {
          cargo:'Banquero Senior'
        };

        defaultProps = {
            showLoadingDispatch,
            getClientTeam,
            filterUsersBancoDispatch,
            saveSeniorBankerDispatch,
            user
        }
    });


    it('should render check senior banker', ()=>{
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.find(Checkbox).find({id:"checkbox-banquero"});
    });

    it('execute handledChangeCheck', ()=>{
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('execute handledChangeCheck when status 200', ()=>{
        const success = {data:{ payload: { data: { status: 200 } } } };
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('execute handledChangeCheck when status 500', ()=>{
        const success = {data:{ payload: { data: { status: 500 } } } };
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

});