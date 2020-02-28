import React from 'react';
import SectionClientObjectives from '../../../../src/components/clientDetailsInfo/sectionClientObjectives';
import { shallow } from 'enzyme';

let defaultProps = {
    infoClient: {
        clientDetailsRequest: {
            objectives: [{ text: 'Any text', relations: [{ clientDetailRelation: { text: 'Any text' } }]}]
        }
    }
}

describe('SectionClientObjectives Test', () => {

    it('Should render SectionClientObjectives', () => {
        itRenders(<SectionClientObjectives {...defaultProps}/>)
    })

    it('When infoClient is null', () => {
        defaultProps.infoClient = null;
        itRenders(<SectionClientObjectives {...defaultProps}/>)
    })

    it('When Objetives has information', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [{ text: 'Any text', relations: [{ clientDetailRelation: { text: 'Any text' } }] }] }}
        itRenders(<SectionClientObjectives {...defaultProps}/>);
    })

    it('Should render one element when there is one objective', () => {
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.row-element-parent')).to.have.length(1);
    })

    it('Shouldn´t render one element when there is no objective', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [] }}
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.row-element-parent')).to.have.length(0);
    })
    
    it('Should render one element when there is one relation', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [{ text: 'Any text', children: [ { text: 'Any text' }] }] }};
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.row-element-child')).to.have.length(1);
    })

    it('Should render message when there is no relation', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [] }}
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.row-no-element-parent')).to.have.length(1);
    })

    it('Should render message when there is no objective', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [{ text: 'Any text', relations: [] }] }}
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.row-no-element-child')).to.have.length(1);
    })
    
    it('Shouldn´t render one element when there is no relation', () => {
        defaultProps.infoClient = { clientDetailsRequest: { objectives: [] }}
        const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
        expect(wrapper.find('.section-list-divider')).to.have.length(0);
    })
})