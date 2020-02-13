import React from 'react';
import Immutable from 'immutable';
import { BankParticipants } from '../../../../src/components/participants/BankParticipants';
import { shallow } from 'enzyme';

let defaultProps;
let participants;
let dispatchSwtShowMessage;
let dispatchAddParticipant;
let dispatchFilterUsersBanco;

describe('BankParticipants Test', () => {
    
    beforeEach(() => {
        participants = Immutable.List();
        dispatchSwtShowMessage = sinon.fake();
        dispatchAddParticipant = sinon.fake();
        dispatchFilterUsersBanco = sinon.stub();
        dispatchFilterUsersBanco.resolves({
            payload: { data: { data: [{ title: 'a', cargo: 'a', empresa: 'a' }]}}
        })
        defaultProps = {
            participants,
            disabled: false,
            dispatchSwtShowMessage,
            dispatchAddParticipant,
            dispatchFilterUsersBanco,
        }
    })

    it('Should render when participants is empty', () => {
        itRenders(<BankParticipants {...defaultProps}/>);
    })

    it('Should render when participants is not empty', () => {
        defaultProps.participants = Immutable.List([
            { tipoParticipante: 'banco' }
        ])
        itRenders(<BankParticipants {...defaultProps}/>)
    })

    it('Should render when participants is not empty and disabled is true', () => {
        defaultProps.disabled = true;
        defaultProps.participants = Immutable.List([
            { tipoParticipante: 'banco' }
        ])
        itRenders(<BankParticipants {...defaultProps}/>)
    })

    it('When addBankParticipant is instanced', () => {
        const wrapper = shallow(<BankParticipants {...defaultProps}/>);
        wrapper.instance().addBankParticipant({ name: '', idUsuario: null, cargo: '', empresa: ''});
        sinon.assert.calledOnce(dispatchSwtShowMessage);
    })

    it('When addBankParticipant is instanced and idUsuario is not null', () => {
        defaultProps.participants = Immutable.List([
            { tipoParticipante: 'banco', idUsuario: 1 }
        ])
        const wrapper = shallow(<BankParticipants {...defaultProps}/>);
        wrapper.instance().addBankParticipant({ name: '', idUsuario: 1, cargo: '', empresa: ''});
        sinon.assert.calledOnce(dispatchAddParticipant);
    })

    it('When updateKeyValue is instanced', () => {
        const wrapper = shallow(<BankParticipants {...defaultProps}/>);
        wrapper.instance().updateKeyValue({});
    })

    it('When updateKeyValue is instanced and keyCode is 13', () => {
        const wrapper = shallow(<BankParticipants {...defaultProps}/>);
        wrapper.instance().updateKeyValue({ keyCode: 13, which: 13, preventDefault: sinon.fake() });
    })

    it('When updateKeyValue is instanced and keyCode is 13 and selectedRecord is not empty', () => {
        const wrapper = shallow(<BankParticipants {...defaultProps}/>);
        wrapper.setState({ selectedRecord: [{ }, { }, { }] })
        wrapper.instance().updateKeyValue({ keyCode: 13, which: 13, preventDefault: sinon.fake() });
        sinon.assert.calledOnce(dispatchFilterUsersBanco);
    })
})