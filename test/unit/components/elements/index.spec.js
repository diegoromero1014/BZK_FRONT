import React from 'react';
import { ElementsComponent } from '../../../../src/components/elements';
import { shallow } from 'enzyme';

let defaultProps;
let dispatchCreateList;
let dispatchRemoveFromList;
let setValues;
let dispatchSetToShow;
let handleSubmit;
let resetForm;
let dispatchSwtShowMessage;

describe('ElementsComponent Test', () => {

    beforeEach(() => {
        dispatchCreateList = sinon.fake();
        dispatchRemoveFromList = sinon.fake();
        setValues = sinon.fake();
        dispatchSetToShow = sinon.fake();
        handleSubmit = spy(sinon.fake());
        dispatchSetToShow = spy(sinon.fake());
        resetForm = spy(sinon.fake());
        dispatchSwtShowMessage = sinon.fake();

        defaultProps = {
            dispatchCreateList,
            values: { objectEdited: true },
            elementsReducer: {},
            dispatchRemoveFromList,
            setValues,
            max: 0,
            handleSubmit,
            isValid: false,
            dispatchSetToShow,
            resetForm,
            isEditable: true,
            name: 'any',
            dispatchSwtShowMessage
        }
    });

    it('Should render ElementsComponent', () => {
        itRenders(<ElementsComponent {...defaultProps} />)
    })

    it('When call handleOnDelete', () => {
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        const data = { id: 0, text: 'Any text' };
        wrapper.instance().handleOnDelete(data);
        sinon.assert.calledOnce(dispatchSwtShowMessage);
    })

    it('When call handleOnEdit ', () => {
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        const data = {
            id: 0, text: 'Any text'
        }
        wrapper.instance().handleOnEdit(data);
    })

    it('When elementsReduces has data', () => {
        defaultProps.elementsReducer = {
            'any': {
                elements: []
            }
        };
        defaultProps.name = 'any';
        const wrapper = mount(<ElementsComponent {...defaultProps} />);
        expect(wrapper.props().name).to.equal('any');
    })

    it('When onclick on icon', () => {
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.find('.icon-message-elements').simulate('click');
    })

    it('When onclick on icon 2', () => {
        defaultProps.elementsReducer = {
            'any': {
                elements: []
            }
        };
        defaultProps.isEditable = true;
        defaultProps.max = 10;
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.find('.icon-message-elements').simulate('click');
        expect(dispatchSetToShow).to.have.been.called.exactly(1);
    })

    it('When onclick on button submit', () => {
        defaultProps.isValid = true;
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.setState({ show: true });
        wrapper.find('.button-primary').simulate('click', { preventDefault: sinon.fake()});
        expect(handleSubmit).to.have.been.called.exactly(1);
    })

    it('When onclick on button submit', () => {
        defaultProps.isValid = false;
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.setState({ show: true });
        wrapper.find('.button-primary').simulate('click', { preventDefault: sinon.fake()});
        expect(handleSubmit).to.have.been.called.exactly(1);
    })

    it('When objectEdited: false', () => {
        defaultProps.values = { objectEdited: false };
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.setState({ show: true });
        expect(wrapper.find('.button-primary').text()).to.equal('Agregar');
    })

    it('When objectEdited: true', () => {
        defaultProps.values = { objectEdited: true };
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.setState({ show: true });
        expect(wrapper.find('.button-primary').text()).to.equal('Modificar');
    })

    it('When onclick on button reset', () => {
        defaultProps.isValid = false;
        const wrapper = shallow(<ElementsComponent {...defaultProps} />);
        wrapper.setState({ show: true });
        wrapper.find('.button-secondary').simulate('click');
        expect(dispatchSetToShow).to.have.been.called.exactly(1);
        expect(resetForm).to.have.been.called.exactly(1);
    })

})