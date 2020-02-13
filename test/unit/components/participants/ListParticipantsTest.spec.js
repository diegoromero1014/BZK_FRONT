import React from 'react';
import { ListParticipants } from '../../../../src/components/participants/ListParticipants';
import { shallow } from 'enzyme';
import CardComponent from '../../../../src/components/cards';

let defaultProps;
let dispatchDeleteParticipant;

describe('ListParticipants Test', () => {

    beforeEach(() => {
        dispatchDeleteParticipant = sinon.fake();
        defaultProps = {
            data: [{ cargo: 'any', empresa: 'any'}],
            type: '',
            dispatchDeleteParticipant,
            disabled: false
        }
    })

    it('Should render', () => {
        itRenders(<ListParticipants {...defaultProps}/>)
    })

    it('When data is not empty', () => {
        itRenders(<ListParticipants {...defaultProps}/>)
    })

    it('When handleOnClick is instanced', () => {
        const wrapper = shallow(<ListParticipants {...defaultProps}/>);
        wrapper.instance().handleOnClick();
        expect(wrapper.state().open).to.equal(true);
    })

    it('When handleDelete is instanced and type is null', () => {
        const wrapper = shallow(<ListParticipants {...defaultProps}/>);
        wrapper.instance().handleDelete();
        sinon.assert.notCalled(dispatchDeleteParticipant);
    })

    it('When handleDelete is instanced and type is other', () => {
        defaultProps.type = 'other';
        const wrapper = shallow(<ListParticipants {...defaultProps}/>);
        wrapper.instance().handleDelete();
        sinon.assert.calledOnce(dispatchDeleteParticipant);
    })

    it('When handleDelete is instanced and type is banco', () => {
        defaultProps.type = 'banco';
        const wrapper = shallow(<ListParticipants {...defaultProps}/>);
        wrapper.setState({ record: { idParticpante: 1 }})
        wrapper.instance().handleDelete();
        sinon.assert.calledOnce(dispatchDeleteParticipant);
    })

    it('Should render CardCompoent', () => {
        defaultProps.disabled = true;
        const wrapper = shallow(<ListParticipants {...defaultProps}/>);
        expect(wrapper.find(CardComponent)).to.have.length(1)
    })
})