import React from 'react';
import ModalComponent from '../../../../src/components/transactional/ModalComponent';
import Modal from "react-modal";

let count = 0;

const closeModal = () => {
    count++;
};

const url = 'https://www.google.com/';
const title = "test title";

const defaultProps = { closeModal, url, title };

describe('Test ModalComponent', () => {
    it('should render ModalComponent', () => {
        const wrapper = shallow(<ModalComponent {...defaultProps} />);
        expect(wrapper.find(Modal).find({name: 'modal'})).to.have.length(1);
    });

    it('should render ModalComponent contain iframe', () => {
        const wrapper = shallow(<ModalComponent {...defaultProps} />);
        expect(wrapper.contains(<iframe name="Modalframe" className="Modalframe" style={{ width: "100%", border: "0", flexGrow: "1" }} src={url} />)).to.equal(true);
    });

    it('should render ModalComponent button close', () => {
        const wrapper = shallow(<ModalComponent {...defaultProps} />);
        expect(wrapper.find('.close')).to.have.length(1);
    });

    it('should render ModalComponent class Modalframe', () => {
        const wrapper = shallow(<ModalComponent {...defaultProps} />);
        expect(wrapper.find('.Modalframe')).to.have.length(1);
    });

     it('should close ModalComponent', () => {
        const wrapper = shallow(<ModalComponent {...defaultProps} />);
        wrapper.instance().props.closeModal();

        expect(count).to.equal(1);
    }); 
})