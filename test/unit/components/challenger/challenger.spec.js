import React from 'react';

import { Challenger } from '../../../../src/components/challenger/challenger';
import { Field } from 'formik';

let defaultProps = {
    isEsditable: true,
    questions: [],
    dispatchGetAllQuestions: sinon.fake(),
    dispatchAddAnswer: spy(sinon.fake()),
    setFieldValue: sinon.fake(),
    setFieldTouched: sinon.fake(),
    answers: []
}

describe('Test challenger/challenger', () => {

    it('It shouldn´t render nothing.', () => {
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find('div[name="mainContainer"]')).to.have.length(0);
    });

    it('It should render once the main container.', () => {
        defaultProps.questions = [{ field: 'field' }]
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find('div[name="mainContainer"]')).to.have.length(1);
    });

    it('It should render a title.', () => {
        defaultProps.questions = [{ field: 'field' }]
        const { questions } = defaultProps;
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find('div[name="title'+ questions[0].field +'"]')).to.have.length(1);
    });

    it('It shouldn´t render a subtitle.', () => {
        defaultProps.questions = [{ field: 'field', subtitle: '' }]
        const { questions } = defaultProps;
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find('span[name="subtitle'+ questions[0].field +'"]')).to.have.length(0);
    });

    it('It should render a subtitle.', () => {
        defaultProps.questions = [{ field: 'field', subtitle: 'Any subttile' }]
        const { questions } = defaultProps;
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find('span[name="subtitle'+ questions[0].field +'"]')).to.have.length(1);
    });

    it('It should render a Field.', () => {
        const wrapper = shallow(<Challenger {...defaultProps} />);
        expect(wrapper.find(<Field/>));
    });

    it('selectedTabActive should setter Class-Style to the element.', () => {
        defaultProps.questions = [{ field: 'field' }];        
        const wrapper = shallow(<Challenger {...defaultProps} />);  
        wrapper.instance().selectedTabActive = spy(sinon.fake());      
        wrapper.update();
        wrapper.find('a[name="field"]').simulate('click');        
        expect(wrapper.find('div[name="field"]')).to.have.length(1);
        expect(wrapper.instance().selectedTabActive).to.have.been.called.once;
    });

    it('onChange shouldn´t change the value.', () => {
        defaultProps.questions = [{ field: 'field' }];
        const wrapper = shallow(<Challenger {...defaultProps} />);
        wrapper.instance().onChange('', 'field', 0);        
        expect(defaultProps.dispatchAddAnswer).not.to.have.been.called;
    });
    
    it('onChange should change the value.', () => {
        defaultProps.questions = [{ field: 'field' }];
        const wrapper = shallow(<Challenger {...defaultProps} />);
        wrapper.instance().onChange('hola', 'field', 0);        
        expect(defaultProps.dispatchAddAnswer).to.have.been.called.once;
    });

    it('getValue should get the value.', () => {
        defaultProps.questions = [{ field: 'field' }];
        defaultProps.answers = [{ id: '', field: 'any value'}];
        const wrapper = shallow(<Challenger {...defaultProps} />);
        const result = wrapper.instance().getValue('field');
        expect(result).equal('any value');
    });

    it('getValue shouldn´t get the value.', () => {
        defaultProps.questions = [{ field: 'field' }];
        defaultProps.answers = [{ id: '', field: ''}];
        const wrapper = shallow(<Challenger {...defaultProps} />);
        const result = wrapper.instance().getValue('field');
        expect(result).equal('');
    });
    
    it('renderError should render the errors.', () => {
        defaultProps.questions = [{ field: 'field' }];
        defaultProps.answers = [{ id: '', field: ''}];
        const wrapper = shallow(<Challenger {...defaultProps} />);
        const err = { field: 'any error' };
        const result = wrapper.instance().renderError(err, 'field');
        
        const expectValue = (<div name={`error-field`} style={{ marginTop: 10 }}>
            <div className="ui pointing red basic label"> {err['field']} </div>
        </div>);
        
        expect(result.props.name).equal(expectValue.props.name);
    });
});