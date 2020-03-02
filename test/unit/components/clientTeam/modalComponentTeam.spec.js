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
    let stubLocalStorage;


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
        stubLocalStorage = sinon.stub(window.localStorage, 'getItem').returns("icherrer");
        user = {
          cargo:'Banquero Senior',
          idUsuario:1
        };


        defaultProps = {
            showLoadingDispatch,
            getClientTeamDispatch,
            filterUsersBancoDispatch,
            saveSeniorBankerDispatch,
            infoClient,
            stubLocalStorage,
            user
        }
    });

    afterEach(function () {
        // runs after each test in this block
        stubLocalStorage.restore();
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
        const success = { payload: { data: { status: 200 } } } ;
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        defaultProps.saveSeniorBankerDispatch = saveSeniorBankerDispatch;
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('execute handledChangeCheck when validateLogin true', ()=>{
        const success = { payload: { data: { validateLogin: true } } } ;
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        defaultProps.saveSeniorBankerDispatch = saveSeniorBankerDispatch;
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('execute handledChangeCheck when validateLogin false', ()=>{
        const success = { payload: { data: { validateLogin: false } } } ;
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        defaultProps.saveSeniorBankerDispatch = saveSeniorBankerDispatch;
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('execute handledChangeCheck when status 500', ()=>{
        const success = { payload: { data: { status: 500 } }  };
        saveSeniorBankerDispatch = sinon.stub();
        saveSeniorBankerDispatch.resolves(success);
        defaultProps.saveSeniorBankerDispatch = saveSeniorBankerDispatch;
        const wrapper = shallow(<ModalComponentTeam {...defaultProps}/>);
        wrapper.instance().user = user;
        wrapper.instance().handledChangeCheck(()=>{}, true);
    });

    it('active seniorBanker check when baquero is equals', ()=>{
       const success =  { payload: { data: { data:{user:[]} } } };
        const infoClient = Immutable.Map({seniorBankerId:null});
        filterUsersBancoDispatch = sinon.stub();
        filterUsersBancoDispatch.resolves(success);
        defaultProps.saveSeniorBankerDispatch = filterUsersBancoDispatch;
        defaultProps.infoClient = infoClient;
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