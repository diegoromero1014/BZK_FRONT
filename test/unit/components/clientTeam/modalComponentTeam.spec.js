import React from 'react';
import {ModalComponentTeam} from "../../../../src/components/clientTeam/modalComponentTeam";
import {Checkbox} from "semantic-ui-react";
import Immutable from "immutable";

const infoClient = Immutable.Map({seniorBankerId:1});
describe('Test modalComponentTeam', ()=>{

    let defaultProps;
    let showLoadingDispatch;
    let getClientTeamDispatch;
    let filterUsersBancoDispatch;
    let saveSeniorBankerDispatch;
    let user;


    beforeEach(() => {
        showLoadingDispatch = sinon.fake();
        const success = { payload: { data: { data: {  } } } };
        const successUsers =  { payload: { data: { data:[{description:'heurrea', cargo:'Banquero Senior', idUsuario:1}] } }};
        getClientTeamDispatch = sinon.stub();
        getClientTeamDispatch.resolves(success);
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves(successUsers);
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        user = {
          cargo:'Banquero Senior',
          idUsuario:1
        };


        defaultProps = {
            showLoadingDispatch,
            getClientTeamDispatch,
            filterUsersBancoDispatch,
            saveSeniorBankerDispatch,
            infoClient
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


    it('execute handledChangeCheck is check false', ()=>{
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, false);
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

    it('active seniorBanker check when baquero is equals', ()=>{
       const success =  {data:{ payload: { data: { data:{user:[]} } } } };
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves(success);
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);

    });

    it('execute handledChangeCheck is check false', ()=>{
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, false);
    });

});