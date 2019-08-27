import React from 'react';
import {ReportsCardsComponent} from '../../../../src/components/transactional/ReportsCardsComponent';
import ModalComponent from '../../../../src/components/transactional/ModalComponent';
import { Icon, Button } from 'semantic-ui-react';

const defaultProps = {
    title: "title test",
    description: "description test",
    type: "frame",
    url: "https://www.google.com/"
};

describe('Test ReportsCardsComponent', () => {
    it('Should render ReportsCardsComponent', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        expect(wrapper).to.have.length(1);
    });

    it('Should render Modal', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        wrapper.instance().handleOpenModal();
        
        expect(wrapper.contains(
            <ModalComponent
                closeModal={wrapper.instance().handleCloseModal}
                url={wrapper.instance().props.url}
                title={wrapper.instance().props.title}
            />
        )).to.equal(true);
    });

    it('Should render Button', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        expect(wrapper.find(Button).find({ name: 'btn' })).to.have.length(1);
    });

    it('Should render Icon', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        expect(wrapper.find(Icon).find({ name: 'file archive outline' })).to.have.length(1);
    });

    it(' Should change state OPENED TRUE', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        wrapper.instance().handleOpenModal();

        expect(wrapper.state().OPENED).to.equal(true);
    });

    it(' Should change state OPENED FALSE', () => {
        const wrapper = shallow(<ReportsCardsComponent {...defaultProps} />);
        wrapper.instance().handleCloseModal();
        
        expect(wrapper.state().OPENED).to.equal(false);
    });
})