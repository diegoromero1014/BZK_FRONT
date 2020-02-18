import React from 'react';
import Immutable from 'immutable';
import { OtherParticipants } from '../../../../src/components/participants/otherParticipants';

let defaultProps;
let participants;
let handleSubmit;

describe('OtherParticipants Test', () => {
    
    beforeEach(() => {
        participants = Immutable.List();
        handleSubmit = sinon.fake();
        defaultProps = {
            participants,
            handleSubmit,
            limit: 0,
            disabled: false
        }
    })

    it('Should render when participants is empty', () => {
        itRenders(<OtherParticipants {...defaultProps}/>)
    })

    it('Should render when participants is not empty', () => {
        defaultProps.participants = Immutable.List([
            { tipoParticipante: 'other' }
        ])
        itRenders(<OtherParticipants {...defaultProps}/>)
    })

    it('When onClick in Icon "btnAgregar"', () => {
        const wrapper = shallow(<OtherParticipants {...defaultProps}/>);
        wrapper.find('.btnAgregar').simulate('click', { preventDefault: sinon.fake()});
        sinon.assert.notCalled(handleSubmit);
    })
    
    it('When onClick in Icon "btnAgregar" and limit is 1 ', () => {
        defaultProps.limit = 1;
        const wrapper = shallow(<OtherParticipants {...defaultProps}/>);
        wrapper.find('.btnAgregar').simulate('click', { preventDefault: sinon.fake()});
        sinon.assert.calledOnce(handleSubmit);
    })

    it('When onClick in Icon "btnAgregar" and limit is 1 and disabled is true', () => {
        defaultProps.limit = 1;
        defaultProps.disabled = true;
        const wrapper = shallow(<OtherParticipants {...defaultProps}/>);
        wrapper.find('.btnAgregar').simulate('click', { preventDefault: sinon.fake()});
        sinon.assert.notCalled(handleSubmit);
    })
})