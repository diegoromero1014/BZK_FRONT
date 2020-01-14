import React from 'react';
import SectionClientObjectives from '../../../../src/components/clientDetailsInfo/sectionClientObjectives';
import { shallow } from 'enzyme';

let defaultProps = {
    infoClient: {
        clientDetailsRequest: {
            objetives: [{}]
        }
    }
}

describe('SectionClientObjectives Test', () => {

    const wrapper = shallow(<SectionClientObjectives {...defaultProps}/>);
    wrapper.setState({ objectives: [{ text: 'Any text', relations: [{ clientDetailRelation: { text: 'Any text' } }]}]});

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
        expect(wrapper.find('.row-element-parent')).to.have.length(1);
    })

    it('Shouldn´t render one element when there is no objective', () => {
        wrapper.setState({ objectives: []});
        expect(wrapper.find('.row-element-parent')).to.have.length(0);
    })
    
    it('Should render one element when there is one relation', () => {
        wrapper.setState({ objectives: [{ text: 'Any text', relations: [{ clientDetailRelation: { text: 'Any text' } }]}]});
        expect(wrapper.find('.row-element-child')).to.have.length(1);
    })
    
    it('Shouldn´t render one element when there is no relation', () => {
        wrapper.setState({ objectives: []});
        expect(wrapper.find('.section-list-divider')).to.have.length(0);
    })
})