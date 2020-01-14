import React from 'react';
import SectionOpportunitiesWeaknesses from '../../../../src/components/opportunitiesWeaknesses/SectionOpportunitiesWeaknesses';

const defaultProps = {
    infoClient: {
        clientDetailsRequest: {
            weaknesses: [{}],
            opportunities: [{}]
        }
    },
    visual: null
}

describe('SectionOpportunitiesWeaknesses Test', () => {
    
    it('Should render SectionOpportunitiesWeaknesses', () => {
        itRenders(<SectionOpportunitiesWeaknesses {...defaultProps}/>)
    })

    it('When infoClient is null', () => {
        defaultProps.infoClient = null;
        itRenders(<SectionOpportunitiesWeaknesses {...defaultProps}/>)
    })

    it('When infoClient has information', () => {
        defaultProps.infoClient = { clientDetailsRequest: { 
            opportunities: [{ text: 'Any text' }],
            weaknesses: [{ text: 'Any text' }] 
        }}
        itRenders(<SectionOpportunitiesWeaknesses {...defaultProps}/>);
    })

    it('Should render title when visual is true', () => {
        defaultProps.visual = true;
        const wrapper = shallow(<SectionOpportunitiesWeaknesses {...defaultProps}/>);-
        expect(wrapper.find('.title-section')).to.have.length(1);
    })

    it('Shouldn´t render title when visual is false', () => {
        defaultProps.visual = false;
        const wrapper = shallow(<SectionOpportunitiesWeaknesses {...defaultProps}/>);
        expect(wrapper.find('.title-section')).to.have.length(0);
    })

    it('Should render ListaObjetos (opportunities)', () => {
        const wrapper = shallow(<SectionOpportunitiesWeaknesses {...defaultProps}/>);
        expect(wrapper.find('.list-objects-opportunities')).to.have.length(1);
    })

    it('Should render ListaObjetos (weaknesses)', () => {
        const wrapper = shallow(<SectionOpportunitiesWeaknesses {...defaultProps}/>);
        expect(wrapper.find('.list-objects-weaknesses')).to.have.length(1);
    })
})