import React from 'react';

import { Challenger } from '../../../../src/components/challenger/challenger';
import { Field } from 'formik';

let defaultProps = {
    isEsditable: true,
    questions: [],
    getAllQuestions: () => {}
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
});